cc.Class({
    extends: cc.Component,

    properties: {
      
        progressSprite:cc.Sprite,
        monsterNode: cc.Node,

        progressNode: cc.Node,

        title: cc.Node,
        title_r: cc.Node,

        playButton: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        if (cc.Mgr.Config.language == "English") {
            this.title.active = true;
            this.title_r.active = false;
        } else {
            this.title.active = false;
            this.title_r.active = true;
        }
        
        this.logoNode = this.title;

        this.playButton.active = false;

        this.node.zIndex = 130;
        this.startUpdate = false;
        
        this.startUpdate = true;

        cc.Mgr.UserDataMgr.initData(() => {
            cc.Mgr.GameCenterCtrl.init();
        });
        this.initCallback();

        this.winSize = cc.view.getVisibleSize();
        if (this.logoNode.y > (this.winSize.height / 2)) this.logoNode.y = (this.winSize.height / 2) - this.logoNode.height / 2 - 10;
        if (this.progressNode.y < (-1 * (this.winSize.height / 2))) this.progressNode.y = -1 * (this.winSize.height / 2) + this.progressNode.height / 2 + 10;
    },

    initCallback () {
        setTimeout(() => {
            cc.Mgr.notification.clearNotifications();
        }, 15000);

        
        setTimeout(() => {
            cc.Mgr.notification.init();
        }, 20000);

        cc.Mgr.Utils.downloadRanking();
    },

    onClickPlay () {
        this.node.destroy();
        this.monsterNode.destroy();

        cc.Mgr.GameCenterCtrl.checkUpdate();
    },

    updateProgress (_value) {
        this.progressSprite.fillRange = _value;
        this.monsterNode.x = -235 + _value * 450;
        if (_value === 1) {
            this.node.destroy();
            this.monsterNode.destroy();
        }
    }
});
