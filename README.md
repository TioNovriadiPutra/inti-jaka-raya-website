This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## SEO and social previews

Global metadata is rendered in `src/pages/_app.tsx` through
`src/components/custom/SEO.tsx`. English and Indonesian titles and descriptions
are configured in `src/utils/seo.ts`.

- Production canonical origin: `https://intijakaraya.com`. Optionally set
  `NEXT_PUBLIC_SITE_URL` before building if the primary domain changes.
- Open Graph and Twitter cards use `/images/social-preview-v2.jpg` (English)
  or `/images/social-preview-id-v2.jpg` (Indonesian), public 1200 × 630 JPEGs
  using the current `/images/logo.png` artwork and industrial photograph.
  Regenerate them with `node scripts/generate-social-image.mjs`. Brand source
  images are inputs only and are never overwritten by this script.
- The supplied `public/images/icon.png` is copied unchanged to `/icon.png` and
  also packaged in `/favicon.ico`. Both favicon declarations are server-rendered.
  Regenerate them with `node scripts/generate-site-icons.mjs`.
- `/robots.txt` advertises `/sitemap.xml`. The sitemap includes the home, about,
  and products pages in both languages. CMS routes, error pages, and the dummy product detail
  template receive `noindex, nofollow` and are excluded from the sitemap.
- `/products/[id]` now loads published products through `/api/product/[id]`,
  `getPublicProductById`, and `useGetPublicProductByIdService`. It includes ordered
  descriptions, one thumbnail, remaining gallery images, document links, and
  visible related case studies. The CMS detail endpoint is unchanged.
- Product detail data is client-fetched and these URLs remain `noindex` under
  the existing SEO policy. Before indexing, render product metadata on the
  server and add published URLs to the sitemap. `/products/article/[id]` remains
  the legacy sample page used by case study card navigation.
- Organization, WebSite, and page JSON-LD use business facts from the existing
  About page. No unverified social accounts, ratings, or contact data are added.

After deployment, verify that the page and social image are publicly accessible
over HTTPS. Facebook/WhatsApp and other platforms may cache previous previews;
request a fresh scrape using Facebook's Sharing Debugger when needed. The final
preview layout is controlled by each platform.

## Languages

The public site uses Next.js Pages Router internationalized routing:

- English (default): `/`, `/about`, `/products`.
- Indonesian: `/id`, `/id/about`, `/id/products`.
- Both desktop and mobile ID/EN buttons navigate to the same page in the chosen
  locale, preserving query parameters and URL fragments. Next.js links retain
  the active locale. Refreshes retain it through the URL. Automatic browser
  language detection is disabled so the URL controls the displayed language.
- Public interface translations live in `src/utils/translations.ts`, accessed
  through `useTranslation()`. English is the fallback for untranslated text.
- Metadata, HTML language, canonical URLs, hreflang links, sitemap entries,
  and social preview images reflect the two languages.
- Brand names, product codes, Latin dummy content, and database-supplied product,
  case study, and filter values retain their source text. CMS editing screens
  remain in English. Translating database content requires approved translations
  and multilingual storage; the language switch does not machine-translate it.

## Getting Started

### UI styling

The home, about, catalog, carousel, and reveal components use Tailwind classes
from `src/styles/ui.ts`. There are no CSS Modules. Colors use the `primary`,
`accent`, and `neutral` tokens in `src/styles/globals.css`; typography uses its
heading, body, and shared display/caption tokens. Update those tokens to adjust
the visual system consistently. The `ui-*` class markers only provide targets
for descendant and state variants; they have no separate CSS rules.

Element defaults belong to Tailwind's base layer so component utilities can
override them. Responsive variants, hover/focus states, reduced motion, parallax,
and the uncropped UPS logo remain supported.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.
