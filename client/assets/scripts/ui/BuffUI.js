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
        content: cc.Node,
        blurBg: cc.Node,

        auto_title: cc.Label,
        rage_title: cc.Label,
        fire_title: cc.Label,
        ice_titile: cc.Label,
        crit_title: cc.Label,

        getBtnLabelList: [cc.Label],

        auto_progress: cc.Node,
        rage_progress: cc.Node,
        fire_progress: cc.Node,
        ice_progress: cc.Node,
        crit_progress: cc.Node,

        auto_time_label: cc.Label,
        rage_time_label: cc.Label,
        fire_time_label: cc.Label,

        ice_time_label: cc.Label,
        crit_time_label: cc.Label,

        auto_btn_sprite: cc.Sprite,
        rage_btn_sprite: cc.Sprite,
        fire_btn_sprite: cc.Sprite,
        ice_btn_sprite: cc.Sprite,
        crit_btn_sprite: cc.Sprite,

        auto_btn: cc.Node,
        rage_btn: cc.Node,
        fire_btn: cc.Node,
        ice_btn: cc.Node,
        crit_btn: cc.Node,

        auto_invite_btn: cc.Node,
        rage_invite_btn: cc.Node,
        fire_invite_btn: cc.Node,
        ice_invite_btn: cc.Node,
        crit_invite_btn: cc.Node,

        nomarlM: cc.Material,
        grayM: cc.Material,

        title: cc.Node,
        title_zh: cc.Node,
        title_ja: cc.Node,
        title_ru: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.auto_title.string = cc.Mgr.Utils.getTranslation("buff-auto");
        this.rage_title.string = cc.Mgr.Utils.getTranslation("buff-rage");
        this.fire_title.string = cc.Mgr.Utils.getTranslation("buff-flame");
        this.ice_titile.string = cc.Mgr.Utils.getTranslation("buff-freeze");
        this.crit_title.string = cc.Mgr.Utils.getTranslation("buff-crit");

        for (let i = 0; i < this.getBtnLabelList.length; i++) {
            this.getBtnLabelList[i].string = cc.Mgr.Utils.getTranslation("btn-get");
        }

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
        }else {
            this.title.active = true;
        }

        this.limitClick = this.node.getComponent('LimitClick');

        this.allowShow = true;
    },

    showUI () {
        this.blurBg.opacity = 0
        this.content.opacity = 0;
        this.content.setScale(.5)
        cc.tween(this.blurBg).to(0.05, {opacity:255}).call().start();
        cc.tween(this.content).to(0.15, {opacity:255, scale: 1}).start();

        this.checkAvailabelAds = cc.Mgr.admob.checkAvailableRewardedAd();
        if (this.checkAvailabelAds) {
            // this.rage_btn_sprite.setMaterial(0, this.nomarlM);
            this.rage_btn.active = true;
        } else {
            // this.rage_btn_sprite.setMaterial(0, this.grayM);
            this.rage_btn.active = false;
        }
        if (this.checkAvailabelAds) {
            // self.auto_btn_sprite.setMaterial(0, self.nomarlM);
            this.auto_btn.active = true;
        } else {
            // self.auto_btn_sprite.setMaterial(0, self.grayM);
            this.auto_btn.active = false;
        }
        if (this.checkAvailabelAds) {
            // self.crit_btn_sprite.setMaterial(0, self.nomarlM);
            this.crit_btn.active = true;
        } else {
            // self.crit_btn_sprite.setMaterial(0, self.grayM);
            this.crit_btn.active = false;
        }
        if (this.checkAvailabelAds) {
            // self.ice_btn_sprite.setMaterial(0, self.nomarlM);
            this.ice_btn.active = true;
        } else {
            // self.ice_btn_sprite.setMaterial(0, self.grayM);
            this.ice_btn.active = false;
        }
        if (this.checkAvailabelAds) {
            // self.fire_btn_sprite.setMaterial(0, self.nomarlM);
            this.fire_btn.active = true;
        } else {
            // self.fire_btn_sprite.setMaterial(0, self.grayM);
            this.fire_btn.active = false;
        }

        this.refreshUI();

        this.updateBtns();

        cc.Mgr.admob.showBanner("buff");
    },

    refreshUI:function(){
        this.rage_progress.width = cc.Mgr.game.rageTimer / 900 * 241;
        this.rage_time_label.string = cc.Mgr.Utils.FormatNumToTime(cc.Mgr.game.rageTimer);
        // this.rage_time_label.node.active = cc.Mgr.game.rageTimer > 0;

        this.auto_progress.width = cc.Mgr.game.autoTimer / 900 * 241;
        this.auto_time_label.string = cc.Mgr.Utils.FormatNumToTime(cc.Mgr.game.autoTimer);
        // this.auto_time_label.node.active = cc.Mgr.game.autoTimer > 0;

        this.fire_progress.width = cc.Mgr.game.fireTimer / 900 * 241;
        this.fire_time_label.string = cc.Mgr.Utils.FormatNumToTime(cc.Mgr.game.fireTimer);
        // this.fire_time_label.node.active = cc.Mgr.game.fireTimer > 0;

        this.ice_progress.width = cc.Mgr.game.iceTimer / 900 * 241;
        this.ice_time_label.string = cc.Mgr.Utils.FormatNumToTime(cc.Mgr.game.iceTimer);
        // this.ice_time_label.node.active = cc.Mgr.game.iceTimer > 0;

        this.crit_progress.width = cc.Mgr.game.critTimer / 900 * 241;
        this.crit_time_label.string = cc.Mgr.Utils.FormatNumToTime(cc.Mgr.game.critTimer);
        // this.crit_time_label.node.active = cc.Mgr.game.critTimer > 0;
    },

    updateAdsBtnState () {
        this.checkAvailabelAds = cc.Mgr.admob.checkAvailableRewardedAd();
        if (this.checkAvailabelAds) {
            // this.rage_btn_sprite.setMaterial(0, this.nomarlM);
            this.rage_btn.active = true;
        } else {
            // this.rage_btn_sprite.setMaterial(0, this.grayM);
            this.rage_btn.active = false;
        }
        if (this.checkAvailabelAds) {
            // self.auto_btn_sprite.setMaterial(0, self.nomarlM);
            this.auto_btn.active = true;
        } else {
            // self.auto_btn_sprite.setMaterial(0, self.grayM);
            this.auto_btn.active = false;
        }
        if (this.checkAvailabelAds) {
            // self.crit_btn_sprite.setMaterial(0, self.nomarlM);
            this.crit_btn.active = true;
        } else {
            // self.crit_btn_sprite.setMaterial(0, self.grayM);
            this.crit_btn.active = false;
        }
        if (this.checkAvailabelAds) {
            // self.ice_btn_sprite.setMaterial(0, self.nomarlM);
            this.ice_btn.active = true;
        } else {
            // self.ice_btn_sprite.setMaterial(0, self.grayM);
            this.ice_btn.active = false;
        }
        if (this.checkAvailabelAds) {
            // self.fire_btn_sprite.setMaterial(0, self.nomarlM);
            this.fire_btn.active = true;
        } else {
            // self.fire_btn_sprite.setMaterial(0, self.grayM);
            this.fire_btn.active = false;
        }
    },

    updateBtns (_noFill) {
        if (_noFill == true) cc.Mgr.game.noFillCount++;

        if (cc.Mgr.game.noFillCount >= 3) {
            this.rage_btn.active = this.auto_btn.active = this.crit_btn.active = this.ice_btn.active = this.fire_btn.active = false;

            // share
            this.rage_invite_btn.active = this.auto_invite_btn.active = this.crit_invite_btn.active = this.ice_invite_btn.active = this.fire_invite_btn.active =  false;
        } else {
            this.rage_invite_btn.active = this.auto_invite_btn.active = this.crit_invite_btn.active = this.ice_invite_btn.active = this.fire_invite_btn.active = false;
        }
    },

    onClickGetAutoByInvite () {
        if (this.limitClick.clickTime() == false) {
            return
        }

        let self = this;
        cc.Mgr.UIMgr.showLoading();
        cc.Mgr.Utils.getBase64Image("resources/tex/shareImage_2.png", (_data) => {

            cc.Mgr.game.updateMissionProgressById(MissionType.InviteCount);
            cc.Mgr.game.updateAchieveProgressByType(AchieveType.Invite);
            cc.Mgr.UIMgr.InGameUI.checkMissionAchieveTip();

            cc.Mgr.UIMgr.openAssetGetUI("auto", 300, "buff");

            let data = {}
            data.elapsed = cc.Mgr.Utils.getDate9(true)
            data.stage = cc.Mgr.game.level
            data.feature = "buff auto"
            cc.Mgr.analytics.logEvent("share_message", JSON.stringify(data));
        });
    },

    onClickGetAutoByAd () {
        if (this.limitClick.clickTime() == false) {
            return
        }
        if (this.checkAvailabelAds === false) {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("ad-tip-3"), "", this.node);
            return;
        }
        var self = this;
        cc.Mgr.admob.showRewardedVideoAd((function(_state, _noFill) {
            if (_state === true) {
                cc.Mgr.UIMgr.openAssetGetUI("auto", 300, "buff");
                // cc.Mgr.game.autoTimer += 150;
                // if(cc.Mgr.game.autoTimer > 150) cc.Mgr.game.autoTimer = 150;
                // self.refreshUI();
                // cc.Mgr.plantMgr.changePlantAutoState(true);

                self.updateBtns(_noFill);
            }
        }), this.node, "auto", this);
    },

    onClickGetAutoByGem () {
        if(cc.Mgr.game.autoTimer >= 900)
        {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("max-auto-time-300"), "", this.node);
            return;
        }

        if(cc.Mgr.game.gems >= 3)
        {
            cc.Mgr.game.gems -= 3;
            cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "gem");
            let data = {};
            data.elapsed = cc.Mgr.Utils.getDate9(true);
            data.costGems = 3;
            // cc.Mgr.analytics.logEvent("auto_get_more_time", JSON.stringify(data));

            cc.Mgr.UIMgr.openAssetGetUI("auto", 300, "buff");

            // cc.Mgr.game.autoTimer += 150;
            // if(cc.Mgr.game.autoTimer > 150) cc.Mgr.game.autoTimer = 150;
            // this.refreshUI();
            // cc.Mgr.plantMgr.changePlantAutoState(true);
        }
        else {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("NoGems"), "gem", this.node);
            // cc.Mgr.game.needShowIAPCount++;
            // if (cc.Mgr.game.needShowIAPCount >= 1) {
            //     cc.Mgr.UIMgr.openPaymentUI(true);
            //     cc.Mgr.game.needShowIAPCount = 0;
            // }
            if (this.allowShow === true) {
                this.allowShow = false;
                setTimeout(() => {
                    cc.Mgr.UIMgr.openPaymentUI(true);
                    this.allowShow = true;
                }, 300);
            }
        }  
    },

    onClickGetCritByInvite () {
        if (this.limitClick.clickTime() == false) {
            return
        }

        let self = this;
        cc.Mgr.UIMgr.showLoading();
        cc.Mgr.Utils.getBase64Image("resources/tex/shareImage_2.png", (_data) => {

            cc.Mgr.game.updateMissionProgressById(MissionType.InviteCount);
            cc.Mgr.game.updateAchieveProgressByType(AchieveType.Invite);
            cc.Mgr.UIMgr.InGameUI.checkMissionAchieveTip();

            cc.Mgr.UIMgr.openAssetGetUI("crit", 300, "buff");

            let data = {}
            data.elapsed = cc.Mgr.Utils.getDate9(true)
            data.stage = cc.Mgr.game.level
            data.feature = "buff crit"
            cc.Mgr.analytics.logEvent("share_message", JSON.stringify(data));
        });
    },

    onClickGetCritByAd () {
        if (this.limitClick.clickTime() == false) {
            return
        }
        if (this.checkAvailabelAds === false) {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("ad-tip-3"), "", this.node);
            return;
        }
        var self = this;
        cc.Mgr.admob.showRewardedVideoAd((function(_state, _noFill) {
            if (_state === true) {
                cc.Mgr.UIMgr.openAssetGetUI("crit", 300, "buff");
                // cc.Mgr.game.critTimer += 30;
                // if(cc.Mgr.game.critTimer > 150) cc.Mgr.game.critTimer = 150;
                // self.refreshUI();
                // cc.Mgr.plantMgr.changePlantCritState(true);

                self.updateBtns(_noFill);
            }
        }), this.node, "crit", this);
    },

    onClickGetCritByGem () {
        if(cc.Mgr.game.critTimer >= 900)
        {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("max-crit-time-150"), "", this.node);
            return;
        }

        if(cc.Mgr.game.gems >= 3)
        {
            cc.Mgr.game.gems -= 3;
            cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "gem");
            let data = {};
            data.elapsed = cc.Mgr.Utils.getDate9(true);
            data.costGems = 3;
            // cc.Mgr.analytics.logEvent("crit_get_more_time", JSON.stringify(data));

            cc.Mgr.UIMgr.openAssetGetUI("crit", 300, "buff");
            // cc.Mgr.game.critTimer += 30;
            // if(cc.Mgr.game.critTimer > 150) cc.Mgr.game.critTimer = 150;
            // this.refreshUI();
            // cc.Mgr.plantMgr.changePlantCritState(true);
        }
        else {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("NoGems"), "gem", this.node);
            // cc.Mgr.game.needShowIAPCount++;
            // if (cc.Mgr.game.needShowIAPCount >= 1) {
            //     cc.Mgr.UIMgr.openPaymentUI(true);
            //     cc.Mgr.game.needShowIAPCount = 0;
            // }
            if (this.allowShow === true) {
                this.allowShow = false;
                setTimeout(() => {
                    cc.Mgr.UIMgr.openPaymentUI(true);
                    this.allowShow = true;
                }, 300);
            }
        }  
    },

    onClickGetIceByInvite () {
        if (this.limitClick.clickTime() == false) {
            return
        }

        let self = this;
        cc.Mgr.UIMgr.showLoading();
        cc.Mgr.Utils.getBase64Image("resources/tex/shareImage_2.png", (_data) => {

            cc.Mgr.game.updateMissionProgressById(MissionType.InviteCount);
            cc.Mgr.game.updateAchieveProgressByType(AchieveType.Invite);
            cc.Mgr.UIMgr.InGameUI.checkMissionAchieveTip();

            cc.Mgr.UIMgr.openAssetGetUI("freeze", 300, "buff");

            let data = {}
            data.elapsed = cc.Mgr.Utils.getDate9(true)
            data.stage = cc.Mgr.game.level
            data.feature = "buff freeze"
            cc.Mgr.analytics.logEvent("share_message", JSON.stringify(data));
        });
    },

    onClickGetIceByAd () {
        if (this.limitClick.clickTime() == false) {
            return
        }
        if (this.checkAvailabelAds === false) {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("ad-tip-3"), "", this.node);
            return;
        }
        var self = this;
        cc.Mgr.admob.showRewardedVideoAd((function(_state, _noFill) {
            if (_state === true) {
                cc.Mgr.UIMgr.openAssetGetUI("freeze", 300, "buff");
                // cc.Mgr.game.iceTimer += 30;
                // if(cc.Mgr.game.iceTimer > 150) cc.Mgr.game.iceTimer = 150;
                // self.refreshUI();
                // cc.Mgr.plantMgr.changePlantIceState(true);

                self.updateBtns(_noFill);
            }
        }), this.node, "freeze", this);
    },

    onClickGetIceByGem () {
        if(cc.Mgr.game.iceTimer >= 900)
        {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("max-freeze-time-150"), "", this.node);
            return;
        }

        if(cc.Mgr.game.gems >= 3)
        {
            cc.Mgr.game.gems -= 3;
            cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "gem");
            let data = {};
            data.elapsed = cc.Mgr.Utils.getDate9(true);
            data.costGems = 3;
            // cc.Mgr.analytics.logEvent("freeze_get_more_time", JSON.stringify(data));

            cc.Mgr.UIMgr.openAssetGetUI("freeze", 300, "buff");
            // cc.Mgr.game.iceTimer += 30;
            // if(cc.Mgr.game.iceTimer > 150) cc.Mgr.game.iceTimer = 150;
            // this.refreshUI();
            // cc.Mgr.plantMgr.changePlantIceState(true);
        }
        else {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("NoGems"), "gem", this.node);
            // cc.Mgr.game.needShowIAPCount++;
            // if (cc.Mgr.game.needShowIAPCount >= 1) {
            //     cc.Mgr.UIMgr.openPaymentUI(true);
            //     cc.Mgr.game.needShowIAPCount = 0;
            // }
            if (this.allowShow === true) {
                this.allowShow = false;
                setTimeout(() => {
                    cc.Mgr.UIMgr.openPaymentUI(true);
                    this.allowShow = true;
                }, 300);
            }
        }  
    },

    onClickGetFireByInvite () {
        if (this.limitClick.clickTime() == false) {
            return
        }

        let self = this;
        cc.Mgr.UIMgr.showLoading();
        cc.Mgr.Utils.getBase64Image("resources/tex/shareImage_2.png", (_data) => {

            cc.Mgr.game.updateMissionProgressById(MissionType.InviteCount);
            cc.Mgr.game.updateAchieveProgressByType(AchieveType.Invite);
            cc.Mgr.UIMgr.InGameUI.checkMissionAchieveTip();

            cc.Mgr.UIMgr.openAssetGetUI("flame", 300, "buff");

            let data = {}
            data.elapsed = cc.Mgr.Utils.getDate9(true)
            data.stage = cc.Mgr.game.level
            data.feature = "buff flame"
            cc.Mgr.analytics.logEvent("share_message", JSON.stringify(data));
        });
    },

    onClickGetFireByAd () {
        if (this.limitClick.clickTime() == false) {
            return
        }
        if (this.checkAvailabelAds === false) {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("ad-tip-3"), "", this.node);
            return;
        }
        var self = this;
        cc.Mgr.admob.showRewardedVideoAd((function(_state, _noFill) {
            if (_state === true) {
                cc.Mgr.UIMgr.openAssetGetUI("flame", 300, "buff");
                // cc.Mgr.game.fireTimer += 30;
                // if(cc.Mgr.game.fireTimer > 150) cc.Mgr.game.fireTimer = 150;
                // self.refreshUI();
                // cc.Mgr.plantMgr.changePlantFireState(true);

                self.updateBtns(_noFill);
            }
        }), this.node, "flame", this);
    },

    onClickGetFireByGem () {
        if(cc.Mgr.game.fireTimer >= 900)
        {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("max-flame-time-150"), "", this.node);
            return;
        }

        if(cc.Mgr.game.gems >= 3)
        {
            cc.Mgr.game.gems -= 3;
            cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "gem");
            let data = {};
            data.elapsed = cc.Mgr.Utils.getDate9(true);
            data.costGems = 3;
            // cc.Mgr.analytics.logEvent("flame_get_more_time", JSON.stringify(data));

            cc.Mgr.UIMgr.openAssetGetUI("flame", 300, "buff");
            // cc.Mgr.game.fireTimer += 30;
            // if(cc.Mgr.game.fireTimer > 150) cc.Mgr.game.fireTimer = 150;
            // this.refreshUI();
            // cc.Mgr.plantMgr.changePlantFireState(true);
        }
        else {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("NoGems"), "gem", this.node);
            // cc.Mgr.game.needShowIAPCount++;
            // if (cc.Mgr.game.needShowIAPCount >= 1) {
            //     cc.Mgr.UIMgr.openPaymentUI(true);
            //     cc.Mgr.game.needShowIAPCount = 0;
            // }
            if (this.allowShow === true) {
                this.allowShow = false;
                setTimeout(() => {
                    cc.Mgr.UIMgr.openPaymentUI(true);
                    this.allowShow = true;
                }, 300);
            }
        }  
    },

    onClickGetRageByInvite () {
        if (this.limitClick.clickTime() == false) {
            return
        }

        let self = this;
        cc.Mgr.UIMgr.showLoading();
        cc.Mgr.Utils.getBase64Image("resources/tex/shareImage_2.png", (_data) => {

            cc.Mgr.game.updateMissionProgressById(MissionType.InviteCount);
            cc.Mgr.game.updateAchieveProgressByType(AchieveType.Invite);
            cc.Mgr.UIMgr.InGameUI.checkMissionAchieveTip();

            cc.Mgr.UIMgr.openAssetGetUI("rage", 300, "buff");

            let data = {}
            data.elapsed = cc.Mgr.Utils.getDate9(true)
            data.stage = cc.Mgr.game.level
            data.feature = "buff rage"
            cc.Mgr.analytics.logEvent("share_message", JSON.stringify(data));
        });
    },

    onClickGetRageByAd () {
        if (this.limitClick.clickTime() == false) {
            return
        }
        if (this.checkAvailabelAds === false) {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("ad-tip-3"), "", this.node);
            return;
        }
        var self = this;
        cc.Mgr.admob.showRewardedVideoAd((function(_state, _noFill) {
            if (_state === true) {
                cc.Mgr.UIMgr.openAssetGetUI("rage", 300, "buff");
                // cc.Mgr.game.rageTimer += 30;
                // if(cc.Mgr.game.rageTimer > 150) cc.Mgr.game.rageTimer = 150;
                // self.refreshUI();
                // cc.Mgr.plantMgr.changePlantAngryState(true);

                self.updateBtns(_noFill);
            }
        }), this.node, "rage", this);
    },

    onClickGetRageByGem () {
        if(cc.Mgr.game.rageTimer >= 900)
        {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("max-angry-time-150"), "", this.node);
            return;
        }

        if(cc.Mgr.game.gems >= 3)
        {
            cc.Mgr.game.gems -= 3;
            cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "gem");
            let data = {};
            data.elapsed = cc.Mgr.Utils.getDate9(true);
            data.costGems = 3;
            // cc.Mgr.analytics.logEvent("angry_get_more_time", JSON.stringify(data));

            cc.Mgr.UIMgr.openAssetGetUI("rage", 300, "buff");
            // cc.Mgr.game.rageTimer += 30;
            // if(cc.Mgr.game.rageTimer > 150) cc.Mgr.game.rageTimer = 150;
            // this.refreshUI();
            // cc.Mgr.plantMgr.changePlantAngryState(true);
        }
        else {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("NoGems"), "gem", this.node);
            // cc.Mgr.game.needShowIAPCount++;
            // if (cc.Mgr.game.needShowIAPCount >= 1) {
            //     cc.Mgr.UIMgr.openPaymentUI(true);
            //     cc.Mgr.game.needShowIAPCount = 0;
            // }
            if (this.allowShow === true) {
                this.allowShow = false;
                setTimeout(() => {
                    cc.Mgr.UIMgr.openPaymentUI(true);
                    this.allowShow = true;
                }, 300);
            }
        }  
    },

    closeUI:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        cc.Mgr.admob.hideBanner("buff");
        let self = this
        cc.tween(this.blurBg).to(0.15, {opacity:0}).start();
        cc.tween(this.content).to(0.15, {opacity:0, scale: .5}).call(() => {
            self.node.active = false;
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount("buff");
    }

    // update (dt) {},
});
