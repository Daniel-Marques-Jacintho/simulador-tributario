import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export function LeiaMe({ onReturn }: { onReturn: () => void }) {
  return <article className="rands-guide" aria-labelledby="guia-titulo">
    <header>
      <p className="eyebrow">Guia de utilização</p>
      <h1 id="guia-titulo">Leia-me</h1>
      <p className="lead">Escolha o regime pela pergunta que você quer responder: quanto destacar em uma operação ou quanto estimar sobre a receita do mês?</p>
    </header>
    <div className="guide-columns">
      <section aria-labelledby="guia-regular">
        <p className="eyebrow">Por operação</p><h2 id="guia-regular">Regime Regular</h2>
        <ol><li>Na aba <strong>Calculadora</strong>, escolha <strong>Regime Regular</strong>.</li><li>Em <strong>Base de cálculo</strong>, informe a base tributável já apurada, sem IBS ou CBS. O total da nota só serve se coincidir com essa base.</li><li>Confira os dois destaques na memória. Para uma operação com tributação integral em 2026, a CBS é de 0,90% e o IBS estadual é de 0,10%. Cada parcela é arredondada para centavos antes da soma.</li></ol>
        <div className="worked-example"><h3>Exemplo · Base de R$ 10.000,00</h3><p>CBS: R$ 10.000,00 × 0,90% = R$ 90,00.<br/>IBS: R$ 10.000,00 × 0,10% = R$ 10,00.</p><p><strong>Destaque total: R$ 100,00.</strong> Não é necessariamente o valor a recolher.</p></div>
      </section>
      <section aria-labelledby="guia-simples">
        <p className="eyebrow">Por mês</p><h2 id="guia-simples">Simples Nacional</h2>
        <ol><li>Escolha <strong>Simples Nacional</strong> e selecione o anexo aplicável à receita. O app não determina o enquadramento da atividade.</li><li>Informe a <strong>RBT12</strong>: a receita bruta acumulada nos 12 meses anteriores, sem incluir o mês simulado. Depois, informe a receita tributável do próprio mês, apenas do anexo escolhido.</li><li>Confira a faixa, a alíquota nominal e a parcela a deduzir. A alíquota efetiva é (RBT12 × alíquota nominal − parcela a deduzir) ÷ RBT12. Multiplique a receita do mês pela alíquota efetiva para obter a estimativa.</li></ol>
        <div className="worked-example"><h3>Exemplo · Anexo I, faixa 2</h3><p>Com RBT12 de R$ 240.000,00, a alíquota nominal é de 7,30% e a parcela a deduzir é de R$ 5.940,00. A alíquota efetiva é de 4,825%.</p><p>R$ 20.000,00 no mês × 4,825% = <strong>R$ 965,00 de DAS estimado.</strong></p></div>
      </section>
    </div>
    <section className="guide-note" aria-labelledby="guia-memoria"><h2 id="guia-memoria">Como conferir e guardar a memória</h2><p>Digite valores como <strong>1.234,56</strong>, sem o símbolo R$. O resultado muda ao editar os campos. Se aparecer um traço no lugar do total, corrija o campo sinalizado antes de continuar.</p><p><strong>Copiar memória</strong> leva as etapas, o total e a referência legal à área de transferência. Cole onde quiser guardar a simulação. Se o navegador bloquear a cópia, selecione o texto da memória e copie manualmente. Alternar entre as abas mantém os valores; recarregar a página restaura os valores iniciais.</p></section>
    <section className="guide-note" aria-labelledby="guia-limites"><h2 id="guia-limites">Quando não usar o resultado</h2><p>O app simula cenários de 2026. Não executa o motor oficial da Receita, não emite nota nem guia de pagamento e não substitui a apuração fiscal. O Regime Regular não contempla créditos, reduções, Imposto Seletivo nem regimes específicos, <strong>inclusive o de consórcios</strong>.</p><p>No Simples, a simulação abrange os Anexos I a V, faixas 1 a 5, com RBT12 maior que zero e de até R$ 3,6 milhões, 12 meses completos de atividade e uma receita no mercado interno. Não calcula fator R, segregações, retenções, sublimites ou tributos fora do DAS. O destaque de IBS e CBS do Regime Regular não deve ser somado a essa estimativa.</p><p>Fontes: <a href="https://portaldalegislacao.presidencia.gov.br/ccivil_03/leis/lcp/lcp214compilado.htm" target="_blank" rel="noreferrer">LC 214/2025, arts. 343, 346 e 348</a> e <a href="https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp123.htm" target="_blank" rel="noreferrer">LC 123/2006, art. 18 e Anexos I a V</a>.</p></section>
    <Button type="button" onClick={onReturn}><ArrowLeft aria-hidden="true"/>Voltar à calculadora</Button>
  </article>;
}
