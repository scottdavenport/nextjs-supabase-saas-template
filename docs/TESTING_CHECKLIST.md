# Testing Checklist

This checklist helps ensure your application works correctly across different scenarios.

## Authentication Testing

### Email/Password Authentication
- [ ] **Signup Flow**
  - [ ] Create new account with valid email/password
  - [ ] Verify email confirmation required (if enabled)
  - [ ] Test with invalid email format
  - [ ] Test with weak password
  - [ ] Test with existing email
  - [ ] Verify profile creation in database

- [ ] **Signin Flow**
  - [ ] Sign in with valid credentials
  - [ ] Test with invalid password
  - [ ] Test with non-existent email
  - [ ] Verify redirect to dashboard
  - [ ] Test session persistence

### OAuth Authentication
- [ ] **Google OAuth**
  - [ ] Click Google sign-in button
  - [ ] Complete OAuth flow
  - [ ] Verify profile creation
  - [ ] Test with existing Google account

- [ ] **Apple OAuth** (if enabled)
  - [ ] Click Apple sign-in button
  - [ ] Complete OAuth flow
  - [ ] Verify profile creation

### Authentication State Management
- [ ] **Session Persistence**
  - [ ] Refresh page - stay logged in
  - [ ] Close browser - stay logged in
  - [ ] Test session timeout (if configured)
  - [ ] Verify auth state persists

- [ ] **Signout Flow**
  - [ ] Click signout button
  - [ ] Verify redirect to login
  - [ ] Verify session cleared
  - [ ] Test signout from multiple tabs

## Protected Routes & Middleware

### Route Protection
- [ ] **Unauthenticated Access**
  - [ ] Try to access `/dashboard` without login
  - [ ] Try to access `/settings` without login
  - [ ] Verify redirect to login page
  - [ ] Verify `redirectTo` query param preserved
  - [ ] Test redirect after login

- [ ] **Authenticated Access**
  - [ ] Access `/dashboard` while logged in
  - [ ] Access `/settings` while logged in
  - [ ] Verify no redirects occur

### Auth Route Protection
- [ ] **Authenticated Users on Auth Routes**
  - [ ] Try to access `/login` while logged in
  - [ ] Try to access `/signup` while logged in
  - [ ] Verify redirect to dashboard

## Error Handling

- [ ] **404 Page**
  - [ ] Navigate to non-existent route
  - [ ] Verify 404 page displays
  - [ ] Test navigation from 404 page

- [ ] **Global Error Boundary**
  - [ ] Trigger unhandled error
  - [ ] Verify error page displays
  - [ ] Test "Try again" button
  - [ ] Verify error logged (if Sentry configured)

- [ ] **API Error Handling**
  - [ ] Test API error responses
  - [ ] Verify standardized error format
  - [ ] Test error messages display correctly

## Playwright Testing

### Setup Tests
```bash
# Ensure test credentials are set
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=test-password-123

# Run tests
pnpm test
```

### Test Coverage
- [ ] **Authentication Setup** - Test account creation
- [ ] **Route Smoke Tests** - All routes load correctly
- [ ] **404 Behavior** - Invalid routes handled
- [ ] **Redirects** - Auth redirects work correctly
- [ ] **Route Protection** - Protected routes require auth

## Cross-Browser Testing

### Desktop Browsers
- [ ] **Chrome** - Test all functionality
- [ ] **Firefox** - Test all functionality
- [ ] **Safari** - Test all functionality

### Mobile Testing
- [ ] **Mobile Chrome** - Test responsive design
- [ ] **Mobile Safari** - Test responsive design

## Performance Testing

- [ ] **Page Load Times** - Test initial page load
- [ ] **Navigation Speed** - Test route transitions
- [ ] **Resource Usage** - Monitor memory/CPU usage

## Error Handling Testing

### Error Scenarios
- [ ] **Network Errors** - Test offline functionality
- [ ] **User Errors** - Test invalid inputs
- [ ] **API Errors** - Test error recovery

### Error Recovery
- [ ] **Error Messages** - Verify clear error messages
- [ ] **Error Recovery** - Test error recovery options

## Database Testing

- [ ] **RLS Policies** - Verify users can only access own data
- [ ] **Migration Testing** - Test migrations on preview branches
- [ ] **Data Integrity** - Verify data relationships work correctly

## Documentation

- [ ] **README** - Update with setup instructions
- [ ] **API Documentation** - Document any new endpoints
- [ ] **Migration Notes** - Document database changes

## Pre-Deployment Checklist

- [ ] All tests pass
- [ ] Environment variables configured
- [ ] Database migrations tested
- [ ] Error handling verified
- [ ] Cross-browser tested
- [ ] Documentation updated

