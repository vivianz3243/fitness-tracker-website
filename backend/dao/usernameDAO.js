  import mongodb from "mongodb"
  import bcrypt from "bcryptjs"
  const ObjectId = mongodb.ObjectID
  let username_coll

  export default class usernameDAO {
    static async injectDB(conn) {
      if (username_coll) {
        return
      }
      try {
        username_coll = await conn.db(process.env.CREATIVE_NS).collection("username")
      } catch (e) {
        console.error(
          `Unable to establish a collection handle in usernameDAO: ${e}`,
        )
      }
    }

    static async addUsername(username, password){
      try{
        var salt = bcrypt.genSaltSync(10)
        var password_hash = bcrypt.hashSync(password, salt)
        const usernameDoc = {username: username, password: password_hash,}
    
        return await username_coll.insertOne(usernameDoc)
      } catch(e){
        console.error(`Unable to add user: ${e}`)
        return {error: e}
      } 
      }

    static async checkPassword(username, password){
      try{
        const user = await username_coll.findOne({username: username})
        if (user){
          const cmp = await bcrypt.compare(password, user.password)
          if(cmp){
            console.log("Success: password match")
            return true 
          }
          else{
            return false
          }
        }
      } catch(e){
        console.error(`Wrong username or password: ${e}`)
        return {error: e}
      } 
      }
  }