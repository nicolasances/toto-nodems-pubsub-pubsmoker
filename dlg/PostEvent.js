var totoEventPublisher = require('toto-event-publisher');

exports.do = (req) => {

    let correlationId = req.headers['x-correlation-id'];

    return new Promise((success, failure) => {

        let event = {
            correlationId: correlationId,
            id: req.body.id,
            sent: req.body.sent
        }

        totoEventPublisher.publishEvent('totoPubsubSmoke', event).then(success, failure);
    })
}