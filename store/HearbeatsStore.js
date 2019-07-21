
var MAX_CACHE_SIZE = 20;

var cache = [];

/**
 * Stores the hearbit event 
 */
exports.store = (event) => {

    if (cache.length >= MAX_CACHE_SIZE) cache.shift();

    cache.push(event);

}

/**
 * Tick a heartbit event as 'ok'
 */
exports.tick = (event) => {

    for (var i = 0; i < cache.length; i++) {

        if (cache[i].id === event.id) {

            cache[i].verified = true;
        }
    }

}

/**
 * Retrieves the cached heartbits
 */
exports.get = () => {

    return new Promise((success, failure) => {

        success({heartbits: cache})
    })

}