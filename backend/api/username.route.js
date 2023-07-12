import express from "express"
import usernameCtrl from "./username.controller.js"
import workoutCtrl from "./workout.controller.js"

const router = express.Router()

router
  .route("/")
  .post(usernameCtrl.apiAddUser)
  .get(usernameCtrl.apiCheckPassword)
//   .put(usernameCtrl.apiUpdateReview)
//   .delete(usernameCtrl.apiDeleteReview)

router.route("/workout/:username").post(workoutCtrl.apiAddWorkout)

// router
//     .route("/workout")
//     .post(workoutCtrl.apiAddWorkout)


export default router