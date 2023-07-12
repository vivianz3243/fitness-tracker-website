import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";


import AddWorkout from "./components/add-workout";
import WorkoutList from "./components/workout-list";
import Login from "./components/login";
import Report from "./components/report";

function App() {
  const [user, setUser] = React.useState(null);

  async function login(user = null) {
    setUser(user);
  }

  async function logout() {
    setUser(null)
  }

  return (

    <div className="App">

      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <a href="/" className="navbar-brand">
          Home
        </a>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/workout-list"} className="nav-link">
              Workout
            </Link>
          </li>
          <li className="nav-item" >
            { user ? (
              <a href="#/" onClick={logout} className="nav-link" style={{cursor:'pointer'}}>
                Logout {user.name}
              </a>
            ) : (            
            <Link to={"/login"} className="nav-link">
              Login
            </Link>
            )}
          </li>
          <li className="nav-item">
            <Link to={"/"} className="nav-link">
              Logout
            </Link>
          </li>
        </div>
      </nav>

      <div className="container mt-3">
        <Routes>
          {/* <Route path={["/", "/workout-list"]} element={<WorkoutList />} /> */}
          <Route path={"/workout-list"} element={<WorkoutList />} />
          <Route path={"/"} element={<WorkoutList />} />
          <Route path={"/"} element={<WorkoutList />} />
          <Route path={"/report"} element={<Report />} />
          <Route 
            // path="/workout-list/:id/addworkout"
            path="/addworkout"
            element={<AddWorkout />}
            render={(props) => (
              <AddWorkout {...props} user={user} />
            )}
          />
          <Route 
            path="/workout-list/:id"
            render={(props) => (
              <WorkoutList {...props} user={user} />
            )}
          />
          <Route 
            path="/login"
            element={<Login login={login} />}
          />
 
        </Routes>
      </div>


    </div>
  );
}

export default App;
