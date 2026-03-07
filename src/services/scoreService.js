/**
 * GlowScore Generation Service
 * 
 * Generates fake but believable GlowScore results based on input images
 * Structured to be easily swapped for real AI later
 */

// Deterministic seeding for reproducibility
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function generateGlowScore(imageInputs = {}) {
  // Extract seed from inputs for deterministic scoring
  const seed = imageInputs.timestamp || Date.now();
  
  // Generate base score with some variation
  const baseSeed = seededRandom(seed);
  const variance = seededRandom(seed * 1.1) * 15 - 7.5; // -7.5 to +7.5
  const baseScore = Math.round(72 + variance);
  const score = Math.max(40, Math.min(95, baseScore));

  // Determine tier
  let tier, tierColor, tierLabel;
  if (score >= 80) {
    tier = 'excellent';
    tierColor = '#86efac';
    tierLabel = 'Excellent';
  } else if (score >= 60) {
    tier = 'good';
    tierColor = '#0ef5c8';
    tierLabel = 'Good';
  } else if (score >= 40) {
    tier = 'fair';
    tierColor = '#e2b96a';
    tierLabel = 'Fair';
  } else {
    tier = 'poor';
    tierColor = '#f87171';
    tierLabel = 'Needs Attention';
  }

  // Generate observations based on score variability
  const indicators = generateIndicators(score, seed);
  const observations = generateObservations(score, indicators, seed);

  return {
    score,
    tier,
    tierColor,
    tierLabel,
    confidence: seededRandom(seed * 1.2) > 0.3 ? 'High' : 'Medium',
    indicators,
    observations,
    generatedAt: new Date().toISOString(),
    analysisTime: Math.round(seededRandom(seed * 1.3) * 25 + 15), // 15-40 seconds
  };
}

function generateIndicators(score, seed) {
  const indicators = [
    {
      name: 'Plaque-Like Film',
      emoji: '🔬',
      value: seededRandom(seed * 1.4) > 0.6 ? 'Low' : (seededRandom(seed * 1.5) > 0.5 ? 'Moderate' : 'High'),
    },
    {
      name: 'Gum Colour',
      emoji: '🌿',
      value: seededRandom(seed * 1.6) > 0.5 ? 'Healthy' : (seededRandom(seed * 1.7) > 0.5 ? 'Moderate' : 'Inflamed'),
    },
    {
      name: 'Enamel Clarity',
      emoji: '✨',
      value: seededRandom(seed * 1.8) > 0.4 ? 'Clear' : (seededRandom(seed * 1.9) > 0.5 ? 'Moderate Staining' : 'Significant Staining'),
    },
  ];
  return indicators;
}

function generateObservations(score, indicators, seed) {
  const observations = [];
  
  // Base observations
  if (score >= 80) {
    observations.push('Excellent plaque control detected');
    observations.push('Gum tissue appears healthy and pink');
    observations.push('Continue your current routine');
    observations.push('Consider professional whitening for additional brightness');
  } else if (score >= 60) {
    observations.push('Moderate plaque film at gumline — increase flossing');
    observations.push('Gum color indicates normal inflammation levels');
    observations.push('Enamel clarity is good; maintain brushing routine');
    observations.push('Minor staining visible; stay consistent with habits');
  } else if (score >= 40) {
    observations.push('Significant plaque buildup detected');
    observations.push('Gum tissue appears inflamed — gentle brushing recommended');
    observations.push('Enamel clarity is reduced; consider stain-removal habits');
    observations.push('Floss at least once daily to address buildup');
  } else {
    observations.push('Heavy plaque film present — priority action needed');
    observations.push('Gum inflammation is notable; increase care frequency');
    observations.push('Enamel is heavily stained; consult your dentist');
    observations.push('Daily flossing and twice-daily brushing are essential');
  }

  // Shuffle a bit using seed
  if (seededRandom(seed * 2.1) > 0.5) {
    observations.push('Consistent daily routine is already paying dividends');
  } else {
    observations.push('Small improvements in daily habits could yield big results');
  }

  return observations.slice(0, 5); // Return up to 5 observations
}

export function calculateTrend(scanHistory) {
  if (!scanHistory || scanHistory.length < 2) {
    return null;
  }

  const sorted = [...scanHistory].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const first = sorted[0].score;
  const last = sorted[sorted.length - 1].score;
  const change = last - first;

  return {
    change,
    direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
    percentage: Math.round((change / first) * 100),
    message:
      change > 0 ? `Up ${change} points since your first scan!` :
      change < 0 ? `Down ${Math.abs(change)} points—time to refocus` :
      'Score is holding steady',
  };
}
