import React from 'react';
import { Github, Linkedin, HeartHandshake, GitFork } from 'lucide-react';
import { maintainers, projectLinks } from '../data/maintainers';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/90 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-800">Created by Rafael Souza</p>
            <div className="flex items-center gap-3 mt-2">
              <a
                href="https://github.com/rafaeljsouza"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
              >
                <Github size={16} /> GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/rafaeljsouza/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
              >
                <Linkedin size={16} /> LinkedIn
              </a>
            </div>
            <a
              href={projectLinks.repository}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-3 text-xs font-bold uppercase tracking-wide text-combinador-primary hover:underline"
            >
              <GitFork size={14} /> Open-source repository (placeholder)
            </a>
          </div>

          <div className="inline-flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl w-fit">
            <HeartHandshake size={14} /> Open collaboration welcome worldwide
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Maintained by</p>
          <div className="flex flex-wrap gap-2">
            {maintainers.map((person) => (
              <div key={person.name} className="inline-flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                <span className="text-sm font-semibold text-slate-800">{person.name}</span>
                <a href={person.github} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-800" aria-label={`${person.name} GitHub`}>
                  <Github size={14} />
                </a>
                <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-800" aria-label={`${person.name} LinkedIn`}>
                  <Linkedin size={14} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
