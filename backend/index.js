// // import app from "./server.js"
// import mongodb from "mongodb"
// import dotenv from "dotenv"
// import usernameDAO from "./dao/usernameDAO.js"
// import workoutDAO from "./dao/workoutDAO.js"

// dotenv.config()
// const MongoClient = mongodb.MongoClient

// const port = process.env.PORT || 8000

// MongoClient.connect(
//   process.env.CREATIVE_DB_URI,
//   {
//     maxPoolSize: 50, 
//     wtimeoutMS: 2500,
//     useNewUrlParser: true}
//   )
//   .catch(err => {
//     console.error(err.stack)
//     process.exit(1)
//   })
//   .then(async client => {
//     await usernameDAO.injectDB(client)
//     await workoutDAO.injectDB(client)
//     app.listen(port, () => {
//       console.log(`listening on port ${port}`)
//     })
//   })