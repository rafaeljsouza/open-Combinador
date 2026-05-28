export function filterResearchers(researchers, { term = '', institution = 'all', tags = [] } = {}) {
  const normalizedTerm = term.trim().toLowerCase();
  return (researchers || []).filter((r) => {
    const matchesTerm = !normalizedTerm
      || r.name?.toLowerCase().includes(normalizedTerm)
      || r.institution?.toLowerCase().includes(normalizedTerm)
      || r.researchLine?.toLowerCase().includes(normalizedTerm)
      || r.bio?.toLowerCase().includes(normalizedTerm);

    const matchesInstitution = institution === 'all' || r.institution === institution;
    const matchesTags = tags.length === 0 || tags.every((tag) => (r.interestTags || []).includes(tag));
    return matchesTerm && matchesInstitution && matchesTags;
  });
}

export function filterChallenges(challenges, { term = '', area = 'all', status = 'all', tags = [] } = {}) {
  const normalizedTerm = term.trim().toLowerCase();
  return (challenges || []).filter((item) => {
    const matchesTerm = !normalizedTerm
      || item.title?.toLowerCase().includes(normalizedTerm)
      || item.description?.toLowerCase().includes(normalizedTerm)
      || item.area?.toLowerCase().includes(normalizedTerm)
      || (item.tags || []).some((tag) => tag.includes(normalizedTerm));
    const matchesArea = area === 'all' || item.area === area;
    const matchesStatus = status === 'all' || item.status === status;
    const matchesTags = tags.length === 0 || tags.every((tag) => (item.tags || []).includes(tag));
    return matchesTerm && matchesArea && matchesStatus && matchesTags;
  });
}

export function filterSolutions(solutions, { fairFilter = 'all', onlyOpenApi = false, onlyOpenLicenses = false, getFairScore, openCodeLicenses = [], openDataLicenses = [] } = {}) {
  return (solutions || []).filter((solution) => {
    const fairScore = getFairScore(solution);
    const fairOk = fairFilter === 'all'
      || (fairFilter === 'high' && fairScore === 4)
      || (fairFilter === 'partial' && fairScore >= 2 && fairScore <= 3)
      || (fairFilter === 'low' && fairScore <= 1);
    const apiOk = !onlyOpenApi || Boolean(solution.apiDocsUrl);
    const licenseOk = !onlyOpenLicenses || (openCodeLicenses.includes(solution.licenseCode) && openDataLicenses.includes(solution.licenseData));
    return fairOk && apiOk && licenseOk;
  });
}
