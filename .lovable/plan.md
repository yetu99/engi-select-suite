

## Plan: Collapsible Filter, Default Card View & Read-Only Share Mode

### 1. Collapsible Filter Sidebar
**File: `src/components/FilterSidebar.tsx`**
- Wrap each filter section (Kategorie, Dichte, E-Modul, etc.) in a `Collapsible` component from the existing `@/components/ui/collapsible.tsx`
- Each section gets a clickable header with a chevron icon that toggles open/closed
- Use local `useState` to track which sections are open (default: all collapsed or first 2 open — keeping it clean)
- Add a toggle button in the sidebar header to collapse/expand the entire sidebar panel

### 2. Default View Mode: Cards
**File: `src/context/MaterialContext.tsx`**
- Change line 72: `useState<'table' | 'card'>('table')` → `useState<'table' | 'card'>('card')`

### 3. Read-Only Share Mode (No Auth Required)
Since there's no authentication system yet, the simplest effective approach:
- Add a URL query parameter `?mode=readonly` that toggles read-only mode
- Create a small context/hook (`useReadOnly`) that checks for this param
- **When read-only:**
  - `DatabaseLayout.tsx`: Hide the "Hinzufügen" nav link
  - `MaterialDetailPage.tsx`: Hide Edit, Delete buttons and the lecture notes save button
  - `MaterialCards.tsx` / `MaterialTable.tsx`: Optionally hide edit shortcuts
- **Share link:** The user shares the published URL with `?mode=readonly` appended
- Normal access (without the param) retains full editing capability

### Technical Details

**New file: `src/hooks/useReadOnly.ts`**
```typescript
export function useReadOnly(): boolean {
  const params = new URLSearchParams(window.location.search);
  return params.get('mode') === 'readonly';
}
```

**Files modified:**
| File | Change |
|------|--------|
| `src/components/FilterSidebar.tsx` | Wrap filter groups in `Collapsible` components with toggle headers |
| `src/context/MaterialContext.tsx` | Default viewMode → `'card'` |
| `src/hooks/useReadOnly.ts` | New hook checking `?mode=readonly` |
| `src/components/DatabaseLayout.tsx` | Hide "Hinzufügen" link when read-only |
| `src/pages/MaterialDetailPage.tsx` | Hide Edit/Delete/Save buttons when read-only |
| `src/pages/Index.tsx` | Pass read-only awareness (minor) |

