import {z} from 'zod';
import {useEffect,useRef,useState} from 'react';
import {edition, type Domain, type Form,type Result} from './engine';
const key='aether:d3050183-9084-4f3d-bd55-2bb1c1f94095:records';
const text=z.string().max(1800),num=z.number().finite(),row=z.object({period:num,opening:num,interest:num,amort:num,pay:num,closing:num});
const result=z.object({kind:text,total:num.nullable(),principal:num.nullable(),interest:num.nullable(),fees:num.nullable(),steps:z.array(text),warning:text,rows:z.array(row).max(360),ibs:z.null(),cbs:z.null(),credit:z.null()});
const schema=z.object({id:text,lineage:text,revision:z.number().int().positive(),domain:z.enum(['Banco','Consórcio']),date:text,form:z.record(z.string(),text),state:z.enum(['Rascunho','Concluída']),result:result.nullable(),edition:z.object({app:text,params:text,motor:text})});
const testSchema=z.object({id:text,time:text,code:text,expected:text,found:text,pass:z.boolean(),person:text,app:text});
const valSchema=z.object({id:text,time:text,system:text,metric:text,ref:num,internal:num,tol:num,label:text,difference:num,percent:num.nullable(),evidence:text,person:text,version:text});
const dbSchema=z.object({schema:z.literal(1),scenarios:z.array(schema),tests:z.array(testSchema),validations:z.array(valSchema)});
export type Snapshot=z.infer<typeof schema>;export type Run=z.infer<typeof testSchema>;export type Validation=z.infer<typeof valSchema>;export type Db=z.infer<typeof dbSchema>;
export const empty=():Db=>({schema:1,scenarios:[],tests:[],validations:[]});
export const uid=()=>crypto.randomUUID();
export function load():Db {const raw=localStorage.getItem(key);return raw===null?empty():dbSchema.parse(JSON.parse(raw))}
export const storageNotice='Salvo neste navegador. Os registros são visíveis a quem usa este perfil, não são compartilhados nem sincronizados e são removidos ao limpar os dados do navegador.';
export function snapshot(d:Domain,f:Form,state:Snapshot['state'],r:Result|null,parent:string,db:Db):Snapshot{const id=uid();const lineage=parent && db.scenarios.some(s=>s.lineage===parent) ? parent : id; const revision=1+db.scenarios.reduce((m,x)=>x.lineage===lineage?Math.max(m,x.revision):m,0);return {id,lineage,revision,domain:d,form:{...f},date:new Date().toISOString(),state,result:r,edition:{...edition}}}
function merge(a:Db,b:Db):Db{const byId=<T extends {id:string}>(x:T[],y:T[])=>[...new Map([...x,...y].map(v=>[v.id,v])).values()];return {schema:1,scenarios:byId(a.scenarios,b.scenarios),validations:byId(a.validations,b.validations),tests:byId(a.tests,b.tests)}}
// Saves are append-only. Queue only new records, never an old copy of the full history.
function additions(before:Db,after:Db):Db {
 const added=<T extends {id:string}>(a:T[],b:T[])=>{const existing=new Set(a.map(s=>s.id));return b.filter(s=>!existing.has(s.id))};
 return {schema:1,scenarios:added(before.scenarios,after.scenarios),tests:added(before.tests,after.tests),validations:added(before.validations,after.validations)};
}
type Removal = {status:'removed'|'changed'; db:Db} | {status:'failed'};
export function removeConfirmedStudy(lineage:string,confirmedIds:readonly string[],pending:Db,read=load,write=(db:Db)=>localStorage.setItem(key,JSON.stringify(db))):Removal {
 try {
  const fresh=merge(read(),pending), matches=fresh.scenarios.filter(x=>x.lineage===lineage), ids=new Set(confirmedIds);
  if(!lineage||!ids.size||matches.length!==ids.size||!matches.every(s=>ids.has(s.id))) return {status:'changed',db:fresh};
  const remaining:Db={...fresh,scenarios:fresh.scenarios.filter(x=>x.lineage!==lineage)};
  write(dbSchema.parse(remaining));return {status:'removed',db:remaining};
 } catch {return {status:'failed'}}
}
export function useRecords(){
 const [initial]=useState(()=>{try{return {db:load(),warn:''}}catch{return {db:empty(),warn:'Não foi possível ler os registros. Eles não serão sobrescritos.'}}});
 const [db,setDb]=useState(initial.db),[warning,setWarning]=useState(initial.warn);const pending=useRef<Db>(empty()),current=useRef(db);
 function show(next:Db){current.current=next;setDb(next)}
 function change(op:(fresh:Db)=>Db){let fresh:Db,readable=true;try{fresh=merge(load(),pending.current)}catch{fresh=current.current;readable=false}
  const next=dbSchema.parse(op(fresh));show(next);
  if(readable){try{localStorage.setItem(key,JSON.stringify(next));pending.current=empty();setWarning('');return true}catch{/* Retain only new records for a future save. */}}
  pending.current=merge(pending.current,additions(fresh,next));setWarning('Não foi possível salvar. Mantenha a página aberta e exporte a memória.');return false;
 }
 function removeStudy(lineage:string,ids:string[]){const result=removeConfirmedStudy(lineage,ids,pending.current);
  if(result.status==='failed'){setWarning('Exclusão não realizada. Não foi possível ler ou gravar o histórico neste navegador.');return false}
  show(result.db);
  if(result.status==='changed'){setWarning('O histórico mudou. Confira as versões atuais antes de tentar excluir.');return false}
  pending.current=empty();setWarning('');return true;
 }
 useEffect(()=>{function update(e:StorageEvent){if(e.key!==key&&e.key!==null)return;try{show(merge(load(),pending.current))}catch{setWarning('Registros inválidos. O conteúdo existente foi preservado.')}}window.addEventListener('storage',update);return()=>window.removeEventListener('storage',update)},[]);
 return {db,warning,change,removeStudy};
}
