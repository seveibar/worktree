import path from "path"
import nodePgMigrate from "node-pg-migrate"

export default async ({ databaseUrl = "" }: { databaseUrl?: string } = {}) => {
  if (!databaseUrl)
    databaseUrl =
      process.env.POSTGRES_URI ||
      process.env.POSTGRES_URL ||
      process.env.DATABASE_URL ||
      "postgresql://postgres@localhost:5432/postgres"

  await nodePgMigrate({
    databaseUrl,
    direction: "up",
    schema: "public",
    ignorePattern: ".*\\.map|.*\\.ts"
    dir: path.resolve(__dirname, "./migrations"),
  } as any)
}
