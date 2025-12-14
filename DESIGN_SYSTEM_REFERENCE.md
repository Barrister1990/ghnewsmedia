# GhNewsMedia Design System Reference

## 🎨 Color Palette

### Primary Colors

#### Primary Blue
- **Hex**: `#1A365D`
- **Usage**: Primary brand color, buttons, links, category badges, navigation highlights
- **RGB**: `rgb(26, 54, 93)`
- **Accessibility**: WCAG AA compliant for text on white backgrounds

#### Breaking News Red
- **Hex**: `#C53030`
- **Usage**: Breaking news indicators, urgent alerts, critical notifications
- **RGB**: `rgb(197, 48, 48)`
- **Accessibility**: High contrast for visibility and urgency

### Neutral Colors

#### Background
- **Hex**: `#FFFFFF`
- **Usage**: Main page background, card backgrounds, content areas
- **RGB**: `rgb(255, 255, 255)`

#### Text (Primary)
- **Hex**: `#111111`
- **Usage**: Primary text content, headlines, body text
- **RGB**: `rgb(17, 17, 17)`
- **Note**: Near-black for better readability in sunlight (avoid pure black #000000)

#### Gray (Secondary Text)
- **Hex**: `#6B7280`
- **Usage**: Secondary text, metadata, timestamps, author names, subtle information
- **RGB**: `rgb(107, 114, 128)`

### Color Usage Guidelines

#### Text Colors
- **Primary Text**: `#111111` - Main content, headlines, article titles
- **Secondary Text**: `#6B7280` - Dates, author names, metadata, descriptions
- **Links**: `#1A365D` - All clickable links, hover states
- **Breaking News**: `#C53030` - Breaking news text and indicators

#### Background Colors
- **Page Background**: `#FFFFFF` - Clean white background
- **Card Backgrounds**: `#FFFFFF` - Article cards, content cards
- **Hover States**: Light gray variations for interactive elements

#### Accent Colors
- **Primary Actions**: `#1A365D` - Buttons, CTAs, primary actions
- **Breaking News**: `#C53030` - Urgent content indicators
- **Category Badges**: Use category-specific colors (stored in database)

---

## 📝 Typography System

### Font Sizes (Mobile-First)

#### Headlines & Titles
- **Size**: `18px` (1.125rem)
- **Line Height**: `1.3` (23.4px)
- **Font Weight**: `700` (Bold)
- **Usage**: 
  - Article headlines on mobile
  - Section titles
  - Featured article titles
  - Card titles

#### Category Labels
- **Size**: `12px` (0.75rem)
- **Line Height**: `1.4` (16.8px)
- **Font Weight**: `600` (Semi-bold)
- **Usage**: 
  - Category badges
  - Tag labels
  - Small labels

#### Date & Metadata
- **Size**: `11px` (0.6875rem)
- **Line Height**: `1.4` (15.4px)
- **Font Weight**: `400` (Regular)
- **Usage**: 
  - Publication dates
  - Author names
  - View counts
  - Read time
  - Timestamps

#### Body Text
- **Size**: `13px` (0.8125rem)
- **Line Height**: `1.6` (20.8px)
- **Font Weight**: `400` (Regular)
- **Usage**: 
  - Article content
  - Descriptions
  - Excerpts
  - General body text

### Typography Scale (Desktop)

For desktop and tablet views, scale up proportionally:

- **Headlines**: `18px` → `24px` → `32px` (mobile → tablet → desktop)
- **Category Labels**: `12px` → `13px` → `14px`
- **Date & Metadata**: `11px` → `12px` → `13px`
- **Body Text**: `13px` → `15px` → `16px`

### Font Families

```css
/* Primary Font Stack */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
             'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 
             'Helvetica Neue', sans-serif;

/* Monospace (for code blocks) */
font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', 
             'Courier New', monospace;
```

---

## 📱 Mobile-First Design Principles

### Text Contrast & Readability

#### Critical Rules
1. **Never use pure black (#000000)** for text
2. **Always use near-black (#111111 or #222222)** for primary text
3. **Maintain high contrast** for sunlight readability
4. **Minimum contrast ratio**: 4.5:1 for normal text, 3:1 for large text

#### Text Color Hierarchy
```css
/* Primary Text - High Contrast */
color: #111111; /* Near-black for maximum readability */

/* Secondary Text - Medium Contrast */
color: #6B7280; /* Gray for metadata and less important text */

/* Links - Brand Color */
color: #1A365D; /* Primary blue for all links */

/* Breaking News - Urgent */
color: #C53030; /* Red for breaking news */
```

### Spacing System

#### Mobile Spacing Scale
- **XS**: `4px` (0.25rem) - Tight spacing, icon padding
- **SM**: `8px` (0.5rem) - Small gaps, compact layouts
- **MD**: `12px` (0.75rem) - Standard spacing
- **LG**: `16px` (1rem) - Comfortable spacing
- **XL**: `24px` (1.5rem) - Section spacing
- **2XL**: `32px` (2rem) - Large section gaps

### Touch Targets

- **Minimum Size**: `44px × 44px` (iOS/Android standard)
- **Recommended**: `48px × 48px` for better usability
- **Spacing Between**: Minimum `8px` gap between touch targets

---

## 🎯 Component-Specific Guidelines

### Article Cards

#### Mobile Article Card Typography
```css
/* Card Title */
.title {
  font-size: 18px;
  font-weight: 700;
  line-height: 1.3;
  color: #111111;
  margin-bottom: 8px;
}

/* Category Badge */
.category-badge {
  font-size: 12px;
  font-weight: 600;
  line-height: 1.4;
  padding: 4px 8px;
}

/* Excerpt/Description */
.excerpt {
  font-size: 13px;
  font-weight: 400;
  line-height: 1.6;
  color: #111111;
  margin-bottom: 12px;
}

/* Metadata (Date, Author, Views) */
.metadata {
  font-size: 11px;
  font-weight: 400;
  line-height: 1.4;
  color: #6B7280;
}
```

### Article Page

#### Article Header
```css
/* Main Article Title */
.article-title {
  font-size: 18px; /* Mobile */
  font-weight: 700;
  line-height: 1.3;
  color: #111111;
  margin-bottom: 12px;
}

/* Article Meta (Date, Author) */
.article-meta {
  font-size: 11px;
  font-weight: 400;
  line-height: 1.4;
  color: #6B7280;
}

/* Category Label */
.article-category {
  font-size: 12px;
  font-weight: 600;
  line-height: 1.4;
}
```

#### Article Content
```css
/* Body Text */
.article-content {
  font-size: 13px;
  font-weight: 400;
  line-height: 1.6;
  color: #111111;
}

/* Headings in Content */
.article-content h2 {
  font-size: 18px;
  font-weight: 700;
  line-height: 1.3;
  color: #111111;
  margin-top: 24px;
  margin-bottom: 12px;
}

.article-content h3 {
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
  color: #111111;
  margin-top: 20px;
  margin-bottom: 10px;
}
```

### Breaking News Component

```css
/* Breaking News Text */
.breaking-news-text {
  font-size: 13px;
  font-weight: 600;
  line-height: 1.4;
  color: #C53030;
  background-color: rgba(197, 48, 48, 0.1);
  padding: 8px 12px;
}
```

### Navigation

```css
/* Navigation Links */
.nav-link {
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
  color: #111111;
}

.nav-link:hover {
  color: #1A365D;
}

/* Active Navigation */
.nav-link.active {
  color: #1A365D;
  font-weight: 600;
}
```

---

## 🎨 Tailwind CSS Configuration

### Recommended Tailwind Config

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1A365D',
          blue: '#1A365D',
        },
        breaking: {
          DEFAULT: '#C53030',
          red: '#C53030',
        },
        text: {
          primary: '#111111',
          secondary: '#6B7280',
        },
        background: {
          DEFAULT: '#FFFFFF',
          white: '#FFFFFF',
        },
      },
      fontSize: {
        // Mobile-first sizes
        'xs': ['11px', { lineHeight: '1.4' }],      // Date & metadata
        'sm': ['12px', { lineHeight: '1.4' }],      // Category labels
        'base': ['13px', { lineHeight: '1.6' }],   // Body text
        'lg': ['18px', { lineHeight: '1.3' }],     // Headlines
        // Desktop sizes
        'xl': ['24px', { lineHeight: '1.3' }],      // Tablet headlines
        '2xl': ['32px', { lineHeight: '1.3' }],    // Desktop headlines
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '32px',
      },
    },
  },
}
```

### Usage Examples

```tsx
// Headline
<h1 className="text-lg font-bold text-text-primary">
  Article Title
</h1>

// Category Badge
<span className="text-sm font-semibold text-white px-2 py-1 rounded">
  Category Name
</span>

// Date/Metadata
<span className="text-xs text-text-secondary">
  December 13, 2024
</span>

// Body Text
<p className="text-base text-text-primary leading-relaxed">
  Article content goes here...
</p>

// Breaking News
<div className="text-base font-semibold text-breaking-red bg-red-50 px-3 py-2">
  Breaking News
</div>
```

---

## 📐 Responsive Typography

### Breakpoint System

```css
/* Mobile (default) */
.headline { font-size: 18px; }
.body-text { font-size: 13px; }
.category-label { font-size: 12px; }
.date-text { font-size: 11px; }

/* Tablet (768px+) */
@media (min-width: 768px) {
  .headline { font-size: 24px; }
  .body-text { font-size: 15px; }
  .category-label { font-size: 13px; }
  .date-text { font-size: 12px; }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .headline { font-size: 32px; }
  .body-text { font-size: 16px; }
  .category-label { font-size: 14px; }
  .date-text { font-size: 13px; }
}
```

---

## ✅ Accessibility Checklist

### Color Contrast
- ✅ Primary text (#111111) on white: **16.8:1** (AAA)
- ✅ Secondary text (#6B7280) on white: **4.7:1** (AA)
- ✅ Primary blue (#1A365D) on white: **7.1:1** (AAA)
- ✅ Breaking red (#C53030) on white: **4.8:1** (AA)

### Text Readability
- ✅ Minimum font size: 11px (for metadata only)
- ✅ Body text: 13px minimum
- ✅ Line height: 1.4-1.6 for optimal readability
- ✅ No pure black text (#000000)

### Mobile Optimization
- ✅ Touch targets: Minimum 44px × 44px
- ✅ Adequate spacing between interactive elements
- ✅ High contrast for sunlight readability
- ✅ Readable font sizes on small screens

---

## 🚀 Implementation Notes

### Do's ✅
- Use `#111111` for all primary text
- Use `#6B7280` for secondary text and metadata
- Use `#1A365D` for links and primary actions
- Use `#C53030` for breaking news indicators
- Maintain font size hierarchy (18px → 12px → 11px → 13px)
- Keep line heights between 1.3-1.6
- Use near-black instead of pure black

### Don'ts ❌
- Never use `#000000` (pure black) for text
- Don't use font sizes smaller than 11px
- Don't use low contrast color combinations
- Don't mix different text color systems
- Don't use gradients on text (maintain readability)

---

## 📚 Quick Reference

### Color Quick Reference
| Element | Color | Hex | Usage |
|---------|-------|-----|-------|
| Primary Text | Near-Black | `#111111` | Headlines, body text |
| Secondary Text | Gray | `#6B7280` | Dates, metadata |
| Links | Primary Blue | `#1A365D` | All links, buttons |
| Breaking News | Red | `#C53030` | Urgent alerts |
| Background | White | `#FFFFFF` | Page, cards |

### Typography Quick Reference
| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| Headline | 18px | 700 | 1.3 |
| Category Label | 12px | 600 | 1.4 |
| Date/Metadata | 11px | 400 | 1.4 |
| Body Text | 13px | 400 | 1.6 |

---

**Last Updated**: 2024
**Version**: 1.0.0
**Status**: Production Ready ✅
