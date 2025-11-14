# JJ Safety LLC Website

A premium, high-performance Next.js 14 website for JJ Safety LLC - a safety compliance consulting firm specializing in contractor prequalification platform management.

## Features

- ⚡ Built with Next.js 14 (App Router)
- 📝 TypeScript (strict mode)
- 🎨 Tailwind CSS with custom design system
- 📱 Fully responsive design
- 🔍 SEO optimized with schema markup
- 📊 Blog system with MDX
- 📋 Form submissions with Zod validation
- 🔗 Zoho CRM integration ready
- 🚀 Optimized for performance (95+ PageSpeed target)

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Content**: MDX for blog articles
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Schema**: schema-dts for structured data

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd JJ-Safety-LLC
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables:
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your configuration:
- Add your Zoho webhook URL for form submissions
- Configure other environment variables as needed

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Create a production build:

```bash
npm run build
```

Run the production server:

```bash
npm start
```

## Project Structure

```
/
├── app/                      # Next.js app directory
│   ├── (pages)/             # Route groups
│   ├── api/                 # API routes
│   ├── blog/                # Blog pages
│   ├── services/            # Service pages
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Homepage
├── components/
│   ├── ui/                  # Reusable UI components
│   ├── marketing/           # Marketing sections
│   ├── blog/                # Blog components
│   └── forms/               # Form components
├── content/
│   └── blog/                # MDX blog articles
├── lib/
│   ├── mdx.ts              # MDX utilities
│   ├── schema.ts           # Structured data
│   ├── services.ts         # Service data
│   └── utils.ts            # Utility functions
└── public/                  # Static assets
```

## Key Pages

- **Homepage** (`/`): Hero, services overview, testimonials, recent blog posts
- **Services** (`/services/*`): All service pages with detailed information
- **Blog** (`/blog/*`): Blog index and individual articles
- **Free Assessment** (`/free-assessment`): Lead generation form
- **About** (`/about`): Company information
- **Pricing** (`/pricing`): Service packages
- **Contact** (`/contact`): Contact information

## Forms & Integration

### Form Submissions

Forms use Zod for validation and can submit to:
- Zoho CRM via webhook (recommended)
- Custom API endpoints
- Email notifications (to be configured)

### Zoho Integration

1. Set up a Zoho Flow webhook for lead capture
2. Add the webhook URL to `.env.local`:
```
ZOHO_WEBHOOK_URL=https://flow.zoho.com/YOUR_WEBHOOK_URL
```
3. Test form submissions to ensure they reach your Zoho CRM

## Blog System

### Adding Blog Posts

1. Create a new `.mdx` file in `content/blog/`:

```mdx
---
title: "Your Post Title"
description: "Post description for SEO"
date: "2024-01-15"
author: "Author Name"
category: "Getting Started"
platforms: ["ISNetworld", "Avetta"]
featured: true
---

# Your Content Here

Write your blog post content in Markdown/MDX format.
```

2. Posts automatically appear on the blog index
3. Featured posts show on the homepage

### Blog Categories

- Getting Started
- Platform Updates
- Compliance Tips
- Industry News
- Case Studies
- How-To

## SEO Optimization

The site includes:
- Dynamic metadata for all pages
- Open Graph tags
- Twitter Card tags
- JSON-LD structured data (Organization, Service, Article, FAQ schemas)
- Automatic sitemap generation
- Robots.txt configuration

## Performance Optimization

Built-in optimizations:
- Next.js Image component for optimized images
- Font optimization with next/font
- Code splitting and lazy loading
- Static page generation where possible
- Minimal client-side JavaScript

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Environment Variables

Add these in Vercel:
- `ZOHO_WEBHOOK_URL`
- `NEXT_PUBLIC_SITE_URL`
- Any other optional variables from `.env.example`

## Customization

### Updating Content

- **Company Information**: Update in `lib/schema.ts` and throughout components
- **Services**: Modify `lib/services.ts`
- **Colors**: Edit `tailwind.config.ts`
- **Navigation**: Update in `components/marketing/Navbar.tsx` and `Footer.tsx`

### Adding Pages

1. Create new file in `app/` directory
2. Add to navigation in `Navbar.tsx`
3. Add to sitemap in `app/sitemap.ts`

## Support

For questions or issues:
- Email: info@jjsafety.com
- Phone: +1 (XXX) XXX-XXXX

## License

© 2024 JJ Safety LLC. All rights reserved.
