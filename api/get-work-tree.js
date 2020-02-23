const knex = require("knex")
const micro = require("micro")
const jwt = require("jsonwebtoken")

module.exports = async () => {
  if (!JWT_SECRET) return micro.send(res, 500, "JWT Secret not set")
  if (!db)
    db = knex({
      client: "pg",
      connection: {
        host: process.env.POSTGRES_HOST || "localhost",
        port: process.env.POSTGRES_PORT || 5432,
        user: process.env.POSTGRES_USER || "postgres",
        password: process.env.POSTGRES_PASS,
        database: process.env.POSTGRES_DATABASE || "worktree"
      }
    })
  if (req.headers["authorization"]) {
    let sub
    try {
      const jwtToken = req.headers["authorization"].split("Bearer ")[1]
      ;({ sub } = jwt.verify(jwtToken, USE_JWT ? JWT_SECRET : publicKey))
    } catch (e) {
      return micro.send(res, 401, e.toString())
    }

    if (req.method === "GET") {
      // await handleGetAccount({ db, sub }, req, res)
    } else if (req.method === "PATCH" || req.method === "POST") {
      // await handlePostAccount({ db, sub }, req, res)
    }
  }
}
