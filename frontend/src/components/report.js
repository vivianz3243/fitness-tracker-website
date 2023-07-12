import React from 'react';
import Chart from 'react-apexcharts';
import {useEffect,useState} from "react"; 
import {useNavigate, useLocation} from "react-router-dom";

function Report() {
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const [lineData, setLineData] = useState([]);
    const [summaryData, setSummaryData] = useState([]);
   
    var username = location.state.username;
    const user = {"username": username}; 
    console.log("username", username);

    useEffect(() => {
      const getSummary = async () => {
        await fetch("http://localhost:5000/getSummary", { 
          method:"POST", headers: {'Content-Type': 'application/json'}, 
          body: JSON.stringify(user),
        }).then((response) => response.json()).then((data) => {
          setSummaryData(data.report)  
        })
      };  
       
    getSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) ; 

    useEffect(() => {
      
        const getPie = async () => {
            await fetch("http://localhost:5000/viewPieReport", { 
                method:"POST", headers: {'Content-Type': 'application/json'}, 
                body: JSON.stringify(user),
            }).then((response) => response.json()).then((data) => {
                setData(data.report)  
            })
        };  
         
      getPie();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) ; 

    useEffect(() => {
        const getLine = async () => {
          await fetch("http://localhost:5000/viewLineReport", { 
            method:"POST", headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify(user),
          }).then((response) => response.json()).then((data) => {
            setLineData(data.report)  
          })
        };   
      getLine();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) ; 

    
    var categories = []
    var pie_totalDuration = []
    data.map((key) => {
    return (
        categories.push(key._id),
        pie_totalDuration.push(key.totalDuration_pie)
    )
    })

    var oneWeek = [];
    for(let i =0; i<7; i++){
      const today = new Date();
      const addDate = today.setDate(today.getDate() - i); 
      oneWeek.push(addDate);
    } 
    console.log("oneWeek", oneWeek);
    
    var line_dates = []
    var line_totalDuration = []
    var line_data = []
    lineData.map((key) => {
      return ( 
        line_dates.push(new Date(key._id).getDate() +1),
        line_totalDuration.push(key.totalDuration_line),
        line_data[new Date(key._id).getDate() +1]= key.totalDuration_line
        // line_data[]
      )
    })  

    var summary_totalDuration = 0;
    var summary_totalCount = 0;
    summaryData.map((key) => {
      return(
        summary_totalDuration = key.totalDuration_sum,
        summary_totalCount = key.totalCount_sum
      )
    })

    var oneWeekData = []
    for (let i =0; i<7; i++){
      const date = new Date(oneWeek[i]).getDate();
      if(line_dates.includes(date)){
        // console.log("include")
        oneWeekData.push(line_data[date])
      }
      else{ 
        oneWeekData.push(0)
      }
    }

    const options = {
    labels: categories
    }


    const line_options={
        series: [{data: oneWeekData}],
        options: {xaxis: {categories: oneWeek, type: "datetime"}}
    }

    const back = () => {
      navigate("/workout-list", { replace: true, state: {username: username} });
    };

    return (

      <div>
        <div style={{float:"left", width: "50%"}}>
          <button onClick={back} class="btn btn-outline-dark" id="back_btn">Back to Workout List</button><br></br>
          <br></br>
          <div class="jumbotron jumbotron-fluid">
            <h2>&#x1f389; {username} 's Workout Report &#x1f389;</h2>
            <hr class="my-4"/>
            <h4>&#x1F4AA; Total Workout Time: {summary_totalDuration} mins</h4> 
            <br></br>
            <h4>&#x1f3c3; You have exercised for {summary_totalCount} times!</h4> 
            <br></br>
            <h4>&#x1F63B; Your favorite workout is: {categories[0]}</h4> 
            <p class="lead">
            </p>
          </div>

        </div>
        
        <div style={{float:"right"}}>
          <div>
          <br></br>
          <h3>Total workout time by categories</h3>
          <Chart options={options} series={pie_totalDuration} type="donut" width="500" />
          </div>
          <div>
          <h3>Last Week's Total workout time(mins) </h3>
          <Chart options={line_options.options} series = {line_options.series}type="bar" width="380" />
          </div>
        </div>

      </div>
      
    );
  
}

export default Report;