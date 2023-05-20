const fs = require('fs');

// Basic authentication 
var authentication = (req, res, next) => {
    // If 'Authorization' header not present
    if (!req.get('Authorization')) {
        var err = new Error('Not Authenticated!');
        // Set status code to '401 Unauthorized' and 'WWW-Authenticate' header to 'Basic'
        res.status(401).set('WWW-Authenticate', 'Basic');
        next(err);
    } else {
        // Decode the 'Authorization' header Base64 value
        var credentials = Buffer.from(req.get('Authorization').split(' ')[1], 'base64')
            .toString()
            .split(':');

        var username = credentials[0];
        var password = credentials[1];

        // Read credentials from JSON file
        fs.readFile('users_data.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }

            try {
                var credentialsJson = JSON.parse(data);
                var validCredentials = credentialsJson.users.some(
                    (user) => user.username === username && user.password === password
                );

                if (!validCredentials) {
                    var err = new Error('Not Authenticated!');
                    // Set status code to '401 Unauthorized' and 'WWW-Authenticate' header to 'Basic'
                    res.status(401).set('WWW-Authenticate', 'Basic');
                    next(err);
                    return;
                }


                res.status(200);

                next();
            } catch (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
            }
        });
    }
}

module.exports = authentication; 