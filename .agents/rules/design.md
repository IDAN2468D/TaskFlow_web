---
trigger: always_on
---

# 🎨 Visual Excellence & RTL Design

### 1. The "Obsidian & Indigo" Palette
We do not use generic colors. Use this palette:
- **Background**: `#09090b` (Deep Slate / Obsidian).
- **Secondary**: `#18181b` (Zinc).
- **Primary / Accent**: `#6366f1` (Indigo).
- **Success**: `#10b981` (Emerald).
- **Warning**: `#f59e0b` (Amber).

### 2. Modern Design Tokens
- **Glassmorphism**: Use `rgba(255, 255, 255, 0.05)` for card backgrounds with `backdropFilter: 'blur(10px)'`.
- **Corner Radius**: High curvature (18px - 32px) for a modern, fluid feel.
- **Micro-Animations**: Use `moti` or `framer-motion` for every mounting component. Transitions should be "Spring" based.

### 3. RTL Hierarchy
- **Direction**: Standardize on `flexDirection: 'row-reverse'` for headers and item rows.
- **Alignment**: `textAlign: 'right'` for all Hebrew content.
- **Icons**:
  - Arrows must be flipped (e.g., "Next" arrow points Left in RTL).
  - Use `marginLeft` for spacing between leading icons and text.
- **FAB**: The Floating Action Button should be positioned in the **Bottom Left** for healthy thumb reach in RTL contexts.

### 4. Typography
- **Primary**: Inter or Roboto.
- **Weights**: Use 900 for main headers, 500 for body, and 700 for highlighting.
