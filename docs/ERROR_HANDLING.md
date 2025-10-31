# Error Handling & 404 Strategy

## Overview

We use a layered error handling approach with consistent UI across all error states:

1. **Global Error Boundary** (`global-error.tsx`) - Catches all unhandled errors
2. **Route-level Error Boundaries** (`error.tsx`) - Catches errors in specific routes (optional)
3. **404 Not Found** (`not-found.tsx`) - Handles missing pages
4. **Component Error Boundary** - Wraps specific components (optional)

## Error Pages

### Global Error (`src/app/global-error.tsx`)
- **When it triggers:** Unhandled errors in the root layout or app
- **Features:**
  - Sentry error tracking (if configured)
  - "Try again" button (resets error state)
  - "Go to Dashboard" fallback link
  - Development error message display
  - Follows design system (Card, Button components)

### 404 Not Found (`src/app/not-found.tsx`)
- **When it triggers:** User navigates to non-existent route
- **Features:**
  - Clear 404 messaging
  - "Go to Dashboard" button
  - Follows design system styling

## Error Handling Best Practices

### Server Components
- Use `try/catch` for async operations
- Return error state to client via props
- Log errors to Sentry (if configured)

### Client Components
- Use React Error Boundaries for component-level errors
- Display user-friendly messages
- Handle loading and error states gracefully

### API Routes
- Use standardized error responses (see `src/lib/api/errors.ts`)
- Return proper HTTP status codes
- Log to Sentry for monitoring (if configured)

## API Error Utilities

The template includes standardized error handling utilities:

### `errorResponse()` - Standardized Error Format
```typescript
import { errorResponse } from '@/lib/api/errors';

return errorResponse('VALIDATION_ERROR', 'Invalid input', {
  details: validationErrors,
  status: 400
});
```

### `okResponse()` - Standardized Success Format
```typescript
import { okResponse } from '@/lib/api/errors';

return okResponse({ data: result }, { status: 200 });
```

## Design System Compliance

All error pages follow the design system:
- **Cards:** Use `Card` component with header/content
- **Buttons:** Use `Button` component with icons
- **Colors:** Use semantic colors (destructive for errors)
- **Typography:** Follow scale (text-sm, text-base, text-lg)
- **Spacing:** Use consistent spacing patterns
- **Icons:** Use lucide-react icons consistently

## Testing Error States

To test error handling:
1. Navigate to non-existent route (e.g., `/does-not-exist`) → Should show 404
2. Trigger unhandled error in component → Should show global error
3. Test API error responses → Should use standardized format

## Monitoring

- **Sentry:** All errors automatically captured (if configured)
- **Development:** Error messages shown in UI
- **Production:** User-friendly messages, errors logged

