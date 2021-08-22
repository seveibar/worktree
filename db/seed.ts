import getDB, { Knex } from "pgknexlove"
import { Account, AccountAPIKey, Tree } from "~/types"

export default async (db: Knex) => {
  await db<Account>("account").insert({ account_name: "user_1" })
  await db<Account>("account").insert({ account_name: "user_2" })
  await db<Account>("account").insert({ account_name: "user_3" })

  for (const [account_name, key_string] of [
    ["KEY1", "user_1"],
    ["KEY2", "user_2"],
    ["KEY3", "user_3"],
  ]) {
    await db<AccountAPIKey>("account_api_key")
      .update({ key_string })
      .where({
        account_id: db("account")
          .select("account_id")
          .where({ account_name }) as any,
      })
  }

  await db<Tree>("tree").insert({
    tree_name: "Test Tree",
    tree_key: "test_tree",
    owner_id: db("account")
      .select("account_id")
      .where("account_name", "user_1") as any,
    tree_def: {
      "Test Tree Start": {
        name: "Test Tree Start",
        order: 0,
        description: "Some description",
        requirements: {
          "category1.meter1": {
            mustBeAtleast: 15,
          },
          "category1.meter2": {
            mustIncreaseBy: 50,
          },
        },
      },
      "Test Tree End": {
        name: "Test Tree End",
        order: 0,
        parent: "Test Tree Start",
        requirements: {
          "category1.meter1": {
            mustBeAtleast: 50,
          },
          "category2.meter1": {
            mustBeAtleast: 100,
          },
        },
      },
    },
  })
}
