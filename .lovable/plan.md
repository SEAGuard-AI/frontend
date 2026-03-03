

# Add Inner Shadows for True Claymorphism

The current `.clay` classes only use **outer** shadows. True claymorphism requires **inner shadows** on every element: a lighter inset highlight on the top-left and a darker inset shadow on the bottom-right, creating the "puffy clay" 3D effect.

## Changes

### `src/index.css` — Update shadow variables and clay classes

**Shadow variables** — add dedicated inner highlight/shadow pairs:

Light theme:
- `--clay-inner`: `inset -3px -3px 6px hsl(20 10% 82% / 0.6), inset 3px 3px 6px hsl(0 0% 100% / 0.8)`
- `--clay-inner-sm`: `inset -2px -2px 4px hsl(20 10% 84% / 0.5), inset 2px 2px 4px hsl(0 0% 100% / 0.7)`
- `--clay-inner-lg`: `inset -4px -4px 8px hsl(20 10% 80% / 0.6), inset 4px 4px 8px hsl(0 0% 100% / 0.9)`

Dark theme:
- `--clay-inner`: `inset -3px -3px 6px hsl(0 0% 4% / 0.5), inset 3px 3px 6px hsl(0 0% 22% / 0.4)`
- `--clay-inner-sm`: `inset -2px -2px 4px hsl(0 0% 5% / 0.4), inset 2px 2px 4px hsl(0 0% 20% / 0.3)`
- `--clay-inner-lg`: `inset -4px -4px 8px hsl(0 0% 3% / 0.6), inset 4px 4px 8px hsl(0 0% 24% / 0.4)`

**Clay utility classes** — combine outer + inner shadows:

```css
.clay {
  box-shadow: var(--clay-shadow), var(--clay-inner);
  /* rest stays the same */
}
.clay-sm {
  box-shadow: var(--clay-shadow-sm), var(--clay-inner-sm);
}
.clay-lg {
  box-shadow: var(--clay-shadow-lg), var(--clay-inner-lg);
}
.clay-btn {
  box-shadow: var(--clay-shadow-sm), var(--clay-inner-sm);
}
.clay-btn:hover {
  box-shadow: var(--clay-shadow), var(--clay-inner);
}
.clay-icon {
  box-shadow: var(--clay-shadow-sm), var(--clay-inner-sm);
}
.clay-primary {
  /* add inner shadow to primary buttons too */
}
```

### `tailwind.config.ts` — Add inner shadow utilities

Add `clay-inner`, `clay-inner-sm`, `clay-inner-lg` to the `boxShadow` extend so they can be used as Tailwind classes (`shadow-clay-inner`).

### Summary
- Top-left inset = **lighter** (white/highlight)
- Bottom-right inset = **darker** (shadow)
- Every `.clay*` element gets both outer and inner shadows combined
- Both light and dark themes updated

