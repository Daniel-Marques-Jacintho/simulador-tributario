import { cents, money, regular, simples } from '@/lib/tributos';
import catalog from './catalog.json';
export const VERSION='0.2.0';
export const pend='Regra pendente de validação tributária.';
export const official={status:'Não conectado',version:null,calculate:()=>({ibs:null,cbs:null,credit:null,reason:pend})} as const;
export const modalities=['CDC','FINAME','Empréstimo','Financiamento','Antecipação de recebíveis','Cessão ou aquisição de recebíveis','FIDC'];
export const events=['Adesão','Pagamento','Contemplação','Aquisição do bem','Transferência','Desistência','Cancelamento','Devolução','Estorno','Encerramento'];
export type Domain='Banco'|'Consórcio'; export type Form=Record<string,string>;
export type Row={period:number;opening:number;interest:number;amort:number;pay:number;closing:number};
export type Result={kind:string; total:number|null; principal:number|null; interest:number|null; fees:number|null;steps:string[];rows:Row[];warning:string;ibs:null;cbs:null;credit:null};
export type Verdict={label:string;difference:number;percent:number|null};
const fmt=(n:number)=>n.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
export const br=(n:number|null)=>n===null?'Não calculado':`R$ ${fmt(n/100)}`;
export const pct=(n:number)=>n.toLocaleString('pt-BR',{maximumFractionDigits:6})+'%';
export function amount(s:string,label='Valor'){const v=cents(s||'');if(v===null||v>99999999999n)throw Error(`${label}: informe entre R$ 0,00 e R$ 999.999.999,99, no formato brasileiro.`);return Number(v)}
export function rate(s:string){if(!/^\d{1,3}(,\d{1,6})?$/.test(s||''))throw Error('Use uma taxa percentual entre 0 e 100, com vírgula decimal.');const n=Number(s.replace(',','.'));if(n>100)throw Error('Taxa superior a 100%.');return n}
export function seed(d:Domain):Form{return d==='Banco'?{name:'Estudo CDC',person:'Analista A',area:'Produtos',date:'2026-11-25',mode:'CDC',regime:'Regular',method:'Price convencional',principal:'500.000,00',months:'36',monthly:'1,50',fee:'1.000,00',upfront:'500,00',index:'Sem referência',refRate:'',refDate:'',refSource:'',party:'PJ contribuinte'}:{name:'Estudo de intermediação',person:'Analista B',area:'Produtos',date:'2026-11-25',event:'Pagamento',party:'PJ contribuinte',regime:'Regular',group:'G-01',quota:'C-01',credit:'100.000,00',admin:'20.000,00',commission:'5.000,00',reserve:'0,00',insurance:'0,00',invoice:'Individualizada',intermediary:'Regular',eligibility:'Pendente',paid:'0,00'}}
export function schedule(principal:number,n:number,r:number,method:string):Row[]{
 if(!Number.isSafeInteger(principal)||principal<=0||!Number.isInteger(n)||n<1||n>360||!Number.isFinite(r)||r<0||r>1)throw Error('Principal positivo e prazo de 1 a 360 meses são obrigatórios.');
 if(!['Price convencional','SAC','Parcela única'].includes(method))throw Error('Método não parametrizado. Nenhum fluxo foi calculado.');
 if(method==='Parcela única'&&n!==1)throw Error('Para parcela única, informe prazo de um mês nesta versão.');
 let balance=principal;const rows:Row[]=[];const cuota=r===0?principal/n:principal*r/(-Math.expm1(-n*Math.log1p(r)));
 for(let i=1;i<=n;i++){const opening=balance,interest=Math.round(opening*r);const amort=i===n?opening:Math.min(opening,Math.max(0,method==='SAC'?Math.floor(principal*i/n)-Math.floor(principal*(i-1)/n):Math.round(cuota)-interest));balance-=amort;rows.push({period:i,opening,interest,amort,pay:amort+interest,closing:balance})}return rows;
}
export function calculate(d:Domain,f:Form):Result { const empty={ibs:null,cbs:null,credit:null} as const;
 if(!/^\d{4}-\d{2}-\d{2}$/.test(f.date)||!Number.isFinite(Date.parse(f.date))||new Date(f.date).toISOString().slice(0,10)!==f.date)throw Error('Informe uma data-base válida.');
 const blank={...empty,kind:'Regra pendente de validação',total:null,principal:null,interest:null,fees:null,rows:[],steps:['Nenhum cálculo fiscal ou comercial foi aplicado.'],warning:pend+' Necessária validação do Tributário/Fiscal.'};
 if(d==='Banco'){
 if(!['CDC','FINAME','Empréstimo','Financiamento'].includes(f.mode)||!['Price convencional','SAC','Parcela única'].includes(f.method))return blank;
 const p=amount(f.principal,'Principal'),fee=amount(f.fee,'Tarifa financiada'),up=amount(f.upfront,'Tarifa destacada'),r=rate(f.monthly);if(!p)throw Error('Principal deve ser positivo.');if(!/^\d{1,3}$/.test(f.months))throw Error('Informe o prazo em meses inteiros.');
 if(f.index!=='Sem referência'){rate(f.refRate);if(!f.refDate||!f.refSource.trim())throw Error('Informe data e fonte da referência manual.');}
 const rows=schedule(p+fee,Number(f.months),r/100,f.method),sum=rows.reduce((a,x)=>a+x.pay,0),interest=rows.reduce((a,x)=>a+x.interest,0);return {...empty,kind:'Estimativa comercial',principal:p,fees:fee+up,interest,total:sum+up,rows,steps:[`Capital financiado = principal ${br(p)} + tarifa financiada ${br(fee)} = ${br(p+fee)}.`,f.method==='SAC'?'SAC: amortização constante, com ajuste de centavos.':'Price: prestação teórica = capital × i ÷ [1 − (1 + i)⁻ⁿ]; com taxa zero, capital ÷ n.',`Juros de cada mês = saldo inicial × ${pct(r)}; última parcela ajusta o saldo.`, `Soma das parcelas ${br(sum)} + tarifa destacada ${br(up)} = ${br(sum+up)}. Juros acumulados: ${br(interest)}.`,f.index==='Sem referência'?'Selic/DI não informada.':`${f.index}: ${f.refRate}% a.a., referência manual de ${f.refDate}, fonte ${f.refSource}. Não usada para apurar crédito.`],warning:'Fluxo mensal postecipado, sem carência. Não é CET. Atrasos, antecipação e renegociação alteram os valores. '+blank.warning};
 }
 const credit=amount(f.credit,'Crédito contratado'),admin=amount(f.admin,'Taxa de administração'),comm=amount(f.commission,'Comissão'),reserve=amount(f.reserve,'Fundo de reserva'),insurance=amount(f.insurance,'Seguro');amount(f.paid,'Valor pago');
 if(!['Adesão','Pagamento'].includes(f.event))return {...blank,steps:[`Evento ${f.event}: sem tratamento comercial e fiscal parametrizado.`]};
 return {...empty,kind:'Estimativa comercial',total:credit+admin+reserve+insurance,principal:credit,interest:null,fees:admin+reserve+insurance,rows:[],steps:[`Crédito contratado: ${br(credit)}.`, `Encargos contratuais informados = administração ${br(admin)} + reserva ${br(reserve)} + seguro ${br(insurance)} = ${br(admin+reserve+insurance)}.`, `Total nominal contratado = crédito + encargos = ${br(credit+admin+reserve+insurance)}. Não representa saldo devedor nem pagamento no evento.`, `Comissão de intermediação informada: ${br(comm)}. Não somada à parcela do consorciado nem deduzida de base fiscal. Nota: ${f.invoice}; intermediário: ${f.intermediary}.`],warning:'Não há cálculo de base tributável, dedução, crédito ou recolhimento por participante. '+blank.warning};
}
export function compareManual(reference:number,internal:number,tolerance:number):Verdict {const diff=internal-reference;return {label:!diff?'Valores iguais':Math.abs(diff)<=tolerance?'Dentro da tolerância informada':'Acima da tolerância informada',difference:diff,percent:reference===0?null:100*diff/reference}}
export const edition={app:VERSION,params:catalog.version,motor:'Não integrado · versão não verificada'};
export type Trial={code:string;domain:string;objective:string;expected:string;run:()=>string};
export const trials:Trial[]=[
 {code:'B01',domain:'Banco',objective:'Price sem juros · R$ 100 em 2 meses',expected:'5000,5000',run:()=>schedule(10000,2,0,'Price convencional').map(x=>x.pay).join(',')},
 {code:'B02',domain:'Banco',objective:'SAC · saldo final e capital amortizado',expected:'0 / 50000000',run:()=>{const r=schedule(50000000,36,.015,'SAC');return `${r[r.length-1].closing} / ${r.reduce((a,x)=>a+x.amort,0)}`}},
 {code:'B03',domain:'Banco',objective:'Price invertida sem regra interna',expected:'Regra pendente de validação',run:()=>calculate('Banco',{...seed('Banco'),method:'Price invertida'}).kind},
 {code:'C01',domain:'Consórcio',objective:'Contrato de R$ 100 mil + taxa de R$ 20 mil',expected:'12000000',run:()=>String(calculate('Consórcio',seed('Consórcio')).total)},
 {code:'C02',domain:'Consórcio',objective:'Comissão informada não libera crédito',expected:'null',run:()=>String(calculate('Consórcio',seed('Consórcio')).credit)},
 {code:'C03',domain:'Consórcio',objective:'Estorno sem regra aprovada',expected:'null',run:()=>String(calculate('Consórcio',{...seed('Consórcio'),event:'Estorno'}).total)},
 {code:'R01',domain:'Calculadora 2026',objective:'Destaque sobre R$ 10.000,00',expected:money(10000n),run:()=>money(regular(1000000n).total)},
 {code:'R02',domain:'Calculadora 2026',objective:'Anexo I · RBT12 240 mil, mês 20 mil',expected:money(96500n),run:()=>money(simples(24000000n,2000000n,'I')!.total)},
 {code:'V01',domain:'Conciliação',objective:'Referência zero: diferença percentual indefinida',expected:'null',run:()=>String(compareManual(0,150,1).percent)},
 {code:'V02',domain:'Conciliação',objective:'Diferença de R$ 0,02 acima de R$ 0,01',expected:'Acima da tolerância informada',run:()=>compareManual(100,102,1).label}
];
