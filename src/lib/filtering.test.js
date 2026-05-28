import { describe, expect, it } from 'vitest';
import { filterChallenges, filterResearchers, filterSolutions } from './filtering';

function fairScore(solution) {
  const hasFindable = Boolean(solution.challengeId && (solution.title || solution.challengeTitle));
  const hasAccessible = Boolean(solution.summary || solution.problem);
  const hasInteroperable = Boolean(solution.apiDocsUrl);
  const hasReusable = Boolean(solution.licenseCode && solution.licenseData);
  return [hasFindable, hasAccessible, hasInteroperable, hasReusable].filter(Boolean).length;
}

describe('filterResearchers', () => {
  const researchers = [
    { name: 'Ana Silva', institution: 'USP', researchLine: 'IA aplicada', bio: 'Saude publica', interestTags: ['ia', 'saude'] },
    { name: 'Bruno Lima', institution: 'UFBA', researchLine: 'Mobilidade', bio: 'Transporte urbano', interestTags: ['mobilidade'] },
  ];

  it('combines term + institution + tags', () => {
    const result = filterResearchers(researchers, { term: 'ana', institution: 'USP', tags: ['ia'] });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Ana Silva');
  });

  it('returns empty when filters conflict', () => {
    const result = filterResearchers(researchers, { institution: 'USP', tags: ['mobilidade'] });
    expect(result).toHaveLength(0);
  });
});

describe('filterChallenges', () => {
  const challenges = [
    { title: 'Filas em UBS', description: 'Reduzir tempo medio', area: 'Saude', status: 'aberto', tags: ['saude', 'filas'] },
    { title: 'Onibus', description: 'Otimizacao de rotas', area: 'Mobilidade', status: 'encerrado', tags: ['transporte'] },
  ];

  it('applies all filters together', () => {
    const result = filterChallenges(challenges, { term: 'ubs', area: 'Saude', status: 'aberto', tags: ['saude'] });
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Filas em UBS');
  });

  it('returns empty state set when no match', () => {
    const result = filterChallenges(challenges, { area: 'Educacao' });
    expect(result).toHaveLength(0);
  });
});

describe('filterSolutions', () => {
  const solutions = [
    { id: '1', challengeId: 'c1', title: 'S1', summary: 'ok', apiDocsUrl: 'https://api', licenseCode: 'MIT', licenseData: 'CC-BY-4.0' },
    { id: '2', challengeId: 'c2', title: 'S2', summary: 'ok', apiDocsUrl: '', licenseCode: 'Proprietaria', licenseData: 'Restrita' },
  ];

  it('filters by FAIR + Open API + open licenses', () => {
    const result = filterSolutions(solutions, {
      fairFilter: 'high',
      onlyOpenApi: true,
      onlyOpenLicenses: true,
      getFairScore: fairScore,
      openCodeLicenses: ['MIT'],
      openDataLicenses: ['CC-BY-4.0'],
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });
});
