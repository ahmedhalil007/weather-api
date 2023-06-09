const express = require('express');
const request = require('request');

const app = express();

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const logger = require('./logger');
const cache = require('./cache');
const authentication = require('./authentication');

app.use(authentication);

const options ={
    definition: {
        openapi : '3.0.0',
        info : {
            title: 'API project',
            version: '1.0.0'
        },
        servers:[
            {
                url: 'http://localhost:3000/'
            }
        ]
    },
    apis: ['./index.js']
}

const swaggerUsage = swaggerJSDoc(options)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerUsage))

/**
 * @swagger
 * /weather:
 *   get:
 *     summary: Get weather data by city name
 *     parameters:
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         required: true
 *         description: Name of the city to get weather data for
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 */

app.get('/weather', cache(300), (req, res) => {
	let { location } = req.query;
    logger.info(`Received weather request for location: ${location}`);
	request(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=3dc7c22e94a17f50555eba0f5c380684`,
		function(error, response, body) {
            if (error || response.statusCode !== 200){
                logger.error(`Error bad request for location: ${location}`);
                res.status(400).send(`${JSON.parse(body)?.message ?? 'Bad request'}`);
            }

			if (response.statusCode === 200) {
                logger.info(`Successfully fetched 'weather' for location: ${location}`);
				res.send(`The weather in city "${location}" is ${JSON.parse(body).weather[0].description}`);
			}
		}
	);

});

/**
 * @swagger
 * /forecast:
 *   get:
 *     summary: Get weather forecast by city name
 *     parameters:
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         required: true
 *         description: Name of the city to get weather forecast for
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 */

app.get('/forecast', cache(300), (req, res) => {
	let { location } = req.query;
    logger.info(`Received forecast request for location: ${location}`);
	request(
        `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=3dc7c22e94a17f50555eba0f5c380684`,
		function(error, response, body) {
            
            if (error || response.statusCode !== 200){
                logger.error(`Error bad request for location: ${location}`);
                res.status(400).send(`${JSON.parse(body)?.message ?? 'Bad request'}`);
            }

			if (response.statusCode === 200) {
                logger.info(`Successfully fetched 'current' for location: ${location}`);
				res.send(`The forecast weather in city "${location}" is ${JSON.parse(body).list[0].weather[0].description}`);
			}
		}
	);
});

/**
 * @swagger
 * /airpollution:
 *   get:
 *     summary: Get air pollution by latitude and longitude
 *     parameters:
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *         required: true
 *         description: Latitude of the location to get air pollution for
 *       - in: query
 *         name: lon
 *         schema:
 *           type: number
 *         required: true
 *         description: Longitude of the location to get air pollution for
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 */
 
 
app.get('/airpollution', cache(300), (req, res) => {
    let { lat, lon } = req.query;
    logger.info(`Received air pollution request for location: ${lat}, ${lon} `);
    request(
        `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=3dc7c22e94a17f50555eba0f5c380684`,
        function(error, response, body) {
            if (error || response.statusCode !== 200) {
                logger.error(`Error bad request for location: ${lat}, ${lon}`);
                res.status(400).send(`${JSON.parse(body)?.message ?? 'Bad request'}`);
            }

            if (response.statusCode === 200) {
                logger.info(`Successfully fetched 'airpollution' for location: ${lat}, ${lon}`);
                res.send(`The air pollution at location (latitude: ${lat}, longitude: ${lon}) is ${JSON.parse(body).list[0].main.aqi}`);
            }
        }
    );
    
});


app.listen(3000, () => console.log('Server started on port 3000'));