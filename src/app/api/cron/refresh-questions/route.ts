
import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';

export async function GET(request: Request) {
    // Optional: Add a secret check here if deployed to public internet
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //     return new NextResponse('Unauthorized', { status: 401 });
    // }

    try {
        const grokApiKey = process.env.GROK_API_KEY;
        if (!grokApiKey) {
            throw new Error('GROK_API_KEY is not configured');
        }

        // 1. Generate questions from Grok
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
                        content: 'You are an expert IQ test creator. Generate 10 DISTINCT, CHALLENGING, and UNIQUE IQ questions. Test different areas: spatial, logical, numerical, and linguistic. Return ONLY a valid JSON array. Each object should be: {"question": "string", "options": ["string", "string", "string", "string"], "correctAnswer": number (0-3), "category": "string"}. Do not include markdown formatting.'
                    },
                    {
                        role: 'user',
                        content: 'Generate 10 unique IQ questions now.'
                    }
                ],
                model: 'grok-2-latest',
                stream: false,
                temperature: 0.9 // High temperature for variety
            })
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`Grok API error: ${response.status} ${err}`);
        }

        const data = await response.json();
        let content = data.choices[0].message.content;

        // Clean markdown
        content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        const questions = JSON.parse(content);

        // 2. Insert into Supabase
        const supabase = getAdminClient();

        // Map to snake_case for DB
        const dbRows = questions.map((q: any) => ({
            question: q.question,
            options: q.options,
            correct_answer: q.correctAnswer,
            category: q.category
        }));

        const { error } = await supabase
            .from('iq_questions')
            .insert(dbRows);

        if (error) {
            throw error;
        }

        return NextResponse.json({
            success: true,
            message: `Successfully added ${questions.length} new questions`,
            questions: dbRows
        });

    } catch (error: any) {
        console.error('Cron job failed:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
