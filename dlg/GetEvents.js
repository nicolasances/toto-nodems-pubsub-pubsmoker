
var store = require('../store/HearbeatsStore');

exports.do = (req) => {

    return store.get();

}