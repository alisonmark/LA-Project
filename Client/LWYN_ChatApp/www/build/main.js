'use strict';

/*
 * JavaScript SDK
 *
 * Main SDK Module
 *
 */
var config = require('config');
var Utils = require('utils');

function LAApp() {};

LAApp.prototype = {

    /**
     * Return current version of LA JavaScript SDK
     * @memberof LAApp
     * */
    version: config.version,

    /**
     * Return current build number of LA JavaScript SDK
     * @memberof LAApp
     * */
    buildNumber: config.buildNumber,


    /**
     * @memberof LA
     * @param {Number | String} appIdOrToken - Application ID (from your admin panel) or Session Token.
     * @param {String | Number} authKeyOrAppId - Authorization key or Application ID. You need to set up Application ID if you use session token as appIdOrToken parameter.
     * @param {String} authSecret - Authorization secret key (from your admin panel).
     * @param {Object} configMap - Settings object for QuickBlox SDK.
     */
    init: function(appIdOrToken, authKeyOrAppId, authSecret, configMap) {
        if (configMap && typeof configMap === 'object') {
            config.set(configMap);
        }
        var Auth = require('auth');
        this.auth = new Auth(this.service);

        // if (Utils.getEnv().browser) {
        //     /** add adapter.js*/
        //     require('webrtc-adapter');

        //     /** add WebRTC API if API is avaible */
        //     if (Utils.isWebRTCAvailble()) {
        //         var WebRTCClient = require('./modules/webrtc/WebRTCClient');
        //         this.webrtc = new WebRTCClient(this.service, this.chat.connection);
        //         this.chat.webrtcSignalingProcessor = this.webrtc.signalingProcessor;
        //     } else {
        //         this.webrtc = false;
        //     }
        // } else {
        //     this.webrtc = false;
        // }

        // <!-- =================================================== BY Default =================================================== -->
        // /** include dependencies */
        // var Proxy = require('./qbProxy'),
        //     Auth = require('./modules/qbAuth'),
        //     Users = require('./modules/qbUsers'),
        //     Content = require('./modules/qbContent'),
        //     PushNotifications = require('./modules/qbPushNotifications'),
        //     Data = require('./modules/qbData'),
        //     AddressBook = require('./modules/qbAddressBook'),
        //     Chat = require('./modules/chat/qbChat'),
        //     DialogProxy = require('./modules/chat/qbDialog'),
        //     MessageProxy = require('./modules/chat/qbMessage');
        // <!-- =================================================== BY Default =================================================== -->

        // this.service = new Proxy();
        // this.auth = new Auth(this.service);
        // this.users = new Users(this.service);
        // this.content = new Content(this.service);
        // this.pushnotifications = new PushNotifications(this.service);
        // this.data = new Data(this.service);
        // this.addressbook = new AddressBook(this.service);
        // this.chat = new Chat(this.service);
        // this.chat.dialog = new DialogProxy(this.service);
        // this.chat.message = new MessageProxy(this.service);

        // if (Utils.getEnv().browser) {
        //     /** add adapter.js*/
        //     require('webrtc-adapter');

        //     /** add WebRTC API if API is avaible */
        //     if (Utils.isWebRTCAvailble()) {
        //         var WebRTCClient = require('./modules/webrtc/qbWebRTCClient');
        //         this.webrtc = new WebRTCClient(this.service, this.chat.connection);
        //         this.chat.webrtcSignalingProcessor = this.webrtc.signalingProcessor;
        //     } else {
        //         this.webrtc = false;
        //     }
        // } else {
        //     this.webrtc = false;
        // }
        // <!-- =================================================== BY Default =================================================== -->

        // Initialization by outside token
        if (typeof appIdOrToken === 'string' && (!authKeyOrAppId || typeof authKeyOrAppId === 'number') && !authSecret) {

            if (typeof authKeyOrAppId === 'number') {
                config.creds.appId = authKeyOrAppId;
                console.log("Hi Team authKeyOrAppId === number");
            }

            this.service.setSession({ token: appIdOrToken });
            console.log("Hi Team authKeyOrAppId === 'number'");

        } else {
            config.creds.appId = appIdOrToken;
            config.creds.authKey = authKeyOrAppId;
            config.creds.authSecret = authSecret;
            console.log("Hi Team config.creds.appId = appIdOrToken;");
        }
    },
    // <!-- =================================================== START SESSIONS & AUTHENTICATIONs FEATURES =================================================== -->

    /**
     * Return current session
     * @memberof LA
     * @param {getSessionCallback} callback - The getSessionCallback function.
     * */
    getSession: function(callback) {
        /**
         * This callback return session object.
         * @callback getSessionCallback
         * @param {Object} error - The error object
         * @param {Object} session - Contains of session object
         * */
        this.auth.getSession(callback);
    },

    /**
     * Creat new session.
     * @memberof LA
     * @param {String} appIdOrToken Should be applecationID or token.
     * @param {createSessionCallback} callback -
     * */
    createSession: function(params, callback) {
        /**
         * This callback return session object.
         * @callback createSession
         * @param {Object} error - The error object
         * @param {Object} session - Contains of session object
         * */
        this.auth.createSession(params, callback);
    },

    /**
     * Destroy current session.
     * @memberof LA
     * @param {destroySessionCallback} callback - The destroySessionCallback function.
     * */
    destroySession: function(callback) {
        /**
         * This callback returns error or empty string.
         * @callback destroySessionCallback
         * @param {Object | Null} error - The error object if got en error and null if success.
         * @param {Null | String} result - String (" ") if session was removed successfully.
         * */
        this.auth.destroySession(callback);
    },

    /**
     * Login to application.
     * @memberof LA
     * @param {Object} params - Params object for login into the session.
     * @param {loginCallback} callback - The loginCallback function.
     * */
    login: function(params, callback) {
        /**
         * This callback return error or user Object.
         * @callback loginCallback
         * @param {Object | Null} error - The error object if got en error and null if success.
         * @param {Null | Object} result - User data object if everything goes well and null on error.
         * */
        this.auth.login(params, callback);
    },

    /**
     * Remove user from current session, but doesn't destroy it.
     * @memberof LA
     * @param {logoutCallback} callback - The logoutCallback function.
     * */
    logout: function(callback) {
        /**
         * This callback return error or user Object.
         * @callback logoutCallback
         * @param {Object | Null} error - The error object if got en error and null if success.
         * @param {Null | String} result - String (" ") if session was removed successfully.
         * */
        this.auth.logout(callback);
    }

    // <!-- =================================================== START SESSIONS & AUTHENTICATIONs FEATURES =================================================== -->
};

/**
 * @namespace
 */
var LA = new LAApp();

LA.LAApp = LAApp;

module.exports = LA;