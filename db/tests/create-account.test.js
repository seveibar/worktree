const test = require("ava")
const getDB = require("../")

test("should create an account", async () => {
  const db = await getDB({ testMode: true })

  // db("")
})
