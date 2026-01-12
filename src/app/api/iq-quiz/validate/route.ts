import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { question, selectedAnswer } = body;

        const grokApiKey = process.env.GROK_API_KEY;

        if (!grokApiKey) {
            throw new Error('GROK_API_KEY is not configured');
        }

        const response = await fetch('https://api.x.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${grokApiKey}`
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: 'system',
                        content: 'You are validating IQ question answers. Return ONLY valid JSON with this exact format: {"correct": true} or {"correct": false}. No additional text or explanation.'
                    },
                    {
                        role: 'user',
                        content: `Question: ${question}\nUser selected answer index: ${selectedAnswer}\nIs this answer correct? Return only JSON.`
                    }
                ],
                model: 'grok-2-latest',
                stream: false,
                temperature: 0
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Grok API Error Details:', errorText);
            throw new Error(`Grok API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        let content = data.choices[0].message.content;

        // Clean up markdown formatting if present
        content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        // Parse the JSON response from Grok
        const validation = JSON.parse(content);

        return NextResponse.json(validation);
    } catch (error) {
        console.error('Error validating answer:', error);

        // Return a safe default
        return NextResponse.json({ correct: false });
    }
}
