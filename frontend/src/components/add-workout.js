import React from "react";
import {useState} from "react"; 
import YouTube from "react-youtube";
import Modal from "react-modal";
import {useNavigate, useLocation} from "react-router-dom";

function AddWorkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state.username; 
  const getCategoryInitialState = () => {
    const value = "zumba"
    return value; 
  }
  var today = new Date();
  today = today.toISOString().substring(0,10);
  const getDateInitialState = () => {
    const value = today
    return value; 
  }
  const [category, setCategory] = useState(getCategoryInitialState);
  const [duration, setDuration] = useState("");
  const [date, setDate] = useState(getDateInitialState); 
  const [emotion, setEmotion] = useState("");
  const [video_duration, setVideoDuration] = useState(0);

  const sendData = (event) => {
    event.preventDefault();
    console.log("username:", username);
    const workout = {"username": username, "category": category, "duration": duration, 
    "date": date, "emotion": emotion}; 
    
    fetch("http://localhost:5000/addworkout", { 
      method:"POST", headers: {'Content-Type': 'application/json'}, 
      body: JSON.stringify(workout),
    }).then((response) => response.json()).then((data) => {
      console.log(data.result)
      if (data.result) {
        alert(data.msg)
         navigate("/workout-list", { replace: true, state: {username: username} });
      }
      else{
        alert(data.msg)
      }
    })
  };

  const handleCategory = (e) => {
    setCategory(e.target.value)
  }
  const handleEmotion = (e) => {
    setEmotion(e.target.value)
  }
  const back = () => {
    navigate("/workout-list", { replace: true, state: {username: username} });
  };

  //Youtube Tutorial
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  // const [videoUrl, setVideoUrl] = React.useState("");
  // const videoUrl = "https://www.youtube.com/watch?v=QohH89Eu5iM";
  const videoCodes = {"HIIT": "edIK5SZYMZo", "zumba": "ZNpCqF9XRqQ", "dance":"as78EkcW56M", "yoga": "v7AYKMP6rOE"}
  let videoCode;
  if (category){
    videoCode = videoCodes[category];
  }



  const checkElapsedTime = (e) => {
    console.log(e.target.playerInfo.playerState);
    const duration = e.target.getDuration();
    setVideoDuration(duration);
    const currentTime = e.target.getCurrentTime();
    if (currentTime / duration > 0.95) {
      setModalIsOpen(true);
    }
  };

  const opts = {
    height: '250',
    width: '400',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0
    }
  };

  const handleExerciseComplete = (event) => {
    event.preventDefault();
    console.log("username:", username);
    const workout = {"username": username, "category": category, "duration": Math.floor(video_duration /60), 
    "date": today, "emotion": emotion}; 
    
    fetch("http://localhost:5000/addworkout", { 
      method:"POST", headers: {'Content-Type': 'application/json'}, 
      body: JSON.stringify(workout),
    }).then((response) => response.json()).then((data) => {
      console.log(data.result)
      if (data.result) {
        alert(data.msg)
         navigate("/workout-list", { replace: true, state: {username: username} });
      }
      else{
        alert(data.msg)
      }
    })
  };

  const refresh = () => {
    setModalIsOpen(false);
    // navigate("/addworkout", { replace: true, state: {username: username} });
  };

  return (
    <div className="submit-form" >
      <button onClick={back} class="btn btn-outline-primary" id="back_btn">Back to Workout List</button><br></br>
      <br></br>
      <div class="form-check border border-secondary p-5 bg-light" style={{width: "40%", float:"left"}}>
        <h4>Workout</h4>
        Category: 
        <select class="form-control" id="category" value={category} onChange={handleCategory}> 
          <option value="walking"> walking </option>
          <option value="running"> running </option>
          <option value="zumba"> zumba </option>
          <option value="swimming"> swimming </option>
          <option value="cycling"> cycling </option>
          <option value="HIIT"> HIIT </option>
          <option value="dance"> dance </option>
          <option value="yoga"> yoga </option>
        </select> <br></br>
        Duration:  
        <input class="form-control" type="number" id="duration" placeholder="duration in minutes" value={duration} 
        onChange={(event) => setDuration(event.target.value)} /><br></br>
        Date: 
        <input class="form-control" type="date" id="date"  defaultValue={today} onChange={(event) => setDate(event.target.value)}/><br></br>
        
        How do you feel: <br></br>
        <input  type="radio" name="emotion"  value= "&#x1F606;" onChange={handleEmotion}/> &#x1F606; 
        <input type="radio" name="emotion"  value= "&#x1F610;" onChange={handleEmotion}/> &#x1F610; 
        <input  type="radio" name="emotion"  value= "&#x1F60E;" onChange={handleEmotion}/> &#x1F60E; 
        <input  type="radio" name="emotion"  value= "&#x1F607;" onChange={handleEmotion}/> &#x1F607; 
        <input  type="radio" name="emotion"  value= "&#x1F616;" onChange={handleEmotion}/> &#x1F616; 
        <input type="radio" name="emotion" value= "&#128128;" onChange={handleEmotion}/> &#128128;
        <br></br>
        <br/>
        <button class="btn btn-outline-primary" onClick={sendData} id="sendData_btn">Add/Plan Workout</button>
      </div>

    {/* Youtube */}
      <div class="form-check border border-secondary p-5 bg-light" style={{width: "55%", float:"right"}}>
        <h4>Tutorials:</h4>
        Choose your workout: 
        <select class="form-control" id="category" value={category} onChange={handleCategory}> 
          <option value="zumba"> zumba </option>
          <option value="HIIT"> HIIT </option>
          <option value="dance"> dance </option>
          <option value="yoga"> yoga </option>
        </select> <br></br>
        <YouTube
            videoId={videoCode}
            containerClassName="embed embed-youtube"
            onStateChange={(e) => checkElapsedTime(e)}
            opts={opts}
            style={{width:10}}
          />
          <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          ariaHideApp={false}
          contentLabel="Exercise Completed"
          >
          <div class="form-check border">
            <h3>Completed the exercise?</h3>
            How do you feel: <br></br>
            <input  type="radio" name="emotion"  value= "&#x1F606;" onChange={handleEmotion}/> &#x1F606; 
            <input type="radio" name="emotion"  value= "&#x1F610;" onChange={handleEmotion}/> &#x1F610; 
            <input  type="radio" name="emotion"  value= "&#x1F60E;" onChange={handleEmotion}/> &#x1F60E; 
            <input  type="radio" name="emotion"  value= "&#x1F607;" onChange={handleEmotion}/> &#x1F607; 
            <input  type="radio" name="emotion"  value= "&#x1F616;" onChange={handleEmotion}/> &#x1F616; 
            <input type="radio" name="emotion" value= "&#128128;" onChange={handleEmotion}/> &#128128;
            <br></br>
            <button class="btn btn-outline-primary" onClick={handleExerciseComplete}>Complete exercise</button>
            <button class="btn btn-outline-primary" onClick={refresh}>No!</button>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default AddWorkout;
