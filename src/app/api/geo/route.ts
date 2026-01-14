import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    // Extract client IP from headers to support production environments (e.g. Vercel, AWS)
    const forwarded = req.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : null

    // If we have a specific user IP, query that. 
    // Otherwise (localhost/dev), query the requester's IP (which is this server/computer).
    const url = ip && !ip.includes('::') && ip !== '127.0.0.1'
        ? `https://ipapi.co/${ip}/json/`
        : 'https://ipapi.co/json/'

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'MillionSystems-Client/1.0'
            }
        })

        if (!response.ok) {
            throw new Error(`Upstream API error: ${response.status}`)
        }

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error('Geo API Error:', error)
        return NextResponse.json(
            { error: 'Failed to resolve location' },
            { status: 500 }
        )
    }
}
