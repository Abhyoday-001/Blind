import { Pin, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SpinnerProps extends React.ComponentProps<'div'> {
  variant?: 'default' | 'vintage'
  size?: 'sm' | 'md' | 'lg'
}

function Spinner({ className, variant = 'vintage', size = 'md', ...props }: SpinnerProps) {
  const sizeClasses = {
    sm: 'size-4',
    md: 'size-8',
    lg: 'size-12',
  }

  if (variant === 'vintage') {
    return (
      <div 
        className={cn('flex flex-col items-center justify-center gap-4', className)} 
        role="status" 
        aria-label="Loading"
        {...props}
      >
        <div className="relative">
          <Pin 
            className={cn(
              sizeClasses[size], 
              'vintage-spinner text-[#b94040]'
            )} 
          />
        </div>
        <span className="vintage-loading-text text-sm text-[var(--olive-grey)]">
          LOADING...
        </span>
      </div>
    )
  }

  return (
    <Loader2
      role="status"
      aria-label="Loading"
      className={cn('animate-spin', sizeClasses[size], className)}
    />
  )
}

export { Spinner }
