import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const requestedCount = parseInt(searchParams.get('count') || '10');
        const count = Math.min(Math.max(requestedCount, 1), 20); // Clamp between 1 and 20

        const supabase = getAdminClient();

        // 1. Try to get random questions from DB
        const { data, error } = await supabase
            .rpc('get_random_questions', { count_limit: count });

        if (!error && data && data.length > 0) {
            // Map all questions
            const questions = data.map((q: any) => ({
                question: q.question,
                options: q.options,
                correctAnswer: q.correct_answer,
                category: q.category
            }));

            return NextResponse.json(questions);
        }

        // 2. If DB is empty or error, fallback to hardcoded (or triggering generation could go here)
        console.warn('No questions in DB or error fetching, using fallback.', error);

        return NextResponse.json({
            question: "What comes next in this sequence: 2, 4, 8, 16, ?",
            options: ["20", "24", "32", "64"],
            correctAnswer: 2
        });

    } catch (error) {
        console.error('Error fetching question:', error);

        return NextResponse.json({
            question: "What comes next in this sequence: 2, 4, 8, 16, ?",
            options: ["20", "24", "32", "64"],
            correctAnswer: 2
        });
    }
}
