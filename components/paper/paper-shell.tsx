'use client'

/**
 * Fixed aged-ivory sheet behind the whole site — coffee-scorched edges frame
 * the reading area so the site feels held inside vintage paper.
 */
export function PaperShell() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-[1] overflow-hidden">
      <div
        className="paper-shell-breathe absolute inset-[-4%] bg-[#e8d4a8] bg-cover bg-center"
        style={{ backgroundImage: "url('/images/textures/aged-ivory-sheet.png')" }}
      />
      {/* Keep the centre readable; let the scorched sides stay visible as a frame. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgb(243_230_200/0.42)_0%,rgb(243_230_200/0.12)_42%,transparent_72%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(42_26_16/0.18)_0%,transparent_14%,transparent_86%,rgb(42_26_16/0.18)_100%)]" />
      <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'var(--fibres)' }} />
    </div>
  )
}
