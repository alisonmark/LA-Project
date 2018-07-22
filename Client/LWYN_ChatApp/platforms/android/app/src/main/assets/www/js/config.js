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

QB.init(QBApp.appId, QBApp.authKey, QBApp.authSecret, config);