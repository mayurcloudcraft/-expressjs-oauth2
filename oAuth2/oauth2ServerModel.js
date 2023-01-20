const {sequelize} = require('../models');

const OAuthAccessTokensModel = sequelize.models.AccessToken;
const OAuthRefreshTokensModel = sequelize.models.RefreshToken;
const OAuthCodeModel = sequelize.models.AuthCode;
const OAuthClientsModel = sequelize.models.Client;
const OAuthUsersModel = sequelize.models.User;

var model = module.exports;

model.getClient = function (clientId, clientSecret, callback) {
    console.log('in getClient (clientId: ' + clientId + ', clientSecret: ' + clientSecret + ')');

    var conditionObj = {client_id: clientId};

    if (clientSecret) {
        conditionObj.client_secret = clientSecret;
    }

    OAuthClientsModel.findOne({
        where: conditionObj
    }).then(result => {
        callback(false, {
            clientId,
            redirectUri: result.redirect_uri
        })
    }).catch((err) => {
        callback(true)
    });
};

var authorizedClientIds = ['s6BhdRkqt3', 'toto'];
model.grantTypeAllowed = function (clientId, grantType, callback) {
    console.log('in grantTypeAllowed (clientId: ' + clientId + ', grantType: ' + grantType + ')');

    /*if (grantType === 'password') {
      return callback(false, authorizedClientIds.indexOf(clientId) >= 0);
    }*/

    callback(false, true);
};

model.saveAccessToken = function (token, clientId, expires, user, callback) {
    console.log('in saveAccessToken (token: ' + token + ', clientId: ' + clientId + ', userId: ' + user.id + ', expires: ' + expires + ')');

    OAuthAccessTokensModel.create({
        token: token,
        client_id: clientId,
        user_id: user.id,
        expires: expires
    }).then(() => callback(false)).catch(() => callback(true));

};

model.getAccessToken = function (bearerToken, callback) {
    console.log('in getAccessToken (bearerToken: ' + bearerToken + ')');

    OAuthAccessTokensModel.findOne({
        where: {token: bearerToken}
    }).then((token) => {
        callback(false, {clientId: token.client_id, userId: token.user_id, expires: token.expires})
    }).catch(() => callback(true));
};

/*
 * Required to support password grant type
 */
model.getUser = async function (username, password, callback) {
    console.log('in getUser (username: ' + username + ', password: ' + password + ')');

    var conditionObj = {email: username};

    var user = await OAuthUsersModel.getUserByEmailAndPassword(username, password);

    if (!user) {
        callback(true);
    }

    callback(false, {id: user.id, name: user.name, email: user.email});
};

/*
 * Required to support refreshToken grant type
 */
model.saveRefreshToken = function (token, clientId, expires, user, callback) {
    console.log('in saveRefreshToken (token: ' + token + ', clientId: ' + clientId + ', userId: ' + user.id + ', expires: ' + expires + ')');

    OAuthRefreshTokensModel.create({
        token: token,
        client_id: clientId,
        user_id: user.id,
        expires: expires
    }).then(() => callback(false)).catch(() => callback(true));
};

model.getRefreshToken = function (refreshToken, callback) {
    console.log('in getRefreshToken (refreshToken: ' + refreshToken + ')');

    OAuthRefreshTokensModel.findOne({
        where: {token: refreshToken}
    }).then((token) => {
        callback(false, {clientId: token.client_id, userId: token.user_id, expires: token.expires})
    }).catch(() => callback(true));
};

model.revokeRefreshToken = function (bearerToken, callback) {
    console.log("in revokeRefreshToken (bearerToken: " + bearerToken + ")");

    OAuthRefreshTokensModel.destroy({
        where: {token: bearerToken}
    }).then(() => callback(false)).catch(() => callback(true));
};

/*
    Required for authorization_code grant type
*/

model.getAuthCode = function (bearerCode, callback) {
    console.log("in getAuthCode (bearerCode: " + bearerCode + ")");

    OAuthCodeModel.findOne({
        where: {code: bearerCode}
    }).then((authCode) => {
        callback(false, {clientId: authCode.client_id, userId: authCode.user_id, expires: authCode.expires})
    }).catch(() => callback(true));
};

model.saveAuthCode = function (authCode, clientId, expires, user, callback) {
    console.log('in saveAuthCode (authCode: ' + authCode + ', clientId: ' + clientId + ', userId: ' + user.id + ', expires: ' + expires + ')');

    OAuthCodeModel.create({
        code: authCode,
        client_id: clientId,
        user_id: user.id,
        expires: expires /*parseInt(expires / 1000, 10)*/
    }).then(() => callback(false)).catch(() => callback(true));

};

/*
    Required for client_credentials grant type
*/

model.getUserFromClient = function (clientId, clientSecret, callback) {
    console.log("in getUserFromClient (clientId: " + clientId + ", clientSecret: " + clientSecret + ")");

    var conditionObj = {client_id: clientId};

    if (clientSecret) {
        conditionObj.client_secret = clientSecret;
    }

    OAuthClientsModel.findOne({
        where: conditionObj
    }).then(result => {
        callback(false, {id: result.user_id})
    }).catch((err) => {
        callback(true)
    });
};
