import catalog from '../rands/catalog.json';
// Cenários ordinários, exercício 2026. Valores monetários sempre em centavos.
export const annexes = catalog.annexes;
export type Annex = keyof typeof annexes;
const limits = catalog.limits.map(n=>BigInt(n)*100n);
export function cents(text:string):bigint|null {
 const s=text.trim(); if(!/^(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d{1,2})?$/.test(s)) return null;
 const [whole,frac='']=s.replace(/\./g,'').split(','); if(whole.length>12)return null;
 return BigInt(whole)*100n + BigInt(frac.padEnd(2,'0'));
}
export function money(n:bigint){return `R$\u00a0${(n/100n).toLocaleString('pt-BR')},${(n%100n).toString().padStart(2,'0')}`}
export function percent(n:number, digits=2){return `${n.toLocaleString('pt-BR',{maximumFractionDigits:digits,minimumFractionDigits:2})}%`}
const round=(n:bigint,d:bigint)=>(2n*n+d)/(2n*d);
export function regular(base:bigint){ const cbs=round(base*BigInt(catalog.regular.cbsBps),10000n),ibs=round(base*BigInt(catalog.regular.ibsBps),10000n); return {cbs,ibs,total:cbs+ibs}; }
export function simples(rbt:bigint,monthly:bigint,annex:Annex){const i=limits.findIndex(l=>rbt<=l); if(i<0||rbt<=0n||monthly<0n) return null;
 const tab=annexes[annex], rate=tab.rates[i], deduction=BigInt(tab.deductions[i])*100n;
 const numerator=rbt*BigInt(rate)-deduction*10000n,denominator=rbt*10000n;
 return {band:i+1,rate:rate/100,deduction,upper:limits[i],lower:i?limits[i-1]+1n:0n,effective:Number(numerator)/Number(denominator)*100,total:round(monthly*numerator,denominator)};
}
