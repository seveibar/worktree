import getDB, { Knex } from "pgknexlove"
import { Account, AccountAPIKey } from "~/types"

export default async (db: Knex) => {
  const acc = await db<Account>("account")
    .innerJoin<AccountAPIKey>(
      "account_api_key",
      "account_api_key.account_id",
      "account.id"
    )
    .select(["email", "key_string"])
    .where({ account_id: "asd" })
    .first()

  acc.email // good!
  acc.key_string // good!
  acc.name
}
