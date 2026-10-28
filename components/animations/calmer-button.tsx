'use client'

import { useState } from 'react'
import { Check, Leaf } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CalmerButton() {
  const [done, setDone] = useState(false)

  return (
    <div className="grid justify-items-center gap-3" aria-live="polite">
      <Button type="button" variant="paper" size="lg" onClick={() => setDone(true)} aria-pressed={done}>
        {done ? <Check aria-hidden="true" /> : <Leaf aria-hidden="true" />}I feel a little calmer
      </Button>
      {done ? (
        <p className="animate-in fade-in-0 slide-in-from-bottom-1 text-center text-sm text-paper/75 duration-700">
          Glad you took a moment. You can come back to it whenever you like.
        </p>
      ) : null}
    </div>
  )
}
