# Loadr
## Engineering Specification (Frontend-Only)

[![Astro](https://img.shields.io/badge/Astro-BC52EE?style=flat&logo=astro&logoColor=white)](https://astro.build/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📋 Table of Contents

- [1. Purpose](#1-purpose)
- [2. Scope and Non-Goals](#2-scope-and-non-goals)
- [3. Architecture Overview](#3-architecture-overview)
- [4. Frontend Framework](#4-frontend-framework)
- [5. Rendering Strategy](#5-rendering-strategy)
- [6. SVG Asset Management](#6-svg-asset-management)
- [7. Symbol Data Model](#7-symbol-data-model)
- [8. Rule Evaluation Logic](#8-rule-evaluation-logic)
- [9. User Flow](#9-user-flow)
- [10. Deployment Strategy](#10-deployment-strategy)
- [11. Repository Structure](#11-repository-structure)
- [12. Open Source Considerations](#12-open-source-considerations)
- [13. Engineering Summary](#13-engineering-summary)

---

## 1. Purpose

This project helps users understand laundry care symbols found on clothing labels.
Users can select multiple symbols for a single garment, and the system will explain:
- Allowed actions
- Forbidden actions
- Warnings and limitations

The target audience includes individuals, couples, and families unfamiliar with laundry care symbols.

---

## 2. Scope and Non-Goals

### In Scope (MVP)
- Static website
- Manual selection of multiple laundry care symbols
- Clear explanations for washing, drying, bleaching, ironing, and dry cleaning
- Rule conflict resolution (most restrictive rule wins)
- Fully client-side logic

### Out of Scope
- Backend or database
- Authentication
- Image upload or OCR
- AI-based interpretation
- User data persistence

---

## 3. Architecture Overview

### Frontend-Only Architecture
Browser
└── Static Assets
    ├── HTML
    ├── CSS
    ├── JavaScript
    ├── SVG Icons
    └── JSON Rules

All logic runs in the browser:
- Symbol selection
- Rule evaluation
- Result rendering

---

## 4. Frontend Framework

### Recommended Framework: Astro

**Rationale**
- Static-first by default
- Zero JavaScript unless needed
- Extremely fast load time
- Partial hydration for interactivity
- Excellent fit for GitHub Pages

Optional UI islands may use:
- React
- Svelte
- Vue

---

## 5. Rendering Strategy

- Static Site Generation (SSG)
- Client-side JavaScript only for:
  - Symbol selection
  - Rule conflict evaluation
  - Result display

---

## 6. SVG Asset Management

### SVG Source
Laundry care symbols are sourced from:
- [laundry-symbols](https://github.com/tvler/laundry-symbols)
- License: MIT License

### License Compliance
- Original LICENSE file must be included.
- SVGs may be modified (size, color) as permitted by MIT.
- No external hotlinking.

### Asset Structure
```text
/public
└── /symbols
    ├── wash_30.svg
    ├── wash_40.svg
    ├── bleach_no.svg
    └── tumble_low.svg
```

### SVG Usage Guidelines
- Prefer inline SVG for styling.
- Maintain consistent stroke width.
- Use accessible labels (`aria-label`).

---

## 7. Symbol Data Model

```ts
type LaundrySymbol = {
  id: string
  category: "wash" | "bleach" | "dry" | "iron" | "dry_clean"
  label: string
  rules: {
    allow?: string[]
    forbid?: string[]
    condition?: string[]
  }
}
```

---

## 8. Rule Evaluation Logic

### Core Principles
- **Multiple Symbols**: One garment can contain multiple symbols.
- **Collective Evaluation**: All symbols are evaluated together.
- **Restrictive Wins**: The most restrictive rule always wins.

### Example
- **Symbol A**: "Wash at 40°C"
- **Symbol B**: "Do not machine wash"
- **Result**: Machine washing is forbidden.

---

## 9. User Flow
1. **Selection**: User opens the website and selects all symbols found on the garment label.
2. **Analysis**: User submits the selection.
3. **Evaluation**: System evaluates all rules based on the "most restrictive" principle.
4. **Display**: System displays:
   - Overall summary
   - Allowed actions
   - Forbidden actions
   - Warnings

---

## 10. Deployment Strategy

### Hosting
- **Provider**: Cloudflare Pages
- **URL Configuration**:
  - Primary Domain: `https://loadr.wihlarkop.com`

### Build Output
- Astro builds static files to `/dist`.
- Contents of `/dist` are deployed automatically via Cloudflare Pages integration.

---

## 11. Repository Structure
```text
/
├── .github/          # CI/CD Workflows
├── public/           # Static assets
│   └── symbols/      # SVG laundry icons
├── src/
│   ├── components/   # UI Islands and components
│   ├── layouts/      # Page layouts
│   ├── pages/        # Route entry points
│   └── data/         # Symbol rules and definitions (json)
├── astro.config.mjs  # Astro configuration
├── package.json      # Dependencies
└── README.md         # Project documentation
```

---

## 12. Open Source Considerations
- **Documentation**: Maintain clear, concise guides for users and contributors.
- **Attribution**: Explicit license attribution for SVG assets.
- **Contributions**: Encourage community involvement in:
  - Adding new symbols
  - Refining rule logic
  - Providing translations

---

## 13. Engineering Summary
- **No-Backend**: Purely frontend-only architecture.
- **Performance**: Static, fast, and accessible (Astro).
- **Compliance**: Open-source SVG icons with proper licensing.
- **Cost**: Zero-cost hosting via Cloudflare Pages.
