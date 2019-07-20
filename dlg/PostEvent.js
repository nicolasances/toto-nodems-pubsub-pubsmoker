var totoEventPublisher = require('toto-event-publisher');
var moment = require('moment-timezone');

exports.do = (req) => {

    let correlationId = req.headers['x-correlation-id'];

    return new Promise((success, failure) => {

        let event = {
            correlationId: correlationId,
            timestamp: moment().tz('Europe/Rome').format('YYYY.MM.DD.HH.mm.SS.sss')
        }

        totoEventPublisher.publishEvent('totoPubsubSmoke', event).then(success, failure);
    })
}