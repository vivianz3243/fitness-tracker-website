import express from "express"
import cors from "cors"
// import username from "./api/username.route.js"
const app = express()
const port = process.env.PORT || 5000
import bodyparser from "body-parser"
import bcrypt from "bcryptjs"

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}))

app.use(cors({origin:"http://localhost:3000", methods:["POST", "GET", "PUT", "DELETE"], credentials:false}))

import mongoose from "mongoose"
mongoose.Promise = global.Promise;
const options = {dbName: "CSE330"}
mongoose.connect('mongodb+srv://yuehengzhong:admin@cluster0.6cxu9tm.mongodb.net/?retryWrites=true&w=majority', options);
mongoose.connection.on('open', function (ref) {
    console.log('Connected to mongo server.');
    
    mongoose.connection.db.listCollections().toArray(function (err, names) {
        console.log(names);
    });
});

// defining schema
let userSchema = new mongoose.Schema({
    username: String,
    password: String
}, {collection: "usernames"});

let workoutSchema = new mongoose.Schema({
    username: {type: String, required:true},
    category: String,
    duration: {type: Number, required:true},
    date: {type: Date},
    emotion: String
}, {collection: "workouts"});

// defining model
const Usernames = mongoose.model("usernames", userSchema);
const Workouts = mongoose.model("workouts", workoutSchema);

app.post("/register", async(req, res) => {
    let data = req.body
    const username = data.username
    console.log("data.username: " + username)
    const password = data.password
    console.log("data.password: " + password)
    const userexist = await  Usernames.findOne({username: username}).exec()
    
    if (userexist){
        console.log("user exist", userexist)
    }
    else{
        console.log("x find user")
        try{
            var salt = bcrypt.genSaltSync(10)
            var password_hash = bcrypt.hashSync(password, salt)
            const usernameDoc = {username: username, password: password_hash,}
            res.send({result: true, msg: "success: user registered"})
            return await Usernames.create(usernameDoc)
          } catch(e){
            console.error(`Unable to add user: ${e}`)
            res.send({result: true, msg: `Unable to add user: ${e}`})
            return {error: e}
          } 
    }
    
})

app.post("/login", async(req, res) => {
    let data = req.body
    const username = data.username

    const password = data.password

    const userexist = await  Usernames.findOne({username: username}).exec()
    
    if (userexist){
        console.log("user exist", userexist)
        const cmp = await bcrypt.compare(password, userexist.password)
        if(cmp){
            console.log("Success: password match")
            res.send({result: true, msg: "success: password match"})
        }
        else{
            console.log("false: password x match")
            res.send({result: false, msg: "false: wrong password"})
        }
    }
    else{
        console.log("x find user")
        res.send({result: false, msg: "false: can't find user, wrong username"})
    }

 
})

app.post("/addworkout", async(req, res) => {
    let data = req.body
    const username = data.username
    const category = data.category
    const duration = data.duration
    const date = data.date
    const emotion = data.emotion
    console.log("data.username: " + data.username + data.category)
    
    try{
        const workoutDoc = {username: username, category: category, duration: duration, 
        date: date, emotion: emotion,}

        res.send({result: true, msg: "success: added workout"})
        return await Workouts.create(workoutDoc)
        } catch(e){
        console.error(`Unable to add workout: ${e}`)
        res.send({result: false, msg: `Unable to add workout: ${e}`})
        return {error: e}
        }  
})

app.post("/deleteworkout", async(req, res) => {
    let data = req.body
    const id = data.id
    try{
        const workout = await  Workouts.findByIdAndDelete(id).exec()
        res.send({result: true, msg: `success: deleted workout`})
    } catch(e){
        res.send({result: false, msg: `Unable to delete workout: need to select a workout to delete.`})
    }
})

app.post("/workout-list", async(req,res) =>{
    try{
        const username = req.body.username
        const allWorkout = await Workouts.find({username: username}).sort({date: -1})

        res.send({result: true, workouts: allWorkout})
    }catch(error) {
        console.log(error)
    }

})

app.get("/workout-list", async(req,res) =>{
    try{
        console.log("run leaderboard data")
        let today = new Date()
        const leaderboard = await Workouts.aggregate([
            {$match: {username: { $ne: 'guest'}, date: {$lte: today}}},
            { $group: { _id: "$username", totalDuration: { $sum: '$duration' }}},
            { $sort: {totalDuration: -1}}, 
          ]);
        

        res.send({result: true, leaderboard: leaderboard})
    }catch(error) {
        console.log(error)
    }

})

app.post("/viewPieReport", async(req,res) =>{
    try{
        console.log("run pie data")
        const username = req.body.username
        let today = new Date()
        const report_pie = await Workouts.aggregate([
            {$match: {username: { $eq: username}, date: {$lte: today}}},
            { $group: { _id: "$category", totalCount_pie: { $count: {}}, totalDuration_pie: {$sum: "$duration"}}}, 
            { $sort: {totalDuration_pie: -1}}, 
        ]);
        res.send({result: true, report: report_pie})
    }catch(error) {
        console.log(error)
    }

})

app.post("/viewLineReport", async(req,res) =>{
    try{
        console.log("run line data")
        const curr_username = req.body.username
        const today = new Date()
        var oneWeekBefore = new Date()
        oneWeekBefore.setDate(today.getDate() - 6); 
        const report_line = await Workouts.aggregate([
            {$match: {username: { $eq: curr_username}, date: {$gte: oneWeekBefore, $lte: today}}},
            { $group: { _id: "$date", totalDuration_line: {$sum: "$duration"}}}, 
            { $sort: {totalDuration_line: -1}}, 
        ]);
        
        console.log(curr_username, report_line)
        res.send({result: true, report: report_line})
    }catch(error) {
        console.log(error)
    }

})

app.post("/getSummary", async(req,res) =>{
    try{
        console.log("run report data")
        const curr_username = req.body.username
        const today = new Date()
        const report = await Workouts.aggregate([
            {$match: {username: { $eq: curr_username}, date: {$lte: today}}},
            { $group: {_id: "$username", totalDuration_sum: {$sum: "$duration"}, totalCount_sum: {$count: {} }}}, 
            
        ]);
        
        console.log("report", report)
        res.send({result: true, report: report})
    }catch(error) {
        console.log(error)
    }

})

app.listen(port, () => console.log("listening on port 5000"))
