# Blitzschutz Däumling – Website (React + Vite + TypeScript)

Redesign preview of the Blitzschutz Däumling homepage.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build into ./dist
npm run preview    # serve the production build
```

Requires Node.js 20 or newer.

## Deploy to GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds and publishes the site on every push to `main`.

1. Create a repository on GitHub and push this project to the `main` branch:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<user>/<repo>.git
   git push -u origin main
   ```
2. In the repository open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Open the **Actions** tab. The "Deploy to GitHub Pages" run builds the site; when it finishes the
   preview is live at `https://<user>.github.io/<repo>/`.

You can also start a deploy by hand from the Actions tab ("Run workflow").

The workflow sets `BASE_PATH=/<repo>/` so all asset paths work under the repository sub-path.
If you deploy to a user site (`<user>.github.io` repository) or a custom domain, change the
`BASE_PATH` line in the workflow to `/`.

## Project structure

```
src/
  data/content.ts        all texts, locations, FAQ – edit copy here
  components/
    Hero.tsx             storm sky with procedural lightning (canvas) and live house schematic
    Header.tsx           sticky header, active-section indicator, mobile menu, scroll "conductor" rail
    System.tsx           interactive blueprint: services mapped onto the building
    Process.tsx          pinned horizontal timeline (desktop), vertical timeline (mobile)
    BlitzCheck.tsx       3-question self-assessment, result is passed into the contact form
    Company.tsx          100+ counter, parallax photo, values, reference marquee
    Knowledge.tsx        blog teasers with animated illustrations and tilt
    Locations.tsx        interactive map of the four locations
    Faq.tsx, Contact.tsx, Footer.tsx
  index.css              design tokens and all styles
```

## Notes before going live

- **Contact form:** it validates input and shows a confirmation, but does not send anything yet.
  Connect it to a form service (for example Formspree, Getform or your own endpoint) in `Contact.tsx`
  where the comment `Demo` marks the spot.
- **Links:** blog posts, brochure, Impressum and Datenschutz point to placeholders (`#`). Replace them
  with the real URLs.
- **Lightning values** in the hero are a clearly labelled simulation for illustration.
- All animations respect the operating system's "reduce motion" setting.
