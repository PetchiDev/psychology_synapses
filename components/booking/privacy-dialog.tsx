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
          <li>• Your booking is stored securely in my booking system and used only to arrange and manage our conversation.</li>
          <li>• You’ll get a private link by email to view, move or cancel it. Please keep that link to yourself.</li>
          <li>• Nothing you type is saved in your browser, and the form is cleared once it is sent.</li>
          <li>• A short description is enough. You can share more, at your own pace, when we speak.</li>
          <li>• Your details are never sold or shared for marketing, and you can ask for them to be deleted.</li>
        </ul>
        <p className="text-sm text-coffee">
          The{' '}
          <a href="/legal/privacy/" target="_blank" rel="noopener" className="font-semibold text-burgundy underline underline-offset-4">
            privacy policy
          </a>{' '}
          explains this in full, including your rights.
        </p>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button">I understand</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
