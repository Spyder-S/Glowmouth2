async function generateInsights(scanData) {
  const prompt = `You are GlowMouth AI, the intelligent oral health assistant for GlowMouth,
an AI-powered at-home oral health monitoring system using QLF (Quantitative Light-Induced
Fluorescence) technology at 405nm. GlowMouth is a wellness tool — NOT a medical device.
You never diagnose, treat, or prescribe. You give actionable wellness guidance only.

The user's latest scan data:
- GlowScore: ${scanData.score}/100
- Previous GlowScore: ${scanData.previousScore}/100
- Change: ${scanData.score - scanData.previousScore > 0 ? '+' : ''}${scanData.score - scanData.previousScore}
- Current streak: ${scanData.streak} days
- Zone analysis:
  Front teeth: ${scanData.zones.front.score}/100 (${scanData.zones.front.status})
  Left side: ${scanData.zones.left.score}/100 (${scanData.zones.left.status})
  Right side: ${scanData.zones.right.score}/100 (${scanData.zones.right.status})
  Back teeth: ${scanData.zones.back.score}/100 (${scanData.zones.back.status})
- 7-day score history: ${scanData.history.join(', ')}
- User's name: ${scanData.userName}

Respond ONLY with a valid JSON object. No markdown. No explanation. No code blocks.
Exactly this structure:
{
  "summary": "One sentence (max 20 words) summarizing overall oral health status.",
  "recommendations": [
    "Specific actionable recommendation 1 based on their zone data (1-2 sentences)",
    "Specific actionable recommendation 2 based on their trend (1-2 sentences)",
    "Specific actionable recommendation 3 motivational or habitual (1-2 sentences)"
  ],
  "watchZone": "Name of the zone needing most attention and why (1 sentence)",
  "trendAnalysis": "What the 7-day history shows about their trajectory (1-2 sentences)",
  "motivationMessage": "A short personalized motivational message using their name (1 sentence, warm tone)"
}

Be specific to their actual data. Reference real zone names. Reference actual scores.
Never use generic advice that ignores their data. Never claim to diagnose anything.
Always end with the disclaimer framing — wellness guidance only.`;

  console.log('[GlowMouth AI] Generating insights for score:', scanData.score);

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 600,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) throw new Error('AI request failed');
  const data = await response.json();
  const text = data.content[0].text.trim();
  console.log('[GlowMouth AI] Insights generated successfully.');
  return JSON.parse(text);
}

export { generateInsights };
