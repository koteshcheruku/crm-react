# 🎨 Visual Design Guide & Styling Reference

## Color Palette

### Primary Colors
```
Brand Blue:   #2563eb (Blue-600) - Main CTA, headers, active states
Light Blue:   #3b82f6 (Blue-500) - Secondary highlights
Sky Blue:     #60a5fa (Blue-400) - Hover states
Cyan:         #06b6d4 (Cyan-400) - Gradient accent
```

### Neutral Colors
```
Dark Slate:   #0f172a (Slate-900) - Sidebar background
Slate:        #1e293b (Slate-800) - Dark text
Text Gray:    #475569 (Slate-600) - Body text
Light Gray:   #cbd5e1 (Slate-200) - Borders
Very Light:   #f8fafc (Slate-50) - Page background
```

### Status Colors
```
Success:      #10b981 (Emerald-500) - Positive actions, completed
Warning:      #f59e0b (Amber-500) - Caution, pending
Error:        #ef4444 (Red-500) - Critical, errors
Info:         #3b82f6 (Blue-500) - Neutral information
```

### Gradient Palette
```
Primary:      Blue-600 → Cyan-500
Success:      Emerald-500 → Teal-400
Warning:      Orange-500 → Amber-400
Info:         Purple-500 → Pink-400
Neutral:      Slate-900 → Slate-800
```

---

## Typography

### Font Family
```
Font:         Inter (system fallback: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto)
Font URL:     https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap

Weights Used:
- 300: Light
- 400: Regular (body text)
- 500: Medium (labels)
- 600: Semibold (subheadings, buttons)
- 700: Bold (headings)
- 800: Extra bold (large titles)
```

### Font Sizes & Usage

```
48px (text-4xl) - Page titles, h1
  Example: "Dashboard", "Leads"

32px (text-3xl) - Section headers
  Example: "CRM Pro" (login page)

24px (text-2xl) - Subsection titles
  Example: "Recent Activity"

20px (text-xl) - Card titles
  Example: "Leads by Status"

18px (text-lg) - Component headers
  Example: "Profile Settings"

16px (text-base) - Body text
  Example: Table cells, paragraphs

14px (text-sm) - Secondary text, labels
  Example: Helper text, timestamps

12px (text-xs) - Micro text
  Example: Badges, small labels

11px - Timestamp text
  Example: "2 mins ago"
```

### Font Weight Usage

```
Light (300):   Subtle text, very secondary information
Regular (400): Body text, standard content
Medium (500):  Form labels, small headings
Semibold (600): Button text, table headers, important labels
Bold (700):    Headings, emphasis
Extra Bold (800): Large page titles, prominent text
```

---

## Component Styling

### Buttons

**Primary Button (CTA)**
```jsx
className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-semibold"
```
- Height: 48px
- Padding: 12px horizontal, 12px vertical
- Radius: 8px
- Font: Semibold
- Hover: Shadow increase
- Transition: 200ms

**Secondary Button**
```jsx
className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg hover:border-slate-400 font-medium transition-all"
```
- Border: 1px solid
- Hover: Border color darkens
- No shadow

**Danger Button**
```jsx
className="text-slate-300 hover:bg-red-500/10 hover:text-red-400"
```
- Red accent on hover
- Subtle background change

---

### Form Inputs

**Text Input**
```jsx
className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
```
- Height: 44px
- Radius: 8px
- Border: 1px solid
- Focus ring: 2px blue
- Transition: 150ms

**Checkbox**
```jsx
className="rounded border-slate-300"
```
- Rounded corners
- Standard styling

**Select/Dropdown**
```jsx
className="px-4 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
```

---

### Cards

**Standard Card**
```jsx
className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 hover:shadow-md transition-shadow"
```
- Background: White
- Radius: 12px (xl)
- Shadow: sm on rest, md on hover
- Border: 1px light gray
- Padding: 24px
- Transition: 200ms

**Card Header**
```jsx
className="h-20 px-6 border-b border-slate-100"
```

**Card Content**
```jsx
className="p-6 space-y-4"
```

---

### Tables

**Table Header**
```jsx
className="border-b border-slate-200 bg-slate-50"
```
- Background: Very light gray
- Border: Bottom only

**Table Header Cell**
```jsx
className="px-6 py-4 text-left text-sm font-semibold text-slate-900"
```

**Table Row**
```jsx
className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
```
- Hover: Light background
- Smooth transition

**Table Cell**
```jsx
className="px-6 py-4 text-slate-600"
```

---

### Badges & Pills

**Status Badge - New**
```jsx
className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700"
```

**Status Badge - Completed**
```jsx
className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700"
```

**Status Badge - Pending**
```jsx
className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700"
```

**Priority Badge - High**
```jsx
className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700"
```

---

### Sidebar & Navigation

**Sidebar Background**
```
Gradient: from-slate-900 to-slate-800
Width: 256px (w-64)
Shadow: shadow-2xl
```

**Menu Item - Active**
```jsx
className="bg-blue-600 text-white px-4 py-3 rounded-lg"
```

**Menu Item - Inactive**
```jsx
className="text-slate-300 hover:bg-slate-700/50 hover:text-white px-4 py-3 rounded-lg"
```

**Menu Item Spacing**
```
Vertical gap: 8px
Horizontal padding: 16px (px-4)
Vertical padding: 12px (py-3)
Icon size: 20px
```

---

### Header

**Header Styling**
```jsx
className="h-20 bg-white border-b border-slate-200 shadow-sm flex items-center justify-between px-6 sticky top-0 z-20"
```
- Height: 80px
- Sticky: Yes
- Z-index: 20
- Shadow: sm

**Header Time**
```jsx
className="text-sm text-slate-500 font-medium"
```

---

### Alerts & Messages

**Error Alert**
```jsx
className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
```
- Background: Light red
- Border: Red
- Icon + text layout

**Error Text**
```jsx
className="text-sm text-red-700"
```

---

### Icons

**Icon Sizing**
```
Small:   size={16} - Table actions, badges
Medium:  size={18} - Menu items, form labels
Large:   size={20} - Button icons, header items
XL:      size={24} - Card icons
XXL:     size={32} - Section headers
```

**Icon Colors**
```
Primary:   text-blue-600
White:     text-white (on dark backgrounds)
Gray:      text-slate-600
Hover:     group-hover:text-slate-900
Secondary: text-slate-400
```

---

## Spacing System

### Padding
```
px-2 py-2 / px-3 py-2:     Small buttons, tight spacing
px-4 py-3:                  Standard buttons, inputs
px-6 py-4:                  Table cells, larger components
px-8 py-6:                  Card padding, sections
```

### Margin
```
mb-1:   2px margin bottom
mb-2:   8px margin bottom
mb-4:   16px margin bottom
mb-6:   24px margin bottom
mb-8:   32px margin bottom
gap-2:  8px between flex items
gap-3:  12px between items
gap-4:  16px between sections
gap-6:  24px between major sections
```

### Responsive Padding
```
p-4 lg:p-8    - Mobile: 16px, Desktop: 32px
px-4 lg:px-6  - Horizontal padding changes
```

---

## Border Radius

```
rounded:     4px - Very small elements
rounded-lg:  8px - Buttons, inputs, small cards
rounded-xl:  12px - Standard cards, modals
rounded-full: 9999px - Avatars, circular badges
```

---

## Shadows

```
No shadow:           Clean, flat elements
shadow-sm:           Cards, tables, light depth
shadow-md:           Interactive elements on hover
shadow-lg:           Dropdowns, expanded panels
shadow-xl:           Modals, overlays
shadow-2xl:          Sidebar, important overlays
```

---

## Transitions & Animations

### Standard Transition
```jsx
className="transition-all duration-200"
```
- Duration: 200ms
- Property: All properties
- Timing: ease-out (default)

### Specific Transitions
```
transition-colors:    Color changes only
transition-shadow:    Shadow changes only
transition-transform: Scale/rotate changes
transition-opacity:   Fade effects
duration-150:         Fast (150ms)
duration-200:         Standard (200ms)
duration-300:         Smooth (300ms)
```

### Animation Examples

**Slide In**
```css
animation: slideIn 0.3s ease-out;
transform: translateY(-10px); opacity: 0; /* start */
transform: translateY(0); opacity: 1; /* end */
```

**Hover Scale**
```jsx
className="hover:scale-110 transition-transform"
```

**Opacity Fade**
```jsx
className="hover:opacity-75 transition-opacity"
```

---

## Layout Patterns

### Page Layout
```jsx
<div className="max-w-7xl mx-auto">
  <div className="mb-8"> {/* Header section */}
    <h1 className="text-4xl font-bold">Title</h1>
    <p className="text-slate-600">Subtitle</p>
  </div>
  {/* Content */}
</div>
```

### Grid Layout
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Items */}
</div>
```

### Card Grid
```jsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* Cards */}
</div>
```

### Flex Layout
```jsx
<div className="flex items-center justify-between gap-4">
  {/* Flex items */}
</div>
```

---

## Mobile Responsive Design

### Breakpoints
```
Mobile:   <768px    - Single column, full width
Tablet:   768-1024px - Two columns, adjusted spacing
Desktop:  >1024px   - Multi-column, optimal spacing
```

### Responsive Classes

**Hide/Show by Device**
```
hidden lg:block     - Hide on mobile, show on desktop
block lg:hidden     - Show on mobile, hide on desktop
hidden md:flex      - Hide on mobile/tablet, show on desktop
```

**Column Adjustments**
```
grid-cols-1 md:grid-cols-2 lg:grid-cols-4
- 1 column mobile
- 2 columns tablet
- 4 columns desktop
```

**Padding Adjustments**
```
p-4 lg:p-8
- 16px mobile
- 32px desktop
```

**Width Adjustments**
```
w-full lg:w-64
- 100% width mobile
- 256px width desktop
```

---

## Dark Mode Considerations

Currently: Light mode only

**For Dark Mode (future):**
```jsx
// Dark mode toggle
className="dark:bg-slate-800 dark:text-white dark:border-slate-700"
```

---

## Accessibility

### Color Contrast
- Text on light: #0f172a (Slate-900)
- Text on blue: White (#ffffff)
- Status colors: Light + Dark pair for contrast

### Focus States
```jsx
focus:outline-none focus:ring-2 focus:ring-blue-500
```

### Semantic HTML
```jsx
<button> - Interactive elements
<input type=""> - Form inputs
<table> - Tabular data
<nav> - Navigation
<header> - Header section
<main> - Main content
<section> - Content sections
```

---

## Performance Optimization

### CSS Best Practices
- Utility classes only (Tailwind)
- No inline styles
- No unused CSS
- Responsive images ready

### Animation Performance
- Use `transform` and `opacity` only
- Avoid animating `width`, `height`
- Hardware-accelerated properties

---

## Print Styles

Not currently implemented, but would include:
- Hide navigation elements
- Full-width content
- High contrast colors
- Page breaks for tables

---

## Browser-Specific Styling

### Scrollbar (Webkit)
```css
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
```

### Firefox (CSS)
```css
scrollbar-width: thin;
scrollbar-color: #cbd5e1 transparent;
```

---

**Design System Complete ✅**