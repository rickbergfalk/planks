import React, { useEffect, useRef } from "react"

// Component to render hallucn HTML after mount
export function HallucnDemo({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = html
    }
  }, [html])

  return <div ref={ref} className="p-4 border rounded-lg bg-background" />
}

// Comparison row component (without title - used inline on component pages)
export function ComparisonRow({
  reactContent,
  hallucnHtml,
  note,
}: {
  reactContent: React.ReactNode
  hallucnHtml: string
  note?: string
}) {
  return (
    <div>
      {note && (
        <p className="text-sm text-muted-foreground mb-4">{note}</p>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            React (shadcn/ui)
          </h3>
          <div className="p-4 border rounded-lg bg-background">
            {reactContent}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Web Component (hallucn)
          </h3>
          <HallucnDemo html={hallucnHtml} />
        </div>
      </div>
    </div>
  )
}
