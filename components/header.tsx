import Logo from '@/components/logo'
import { ThemeToggle } from '@/components/theme-toggle'

export default function Header() {
  return (
    <header className='bg-background/50 fixed top-0 right-0 left-0 z-50 py-6 backdrop-blur-sm'>
      <div className='container'>
        <div className='flex items-center justify-between'>
          <Logo />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
