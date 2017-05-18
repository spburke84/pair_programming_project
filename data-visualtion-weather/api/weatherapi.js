const https = require("https");
const express = require('express');
const app = express();
//const axios = require("axios")
//const bodyParser = require('body-parser');
//const fs = require('fs');

//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());

app.use(function(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.listen(8080, () => {
	console.log('Server Started on http://localhost:8080');
	console.log('Press CTRL + C to stop server');
});





function farenToCel (farenheit) {
    let cel = (farenheit -32)*(5/9);
    return cel;
}

let canadianCities = [
    {coordinates: '43.700,-79.5667', cityName: 'toronto', mapLocation: ""},
    {coordinates: '51.0535,-114.0628', cityName: 'calgary', mapLocation: ""},
    {coordinates: '53.57, -113.54', cityName: 'edmonton', mapLocation: ""},
    {coordinates: '49.88, -97.17', cityName: 'winnipeg', mapLocation: ""},
    {coordinates: '45.52, -73.57', cityName: 'montreal', mapLocation: ""},
    {coordinates: '49.28, -123.13', cityName: 'vancouver', mapLocation: ""},
    {coordinates: '45.42, -75.71', cityName: 'ottawa', mapLocation: ""},
]


 function getCanadianCities (){
    return new Promise((resolve, reject) => {
    
        for(let i =0; i <canadianCities.length; i++) {
            const request = https.get("https://api.darksky.net/forecast/cf4a8ac156ac1f547919dc64f0b6159a/" + canadianCities[i].coordinates, (response) => {

                let body = "";

                response.on('data',(chunk) => {
                    body += chunk;
                });

                response.on('end', () => {
                    if (response.statusCode === 200){
                        try {
                            let jsonResponse = JSON.parse(body);
                            canadianCities[i].temperature = farenToCel(jsonResponse.currently.temperature).toFixed(2);
                            canadianCities[i].currentWeather = jsonResponse.currently.summary;

                            //console.log("Current Weather in " + jsonResponse.timezone);
                            //console.log("- temperature: "+ farenToCel(jsonResponse.currently.temperature).toFixed(2) + " degrees Celsuis");
                            //console.log("- summary: " + jsonResponse.currently.summary);

                        }catch(e) {
                            console.log('Could not parse JSON object');
                        }
                    }
                });
                //console.log(body);
               // console.log(canadianCities);

            });
        }

    })
        resolve("success");
        reject("failure");
}

app.get('/canadianCities', (req, res) => {
    console.log("hi");
	getCanadianCities.then(response => {
    console.log(response.data);
    res.send(response.data);
  })
	.catch(error => {
			console.log(error);
	});
}); 