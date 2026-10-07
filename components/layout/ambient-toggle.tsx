'use client'

import { useEffect } from 'react'
import { Pause, Sparkles } from 'lucide-react'
import { isAmbientPaused, setAmbientPaused, useAmbientPaused } from '@/lib/ambient'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export function AmbientToggle() {
  const paused = useAmbientPaused()

  useEffect(() => {
    document.documentElement.dataset.ambient = isAmbientPaused() ? 'paused' : 'playing'
  }, [])

  const label = paused ? 'Play background animations' : 'Pause background animations'

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Pause background animations"
          aria-pressed={paused}
          onClick={() => setAmbientPaused(!paused)}
          className="text-coffee-deep hover:text-burgundy"
        >
          {paused ? <Sparkles className="size-5" aria-hidden="true" /> : <Pause className="size-5" aria-hidden="true" />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}
