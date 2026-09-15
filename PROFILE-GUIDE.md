# Build a GitHub profile like this one

If you saw something on my profile and thought **“how did he do that?”**, this file is for you.

I hate gatekeeping. If a small trick took me an afternoon to figure out and this guide saves you that afternoon, good. **Copy the technique, learn from it, improve it, and make it yours.**

The only thing I ask: do not clone my identity. Replace my name, email, company information, project descriptions, screenshots, logos, SimpleTrain branding and personal artwork with your own.

> **Short version:** steal the engineering, not the person. 😄

---

## 1. Create a GitHub profile README

GitHub shows a special README on your profile when you create a **public repository with exactly the same name as your GitHub username**.

For example, if your username is `octocat`, create:

```text
octocat/octocat
```

Then add:

```text
README.md
```

That README becomes your profile page.

---

## 2. Add the contribution snake 🐍

This is the animated snake that travels through the real GitHub contribution graph.

My setup uses [`Platane/snk`](https://github.com/Platane/snk), then adds a custom frame, light/dark variants and reduced-motion support.

### Step A — copy the workflow

Create:

```text
.github/workflows/contribution-snake.yml
```

The exact workflow used by this profile lives here:

[`/.github/workflows/contribution-snake.yml`](.github/workflows/contribution-snake.yml)

A useful detail is this line:

```yaml
github_user_name: ${{ github.repository_owner }}
```

That means the workflow automatically uses **whoever owns the repository**. No username surgery required. Future-you is welcome.

### Step B — give GitHub Actions permission to publish

Open your profile repository and go to:

```text
Settings → Actions → General → Workflow permissions
```

Select:

```text
Read and write permissions
```

Save it.

Without this, the workflow can generate the snake and then stand there sadly holding it because GitHub will not let it publish anything.

### Step C — run the workflow once

Go to:

```text
Actions → Generate contribution snake → Run workflow
```

The workflow publishes the generated SVG files to an `output` branch.

My version refreshes automatically every 12 hours.

### Step D — show it in your README

Replace `<YOUR_USERNAME>` below:

```html
<p align="center">
  <picture>
    <source
      media="(prefers-color-scheme: dark)"
      srcset="https://raw.githubusercontent.com/<YOUR_USERNAME>/<YOUR_USERNAME>/output/github-contribution-grid-snake-dark.svg"
    />
    <img
      src="https://raw.githubusercontent.com/<YOUR_USERNAME>/<YOUR_USERNAME>/output/github-contribution-grid-snake.svg"
      width="100%"
      alt="Animated GitHub contribution snake"
    />
  </picture>
</p>
```

That gives you automatic light/dark mode without making visitors choose a theme like it is a character-creation screen.

---

## 3. Responsive hero image

The top of my profile uses a `<picture>` element so GitHub can show different artwork on small screens and respect reduced-motion preferences.

You can use the same pattern:

```html
<p align="center">
  <picture>
    <source
      media="(max-width: 600px) and (prefers-reduced-motion: reduce)"
      srcset="assets/hero-mobile-still.png"
    />
    <source
      media="(max-width: 600px)"
      srcset="assets/hero-mobile.svg"
    />
    <source
      media="(prefers-reduced-motion: reduce)"
      srcset="assets/hero-still.png"
    />
    <img
      src="assets/hero.svg"
      width="100%"
      alt="Describe your profile hero here"
    />
  </picture>
</p>
```

Suggested files:

```text
assets/
├── hero.svg
├── hero-mobile.svg
├── hero-still.png
└── hero-mobile-still.png
```

You do **not** need all four files to start. One normal SVG or PNG works perfectly fine. The extra files just make the experience nicer on mobile and for people who prefer reduced motion.

---

## 4. Clickable image buttons

The buttons near the top of my profile are simply SVG images wrapped in links.

No secret framework. No React app hidden under the floorboards.

```html
<p align="center">
  <a href="mailto:you@example.com">
    <img src="assets/contact-button.svg" height="46" alt="Email me" />
  </a>
  &nbsp;
  <a href="https://your-project.example">
    <img src="assets/project-button.svg" height="46" alt="See my project" />
  </a>
  &nbsp;
  <a href="#selected-work">
    <img src="assets/work-button.svg" height="46" alt="See selected work" />
  </a>
</p>
```

Create your own button SVGs and swap the links.

---

## 5. Full-width project panels

A project panel is just an image followed by normal Markdown.

```html
<a href="https://your-project.example">
  <img
    src="assets/project-one.svg"
    width="100%"
    alt="Preview of Project One"
  />
</a>
```

Then describe it normally:

```markdown
### Project One — What it does

A short explanation of the problem, what you built and why it matters.

[**Open the project ↗**](https://your-project.example)
```

This is useful because the page can look designed without turning your README into 900 lines of HTML that nobody wants to maintain.

---

## 6. Technology stack table

This part is gloriously boring, which is why it works.

```markdown
| Area | Technologies |
| :--- | :--- |
| **Applications** | C# · .NET · Python |
| **AI** | LLMs · Ollama · RAG |
| **Web** | JavaScript · HTML · CSS |
| **Tools** | Git · GitHub · VS Code |
```

Replace everything with your actual stack. Please do not add Kubernetes because you watched half a YouTube video once. We have all been tempted.

---

## 7. Career / experience section

You do not need a timeline library. Plain Markdown is easy to read and easy to update.

```markdown
## Experience

### Your current role
**Company · Location**  
January 2026 — present

One or two sentences about what you actually do.

### Previous role
**Company**  
2024 — 2025

What you worked on and what responsibility you had.
```

If you use a visual timeline above it, keep the real information in Markdown too. Images look nice; searchable text is useful.

---

## 8. Dark mode images

GitHub README files support `<picture>`, which means you can use separate light and dark assets:

```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/example-dark.svg" />
  <img src="assets/example-light.svg" alt="Example" />
</picture>
```

Useful for diagrams, banners and anything that becomes an accidental flashbang in dark mode.

---

## 9. Respect reduced-motion preferences

If you create animated SVGs, it is a nice touch to disable animation when the visitor has requested reduced motion.

Inside an SVG you can use:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
  }
}
```

For bigger animated hero sections, you can also provide a still image through the `<picture>` technique shown above.

---

## 10. Suggested repository structure

You can keep the profile surprisingly simple:

```text
<YOUR_USERNAME>/
├── .github/
│   └── workflows/
│       └── contribution-snake.yml
├── assets/
│   ├── hero.svg
│   ├── hero-mobile.svg
│   ├── hero-still.png
│   ├── contact-button.svg
│   ├── project-button.svg
│   └── project-one.svg
├── PROFILE-GUIDE.md
└── README.md
```

The `output` branch for the snake is generated automatically, so you do not manually maintain it.

---

## 11. What you can copy from this repository

Feel free to reuse or adapt:

- the README layout and section structure
- the contribution-snake workflow and display snippet
- responsive `<picture>` patterns
- light/dark-mode asset switching
- reduced-motion handling
- clickable SVG-button patterns
- project-panel layout ideas
- Markdown tables and career-section structure

Please create your own identity and content rather than reusing:

- my name or biography
- my email/contact details
- employer information
- SimpleTrain.ai branding and logos
- project screenshots presented as your own
- personal artwork or illustrations presented as your own work

That distinction should be pretty simple: **copy the implementation, not the résumé.**

---

## 12. Troubleshooting

### The snake does not appear

Check that:

1. GitHub Actions completed successfully.
2. The `output` branch exists.
3. Actions has **read and write** repository permission.
4. Your raw image URL contains the correct username and repository name.
5. You waited a moment after the first workflow run for GitHub's raw-file cache to catch up.

### The SVG appears locally but not on GitHub

GitHub sanitizes README HTML. Keep to normal Markdown and supported HTML elements rather than relying on arbitrary JavaScript.

### My image is gigantic

Use:

```html
<img src="assets/example.svg" width="100%" alt="Example" />
```

or a fixed height for buttons:

```html
<img src="assets/button.svg" height="46" alt="Button" />
```

### Do I need to understand every line before using it?

No. Copy it, get it working, then change one thing at a time and learn what each part does. That is how half of software engineering works; the other half is discovering the one space you accidentally deleted three hours ago.

---

## Final note

I built this profile to show my work, but I also want the repository to be useful to people learning how these GitHub profiles are put together.

**I genuinely dislike gatekeeping.** If you learned something here, use it. If you improve it, even better. If somebody asks you how you did it later, pass the knowledge on.

That is a much better internet than everyone pretending their 12-line YAML file is ancient forbidden magic.
