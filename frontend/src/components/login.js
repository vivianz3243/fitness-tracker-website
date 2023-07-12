import React from "react";
import {useState} from "react"; 
import {useNavigate} from "react-router-dom";



const Login = props => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(""); 

  const sendData = (event) => {
    event.preventDefault();
    const user = {"username": username, "password": password}; 
    console.log(user)
    fetch("http://localhost:5000/login", { 
      method:"POST", headers: {'Content-Type': 'application/json'}, 
      body: JSON.stringify(user),
    }).then((response) => response.json()).then((data) => {
      console.log(data.result)
      if (data.result) {
        console.log("before navigate", username)
        navigate("/workout-list", { replace: true, state: {username: username} });
        
      }
      else{
        alert(data.msg)
      }
    })
  };

  const addData = (event) => {
    event.preventDefault();
    const user = {"username": username, "password": password}; 
    console.log(user)
    fetch("http://localhost:5000/register", { 
      method:"POST", headers: {'Content-Type': 'application/json'}, 
      body: JSON.stringify(user),
    }).then((response) => response.json()).then((data) => {
      alert(data.msg)
    })
  };

  return (
    <div className="form-group" style={{width: 400, marginLeft: "auto", marginRight: "auto"}}>
      <h4>Log In/ Register Your Account</h4>
      <input class="form-control" type="text" id="username" placeholder="Username" value={username} 
      onChange={(event) => setUsername(event.target.value)} />
      <input class="form-control" type="password" id="password" placeholder="Password" value={password} 
      onChange={(event) => setPassword(event.target.value)}/>
      <button class="btn btn-primary" onClick={sendData} id="login_btn">Log In</button>
      <button class="btn btn-primary pl-3" onClick={addData} id="register_btn">Register</button>
       
    </div>
  );
}

export default Login;
