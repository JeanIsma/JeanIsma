# Profile artwork

The profile is a GitHub README, with self-contained animated SVG illustrations and readable Markdown. No custom page CSS, scripts, external badges, stats servers or background requests are required by the README artwork.

## Sources

- Alpine landscape: original AI-generated photographic-style image created for this profile on 8 September 2026. It is not a documentary photograph of an identified place. Source: `landscape-source.jpg`.
- SimpleTrain logo: copied unchanged from `JeanIsma/simpletrain-ai/assets/email/simpletrain-email-logo-v1.png`, Git blob `3a57ec5ac574a0b21f34f9ed80194e8c2e2a713f`.
- Career and education details: existing public profile README at commit `018c1769b32fd07ed14e96a0a307514d7669a15c`. The degree remains explicitly expected, and the software/support role is concurrent with the architect role.
- Project status: public SimpleTrain README, Git blob `802132fbf873b5a7bd1c40351cf73fe826109908`. The service is in development and live GPU sessions are not yet available.

## Rebuilding

Run `npm install --no-save sharp`, then `node design/build-assets.cjs` from the repository root. The script reads `landscape-source.png` when present; the committed JPEG source is the portable fallback.

The main SVG is 1600 × 1000. Its text stays still while the glass lens, reflections and status light move. All SVGs disable animation with `prefers-reduced-motion: reduce`; the hero additionally has a static PNG alternative in the README. The photo and logo are embedded so GitHub image rendering needs no nested remote fetches.

GitHub removes scripts and inline styling from README markup: https://github.com/github/markup. Animation is inside the SVG assets. Mobile layouts use scalable image widths and standard Markdown content; contact and project links also exist as text.
