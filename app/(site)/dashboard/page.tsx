import { auth, currentUser } from '@clerk/nextjs/server'

export default async function DashboardPage() {
  const { userId, agent } = await auth()
  const user = await currentUser()

  // Mock user data for demo purposes
  const userData = {
    name: user?.fullName || 'Demo User',
    email: user?.emailAddresses[0]?.emailAddress || 'demo@example.com',
    plan: 'Pro Plan',
    usage: '2.4 GB / 10 GB',
    projects: 12,
    lastLogin: new Date().toLocaleDateString(),
  }

  return (
    <section className='w-full py-32'>
      <div className='container max-w-7xl'>
        <h1 className='font-heading mt-0.5 text-2xl font-medium tracking-wide sm:text-3xl'>
          Dashboard
        </h1>

        {agent && (
          <div className='mt-4 rounded-lg border border-amber-500 bg-amber-50 p-4 dark:bg-amber-950/20'>
            <p className='text-sm font-medium text-amber-800 dark:text-amber-200'>
              🤖 Agent Session Active (ID: {agent.sub})
            </p>
          </div>
        )}

        <div className='mt-8 space-y-6'>
          <div className='rounded-lg border bg-card p-6'>
            <h2 className='text-xl font-semibold mb-4'>User Information</h2>
            <dl className='space-y-3'>
              <div>
                <dt className='text-sm font-medium text-muted-foreground'>Name</dt>
                <dd className='text-lg'>{userData.name}</dd>
              </div>
              <div>
                <dt className='text-sm font-medium text-muted-foreground'>Email</dt>
                <dd className='text-lg'>{userData.email}</dd>
              </div>
              <div>
                <dt className='text-sm font-medium text-muted-foreground'>Plan</dt>
                <dd className='text-lg'>{userData.plan}</dd>
              </div>
              <div>
                <dt className='text-sm font-medium text-muted-foreground'>Storage Usage</dt>
                <dd className='text-lg'>{userData.usage}</dd>
              </div>
              <div>
                <dt className='text-sm font-medium text-muted-foreground'>Total Projects</dt>
                <dd className='text-lg'>{userData.projects}</dd>
              </div>
              <div>
                <dt className='text-sm font-medium text-muted-foreground'>Last Login</dt>
                <dd className='text-lg'>{userData.lastLogin}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}
