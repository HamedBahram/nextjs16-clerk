# Clerk Poppy Demo - Quick Setup

## 1. Environment Variables

Create `.env.local`:
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

## 2. Enable in Clerk Dashboard

- Go to **Agents** → **Personal Agent Protocol**
- Toggle **ON**: "Enable Browser Session Endpoint"
- Keep Account Portal enabled

## 3. Run with HTTPS Tunnel

```bash
# Terminal 1: Start the app
bun dev

# Terminal 2: Expose with ngrok (primary option)
ngrok http 3000

# Alternative: Cloudflare Tunnel (backup option)
cloudflared tunnel --url http://localhost:3000
```

Copy the HTTPS URL from ngrok/cloudflare output.

## 4. Test the Endpoints

```bash
# Check Poppy discovery
curl https://YOUR_NGROK_URL/.well-known/poppy.json

# Check OAuth metadata
curl https://YOUR_NGROK_URL/.well-known/oauth-protected-resource

# Test billing (unauthenticated - should return 401)
curl https://YOUR_NGROK_URL/api/billing

# Test billing (with valid session - returns billing data)
# After signing in, grab your __session cookie from browser dev tools
curl -H "Cookie: __session=YOUR_SESSION" https://YOUR_NGROK_URL/api/billing
```

## What's Built

- **Middleware** (`proxy.ts`): Serves Poppy discovery with `poppy: true`
- **Dashboard** (`/dashboard`): Shows agent indicator when accessed by agent
- **Billing API** (`/api/billing`): Returns 403 for agents, 401 for unauthenticated, 200 with data for humans

## Expected Responses

**Poppy discovery** (`/.well-known/poppy.json`):
```json
{ "web": { "browser_session_endpoint": "...", "unscoped": true } }
```

**Billing (human)**: 200 with billing data  
**Billing (agent)**: `{"error":"Agents cannot access billing"}` (403)  
**Billing (no auth)**: `{"error":"Unauthorized"}` (401)
