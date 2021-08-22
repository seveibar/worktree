const path = require("path")
const { recase } = require("@kristiandupont/recase")
const toPascal = recase("snake", "pascal")

module.exports = {
  connection: {
    // TODO use DATABASE_URL env var
    host: "localhost",
    user: "postgres",
    password: "postgres",
    database: "postgres",
  },
  schemas: [
    {
      name: "api",
      ignore: ["pgmigrations", "pgmigrations_id_seq"],
      modelFolder: path.join(__dirname, "types", "db"),
    },
  ],
  modelNominator: (modelName) => toPascal(modelName).replace("Api", "API"),
  typeNominator: (typeName) => {
    if (typeName === "uuid") return "string"
    return typeName
  },
}
