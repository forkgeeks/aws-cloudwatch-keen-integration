'use strict';
let https = require('https');
let zlib = require('zlib');
/**
 * Maintained By https://github.com/forkgeeks
 * 
 * Aws lambda function that will receive events from 
 * Cloudwatch process them and upload them on Keen.io.
 */

 /**
  * Keen.io Webhooks parameters, for more information
  * visit https://keen.io/docs/data-collection/ 
  * You need the following values from keen.io
  * 
  * PROJECT_ID  Keen.io generates unique project id you can get
  *             grab your key by going to Settings > API Keys > Project ID
  * 
  * EVENT_COLLECTION Name your custom event collection e.g apiLogs.
  * 
  * YOUR_API_KEY To get your api key by go to Settings > API Keys > Write Key
  **/
 let options = {
  "method": "POST",
  "hostname": "api.keen.io",
  "port": null,
  "path": "/3.0/projects/{PROJECT_ID}/events/{EVENT_COLLECTION}?api_key={YOUR_API_KEY}",
  "headers": {
    "content-type": "application/json"
  }
};

exports.handler = (event, context, callback) => {
    // We received a json from cloudwatch in gzip compressed format.
    // The data is located under {"awslogs": "data": "<Compressed String>"}
    let payload = new Buffer(event.awslogs.data, 'base64');
    zlib.gunzip(payload, (e, result) => {
        if (e) {
            callback(e);
        } else {
            result = JSON.parse(result.toString('utf8'));
            console.log('Decoded payload:', JSON.stringify(result));
            
            // Calling Keen.io API to send the result which is logs
            // Generated against the api call.
            const req = https.request(options, (res) => {
                let body = '';
                res.setEncoding('utf8');
                res.on('data', (chunk) => body += chunk);
                res.on('end', () => {
                    // If we know it's JSON, parse it
                    if (res.headers['content-type'] === 'application/json') {
                        body = JSON.parse(body);
                    }
                    // On success we are returning the response
                    // received from Keen.io API call.
                    callback(null, body);
                });
            });
            
            req.on('error', callback);
            req.write(JSON.stringify(result));
            req.end();
        }
    });
};