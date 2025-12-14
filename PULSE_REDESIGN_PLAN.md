# Pulse.com.gh Homepage Redesign Plan

## 🎯 Objective
Redesign GhNewsMedia homepage to match Pulse.com.gh's exact layout and design, excluding advertisements and video sections, while using our own categories and keeping the breaking news feature.

---

## 📋 Phase 1: Layout Structure & Hero Section

### Step 1.1: Top Hero Section (Featured Articles)
**Target Layout:**
- **Left (66% width)**: Large hero article with:
  - Full-width image
  - Dark overlay at bottom
  - Category badge (top-left)
  - Date (top-right or in overlay)
  - Large white title (bottom overlay)
- **Right (33% width)**: 3 vertical stacked articles, each with:
  - Small square thumbnail (left)
  - Category badge
  - Date
  - Title (truncated)

**Components to Create/Update:**
- [ ] Create `HeroFeaturedSection.tsx` component
- [ ] Update homepage to use new hero layout
- [ ] Ensure responsive: Mobile = vertical stack, Desktop = 2/3 + 1/3 split

**Design Specs:**
- Hero image height: `h-80` (320px) on desktop, `h-64` (256px) on mobile
- Side articles: `w-24 h-20` thumbnails
- Overlay: `bg-black/60` (no gradient)
- Category badge: `12px` font, category color background
- Date: `11px` font, `#6B7280` color
- Title: `18px` font, `#FFFFFF` on hero, `#111111` on side articles

---

## 📋 Phase 2: Category Sections

### Step 2.1: Category Section Layout (Entertainment/Lifestyle/Sports Style)
**Target Layout:**
- Section header: Bold title + "View All" link (right-aligned)
- **Primary Row**: 2 large articles side-by-side
  - Landscape images (`h-48`)
  - Category badge
  - Date
  - Medium title
- **Secondary Grid**: 6 articles in 3x2 grid
  - Square thumbnails (`w-full h-40`)
  - Category badge
  - Date
  - Short title

**Components to Create/Update:**
- [ ] Update `CategorySection.tsx` to match Pulse layout
- [ ] Create primary/secondary article distinction
- [ ] Implement 2-column primary + 3-column secondary grid

**Design Specs:**
- Primary articles: `md:grid-cols-2` gap-4
- Secondary grid: `md:grid-cols-3` gap-4
- Mobile: All articles stack vertically
- Section spacing: `mb-8` between sections

---

## 📋 Phase 3: Trending Section

### Step 3.1: Trending List Layout
**Target Layout:**
- Section header: "Trending" title + "View All" link
- **Desktop**: 2-column list
- **Mobile**: Single column
- Each item:
  - Red circular bullet/number
  - Article title (no image)
  - Hover effect

**Components to Create/Update:**
- [ ] Update `TrendingSidebar.tsx` to match Pulse style
- [ ] Change from sidebar to full-width section
- [ ] Implement 2-column layout on desktop

**Design Specs:**
- Bullet color: `#1A365D` (our primary blue)
- Title: `13px` font, `#111111` color
- List spacing: `space-y-2`
- Desktop: `md:grid md:grid-cols-2 md:gap-4`

---

## 📋 Phase 4: Editor's Picks Carousel

### Step 4.1: Editor's Picks Card Layout
**Target Layout:**
- Section header: "Editor's Picks" + navigation controls
- **Desktop**: 3-column card layout
  - Left: Author image (square, `w-12 h-12`)
  - Middle: Category + Date
  - Right: Author name + Title
- **Mobile**: Simplified single card
- Carousel navigation: Previous/Next buttons + dot indicators

**Components to Create/Update:**
- [ ] Update `EditorsPicks.tsx` to match Pulse card style
- [ ] Ensure proper carousel functionality
- [ ] Add touch swipe support for mobile

**Design Specs:**
- Card background: `bg-white`
- Card padding: `p-4`
- Author image: `rounded-full`
- Title: `18px` font, `#111111`
- Category: `12px` font, category color

---

## 📋 Phase 5: Homepage Layout Structure

### Step 5.1: Main Content Area Organization
**Target Layout:**
```
┌─────────────────────────────────────┐
│         Breaking News (Keep)         │
├─────────────────────────────────────┤
│         Hero Featured Section        │
│      (Large Left + 3 Right)         │
├─────────────────────────────────────┤
│         Editor's Picks               │
│         (Carousel)                   │
├─────────────────────────────────────┤
│         Category Section 1           │
│         (Entertainment/Lifestyle)    │
├─────────────────────────────────────┤
│         Trending Section              │
│         (2-column list)              │
├─────────────────────────────────────┤
│         Category Section 2           │
│         (Sports/Business)            │
├─────────────────────────────────────┤
│         Category Section 3           │
│         (News/Politics)              │
└─────────────────────────────────────┘
```

**Components to Update:**
- [ ] Reorganize `index.tsx` to match exact order
- [ ] Remove pagination (Pulse uses infinite scroll/View All)
- [ ] Ensure proper spacing between sections

---

## 📋 Phase 6: Typography & Spacing Refinement

### Step 6.1: Font Sizes & Line Heights
**Specifications:**
- Section Headers: `18px`, bold, `#111111`
- Article Titles (Hero): `18px`, bold, white on overlay
- Article Titles (Cards): `18px`, bold, `#111111`
- Article Titles (List): `13px`, semibold, `#111111`
- Category Labels: `12px`, semibold, white on colored bg
- Dates: `11px`, regular, `#6B7280`
- Body Text: `13px`, regular, `#111111`

### Step 6.2: Spacing System
**Specifications:**
- Section margin bottom: `mb-8` (32px)
- Card padding: `p-3` mobile, `p-4` desktop
- Grid gaps: `gap-4` (16px)
- List item spacing: `space-y-2` (8px)

---

## 📋 Phase 7: Color & Visual Elements

### Step 7.1: Color Application
**Color Usage:**
- Background: `#FFFFFF` (white)
- Primary Text: `#111111` (near-black)
- Secondary Text: `#6B7280` (gray)
- Links/Accents: `#1A365D` (primary blue)
- Breaking News: `#C53030` (red)
- Category Badges: Use category color from database
- Overlays: `bg-black/60` (no gradients)

### Step 7.2: Shadows & Borders
**Specifications:**
- Card shadows: `shadow-sm` on default, `shadow-md` on hover
- No heavy borders
- Subtle rounded corners: `rounded-lg`
- No gradients anywhere

---

## 📋 Phase 8: Responsive Design

### Step 8.1: Mobile Layout (< 768px)
**Transformations:**
- Hero: Vertical stack (all 4 articles)
- Category sections: Single column, horizontal cards
- Trending: Single column list
- Editor's Picks: Simplified single card
- Sidebar: Hidden (content flows in main column)

### Step 8.2: Tablet Layout (768px - 1024px)
**Transformations:**
- Hero: 2-column (hero + 2 side articles)
- Category sections: 2-column grid
- Trending: 2-column list
- Editor's Picks: 2-column cards

### Step 8.3: Desktop Layout (> 1024px)
**Transformations:**
- Hero: Full 2/3 + 1/3 split
- Category sections: Full 3-column grid
- Trending: 2-column list
- Editor's Picks: 3-column cards

---

## 📋 Phase 9: Component Refinement

### Step 9.1: Article Card Components
**Create/Update:**
- [ ] `HeroArticleCard.tsx` - Large hero article
- [ ] `SideArticleCard.tsx` - Small side article
- [ ] `PrimaryArticleCard.tsx` - Category section primary
- [ ] `SecondaryArticleCard.tsx` - Category section secondary
- [ ] `TrendingListItem.tsx` - Trending list item
- [ ] `EditorsPickCard.tsx` - Editor's pick card

### Step 9.2: Section Headers
**Create:**
- [ ] `SectionHeader.tsx` - Reusable section header component
  - Title (left)
  - "View All" link (right)
  - Consistent styling

---

## 📋 Phase 10: Footer Redesign

### Step 10.1: Footer Layout (Match Pulse)
**Target Layout:**
- Dark background: `#1A365D` (our primary blue, not red)
- Logo + Social Media Icons (top row)
- Category Links (grouped columns)
- Company Links (grouped columns)
- Copyright + Powered By (bottom)

**Components to Update:**
- [ ] Update `Footer.tsx` to match Pulse structure
- [ ] Use primary blue instead of red
- [ ] Organize links in columns
- [ ] Add social media icons row

---

## 📋 Phase 11: Header Refinement

### Step 11.1: Navigation Menu
**Target:**
- Clean, simple navigation
- Category dropdowns (if needed)
- Search icon
- Mobile hamburger menu
- Sticky header

**Components to Update:**
- [ ] Ensure header matches Pulse simplicity
- [ ] Remove gradients
- [ ] Use primary blue for active states

---

## 📋 Phase 12: Testing & Polish

### Step 12.1: Cross-Browser Testing
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

### Step 12.2: Responsive Testing
- [ ] Mobile (375px, 414px)
- [ ] Tablet (768px, 1024px)
- [ ] Desktop (1280px, 1920px)

### Step 12.3: Performance
- [ ] Image optimization
- [ ] Lazy loading
- [ ] Code splitting
- [ ] Bundle size optimization

---

## 🎨 Design Specifications Summary

### Colors
- Primary Blue: `#1A365D`
- Background: `#FFFFFF`
- Text Primary: `#111111`
- Text Secondary: `#6B7280`
- Breaking News: `#C53030`

### Typography
- Headlines: `18px`, bold, line-height `1.3`
- Category Labels: `12px`, semibold
- Dates: `11px`, regular
- Body Text: `13px`, regular, line-height `1.6`

### Spacing
- Section spacing: `32px` (mb-8)
- Card padding: `12px` mobile, `16px` desktop
- Grid gaps: `16px` (gap-4)

### Components
- No gradients
- Subtle shadows (`shadow-sm` to `shadow-md`)
- Rounded corners (`rounded-lg`)
- Clean, minimal design

---

## 📝 Implementation Order

1. **Phase 1**: Hero Section (Foundation)
2. **Phase 2**: Category Sections (Main content)
3. **Phase 3**: Trending Section
4. **Phase 4**: Editor's Picks
5. **Phase 5**: Homepage Layout (Structure)
6. **Phase 6**: Typography & Spacing
7. **Phase 7**: Colors & Visuals
8. **Phase 8**: Responsive Design
9. **Phase 9**: Component Refinement
10. **Phase 10**: Footer
11. **Phase 11**: Header
12. **Phase 12**: Testing & Polish

---

## ✅ Success Criteria

- [ ] Layout matches Pulse.com.gh exactly
- [ ] All sections properly organized
- [ ] Responsive on all devices
- [ ] No gradients used
- [ ] Color scheme matches our design system
- [ ] Typography matches specifications
- [ ] Breaking news feature retained
- [ ] No ads or video sections
- [ ] Performance optimized
- [ ] Accessible (WCAG AA)

---

**Ready to begin implementation!** 🚀
