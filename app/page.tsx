"use client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    router.push("/app")
  }, [router])

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-muted/20">
      <div className="text-muted-foreground">Loading...</div>
    </div>
  )
}
