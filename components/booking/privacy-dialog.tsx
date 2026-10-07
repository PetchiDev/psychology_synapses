'use client'

import { ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export function PrivacyDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="link" className="h-auto px-0 text-sm">
          <ShieldCheck aria-hidden="true" />
          How we protect what you share
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Your information, handled with care</DialogTitle>
          <DialogDescription>
            What you write here may be personal. This is how we treat it.
          </DialogDescription>
        </DialogHeader>
        <ul className="grid gap-3 text-[0.95rem] leading-relaxed text-shadow/85">
          <li>• Your request goes only to our care coordination team, who use it to arrange your consultation.</li>
          <li>• Nothing you type is saved in your browser, and the form is cleared once it is sent.</li>
          <li>• A short description is enough. You can share more, at your own pace, with your psychologist.</li>
          <li>• We never sell or share your details for marketing.</li>
        </ul>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button">I understand</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
