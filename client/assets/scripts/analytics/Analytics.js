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
        cc.Mgr.analytics = this;
    },

    start () {

    },

    getUserProperties () {
        this.userProperties = {};
        let uuid = cc.Mgr.Config.isTelegram ? window.webapp.initDataUnsafe.user.id : "Local";
        this.userProperties.uuid = uuid;

        this.userProperties.internal_version = cc.Mgr.Config.version;
        this.userProperties.is_subscribed = false;

        this.userProperties.platform = cc.Mgr.Config.platform;
        this.userProperties.session_ct = "" + cc.Mgr.game.session_ct;
        this.userProperties.ltv = "" + cc.Mgr.game.ltv;

        let interstitialState;
        if (cc.Mgr.game.removeAd === false && cc.Mgr.game.isVIP === false) {
            if (cc.Mgr.game.needShowInterstitial) interstitialState= "active";
            else interstitialState = "inactive";
        } else {
            interstitialState = "removed";
        }

        let bannerState;
        if (cc.Mgr.game.removeAd === false && cc.Mgr.game.isVIP === false) {
            if (cc.Mgr.game.needShowBanner) bannerState = "active";
            else bannerState = "inactive";
        } else {
            bannerState = "removed";
        }

        this.userProperties.interstitial = "" + interstitialState;
        this.userProperties.banner = "" + bannerState;
        this.userProperties.offlineDouble = (cc.Mgr.game.offlineDouble === false && cc.Mgr.game.isVIP === false) ? "inactive" : "active";
        this.userProperties.vip = "" + cc.Mgr.game.vip;
        this.userProperties.days_inactive = "" + cc.Mgr.game.days_inactive;
        this.userProperties.days_installed = "" + cc.Mgr.game.days_installed;
        this.userProperties.days_engaged = "" + cc.Mgr.game.days_engaged;
        this.userProperties.first_date = "" + cc.Mgr.Utils.dateFormat("YYYY-mm-dd", cc.Mgr.game.firstTime);
        this.userProperties.first_version = "" + cc.Mgr.game.first_version;
        this.userProperties.first_internal_version = "" + cc.Mgr.game.first_internal_version;
        this.userProperties.rewarded_ct = "" + cc.Mgr.game.rewarded_ct;
        this.userProperties.Interstitial_ct = "" + cc.Mgr.game.Interstitial_ct;
        this.userProperties.banner_ct = "" + cc.Mgr.game.banner_ct;
        this.userProperties.stage = "" + cc.Mgr.game.level;
        this.userProperties.wave = "" + cc.Mgr.game.curBoshu;
        this.userProperties.coin_owns = "" + cc.Mgr.game.money;
        this.userProperties.coin_gained_total = "" + cc.Mgr.game.coin_gained_total.toString();
        this.userProperties.gem_owns = "" + cc.Mgr.game.gems;
        this.userProperties.gem_gained_total = "" + cc.Mgr.game.gem_gained_total;
        this.userProperties.guardian_max_level = "" + cc.Mgr.game.plantMaxLv;

        let result = [];
        for (let i = 0; i < cc.Mgr.game.plantsPK.length - 1; i++) {
            let plant = cc.Mgr.game.plantsPK[i];
            if (plant.type === MyEnum.GridState.none) {
                result.push("empty");
            } else if (plant.type === MyEnum.GridState.lock) {
                result.push("locked");
            } else {
                result.push(plant.level);
            }
        }
        this.userProperties.grid1_grid12 = result.join(",");
        if (cc.Mgr.game.plantsPK && cc.Mgr.game.plantsPK.length > 0) {
            if (cc.Mgr.game.plantsPK[12].type === MyEnum.GridState.vip) {
                this.userProperties.fort = "locked";
            } else if (cc.Mgr.game.plantsPK[12].type === MyEnum.GridState.vipLock) {
                this.userProperties.fort = "arrow";
            } else if (cc.Mgr.game.plantsPK[12].type === MyEnum.GridState.none) {
                this.userProperties.fort = "empty";
            } else {
                this.userProperties.fort = cc.Mgr.game.plantsPK[12].level;
            }
        }

        this.userProperties.timestamp = cc.Mgr.Utils.getDate9(true);
        this.userProperties.session_elapsed = "" + (cc.Mgr.Utils.GetSysTime() - cc.Mgr.game.firstTime);

        return this.userProperties;
    },

    logEvent (_key, _content) {

    }

    // update (dt) {},
});
