// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },

    start () {
        cc.Mgr.notification = this;
    },

    init () {
        if (cc.Mgr.game.lastNotificationTimer !== 0) {
            // if (this.isToday(cc.Mgr.game.lastNotificationTimer)) return;  
            if (!this.isToday(cc.Mgr.game.lastNotificationTimer)) {
                cc.Mgr.game.notificationIndex++;
            }
        }
        cc.Mgr.game.lastNotificationTimer = Date.now();
        let days = [1, 2, 3, 4, 5];
        let notificationList = [];
        for (let i = 0; i < 7; i++) {
            let notification = {};
            notification.title = cc.Mgr.Utils.getTranslation("notification-title-" + (i + 1))
            notification.content = cc.Mgr.Utils.getTranslation("notification-content-" + (i + 1))
            notificationList.push(notification)
        }

        if (cc.Mgr.game.notificationIndex >= 7) {
            cc.Mgr.game.notificationIndex = 0;
        }

        let currentIndex = cc.Mgr.game.notificationIndex;
        for (let j = 0; j < days.length; j++) {
            this.sendNotification("" + j, notificationList[currentIndex].title, notificationList[currentIndex].content, days[j] * 24 * 3600 + 1200); // tempory code (j + 1) * 120 days[j] * 24 * 3600 + 1200
            currentIndex++;
            if (currentIndex >= 7) {
                currentIndex = 0;
            }
        }   
    },

    sendNotification (_id, _title, _content, _interval) {

    },

    clearNotifications: function() {

    },

    isToday(_ms) {
        return new Date().toDateString() === new Date(_ms).toDateString();
      }

    // update (dt) {},
});
