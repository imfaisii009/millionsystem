import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';

// CORS headers for external access + CDN caching
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
};

// Handle CORS preflight requests
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: corsHeaders,
    });
}

/**
 * Public API endpoint for IQ Quiz questions
 *
 * GET /api/v1/quiz
 * Query params:
 *   - count: number of questions (default: 10, max: 20)
 *
 * Returns:
 *   {
 *     questions: Array<{
 *       question: string,
 *       options: string[],
 *       correct_answer: number,
 *       category: string
 *     }>,
 *     count: number
 *   }
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const requestedCount = parseInt(searchParams.get('count') || '10');
        const count = Math.min(Math.max(requestedCount, 1), 20); // Clamp between 1 and 20

        const supabase = getAdminClient();

        // Fetch random questions using the RPC function
        const { data, error } = await supabase
            .rpc('get_random_questions', { count_limit: count });

        if (error) {
            console.error('Database error:', error);
            return NextResponse.json(
                { error: 'Failed to fetch questions', details: error.message },
                { status: 500, headers: corsHeaders }
            );
        }

        // If no questions in DB, return empty array with message
        if (!data || data.length === 0) {
            return NextResponse.json(
                {
                    questions: [],
                    count: 0,
                    message: 'No questions available. Questions are being generated.'
                },
                { headers: corsHeaders }
            );
        }

        // Map database fields to API response format
        const questions = data.map((q: {
            question: string;
            options: string[];
            correct_answer: number;
            category: string | null;
        }) => ({
            question: q.question,
            options: q.options,
            correct_answer: q.correct_answer,
            category: q.category || 'General'
        }));

        return NextResponse.json(
            {
                questions,
                count: questions.length
            },
            { headers: corsHeaders }
        );

    } catch (error) {
        console.error('Server error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500, headers: corsHeaders }
        );
    }
}
