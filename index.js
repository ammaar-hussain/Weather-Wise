const express = require("express");
const axios = require("axios");
const dotenv = require('dotenv');
dotenv.config();

//app.js
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));


app.get("/", (req,res) => {
    res.render("index");
});


app.get("/weather", async(req,res) => {
    //city
    const city = req.query.city;
    //api key
    const APIKey = process.env.KEY;
    //creating url
    const APIUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`;

    //day and date
    const d = new Date();
    var checkDay = d.getDay();
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var day = days[checkDay];
    
    const date = d.getDate();
    const month = d.getMonth()+1;
    const year = d.getFullYear();
    const today = `${date}-${month}-${year}`;

    //do try else if error do catch
    let weather;
    let error = null;
    try{
        const response = await axios.get(APIUrl);
        weather = response.data;
        
    }
    catch(error){
        weather = undefined;
        error = "Please enter valid city name!";
        res.render("index", {
            error,
        });
    }

    var condition = weather ? weather.weather[0].main : undefined;

    var type;
    if(condition === 'Clouds'){type = 'cloud';}
    else if(condition==='Haze'){type = 'smog';}
    else if(condition==='Clear'){type = 'cloud-sun';}
    else if(condition==='Rain'){type = 'cloud-rain';}
    else if(condition==='Thunderstorm'){type = 'cloud-bolt';}
    else if(condition=== 'Mist'){type='cloud';}
    

    //rendering webpage
    res.render("index", {
        weather,
        error,
        today,
        day,
        type,
    });
});

const port = process.env.PORT || 3000;
app.listen( port ,()=> {
    console.log(`App is running on port ${port}`);
});

