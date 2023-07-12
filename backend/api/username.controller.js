import usernameDAO from "../dao/usernameDAO.js"

export default class usernameController {
  static async apiAddUser(req, res, next) {
    try {
      const username = req.body.username
      const password = req.body.password

    
      const usernameResponse = await usernameDAO.addUsername(
        username, password,
      )
      res.json({ status: "add user function success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiCheckPassword(req, res, next) {
    try {
      const username = req.body.username
      const password = req.body.password

    
      const checkResponse = await usernameDAO.checkPassword(username, password,)
      res.json({ status: "password check function success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }
  
}