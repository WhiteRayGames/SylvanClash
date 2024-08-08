// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var tweenTime = 0.15;
var shareUI = cc.Class({
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
        closeNode: cc.Node,
        blurBg: cc.Node,
        content: cc.Node,

        shareItemListView: cc.Node,
        noItemsNode: cc.Node,

        playerHead: cc.Sprite,
        playerName: cc.Label,
        claimBtn: cc.Node,
        claimedNode: cc.Node,

        invitedByNode: cc.Node,

        claimAllBtn: cc.Node,

        allPlayersCountLabel: cc.Label,

        getGemsLabel: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.limitClick = this.node.getComponent('LimitClick');
        this._scrollViewComponent = this.shareItemListView.getComponent('WaterfallFlow');

        this.shareListData = cc.Mgr.Utils.shareData ? cc.Mgr.Utils.shareData.invitees : null;
    },

    start () {

    },

    onClickShare () {
        if (this.limitClick.clickTime() == false) {
            return;
        }

        if (cc.Mgr.Config.isTelegram == false) {
            cc.Mgr.UIMgr.showPrompt("This feature is not supported", "", this.node);
            return;
        }

        if (cc.Mgr.telegram == null || cc.Mgr.telegram.userInfo == null) {
            cc.Mgr.UIMgr.showPrompt("This feature is not supported", "", this.node);
            return;
        }

        let inviteCode = cc.Mgr.telegram.userInfo.user.invite_code;
        const messageText = encodeURIComponent("💰Catizen: Unleash, Play, Earn - Where Every Game Leads to an Airdrop Adventure! \n🎁Let's play-to-earn airdrop right now!");
        const gameUrl = encodeURIComponent("https://t.me/Vision_test_02_bot/paytest?startapp=" + inviteCode);
        const telegramUrl = `https://t.me/share/url?url=${gameUrl}&text=${messageText}`;
        window.open(telegramUrl, '_blank');
    },

    showUI:function () {
        this.node.width = cc.Mgr.Config.winSize.width;
        this.node.height = cc.Mgr.Config.winSize.height;

        this.doTween();

        this.blurBg.opacity = 0
        this.content.opacity = 0;
        this.content.setScale(.5)
        cc.tween(this.blurBg).to(0.05, {opacity:255}).call().start();
        cc.tween(this.content).to(0.15, {opacity:255, scale: 1}).start();

        if (this.shareListData && this.shareListData.length > 0) {
            this._scrollViewComponent.setBaseInfo(this.shareListData.length, 5, 15, 75, this.setShareList.bind(this));

            this._scrollViewComponent.clear();
            this._scrollViewComponent.scrollTo(0);

            this.noItemsNode.active = false;

            this.claimAllBtn.active = this.checkHasRewards();

            this.allPlayersCountLabel.string = this.shareListData.length;
        } else {
            this.noItemsNode.active = true;
            this.allPlayersCountLabel.string = "0";
        }

        this.setInvitedByData();

        this.getGemsLabel.string = cc.Mgr.Utils.getCurrentShareReward();
    },

    checkHasRewards () {
        if (this.shareListData && this.shareListData.length > 0) {
            for (let i = 0; i < this.shareListData.length; i++) {
                let shareData = this.shareListData[i];
                if (shareData.invitation_reward_claimed == false) return true;
            }
        }

        if (cc.Mgr.Utils.invitedByData) {
            if (cc.Mgr.Utils.invitedByData.invitation_reward_claimed == false) return true;
        }

        return false;
    },

    setInvitedByData () {
        if (cc.Mgr.Utils.invitedByData == null) {
            this.invitedByNode.active = false;
            return;
        }

        this.invitedByNode.active = true;

        cc.assetManager.loadRemote(cc.Mgr.Utils.invitedByData.avatar_url, (err, texture) => {
            if (err == null) {
                var spriteFrame = new cc.SpriteFrame(texture);
                this.playerHead.spriteFrame = spriteFrame;
                this.playerHead.node.width = this.playerHead.node.height = 60;
            }
        });

        this.playerName.string = "YOU ARE INVITED BY " + cc.Mgr.Utils.invitedByData.username;
        this.claimBtn.active = !cc.Mgr.Utils.invitedByData.invitation_reward_claimed;
        this.claimedNode.active = cc.Mgr.Utils.invitedByData.invitation_reward_claimed;
    },

    onClickClaimOne () {
        if (this.limitClick.clickTime() == false) {
            return;
        }

        const requestBody = JSON.stringify({
            reward_id: cc.Mgr.Utils.invitedByData.id
        });

        let url = cc.Mgr.Config.isDebug ? "https://tg-api-service-test.lunamou.com/invitation-reward/claim/":
            "https://tg-api-service.lunamou.com/invitation-reward/claim/";
        cc.Mgr.http.httpPost(url, requestBody, (error, response) => {
            if (error == true) {

                return;
            }

            let data = JSON.parse(response);
            let playerData = this.getPlayerData(data.id);
            if (playerData != null) {
                playerData.data.invitation_reward_claimed = true;

                this._scrollViewComponent.refreshAtCurPosition();
                this.claimAllBtn.active = this.checkHasRewards();
                this.claimBtn.active = !cc.Mgr.Utils.invitedByData.invitation_reward_claimed;
                this.claimedNode.active = cc.Mgr.Utils.invitedByData.invitation_reward_claimed;

                let gems = cc.Utils.getCurrentShareReward();
                cc.Mgr.game.gems += gems;
                cc.Mgr.game.gem_gained_total += gems;
                cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "gem");
                cc.Mgr.UIMgr.showGemsEffect();
            }
        });
    },

    getPlayerData (_rewardId) {
        if (this.shareListData && this.shareListData.length > 0) {
            for (let i = 0; i < this.shareListData.length; i++) {
                let shareData = this.shareListData[i];
                if (shareData.id == _rewardId) {
                    return {data: shareData, isInList: true};
                }
            }
        }

        if (cc.Mgr.Utils.invitedByData && cc.Mgr.Utils.invitedByData.id == _rewardId) {
            return {data: cc.Mgr.Utils.invitedByData, isInList: false};
        }

        return null;
    },

    updateShareListData () {
        if (this.shareListData && this.shareListData.length > 0) {
            for (let i = 0; i < this.shareListData.length; i++) {
                let shareData = this.shareListData[i];
                shareData.invitation_reward_claimed = true;
            }
        }

        this._scrollViewComponent.refreshAtCurPosition();
        this.claimAllBtn.active = this.checkHasRewards();

        if (cc.Mgr.Utils.invitedByData) {
            cc.Mgr.Utils.invitedByData.invitation_reward_claimed = true;

            this.claimBtn.active = !cc.Mgr.Utils.invitedByData.invitation_reward_claimed;
            this.claimedNode.active = cc.Mgr.Utils.invitedByData.invitation_reward_claimed;
        }
    },

    onClickClaimAll () {
        if (this.limitClick.clickTime() == false) {
            return;
        }

        const requestBody = JSON.stringify({
            user_id: window.Telegram.WebApp.initDataUnsafe.user.id
        });

        let url = cc.Mgr.Config.isDebug ? "https://tg-api-service-test.lunamou.com/invitation-reward/claim-all" :
            "https://tg-api-service.lunamou.com/invitation-reward/claim-all";
        cc.Mgr.http.httpPost(url, requestBody, (error, response) => {
            if (error == true) {

                return;
            }

            let data = JSON.parse(response);

            let onePlayerGems = cc.Utils.getCurrentShareReward();
            let gems = onePlayerGems * data.total;
            cc.Mgr.game.gems += gems;
            cc.Mgr.game.gem_gained_total += gems;
            cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "gem");
            cc.Mgr.UIMgr.showGemsEffect();

            this.updateShareListData();
        });
    },

    setShareList (_index, _updateIdx, _curShowIdxListLen) {
        if (_updateIdx == undefined)_updateIdx = -1;

        let result;
        if (this.shareListData.length <= 5) {
            result = this.shareListData;
        } else {
            let idx = (_updateIdx == -1) ? _index * 5 : _updateIdx * 5;
            let endIdx = (_updateIdx == -1) ? idx + 5 : idx + _curShowIdxListLen * 5;
            result = this.shareListData.slice(idx, endIdx);
        }

        this._scrollViewComponent.updateShowList(result, 'ShareItem', this);
    },

    doTween:function(){
        this.closeNode.opacity = 0;
        this.closeNode.scale = 0;
        cc.tween(this.closeNode).to(tweenTime, {opacity:255, scale:1.0}).start();
    },

    closeUI:function(){
        cc.Mgr.AudioMgr.playSFX("click");

        let self = this
        cc.tween(this.blurBg).to(0.15, {opacity:0}).start();
        cc.tween(this.content).to(0.15, {opacity:0, scale: .5}).call(() => {

            
            self.node.active = false;
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount("shareUI");
    }

    // update (dt) {},
});

module.exports = shareUI;