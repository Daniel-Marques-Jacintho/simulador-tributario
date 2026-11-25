import {Landmark,Users,ClipboardCheck,Files,Layers,ArrowUpRight,Columns3,History, type LucideIcon} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Grid} from './review';
import {Badge} from './fields';
import {br,pend,type Domain} from './engine';
import type {Snapshot} from './records';

const shortcuts:[number,string,LucideIcon][]=[[1,'Simular Banco',Landmark],[2,'Simular Consórcio',Users],[3,'Comparar cenários',Columns3],[8,'Abrir histórico',History]];
const domains:Domain[]=['Banco','Consórcio'];
export function Overview({latest,go}:{latest:Snapshot[];go:(page:number)=>void}){
 const rows=domains.map(domain=>{
  const studies=latest.filter(s=>s.domain===domain),finished=studies.filter(s=>s.state==='Concluída'),priced=finished.filter(s=>s.result?.total!=null);
  return {domain,done:finished.length,drafts:studies.length-finished.length,total:studies.length,amount:priced.length?br(priced.reduce((sum,s)=>sum+(s.result?.total??0),0)):'Sem estimativa'};
 });
 const done=rows.reduce((sum,r)=>sum+r.done,0),ceiling=Math.max(1,...rows.map(r=>r.total));
 const metrics:[string,number,string,LucideIcon][]=[['Estudos concluídos',done,'Última versão de cada simulação',ClipboardCheck],['Rascunhos',latest.length-done,'Estudos ainda não concluídos',Files],['Total de estudos',latest.length,'Simulações distintas neste navegador',Layers]];
 return <div className="rf-overview">
  <div className="rf-metrics">{metrics.map(([label,value,detail,Icon])=><section key={label} className="rf-metric" aria-label={label}><div className="rf-metric-top"><h2>{label}</h2><Icon size={20} aria-hidden="true"/></div><div className="rf-metric-body"><strong>{value.toLocaleString('pt-BR')}</strong><span>{detail}</span></div></section>)}</div>
  <div className="rf-overview-row"><section className="rf-panel rf-shortcuts"><h2>Acesso rápido</h2><div className="rf-tiles">{shortcuts.map(([id,label,Icon])=><Button key={id} variant="outline" className="rf-tile" onClick={()=>go(id)}><Icon aria-hidden="true"/><span>{label}</span><ArrowUpRight aria-hidden="true"/></Button>)}</div></section>
  <section className="rf-panel rf-distribution"><h2>Estudos por domínio</h2><figure><figcaption>{latest.length?`Distribuição de ${latest.length} ${latest.length===1?'estudo salvo':'estudos salvos'}, pela última versão.`:'Nenhum estudo salvo neste navegador.'}</figcaption><div className="rf-legend" aria-hidden="true"><span>Concluídos</span><span>Rascunhos</span></div><div aria-hidden="true" className="rf-plots">{rows.map(r=><div key={r.domain} className="rf-plot"><span>{r.domain}</span><div className="rf-track"><i style={{width:`${100*r.done/ceiling}%`}}/><b style={{width:`${100*r.drafts/ceiling}%`}}/></div><strong>{r.total}</strong></div>)}</div></figure><details><summary>Ver valores do gráfico</summary><Grid label="Estudos salvos por domínio" heads={['Domínio','Concluídos','Rascunhos']} rows={rows.map(r=>[r.domain,r.done,r.drafts])}/></details></section></div>
  <div className="rf-overview-lower"><section className="rf-panel"><h2>Volume comercial estimado</h2><Grid label="Estimativas por domínio" heads={['Domínio','Volume estimado','Com regra fiscal pendente']} rows={rows.map(r=>[r.domain,r.amount,r.done])}/><p className="rf-small">Banco: parcelas e tarifa destacada. Consórcio: valor nominal contratado. Os valores não representam CET, crédito fiscal nem operações realizadas.</p></section>
  <section className="rf-panel rf-fiscal"><h2>Limites da simulação</h2><Badge type="warn" text="Estimativa comercial"/><p>Os valores de Banco e Consórcio não representam tributos oficiais. {pend} Necessária validação do Tributário/Fiscal.</p></section></div>
 </div>;
}
