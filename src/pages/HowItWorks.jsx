import React from 'react';
import { BookOpen, Unlock, Database, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HowItWorks() {
  return (
    <div className="max-w-4xl mx-auto py-12 animate-in fade-in duration-500 px-4">
      <h1 className="text-4xl font-black text-slate-900 mb-4">Como funciona?</h1>
      <p className="text-lg text-slate-600 mb-10 leading-relaxed">
        O Combinador conecta gestores públicos e pesquisadores para resolver desafios reais. 
        Nossa fundação é construída sobre metodologias transparentes, garantindo que o conhecimento gerado 
        seja auditável, reutilizável e de fácil integração para o governo.
      </p>

      {/* OS TRÊS PILARES DA PLATAFORMA */}
      <div className="mb-12">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Nossa Filosofia</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
            <BookOpen className="text-combinador-secondary mb-3" size={28} />
            <h3 className="font-bold text-slate-900 mb-2">
              <a href="https://pt.wikipedia.org/wiki/Ci%C3%AAncia_aberta" target="_blank" rel="noopener noreferrer" className="hover:text-combinador-primary hover:underline">
                Ciência Aberta
              </a>
            </h3>
            <p className="text-sm text-slate-600">
              O processo importa tanto quanto o resultado. Exigimos o registro público de hipóteses, testes e falhas, garantindo a reprodutibilidade e a memória técnica do projeto.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
            <Unlock className="text-combinador-primary mb-3" size={28} />
            <h3 className="font-bold text-slate-900 mb-2">
              <a href="https://pt.wikipedia.org/wiki/C%C3%B3digo_aberto" target="_blank" rel="noopener noreferrer" className="hover:text-combinador-primary hover:underline">
                Preferencialmente Open Source
              </a>
            </h3>
            <p className="text-sm text-slate-600">
              Incentivamos fortemente que o código final seja aberto (MIT, GPL). Contudo, respeitamos a propriedade intelectual de patentes e *spin-offs* universitárias quando necessário.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
            <Database className="text-emerald-600 mb-3" size={28} />
            <h3 className="font-bold text-slate-900 mb-2">
              <a href="https://en.wikipedia.org/wiki/OpenAPI_Specification" target="_blank" rel="noopener noreferrer" className="hover:text-combinador-primary hover:underline">
                Open API Obrigatória
              </a>
            </h3>
            <p className="text-sm text-slate-600">
              Nenhum governo deve ser refém de "caixas pretas" (<em>vendor lock-in</em>). Mesmo que a solução final seja proprietária, ela <strong>deve</strong> possuir uma API aberta e documentada.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-10 p-6 rounded-2xl border border-combinador-secondary/40 bg-combinador-base flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-combinador-primary mb-1">Ajude a melhorar o Combinador</h2>
          <p className="text-combinador-primary/80 text-sm">
            Estamos validando usabilidade e utilidade da plataforma. Leva menos de 2 minutos.
          </p>
        </div>
        <a
          href="https://forms.gle/tLLAuJkjpEzNqDie8"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-2 bg-combinador-primary text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:brightness-110 transition-all shadow-md shadow-slate-300/50"
        >
          Responder avaliação <ArrowRight size={16}/>
        </a>
      </div>

      {/* PASSO A PASSO */}
      <h2 className="text-2xl font-black text-slate-900 mb-6">O Processo Passo a Passo</h2>
      <div className="space-y-4">
        <section className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-combinador-secondary transition-colors">
          <h2 className="text-xl font-bold text-slate-900 mb-2">1) Gestor publica o desafio</h2>
          <p className="text-slate-600">
            O desafio entra no mural com contexto público, área e tags. Isso facilita encontrar pesquisas aderentes e melhora a <strong>encontrabilidade (Findable)</strong>. Dados sensíveis ficam ocultos nesta etapa.
          </p>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-combinador-secondary transition-colors">
          <h2 className="text-xl font-bold text-slate-900 mb-2">2) O Match e o Workspace</h2>
          <p className="text-slate-600">
            Quando um pesquisador demonstra interesse e o gestor aceita, nasce um "Workspace" (Ambiente de Trabalho) privado entre a gestão pública e o pesquisador líder para compartilhar dados internos com segurança.
          </p>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-combinador-secondary transition-colors">
          <h2 className="text-xl font-bold text-slate-900 mb-2">3) Linha do tempo científica</h2>
          <p className="text-slate-600">
            Durante o desenvolvimento, a equipe registra na plataforma os experimentos, análises e decisões metodológicas. Esse histórico cria uma trilha de auditoria e garante a reprodutibilidade exigida pela{' '}
            <a href="https://pt.wikipedia.org/wiki/Ci%C3%AAncia_aberta" target="_blank" rel="noopener noreferrer" className="text-combinador-primary font-bold hover:underline">
              Ciência Aberta
            </a>.
          </p>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-combinador-secondary transition-colors">
          <h2 className="text-xl font-bold text-slate-900 mb-2">4) Memória técnica e Exportação</h2>
          <p className="text-slate-600">
            A qualquer momento, a equipe pode exportar dados abertos (em JSON e CSV) ou o diário de pesquisa (em TXT/Markdown). Isso apoia a escrita de artigos acadêmicos e facilita a prestação de contas governamental <strong>(Accessible)</strong>.
          </p>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-combinador-secondary transition-colors">
          <h2 className="text-xl font-bold text-slate-900 mb-2">5) Publicação com Metadados FAIR</h2>
          <p className="text-slate-600">
            Ao concluir o projeto, a solução é enviada para o nosso catálogo público seguindo os{' '}
            <a href="https://pt.wikipedia.org/wiki/Dados_FAIR" target="_blank" rel="noopener noreferrer" className="text-combinador-primary font-bold hover:underline">
              Princípios FAIR
            </a>. Ela deve conter, obrigatoriamente, um link para repositório, documentação da{' '}
            <a href="https://en.wikipedia.org/wiki/OpenAPI_Specification" target="_blank" rel="noopener noreferrer" className="text-combinador-primary font-bold hover:underline">
              Open API
            </a>{' '}
            <strong>(Interoperable)</strong> e a declaração clara das licenças de uso <strong>(Reusable)</strong>.
          </p>
        </section>
      </div>

      <div className="mt-12 text-center">
        <Link to="/desafios" className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg">
          Explorar Desafios Disponíveis <ArrowRight size={20} />
        </Link>
      </div>
    </div>
  );
}