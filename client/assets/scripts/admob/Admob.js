// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
var MissionType = require("MissionType");

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

  // onLoad () {},

  start () {
    this.bannerList = [];
    this.getInitTimer = 0;
    this.updateTimer = null;

    this.openRemoveAdCountList = [1, 3, 5, 8, 11, 14, 17];
    this.openRemoveAdCountList_interstitial = [1, 3, 5, 8, 11, 14, 17];

    this.hasShowPopup_banner = false;
    this.hasShowPopup_interstitial = false;
    this.adClicked = false;
  },

  getMessage (_message) {
    this.label.string = _message;
  },

  onLoad: function () {
    cc.Mgr.admob = this;
    this.isInit = false;
  },

  muteAds: function () {
    let volume = (cc.Mgr.AudioMgr.sfxVolume == 0 && cc.Mgr.AudioMgr.bgmVolume == 0) ? "0" : "1";
  },

  showAdsTool: function () {

  },

  checkAvailableRewardedAd () {
    return false;
  },

  showBanner: function (_from) {
    if (cc.Mgr.game.isVIP || !cc.Mgr.game.needShowBanner || cc.Mgr.game.removeAd) return;
    // cc.Mgr.UIMgr.showPrompt("showBanner: " + _from);
    let index = this.bannerList.indexOf(_from);
    if (index < 0) {
      this.bannerList.push(_from)
    } else {
      return;
    }

    console.log("this.bannerList.length :" + this.bannerList.length)
    if (this.bannerList.length > 1) return;

    cc.Mgr.game.banner_ct++;

    // let data = {}
    // data.elapsed = cc.Mgr.Utils.getDate9(true)
    // data.adsType = "banner"
    // data.feature = _from;
    // cc.Mgr.analytics.logEvent("ad_request", JSON.stringify(data));
  },

  hideBanner: function (_from) {
    if (_from === "all") {
      this.bannerList = [];
    } else {
      let index = this.bannerList.indexOf(_from);
      if (index >= 0) {
        this.bannerList.splice(index, 1);
      } else {
        return;
      }
    }

    console.log("this.bannerList.length :" + this.bannerList.length)
    if (this.bannerList.length > 0) return;
  },

  showInterstitial: function (_feature, _placement, _interstitialCallback, _isPreferential) {
    this.interstitialCallback = _interstitialCallback;
    // if (cc.Mgr.game.isVIP || !cc.Mgr.game.needShowInterstitial || cc.Mgr.game.removeAd || (_isPreferential === false && cc.Mgr.UIMgr.currentShowUICount > 0)) {
    //   if (this.interstitialCallback != null) {
    //     this.interstitialCallback();
    //     this.interstitialCallback = null;
    //   }
    //   return;
    // }

    _interstitialCallback && _interstitialCallback();
    this.interstitialCallback = null;

    this.interstitialFeature = _feature;
    let data = {}
    data.elapsed = cc.Mgr.Utils.getDate9(true)
    data.adsType = "interstitial"
    data.feature = _feature;
    cc.Mgr.analytics.logEvent("ad_request", JSON.stringify(data));

    cc.Mgr.game.Interstitial_ct++;
  },

  showRewardedVideoAd:function (_callback, _parent, _feature, _controller) {
    this.tipParent = _parent;
    this.controller = _controller;
    this.callback = _callback;

    let data = {}
    data.elapsed = cc.Mgr.Utils.getDate9(true)
    data.adsType = "rewarded"
    data.feature = _feature;
    cc.Mgr.analytics.logEvent("ad_request", JSON.stringify(data));
    cc.Mgr.analytics.logEvent("ad_did_viewed", JSON.stringify(data));
    cc.Mgr.analytics.logEvent("ad_did_dismiss", JSON.stringify(data));
    cc.Mgr.analytics.logEvent("no_ads", JSON.stringify(data));
    cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("ad-tip-3"), "", this.tipParent)
    cc.Mgr.UIMgr.showLoading();

    cc.Mgr.UIMgr.hideLoading();

    // get rewards
    this.getRewardFromVideo();

    // ad dismissed
    if (this.controller)this.controller.updateAdsBtnState();
    cc.Mgr.UIMgr.InGameUI.updateDoubleCoinBtn();
    this.closeAdHandler();
  },

  getRewardFromVideo(_noFill) {
    if (this.callback != null) {
      this.callback(true, _noFill);
      this.callback = null;
    }
    cc.Mgr.game.rewarded_ct++;

    cc.Mgr.game.updateMissionProgressById(MissionType.AdsShow);
  },

  closeAdHandler () {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      cc.Mgr.game.resumeGame();
      this.isPlayingAd = false;
  
      if (this.interstitialCallback != null) {
        this.interstitialCallback();
        this.interstitialCallback = null;
      }
    }, 100);
  },

  isNative () {
    return cc.sys.isBrowser === false || cc.sys.isBrowser === undefined
  },

  errorMessage (_code, _adSource) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      cc.Mgr.game.resumeGame();
      this.isPlayingAd = false;
      if (_code === 3) {
        return;
      }
      switch(_code) {
        case 1:
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("ad-tip"), "", this.tipParent)
          break;
        case 2:
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("ad-tip-2"), "", this.tipParent)
          break;
        case 4:
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("ad-tip-3"), "", this.tipParent)
            if (this.controller)this.controller.updateAdsBtnState();
          break;
      }

      // interstitial
      if (_code === 5) {
        if (this.interstitialCallback != null) {
          this.interstitialCallback();
          this.interstitialCallback = null;

          // let data = {};
          // data.elapsed = cc.Mgr.Utils.getDate9(true);
          // data.adsType = "interstitial";
          // data.feature = this.interstitialFeature;
          // data.adSource = _adSource || "none";
          // cc.Mgr.analytics.logEvent("ad_present_failed", JSON.stringify(data));
        }
      }
    }, 500);
  },

  preloadBanner () {

  },


  preloadInterstitial () {

  },

  preloadRewarded (_controller) {
    this.controller = _controller;
  },

  reportEvent (_key, _type, _feature, _adSource) {
    // if (_type === "interstitial" && (cc.Mgr.game.isVIP || !cc.Mgr.game.needShowInterstitial || cc.Mgr.game.removeAd)) return;
    // if (_type === "banner" && (cc.Mgr.game.isVIP || !cc.Mgr.game.needShowBanner || cc.Mgr.game.removeAd)) return;
    let data = {};
    data.elapsed = cc.Mgr.Utils.getDate9(true);
    data.adsType = _type;
    data.feature = _feature || "none";
    data.adSource = _adSource;
    cc.Mgr.analytics.logEvent(_key, JSON.stringify(data));
  },

  openRemoveAdBundle () {
    cc.Mgr.game.openRemoveAdCount++;
    let index = this.openRemoveAdCountList.indexOf(cc.Mgr.game.openRemoveAdCount);
    if (index >= 0 && cc.Mgr.game.isVIP === false && cc.Mgr.game.removeAd === false) {
      if (cc.Mgr.game.removeAdStartTimer === 0 || (cc.Mgr.game.removeAdStartTimer != 0 && (Date.now() - cc.Mgr.game.removeAdStartTimer) >= (24 * 3600 * 1000))) {
        cc.Mgr.game.removeAdStartTimer = Date.now();
      }
    }
  },

  openRemoveAdBundle_interstitial () {
    cc.Mgr.game.openRemoveAdCount_interstitial++;
    let index = this.openRemoveAdCountList_interstitial.indexOf(cc.Mgr.game.openRemoveAdCount_interstitial);
    if (index >= 0 && cc.Mgr.game.isVIP === false && cc.Mgr.game.removeAd === false) {
      if (cc.Mgr.game.removeAdStartTimer === 0 || (cc.Mgr.game.removeAdStartTimer != 0 && (Date.now() - cc.Mgr.game.removeAdStartTimer) >= (24 * 3600 * 1000))) {
        cc.Mgr.game.removeAdStartTimer = Date.now();
      }
    }

    if (this.hasShowPopup_interstitial === false) {
      // cc.Mgr.UIMgr.openRemoveAdBundle();

      this.hasShowPopup_interstitial = true;
    }
  },

  onClickBanner () {
    this.adClicked = true;
  },

  update () {

  }
})
