'use strict';
let zlib = require('zlib');
let parse = require("cloudwatch-logs-parser");
let Keen = require("keen.io");

/**
 * Pass the data to send as `event.data`, and the request options as
 * `event.options`. For more information see the HTTPS module documentation
 * at https://nodejs.org/api/https.html.
 *
 * Will succeed with the response body.
 */

let client = Keen.configure({
    projectId: "<project_id>",
    writeKey: "<write_key>",
});

exports.handler = (event, context, callback) => {
    let payload = new Buffer(event.awslogs.data, 'base64');
    zlib.gunzip(payload, (e, result) => {
        if (e) {
            callback(e);
        } else {
            result = JSON.parse(result.toString('utf8'));
            console.log('Decoded payload:', JSON.stringify(result));
            // send single event to Keen IO 
            client.addEvent("event", parse(result), function(err, res) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, res);
                }
            });
        }
    });
};
