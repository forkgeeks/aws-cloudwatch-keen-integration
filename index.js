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
    projectId: "< your_project_id >",
    writeKey: "< your_write_key >",
});

exports.handler = (event, context, callback) => {
    let payload = new Buffer(event.awslogs.data, 'base64');
    zlib.gunzip(payload, (e, result) => {
        if (e) {
            callback(e);
        } else {
            // aws logs are in compressed format so decoding the gzip string.
            result = JSON.parse(result.toString('utf8'));

            // Aws logs are in string format we want to extract useful information
            // out of that string. We will use npm module "cloudwatch-logs-parser"
            let apiLog = parse(result);
            
            // sending this log to Keen IO 
            client.addEvent("event", apiLog, function(err, res) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, res);
                }
            });
        }
    });
};