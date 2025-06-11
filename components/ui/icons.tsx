'use client'

import { cn } from '@/lib/utils'
import Image from 'next/image'

function IconLogo({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('relative h-14 w-14', className)} {...props}>
      <Image
        src="/maya/maya_normal.gif"
        alt="Logo Maya"
        fill
        className="object-contain"
        priority
      />
    </div>
  )
}

export { IconLogo }
