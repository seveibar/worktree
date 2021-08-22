const path = require("path")
const { recase } = require("@kristiandupont/recase")
const toPascal = recase("snake", "pascal")
const pgknexlove = require("pgknexlove")

module.exports = {
  connection: pgknexlove.default.getConnectionInfo(),
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
