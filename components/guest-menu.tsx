'use client'

import { Button } from '@/components/ui/button'
import {
  LogIn
} from 'lucide-react'
import Link from 'next/link'

export default function GuestMenu() {
  return (
    <div className="flex items-center gap-4">
      <Link href="/auth/login">
        <Button variant="outline" className="rounded-full">
          <LogIn className="mr-2 h-4 w-4" />
          <span>Se connecter</span>
        </Button>
      </Link>
    </div>
  )
}
