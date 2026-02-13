export const config = { maxDuration: 30 };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { filenames } = req.body;

    if (!filenames || !Array.isArray(filenames) || filenames.length === 0) {
      return res.status(400).json({ error: 'filenames array required' });
    }

    const categories = [
      'Templates',
      'Playbooks',
      'Book Summaries',
      'Certifications',
      'Leadership Guides',
      'Facilitation Kits'
    ];

    const prompt = `You are a nonprofit resource categorizer. Given these filenames, categorize each one into EXACTLY one of these categories: ${categories.join(', ')}

Also generate a clean display title (remove file extensions, fix capitalization, expand abbreviations) and a brief 1-sentence description.

Filenames:
${filenames.map((f, i) => `${i + 1}. ${f}`).join('\n')}

Respond ONLY with a JSON array, no markdown, no backticks, no explanation. Each item must have:
- "filename": the original filename
- "title": clean display title
- "category": one of the exact categories listed above
- "description": brief 1-sentence description
- "tier_access": "All" for general resources, "Professional" for advanced content, "Premium" for specialized/executive content

Example response format:
[{"filename":"board-agreement-template.docx","title":"Board Member Agreement Template","category":"Templates","description":"Standard agreement template for onboarding new board members.","tier_access":"All"}]`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Anthropic API error:', errText);
      return res.status(500).json({ error: 'AI categorization failed' });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '[]';
    
    // Parse the JSON response, stripping any markdown fences
    const clean = text.replace(/```json\s?|```/g, '').trim();
    const results = JSON.parse(clean);

    // Validate categories
    const validResults = results.map(r => ({
      ...r,
      category: categories.includes(r.category) ? r.category : 'Templates'
    }));

    return res.status(200).json({ results: validResults });

  } catch (error) {
    console.error('Categorize error:', error);
    return res.status(500).json({ error: 'Categorization failed' });
  }
}
