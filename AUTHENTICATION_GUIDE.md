# Authentication System Documentation

## Overview
TruthShade Finder now includes a complete authentication system powered by Supabase, allowing users to create accounts, sign in, and manage their profiles securely.

## Features

### 1. **User Authentication**
- Email/Password signup and login
- **No email verification required** - instant account creation
- Password reset functionality
- Session management
- Automatic token refresh

### 2. **Protected Routes**
- Certain pages require authentication
- Automatic redirect to login for unauthenticated users
- Protected routes: `/analyze`, `/learn`, `/account`

### 3. **User Profiles**
- Full user profile management
- Account settings page
- Password change functionality
- User information display

## Architecture

### Components

#### **AuthContext** (`src/contexts/AuthContext.tsx`)
- Manages application-wide authentication state
- Provides auth methods through custom hook `useAuth()`
- Handles auth state persistence
- Methods:
  - `signUp()` - Register new user
  - `signIn()` - Login user
  - `signOut()` - Logout user
  - `resetPassword()` - Send password reset email
  - `clearError()` - Clear error messages

#### **Auth Service** (`src/services/authService.ts`)
- Wrapper around Supabase Auth API
- Handles all authentication operations
- Session management
- Error handling

#### **ProtectedRoute** (`src/components/ProtectedRoute.tsx`)
- Higher-order component for protected pages
- Checks user authentication status
- Shows loading spinner while checking auth
- Redirects to login if unauthenticated

#### **UserMenu** (`src/components/UserMenu.tsx`)
- User dropdown menu component
- Shows user info and initials
- Quick access to account settings
- Sign out functionality

### Pages

#### **Login** (`src/pages/Login.tsx`)
- Email and password login form
- Error handling and validation
- "Forgot password?" link
- Sign up link
- Beautiful gradient UI with animations

```
Route: /login
Auth Required: No
```

#### **Signup** (`src/pages/Signup.tsx`)
- User registration form
- Fields: Full Name, Email, Password, Confirm Password
- Email verification required
- Success message with redirect to login
- Input validation

```
Route: /signup
Auth Required: No
```

#### **Account Settings** (`src/pages/Account.tsx`)
- Profile management tab
- Password change tab
- User information display
- Sign out button
- Settings dashboard

```
Route: /account
Auth Required: Yes
```

#### **Forgot Password** (`src/pages/ForgotPassword.tsx`)
- Password reset request form
- Email validation
- Success confirmation message
- Return to login link

```
Route: /forgot-password
Auth Required: No
```

## Setup & Configuration

### 1. **Environment Variables**
Create a `.env.local` file in the project root:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

### 2. **Supabase Setup**
1. Create a Supabase project at https://app.supabase.com
2. Get your URL and Publishable Key from project settings
3. Enable Email authentication in Supabase Auth settings

### 3. **Email Configuration** (Optional)
Configure custom SMTP or email providers in Supabase:
- Settings → Auth → Email Templates
- Customize password reset, verification emails

## Usage

### Using Authentication in Components

```typescript
import { useAuth } from "@/contexts/AuthContext";

function MyComponent() {
  const { user, loading, error, signIn, signOut } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <button onClick={() => navigate("/login")}>Sign In</button>;
  }

  return (
    <div>
      <p>Welcome, {user.email}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### Creating Protected Pages

```typescript
import { ProtectedRoute } from "@/components/ProtectedRoute";

// In App.tsx
<Route
  path="/protected-page"
  element={
    <ProtectedRoute>
      <MyProtectedComponent />
    </ProtectedRoute>
  }
/>
```

### Adding User Menu to Navigation

```typescript
import { UserMenu } from "@/components/UserMenu";

function Navigation() {
  return (
    <nav>
      {/* Other nav items */}
      <UserMenu />
    </nav>
  );
}
```

## User Flow

### Sign Up Flow
1. User visits `/signup`
2. Enters full name, email, password
3. Form validates input
4. Creates account in Supabase
5. **Instantly signed in** - no email verification needed
6. Automatically redirected to `/analyze`
7. Protected routes now accessible

### Sign In Flow
1. User visits `/login`
2. Enters email and password
3. Form validates input
4. Authenticates with Supabase
5. Session created and persisted
6. Redirects to `/analyze`
7. Protected routes now accessible

### Password Reset Flow
1. User visits `/forgot-password`
2. Enters email address
3. Reset email sent by Supabase
4. User clicks link in email
5. Password updated
6. Can sign in with new password

### Account Management Flow
1. Authenticated user visits `/account`
2. Can view profile information
3. Can change display name
4. Can change password
5. Can sign out

## Security Features

- ✅ Password hashing (Supabase handles)
- ✅ Secure session tokens
- ✅ Automatic token refresh
- ✅ Email verification
- ✅ Password reset via email
- ✅ Protected routes with auth check
- ✅ HTTPS-only (production)
- ✅ localStorage persistence with security options

## Error Handling

All auth operations include comprehensive error handling:
- Network errors
- Invalid credentials
- Email already exists
- Password validation errors
- Session expiration

## Future Enhancements

- [ ] Multi-factor authentication (MFA)
- [ ] Social login (Google, GitHub)
- [ ] Email templates customization
- [ ] User roles and permissions
- [ ] Activity logging
- [ ] Two-factor authentication
- [ ] Account recovery options

## Troubleshooting

### "Auth context not found" Error
- Ensure `AuthProvider` wraps your app in `App.tsx`
- `useAuth()` must be used inside `AuthProvider`

### Routes not requiring auth
- Wrap route with `<ProtectedRoute>` component
- Check route exists in App.tsx

### Environmental variables not loading
- File must be named `.env.local`
- Restart dev server after adding variables
- Variables must start with `VITE_`

### Email verification not working
- Check Supabase auth settings
- Verify SMTP/email provider configuration
- Check email templates in Supabase dashboard

## Files Modified/Created

### New Files
- `src/services/authService.ts`
- `src/contexts/AuthContext.tsx`
- `src/components/ProtectedRoute.tsx`
- `src/components/UserMenu.tsx`
- `src/pages/Login.tsx`
- `src/pages/Signup.tsx`
- `src/pages/Account.tsx`
- `src/pages/ForgotPassword.tsx`
- `.env.example`

### Modified Files
- `src/App.tsx` - Added AuthProvider and protected routes

## Testing Authentication

### Manual Testing Checklist
- [ ] Sign up with new email
- [ ] Receive verification email
- [ ] Verify email address
- [ ] Sign in with credentials
- [ ] Access protected routes
- [ ] Update account settings
- [ ] Change password
- [ ] Sign out
- [ ] Try accessing protected route without auth → redirect to login
- [ ] Password reset flow
- [ ] Edit profile information

## Deployment Considerations

1. **Environment Variables**: Set Supabase credentials in production environment
2. **Email Configuration**: Configure production email provider
3. **Redirect URLs**: Update Supabase auth redirect URLs for production domain
4. **HTTPS**: Ensure HTTPS is enabled in production
5. **Rate Limiting**: Consider implementing rate limiting on auth endpoints
6. **Cache Headers**: Set appropriate cache headers for auth pages

## Support & Resources

- Supabase Documentation: https://supabase.com/docs
- Supabase Auth: https://supabase.com/docs/guides/auth
- React Router Docs: https://reactrouter.com/
- TypeScript Docs: https://www.typescriptlang.org/docs/
