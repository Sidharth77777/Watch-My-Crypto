import { Router } from "express"
import type { Request, Response } from "express"
import { fetchAndStoreCoins } from "../services/coinUpdater"
import { checkAlerts } from "../services/priceAlertCron"
import { ENV } from "../lib/env"

const router = Router()

function assertCronAuthorized(req: Request) {
  const header = req.header("authorization") || ""
  const token = header.replace(/^Bearer\s+/i, "")
  if (!ENV.CRON_SECRET || token !== ENV.CRON_SECRET) {
    const err: any = new Error("Unauthorized")
    err.status = 401
    throw err
  }
}

router.post("/coin-sync", async (req: Request, res: Response) => {
  try {
    assertCronAuthorized(req)
    await fetchAndStoreCoins()
    res.json({ ok: true, job: "coin-sync", message: "Coin list updated" })
  } catch (e: any) {
    res.status(e.status || 500).json({ ok: false, error: e.message || "Failed" })
  }
})

router.post("/price-alert", async (req: Request, res: Response) => {
  try {
    assertCronAuthorized(req)
    await checkAlerts()
    res.json({ ok: true, job: "price-alert", message: "Price alerts processed" })
  } catch (e: any) {
    res.status(e.status || 500).json({ ok: false, error: e.message || "Failed" })
  }
})

export default router
