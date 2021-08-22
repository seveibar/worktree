import micro from "micro"
import morgan from "micro-morgan"
import fsRouter from "fs-router"
import getDB from "pgknexlove"
import seedDB from "~/db/seed"

const match = fsRouter(__dirname + "/api", {
  ext: [".js"],
})

export const middlewares = [morgan("tiny")]

export const createRouter =
  ({ db }) =>
  async (req, res) => {
    req.db = db
    if (req.url.startsWith("/api")) {
      req.url = req.url.slice(4)
    }
    const matched = match(req)
    if (!matched) {
      return micro.send(res, 404, { error: "Route not found" })
    }
    let requestFunction = middlewares.reduce((agg, mw) => mw(agg), matched)
    try {
      await requestFunction(req, res)
    } catch (e) {
      if (process.env.NODE_ENV !== "production") {
        return micro.send(res, 500, {
          error: "Internal server error",
          stack: e.stack,
        })
      } else {
        return micro.send(res, 500, { error: "Internal server error" })
      }
    }
  }

export const createServer = async ({
  port = 3000,
  seed = false,
  testMode = false,
} = {}) => {
  const db = await getDB.default({ testMode })
  if (seed) await seedDB(db)
  const router = createRouter({ db })
  const server = micro(router).listen(port)
  return { server, db }
}

export default createServer

if (!module.parent) {
  console.log(`starting worktree server at http://localhost:3000`)
  createServer({
    port: parseInt(process.env.PORT) || 3000,
    seed: Boolean(process.env.SEED_DB),
  })
}
