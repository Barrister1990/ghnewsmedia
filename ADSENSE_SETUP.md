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
   - **Display ads** (for in-article, sidebar)
   - **In-article ads** (for between content)
   - **Anchor ads** (optional)
5. Copy the **Ad unit ID** (format: `1234567890`)

### Step 3: Configure Ad Slots

1. Open `src/config/adsense.ts`
2. Update `ENABLE_ADSENSE` to `true`
3. Replace placeholder ad slot IDs with your actual IDs:

```typescript
export const AD_SLOTS = {
  IN_ARTICLE_1: '1234567890', // Your actual ad slot ID
  IN_ARTICLE_2: '0987654321',
  SIDEBAR_TOP: '1122334455',
  // ... etc
};
```

## 📦 Available Components

### 1. AdSenseAd (Base Component)

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

### 2. InArticleAd

For placing ads between article paragraphs:

```tsx
import { InArticleAd } from '@/components/AdSense';
import { AD_SLOTS } from '@/config/adsense';

<InArticleAd adSlot={AD_SLOTS.IN_ARTICLE_1} />
```

### 3. SidebarAd

For sidebar placements (300x250, 300x600):

```tsx
import { SidebarAd } from '@/components/AdSense';
import { AD_SLOTS } from '@/config/adsense';

<SidebarAd adSlot={AD_SLOTS.SIDEBAR_TOP} />
```

### 4. BannerAd

For horizontal banner ads (728x90, 970x90):

```tsx
import { BannerAd } from '@/components/AdSense';
import { AD_SLOTS } from '@/config/adsense';

<BannerAd adSlot={AD_SLOTS.BANNER_TOP} />
```

## 📍 Recommended Ad Placements

### Article Pages (`[category]/[slug].tsx`)

1. **Top of article** (after header, before content):
```tsx
<BannerAd adSlot={AD_SLOTS.BANNER_TOP} />
```

2. **Between paragraphs** (in ArticleContent component):
```tsx
<InArticleAd adSlot={AD_SLOTS.IN_ARTICLE_1} />
```

3. **Bottom of article** (before related articles):
```tsx
<BannerAd adSlot={AD_SLOTS.BANNER_BOTTOM} />
```

### Homepage (`index.tsx`)

1. **Top banner** (after hero section):
```tsx
<BannerAd adSlot={AD_SLOTS.HOMEPAGE_TOP} />
```

2. **Between sections**:
```tsx
<BannerAd adSlot={AD_SLOTS.HOMEPAGE_MIDDLE} />
```

### Category Pages

1. **Sidebar** (if you have a sidebar):
```tsx
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
