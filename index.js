const express = require('express');
const request = require('request');

const app = express();

app.get('/weather', (req, res) => {
	let { city } = req.query;
	request(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=3dc7c22e94a17f50555eba0f5c380684`,
		function(error, response, body) {
            if (error || response.statusCode !== 200){
                res.status(400).send(`${JSON.parse(body)?.message ?? 'Bad request'}`);
            }

			if (response.statusCode === 200) {
				res.send(`The weather in your city "${city}" is ${JSON.parse(body).weather[0].description}`);
			}
		}
	);
});

app.get('/forecast', (req, res) => {
	let { city } = req.query;
	request(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=3dc7c22e94a17f50555eba0f5c380684`,
		function(error, response, body) {
            
            if (error || response.statusCode !== 200){
                res.status(400).send(`${JSON.parse(body)?.message ?? 'Bad request'}`);
            }

			if (response.statusCode === 200) {
				res.send(`The weather aaaa in your city "${city}" is ${JSON.parse(body).list[0].weather[0].description}`);
			}
		}
	);
});

app.get('/airpollution', (req, res) => {
    let { lat, lon } = req.query;
    request(
        `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=3dc7c22e94a17f50555eba0f5c380684`,
        function(error, response, body) {
            if (error || response.statusCode !== 200) {
                res.status(400).send(`${JSON.parse(body)?.message ?? 'Bad request'}`);
            }

            if (response.statusCode === 200) {
                res.send(`The air pollution in your location (latitude: ${lat}, longitude: ${lon}) is ${JSON.parse(body).list[0].main.aqi}`);
            }
        }
    );
});


app.listen(3000, () => console.log('Server started on port 3000'));