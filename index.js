var Controller = require('toto-api-controller');
var eventProducer = require('toto-event-publisher');

var postEvent = require('./dlg/PostEvent');
var getEvents = require('./dlg/GetEvents');

// START the CRON job!!
var cronJob = require('./cron/PostEventCron');

// API Name
var apiName = 'pubsub-pubsmoker';

// Publisher setup 
eventProducer.registerTopic({topicName: 'totoPubsubSmoke', microservice: apiName}).then(() => {}, (err) => {console.log(err);});

// Api setup
var api = new Controller(apiName, eventProducer, null);

// api.path('POST', '/events', postEvent);
api.path('GET', '/events', getEvents);

api.listen();
