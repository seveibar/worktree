import getDB from "pgknexlove"
import migrate from "~/db/migrate"

export default async () => {
  const db = await getDB.default({ testMode: true })
  const { host, user, port, password, database } = db.connection
  const databaseUrl = `postgresql://${user}:${password}@${host}:${port}/${database}`
  await migrate({ databaseUrl })
  return db
}
