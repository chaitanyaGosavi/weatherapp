import React, { useEffect,  useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './SearchWeather.css'

export default function SearchWeather() {
    const [search, setSearch]=useState("London");
    const [data, setData]=useState([]);
    const [input, setInput]=useState("");
    let componentMounted=true;

    useEffect(()=>{
        const fetchWeather = async () => {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=11241f73a5563aab5b4b310cce5771d4`);
            if(componentMounted){
                setData(await response.json());
            }
            if(!/[^a-zA-Z]/.test(search)){
                alert("Invalid name");
            }
            return() =>{
                componentMounted=false;
            }
        }
        fetchWeather();
    }, [search]);

    let emoji = null;
    if (typeof data.main != "undefined") {
        if (data.weather[0].main === "Clouds") {
            emoji = 'fa-cloud'
        }
        else if (data.weather[0].main === "Thunderstorm") {
            emoji = 'fa-bolt'
        }  
        else if (data.weather[0].main === "Drizzle") {
            emoji = 'fa-cloud-rain'
        }
        else if (data.weather[0].main === "Rain") {
            emoji = 'fa-cloud-shower-heavy'
        }
        else if (data.weather[0].main === "Snow") {
            emoji = 'fa-snow-flake'
        } 
        else{
            emoji = 'fa-smog'
        }
    }
    else{
        return(
            <div>....Loading</div>
        )
    }

    let temp = (data.main.temp -273.15).toFixed(2); 
    let temp_min = (data.main.temp_min -273.15).toFixed(2); 
    let temp_max = (data.main.temp_max -273.15).toFixed(2); 

    //date, month, year
    let d = new Date();
    let date = d.getDate();
    let year = d.getFullYear();
    let month = d.toLocaleString("default", {month : 'long'});
    let day = d.toLocaleString("default", {weekday : 'long'});

    //time
    let time=d.toLocaleString([],{
        hour : '2-digit',
        minute : '2-digit',
        second : '2-digit'
    })

    const handleSubmit = (event) => {
        event.preventDefault();
       
        setSearch(input);
    }

    return (
        <div className='container weather-cont'>
            <div className='row justify-content-center'>
                <div className='col-md-8'>
                    <div className="card text-white text-center border-0">
                        <img src={`https://source.unsplash.com/random/600x900/?${data.weather[0].main}`} className="card-img" alt="..."/>
                        <div className="card-img-overlay">
                            <form onSubmit={handleSubmit}>
                                <div className="input-group mb-3">
                                    <input type="search" className="form-control" placeholder="Search City" aria-label="search city" aria-describedby="basic-addon2" required name='search' value={input} onChange={(e) => setInput(e.target.value)}/>
                                    <button type='submit' className="input-group-text" id="basic-addon2">
                                        <i className="fas fa-search"></i>
                                    </button>
                                </div>
                            </form>
                            <div className='bg-dark bg-opacity-75 p-3 rounded'>
                            <h3 className="card-title">{data.name}</h3>
                            <p className="card-text lead mb-3">{day}, {month} {date}, {year} <br />{time}</p>

                            <i className={`fas ${emoji} fa-4x`}></i>
                            <h1 className='fw-bolder mb-3'>{temp} &deg;C</h1>
                            <p className="lead fw-bolder mb-2">{data.weather[0].main}</p>
                            <p className="lead">{temp_min} &deg;C | {temp_max} &deg;C</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
