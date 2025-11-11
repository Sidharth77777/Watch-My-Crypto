import { NextResponse } from "next/server"
import { SERVER_URL, CRON_SECRET } from "@/lib/env"

export async function POST() {
  const backendUrl = SERVER_URL
  const secret = CRON_SECRET

  const r = await fetch(`${backendUrl}/cron/price-alert`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secret}`,
    },
    cache: "no-store",
  })

  const data = await r.json()
  return NextResponse.json(data, { status: r.status })
}
