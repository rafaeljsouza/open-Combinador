import React from 'react';
import { Github, Linkedin, GitFork } from 'lucide-react';
import { maintainers, projectLinks } from '../data/maintainers';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/95 mt-10">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="hidden md:flex items-center justify-between gap-4 text-sm">
          <p className="text-slate-700 font-medium">Combinador - Created by Rafael Souza</p>
          <div className="flex items-center gap-4 text-slate-600">
            <a href="https://github.com/rafaeljsouza" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-slate-900">
              <Github size={14} /> GitHub
            </a>
            <a href="https://www.linkedin.com/in/rafaeljsouza/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-slate-900">
              <Linkedin size={14} /> LinkedIn
            </a>
            <a href={projectLinks.repository} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-combinador-primary font-semibold hover:underline">
              <GitFork size={14} /> Repository
            </a>
          </div>
        </div>

        <details className="md:hidden">
          <summary className="cursor-pointer text-sm font-semibold text-slate-700">Projeto e mantenedores</summary>
          <div className="mt-3 space-y-2 text-sm">
            <a href={projectLinks.repository} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-combinador-primary font-semibold hover:underline">
              <GitFork size={14} /> Repository
            </a>
            <div className="flex flex-wrap gap-2">
              {maintainers.map((person) => (
                <div key={person.name} className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
                  <span className="text-xs font-semibold text-slate-700">{person.name}</span>
                  <a href={person.github} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-800" aria-label={`${person.name} GitHub`}>
                    <Github size={12} />
                  </a>
                  <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-800" aria-label={`${person.name} LinkedIn`}>
                    <Linkedin size={12} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </details>
      </div>
    </footer>
  );
}
