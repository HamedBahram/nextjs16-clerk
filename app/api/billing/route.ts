import { auth } from '@clerk/nextjs/server'

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

  return Response.json({
    success: true,
    billing: {
      plan: 'Pro Plan',
      amount: 29.99,
      currency: 'USD',
      nextBillingDate: '2026-12-26',
      paymentMethod: '**** **** **** 4242',
    },
  })
}

export async function POST() {
  const { userId, agent } = await auth()

  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (agent) {
    return Response.json(
      { error: 'Agents cannot change billing' },
      { status: 403 }
    )
  }

  return Response.json({
    success: true,
    message: 'Billing updated successfully',
  })
}
