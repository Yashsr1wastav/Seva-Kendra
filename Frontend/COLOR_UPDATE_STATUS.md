# Color Refactoring Status - Frontend Pages

## Completed Files (Fully Updated)
- ✅ Addiction.jsx - Semantic colors applied, dark mode classes removed
- ✅ Adolescents.jsx - Semantic colors applied  
- ✅ Beneficiaries.jsx - Semantic colors applied
- ✅ BoardPreparation.jsx - Semantic colors applied
- ✅ CBUCBODetails.jsx - Semantic colors applied
- ✅ CompetitiveExams.jsx - Semantic colors applied
- ✅ Elderly.jsx - Semantic colors applied

## Partially Completed Files (Need manual review)
- ⚠️ Dashboard.jsx - Most updates applied, some complex nested structures need manual review
- ⚠️ Dropouts.jsx - Main updates applied, view modal sections need review
- ⚠️ HIV.jsx - Main updates applied, view modal details need review

## Files Needing Updates
The following files still need the same pattern of changes applied:

### Education Module
- Entitlements.jsx
- Form.jsx
- GroupLeaders.jsx
- HealthCamps.jsx
- LegalAid.jsx
- Leprosy.jsx
- MotherChild.jsx
- ModuleReports.jsx
- OtherDiseases.jsx
- PWD.jsx
- Reports.jsx
- Schools.jsx
- SCStudents.jsx
- StudyCenters.jsx
- TBHIVAddict.jsx
- Teachers.jsx
- TrackingDashboard.jsx
- Tuberculosis.jsx
- Workshops.jsx

## Pattern of Changes

### 1. Remove ALL `dark:` prefix classes
Examples:
- `dark:bg-slate-800` → remove
- `dark:text-slate-200` → remove
- `dark:border-slate-700` → remove
- `dark:hover:bg-slate-800` → remove

### 2. Standardize Text Colors

#### Headings and Primary Text
- `text-gray-900` → `text-foreground`
- `text-gray-800` → `text-foreground`
- `text-gray-700` → `text-foreground`
- `text-slate-900` → `text-foreground`
- `text-slate-800` → `text-foreground`

#### Secondary/Muted Text
- `text-gray-600` → `text-muted-foreground`
- `text-gray-500` → `text-muted-foreground`
- `text-slate-600` → `text-muted-foreground`
- `text-slate-500` → `text-muted-foreground`
- `text-gray-400` → `text-muted-foreground`
- `text-slate-400` → `text-muted-foreground`

### 3. Standardize Background Colors

#### Light Backgrounds
- `bg-gray-100` → `bg-secondary`
- `bg-slate-100` → `bg-secondary`
- `bg-gray-50` → `bg-secondary/50`
- `bg-slate-50` → `bg-secondary/50`

#### Hover States
- `hover:bg-gray-50` → `hover:bg-secondary`
- `hover:bg-gray-100` → `hover:bg-secondary`

### 4. Common Locations to Update

#### Headers
```jsx
<h1 className="text-2xl font-bold text-gray-900"> // Change to text-foreground
```

#### Search Icons
```jsx
<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" /> 
// Change to text-muted-foreground
```

#### Empty States
```jsx
<TableCell colSpan={8} className="text-center py-4 text-gray-500">
// Change to text-muted-foreground
```

#### Pagination
```jsx
<div className="text-sm text-gray-500"> // Change to text-muted-foreground
```

#### View Modal Details
```jsx
<p className="mt-1 text-sm text-gray-600"> // Change to text-muted-foreground
```

## How to Continue

For each remaining file:

1. Open the file
2. Search for `dark:` and remove all instances
3. Search for each text color class and replace with semantic equivalent
4. Search for each bg color class and replace with semantic equivalent
5. Test the page to ensure visibility and hover states work correctly

## Testing Checklist

After updating each file, verify:
- [ ] Headers are clearly visible
- [ ] Body text is readable
- [ ] Muted text is appropriately subtle but still readable
- [ ] Hover states on buttons and rows are visible
- [ ] Empty states are clear
- [ ] Pagination text is visible
- [ ] Modal content is readable
- [ ] No console errors related to className
