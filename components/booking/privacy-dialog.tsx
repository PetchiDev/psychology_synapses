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
          How your information is handled
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Your information, handled with care</DialogTitle>
          <DialogDescription>
            What you write here may be personal. This is how it is treated.
          </DialogDescription>
        </DialogHeader>
        <ul className="grid gap-3 text-[0.95rem] leading-relaxed text-shadow/85">
          <li>• Your enquiry is sent only to me, and is used to respond to you and arrange our conversation.</li>
          <li>• Nothing you type is saved in your browser, and the form is cleared once it is sent.</li>
          <li>• A short description is enough. You can share more, at your own pace, when we speak.</li>
          <li>• Your details are never sold or shared for marketing.</li>
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
