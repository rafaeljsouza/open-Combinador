import React from 'react';

export default function HowItWorks() {
  return (
    <div className="max-w-4xl mx-auto py-12">
      <h1 className="text-4xl font-black text-slate-900 mb-4">Como funciona?</h1>
      <p className="text-slate-600 mb-10">
        O Combinador conecta gestores públicos e pesquisadores para resolver desafios reais com colaboração documentada.
      </p>

      <div className="mb-8 p-5 rounded-2xl border border-combinador-secondary/40 bg-combinador-base">
        <h2 className="text-lg font-bold text-combinador-primary mb-2">Ajude a melhorar o Combinador</h2>
        <p className="text-combinador-primary text-sm mb-3">
          Estamos validando usabilidade e utilidade da plataforma para a pesquisa. Sua resposta leva menos de 12 minutos.
        </p>
        <a
          href="https://forms.gle/tLLAuJkjpEzNqDie8"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-combinador-primary text-white text-sm font-bold px-4 py-2 rounded-lg hover:brightness-110"
        >
          Responder avaliação
        </a>
      </div>

      <div className="space-y-6">
        <section className="bg-white border rounded-2xl p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-2">1) Gestor publica o desafio</h2>
          <p className="text-slate-600">O desafio entra no mural com contexto público e pode evoluir com eventos visíveis para toda a comunidade.</p>
        </section>

        <section className="bg-white border rounded-2xl p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-2">2) Primeiro match cria o workspace</h2>
          <p className="text-slate-600">Quando um pesquisador inicia o contato, nasce um workspace da pesquisa com gestor + pesquisador líder.</p>
        </section>

        <section className="bg-white border rounded-2xl p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-2">3) Outros pesquisadores pedem entrada</h2>
          <p className="text-slate-600">Novos pesquisadores podem solicitar participação. A entrada exige aprovação do gestor e do pesquisador líder.</p>
        </section>

        <section className="bg-white border rounded-2xl p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-2">4) Linha do tempo científica</h2>
          <p className="text-slate-600">Tudo fica registrado em eventos: experimentos, análises, decisões metodológicas e reuniões, com autoria e tags.</p>
        </section>

        <section className="bg-white border rounded-2xl p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-2">5) Publicação e memória técnica</h2>
          <p className="text-slate-600">A equipe pode exportar a timeline em TXT/Markdown/CSV para apoiar relatórios, artigos e prestação de contas.</p>
        </section>

        <section className="bg-white border rounded-2xl p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-2">6) Publicação da solução open source</h2>
          <p className="text-slate-600">
            Quando a equipe conclui o desenvolvimento, ela publica a solução na área de Soluções do site, com resumo técnico e repositório aberto. 
            Estamos trabalhando em um modelo para essa publicação, mas por enquanto ela é no formato que melhor couber ao projeto.
          </p>
        </section>
      </div>
    </div>
  );
}
