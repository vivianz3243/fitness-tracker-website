// import { Dropdown } from "bootstrap";
import React from "react";
import {useEffect,useState} from "react"; 
import {useNavigate, useLocation} from "react-router-dom";

function WorkoutList() {
  const [data, setData] = useState([]);
  const [rank, setRank] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const today = new Date();
  var tmr = new Date();
  tmr.setDate(today.getDate() + 1);

  var username = location.state ? location.state.username : "guest";
  const user = {"username": username}; 
 
  const [workout_id, setWorkoutId] = useState("");
  console.log("workoutlist username:", username);
 
 
  useEffect(() => {
    const getWorkoutList = () => {
      fetch("http://localhost:5000/workout-list", { 
        method:"POST", headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify(user),
      }).then((response) => response.json()).then((data) => {
        setData(data.workouts)
        data.workouts.map((i) => {
          if(new Date(i.date).getTime() > today.getTime() && new Date(i.date).getTime() < tmr.getTime()) {
            alert("You planned to " +  i.category + " for " + i.duration + " mins tomorrow.")
          }
          return null;
        })
      })
    };
    const getLeaderboard = () => {
      console.log("Get leaderboard run");
      fetch("http://localhost:5000/workout-list", { 
        method:"GET",
      }).then((response) => response.json()).then((data) => {
        setRank(data.leaderboard)
      })
    };
    getWorkoutList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    getLeaderboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) ;
  


  const addWorkout = () => {
    if (username === "guest"){
      alert("You're not logged in");
    }
    else{
      navigate("/addworkout", { replace: true, state: {username: username} });
    }
  };
  const viewReport = () => {
    if (username === "guest"){
      alert("You're not logged in");
    }
    else{
      navigate("/report", { replace: true, state: {username: username} });
    }
  };

  const deleteWorkout = () => {
    if (username === "guest"){
      alert("You're not logged in");
    }
    else{
      const id = {"id": workout_id}
      fetch("http://localhost:5000/deleteworkout", { 
        method:"POST", headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify(id),
      }).then((response) => response.json()).then((data) => {
        alert(data.msg)
        navigate(0, { replace: true, state: {username: username} });
      })
    }
  };

  const handleWorkout = (e) => {
    setWorkoutId(e.target.value)
  };

  if (username === "guest") {
    return (
      <div className="app" >
        <div>
          
          <h3>Hello, {username}! Welcome to the workout tracker!</h3>
          This is a sample workout list: <br></br>
          Log in to use more features. (Add workout, delete workout, plan workout, and view leaderboard)
          <table class="table table-hover table-striped">
            <thead>
            <tr class="table-primary">
              <th scope = "col">Select</th>
              <th scope = "col">Category</th>
              <th scope = "col">Duration (mins)</th>
              <th scope = "col">Date</th>
              <th scope = "col">Emotion</th>
            </tr>
            </thead>
            <tbody>
            {data.map((i)=> {
              return (
                <tr>
                  <td><input type="radio" name="check" value={i._id} onChange={handleWorkout}/></td>
                  <td>{i.category}</td>
                  <td>{i.duration}</td>
                  <td>{new Date(i.date).toUTCString().substring(0,16)}</td>
                  <td>{i.emotion}</td>
                </tr>
              );
            })}
            </tbody>
          </table>
        </div>

      </div>
    );
  }
  else{
    return (
      <div className="app" >
        <div>
          
          <h3>Hello, {username} !</h3>
          <table class="table table-hover table-striped">
            <thead>
            <tr class="table-primary">
              <th scope = "col">Select</th>
              <th scope = "col">Category</th>
              <th scope = "col">Duration (mins)</th>
              <th scope = "col">Date</th>
              <th scope = "col">Emotion</th>
              <th scope = "col">Planned</th>
            </tr>
            </thead>
            <tbody>
            {data.map((i)=> {
              return (
                <tr>
                  <td><input type="radio" name="check" value={i._id} onChange={handleWorkout}/></td>
                  <td>{i.category}</td>
                  <td>{i.duration}</td>
                  <td>{new Date(i.date).toUTCString().substring(0,16)}</td>
                  <td>{i.emotion}</td>
                  <td>{new Date(i.date).getTime() > today.getTime() ? "planned" : ""}</td>
                </tr>
              );
            })}
            </tbody>
          </table>
        
        <button class="btn btn-outline-primary" onClick = {addWorkout}> Add/Plan Workout </button>
        <button class="btn btn-outline-primary" onClick = {deleteWorkout}> Delete Workout </button>
        <button class="btn btn-outline-primary" onClick = {viewReport}> View Report </button>
        </div>

        <div> 
            <h3 style ={{textAlign: "center"}}>Leaderboard</h3>
            <table class="table table-hover table-striped" style={{width: "auto", marginLeft: "auto", marginRight: "auto", textAlign:"center"}}>
            <thead>
            <tr class="table-primary">
              <th scope = "col">Rank</th>
              <th scope = "col">Username</th>
              <th scope = "col">Total Workout Time (mins)</th>

            </tr> 
            </thead>
            <tbody>
            {rank.map((key, index)=> { 

              return ( 
                <tr>
                  <td>{index+1 === 1 ? <p>&#x1f947;</p>: index+1}</td>
                  <td>{key._id}</td> 
                  <td>{key.totalDuration}</td>
                </tr>
              ); 
            })}
            </tbody>
          </table>
        </div>
         
      </div>
    );
  }
}



export default WorkoutList;
