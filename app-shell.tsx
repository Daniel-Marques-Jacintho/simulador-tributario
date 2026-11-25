import {useLayoutEffect} from 'react';
import {Outlet} from 'react-router-dom';
import {Calculator} from 'lucide-react';
import {Toaster} from '@/components/ui/sonner';

export function AppShell(){
 useLayoutEffect(()=>{const root=document.documentElement, wasDark=root.classList.contains('dark'),wasLight=root.classList.contains('light');root.classList.remove('dark');root.classList.add('light');return ()=>{if(!wasLight)root.classList.remove('light');if(wasDark)root.classList.add('dark')}},[]);
 return <div lang="pt-BR" className="rands min-h-screen">
  <a href="#conteudo" className="rf-skip">Pular para o conteúdo</a>
  <header className="rf-masthead"><div className="rf-brand"><span className="rf-brand-icon"><Calculator aria-hidden="true" size={21}/></span><strong>Rands</strong></div><span className="rf-product-title">Simulador e Validador Tributário</span></header>
  <main><Outlet/></main><Toaster/>
 </div>;
}
export default AppShell;
