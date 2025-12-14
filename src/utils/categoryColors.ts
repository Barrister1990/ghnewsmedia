/**
 * Utility to convert category colors to softer, less eye-straining versions
 * while maintaining good contrast for white text
 */

export const getSoftCategoryColor = (originalColor: string): string => {
  // If the color is already in a good range, return it
  // Otherwise, convert to a softer version
  
  // Remove # if present
  const hex = originalColor.replace('#', '');
  
  // Parse RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calculate brightness
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  // If color is too bright or too dark, adjust it
  // Target: Medium brightness (100-150) for better readability
  if (brightness > 180 || brightness < 80) {
    // Convert to a softer, more muted version
    // Blend with a neutral gray to reduce saturation
    const targetBrightness = 120; // Medium brightness
    const factor = 0.6; // How much to blend
    
    const newR = Math.round(r * factor + (targetBrightness * (1 - factor)));
    const newG = Math.round(g * factor + (targetBrightness * (1 - factor)));
    const newB = Math.round(b * factor + (targetBrightness * (1 - factor)));
    
    // Ensure minimum contrast for white text (at least 4.5:1)
    // If still too light, darken it
    const finalBrightness = (newR * 299 + newG * 587 + newB * 114) / 1000;
    if (finalBrightness > 150) {
      const darkenFactor = 0.7;
      return `#${Math.round(newR * darkenFactor).toString(16).padStart(2, '0')}${Math.round(newG * darkenFactor).toString(16).padStart(2, '0')}${Math.round(newB * darkenFactor).toString(16).padStart(2, '0')}`;
    }
    
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  }
  
  // If color is in good range, just slightly desaturate it
  const desaturateFactor = 0.85;
  const gray = (r + g + b) / 3;
  const newR = Math.round(r * desaturateFactor + gray * (1 - desaturateFactor));
  const newG = Math.round(g * desaturateFactor + gray * (1 - desaturateFactor));
  const newB = Math.round(b * desaturateFactor + gray * (1 - desaturateFactor));
  
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
};

// Predefined soft color palette for common categories
export const softCategoryColors: Record<string, string> = {
  'News': '#4A5568',        // Soft gray-blue
  'Entertainment': '#805AD5', // Soft purple
  'Sports': '#38A169',      // Soft green
  'Business': '#2B6CB0',    // Soft blue
  'Lifestyle': '#D69E2E',  // Soft amber
  'Tech': '#3182CE',        // Soft blue
  'Politics': '#C53030',    // Soft red (keep breaking news red)
  'Health': '#319795',      // Soft teal
  'Education': '#9F7AEA',   // Soft violet
  'World': '#2D3748',       // Soft dark gray
};

export const getCategoryColor = (categoryName: string, originalColor: string): string => {
  // First check if we have a predefined soft color
  const normalizedName = categoryName.trim();
  if (softCategoryColors[normalizedName]) {
    return softCategoryColors[normalizedName];
  }
  
  // Otherwise, use the utility to soften the original color
  return getSoftCategoryColor(originalColor);
};
