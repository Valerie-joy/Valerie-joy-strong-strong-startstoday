# Strong Starts Today — Homepage Redesign

A redesign concept for the Strong Starts Today homepage (The Strong Collective / The KASH Method). It is aimed at women ages 35–65.

Open `index.html` in a browser to view it. With GitHub Pages enabled, it also works as a live preview.

> This is a design preview. The checkout section is a **styling target** for the existing GoHighLevel order form, not a working checkout. Nothing on the live site was changed.

## Page structure

1. **Hero:** real-text H1 "Your Strong Starts Here.", tagline, primary CTA "Begin Your Strong Start"
2. **A Different Kind of Strong:** emotional connection, built from existing copy
3. **The Strong Collective Experience:** the four pillars in a numbered editorial grid
4. **What your 14 days include:** the six inclusions, on deep green
5. **Strength for the life you're living:** lifestyle photo story
6. **A simple invitation:** $49.97 one-time, no automatic renewal, you decide at day 14
7. **Enrollment:** labelled fields, error state, payment methods, one order summary, a consistent $49.97 total
8. **Closing:** "You are a different kind of strong." plus a final CTA and footer

Every CTA links to `#enroll`.

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

**Worth keeping:** the palette, the warm and honest copy, the hero photo, and the clear offer terms.

## Design system

**Color** (from the live page's computed styles)

| Token | Hex | Use |
|---|---|---|
| Deep green | `#183D2D` | Buttons, headings, anchor sections |
| Warm ivory | `#F7F3E8` | Canvas (alternate band `#EFE8D6`) |
| Brand gold | `#B59645` | Rules, numerals, arches, focus ring (decorative only; 2.6:1 on ivory) |
| Gold ink | `#7A6124` | Gold-colored text on ivory (5.2:1) |
| Chartreuse | `#D7DF21` | Only on green: eyebrows, checks, closing CTA |
| Body | `#3F4B45` | Paragraphs |
| Error | `#A3341F` | Always paired with an icon and text |

**Type**

- **Cormorant Garamond:** display (52–104px), H2 (40–64px), H3 32px, italic pull lines
- **Lato:** body (18–19px, line-height 1.65), labels (15px bold), eyebrows (13px, letter-spacing .3em)
- Retire Lora and Muli.

**Spacing:** 8px base; sections 80–144px tall; max width 1240px; 24px mobile gutter; touch targets of at least 44px, with primary CTAs at 60px.

**Imagery:** real women aged about 40–65, varied bodies, natural light, no text on photos. The recurring motif is an arch with an offset gold hairline.

**Motion:** subtle fades and a 1px button lift; all motion is disabled under `prefers-reduced-motion`.

## Implementation notes

- **Checkout:** keep the existing GHL order form (Stripe card, PayPal, Cash App Pay, Amazon Pay, coupon). Restyle it with custom CSS in the funnel to match this layout.
- **Remove** the on-load checkout popup.
- **Fix** the $0.00 total so it never shows: render the correct total initially, or hide the total until it's calculated.
- **Photos:** the three photo frames are placeholders. Replace them with the original hero file (re-cropped without the baked-in text) and new photography.
- **Not verified:** the live mobile layout, coupon logic, and the Terms & Conditions URL (the link is currently `#terms`).
- **Needs site access:** the original photo files, the logo, and the GHL funnel editor.
