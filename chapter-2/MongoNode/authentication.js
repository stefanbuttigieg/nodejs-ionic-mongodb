/**
 * Created by csvan on 01/04/15.
 */

var database = require('./database');



function generateToken() {

}

exports.authenticate = function (user, password, cb) {
    if (user.password === password) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
