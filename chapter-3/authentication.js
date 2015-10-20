/**
 * Created by csvan on 01/04/15.
 */

var db = require('./database');

var getTokenById = function (tokenID, cb) {
    database.find('OrderBase', 'AccessToken', {_id: tokenID}, function (err, token) {
        cb(null, token);
    });
};

var getRoleById = function (tokenID, cb) {
    database.find('OrderBase', 'Base', {_id: tokenID}, function (err, token) {
        cb(null, token);
    });
};

var getUserForToken = function (token, cb) {
    database.find('OrderBase', 'User', {_id: token.userID}, function (err, user) {
        cb(null, user);
    });
};

module.exports = {
    database: 'OrderBase',
    collection: 'AccessTokens',
    generateToken: function (user, cb) {
        var token = {
            userID: user._id
        }

        // Persist and return the token
        db.insert(this.database, this.collection, token, function (err, res) {
            if (err) {
                cb(err, null);
            } else {
                cb(null, res);
            }
        })
    },
    authenticate: function (user, password, cb) {
        if (user.password === password) {
            // Create a new token for the user
            this.generateToken(user, function (err, res) {
                cb(null, res);
            })
        } else {
            cb({error: 'Authentication error', message: 'Incorrect username or password'}, null);
        }
    },
    tokenOwnerHasRole: function (token, roleName, cb) {
        var database = this.database;
        db.find(database, 'User', {_id: token.userID}, function (err, user) {
            db.find(database, 'Role', {_id: user.roleID}, function (err, role) {
                if(err) {
                    cb(err, false)
                }
                else if (role.name === roleName) {
                    cb(null, true)
                }
                else {
                    cb(null, false)
                }
            });
        });
    }
}
