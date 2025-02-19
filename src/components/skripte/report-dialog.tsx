'use client'

import { Flag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'

const REPORT_REASONS = [
  { id: 'inappropriate', label: 'Neprikladan sadržaj' },
  { id: 'copyright', label: 'Kršenje autorskih prava' },
  { id: 'broken', label: 'Neispravan fajl' },
  { id: 'other', label: 'Ostalo' },
]
//TODO: change radio for checkbox myb
//FIXME: add functionality on payload
export function ReportDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="rounded-md p-1.5 text-muted-foreground hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors"
          title="Prijavi"
        >
          <Flag className="size-4" />
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Prijavi fajl</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <RadioGroup defaultValue="inappropriate" className="gap-4">
            {REPORT_REASONS.map((r) => (
              <div
                key={r.id}
                className="flex items-center space-x-3 bg-muted/50 rounded-lg px-4 py-3"
              >
                <RadioGroupItem value={r.id} id={r.id} />
                <Label htmlFor={r.id} className="flex-1">
                  {r.label}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <Textarea
            placeholder="Detaljnije opišite problem..."
            className="min-h-[120px] resize-none"
          />
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost">Otkaži</Button>
          <Button variant="destructive">Prijavi</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
