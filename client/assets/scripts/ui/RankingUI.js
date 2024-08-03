// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var MissionType = require("MissionType");
var AchieveType = require("AchieveType");
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
        content: cc.Node,
        blurBg: cc.Node,

        title: cc.Node,
        title_zh: cc.Node,
        title_ja: cc.Node,
        title_ru: cc.Node,

        rankItemListView: cc.Node,

        rankLabel: cc.Label,
        iconLabel: cc.Label,
        nameLabel: cc.Label,
        topLabel: cc.Label,

        shareNode: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._scrollViewComponent = this.rankItemListView.getComponent('WaterfallFlow');

        this.rankingData = cc.Mgr.Utils.rankingData;
        // this.rankingData = [{ranking: 1, playerName: "我是一个男子汉，哈哈哈", plantLevel: 69, isSelf: "YES"},{ranking: 2, playerName: "haha_1", plantLevel: 68, isSelf: "NO"},{ranking: 3, playerName: "haha_1", plantLevel: 67, isSelf: "NO"},{ranking: 4, playerName: "haha_1", plantLevel: 66, isSelf: "NO"},{ranking: 5, playerName: "haha_1", plantLevel: 65, isSelf: "NO"},{ranking: 6, playerName: "haha_1", plantLevel: 64, isSelf: "NO"},{ranking: 7, playerName: "haha_1", plantLevel: 63, isSelf: "NO"},{ranking: 8, playerName: "haha_1", plantLevel: 62, isSelf: "NO"},{ranking: 9, playerName: "haha_1", plantLevel: 61, isSelf: "NO"},{ranking: 10, playerName: "haha_1", plantLevel: 60, isSelf: "NO"},{ranking: 11, playerName: "haha_1", plantLevel: 59, isSelf: "NO"},{ranking: 12, playerName: "haha_1", plantLevel: 58, isSelf: "NO"},{ranking: 13, playerName: "haha_1", plantLevel: 57, isSelf: "NO"},{ranking: 14, playerName: "haha_1", plantLevel: 56, isSelf: "NO"},{ranking: 15, playerName: "haha_1", plantLevel: 55, isSelf: "NO"},{ranking: 16, playerName: "haha_1", plantLevel: 54, isSelf: "NO"},{ranking: 17, playerName: "haha_1", plantLevel: 53, isSelf: "NO"},{ranking: 18, playerName: "haha_1", plantLevel: 52, isSelf: "NO"}];
        // this.rankingData = [{ranking: 1, playerName: "我是一个男子汉，哈哈哈", plantLevel: 69, isSelf: "YES"}];
    },

    start () {
        this.rankLabel.string = cc.Mgr.Utils.getTranslation("rank-ranking");
        this.iconLabel.string = cc.Mgr.Utils.getTranslation("rank-icon");
        this.nameLabel.string = cc.Mgr.Utils.getTranslation("rank-name");
        this.topLabel.string = cc.Mgr.Utils.getTranslation("rank-top");

        this.title.active = false;
        this.title_zh.active = false;
        this.title_ja.active = false;
        this.title_ru.active = false;
        if (cc.Mgr.Config.language === "Japanese") {
            this.title_ja.active = true;
        } else if (cc.Mgr.Config.language === "Simplified Chinese" || cc.Mgr.Config.language === "Traditional Chinese") {
            this.title_zh.active = true;
        } else if (cc.Mgr.Config.language === "Russian") {
            this.title_ru.active = true;
        } else {
            this.title.active = true;
        }
    },

    showUI () {
        this.blurBg.opacity = 0
        this.content.opacity = 0;
        this.content.setScale(.5)
        cc.tween(this.blurBg).to(0.05, {opacity:255}).call().start();
        cc.tween(this.content).to(0.15, {opacity:255, scale: 1}).start();

        if (cc.Mgr.Config.language === "Japanese") {
            this.rankLabel.fontSize = this.iconLabel.fontSize = this.nameLabel.fontSize = this.topLabel.fontSize = 16;
        } else if (cc.Mgr.Config.language === "Russian") {
            this.rankLabel.fontSize = this.iconLabel.fontSize = this.nameLabel.fontSize = this.topLabel.fontSize = 13;
        }

        this.rankingData = cc.Mgr.Utils.rankingData;
        
        // this.rankingData = [{ranking: 1, playerName: "我是一个男子汉，哈哈哈", plantLevel: 69, isSelf: "YES"},{ranking: 2, playerName: "haha_1", plantLevel: 68, isSelf: "NO"},{ranking: 3, playerName: "haha_1", plantLevel: 67, isSelf: "NO"},{ranking: 4, playerName: "haha_1", plantLevel: 66, isSelf: "NO"},{ranking: 5, playerName: "haha_1", plantLevel: 65, isSelf: "NO"},{ranking: 6, playerName: "haha_1", plantLevel: 64, isSelf: "NO"},{ranking: 7, playerName: "haha_1", plantLevel: 63, isSelf: "NO"},{ranking: 8, playerName: "haha_1", plantLevel: 62, isSelf: "NO"},{ranking: 9, playerName: "haha_1", plantLevel: 61, isSelf: "NO"},{ranking: 10, playerName: "haha_1", plantLevel: 60, isSelf: "NO"},{ranking: 11, playerName: "haha_1", plantLevel: 59, isSelf: "NO"},{ranking: 12, playerName: "haha_1", plantLevel: 58, isSelf: "NO"},{ranking: 13, playerName: "haha_1", plantLevel: 57, isSelf: "NO"},{ranking: 14, playerName: "haha_1", plantLevel: 56, isSelf: "NO"},{ranking: 15, playerName: "haha_1", plantLevel: 55, isSelf: "NO"},{ranking: 16, playerName: "haha_1", plantLevel: 54, isSelf: "NO"},{ranking: 17, playerName: "haha_1", plantLevel: 53, isSelf: "NO"},{ranking: 18, playerName: "haha_1", plantLevel: 52, isSelf: "NO"}];
        if (this.rankingData) this._scrollViewComponent.setBaseInfo(this.rankingData.length, 5, 15, 85, this.setRankList.bind(this));
        
        this._scrollViewComponent.clear();
        this._scrollViewComponent.scrollTo(0);

        this.shareNode.active = false;
    },

    setRankList (_index, _updateIdx, _curShowIdxListLen) {
        if (_updateIdx == undefined)_updateIdx = -1;

        let result;
        if (this.rankingData.length <= 5) {
            result = this.rankingData;
        } else {
          let idx = (_updateIdx == -1) ? _index * 5 : _updateIdx * 5;
          let endIdx = (_updateIdx == -1) ? idx + 5 : idx + _curShowIdxListLen * 5;
          result = this.rankingData.slice(idx, endIdx);
        }

        this._scrollViewComponent.updateShowList(result, 'RankingItem', this);
    },

    closeUI:function(){
        cc.Mgr.AudioMgr.playSFX("click");

        let self = this
        cc.tween(this.blurBg).to(0.15, {opacity:0}).start();
        cc.tween(this.content).to(0.15, {opacity:0, scale: .5}).call(() => {
            self.node.active = false;
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount("ranking");
    },

    onClickShare () {
        let self = this;
        cc.Mgr.UIMgr.showLoading();
        cc.Mgr.Utils.getBase64Image("resources/tex/shareImage_6.png", (_data) => {

            cc.Mgr.UIMgr.hideLoading();

            cc.Mgr.game.updateMissionProgressById(MissionType.InviteCount);
            cc.Mgr.game.updateAchieveProgressByType(AchieveType.Invite);
            cc.Mgr.UIMgr.InGameUI.checkMissionAchieveTip();

            let data = {}
            data.elapsed = cc.Mgr.Utils.getDate9(true)
            data.stage = cc.Mgr.game.level
            data.feature = "rank"
            cc.Mgr.analytics.logEvent("share_message", JSON.stringify(data));

            self.closeUI();

            // failed
            cc.Mgr.UIMgr.showPrompt("Invitation Failed", "", self.node);
            cc.Mgr.UIMgr.hideLoading();
        });
    }

    // update (dt) {},
});
