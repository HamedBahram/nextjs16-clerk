# Clerk Poppy (Personal Agent Protocol) Demo

This demo showcases Clerk's support for the Personal Agent Protocol (Poppy), allowing AI agents to access your application with signed-in browser sessions.

## What's Implemented

- **Poppy Discovery**: Automatic serving of `/.well-known/poppy.json` and `/.well-known/oauth-protected-resource`
- **Agent Detection**: Dashboard shows an indicator when accessed by an agent
- **Agent Restrictions**: `/api/billing` endpoint blocks agent access (403) while allowing human users

## Prerequisites

1. **Clerk Account**: Sign up at [clerk.com](https://clerk.com)
2. **Environment Variables**: Create `.env.local` with:
   ```bash
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   ```

3. **Dashboard Configuration**:
   - Navigate to **Agents** → **Personal Agent Protocol** in the Clerk Dashboard
   - Toggle **ON**: "Enable Browser Session Endpoint"
   - Keep the Account Portal enabled (hosts OAuth consent screen)

## Local Development Setup

### Option 1: Using ngrok (Recommended for Poppy Testing)

1. Install ngrok:
   ```bash
   # macOS
   brew install ngrok
   
   # Or download from https://ngrok.com
   ```

2. Start your Next.js app:
   ```bash
   pnpm dev
   ```

3. In a separate terminal, expose localhost with ngrok:
   ```bash
   ngrok http 3000
   ```

4. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

5. Configure Clerk:
   - In Clerk Dashboard → **Domains**, add your ngrok domain as a development domain
   - Update your `.env.local` if needed to match the domain

### Option 2: Using Cloudflare Tunnel

```bash
cloudflared tunnel --url http://localhost:3000
```

### Option 3: Direct localhost (without agent testing)

```bash
pnpm dev
```

Visit `http://localhost:3000` - Poppy endpoints won't be accessible to external agents but you can test the UI locally.

## Testing the Implementation

### 1. Check Poppy Discovery Endpoints

```bash
# Replace YOUR_DOMAIN with your ngrok URL or production domain
curl https://YOUR_DOMAIN/.well-known/poppy.json
```

Expected response:
```json
{
  "web": {
    "browser_session_endpoint": "https://clerk-hosted-endpoint...",
    "unscoped": true
  }
}
```

Check OAuth protected resource metadata:
```bash
curl https://YOUR_DOMAIN/.well-known/oauth-protected-resource
```

### 2. Test the Dashboard (Human Session)

1. Sign in at `https://YOUR_DOMAIN/sign-in`
2. Navigate to `https://YOUR_DOMAIN/dashboard`
3. You should see your user information
4. No agent indicator should appear

### 3. Test the Billing Endpoint (Human Session)

```bash
# Replace YOUR_DOMAIN and use a valid session cookie
curl -H "Cookie: __session=YOUR_SESSION_COOKIE" \
  https://YOUR_DOMAIN/api/billing
```

Expected response:
```json
{
  "success": true,
  "billing": {
    "plan": "Pro Plan",
    "amount": 29.99,
    "currency": "USD",
    "nextBillingDate": "2026-12-26",
    "paymentMethod": "**** **** **** 4242"
  }
}
```

### 4. Test Agent Access (If you have agent credentials)

When an agent accesses the application:

**Dashboard**: Will show an amber banner:
```
🤖 Agent Session Active (ID: agent_...)
```

**Billing endpoint**:
```bash
# With agent session credentials
curl -H "Authorization: Bearer AGENT_ACCESS_TOKEN" \
  https://YOUR_DOMAIN/api/billing
```

Expected response:
```json
{
  "error": "Agents cannot access billing"
}
```
Status: `403 Forbidden`

### 5. Test Unauthenticated Access

```bash
curl https://YOUR_DOMAIN/api/billing
```

Expected response:
```json
{
  "error": "Unauthorized"
}
```
Status: `401 Unauthorized`

## Code Implementation

### Middleware (proxy.ts)

```typescript
export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
}, {
  poppy: true,  // Enables Poppy discovery
})
```

### Dashboard Page (app/(site)/dashboard/page.tsx)

- Uses `await auth()` to get `agent` property
- Shows agent indicator when `agent` is present
- Displays user information accessible to agents

### Billing Route (app/api/billing/route.ts)

```typescript
export async function GET() {
  const { userId, agent } = await auth()

  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (agent) {
    return Response.json(
      { error: 'Agents cannot access billing' },
      { status: 403 }
    )
  }

  // Return billing data for human users
  return Response.json({ success: true, billing: {...} })
}
```

## What Hamed Needs to Do

1. **Get Clerk Keys**:
   - Create a Clerk application at [dashboard.clerk.com](https://dashboard.clerk.com)
   - Copy the publishable and secret keys to `.env.local`

2. **Enable Poppy in Dashboard**:
   - Navigate to **Agents** → **Personal Agent Protocol**
   - Toggle **ON**: "Enable Browser Session Endpoint"
   - Ensure Account Portal is enabled

3. **Set up Public Domain** (for agent testing):
   - Use ngrok or deploy to Vercel/production
   - Add the domain to Clerk Dashboard under **Domains**
   - For ngrok: Note that the URL changes on restart unless you have a paid plan

4. **Test with an Agent**:
   - You'll need access to a Poppy-compatible agent (or Clerk's test tools)
   - The agent should discover your app via the `.well-known/poppy.json` endpoint
   - User approval happens on Clerk's OAuth consent screen

## Notes for Recording

- **Font Size**: Increase terminal and browser font sizes for readability
- **Window Size**: Use a reasonable resolution (1920x1080 or similar)
- **Clear Data**: The dashboard shows obvious placeholder data perfect for demo
- **Quick Flow**: 
  1. Show middleware code (5 seconds)
  2. Show billing route code (10 seconds)
  3. curl the well-known endpoints (5 seconds each)
  4. Show dashboard in browser (10 seconds)
  5. curl billing endpoint - show human success (5 seconds)
  6. Mention agent gets 403 (5 seconds)

Total: ~45 seconds of core demo content

## Troubleshooting

### "Clerk: auth() was called but Clerk can't detect your Middleware"
- Ensure `proxy.ts` (Next.js 16+) or `middleware.ts` (Next.js ≤15) exists
- Check the matcher includes your routes

### Well-known endpoints return 404
- Verify `poppy: true` is set in middleware options
- Ensure middleware matcher doesn't exclude `/.well-known/*`
- Check that the middleware is actually running

### Agent property is always undefined
- Verify you're using `@clerk/nextjs` 7.10.0 or later
- Ensure the request includes valid agent authentication
- Check Clerk Dashboard has "Enable Browser Session Endpoint" toggled ON

## Production Deployment

When deploying to production:
1. Set environment variables in your hosting platform
2. Update Clerk Dashboard with your production domain
3. Ensure HTTPS is enabled (required for Poppy)
4. Test all endpoints with production URLs

## Resources

- [Clerk Poppy Documentation](https://clerk.com/docs/guides/ai/personal-agent-protocol)
- [Personal Agent Protocol Spec](https://personalagentprotocol.org/docs/1.0/spec)
- [Restrict Agent Sessions Guide](https://clerk.com/docs/guides/ai/restrict-agent-sessions)
