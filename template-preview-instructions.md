# Invoice Template Preview Images Instructions

This document explains how to add PNG preview images for the invoice templates in FlowDesk.

## Overview

The invoice template system uses PNG images to display previews of each template in:
- The template selection page (`/invoice-templates`)
- The invoice creation/edit page (when a template is selected)
- The full preview modal

## Required Images

For each of the 15 invoice templates, you need to create PNG preview images from your original template screenshots.

### Template IDs

The following template IDs are used in the system:
1. `modern-blue`
2. `minimalist-gray`
3. `corporate-dark`
4. `creative-orange`
5. `elegant-purple`
6. `fresh-green`
7. `classic-navy`
8. `tech-gradient`
9. `bold-contrast` (for Bold Black & Yellow)
10. `soft-pastel`
11. `professional-teal`
12. `luxury-gold`
13. `startup-pink`
14. `accounting-blue`
15. `consulting-gray`
16. `default` (optional - for the default template)

## Image Specifications

### Preview Images (Required)
- **Filename format**: `{template-id}-preview.png`
- **Example**: `modern-blue-preview.png`
- **Recommended size**: 400x500px (or similar aspect ratio)
- **Purpose**: Used in template grid cards and invoice creation page

### Full Preview Images (Optional)
- **Filename format**: `{template-id}-full.png`
- **Example**: `modern-blue-full.png`
- **Recommended size**: 800x1000px or larger
- **Purpose**: Used in the full preview modal for detailed viewing

## Directory Structure

Place all PNG images in the public directory:

```
public/
  template-previews/
    modern-blue-preview.png
    modern-blue-full.png
    minimalist-gray-preview.png
    minimalist-gray-full.png
    corporate-dark-preview.png
    corporate-dark-full.png
    creative-orange-preview.png
    creative-orange-full.png
    elegant-purple-preview.png
    elegant-purple-full.png
    fresh-green-preview.png
    fresh-green-full.png
    classic-navy-preview.png
    classic-navy-full.png
    tech-gradient-preview.png
    tech-gradient-full.png
    bold-contrast-preview.png
    bold-contrast-full.png
    soft-pastel-preview.png
    soft-pastel-full.png
    professional-teal-preview.png
    professional-teal-full.png
    luxury-gold-preview.png
    luxury-gold-full.png
    startup-pink-preview.png
    startup-pink-full.png
    accounting-blue-preview.png
    accounting-blue-full.png
    consulting-gray-preview.png
    consulting-gray-full.png
    default-preview.png
    default-full.png
```

## Creating Preview Images

1. **From your template screenshots**: Crop each template from your original screenshot
2. **Maintain aspect ratio**: Keep the invoice's natural proportions
3. **Include key elements**: Ensure the header, invoice details, and table are visible
4. **Optimize file size**: Use PNG compression to keep files under 200KB each

## Fallback Behavior

If a preview image is not found:
- The system displays a colored placeholder with the template name
- The placeholder uses the template's primary color from the configuration
- This ensures the UI remains functional even without images

## Testing

After adding the images:
1. Visit `/invoice-templates` to see preview cards
2. Click "Preview" on any template to test the full preview modal
3. Select a template and go to create invoice to see the thumbnail
4. Check browser console for any 404 errors on missing images

## Notes

- The images are served statically from the public directory
- No build process is required - simply add the PNG files
- Clear browser cache if images don't appear immediately
- The system works without images (shows colored placeholders)
