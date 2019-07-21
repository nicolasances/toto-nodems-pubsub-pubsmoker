var CronJob = require('cron').CronJob;
var postEvent = require('../dlg/PostEvent');
var moment = require('moment-timezone');
var logger = require('toto-logger');
var http = require('toto-request');
var hearbeatStore = require('../store/HearbeatsStore');

var cid = () => {

	let ts = moment().format('YYYYMMDDHHmmssSSS');

	let random = (Math.random() * 100000).toFixed(0).padStart(5, '0');

	return ts + '-' + random;

}

// Define the job
var job = new CronJob('* * * * */10 0', () => {

    // Get a correlation id 
    let correlationId = cid();

    // Create the event data 
    let event = {
        id: correlationId,
        sent: moment().format('YYYY.MM.DD HH.mm.SSS')
    }

    // Send the event
    postEvent.do({
        headers: {
            'x-correlation-id': correlationId
        }, 
        body: event
    }).then(() => {

        // Store the event as SENT 
        hearbeatStore.store(event);

        // Wait a bit and then call the sub microservice to check that the message has been received
        setTimeout(() => {

            http({
                correlationId: correlationId, 
                microservice: 'toto-nodems-pubsub-subsmoker',
                method: 'GET',
                resource: '/events/' + correlationId
            }).then((data) => {
                
                // Update the event as "VERIFIED"
                if (data && data.id) hearbeatStore.tick(event);

            }, (err) => {
                console.log(err);
            })

        }, 5000);

    }, (err) => {

        // Log the error
        logger.compute(correlationId, 'Posting of event ' + correlationId + ' to PubSub failed', 'error');
        console.log(err);
        
    })
    
}, null, true, 'Europe/Rome');

// Start the job!
job.start();