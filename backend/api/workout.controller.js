    import workoutDAO from "../dao/workoutDAO.js"

    export default class workoutController {
    static async apiAddWorkout(req, res, next) {
        try {
            const username = req.params.username
            const category = req.body.category
            const date = req.body.date
            const duration = req.body.duration
            console.log("params: "+req.params)
            console.log("body: " + req.body)
            const workoutResponse = await workoutDAO.addWorkout(username, category, date, duration,)
            console.log(workoutResponse)
            res.json({ status: "add workout function success" })
        } catch (e) {
        res.status(500).json({ error: e.message })
        }
    }

    
    }