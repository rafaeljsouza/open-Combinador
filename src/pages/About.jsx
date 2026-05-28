import React from 'react';
import { Info, Award, ShieldCheck, Users } from 'lucide-react';
import { maintainers, projectLinks } from '../data/maintainers';

const About = () => {
  return (
    <div className="max-w-3xl mx-auto py-12 animate-in slide-in-from-bottom-4 duration-700">
      <h1 className="text-4xl font-black text-slate-900 mb-6">Sobre o Projeto</h1>
      
      <div className="prose prose-slate lg:prose-lg text-slate-600 space-y-6">
        <p className="text-xl leading-relaxed">
          O <strong>Combinador</strong> nasceu como uma iniciativa de Iniciação Científica 
          para reduzir o abismo entre a produção acadêmica e a gestão pública real.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
          <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <Users className="text-combinador-primary mb-4" />
            <h3 className="font-bold text-slate-900 mb-2">Equipe</h3>
            <p className="text-sm">Desenvolvido por Rafael Souza, acadêmico de Análise e Desenvolvimento de Sistemas na Universidade Positivo sob orientação do <a href='https://buscatextual.cnpq.br/buscatextual/visualizacv.do;jsessionid=B0F519FA251D0B5ACD6EBCFDC7302B73.buscatextual_0'> Prof. Doutor Guilherme Augusto Queiroz Schunemann Manfrin De Oliveira  </a> enquanto parte do seu projeto de Iniciação Científica.</p>
          </div>
          <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <Award className="text-emerald-600 mb-4" />
            <h3 className="font-bold text-slate-900 mb-2">Objetivo</h3>
            <p className="text-sm">Transformar teses e dissertações em ferramentas práticas para cidades.</p>
          </div>
        </div>

        <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <h3 className="font-bold text-slate-900 mb-3">Mantenedores e repositório</h3>
          <a href={projectLinks.repository} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-combinador-primary hover:underline">
            Repositório open-source
          </a>
          <div className="mt-3 space-y-2">
            {maintainers.map((person) => (
              <p key={person.name} className="text-sm text-slate-700">
                {person.name} - <a href={person.github} target="_blank" rel="noopener noreferrer" className="text-combinador-primary hover:underline">GitHub</a> - <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="text-combinador-primary hover:underline">LinkedIn</a>
              </p>
            ))}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-900">Por que o "Combinador"?</h2>
        <p>
          Muitas vezes, prefeituras enfrentam problemas que já foram resolvidos em laboratórios 
          universitários ou que seriam facilmente resolvidos caso Gestores pudessem encontrar os Pesquisadores certos. Esses encontros são escassos e na maior parte das vezes limitados ao local da universidade,  então essa solução nunca chega à ponta. Nosso papel é ser a ponte tecnológica 
          que facilita esse encontro "Match".
        </p>
      </div>
    </div>
  );
};

export default About;
