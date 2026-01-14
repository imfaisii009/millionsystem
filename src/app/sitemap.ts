import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://millionsystems.com'

    // Static pages
    const staticPages = [
        '',
        '/about',
        '/privacy',
        '/terms',
        '/cookies',
        '/pricing',
    ]

    const staticRoutes = staticPages.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    return staticRoutes
}
