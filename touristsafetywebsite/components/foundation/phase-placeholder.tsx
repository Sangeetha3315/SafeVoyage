import Link from "next/link"
import { ArrowLeft, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface PhasePlaceholderProps {
  title: string
  description: string
  backHref?: string
}

export function PhasePlaceholder({ title, description, backHref = "/" }: PhasePlaceholderProps) {
  return (
    <main className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-6 text-center">
        <Shield className="h-12 w-12 text-primary" aria-hidden="true" />
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">This SafeVoyage route is part of the foundation shell. Backend integration is pending for a future phase.</p>
            <Button asChild variant="outline">
              <Link href={backHref}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to prototype
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
