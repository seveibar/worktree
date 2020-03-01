const test = require("ava")
const getDB = require("../")

test("should load an unowned public tree", async t => {
  const db = await getDB({ migrate: true, testMode: true, seed: true })

  const tree = await db("api.tree")
    .where({ tree_path: "user_1/test_tree" })
    .first()
  console.log(tree)

  await db.destroy()
})
