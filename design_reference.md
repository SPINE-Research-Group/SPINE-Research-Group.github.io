# DANAIS Lab — Design Reference for Jekyll Replication

> Reference this file when building or styling any part of the Jekyll site.
> Every token, component pattern, and layout rule here is derived directly from the live site screenshots.

---

## 1. Colour Palette

```css
:root {
  /* Backgrounds — the page uses TWO background zones */
  --bg-sage:        #cfd4bf;   /* Hero, News, Projects, People sections — warm sage green */
  --bg-cream:       #ece7de;   /* Publications (lower), Sponsors, Contact, Footer — warm beige */
  --bg-card:        #ffffff;   /* All cards */
  --bg-card-hover:  #f9f8f5;   /* Subtle hover lift on cards */

  /* Text */
  --text-primary:   #1c1a16;   /* Near-black warm dark brown — all headings + body */
  --text-muted:     #8c8070;   /* Dates, co-supervisor notes, subtitles */
  --text-on-dark:   #ffffff;   /* Text on filled green buttons */

  /* Brand accents */
  --accent-green:   #1f3d2e;   /* Primary CTA button fill, venue badge fill (main venues) */
  --accent-amber:   #b8601e;   /* Nav active underline only */

  /* Avatar (alumni initials) */
  --avatar-bg:      #c2b9ad;   /* Muted taupe circle background */
  --avatar-text:    #2a4f3a;   /* Dark green initials text */

  /* Venue badge variants (pill backgrounds) */
  --badge-dark:     #1f3d2e;   /* VLDB, ICDE, SIGMOD — dark forest green */
  --badge-dark-text:#ffffff;
  --badge-mid:      #3d5c42;   /* MLSys, AAAI — slightly lighter forest */
  --badge-mid-text: #ffffff;
  --badge-light:    #e8e3db;   /* KAIS, book chapters, etc — light neutral */
  --badge-light-text:#1c1a16;

  /* Link badges (PDF, LINK, BIBTEX, SLIDES, CODE) */
  --link-badge-pdf-bg:   #f5e0d8;   /* Soft salmon/pink */
  --link-badge-pdf-text: #7a2e1a;
  --link-badge-bg:       #e8e3db;   /* Neutral warm */
  --link-badge-text:     #3a342c;

  /* Border */
  --border-card:    rgba(0,0,0,0.07);
}
```

---

## 2. Typography

```css
/* Font stack */
/* Headings: Bold serif — use Playfair Display or Lora (both available on Google Fonts) */
/* Body/UI:  Clean sans — use DM Sans or Libre Franklin */

@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

:root {
  --font-serif:  'Playfair Display', Georgia, serif;
  --font-sans:   'DM Sans', system-ui, sans-serif;
}

/* Scale */
h1  { font-family: var(--font-serif); font-weight: 800; font-size: clamp(2.6rem, 5vw, 4rem); line-height: 1.1; }
h2  { font-family: var(--font-serif); font-weight: 700; font-size: clamp(2rem, 3.5vw, 2.8rem); }
h3  { font-family: var(--font-serif); font-weight: 700; font-size: 1.2rem; }
body { font-family: var(--font-sans); font-size: 1rem; line-height: 1.65; color: var(--text-primary); }

/* Nav links */
.nav-link { font-family: var(--font-sans); font-size: 0.8rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; }

/* Year headings in publications */
.pub-year { font-family: var(--font-sans); font-weight: 700; font-size: 1rem; }

/* Hero eyebrow label */
.eyebrow { font-family: var(--font-sans); font-size: 0.78rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-muted); }
```

---

## 3. Layout & Spacing

```
Max content width:    1140px, horizontally centered
Section padding:      80px top/bottom (desktop), 48px (mobile)
Card gap (grid):      16px
Card padding:         24px (standard), 28px (people cards)
Border radius (card): 18px
Nav height:           56px
```

```css
.container {
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 24px;
}

section {
  padding: 80px 0;
}

/* Background zone split — upper sage, lower cream */
/* Apply --bg-sage to: #home, #news, #projects, #people */
/* Apply --bg-cream to: #publications, #sponsors, #contact */
```

---

## 4. Navigation

```
Position:       sticky top-0
Background:     --bg-cream (warm off-white, same as lower page)
Border-bottom:  1px solid rgba(0,0,0,0.08)
Height:         56px

Left:           "Lab Name" — var(--font-serif), font-weight:700, ~1.1rem
Right:          Nav links — uppercase, 0.8rem, var(--font-sans), font-weight:600
Active state:   2px solid underline in var(--accent-amber), offset ~4px below text
Hover state:    opacity drop to 0.65, no background pill
```

```html
<!-- Jekyll nav include pattern -->
<nav class="site-nav">
  <div class="container nav-inner">
    <a class="nav-brand" href="#home">{{ site.title }}</a>
    <ul class="nav-links">
      <li><a href="#home" class="nav-link {% if active == 'home' %}active{% endif %}">Home</a></li>
      <li><a href="#news"  class="nav-link">News</a></li>
      <!-- etc -->
    </ul>
  </div>
</nav>
```

---

## 5. Hero Section

```
Background:     var(--bg-sage)
Layout:         2-col (text left ~60%, stats card right ~35%), vertically centered
Padding-top:    100px
Padding-bottom: 80px

Eyebrow:        "KEYWORD / KEYWORD / KEYWORD" — uppercase, letter-spaced, muted
H1:             Bold serif, ~4rem, dark, left-aligned — the main statement
Body:           1rem sans, max-width ~540px
CTA row:        mt-32px, gap-16px

Button — primary:  filled var(--accent-green), white text, border-radius:999px (pill), padding:14px 28px
Button — outline:  transparent, 1.5px solid var(--text-primary), same pill shape, dark text

Stats card:
  background:   var(--bg-card)
  border-radius: 18px
  padding:      28px 32px
  display:      grid 2-col
  Stat number:  var(--font-serif) or bold sans, ~2.2rem, var(--text-primary)
  Stat label:   var(--font-sans), 0.85rem, var(--text-muted)
```

---

## 6. News Section

```
Background:   var(--bg-sage)
Layout:       Single column, full-width cards

Each card:
  background:     var(--bg-card)
  border-radius:  18px
  padding:        18px 24px
  display:        flex, space-between, align-items:center
  margin-bottom:  12px

  Left:   Number (bold, ~1rem) + news text (regular body)
  Right:  Date string — var(--text-muted), font-size:0.85rem, white-space:nowrap
```

```yaml
# _data/news.yml
- text: "One paper has been accepted to VLDB 2026."
  date: "Mar 20, 2026"
- text: "One paper has been accepted to ICDE 2026 (Round 2)."
  date: "Mar 19, 2026"
```

```liquid
{% for item in site.data.news %}
<div class="news-card">
  <span class="news-num">{{ forloop.index }}.</span>
  <span class="news-text">{{ item.text }}</span>
  <span class="news-date">{{ item.date }}</span>
</div>
{% endfor %}
```

---

## 7. Projects Section

```
Background:   var(--bg-sage)
Subtitle:     "Selected projects from our research program." — muted, 0.95rem
Layout:       2-column grid (equal width), gap:16px
              (stack to 1-col below ~768px)

Each card:
  background:     var(--bg-card)
  border-radius:  18px
  padding:        28px

  H3:             var(--font-serif), bold, 1.2rem
  Body:           var(--font-sans), 0.95rem, line-height:1.65
  Pub links row:  mt-16px
    Displayed as: [ ICDE'21 🔗 , VLDB'22 🔗 , ... ]
    Each link:    small badge pill, var(--badge-dark) bg, white text, font-size:0.72rem
    External icon:tiny square-arrow icon after label
```

```yaml
# _data/projects.yml
- title: "Automated Database Tuning"
  description: "This project focuses on..."
  publications:
    - label: "ICDE'21"
      anchor: "#pub-2021-icde-2"
    - label: "VLDB'22"
      anchor: "#pub-2022-vldb-1"
```

---

## 8. People Section

### Director Card (full-width feature)
```
Layout:       Single full-width white card
              Left: circular photo (~80px diameter)
              Right: Name (bold serif), Role (muted sans)
border-radius: 18px
padding:       24px 28px
```

### Current Members Grid
```
Layout:       5-column grid (desktop), 3-col (tablet), 2-col (mobile)
              Cards are uniform height via flex-column layout

Each card:
  background:     var(--bg-card)
  border-radius:  18px
  padding:        24px 16px
  text-align:     center
  display:        flex, flex-direction:column, align-items:center, gap:12px

  Photo:          circle crop, width:90px, height:90px, object-fit:cover
                  border-radius:50%
  Name:           var(--font-serif), font-weight:700, 1rem
  Role+years:     var(--font-sans), 0.82rem, var(--text-primary)
  Co-supervisor:  var(--font-sans), 0.78rem, var(--text-muted), font-style:italic
```

### Alumni Grid (same grid dimensions)
```
Same card structure BUT no photo — replace with initials avatar:

  Initials circle:
    width/height:   90px
    border-radius:  50%
    background:     var(--avatar-bg)   /* muted taupe */
    color:          var(--avatar-text) /* dark green */
    font-family:    var(--font-sans)
    font-weight:    700
    font-size:      1.4rem
    display:        flex, align-items:center, justify-content:center

  Alumni cards also show:
    - Degree + years (e.g. "PhD (2018-2023)")
    - Co-supervised with...
    - First position: Company/Institution

  Initials generation (Liquid):
    {{ person.name | split: " " | map: "first" | join: "" | upcase | truncate: 3, "" }}
    (takes first letter of each word, max 2-3 chars)
```

```yaml
# _data/people.yml
director:
  name: "Your Name"
  role: "Director"
  photo: "/assets/images/people/you.jpg"
  url: "https://yoursite.com"

current:
  - name: "Alice Smith"
    role: "PhD Student (2023-)"
    photo: "/assets/images/people/alice.jpg"
    cosupervisor: "Co-supervised with J. Doe."
    url: "https://..."

alumni:
  - name: "Bob Jones"
    degree: "PhD (2019-2024)"
    cosupervisor: "Co-supervised with X. Y."
    first_position: "Google, Research Scientist."
    url: "#"
```

---

## 9. Publications Section

```
Background:   var(--bg-cream)  ← background shifts here

Year heading: var(--font-sans), font-weight:700, font-size:1rem, margin-bottom:16px
              No decorative rule — just the year bold text

Each pub card:
  background:     var(--bg-card)
  border-radius:  18px
  padding:        18px 24px
  margin-bottom:  12px
  display:        flex, align-items:flex-start, gap:16px

  Number:     bold, min-width:24px, color:var(--text-muted)
  
  Venue badge (pill):
    min-width: fit-content
    padding:   4px 10px
    border-radius: 999px
    font-family:   var(--font-sans)
    font-size:     0.72rem
    font-weight:   700
    letter-spacing:0.04em
    text-transform:uppercase
    Use --badge-dark for top venues (VLDB, ICDE, SIGMOD, ICML, NeurIPS...)
    Use --badge-mid for mid-tier
    Use --badge-light for workshops, book chapters, arxiv

  Content block (flex:1):
    Title + authors in one paragraph, regular body size
    Authors in same colour, not dimmed

  Links row (flex-wrap: wrap, gap:6px, mt:8px):
    PDF badge:   var(--link-badge-pdf-bg), var(--link-badge-pdf-text)
    Other badges: var(--link-badge-bg), var(--link-badge-text)
    All badges:  border-radius:999px, padding:3px 10px, font-size:0.7rem, font-weight:600
                 text-transform:uppercase, letter-spacing:0.05em
```

```yaml
# _data/publications.yml
- year: 2026
  entries:
    - venue: "VLDB"
      venue_tier: "dark"   # dark | mid | light
      title: "Toward Drift-Aware Database Benchmarking."
      authors: "G. Liu and R. Borovica-Gajic."
      links:
        - label: "PDF"
          type: "pdf"
          url: "/files/paper.pdf"
        - label: "Link"
          type: "link"
          url: "https://..."
        - label: "BibTex"
          type: "link"
          url: "https://..."
```

```liquid
{% assign pubs_by_year = site.data.publications | sort: "year" | reverse %}
{% for year_group in pubs_by_year %}
  <h3 class="pub-year">{{ year_group.year }}</h3>
  {% for i in (1..year_group.entries.size) %}
    {% assign entry = year_group.entries[forloop.index0] %}
    <div class="pub-card">
      <span class="pub-num">{{ forloop.index }}.</span>
      <span class="venue-badge badge--{{ entry.venue_tier }}">{{ entry.venue }}</span>
      <div class="pub-content">
        <p>{{ entry.title }} {{ entry.authors }}</p>
        <div class="pub-links">
          {% for link in entry.links %}
            <a href="{{ link.url }}" class="link-badge badge--{{ link.type }}">{{ link.label }}</a>
          {% endfor %}
        </div>
      </div>
    </div>
  {% endfor %}
{% endfor %}
```

---

## 10. Sponsors Section

```
Background:   var(--bg-cream)
Layout:       4-column grid (desktop), 2-col (tablet), 1-col (mobile), gap:16px

Each card:
  background:     var(--bg-card)
  border-radius:  18px
  padding:        28px 24px
  text-align:     center
  display:        flex, flex-direction:column, align-items:center, gap:16px

  Name:     var(--font-sans), font-weight:700, 1rem
  Logo img: max-height:60px, object-fit:contain
```

---

## 11. Contact Section

```
Background:   var(--bg-cream)
Layout:       2-column grid (top row: Email + Join Us), then Location card full-width

Cards:
  background:     var(--bg-card)
  border-radius:  18px
  padding:        24px 28px

  Card heading:   var(--font-sans), font-weight:700, 1rem
  Card content:   body sans, 0.95rem

Location card:
  Full-width (grid-column: 1 / -1)
  Embedded Google Maps iframe below address text
  iframe: border:none, border-radius:12px, width:100%, height:280px
```

---

## 12. Footer

```
Background:   var(--bg-cream)
Border-top:   1px solid rgba(0,0,0,0.1)
Padding:      40px 0

Layout:       Simple stacked text, left-aligned (or centered)
  Lab name:   var(--font-serif), font-weight:700, 1.1rem
  Tagline:    var(--font-sans), 0.9rem, var(--text-muted)
  Copyright:  var(--font-sans), 0.8rem, var(--text-muted), margin-top:12px
```

---

## 13. Cards — Universal Rules

All cards on this site share the same base:

```css
.card {
  background: var(--bg-card);
  border-radius: 18px;
  border: 1px solid var(--border-card);
  /* No box-shadow by default — clean, flat */
}

/* Subtle lift on interactive cards */
.card--interactive:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
```

---

## 14. Jekyll File Structure

```
_config.yml
_data/
  news.yml
  projects.yml
  people.yml
  publications.yml
  sponsors.yml
_includes/
  nav.html
  hero.html
  news.html
  projects.html
  people.html
  publications.html
  sponsors.html
  contact.html
  footer.html
_layouts/
  default.html        ← pulls in all includes in order
assets/
  css/
    main.scss         ← imports variables, components
    _variables.scss
    _nav.scss
    _hero.scss
    _cards.scss
    _people.scss
    _publications.scss
    _footer.scss
  images/
    people/
index.html            ← front matter + layout:default
```

### `index.html`
```html
---
layout: default
---
{% include hero.html %}
{% include news.html %}
{% include projects.html %}
{% include people.html %}
{% include publications.html %}
{% include sponsors.html %}
{% include contact.html %}
```

### `_layouts/default.html`
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ page.title | default: site.title }}</title>
  <link rel="stylesheet" href="{{ '/assets/css/main.css' | relative_url }}">
</head>
<body>
  {% include nav.html %}
  <main>{{ content }}</main>
  {% include footer.html %}
</body>
</html>
```

---

## 15. Responsive Breakpoints

```css
/* Mobile first */
@media (min-width: 640px)  { /* tablet: 2-col people grid */ }
@media (min-width: 768px)  { /* tablet: 2-col projects, 3-col people */ }
@media (min-width: 1024px) { /* desktop: 5-col people, 2-col projects, 4-col sponsors */ }
```

---

## 16. Interaction Notes

- `scroll-behavior: smooth` on `<html>` for anchor nav
- Nav active state updates on scroll via small JS `IntersectionObserver` watching `<section id="...">` elements
- No page transitions — it's a true single-page scroll site
- People cards: entire card is a link (`<a>` wrapping the card) with `text-decoration:none`
- Publication link badges open in `target="_blank" rel="noopener"`

---

## 17. Quick Visual Summary

| Element | Font | Weight | Size | Colour |
|---|---|---|---|---|
| Hero H1 | Playfair Display | 800 | ~4rem | `--text-primary` |
| Section H2 | Playfair Display | 700 | ~2.8rem | `--text-primary` |
| Card H3 | Playfair Display | 700 | 1.2rem | `--text-primary` |
| Body copy | DM Sans | 400 | 1rem | `--text-primary` |
| Nav links | DM Sans | 600 | 0.8rem | `--text-primary` |
| Muted text | DM Sans | 400 | 0.82rem | `--text-muted` |
| Eyebrow | DM Sans | 500 | 0.78rem | `--text-muted` |
| Venue badge | DM Sans | 700 | 0.72rem | white on dark |
| Link badge | DM Sans | 600 | 0.7rem | see palette |

---

*Generated from live screenshots of danais-lab.com. All tokens are approximate — adjust to taste once rendered.*