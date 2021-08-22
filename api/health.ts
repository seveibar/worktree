import { send } from "micro"

export default (req, res) => {
  send(res, 200, { status: "ok" })
}
