import { Request } from "~/types"
import postgrest from "postgrest"
import getPort from "get-port"
import fetch from "node-fetch"

let postgrestPort, postgrestUrl, server
async function startServer() {
  if (server) return
  postgrestPort = await getPort()
  server = await postgrest.startServer({
    dbUri:
      process.env.POSTGRES_URI ||
      process.env.POSTGRES_URL ||
      process.env.DATABASE_URL ||
      "postgresql://postgres@localhost:5432/postgres",
    dbAnonRole: "postgres",
    dbSchema: "public",
    serverPort: postgrestPort,
    dbPool: 2,
  })
  postgrestUrl = `http://127.0.0.1:${postgrestPort}`
}

export default async (req: any, res) => {
  await startServer()
  const proxyTo = `${postgrestUrl}${req.url.replace(/^\/api/, "")}`

  console.log(req.host, req.body)

  const proxyRes = await fetch(proxyTo, {
    method: req.method,
    headers: Object.assign(
      { "x-forwarded-host": req.headers.host },
      req.headers,
      { host: req.host }
    ),
    body: req.body,
    redirect: "manual",
  })

  res.statusCode = proxyRes.status
  proxyRes.body.pipe(res)
}
