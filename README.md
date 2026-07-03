# fgdev.tech — Portfolio

Cyber-minimalist developer portfolio of **Figo Perdana Putra** (DevOps · Network · Infra · Software).

## Stack

- [Astro](https://astro.build) (static output, content collections, built-in Fonts API)
- Tailwind CSS 4 (design tokens in `@theme`, sharp `{0, 9999px}` radius system)
- Vanilla [Motion](https://motion.dev) (`motion/mini`) for reveals — total site JS ≈ 3.5 KB gzip
- Custom pendulum physics for the hanging ID card (`src/scripts/lanyard.ts`)
- Native cross-document View Transitions (zero JS)

## Commands

| Command           | Action                       |
| ----------------- | ---------------------------- |
| `npm run dev`     | Dev server at localhost:4321 |
| `npm run build`   | Production build to `dist/`  |
| `npm run preview` | Preview the build            |
| `npm run check`   | Types + template diagnostics |
| `npm run format`  | Prettier                     |

## Content

- Projects: `src/content/projects/*.md` (Zod schema in `src/content.config.ts`)
- Identity / experience / stack / socials / nav: `src/data/*.ts`
- Card position knob: `--card-nudge-x` in `src/components/Hero.astro`
