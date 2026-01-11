# Google AdSense Setup Guide

## 📋 Overview

This guide explains how to use the AdSense components in your GH News application.

## 🚀 Getting Started

### Step 1: Request AdSense Approval

1. Go to [Google AdSense](https://www.google.com/adsense/)
2. Sign in with your Google account
3. Add your site: `ghnewsmedia.com`
4. Submit for review
5. Wait for approval (typically 1-2 weeks)

### Step 2: Create Ad Units

After approval:

1. Go to your AdSense dashboard
2. Navigate to **Ads** → **By ad unit**
3. Click **Create ad unit**
4. Choose ad types:
   - **In-article ads** (for between content) - ✅ Created: `5357563959`
   - **Multiplex ads** (autorelaxed format - versatile placement) - ✅ Created: `7777851341`
   - **Display ads** (for sidebar, banners)
   - **Anchor ads** (optional)
5. Copy the **Ad unit ID** (format: `1234567890`)

### Step 3: Configure Ad Slots

1. Open `src/config/adsense.ts`
2. Update `ENABLE_ADSENSE` to `true`
3. Replace placeholder ad slot IDs with your actual IDs:

```typescript
export const AD_SLOTS = {
  // In-article ads (automatically placed in articles)
  IN_ARTICLE_1: '5357563959', // ✅ Already configured
  
  // Multiplex/auto ads (versatile placement)
  MULTIPLEX_1: '7777851341', // ✅ Already configured
  
  // Additional ad units (update as needed)
  IN_ARTICLE_2: 'YOUR_IN_ARTICLE_AD_SLOT_ID_2',
  MULTIPLEX_2: 'YOUR_MULTIPLEX_AD_SLOT_ID_2',
  // ... etc
};
```

**Current Ad Units Configured:**
- ✅ **IN_ARTICLE_1**: `5357563959` - In-article ad (auto-placed after 2nd paragraph)
- ✅ **MULTIPLEX_1**: `7777851341` - Multiplex/auto ad (for flexible placement)

## 📦 Available Components

### 1. MultiplexAd (Auto/Relaxed Format)

For automatic, adaptive ad placement that works across different screen sizes:

```tsx
import { MultiplexAd } from '@/components/AdSense';
import { AD_SLOTS } from '@/config/adsense';

<MultiplexAd adSlot={AD_SLOTS.MULTIPLEX_1} />
```

**Features:**
- Automatically adapts to placement and screen size
- Uses `data-ad-format="autorelaxed"`
- Can be placed in multiple locations
- Google optimizes ad display automatically

### 2. AdSenseAd (Base Component)

Flexible component for custom ad placements:

```tsx
import { AdSenseAd } from '@/components/AdSense';
import { AD_SLOTS } from '@/config/adsense';

<AdSenseAd
  adSlot={AD_SLOTS.IN_ARTICLE_1}
  adFormat="auto"
  style={{ minHeight: '250px' }}
/>
```

### 3. InArticleAd

For placing ads between article paragraphs:

```tsx
import { InArticleAd } from '@/components/AdSense';
import { AD_SLOTS } from '@/config/adsense';

<InArticleAd adSlot={AD_SLOTS.IN_ARTICLE_1} />
```

### 4. SidebarAd

For sidebar placements (300x250, 300x600):

```tsx
import { SidebarAd } from '@/components/AdSense';
import { AD_SLOTS } from '@/config/adsense';

<SidebarAd adSlot={AD_SLOTS.SIDEBAR_TOP} />
```

### 5. BannerAd

For horizontal banner ads (728x90, 970x90):

```tsx
import { BannerAd } from '@/components/AdSense';
import { AD_SLOTS } from '@/config/adsense';

<BannerAd adSlot={AD_SLOTS.BANNER_TOP} />
```

## 📍 Recommended Ad Placements

### Article Pages (`[category]/[slug].tsx`)

**Automatic (already configured):**
- **After 2nd paragraph**: In-article ad automatically injected (configured in ArticleContent component)

**Manual Placement Options:**

1. **Top of article** (after header, before content):
```tsx
<MultiplexAd adSlot={AD_SLOTS.MULTIPLEX_1} />
```

2. **Bottom of article** (before related articles):
```tsx
<MultiplexAd adSlot={AD_SLOTS.MULTIPLEX_1} />
```

3. **Between sections** (if you have multiple content sections):
```tsx
<MultiplexAd adSlot={AD_SLOTS.MULTIPLEX_1} />
```

### Homepage (`index.tsx`)

1. **Top banner** (after hero section):
```tsx
import { MultiplexAd } from '@/components/AdSense';
import { AD_SLOTS } from '@/config/adsense';

<MultiplexAd adSlot={AD_SLOTS.MULTIPLEX_1} />
```

2. **Between sections**:
```tsx
<MultiplexAd adSlot={AD_SLOTS.MULTIPLEX_1} />
```

### Category Pages

1. **Top of page** (after category header):
```tsx
<MultiplexAd adSlot={AD_SLOTS.MULTIPLEX_1} />
```

2. **Between article lists** (if you have multiple sections):
```tsx
<MultiplexAd adSlot={AD_SLOTS.MULTIPLEX_1} />
```

3. **Sidebar** (if you have a sidebar):
```tsx
import { SidebarAd } from '@/components/AdSense';

<SidebarAd adSlot={AD_SLOTS.SIDEBAR_TOP} />
```

## ⚙️ Configuration

### Enable/Disable Ads Globally

Edit `src/config/adsense.ts`:

```typescript
// Set to true after AdSense approval
export const ENABLE_ADSENSE = true; // Change to true when approved
```

### Enable/Disable Individual Ads

You can override the global setting per component:

```tsx
<AdSenseAd
  adSlot={AD_SLOTS.IN_ARTICLE_1}
  enabled={true} // Override global setting
/>
```

## 🎨 Styling

Ads are automatically styled, but you can add custom styles:

```tsx
<AdSenseAd
  adSlot={AD_SLOTS.IN_ARTICLE_1}
  style={{ margin: '32px 0', minHeight: '250px' }}
  className="my-custom-class"
/>
```

## ⚠️ Important Notes

1. **Don't enable ads until approved**: Keep `ENABLE_ADSENSE = false` until you receive approval
2. **Don't click your own ads**: This violates AdSense policies
3. **Follow AdSense policies**: 
   - No more than 3 ad units per page
   - Don't place ads too close together
   - Ensure ads don't interfere with content
4. **Test in development**: Use `enabled={true}` locally to test placement, but don't enable globally until approved

## 🔍 Testing

Before going live:

1. Test ad placement in development
2. Verify ads don't break layout
3. Check mobile responsiveness
4. Ensure ads don't overlap content
5. Test on different screen sizes

## 📊 Monitoring

After enabling ads:

1. Monitor AdSense dashboard for performance
2. Check for policy violations
3. Optimize ad placement based on performance
4. A/B test different ad positions

## 🆘 Troubleshooting

### Ads not showing?

1. Check `ENABLE_ADSENSE` is set to `true`
2. Verify ad slot IDs are correct
3. Check browser console for errors
4. Ensure AdSense script is loaded (check `_document.tsx`)
5. Wait a few minutes after creating ad units (they need time to activate)

### Ads showing but no revenue?

1. Check AdSense dashboard for impressions
2. Verify your site is approved
3. Ensure you're not blocking ads with ad blockers
4. Check for policy violations in AdSense dashboard

## 📚 Resources

- [Google AdSense Help](https://support.google.com/adsense/)
- [AdSense Policies](https://support.google.com/adsense/answer/48182)
- [AdSense Best Practices](https://support.google.com/adsense/topic/1319754)
