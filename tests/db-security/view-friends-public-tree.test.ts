import test from "ava"
import getDB from "~/tests/fixtures/db"

test("should be denied for private trees and accepted for public trees", async (t) => {
  const db = await getDB()

  await db.raw("SET ROLE api_user")
  await db.raw("SELECT set_config('request.header.apikey', 'KEY2', FALSE)")

  let tree = await db("api.tree").where({ tree_key: "test_tree" }).first()

  // Can't view it because it's not public
  t.assert(!tree, "I can't access a friend's tree if it's not public.")

  await db.raw("SET ROLE postgres")
  await db("tree").update({ public: true }).where({ tree_key: "test_tree" })

  await db.raw("SET ROLE api_user")
  // Okay let's try this again with the tree being public

  tree = await db("api.tree").where({ tree_key: "test_tree" }).first()

  t.assert(tree, "I can access a friend's tree if it's public.")

  await db.destroy()
})
