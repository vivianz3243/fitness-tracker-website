    import mongodb from "mongodb"

    const ObjectId = mongodb.ObjectID
    let workout_coll

    export default class workoutDAO {
    static async injectDB(conn) {
        if (workout_coll) {
        return
        }
        try {
        workout_coll = await conn.db(process.env.CREATIVE_NS).collection("workout")
        } catch (e) {
        console.error(
            `Unable to establish a collection handle in workoutDAO: ${e}`,
        )
        }
    }

    static async addWorkout(username, category, date, duration){
        try{
        const workoutDoc = {username: username, category: category, date:date, duration:duration}
        console.log("workoutDoc: " + workoutDoc)
        return await workout_coll.insertOne(workoutDoc)
        } catch(e){
        console.error(`Unable to add workout: ${e}`)
        return {error: e}
        } 
        }

    
    }