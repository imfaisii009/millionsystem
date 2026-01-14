"use client";

import { siteConfig } from "@/config/site";

export function OrganizationSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.url,
        logo: `${siteConfig.url}/logo-nanobanana.png`,
        description: siteConfig.description,
        telephone: `+${siteConfig.phone}`,
        email: siteConfig.email,
        address: {
            "@type": "PostalAddress",
            streetAddress: siteConfig.address.street,
            addressLocality: siteConfig.address.city,
            postalCode: siteConfig.address.postcode,
            addressCountry: "GB",
        },
        sameAs: [
            siteConfig.links.github,
            siteConfig.links.twitter,
            siteConfig.links.linkedin,
        ],
        contactPoint: {
            "@type": "ContactPoint",
            telephone: `+${siteConfig.phone}`,
            contactType: "customer service",
            email: siteConfig.email,
            availableLanguage: ["English"],
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

export function LocalBusinessSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        name: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        telephone: `+${siteConfig.phone}`,
        email: siteConfig.email,
        priceRange: "$$",
        address: {
            "@type": "PostalAddress",
            streetAddress: siteConfig.address.street,
            addressLocality: siteConfig.address.city,
            postalCode: siteConfig.address.postcode,
            addressCountry: "GB",
        },
        geo: {
            "@type": "GeoCoordinates",
            latitude: "53.5522",
            longitude: "-2.1868",
        },
        areaServed: {
            "@type": "Country",
            name: "United Kingdom",
        },
        openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "09:00",
            closes: "18:00",
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

interface BreadcrumbItem {
    name: string;
    url: string;
}

interface BreadcrumbSchemaProps {
    items: BreadcrumbItem[];
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQSchemaProps {
    faqs: FAQItem[];
}

export function FAQSchema({ faqs }: FAQSchemaProps) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
            },
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

interface ServiceSchemaProps {
    serviceName: string;
    serviceDescription: string;
}

export function ServiceSchema({ serviceName, serviceDescription }: ServiceSchemaProps) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Service",
        serviceType: serviceName,
        provider: {
            "@type": "Organization",
            name: siteConfig.name,
            url: siteConfig.url,
        },
        areaServed: {
            "@type": "Country",
            name: "United Kingdom",
        },
        description: serviceDescription,
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
