import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'

import Logo from '@/components/logo'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import ClerkUserButton from '@/components/clerk-user-button'

import { LogIn } from 'lucide-react'

export default function Header() {
  return (
    <header className='bg-background/50 fixed top-0 right-0 left-0 z-50 py-6 backdrop-blur-sm'>
      <div className='container max-w-7xl'>
        <div className='flex items-center justify-between'>
          <Logo />

          <div className='flex items-center gap-4'>
            <ThemeToggle />
            <SignedOut>
              <SignInButton>
                <Button
                  size='sm'
                  variant='secondary'
                  className='hidden lg:inline-flex'
                >
                  Sign in
                </Button>
              </SignInButton>
              <SignInButton>
                <Button size='icon' variant='secondary' className='lg:hidden'>
                  <LogIn className='size-4' />
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <ClerkUserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  )
}
