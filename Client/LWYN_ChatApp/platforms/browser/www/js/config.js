var LA = require('main');

var QBApp = {
    appId: 72332,
    authKey: 't56EOP9X3M47vWq',
    authSecret: 'JssD7d7APtZDNcN'
};

var config = {
    chatProtocol: {
        active: 2
    },
    streamManagement: {
        enable: true
    },
    debug: {
        mode: 1,
        file: null
    },
    stickerpipe: {
        elId: 'stickers_btn',
        apiKey: '847b82c49db21ecec88c510e377b452c',
        enableEmojiTab: false,
        enableHistoryTab: true,
        enableStoreTab: true,

        userId: null,

        priceB: '0.99 $',
        priceC: '1.99 $'
    }
};

var QBUser1 = {
        id: 55460299,
        name: 'Quan LV',
        login: 'quanlv1',
        pass: 'china2902'
    },
    QBUser2 = {
        id: 55825659,
        name: 'Hang Mun',
        login: 'hangquan',
        pass: 'china2902'
    };

// QB.init(QBApp.appId, QBApp.authKey, QBApp.authSecret, config);


// ===================================================== by Q  ===================================================== 

LA.init(QBApp.appId, QBApp.authKey, QBApp.authSecret, config);
var users = {
    id: 55460299,
    name: 'Quan LV',
    login: 'quanlv1',
    pass: 'china2902'
};

LA.createSession({ login: QBUser1.login, password: QBUser1.pass }, function(err, res) {
    if (res) {
        LA.chat.connect({ userId: QBUser1.id, password: QBUser1.pass }, function(err, roster) {
            if (err) {
                console.log(err);
            } else {

                /*
                 *  (Object) roster - The user contact list
                 *  roster = {
                 *    '1126541': {subscription: 'both', ask: null},        // you and user with ID 1126541 subscribed to each other.
                 *    '1126542': {subscription: 'none', ask: null},        // you don't have subscription but user maybe has
                 *    '1126543': {subscription: 'none', ask: 'subscribe'}, // you haven't had subscription earlier but now you asked for it
                 *  }; 
                 */

            }
        });
    } else {
        console.log(err);
    }
});

LA.login({ login: QBUser1.login, password: QBUser1.pass }, function(err, res) {
    if (res) {
        LA.chat.connect({ userId: QBUser1.id, password: QBUser1.pass }, function(err, roster) {
            if (err) {
                console.log(err);
            } else {

                /*
                 *  (Object) roster - The user contact list
                 *  roster = {
                 *    '1126541': {subscription: 'both', ask: null},        // you and user with ID 1126541 subscribed to each other.
                 *    '1126542': {subscription: 'none', ask: null},        // you don't have subscription but user maybe has
                 *    '1126543': {subscription: 'none', ask: 'subscribe'}, // you haven't had subscription earlier but now you asked for it
                 *  }; 
                 */

            }
        });
    } else {
        console.log(err);
    }
});