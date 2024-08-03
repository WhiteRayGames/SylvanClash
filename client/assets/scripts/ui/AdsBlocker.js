var adsBlocker = cc.Class({
    extends: cc.Component,

    properties: {
        content: cc.Node,
        closeBtn: cc.Node,
        timeLabel: cc.Label,

        bg_list: [cc.Node]
    },

    ctor () {
        this.bgIndex = 0;
    },

    start(){
        cc.Mgr.UIMgr.adsBlocker = this;

        this.limitClick = this.node.getComponent('LimitClick');
    },

    showUI:function(_callback){
        this.node.width = cc.Mgr.Config.winSize.width;
        this.node.height = cc.Mgr.Config.winSize.height;

        this.callback = _callback;

        for (let i = 0; i < this.bg_list.length; i++) {
            let bg = this.bg_list[i];
            bg.active = i == this.bgIndex;
        }
        this.bgIndex++;
        if (this.bgIndex >= this.bg_list.length) {
            this.bgIndex = 0;
        }

        this.closeBtn.active = false;
        
        this.timerCount = 20;
        this.timeLabel.string = "" + this.timerCount;
        this.timer = Date.now();

        this.content.opacity = 0;
        this.content.setScale(.5)
        cc.tween(this.content).to(0.15, {opacity:255, scale: 1}).start();
    },

    update (_dt) {
        if (this.timerCount < 0) return;

        if (Date.now() - this.timer >= 1000) {
            this.timer = Date.now();

            this.timerCount--;
            if (this.timerCount < 0) {
                this.timerCount = "";
                this.closeBtn.active = true;
            }
            this.timeLabel.string = "" + this.timerCount;
        }
    },

    closeUI:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        let self = this
        cc.tween(this.content).to(0.15, {opacity:0, scale: .5}).call(() => {
            self.node.active = false;

            self.callback && self.callback();
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount();
    },
});
module.exports = adsBlocker;
