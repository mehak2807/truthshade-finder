# Authentication Quick Start Guide

## What's New?

TruthShade Finder now has a complete authentication system! Users can:
- ✅ Create accounts with email and password
- ✅ Sign in securely
- ✅ Manage their profiles
- ✅ Reset forgotten passwords
- ✅ Change account settings

## 5-Minute Setup

### Step 1: Create `.env.local` file

Create a `.env.local` file in the project root (same level as `package.json`):

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

### Step 2: Get Supabase Credentials

1. Go to https://app.supabase.com
2. Create a new project (or use existing one)
3. Go to **Settings → API**
4. Copy `Project URL` and `Anon Key`
5. Paste into `.env.local`

### Step 3: Start Your App

```bash
npm run dev
```

### Step 4: Test the Authentication

1. Open http://localhost:5173
2. Click "Sign Up" (top-right button)
3. Enter your name, email, and password
4. **Instantly logged in** - no email verification needed! ✨
5. Automatically redirected to `/analyze`
6. You now have access to protected pages!

## Key Routes

| Route | Purpose | Auth Required |
|-------|---------|---------------|
| `/` | Home page | No |
| `/login` | Sign in | No |
| `/signup` | Create account | No |
| `/forgot-password` | Reset password | No |
| `/analyze` | Main analysis tool | **Yes** |
| `/learn` | Learning module | **Yes** |
| `/account` | Account settings | **Yes** |

## Using Authentication in Your Code

### Check if user is logged in

```typescript
import { useAuth } from "@/contexts/AuthContext";

function MyComponent() {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please sign in</div>;
  
  return <div>Welcome, {user.email}!</div>;
}
```

### Make a route protected

```typescript
// In App.tsx
import { ProtectedRoute } from "@/components/ProtectedRoute";

<Route
  path="/my-protected-page"
  element={
    <ProtectedRoute>
      <MyComponent />
    </ProtectedRoute>
  }
/>
```

### Add user menu to navigation

```typescript
import { UserMenu } from "@/components/UserMenu";

// In your header/nav component
<UserMenu />
```

### Sign out user

```typescript
import { useAuth } from "@/contexts/AuthContext";

function LogoutButton() {
  const { signOut } = useAuth();
  
  return (
    <button onClick={() => signOut()}>
      Sign Out
    </button>
  );
}
```

## Features Included

### 1. **Complete Auth Flow**
- Sign up with email & password
- Email verification
- Sign in
- Password reset via email
- Session persistence

### 2. **UI Components**
- Beautiful login page with animations
- Clean signup form with validation
- Account settings page with tabs
- User profile menu dropdown
- Password reset page

### 3. **Security**
- Password hashing (Supabase)
- Secure token management
- Protected routes
- Auto token refresh
- Session persistence

### 4. **Error Handling**
- User-friendly error messages
- Form validation
- Network error handling
- Clear error feedback

## Common Tasks

### Add a new protected page

```typescript
// 1. Create your page
// src/pages/MyPage.tsx
export default function MyPage() {
  return <div>My Protected Content</div>;
}

// 2. Add route in App.tsx
import MyPage from "./pages/MyPage.tsx";

<Route
  path="/my-page"
  element={
    <ProtectedRoute>
      <MyPage />
    </ProtectedRoute>
  }
/>
```

### Get current user info

```typescript
const { user } = useAuth();

console.log(user?.email);
console.log(user?.user_metadata?.full_name);
console.log(user?.id);
```

### Handle sign in errors

```typescript
const { signIn, error } = useAuth();

try {
  await signIn({ email, password });
} catch (err) {
  console.error("Sign in failed!", err);
}

// Or use the error state
if (error) {
  <Alert>{error}</Alert>
}
```

## Testing Accounts

You can create as many test accounts as you want:
- Email: `test@example.com` (use any email)
- Password: `any-password-6-chars-or-more`

Each email can only be used once, so use variations:
- `test1@example.com`
- `test2@example.com`
- `youremail+test@example.com` (email trick)

**No email verification needed** - accounts are instantly active!

## Troubleshooting

### ❌ "Auth context not found"
- Make sure `AuthProvider` is in App.tsx
- You're using `useAuth()` inside AuthProvider

### ❌ Routes still not protected
- Wrap route with `<ProtectedRoute>`
- Check route path matches exactly

### ❌ Can't sign up
- Check `.env.local` has VITE_SUPABASE_URL
- Restart dev server after creating `.env.local`
- Variables must start with `VITE_`

### ❌ Login redirects to home
- Check you're redirecting to `/analyze`, not `/`
- Verify ProtectedRoute is wrapping the component

### ❌ "Supabase URL is required"
- Create and fill `.env.local` file
- Restart `npm run dev`

## Next Steps

1. ✅ Set up environment variables
2. ✅ Test sign up and login
3. ✅ Try accessing `/analyze` without login (should redirect)
4. ✅ Add UserMenu to your navigation header
5. ✅ Customize sign up/login pages if needed
6. ✅ Set up email templates in Supabase

## File Structure

```
src/
├── services/
│   └── authService.ts          # Auth API calls
├── contexts/
│   └── AuthContext.tsx          # Auth state & hooks
├── components/
│   ├── ProtectedRoute.tsx       # Route protection
│   └── UserMenu.tsx             # User dropdown menu
└── pages/
    ├── Login.tsx                # Login page
    ├── Signup.tsx               # Sign up page
    ├── Account.tsx              # Account settings
    └── ForgotPassword.tsx       # Password reset
```

## Documentation

For detailed information, see [AUTHENTICATION_GUIDE.md](AUTHENTICATION_GUIDE.md)

---

**Happy authenticating!** 🎉
