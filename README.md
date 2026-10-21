# Strong Starts Today — Homepage Redesign

A redesign concept for the Strong Starts Today homepage (The Strong Collective / The KASH Method). It is aimed at women ages 35–65.

**Live preview:** https://valerie-joy.github.io/Valerie-joy-strong-strong-startstoday/

> This is a portfolio sample. The checkout is a **working demo**: it validates the form, switches payment methods, responds to coupons and shows a confirmation, but **no payment is processed and nothing is sent or saved**. The card fields are locked to Stripe's public test card. Text in highlighted `[brackets]` must come from the brand before launch. Nothing on the client's live site or accounts was touched.

## How the code is organized

```
index.html              ← built file that GitHub Pages serves (don't edit by hand)
build.py                ← stitches the pieces below into index.html
src/
  layout.html           ← <head>, fonts, meta tags, page shell
  sections/             ← one file per section of the page
    header.html         ← sticky nav
    hero.html
    different-kind.html
    experience.html     ← the four pillars
    included.html
    how-it-works.html
    lifestyle.html
    coach.html
    pricing.html
    faq.html
    enroll.html         ← demo checkout (front-end only)
    closing.html        ← closing statement + footer
    mobile-cta.html     ← sticky price bar on phones
assets/
  styles.css            ← design tokens + one block of styles per section
  main.js               ← sticky-nav highlight, scroll reveal, mobile CTA bar, demo checkout logic
```

**To edit a section:** change its file in `src/sections/`, then run:

```
python3 build.py
```

Commit both the section file and the rebuilt `index.html`. To reorder, add or remove sections, edit the lists at the top of `build.py`.

## Page structure

1. **Sticky nav:** section links (desktop) and an always-visible "Begin" button
2. **Hero:** real-text H1, tagline, primary CTA
3. **A Different Kind of Strong:** emotional connection
4. **The Strong Collective Experience:** the four pillars
5. **What your 14 days include:** the six inclusions
6. **How it works:** enroll → get access → show up your way
7. **Strength for the life you're living:** lifestyle photo story
8. **Meet your coach:** *needs the brand's bio and photo*
9. **A simple invitation:** $49.97 one-time, no automatic renewal
10. **FAQ:** two answers from the live terms, four *need the brand's answers*
11. **Enrollment:** demo checkout with validation, payment method switch, coupon message, loading state and confirmation screen
12. **Closing:** final statement, CTA, legal footer
13. **Mobile CTA bar:** appears after the hero on phones and hides at checkout

## Before launch: content needed from the brand

- Original hero photo (to re-crop without the baked-in headline), plus lifestyle and coach photos
- The coach's name, a short bio and a quote
- FAQ answers: beginners, equipment, live schedule, Kash Connect
- Confirmation that access details are sent by email (How It Works, step 2)
- The Terms & Conditions URL (the footer link is currently `#terms`)
- Real testimonials, if any exist. None were added, so no social proof is made up.

## Audit of the current page

| Priority | Issue |
|---|---|
| High | A checkout popup opens on page load: off-brand blue (#1571A8), with a duplicate "Contact Name" field |
| High | The raw HTML ships "Order Total $0.00", which only updates to $49.97 after scripts run |
| High | The hero headline is part of the image, so there is no real H1 and no CTA above the fold |
| Medium | The ask comes before the value: the payment form sits above the benefits |
| Medium | Four typefaces (Cormorant, Lato, Lora, Muli) are in use, plus a Times New Roman fallback |
| Medium | The offer panel has no padding and is misaligned with the form; chartreuse is used on large text |
| Medium | The checkout looks embedded: blue prices, placeholder-only labels, the item listed twice |
| Low | About 15px body text in the pillars; the closing line has no CTA |

## Design system

| Token | Hex | Use |
|---|---|---|
| Deep green | `#183D2D` | Buttons, headings, anchor sections |
| Warm ivory | `#F7F3E8` | Canvas (alternate band `#EFE8D6`) |
| Brand gold | `#B59645` | Rules, numerals, arches, focus ring (decorative only on ivory) |
| Gold ink | `#7A6124` | Gold-colored text on ivory (5.2:1) |
| Chartreuse | `#D7DF21` | Only on green |
| Body | `#3F4B45` | Paragraphs |
| Error | `#A3341F` | Always paired with an icon and text |

**Type:** Cormorant Garamond for headings and pull lines; Lato for body text (18–19px), labels and buttons. Retire Lora and Muli.

**Spacing:** 8px base; max width 1240px; touch targets of at least 44px, with primary CTAs at 60px.

**Motion:** sections fade up once on scroll; all motion is off under `prefers-reduced-motion`.

## Implementation notes for the live GHL funnel

- For a real build, replace the demo form in `enroll.html` with the brand's GoHighLevel order form (Stripe card, PayPal, Cash App Pay, Amazon Pay, coupon) and restyle it with custom CSS to match.
- Remove the on-load checkout popup.
- Fix the $0.00 total so it never shows: render the correct total initially, or hide the total until it's calculated.
- Tested at 375, 390, 768 and 1440px with no horizontal overflow. Not verified: the live site's mobile layout and coupon logic.
