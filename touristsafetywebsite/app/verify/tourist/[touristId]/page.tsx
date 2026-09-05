import Link from "next/link"
import { CheckCircle2, Shield, UserRound } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface VerificationPageProps {
  params: { touristId: string }
}

export default function TouristVerificationPage({ params }: VerificationPageProps) {
  const isDemoTourist = params.touristId === "SV-TOUR-2026-001"

  return <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4"><Card className="w-full max-w-lg"><CardHeader className="text-center"><Shield className="mx-auto h-12 w-12 text-primary" /><Badge className="mx-auto mt-3 w-fit bg-slate-900 text-white hover:bg-slate-900">SAFEVOYAGE DEMO VERIFICATION</Badge><CardTitle className="mt-3 text-2xl">Digital ID verification</CardTitle></CardHeader><CardContent>{isDemoTourist ? <div className="space-y-5"><div className="flex items-center justify-center gap-2 rounded-lg bg-emerald-50 p-3 font-semibold text-emerald-700"><CheckCircle2 className="h-5 w-5" /> Verified Demo Identity</div><div className="flex items-center gap-4 rounded-xl border p-4"><div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary"><UserRound className="h-7 w-7" /></div><div><p className="text-lg font-bold">Demo Tourist</p><p className="text-sm text-muted-foreground">India</p></div></div><dl className="grid gap-4 text-sm sm:grid-cols-2"><div><dt className="text-muted-foreground">Tourist ID</dt><dd className="font-semibold">SV-TOUR-2026-001</dd></div><div><dt className="text-muted-foreground">Status</dt><dd className="font-semibold text-emerald-700">Verified Demo Identity</dd></div><div><dt className="text-muted-foreground">Emergency contacts</dt><dd className="font-semibold">2 configured</dd></div><div><dt className="text-muted-foreground">Verification time</dt><dd className="font-semibold">{new Date().toLocaleString()}</dd></div></dl><p className="rounded-lg bg-muted p-3 text-xs leading-5 text-muted-foreground">This is a SafeVoyage demo verification system. It is not government-issued identity verification and does not prove legal identity.</p><Button asChild variant="outline" className="w-full"><Link href="/login">Return to SafeVoyage</Link></Button></div> : <div className="space-y-4 text-center"><p className="text-muted-foreground">This demo tourist ID could not be found.</p><Button asChild variant="outline"><Link href="/login">Return to SafeVoyage</Link></Button></div>}</CardContent></Card></main>
}
