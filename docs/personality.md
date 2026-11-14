# Personality spec: from "stale and AI-generated" to warm and human

**Goal:** Make the Yord site ([site/](../site/)) feel like a friendly local adviser you'd trust with your family's biggest purchase. Today it reads like a generic SaaS template.

**Sources:** We studied three Dutch mortgage sites on 2026-11-14:
- **De Hypotheker:** hypotheker.nl, campaign page "afspraak hypotheekgesprek".
- **De Hypotheekshop:** hypotheekshop.nl, homepage.
- **Hypotheek Visie Groningen:** hypotheekvisie.nl/groningen, local office page.

**Method:** Findings come from their HTML, CSS and copy. Hex values and fonts were pulled from their stylesheets.

> **Rule for the implementing agent:** Never invent facts. Don't make up reviews, ratings, review counts, years in business, adviser names, photos or addresses. Wherever this spec calls for one, add a clearly marked placeholder (e.g. `[review: naam, plaats]`, `[foto: Yord aan tafel met klant]`). The owner fills them in. A fake 9,8 rating destroys the trust we are trying to build.

---

## 1. Why the current site feels AI-generated

| Current pattern | Why it reads as template/AI |
|---|---|
| Dark slate background (`--surface: #2c3638`) everywhere | Every reference site is **light**: white plus soft tinted panels. Dark UIs read as tech/fintech, not "home". |
| An uppercase eyebrow above every heading (`PARTICULIER`, `ZAKELIJK`…) | The most recognisable AI-landing-page tic. None of the reference sites do this. |
| Four sections with the same 4-up card grid of title + grey paragraph | Monotone rhythm. Reference sites alternate between photo + story, icon tiles, logo wall, reviews, FAQ and forms. |
| No people, no photos, no faces | All three reference sites lead with **humans**: an adviser portrait, a team photo, client stories with first names. |
| No proof (reviews, rating, lender count, credentials) | Every reference site repeats its rating and "40+ geldverstrekkers" several times. |
| Neutral, encyclopaedic copy ("Hypotheek als ondernemer") | The reference sites speak to *you* about *your plan, your dream home, your situation*. |
| Product categories (Particulier / Zakelijk / Verduurzamen) as navigation | The reference sites organise by **life moment** ("Eerste huis kopen", "Groter wonen", "Scheiden", "Trouwen", "Pensioen"). |
| Placeholders like `[telefoonnummer]` in a cold `dl` list | Contact should feel like an invitation: "Bel Yord", opening hours, "we bellen je vaak binnen 4 uur terug". |

---

## 2. What creates the "homey" vibe: the shared ingredients

All three sites use the same recipe. In order of impact:

1. **A face.** A named adviser with a photo, a role and a direct line. Hypotheek Visie names everyone, e.g. "Erik de Wiljes, franchisenemer & financieel adviseur". It shows portraits, a team photo, the meeting room and even the waiting room. The Hypotheker campaign page shows one adviser, "Carina". For a one-person practice like Yord this is the single biggest win: **Yord is the brand. Show Yord.**
2. **Life-moment framing.** The visitor is a person in a situation, not a product segment. Examples: "Is het jouw plan om groter te wonen?", "Wat is jouw situatie?", "Starters in Groningen". Hypotheekshop's hero image is literally "Gezin in tuin aan tuintafel" (a family at a garden table).
3. **Low-pressure reassurance, repeated.** "Het eerste gesprek is altijd gratis", "vrijblijvend", "nog geen ramp" (said about a missing document), "Er is meer mogelijk dan je denkt!", "onze adviseurs nemen de tijd voor jouw plan".
4. **Social proof everywhere.**
   - **Ratings:** Advieskeuze 9,8 (Hypotheker, Hypotheekshop) and 9,9, plus Google 5,0 (Visie), shown in the hero *and* the footer.
   - **Testimonials:** first name, place and a quote that names the adviser, e.g. "Vanaf de eerste afspraak voelde ik mij op mijn gemak bij Erik."
5. **Independence and breadth as a trust badge.** "40+ geldverstrekkers" plus a logo wall, "Écht onafhankelijk advies", and "Wij krijgen geen afsluitprovisie". Credentials appear as badges: Erkend Hypotheekadviseur, Advieswijzer keurmerk.
6. **Local roots.** Hypotheek Visie names the address and the building's history, local neighbourhoods (Oosterpoort, Paddepoel…), new-build projects, landmarks and local partners (makelaar, Energiebespaarders). It also lists evening opening hours. "Altijd bij jou in de buurt!" (Hypotheekshop).
7. **A tiny bit of playfulness.** De Hypotheker's cookie button says "Jazeker" (its slogan). Its cookie banner says "Fijn dat je onze website bezoekt!". Recruitment copy says "staan te springen". One or two of these winks per page; never jokey about money itself.
8. **Clear price transparency, in a friendly way.** "Wat betaal je ons?" followed by indicative fixed fees per service.

---

## 3. Visual language (measured)

### 3.1 Colour: light, with one warm accent

| Site | Base | Primary | Warm accent |
|---|---|---|---|
| De Hypotheker | `#fff`, soft panel `#e8eff1` | navy `#00325d` | orange `#ff5504`, plus green `#0f916c` |
| Hypotheekshop | `#fff`, `#f3f3f3`, `#f4f7fc` | navy `#183172` / `#0e2050` | orange `#ef7c00` / `#f65027` |
| Hypotheek Visie | `#fff`, `#eaf2fa`, `#f2f9ff` | navy `rgb(0 45 109)` | soft red `rgb(204 73 89)` with pink tint `rgb(253 222 215)`, `#fff5f3` |

**The pattern:**
- White page.
- Very soft tinted panels (cool blue-grey or warm blush) to separate sections. No borders.
- A deep, calm primary for text and headings.
- **One warm accent** (orange or coral) reserved for the main CTA and small highlights.

**For Yord:** keep the brand green from the logo (`--yord-green: #278e66`) as the primary. Go light, and add a warm accent. Suggested starting tokens, to be tuned against the logo and checked for WCAG AA:

```css
:root {
  --surface: #ffffff;
  --surface-soft: #f3f8f5;     /* soft green tint panel */
  --surface-warm: #fdf4ec;     /* soft warm/sand panel, for "home" sections */
  --ink: #1d2b27;              /* deep green-black, not pure black */
  --ink-muted: #56645f;
  --primary: #278e66;          /* Yord green: headings accents, links, secondary buttons */
  --primary-dark: #1d6e4f;
  --accent: #f07c3a;           /* warm orange/terracotta: ONLY the main CTA + tiny highlights */
  --accent-dark: #d4652a;      /* hover; check contrast with white text, darken if needed */
}
```

**Colour rules:**
- **Dark mode:** drop it as the default. Optional `prefers-color-scheme: dark` support is fine but secondary.
- **Section rhythm:** alternate `--surface` / `--surface-soft` / `--surface-warm`. Never put a 1px border between sections (the current `.section { border-top }` goes).

### 3.2 Typography: friendly, rounded-ish, one family is fine

- **Fonts:**
  - **Hypotheker:** DIN Next (Bold + Light).
  - **Hypotheekshop:** DIN 2014 (Typekit).
  - **Visie:** Poppins.
- **What they share:** a clean, slightly geometric/humanist sans with friendly round shapes, mostly in a **single family**. Headings are bold, but not shouting (no 800 weight, no tight negative tracking).
- **For Yord:** replace Montserrat 800 + Inter with one warm geometric family from Google Fonts, e.g. **Poppins**, **Nunito Sans** or **Outfit**. Use 600–700 for headings and 400 for body.
- **Sentence case** for every heading. Remove all `text-transform: uppercase`.
- **Body text:** 17–18px with generous line height. Mortgage visitors read carefully.

### 3.3 Shape, depth and motion

- **Radius:**
  - **Hypotheker:** 8px cards, 20–50px pills/buttons, lots of `50%` circles (avatars, icon badges).
  - **Hypotheekshop:** 4–12px.
  - **Visie:** `rounded-lg` (8px) on photos and cards, full-round pills.
- **Yord radius tokens:**
  - **Cards and photos:** 12–16px.
  - **Buttons:** fully rounded pills (`999px`).
  - **Avatars and icon badges:** circles.
  - **Inputs:** 8px (not the current 2px).
- **Depth:** soft, stacked shadows instead of borders. Hypotheekshop uses a "shadow-stacked" card that grows on hover. Example: `box-shadow: 0 1px 2px rgb(0 0 0 / .04), 0 8px 24px rgb(0 0 0 / .06)`, with a larger shadow on hover.
- **Micro-interaction:** Hypotheekshop puts a small round arrow badge next to links, which nudges right on hover (`group-hover:translate-x-1`). Small, friendly, cheap. Respect `prefers-reduced-motion`.

### 3.4 Imagery and icons

- **Photography beats illustration.** Real people around a kitchen table, keys and front doors, a couple with boxes, a family in a garden. Photos sit in rounded rectangles, sometimes overlapping a tinted panel.
- **Life-moment icons:** Visie uses small friendly icons per situation (eerste huis, trouwen, pensioen, nieuwe baan, verbouwen, scheiden, overlijden, zzp, overwaarde, oversluiten). Pick **one** consistent set: rounded line icons in the primary colour on a soft circular badge.
- **Logo wall** of lenders on white "tiles" with soft shadows (Hypotheekshop, Hypotheker).
- **Placeholders for the owner (do not use AI-generated faces):**
  - `[foto: portret Yord, lachend, natuurlijk licht]`
  - `[foto: Yord in gesprek aan keukentafel]`
  - `[foto: kantoor/werkplek]`
- **Stock lifestyle images:** use neutral, clearly-stock imagery or leave a placeholder. Don't present stock people as clients.

---

## 4. Voice and copy

### 4.1 Tone rules

- **Address:** always informal **je/jij/jouw**. Be consistent; De Hypotheker mixes in "u" and it feels off. Never "u".
- **Perspective:** talk about the visitor's **plan, home and situation**, not about mortgage products. "Jouw eerste huis", not "Starterhypotheek".
- **Sentences:** short. One idea each. Questions are welcome in headings.
- **Reassure on the three real fears:** cost ("wat kost het?"), commitment ("zit ik ergens aan vast?") and complexity ("snap ik het wel?"). Answer them early and repeatedly.
- **Brand phrases:** one or two exclamation marks per page, maximum. No hype words ("revolutionair", "naadloos", "ontzorgen", "op maat gemaakte oplossingen").
- **First person plural:** write as "wij/we/ons", never "ik/mij/mijn": "Wij nemen de tijd voor jouw plan." Keep it personal and direct; avoid distant phrasing like "onze adviseurs". Questions in the visitor's own voice (FAQ, form options, "Ja, bel me terug") stay in "ik".
- **Signature line:** give Yord one, like Hypotheekshop's "Tijd voor jouw plan" or Hypotheker's "Jazeker". Suggestions (owner picks): "Gewoon goed geregeld.", "Samen naar je sleutel.", "Bij Yord zit je goed." Use it in the hero, the closing CTA and the footer.

### 4.2 Before → after examples

| Current | Warmer direction |
|---|---|
| Eyebrow `HYPOTHEEKADVIES` + "Weet in één minuut wat je kunt lenen" | "Droomhuis gezien? Ontdek in één minuut wat je kunt lenen." (no eyebrow) |
| "Bekijk wat we doen" | "Plan een gratis kennismaking" (accent CTA) + "Of bel me even: [telefoon]" |
| "Hypotheekadvies voor je eigen huis" | "Wat is jouw plan?" with life-moment tiles below |
| "Eerste huis kopen: Van maximale hypotheek tot startersvrijstelling en NHG…" | "Je eerste huis. Spannend! Ik leg je stap voor stap uit wat je kunt lenen, wat startersvrijstelling is en wanneer NHG slim is." |
| "Hypotheek als ondernemer" | "Ondernemer? Dan kijken banken net even anders. Ik weet welke stukken ze willen zien." |
| "Over Yord Financieel Advies" + 4 cards "Stap 1…4" | "Hoi, ik ben [voornaam]" + photo + a short personal story, then "Zo gaan we samen te werk" as a friendly numbered timeline ending in "…en dan krijg je de sleutel 🔑" (one emoji at most, optional) |
| "Plan een gesprek" / "Verstuur" | "Zullen we kennismaken?" / button "Ja, bel me terug" + microcopy "Op werkdagen bel ik je meestal binnen [x] uur terug. Het eerste gesprek is gratis en vrijblijvend." |
| "Indicatieve berekening op basis van vereenvoudigde leennormen…" | Keep it, but add a friendly follow-up: "Dit is een eerste indicatie. In een gesprek kijken we samen naar jouw volledige situatie." |

### 4.3 Reusable reassurance microcopy (adapt freely)

- "Het eerste gesprek is altijd gratis en vrijblijvend."
- "Je weet vooraf precies wat mijn advies kost."
- "Ik krijg geen provisie van banken. Mijn advies gaat over jou."
- "Geen domme vragen. Echt niet."
- "Mist er een document? Geen ramp, dat regelen we samen."
- "Ook 's avonds of online, wat jou uitkomt."

---

## 5. Page structure to aim for

Replace the current "hero + four identical card sections + contact" with a varied rhythm. Each block gets a different layout so the page doesn't feel generated.

1. **Header (white, sticky):**
   - Logo; the current `mix-blend-mode: lighten` hack must go on a light background, so use a light-background logo variant.
   - Nav by life moment or task: *Huis kopen · Oversluiten · Ondernemers · Verduurzamen · Over mij · Contact*.
   - Phone number as a text link, plus the accent pill CTA "Gratis kennismaking".
2. **Hero:**
   - **Left:** question-style headline, one reassuring sentence, three check-mark USPs ("Eerste gesprek gratis", "Onafhankelijk, [x]+ geldverstrekkers", "Eén vast aanspreekpunt: ik"), CTA, and a review badge placeholder (`[Advieskeuze/Google score]`).
   - **Right:** the calculator as a white card with a soft shadow, *or* a rounded photo of Yord with the calculator directly below the hero.
3. **"Wat is jouw plan?":** a grid of 6–8 life-moment tiles. Each tile has an icon in a soft circle, a short label and an arrow badge. Suggested tiles: Eerste huis, Groter wonen, Oversluiten, Verbouwen/verduurzamen, Ondernemer/zzp, Samenwonen/trouwen, Uit elkaar, Pensioen.
4. **Story block (warm panel):** photo left, text right. A life-moment narrative à la Hypotheekshop's "groter wonen": "Het huis wordt te klein, de kinderen willen een tuin…" → link.
5. **"Hoi, ik ben [voornaam]":** portrait, a short personal intro (why I do this, where I'm from, something human like a hobby or the region), credentials badges (Erkend Hypotheekadviseur, AFM/Kifid placeholders) and the direct phone line.
6. **Independence strip:** "Ik vergelijk [x]+ geldverstrekkers" + lender logo wall on white tiles.
7. **Reviews:** 3–5 cards, each with quote, first name, place and month/year. Owner-supplied only; until then, a placeholder section that is hidden by default.
8. **"Zo werken we samen":** a numbered timeline (horizontal on desktop, vertical on mobile) with icons. Not cards.
9. **"Wat kost het?":** transparent fee cards, owner-supplied amounts.
10. **FAQ accordion:** real visitor fears, e.g. "Heb ik een vast contract nodig?", "Kan ik als zzp'er een hypotheek krijgen?", "Wat als mijn rentevaste periode afloopt?".
11. **Closing CTA (accent-tinted panel):** "Klaar voor de volgende stap?" + short callback form (voornaam, telefoon, e-mail optioneel; Visie's 2–3 field hero form is the model) + "Bel me: [telefoon]".
12. **Footer:**
    - Repeat the signature line and review score.
    - Address, region and opening hours (incl. evening, if true).
    - KvK, AFM and Kifid numbers; privacy link.

**Mobile:**
- The phone CTA should be reachable at all times (a sticky bottom bar with "Bel" + "Afspraak" is a common pattern).
- Don't hide the header CTA on mobile as the current CSS does.

---

## 6. Forms: friendlier, shorter

- **Callback form:** first name + phone (+ optional email). Visie does this in the hero.
- **Contact form:**
  - **Situation:** a "Waar kan ik je mee helpen?" dropdown with life moments. Hypotheker's options are a good model: "Oriënteren", "Woning gekocht", "Hypotheek oversluiten", "Einde rentevaste periode", "Andere vraag".
  - **Helper text** explaining *why* a field is asked: "Je telefoonnummer gebruik ik alleen om je terug te bellen."
- **Success state:** human, with a timeframe. "Dank je, [voornaam]! Ik bel je binnen één werkdag."
- **Marketing consent:** never pre-tick it.

---

## 7. Don'ts

- **Uppercase eyebrows** above headings.
- **Identical 4-card grids** in consecutive sections.
- **Pure black or dark-slate page backgrounds.**
- **Thin 1px borders as the main separator.** Use whitespace and tinted panels.
- **Gradients, glassmorphism, glowing blobs** and other "AI startup" décor.
- **Fabricated reviews, scores, client photos or adviser names.**
- **Formal "u".**
- **Jargon without a plain explanation** next to it.

## 8. Acceptance checklist for the implementing agent

- [ ] Light theme with Yord green as primary and one warm accent used only for primary CTAs and small highlights.
- [ ] One friendly font family, sentence-case headings, no uppercase eyebrows.
- [ ] Pill buttons, 12–16px rounded cards and photos, soft shadows; no section borders.
- [ ] A visible human: Yord's portrait and personal intro (placeholder if no photo yet).
- [ ] Life-moment navigation/tiles instead of product categories.
- [ ] Review, credential and lender-count slots present (placeholders if no data yet, never invented).
- [ ] Reassurance microcopy ("gratis", "vrijblijvend", "kosten vooraf") appears in hero, near the forms and in the closing CTA.
- [ ] At least five visually distinct section layouts on the homepage.
- [ ] Copy uses je/jij throughout, short sentences, first person where Yord speaks.
- [ ] Contrast meets WCAG AA; focus states visible; `prefers-reduced-motion` respected.
- [ ] Calculator still works ([site/js/rekentool.js](../site/js/rekentool.js)); only its styling and surrounding copy change.
