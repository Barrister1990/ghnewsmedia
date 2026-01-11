/**
 * Google AdSense Configuration
 * 
 * IMPORTANT: Set ENABLE_ADSENSE to true ONLY after your site has been approved by Google AdSense
 * 
 * To enable ads:
 * 1. Get your AdSense account approved
 * 2. Create ad units in your AdSense dashboard
 * 3. Get the ad slot IDs for each ad unit
 * 4. Update the ad slot IDs below
 * 5. Set ENABLE_ADSENSE to true
 */

// Set to true after AdSense approval
export const ENABLE_ADSENSE = true;

// AdSense Publisher ID
export const ADSENSE_CLIENT_ID = 'ca-pub-9758177091764288';

// Ad Slot IDs - Update these with your actual ad slot IDs from AdSense dashboard
export const AD_SLOTS = {
  // In-article ads (between content)
  IN_ARTICLE_1: '5357563959', // In-article ad unit
  IN_ARTICLE_2: 'YOUR_IN_ARTICLE_AD_SLOT_ID_2',
  
  // Multiplex/Auto ads (autorelaxed format - automatically adapts)
  MULTIPLEX_1: '7777851341', // Multiplex ad unit
  MULTIPLEX_2: 'YOUR_MULTIPLEX_AD_SLOT_ID_2',
  
  // Sidebar ads
  SIDEBAR_TOP: 'YOUR_SIDEBAR_TOP_AD_SLOT_ID',
  SIDEBAR_MIDDLE: 'YOUR_SIDEBAR_MIDDLE_AD_SLOT_ID',
  SIDEBAR_BOTTOM: 'YOUR_SIDEBAR_BOTTOM_AD_SLOT_ID',
  
  // Banner ads
  BANNER_TOP: 'YOUR_BANNER_TOP_AD_SLOT_ID',
  BANNER_BOTTOM: 'YOUR_BANNER_BOTTOM_AD_SLOT_ID',
  
  // Homepage specific
  HOMEPAGE_TOP: 'YOUR_HOMEPAGE_TOP_AD_SLOT_ID',
  HOMEPAGE_MIDDLE: 'YOUR_HOMEPAGE_MIDDLE_AD_SLOT_ID',
} as const;
