# 📱 Mobile UI/UX Improvement Plan

> **Goal**: Make every page and component feel native on phones (320px–430px) without regressing any desktop layout.  
> **Strategy**: Use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`) to layer mobile-first overrides. Never remove a desktop class—only prepend a smaller-breakpoint alternative.

---

## 🔴 Priority 1 — Critical Layout Breaks

### 1.1 Extension Promo: Double Viewport Height on Mobile

**File**: [`apps/web/src/components/home/extension-promo.tsx`](file:///home/muaviz/dev/based/inprogress/prebunk/apps/web/src/components/home/extension-promo.tsx)  
**Problem**: `min-h-[calc(100svh-1rem)]` forces a second full-screen section after the Hero. On mobile (single column), users must scroll through two entire viewport heights before seeing any claims.  
**Fix**: Remove the full-viewport lock on mobile. Keep it on desktop where the Hero and Promo sit side-by-side.

```
// Line 8 — change:
min-h-[calc(100svh-1rem)]
// to:
min-h-0 py-16 lg:min-h-[calc(100svh-1rem)] lg:py-24
```

### 1.2 Extension Promo: Popup Clipping on Narrow Screens

**File**: [`apps/web/src/components/home/extension-promo.tsx`](file:///home/muaviz/dev/based/inprogress/prebunk/apps/web/src/components/home/extension-promo.tsx)  
**Problem**: The mock popup is positioned `absolute right-8 w-64` inside an `overflow-hidden` container. On screens < 360px, the popup's left edge is clipped by ~16px.  
**Fix**: Use responsive positioning and constrain width on mobile.

```
// Line 23 — change:
absolute right-8 top-12 w-64
// to:
absolute right-4 top-10 w-56 sm:right-8 sm:top-12 sm:w-64
```

### 1.3 "Recently Tracked Claims" Section Right-Aligns on Mobile

**File**: [`apps/web/src/app/page.tsx`](file:///home/muaviz/dev/based/inprogress/prebunk/apps/web/src/app/page.tsx)  
**Problem**: Line 79 uses `flex flex-col items-end`, which pushes the heading and "View All Claims" button to the right edge when the layout is stacked vertically on mobile.  
**Fix**: Left-align on mobile, right-align only on desktop.

```
// Line 79 — change:
flex flex-col items-end justify-between gap-4 md:flex-row
// to:
flex flex-col items-start justify-between gap-4 md:flex-row md:items-end
```

---

## 🟠 Priority 2 — Typography & Spacing

### 2.1 Hero: Excessive Top Padding

**File**: [`apps/web/src/components/landing/hero.tsx`](file:///home/muaviz/dev/based/inprogress/prebunk/apps/web/src/components/landing/hero.tsx)  
**Problem**: `pt-[clamp(9rem,28vh,16rem)]` pushes the headline ~144px down. On a 667px iPhone SE, that consumes ~22% of the viewport before any text appears.  
**Fix**: Use a smaller fixed padding on mobile, let `clamp` kick in on larger screens.

```
// Line 8 — change:
pt-[clamp(9rem,28vh,16rem)]
// to:
pt-28 sm:pt-36 lg:pt-[clamp(9rem,28vh,16rem)]
```

### 2.2 Featured Threat Card: Excessive Inner Padding

**File**: [`apps/web/src/components/claims/featured-threat-card.tsx`](file:///home/muaviz/dev/based/inprogress/prebunk/apps/web/src/components/claims/featured-threat-card.tsx)  
**Problem**: `p-8` (32px all sides) + container `px-6` (24px) = 112px of horizontal padding on mobile. On a 320px screen, only 208px remains for actual content.  
**Fix**: Step down padding on mobile.

```
// Line 12 — change:
p-8
// to:
p-5 sm:p-6 md:p-8
```

### 2.3 Claim Detail Page: Nested Card Padding

**File**: [`apps/web/src/app/claims/[id]/page.tsx`](file:///home/muaviz/dev/based/inprogress/prebunk/apps/web/src/app/claims/%5Bid%5D/page.tsx)  
**Problem**: The glass-surface sidebar cards at lines 172, 186, 207 use `p-6`, stacking with the container `px-6`. Same excessive padding issue.  
**Fix**: Reduce card padding on mobile.

```
// Lines 172, 186, 207 — change:
glass-surface rounded-2xl p-6
// to:
glass-surface rounded-2xl p-4 sm:p-6
```

### 2.4 Section Headings: Unresponsive `text-3xl`

**Files**:
- [`apps/web/src/app/page.tsx`](file:///home/muaviz/dev/based/inprogress/prebunk/apps/web/src/app/page.tsx) (lines 46, 81)
- [`apps/web/src/components/landing/how-it-works.tsx`](file:///home/muaviz/dev/based/inprogress/prebunk/apps/web/src/components/landing/how-it-works.tsx) (line 27)
- [`apps/web/src/components/landing/impact-evidence.tsx`](file:///home/muaviz/dev/based/inprogress/prebunk/apps/web/src/components/landing/impact-evidence.tsx) (line 8)

**Problem**: `text-3xl` (30px) headings like "High Alert: Emerging Threats" wrap to 3 lines on 320px screens.  
**Fix**: Scale down to `text-2xl` on base mobile.

```
// All instances — change:
text-3xl font-bold
// to:
text-2xl font-bold sm:text-3xl
```

### 2.5 Featured Threat Card: Heading Icon Alignment

**File**: [`apps/web/src/components/claims/featured-threat-card.tsx`](file:///home/muaviz/dev/based/inprogress/prebunk/apps/web/src/components/claims/featured-threat-card.tsx)  
**Problem**: Line 31 uses `flex items-center gap-2` on the heading. When the title wraps to 3 lines on mobile, the warning icon is vertically centered against all 3 lines instead of sitting next to the first line.  
**Fix**: Change to `items-start` so the icon pins to the top.

```
// Line 31 — change:
flex items-center gap-2
// to:
flex items-start gap-2
```

### 2.6 Privacy Page: Title Too Large

**File**: [`apps/web/src/app/privacy/page.tsx`](file:///home/muaviz/dev/based/inprogress/prebunk/apps/web/src/app/privacy/page.tsx)  
**Problem**: `text-4xl` on mobile is oversized for a single-word "Privacy Policy" heading.  
**Fix**:

```
// Line 17 — change:
text-4xl font-bold tracking-tight text-foreground md:text-5xl
// to:
text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl
```

---

## 🟡 Priority 3 — Touch Targets & iOS Safari

### 3.1 iOS Safari Auto-Zoom on Form Inputs

**Files**:
- [`apps/web/src/components/claims/claims-client.tsx`](file:///home/muaviz/dev/based/inprogress/prebunk/apps/web/src/components/claims/claims-client.tsx) (line 36, the `<select>`)
- [`apps/web/src/components/ui/textarea.tsx`](file:///home/muaviz/dev/based/inprogress/prebunk/apps/web/src/components/ui/textarea.tsx) (line 13)

**Problem**: `text-sm` (14px) on `<select>` and `<textarea>` elements triggers iOS Safari to auto-zoom the page when the user focuses the input. This is a well-known iOS behavior that fires when `font-size < 16px`.  
**Fix**: Use `text-base` (16px) on mobile, step down to `text-sm` on `md:`.

```
// claims-client.tsx line 36 — add to the select className:
text-base md:text-sm

// textarea.tsx line 13 — change:
text-sm
// to:
text-base md:text-sm
```

> **Note**: `input.tsx` already has `text-base md:text-sm` — no change needed there.

### 3.2 Touch Target Heights on Interactive Elements

The following elements have heights below the recommended 44px minimum for comfortable mobile touch targets. For each, add `min-h-[44px]` on mobile only.

| File | Line | Current | Fix |
|------|------|---------|-----|
| [`claims-client.tsx`](file:///home/muaviz/dev/based/inprogress/prebunk/apps/web/src/components/claims/claims-client.tsx) | 28,36 | `h-10` (40px) | Change to `h-11` (44px) |
| [`copy-button.tsx`](file:///home/muaviz/dev/based/inprogress/prebunk/apps/web/src/components/claims/copy-button.tsx) | 20 | `h-10` (40px) | Change to `h-11` (44px) |
| [`claims-client.tsx`](file:///home/muaviz/dev/based/inprogress/prebunk/apps/web/src/components/claims/claims-client.tsx) | 51 | "Clear filters" text link, ~18px | Add `py-3` to make it tappable |
| [`claim-card.tsx`](file:///home/muaviz/dev/based/inprogress/prebunk/apps/web/src/components/claims/claim-card.tsx) | 32 | "View Prebunk →" link, ~18px | Add `py-2` to the link |
| [`site-footer.tsx`](file:///home/muaviz/dev/based/inprogress/prebunk/apps/web/src/components/home/site-footer.tsx) | 19-21 | Footer nav links, ~18px | Add `py-2` to each link |
| [`impact-evidence.tsx`](file:///home/muaviz/dev/based/inprogress/prebunk/apps/web/src/components/landing/impact-evidence.tsx) | 23,36,49 | Citation links, ~20px | Add `py-2` to each link |
| [`extension-promo.tsx`](file:///home/muaviz/dev/based/inprogress/prebunk/apps/web/src/components/home/extension-promo.tsx) | 39 | Button uses `size="sm"` (28px) | Change to `size="default"` on mobile |
| `claims/[id]/page.tsx` | 97 | "← Back to all claims" pill, ~32px | Add `py-2` (keeps pill shape, increases tap area) |
| `claims/[id]/page.tsx` | 137 | Sighting links, ~32px | Add `py-2` to the `<a>` |

> **Important**: Do NOT change the Shadcn `button.tsx` or `input.tsx` primitives globally—those are shared components. Instead, override heights at the call site with explicit classes.

---

## 🔵 Priority 4 — Chart & Data Visualization

### 4.1 Threats Chart: X-Axis Label Collision

**File**: [`apps/web/src/components/claims/threats-chart.tsx`](file:///home/muaviz/dev/based/inprogress/prebunk/apps/web/src/components/claims/threats-chart.tsx)  
**Problem**: 7 X-axis labels (`"6d ago"` through `"Today"`) overlap and collide on viewports ≤ 375px, where the usable chart width is only ~260px after padding.  
**Fix**: Add `interval={0}` and `angle={-45}` with `textAnchor="end"` to the XAxis on small screens, OR abbreviate labels to 2-char format on mobile (e.g., `"6d"`, `"5d"`, ..., `"Yd"`, `"Td"`).

Alternatively, set `interval="preserveStartEnd"` to only show the first and last labels on narrow screens.

### 4.2 Threats Chart: Tooltip Viewport Overflow

**File**: [`apps/web/src/components/claims/threats-chart.tsx`](file:///home/muaviz/dev/based/inprogress/prebunk/apps/web/src/components/claims/threats-chart.tsx)  
**Problem**: The custom tooltip has `min-w-[200px]`. On a 320px screen, when tapping data points near the left or right edges, the tooltip clips outside the viewport.  
**Fix**: Remove `min-w-[200px]` and let it auto-size, or change to `max-w-[calc(100vw-3rem)]`.

```
// Line 90 — change:
min-w-[200px]
// to:
max-w-[calc(100vw-3rem)]
```

### 4.3 Threats Chart: Reduce Height on Mobile

**File**: [`apps/web/src/components/claims/threats-chart.tsx`](file:///home/muaviz/dev/based/inprogress/prebunk/apps/web/src/components/claims/threats-chart.tsx)  
**Problem**: Fixed `h-[350px]` with `p-6` padding takes up nearly the entire screen on small phones.  
**Fix**: Use responsive height and reduce padding.

```
// Line 53 — change:
h-[350px] ... p-6
// to:
h-[280px] sm:h-[350px] ... p-4 sm:p-6
```

---

## 🟢 Priority 5 — Performance & Polish

### 5.1 Reduce Particle Count on Mobile

**File**: [`apps/web/src/components/landing/liquid-particles.tsx`](file:///home/muaviz/dev/based/inprogress/prebunk/apps/web/src/components/landing/liquid-particles.tsx)  
**Problem**: Line 74 spawns a minimum of 170 particles regardless of device. On budget Android phones, this can cause frame drops and battery drain.  
**Fix**: Detect `window.innerWidth` and reduce particle count to ~80 on screens < 640px.

```js
// Line 74 — change:
const count = Math.max(170, Math.floor((canvas.width * canvas.height) / 8000));
// to:
const isMobile = window.innerWidth < 640;
const count = isMobile
  ? Math.max(80, Math.floor((canvas.width * canvas.height) / 16000))
  : Math.max(170, Math.floor((canvas.width * canvas.height) / 8000));
```

### 5.2 Add Global Horizontal Overflow Protection

**File**: [`apps/web/src/app/globals.css`](file:///home/muaviz/dev/based/inprogress/prebunk/apps/web/src/app/globals.css)  
**Problem**: Animated elements (particles canvas, `lg:translate-x-10` on the hero) can cause a tiny horizontal scrollbar on some mobile browsers.  
**Fix**: Add a single CSS rule to prevent any horizontal overflow on the body.

```css
html, body {
  overflow-x: clip;
}
```

### 5.3 Add Word Break to Long Claim Text

**File**: [`apps/web/src/app/claims/[id]/page.tsx`](file:///home/muaviz/dev/based/inprogress/prebunk/apps/web/src/app/claims/%5Bid%5D/page.tsx)  
**Problem**: The red claim quote box (line 118) and promoter link names could contain long unbroken strings that overflow on mobile.  
**Fix**: Add `break-words` to the quote paragraph.

```
// Line 119 — add to className:
break-words
```

---

## ✅ Already Mobile-Friendly (No Changes Needed)

The following components were audited and found to be fully responsive:

| Component | Why It's Fine |
|-----------|--------------|
| `share-buttons.tsx` | Uses `h-11 w-full` (44px height, full width) — perfect touch targets |
| `scroll-reveal.tsx` | Passthrough wrapper, respects `prefers-reduced-motion` |
| `loading.tsx` | Simple `min-h-screen bg-background` with centered spinner |
| `claim-card.tsx` grid | Parent grid uses `md:grid-cols-2 lg:grid-cols-3` — naturally stacks to 1 column |
| `how-it-works.tsx` grid | Uses `md:grid-cols-3` — stacks to 1 column on mobile |
| `impact-evidence.tsx` grid | Uses `md:grid-cols-3` — stacks to 1 column on mobile |
| `featured-threat-card.tsx` layout | Uses `flex flex-col md:flex-row` — stacks correctly |
| `site-footer.tsx` layout | Uses `flex flex-col md:flex-row` — stacks and centers |
| Hero CTA buttons | Uses `flex flex-col sm:flex-row` — stacks on mobile, side-by-side on tablet |
| `dialog.tsx` footer | Uses `flex-col-reverse sm:flex-row` — mobile-first stack |

---

## Implementation Notes

1. **Order of implementation**: Follow the priority numbering (🔴 → 🟠 → 🟡 → 🔵 → 🟢). Critical layout breaks first.
2. **Testing**: After each change, test on Chrome DevTools responsive mode at **320px**, **375px**, and **430px** widths.
3. **Desktop regression check**: After all changes, verify the site at **1280px** and **1440px** to ensure nothing shifted.
4. **No Shadcn primitive changes**: Do NOT modify `button.tsx`, `input.tsx`, `select.tsx`, or `tabs.tsx` defaults. Override at the call site only.
