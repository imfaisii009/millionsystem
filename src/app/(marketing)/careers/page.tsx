import { type Metadata } from 'next'
import { CareersEmptyState } from '@/components/sections/careers-empty-state'

export const metadata: Metadata = {
    title: 'Careers | MillionSystems',
    description: 'Join our team of engineers and creators building the future of digital products.',
}

// ISR Configuration
export const revalidate = 3600 // Revalidate every hour

export default function CareersPage() {
    return (
        <div className="container mx-auto px-4 py-24 min-h-[70vh] flex items-center justify-center">
            <CareersEmptyState />
        </div>
    )
}
