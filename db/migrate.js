const getDB = require("./")
const fs = require("fs")

console.log("beginning migration")
console.log("connecting to db...")
if (process.env.PROD === "TRUE") {
  console.log("loading .env file...")
  require("dotenv").config({ path: "../.env" })
}
getDB({ migrate: false, seed: false }).then(db => {
  console.log("connected to db")
  console.log("attempting to apply migration...")
  db.raw(fs.readFileSync("./migrate.sql").toString())
    .then(() => {
      console.log("migration applied")
      console.log("destroying connection...")
      db.destroy().then(() => {
        console.log("migration successful")
        process.exit(0)
      })
    })
    .catch(err => {
      console.log("migration failed")
      console.log(err.toString())
    })
})
