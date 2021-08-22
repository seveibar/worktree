import micro from "micro"
import morgan from "micro-morgan"
import fsRouter from "fs-router"

const match = fsRouter(__dirname + "/api", {
  ext: [".js"],
})

export const middlewares = [morgan("tiny")]

export const createRouter =
  ({ db }) =>
  async (req, res) => {
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
  const db = await getDB({ testMode })
  const router = createRouter({ db })
  const server = micro(router).listen(port)
  return { server, db }
}

export default createServer
