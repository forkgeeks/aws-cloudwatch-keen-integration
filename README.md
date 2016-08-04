Keen.io provides analytics as a service, which means that you it will allow you to store, explore and visualise data from anywhere by utilising HTTP Api’s. Your data resides in Keen.io servers, it’s using Cassandra to store your data in some sort of encrypted way.

We are going to export our API statistics from Cloudwatch into keen.io without utilising S3. So let’s get started.

<b>1. Create an API in AWS gateway:</b>

I have created an API in API Gateway with the following attribute

<code>GET /demo/ HTTP/1.1
Host: 8xw2xgwnrd.execute-api.us-east-1.amazonaws.com
Cache-Control: no-cache
</code>

<b>2. Enable CloudWatch Logs:</b>

Click on the API Name that you have created in stage 1. E.g in my case it’s Demo. Then click on The stage button and you will see the checkboxes to enable cloud watch logs, Turn them On.

<b>3. Integrate Keen.io with Cloudwatch:</b>

So far what we have achieved is that our clients will call our API and log of that API will be stored into Cloudwatch, Now we want to Stream this log into AWS lambda function which will then utilise the Keen.io Api and send the logs into Keen.io server. Following is the whole architecture of this process.

Read full guide for integration here at <a href="http://forkgeeks.com/the-right-way-to-integrate-keen-io-with-aws-cloudwatch-in-a-serverless-fashion/">forkgeeks.com</a>
