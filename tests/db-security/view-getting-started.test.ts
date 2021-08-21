import test from "ava"
import getDB from "~/tests/fixtures/db"

test("should be able to view the getting started tree", async (t) => {
  const db = await getDB()

  await db.raw("SET ROLE api_user")
  await db.raw("SELECT set_config('request.header.apikey', 'KEY3', FALSE)")

  let tree = await db("api.tree")
    .where({ tree_path: "user_3/getting-started" })
    .first()

  t.assert(tree, "Got the tree")

  await db.destroy()
})
