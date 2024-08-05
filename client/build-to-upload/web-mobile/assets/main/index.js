window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
        o = b;
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  AchieveData: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a8a7aKgOlVI1oOE567Pk3AI", "AchieveData");
    "use strict";
    var AchieveData = cc.Class({
      name: "AchieveData",
      properties: {
        id: 1,
        Level: 1,
        Gain_5: 0,
        Gain_20: 0,
        Gain_50: 0,
        Gain_100: 0,
        Gain_200: 0
      }
    });
    module.exports = AchieveData;
    cc._RF.pop();
  }, {} ],
  AchieveMapMgr: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "19f1629F69CfIBGOTUhomAH", "AchieveMapMgr");
    "use strict";
    var AcMap = require("DB_achievementAwards");
    var AcData = require("AchieveData");
    var AchievenMapMgr = cc.Class({
      extends: cc.Component,
      properties: {
        dataList: {
          default: [],
          type: [ AcData ]
        }
      },
      DecodeJson: function DecodeJson() {
        var jsonAsset = JSON.parse(AcMap.data);
        for (var key in jsonAsset) {
          var dt = new AcData();
          dt.id = jsonAsset[key][0];
          dt.Level = jsonAsset[key][1];
          dt.Gain_5 = jsonAsset[key][2];
          dt.Gain_20 = jsonAsset[key][3];
          dt.Gain_50 = jsonAsset[key][4];
          dt.Gain_100 = jsonAsset[key][5];
          dt.Gain_200 = jsonAsset[key][6];
          this.dataList[key] = dt;
        }
      },
      getDataByKey: function getDataByKey(Id) {
        return this.dataList[Id];
      }
    });
    module.exports = AchievenMapMgr;
    cc._RF.pop();
  }, {
    AchieveData: "AchieveData",
    DB_achievementAwards: "DB_achievementAwards"
  } ],
  AchieveType: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9e2358pwV1O1LSocw2oGXPt", "AchieveType");
    "use strict";
    var AchieveType = cc.Enum({
      Plant: 0,
      Invite: 1
    });
    module.exports = AchieveType;
    cc._RF.pop();
  }, {} ],
  Admob: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1d44enYXAhByqzHu8tVjZbm", "Admob");
    "use strict";
    var MissionType = require("MissionType");
    cc.Class({
      extends: cc.Component,
      properties: {},
      start: function start() {
        this.bannerList = [];
        this.getInitTimer = 0;
        this.updateTimer = null;
        this.openRemoveAdCountList = [ 1, 3, 5, 8, 11, 14, 17 ];
        this.openRemoveAdCountList_interstitial = [ 1, 3, 5, 8, 11, 14, 17 ];
        this.hasShowPopup_banner = false;
        this.hasShowPopup_interstitial = false;
        this.adClicked = false;
      },
      getMessage: function getMessage(_message) {
        this.label.string = _message;
      },
      onLoad: function onLoad() {
        cc.Mgr.admob = this;
        this.isInit = false;
      },
      muteAds: function muteAds() {
        var volume = 0 == cc.Mgr.AudioMgr.sfxVolume && 0 == cc.Mgr.AudioMgr.bgmVolume ? "0" : "1";
      },
      showAdsTool: function showAdsTool() {},
      checkAvailableRewardedAd: function checkAvailableRewardedAd() {
        return false;
      },
      showBanner: function showBanner(_from) {
        if (cc.Mgr.game.isVIP || !cc.Mgr.game.needShowBanner || cc.Mgr.game.removeAd) return;
        var index = this.bannerList.indexOf(_from);
        if (!(index < 0)) return;
        this.bannerList.push(_from);
        console.log("this.bannerList.length :" + this.bannerList.length);
        if (this.bannerList.length > 1) return;
        cc.Mgr.game.banner_ct++;
      },
      hideBanner: function hideBanner(_from) {
        if ("all" === _from) this.bannerList = []; else {
          var index = this.bannerList.indexOf(_from);
          if (!(index >= 0)) return;
          this.bannerList.splice(index, 1);
        }
        console.log("this.bannerList.length :" + this.bannerList.length);
        if (this.bannerList.length > 0) return;
      },
      showInterstitial: function showInterstitial(_feature, _placement, _interstitialCallback, _isPreferential) {
        this.interstitialCallback = _interstitialCallback;
        _interstitialCallback && _interstitialCallback();
        this.interstitialCallback = null;
        this.interstitialFeature = _feature;
        var data = {};
        data.elapsed = cc.Mgr.Utils.getDate9(true);
        data.adsType = "interstitial";
        data.feature = _feature;
        cc.Mgr.analytics.logEvent("ad_request", JSON.stringify(data));
        cc.Mgr.game.Interstitial_ct++;
      },
      showRewardedVideoAd: function showRewardedVideoAd(_callback, _parent, _feature, _controller) {
        this.tipParent = _parent;
        this.controller = _controller;
        this.callback = _callback;
        var data = {};
        data.elapsed = cc.Mgr.Utils.getDate9(true);
        data.adsType = "rewarded";
        data.feature = _feature;
        cc.Mgr.analytics.logEvent("ad_request", JSON.stringify(data));
        cc.Mgr.analytics.logEvent("ad_did_viewed", JSON.stringify(data));
        cc.Mgr.analytics.logEvent("ad_did_dismiss", JSON.stringify(data));
        cc.Mgr.analytics.logEvent("no_ads", JSON.stringify(data));
        cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("ad-tip-3"), "", this.tipParent);
        cc.Mgr.UIMgr.showLoading();
        cc.Mgr.UIMgr.hideLoading();
        this.getRewardFromVideo();
        this.controller && this.controller.updateAdsBtnState();
        cc.Mgr.UIMgr.InGameUI.updateDoubleCoinBtn();
        this.closeAdHandler();
      },
      getRewardFromVideo: function getRewardFromVideo(_noFill) {
        if (null != this.callback) {
          this.callback(true, _noFill);
          this.callback = null;
        }
        cc.Mgr.game.rewarded_ct++;
        cc.Mgr.game.updateMissionProgressById(MissionType.AdsShow);
      },
      closeAdHandler: function closeAdHandler() {
        var _this = this;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(function() {
          cc.Mgr.game.resumeGame();
          _this.isPlayingAd = false;
          if (null != _this.interstitialCallback) {
            _this.interstitialCallback();
            _this.interstitialCallback = null;
          }
        }, 100);
      },
      isNative: function isNative() {
        return false === cc.sys.isBrowser || void 0 === cc.sys.isBrowser;
      },
      errorMessage: function errorMessage(_code, _adSource) {
        var _this2 = this;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(function() {
          cc.Mgr.game.resumeGame();
          _this2.isPlayingAd = false;
          if (3 === _code) return;
          switch (_code) {
           case 1:
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("ad-tip"), "", _this2.tipParent);
            break;

           case 2:
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("ad-tip-2"), "", _this2.tipParent);
            break;

           case 4:
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("ad-tip-3"), "", _this2.tipParent);
            _this2.controller && _this2.controller.updateAdsBtnState();
          }
          if (5 === _code && null != _this2.interstitialCallback) {
            _this2.interstitialCallback();
            _this2.interstitialCallback = null;
          }
        }, 500);
      },
      preloadBanner: function preloadBanner() {},
      preloadInterstitial: function preloadInterstitial() {},
      preloadRewarded: function preloadRewarded(_controller) {
        this.controller = _controller;
      },
      reportEvent: function reportEvent(_key, _type, _feature, _adSource) {
        var data = {};
        data.elapsed = cc.Mgr.Utils.getDate9(true);
        data.adsType = _type;
        data.feature = _feature || "none";
        data.adSource = _adSource;
        cc.Mgr.analytics.logEvent(_key, JSON.stringify(data));
      },
      openRemoveAdBundle: function openRemoveAdBundle() {
        cc.Mgr.game.openRemoveAdCount++;
        var index = this.openRemoveAdCountList.indexOf(cc.Mgr.game.openRemoveAdCount);
        index >= 0 && false === cc.Mgr.game.isVIP && false === cc.Mgr.game.removeAd && (0 === cc.Mgr.game.removeAdStartTimer || 0 != cc.Mgr.game.removeAdStartTimer && Date.now() - cc.Mgr.game.removeAdStartTimer >= 864e5) && (cc.Mgr.game.removeAdStartTimer = Date.now());
      },
      openRemoveAdBundle_interstitial: function openRemoveAdBundle_interstitial() {
        cc.Mgr.game.openRemoveAdCount_interstitial++;
        var index = this.openRemoveAdCountList_interstitial.indexOf(cc.Mgr.game.openRemoveAdCount_interstitial);
        index >= 0 && false === cc.Mgr.game.isVIP && false === cc.Mgr.game.removeAd && (0 === cc.Mgr.game.removeAdStartTimer || 0 != cc.Mgr.game.removeAdStartTimer && Date.now() - cc.Mgr.game.removeAdStartTimer >= 864e5) && (cc.Mgr.game.removeAdStartTimer = Date.now());
        false === this.hasShowPopup_interstitial && (this.hasShowPopup_interstitial = true);
      },
      onClickBanner: function onClickBanner() {
        this.adClicked = true;
      },
      update: function update() {}
    });
    cc._RF.pop();
  }, {
    MissionType: "MissionType"
  } ],
  AdsBlocker: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b33a5ndHXxABJEIpoG4HbsD", "AdsBlocker");
    "use strict";
    var adsBlocker = cc.Class({
      extends: cc.Component,
      properties: {
        content: cc.Node,
        closeBtn: cc.Node,
        timeLabel: cc.Label,
        bg_list: [ cc.Node ]
      },
      ctor: function ctor() {
        this.bgIndex = 0;
      },
      start: function start() {
        cc.Mgr.UIMgr.adsBlocker = this;
        this.limitClick = this.node.getComponent("LimitClick");
      },
      showUI: function showUI(_callback) {
        this.node.width = cc.Mgr.Config.winSize.width;
        this.node.height = cc.Mgr.Config.winSize.height;
        this.callback = _callback;
        for (var i = 0; i < this.bg_list.length; i++) {
          var bg = this.bg_list[i];
          bg.active = i == this.bgIndex;
        }
        this.bgIndex++;
        this.bgIndex >= this.bg_list.length && (this.bgIndex = 0);
        this.closeBtn.active = false;
        this.timerCount = 20;
        this.timeLabel.string = "" + this.timerCount;
        this.timer = Date.now();
        this.content.opacity = 0;
        this.content.setScale(.5);
        cc.tween(this.content).to(.15, {
          opacity: 255,
          scale: 1
        }).start();
      },
      update: function update(_dt) {
        if (this.timerCount < 0) return;
        if (Date.now() - this.timer >= 1e3) {
          this.timer = Date.now();
          this.timerCount--;
          if (this.timerCount < 0) {
            this.timerCount = "";
            this.closeBtn.active = true;
          }
          this.timeLabel.string = "" + this.timerCount;
        }
      },
      closeUI: function closeUI() {
        cc.Mgr.AudioMgr.playSFX("click");
        var self = this;
        cc.tween(this.content).to(.15, {
          opacity: 0,
          scale: .5
        }).call(function() {
          self.node.active = false;
          self.callback && self.callback();
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount();
      }
    });
    module.exports = adsBlocker;
    cc._RF.pop();
  }, {} ],
  AirDropData: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b4232JqGKZD8ZAPp+5heYbz", "AirDropData");
    "use strict";
    var AirDropData = cc.Class({
      extends: cc.Component,
      properties: {
        Level: 1,
        Plant1: 0,
        Plant2: 0
      }
    });
    module.exports = AirDropData;
    cc._RF.pop();
  }, {} ],
  AirDropMapMgr: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1b99bN5SlxPNIIdcREK/DKV", "AirDropMapMgr");
    "use strict";
    var airdropMap = require("DB_airdrop");
    var AirDropData = require("AirDropData");
    var AirDropMapMgr = cc.Class({
      extends: cc.Component,
      properties: {
        dataList: {
          default: [],
          type: [ AirDropData ]
        }
      },
      DecodeJson: function DecodeJson() {
        var jsonAsset = JSON.parse(airdropMap.data);
        for (var key in jsonAsset) {
          var dt = new AirDropData();
          dt.Level = jsonAsset[key][0];
          dt.Plant1 = jsonAsset[key][1];
          dt.Plant2 = jsonAsset[key][2];
          this.dataList[key] = dt;
        }
      },
      getDataByKey: function getDataByKey(lv) {
        return this.dataList[lv];
      }
    });
    module.exports = AirDropMapMgr;
    cc._RF.pop();
  }, {
    AirDropData: "AirDropData",
    DB_airdrop: "DB_airdrop"
  } ],
  Analytics: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "bc108y62TVKUJpDw6OLT8M1", "Analytics");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        cc.Mgr.analytics = this;
      },
      start: function start() {},
      getUserProperties: function getUserProperties() {
        this.userProperties = {};
        var uuid = cc.Mgr.Config.isTelegram ? window.Telegram.WebApp.initDataUnsafe.user.id : "Local";
        this.userProperties.uuid = uuid;
        this.userProperties.internal_version = cc.Mgr.Config.version;
        this.userProperties.is_subscribed = false;
        this.userProperties.platform = cc.Mgr.Config.platform;
        this.userProperties.session_ct = "" + cc.Mgr.game.session_ct;
        this.userProperties.ltv = "" + cc.Mgr.game.ltv;
        var interstitialState;
        interstitialState = false === cc.Mgr.game.removeAd && false === cc.Mgr.game.isVIP ? cc.Mgr.game.needShowInterstitial ? "active" : "inactive" : "removed";
        var bannerState;
        bannerState = false === cc.Mgr.game.removeAd && false === cc.Mgr.game.isVIP ? cc.Mgr.game.needShowBanner ? "active" : "inactive" : "removed";
        this.userProperties.interstitial = "" + interstitialState;
        this.userProperties.banner = "" + bannerState;
        this.userProperties.offlineDouble = false === cc.Mgr.game.offlineDouble && false === cc.Mgr.game.isVIP ? "inactive" : "active";
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
        var result = [];
        for (var i = 0; i < cc.Mgr.game.plantsPK.length - 1; i++) {
          var plant = cc.Mgr.game.plantsPK[i];
          plant.type === MyEnum.GridState.none ? result.push("empty") : plant.type === MyEnum.GridState.lock ? result.push("locked") : result.push(plant.level);
        }
        this.userProperties.grid1_grid12 = result.join(",");
        cc.Mgr.game.plantsPK && cc.Mgr.game.plantsPK.length > 0 && (cc.Mgr.game.plantsPK[12].type === MyEnum.GridState.vip ? this.userProperties.fort = "locked" : cc.Mgr.game.plantsPK[12].type === MyEnum.GridState.vipLock ? this.userProperties.fort = "arrow" : cc.Mgr.game.plantsPK[12].type === MyEnum.GridState.none ? this.userProperties.fort = "empty" : this.userProperties.fort = cc.Mgr.game.plantsPK[12].level);
        this.userProperties.timestamp = cc.Mgr.Utils.getDate9(true);
        this.userProperties.session_elapsed = "" + (cc.Mgr.Utils.GetSysTime() - cc.Mgr.game.firstTime);
        return this.userProperties;
      },
      logEvent: function logEvent(_key, _content) {}
    });
    cc._RF.pop();
  }, {} ],
  AppStart: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "294db5kmhVNM6K0TAEwEyUS", "AppStart");
    "use strict";
    cc.director.initMgr = false;
    function initMgr() {
      var isDevelop = true;
      if (!isDevelop) {
        console.log = function() {};
        console.error = function() {};
        cc.log = function() {};
        cc.error = function() {};
      }
      cc.Mgr.Parse = false;
      cc.Mgr.preLoadingScene = false;
      cc.Mgr.initData = false;
      cc.Mgr.Event = require("Event");
      cc.Mgr.Utils = require("Utils");
      cc.Mgr.Utils.init();
      cc.Mgr.Config = require("Config");
      cc.Mgr.Config.init();
      var HttpUtils = require("HttpUtils");
      cc.Mgr.http = new HttpUtils();
      var MapDataMgr = require("MapDataMgr");
      cc.Mgr.MapDataMgr = new MapDataMgr();
      var game = require("game");
      cc.Mgr.game = game.getInstance();
      var UserDataMgr = require("UserDataMgr");
      cc.Mgr.UserDataMgr = new UserDataMgr();
      cc.Mgr.DragonMgr = require("DragonMgr");
      var AtlasMgr = require("AtlasMgr");
      cc.Mgr.AtlasMgr = new AtlasMgr();
      cc.Mgr.AtlasMgr.init();
      var BulletPool = require("BulletPool");
      cc.Mgr.BulletPool = new BulletPool();
      cc.Mgr.BulletPool.InitPool();
      cc.Mgr.UIItemMgr = require("uiItemMgr");
      cc.Mgr.UIItemMgr.loadItemsPre();
      var EffectMgr = require("EffectMgr");
      cc.Mgr.EffectMgr = new EffectMgr();
      cc.Mgr.EffectMgr.InitPool();
      var plantManage = require("plantManage");
      cc.Mgr.plantMgr = plantManage.instance;
      var flowerPotManage = require("flowerPotManage");
      cc.Mgr.flowerPotMgr = flowerPotManage.instance;
      var uiMgr = require("UIMgr");
      cc.Mgr.UIMgr = uiMgr.instance;
    }
    cc.Class({
      extends: cc.Component,
      properties: {
        container: cc.Node
      },
      onLoad: function onLoad() {
        cc.director.GlobalEvent.clear();
        cc.Mgr = {};
        window.onChangeScreen = this.onChangeScreenCallback.bind(this);
        window.onResizeScreen = this.onResizeScreenCallback.bind(this);
        cc.game.setFrameRate(55);
      },
      onChangeScreenCallback: function onChangeScreenCallback() {
        cc.Mgr.AudioMgr.stopAll();
        cc.game.restart();
        window.onChangeScreen = null;
      },
      onResizeScreenCallback: function onResizeScreenCallback() {
        cc.Mgr.AudioMgr.stopAll();
        cc.game.restart();
        window.onResizeScreen = null;
      },
      start: function start() {
        cc.Mgr.app = this;
        initMgr();
        this.canvas = this.node.getComponent(cc.Canvas);
        var size = cc.view.getVisibleSizeInPixel();
        var ratio = size.width / size.height;
        cc.log("ratio: " + ratio);
        cc.Mgr.game.ratioOffsetY = 0;
        if (ratio > .6) {
          cc.Mgr.game.isPad = true;
          cc.Mgr.game.ratioOffsetX = 640 * (ratio - .6);
        } else {
          ratio < .56 && (cc.Mgr.game.ratioOffsetY = 1136 * (.56 - ratio));
          cc.Mgr.game.isPad = false;
        }
      }
    });
    cc._RF.pop();
  }, {
    AtlasMgr: "AtlasMgr",
    BulletPool: "BulletPool",
    Config: "Config",
    DragonMgr: "DragonMgr",
    EffectMgr: "EffectMgr",
    Event: "Event",
    HttpUtils: "HttpUtils",
    MapDataMgr: "MapDataMgr",
    UIMgr: "UIMgr",
    UserDataMgr: "UserDataMgr",
    Utils: "Utils",
    flowerPotManage: "flowerPotManage",
    game: "game",
    plantManage: "plantManage",
    uiItemMgr: "uiItemMgr"
  } ],
  AtlasMgr: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5d779T4kYVAi6VYgdDU9irp", "AtlasMgr");
    "use strict";
    var AtlasType = require("AtlasType");
    var AtlasMgr = cc.Class({
      extends: cc.Component,
      properties: {
        gameAtlas: cc.SpriteAtlas,
        plantHeadAtlas: cc.SpriteAtlas
      },
      init: function init() {
        var self = this;
        cc.loader.loadRes("atlas/plantHead", cc.SpriteAtlas, function(err, atlas) {
          if (err) {
            cc.error(err.message || err);
            return;
          }
          self.plantHeadAtlas = atlas;
        });
      },
      getSpriteFrame: function getSpriteFrame(type, spName) {
        var data = null;
        switch (type) {
         case AtlasType.PlantHead:
          data = this.plantHeadAtlas.getSpriteFrame(spName);
        }
        return data;
      },
      getSpriteAtlas: function getSpriteAtlas(type) {
        var data = null;
        switch (type) {
         case AtlasType.PlantHead:
          data = this.plantHeadAtlas;
        }
        return data;
      }
    });
    module.exports = AtlasMgr;
    cc._RF.pop();
  }, {
    AtlasType: "AtlasType"
  } ],
  AtlasType: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d49ecQ28VdASK8ivL2OcTfA", "AtlasType");
    "use strict";
    var AtlasType = cc.Enum({
      PlantHead: 3,
      SmallHead: 4
    });
    module.exports = AtlasType;
    cc._RF.pop();
  }, {} ],
  AudioMgr: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c45cbALFTRJhZChw3h3yR9+", "AudioMgr");
    "use strict";
    var AudioMgr = cc.Class({
      extends: cc.Component,
      properties: {
        bgmVolume: 1,
        sfxVolume: 1,
        bgmAudioID: -1,
        soundAudioID: -1,
        musicState: 1,
        uavAudioId: -1,
        blockBGM: 0,
        blockSFX: 0
      },
      start: function start() {
        cc.Mgr.AudioMgr = this;
        cc.Mgr.admob.muteAds();
        this.cacheDict = {};
      },
      getUrl: function getUrl(url) {
        return cc.url.raw("resources/sound/" + url + ".mp3");
      },
      playBGM: function playBGM(url) {
        this.bgmAudioID >= 0 && cc.audioEngine.stop(this.bgmAudioID);
        var self = this;
        this.cacheDict[url] ? self.bgmAudioID = cc.audioEngine.play(this.cacheDict[url], true, this.bgmVolume) : cc.loader.loadRes("sound/" + url, cc.AudioClip, function(err, audioClip) {
          if (err) {
            cc.error(err.message || err);
            return;
          }
          self.bgmAudioID = cc.audioEngine.play(audioClip, true, self.bgmVolume);
          self.cacheDict[url] = audioClip;
        });
      },
      playSFX: function playSFX(url) {
        if (0 === this.sfxVolume || this.isPause) return;
        var self = this;
        this.cacheDict[url] ? cc.audioEngine.play(this.cacheDict[url], false, this.sfxVolume) : cc.loader.loadRes("sound/" + url, cc.AudioClip, function(err, audioClip) {
          if (err) {
            cc.error(err.message || err);
            return;
          }
          cc.audioEngine.play(audioClip, false, self.sfxVolume);
          self.cacheDict[url] = audioClip;
        });
      },
      playUavSFX: function playUavSFX(url) {
        if (0 === this.sfxVolume || this.isPause) return;
        var self = this;
        this.cacheDict[url] ? this.uavAudioId = cc.audioEngine.play(this.cacheDict[url], true, .5 * this.sfxVolume) : cc.loader.loadRes("sound/" + url, cc.AudioClip, function(err, audioClip) {
          if (err) {
            cc.error(err.message || err);
            return;
          }
          self.uavAudioId = cc.audioEngine.play(audioClip, true, .5 * self.sfxVolume);
          self.cacheDict[url] = audioClip;
        });
      },
      stopUavSFX: function stopUavSFX() {
        if (-1 == this.uavAudioId) return;
        cc.audioEngine.stop(this.uavAudioId);
        this.uavAudioId = -1;
      },
      setSFXVolume: function setSFXVolume(v) {
        this.sfxVolume = v;
        cc.audioEngine.setVolume(this.uavAudioId, v);
        var VolumeData = {};
        VolumeData.bgmVolume = this.bgmVolume;
        VolumeData.sfxVolume = v;
        cc.Mgr.admob.muteAds();
      },
      setBGMVolume: function setBGMVolume(v) {
        cc.audioEngine.setVolume(this.bgmAudioID, v);
        this.bgmVolume = v;
        var VolumeData = {};
        VolumeData.bgmVolume = v;
        VolumeData.sfxVolume = this.sfxVolume;
        cc.Mgr.admob.muteAds();
      },
      stopAll: function stopAll() {
        cc.audioEngine.stopAll();
      },
      pauseAll: function pauseAll() {
        this.isPause = true;
        cc.audioEngine.pauseAll();
      },
      resumeAll: function resumeAll() {
        this.isPause = false;
        cc.audioEngine.resumeAll();
      }
    });
    cc._RF.pop();
  }, {} ],
  BlurMask: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f351aoLeYRFMJ0SkjRFg/yo", "BlurMask");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BlurMask = function(_super) {
      __extends(BlurMask, _super);
      function BlurMask() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.camera = null;
        _this.texture = null;
        _this.spriteFrame = null;
        _this.sprite = null;
        _this._lastSize = new cc.Size(0, 0);
        _this._cullingMask = 268435456;
        _this.material = null;
        _this.ignoredNodes = [];
        _this.bightness = .5;
        _this.blurAmount = .5;
        return _this;
      }
      BlurMask.prototype.start = function() {
        var _this = this;
        this.node.scaleY = -1;
        this.texture = new cc.RenderTexture();
        this.texture.initWithSize(this.node.width, this.node.height, cc.game["_renderContext"]["STENCIL_INDEX8"]);
        this.camera = this.node.addComponent(cc.Camera);
        this.camera.cullingMask = 4294967295 ^ this._cullingMask;
        this.camera.targetTexture = this.texture;
        this.camera.enabled = false;
        this.cull(this.node);
        this.ignoredNodes.map(function(node) {
          return _this.cull(node);
        });
        this.spriteFrame = new cc.SpriteFrame();
        this.sprite = this.node.addComponent(cc.Sprite);
        this.sprite.spriteFrame = this.spriteFrame;
        this.material["_props"]["bightness"] = this.bightness;
        this.material["_props"]["blurAmount"] = this.blurAmount;
        this.sprite["_materials"][0] = this.material;
      };
      BlurMask.prototype.snapshot = function() {
        var size = this.node.getContentSize();
        if (size.width !== this._lastSize.width || size.height !== this._lastSize.height) {
          this.texture.initWithSize(this.node.width, this.node.height, cc.game["_renderContext"]["STENCIL_INDEX8"]);
          this.camera.targetTexture = this.texture;
        }
        this._lastSize.width = size.width;
        this._lastSize.height = size.height;
        this.camera.render(cc.Canvas.instance.node);
        this.spriteFrame.setTexture(this.texture);
      };
      BlurMask.prototype.update = function(dt) {
        this.snapshot();
      };
      BlurMask.prototype.cull = function(node) {
        var _this = this;
        if (node) {
          node["_cullingMask"] = this._cullingMask;
          node.childrenCount > 0 && node.children.map(function(child) {
            return _this.cull(child);
          });
        }
      };
      __decorate([ property({
        type: cc.Material,
        displayName: "\u6a21\u7cca\u6750\u8d28",
        tooltip: "\u7528\u4e8e\u5e94\u7528\u6a21\u7cca\u6240\u7528\u7684\u6750\u8d28\uff0c\u5982\u65e0\u7279\u6b8a\u9700\u6c42\u8bf7\u4fdd\u6301\u9ed8\u8ba4"
      }) ], BlurMask.prototype, "material", void 0);
      __decorate([ property({
        type: [ cc.Node ],
        displayName: "\u5ffd\u7565\u8282\u70b9\u5217\u8868",
        tooltip: "\u5728\u6b64\u5217\u8868\u5185\u7684\u8282\u70b9\u5c06\u4e0d\u4f1a\u88ab\u6a21\u7cca\u906e\u7f69\u6e32\u67d3"
      }) ], BlurMask.prototype, "ignoredNodes", void 0);
      __decorate([ property({
        type: cc.Float,
        displayName: "\u4eae\u5ea6",
        tooltip: "\u964d\u4f4e\u80cc\u666f\u7684\u4eae\u5ea6",
        min: 0,
        max: 1
      }) ], BlurMask.prototype, "bightness", void 0);
      __decorate([ property({
        type: cc.Float,
        displayName: "\u6a21\u7cca\u5ea6",
        tooltip: "\u80cc\u666f\u7684\u6a21\u7cca\u7a0b\u5ea6",
        min: 0,
        max: 1
      }) ], BlurMask.prototype, "blurAmount", void 0);
      BlurMask = __decorate([ ccclass ], BlurMask);
      return BlurMask;
    }(cc.Component);
    exports.default = BlurMask;
    cc._RF.pop();
  }, {} ],
  BuffUI: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0985aKurvRDKIBT9YMJgW/F", "BuffUI");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        content: cc.Node,
        blurBg: cc.Node,
        auto_title: cc.Label,
        rage_title: cc.Label,
        fire_title: cc.Label,
        ice_titile: cc.Label,
        crit_title: cc.Label,
        getBtnLabelList: [ cc.Label ],
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
      start: function start() {
        this.auto_title.string = cc.Mgr.Utils.getTranslation("buff-auto");
        this.rage_title.string = cc.Mgr.Utils.getTranslation("buff-rage");
        this.fire_title.string = cc.Mgr.Utils.getTranslation("buff-flame");
        this.ice_titile.string = cc.Mgr.Utils.getTranslation("buff-freeze");
        this.crit_title.string = cc.Mgr.Utils.getTranslation("buff-crit");
        for (var i = 0; i < this.getBtnLabelList.length; i++) this.getBtnLabelList[i].string = cc.Mgr.Utils.getTranslation("btn-get");
        this.title.active = false;
        this.title_zh.active = false;
        this.title_ja.active = false;
        this.title_ru.active = false;
        "Japanese" === cc.Mgr.Config.language ? this.title_ja.active = true : "Simplified Chinese" === cc.Mgr.Config.language || "Traditional Chinese" === cc.Mgr.Config.language ? this.title_zh.active = true : "Russian" === cc.Mgr.Config.language ? this.title_ru.active = true : this.title.active = true;
        this.limitClick = this.node.getComponent("LimitClick");
        this.allowShow = true;
      },
      showUI: function showUI() {
        this.blurBg.opacity = 0;
        this.content.opacity = 0;
        this.content.setScale(.5);
        cc.tween(this.blurBg).to(.05, {
          opacity: 255
        }).call().start();
        cc.tween(this.content).to(.15, {
          opacity: 255,
          scale: 1
        }).start();
        this.checkAvailabelAds = cc.Mgr.admob.checkAvailableRewardedAd();
        this.checkAvailabelAds ? this.rage_btn.active = true : this.rage_btn.active = false;
        this.checkAvailabelAds ? this.auto_btn.active = true : this.auto_btn.active = false;
        this.checkAvailabelAds ? this.crit_btn.active = true : this.crit_btn.active = false;
        this.checkAvailabelAds ? this.ice_btn.active = true : this.ice_btn.active = false;
        this.checkAvailabelAds ? this.fire_btn.active = true : this.fire_btn.active = false;
        this.refreshUI();
        this.updateBtns();
        cc.Mgr.admob.showBanner("buff");
      },
      refreshUI: function refreshUI() {
        this.rage_progress.width = cc.Mgr.game.rageTimer / 900 * 241;
        this.rage_time_label.string = cc.Mgr.Utils.FormatNumToTime(cc.Mgr.game.rageTimer);
        this.auto_progress.width = cc.Mgr.game.autoTimer / 900 * 241;
        this.auto_time_label.string = cc.Mgr.Utils.FormatNumToTime(cc.Mgr.game.autoTimer);
        this.fire_progress.width = cc.Mgr.game.fireTimer / 900 * 241;
        this.fire_time_label.string = cc.Mgr.Utils.FormatNumToTime(cc.Mgr.game.fireTimer);
        this.ice_progress.width = cc.Mgr.game.iceTimer / 900 * 241;
        this.ice_time_label.string = cc.Mgr.Utils.FormatNumToTime(cc.Mgr.game.iceTimer);
        this.crit_progress.width = cc.Mgr.game.critTimer / 900 * 241;
        this.crit_time_label.string = cc.Mgr.Utils.FormatNumToTime(cc.Mgr.game.critTimer);
      },
      updateAdsBtnState: function updateAdsBtnState() {
        this.checkAvailabelAds = cc.Mgr.admob.checkAvailableRewardedAd();
        this.checkAvailabelAds ? this.rage_btn.active = true : this.rage_btn.active = false;
        this.checkAvailabelAds ? this.auto_btn.active = true : this.auto_btn.active = false;
        this.checkAvailabelAds ? this.crit_btn.active = true : this.crit_btn.active = false;
        this.checkAvailabelAds ? this.ice_btn.active = true : this.ice_btn.active = false;
        this.checkAvailabelAds ? this.fire_btn.active = true : this.fire_btn.active = false;
      },
      updateBtns: function updateBtns(_noFill) {
        true == _noFill && cc.Mgr.game.noFillCount++;
        if (cc.Mgr.game.noFillCount >= 3) {
          this.rage_btn.active = this.auto_btn.active = this.crit_btn.active = this.ice_btn.active = this.fire_btn.active = false;
          this.rage_invite_btn.active = this.auto_invite_btn.active = this.crit_invite_btn.active = this.ice_invite_btn.active = this.fire_invite_btn.active = false;
        } else this.rage_invite_btn.active = this.auto_invite_btn.active = this.crit_invite_btn.active = this.ice_invite_btn.active = this.fire_invite_btn.active = false;
      },
      onClickGetAutoByInvite: function onClickGetAutoByInvite() {
        if (false == this.limitClick.clickTime()) return;
        var self = this;
        cc.Mgr.UIMgr.showLoading();
        cc.Mgr.Utils.getBase64Image("resources/tex/shareImage_2.png", function(_data) {
          cc.Mgr.game.updateMissionProgressById(MissionType.InviteCount);
          cc.Mgr.game.updateAchieveProgressByType(AchieveType.Invite);
          cc.Mgr.UIMgr.InGameUI.checkMissionAchieveTip();
          cc.Mgr.UIMgr.openAssetGetUI("auto", 300, "buff");
          var data = {};
          data.elapsed = cc.Mgr.Utils.getDate9(true);
          data.stage = cc.Mgr.game.level;
          data.feature = "buff auto";
          cc.Mgr.analytics.logEvent("share_message", JSON.stringify(data));
        });
      },
      onClickGetAutoByAd: function onClickGetAutoByAd() {
        if (false == this.limitClick.clickTime()) return;
        if (false === this.checkAvailabelAds) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("ad-tip-3"), "", this.node);
          return;
        }
        var self = this;
        cc.Mgr.admob.showRewardedVideoAd(function(_state, _noFill) {
          if (true === _state) {
            cc.Mgr.UIMgr.openAssetGetUI("auto", 300, "buff");
            self.updateBtns(_noFill);
          }
        }, this.node, "auto", this);
      },
      onClickGetAutoByGem: function onClickGetAutoByGem() {
        var _this = this;
        if (cc.Mgr.game.autoTimer >= 900) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("max-auto-time-300"), "", this.node);
          return;
        }
        if (cc.Mgr.game.gems >= 3) {
          cc.Mgr.game.gems -= 3;
          cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "gem");
          var data = {};
          data.elapsed = cc.Mgr.Utils.getDate9(true);
          data.costGems = 3;
          cc.Mgr.UIMgr.openAssetGetUI("auto", 300, "buff");
        } else {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("NoGems"), "gem", this.node);
          if (true === this.allowShow) {
            this.allowShow = false;
            setTimeout(function() {
              cc.Mgr.UIMgr.openPaymentUI(true);
              _this.allowShow = true;
            }, 300);
          }
        }
      },
      onClickGetCritByInvite: function onClickGetCritByInvite() {
        if (false == this.limitClick.clickTime()) return;
        var self = this;
        cc.Mgr.UIMgr.showLoading();
        cc.Mgr.Utils.getBase64Image("resources/tex/shareImage_2.png", function(_data) {
          cc.Mgr.game.updateMissionProgressById(MissionType.InviteCount);
          cc.Mgr.game.updateAchieveProgressByType(AchieveType.Invite);
          cc.Mgr.UIMgr.InGameUI.checkMissionAchieveTip();
          cc.Mgr.UIMgr.openAssetGetUI("crit", 300, "buff");
          var data = {};
          data.elapsed = cc.Mgr.Utils.getDate9(true);
          data.stage = cc.Mgr.game.level;
          data.feature = "buff crit";
          cc.Mgr.analytics.logEvent("share_message", JSON.stringify(data));
        });
      },
      onClickGetCritByAd: function onClickGetCritByAd() {
        if (false == this.limitClick.clickTime()) return;
        if (false === this.checkAvailabelAds) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("ad-tip-3"), "", this.node);
          return;
        }
        var self = this;
        cc.Mgr.admob.showRewardedVideoAd(function(_state, _noFill) {
          if (true === _state) {
            cc.Mgr.UIMgr.openAssetGetUI("crit", 300, "buff");
            self.updateBtns(_noFill);
          }
        }, this.node, "crit", this);
      },
      onClickGetCritByGem: function onClickGetCritByGem() {
        var _this2 = this;
        if (cc.Mgr.game.critTimer >= 900) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("max-crit-time-150"), "", this.node);
          return;
        }
        if (cc.Mgr.game.gems >= 3) {
          cc.Mgr.game.gems -= 3;
          cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "gem");
          var data = {};
          data.elapsed = cc.Mgr.Utils.getDate9(true);
          data.costGems = 3;
          cc.Mgr.UIMgr.openAssetGetUI("crit", 300, "buff");
        } else {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("NoGems"), "gem", this.node);
          if (true === this.allowShow) {
            this.allowShow = false;
            setTimeout(function() {
              cc.Mgr.UIMgr.openPaymentUI(true);
              _this2.allowShow = true;
            }, 300);
          }
        }
      },
      onClickGetIceByInvite: function onClickGetIceByInvite() {
        if (false == this.limitClick.clickTime()) return;
        var self = this;
        cc.Mgr.UIMgr.showLoading();
        cc.Mgr.Utils.getBase64Image("resources/tex/shareImage_2.png", function(_data) {
          cc.Mgr.game.updateMissionProgressById(MissionType.InviteCount);
          cc.Mgr.game.updateAchieveProgressByType(AchieveType.Invite);
          cc.Mgr.UIMgr.InGameUI.checkMissionAchieveTip();
          cc.Mgr.UIMgr.openAssetGetUI("freeze", 300, "buff");
          var data = {};
          data.elapsed = cc.Mgr.Utils.getDate9(true);
          data.stage = cc.Mgr.game.level;
          data.feature = "buff freeze";
          cc.Mgr.analytics.logEvent("share_message", JSON.stringify(data));
        });
      },
      onClickGetIceByAd: function onClickGetIceByAd() {
        if (false == this.limitClick.clickTime()) return;
        if (false === this.checkAvailabelAds) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("ad-tip-3"), "", this.node);
          return;
        }
        var self = this;
        cc.Mgr.admob.showRewardedVideoAd(function(_state, _noFill) {
          if (true === _state) {
            cc.Mgr.UIMgr.openAssetGetUI("freeze", 300, "buff");
            self.updateBtns(_noFill);
          }
        }, this.node, "freeze", this);
      },
      onClickGetIceByGem: function onClickGetIceByGem() {
        var _this3 = this;
        if (cc.Mgr.game.iceTimer >= 900) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("max-freeze-time-150"), "", this.node);
          return;
        }
        if (cc.Mgr.game.gems >= 3) {
          cc.Mgr.game.gems -= 3;
          cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "gem");
          var data = {};
          data.elapsed = cc.Mgr.Utils.getDate9(true);
          data.costGems = 3;
          cc.Mgr.UIMgr.openAssetGetUI("freeze", 300, "buff");
        } else {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("NoGems"), "gem", this.node);
          if (true === this.allowShow) {
            this.allowShow = false;
            setTimeout(function() {
              cc.Mgr.UIMgr.openPaymentUI(true);
              _this3.allowShow = true;
            }, 300);
          }
        }
      },
      onClickGetFireByInvite: function onClickGetFireByInvite() {
        if (false == this.limitClick.clickTime()) return;
        var self = this;
        cc.Mgr.UIMgr.showLoading();
        cc.Mgr.Utils.getBase64Image("resources/tex/shareImage_2.png", function(_data) {
          cc.Mgr.game.updateMissionProgressById(MissionType.InviteCount);
          cc.Mgr.game.updateAchieveProgressByType(AchieveType.Invite);
          cc.Mgr.UIMgr.InGameUI.checkMissionAchieveTip();
          cc.Mgr.UIMgr.openAssetGetUI("flame", 300, "buff");
          var data = {};
          data.elapsed = cc.Mgr.Utils.getDate9(true);
          data.stage = cc.Mgr.game.level;
          data.feature = "buff flame";
          cc.Mgr.analytics.logEvent("share_message", JSON.stringify(data));
        });
      },
      onClickGetFireByAd: function onClickGetFireByAd() {
        if (false == this.limitClick.clickTime()) return;
        if (false === this.checkAvailabelAds) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("ad-tip-3"), "", this.node);
          return;
        }
        var self = this;
        cc.Mgr.admob.showRewardedVideoAd(function(_state, _noFill) {
          if (true === _state) {
            cc.Mgr.UIMgr.openAssetGetUI("flame", 300, "buff");
            self.updateBtns(_noFill);
          }
        }, this.node, "flame", this);
      },
      onClickGetFireByGem: function onClickGetFireByGem() {
        var _this4 = this;
        if (cc.Mgr.game.fireTimer >= 900) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("max-flame-time-150"), "", this.node);
          return;
        }
        if (cc.Mgr.game.gems >= 3) {
          cc.Mgr.game.gems -= 3;
          cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "gem");
          var data = {};
          data.elapsed = cc.Mgr.Utils.getDate9(true);
          data.costGems = 3;
          cc.Mgr.UIMgr.openAssetGetUI("flame", 300, "buff");
        } else {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("NoGems"), "gem", this.node);
          if (true === this.allowShow) {
            this.allowShow = false;
            setTimeout(function() {
              cc.Mgr.UIMgr.openPaymentUI(true);
              _this4.allowShow = true;
            }, 300);
          }
        }
      },
      onClickGetRageByInvite: function onClickGetRageByInvite() {
        if (false == this.limitClick.clickTime()) return;
        var self = this;
        cc.Mgr.UIMgr.showLoading();
        cc.Mgr.Utils.getBase64Image("resources/tex/shareImage_2.png", function(_data) {
          cc.Mgr.game.updateMissionProgressById(MissionType.InviteCount);
          cc.Mgr.game.updateAchieveProgressByType(AchieveType.Invite);
          cc.Mgr.UIMgr.InGameUI.checkMissionAchieveTip();
          cc.Mgr.UIMgr.openAssetGetUI("rage", 300, "buff");
          var data = {};
          data.elapsed = cc.Mgr.Utils.getDate9(true);
          data.stage = cc.Mgr.game.level;
          data.feature = "buff rage";
          cc.Mgr.analytics.logEvent("share_message", JSON.stringify(data));
        });
      },
      onClickGetRageByAd: function onClickGetRageByAd() {
        if (false == this.limitClick.clickTime()) return;
        if (false === this.checkAvailabelAds) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("ad-tip-3"), "", this.node);
          return;
        }
        var self = this;
        cc.Mgr.admob.showRewardedVideoAd(function(_state, _noFill) {
          if (true === _state) {
            cc.Mgr.UIMgr.openAssetGetUI("rage", 300, "buff");
            self.updateBtns(_noFill);
          }
        }, this.node, "rage", this);
      },
      onClickGetRageByGem: function onClickGetRageByGem() {
        var _this5 = this;
        if (cc.Mgr.game.rageTimer >= 900) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("max-angry-time-150"), "", this.node);
          return;
        }
        if (cc.Mgr.game.gems >= 3) {
          cc.Mgr.game.gems -= 3;
          cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "gem");
          var data = {};
          data.elapsed = cc.Mgr.Utils.getDate9(true);
          data.costGems = 3;
          cc.Mgr.UIMgr.openAssetGetUI("rage", 300, "buff");
        } else {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("NoGems"), "gem", this.node);
          if (true === this.allowShow) {
            this.allowShow = false;
            setTimeout(function() {
              cc.Mgr.UIMgr.openPaymentUI(true);
              _this5.allowShow = true;
            }, 300);
          }
        }
      },
      closeUI: function closeUI() {
        cc.Mgr.AudioMgr.playSFX("click");
        cc.Mgr.admob.hideBanner("buff");
        var self = this;
        cc.tween(this.blurBg).to(.15, {
          opacity: 0
        }).start();
        cc.tween(this.content).to(.15, {
          opacity: 0,
          scale: .5
        }).call(function() {
          self.node.active = false;
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount("buff");
      }
    });
    cc._RF.pop();
  }, {} ],
  BulletPool: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "195ffaZSQJGy4bSrv3SxKxE", "BulletPool");
    "use strict";
    var BulletPool = cc.Class({
      extends: cc.Component,
      properties: {
        obPrefab: cc.Prefab
      },
      InitPool: function InitPool() {
        var self = this;
        this.pool = new cc.NodePool();
        cc.loader.loadRes("prefab/bullet/bullet", function(errmsg, prefab) {
          if (errmsg) {
            cc.error(errmsg.message || errmsg);
            return;
          }
          self.obPrefab = prefab;
          var initCount = 16;
          for (var i = 0; i < initCount; i++) {
            var bulletObj = cc.instantiate(prefab);
            self.pool.put(bulletObj);
          }
        });
      },
      clearList: function clearList() {
        this.pool.clear();
      },
      getObFromPool: function getObFromPool() {
        var bullet = null;
        if (this.pool.size() > 0) {
          bullet = this.pool.get();
          bullet.active = false;
        } else bullet = cc.instantiate(this.obPrefab);
        return bullet;
      },
      ObBackToPool: function ObBackToPool(bullet) {
        this.pool.put(bullet);
      }
    });
    module.exports = BulletPool;
    cc._RF.pop();
  }, {} ],
  BulletType: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2f246EB0nNI3Iyqom/cWfUx", "BulletType");
    "use strict";
    var BulletType = cc.Enum({
      Straight: 1,
      Curve: 2
    });
    module.exports = BulletType;
    cc._RF.pop();
  }, {} ],
  BuyButtonData: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "919f6mNzhlAHoAXfbh8SJ2u", "BuyButtonData");
    "use strict";
    var BuyButtonData = cc.Class({
      name: "BuyButtonData",
      properties: {
        Level: 1,
        button: 1
      }
    });
    module.exports = BuyButtonData;
    cc._RF.pop();
  }, {} ],
  BuyButtonMapMgr: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c2dfeMauDtCppXUZNX11/4d", "BuyButtonMapMgr");
    "use strict";
    var buttonMap = require("DB_buyButton");
    var buttonData = require("BuyButtonData");
    var BuyButtonMapMgr = cc.Class({
      extends: cc.Component,
      properties: {
        dataList: {
          default: [],
          type: [ buttonData ]
        }
      },
      DecodeJson: function DecodeJson() {
        var jsonAsset = JSON.parse(buttonMap.data);
        for (var key in jsonAsset) {
          var dt = new buttonData();
          dt.Level = jsonAsset[key][0];
          dt.button = jsonAsset[key][1];
          this.dataList[key] = dt;
        }
      },
      getDataByKey: function getDataByKey(Id) {
        return this.dataList[Id];
      }
    });
    module.exports = BuyButtonMapMgr;
    cc._RF.pop();
  }, {
    BuyButtonData: "BuyButtonData",
    DB_buyButton: "DB_buyButton"
  } ],
  Cloud: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c2a12JQ8WJDboh2NFwsG6C5", "Cloud");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        speed: 0
      },
      start: function start() {
        this.node.x = 550;
        this.count = 0;
        this.currentTimer = Date.now();
        this.startTimer = 1e4 * Math.random();
      },
      update: function update(dt) {
        if (this.count < 2) {
          this.count++;
          return;
        }
        if (Date.now() - this.currentTimer < this.startTimer) return;
        this.count = 0;
        this.node.x -= this.speed;
        this.node.x <= -550 && (this.node.x = 550);
      }
    });
    cc._RF.pop();
  }, {} ],
  CoinBundle: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "954afzJ5DdLGYRAjLTq2ut2", "CoinBundle");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        content: cc.Node,
        blurBg: cc.Node,
        btnLabel: cc.Label,
        btnLabel2: cc.Label,
        coinLabel: cc.Label,
        priceSaleLabel: cc.Label,
        priceLabel: cc.Label,
        singlePriceLabel: cc.Label,
        saleNode: cc.Node,
        priceNode: cc.Node,
        gemsNode: cc.Node,
        btn: cc.Node,
        btn_2: cc.Node,
        desLabel: cc.Label,
        saleSprite: cc.Node,
        saleSprite2: cc.Node,
        timeNode: cc.Node,
        timeLabel: cc.Label,
        timeTip: cc.Label,
        title: cc.Node,
        title_zh: cc.Node,
        title_ja: cc.Node,
        title_ru: cc.Node
      },
      onLoad: function onLoad() {
        this.limitClick = this.node.getComponent("LimitClick");
      },
      start: function start() {
        this.btnLabel2.string = this.btnLabel.string = cc.Mgr.Utils.getTranslation("btn-get");
        this.timeTip.string = cc.Mgr.Utils.getTranslation("bundle-time-tip");
        this.title.active = false;
        this.title_zh.active = false;
        this.title_ja.active = false;
        this.title_ru.active = false;
        "Japanese" === cc.Mgr.Config.language ? this.title_ja.active = true : "Simplified Chinese" === cc.Mgr.Config.language || "Traditional Chinese" === cc.Mgr.Config.language ? this.title_zh.active = true : "Russian" === cc.Mgr.Config.language ? this.title_ru.active = true : this.title.active = true;
      },
      showUI: function showUI(_coin, _sale, _fromStart) {
        this.fromStart = _fromStart;
        this.coinLabel.string = cc.Mgr.Utils.getNumStr2(_coin);
        this.priceLabel.string = cc.Mgr.payment.priceList[7];
        this.priceSaleLabel.string = cc.Mgr.payment.priceList[11];
        this.singlePriceLabel.string = cc.Mgr.payment.priceList[7];
        this.saleSprite.width = this.saleSprite2.width = 16 * this.priceLabel.string.length;
        this.blurBg.opacity = 0;
        this.content.opacity = 0;
        this.content.setScale(.5);
        cc.tween(this.blurBg).to(.05, {
          opacity: 255
        }).call().start();
        cc.tween(this.content).to(.15, {
          opacity: 255,
          scale: 1
        }).start();
        this.fromSale = _sale;
        (0 === cc.Mgr.game.coinBundleStartTimer || 0 != cc.Mgr.game.coinBundleStartTimer && Date.now() - cc.Mgr.game.coinBundleStartTimer >= 864e5) && _sale && (cc.Mgr.game.coinBundleStartTimer = Date.now());
        this.getCoin = _coin;
        this.refreshUI();
        cc.Mgr.admob.showBanner("coinBunlde");
        this.haveBought = false;
        this.startTimeCount();
      },
      refreshUI: function refreshUI() {
        this.gemsNode.active = this.saleNode.active = this.priceNode.active = false;
        this.btn.active = this.btn_2.active = false;
        this.btn.active = true;
        this.isSale = 0 !== cc.Mgr.game.coinBundleStartTimer && Date.now() - cc.Mgr.game.coinBundleStartTimer < 864e5;
        this.saleNode.active = this.isSale;
        this.priceNode.active = !this.isSale;
        this.timeNode.active = this.isSale;
        this.isSale ? this.desLabel.string = cc.Mgr.Utils.getTranslation("coinBundle-tip2").format(cc.Mgr.Utils.getNumStr2(this.getCoin)) : this.desLabel.string = cc.Mgr.Utils.getTranslation("coinBundle-tip").format(cc.Mgr.Utils.getNumStr2(this.getCoin));
      },
      startTimeCount: function startTimeCount() {
        this.unschedule(this.countTime);
        if (false === this.isSale) return;
        this.seconds = Math.floor((cc.Mgr.game.coinBundleStartTimer + 864e5 - Date.now()) / 1e3);
        if (this.seconds > 0) {
          this.timeNode.active = true;
          var timeStr = cc.Mgr.Utils.FormatNumToTime(this.seconds);
          this.timeLabel.string = timeStr;
          this.schedule(this.countTime, 1);
        }
      },
      countTime: function countTime() {
        this.seconds -= 1;
        if (this.seconds < 0) {
          this.unschedule(this.countTime);
          this.refreshUI();
          return;
        }
        var timeStr = cc.Mgr.Utils.FormatNumToTime(this.seconds);
        this.timeLabel.string = timeStr;
      },
      onClickClose: function onClickClose() {
        var _this = this;
        cc.Mgr.AudioMgr.playSFX("click");
        cc.Mgr.admob.hideBanner("coinBunlde");
        var self = this;
        cc.tween(this.blurBg).to(.15, {
          opacity: 0
        }).start();
        cc.tween(this.content).to(.15, {
          opacity: 0,
          scale: .5
        }).call(function() {
          self.node.active = false;
          true == _this.fromStart;
          cc.Mgr.UIMgr.starterBundleNode && cc.Mgr.UIMgr.starterBundleNode.active && cc.Mgr.UIMgr.starterBundleNode.getComponent("StarterBundle").refreshUI();
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount("coinBundle");
      },
      onClickGet: function onClickGet() {
        var _this2 = this;
        if (false == this.limitClick.clickTime()) return;
        var currentProductID = this.isSale ? 11 : 7;
        currentProductID = 11;
        cc.Mgr.payment.purchaseByIndex(currentProductID, function() {
          cc.Mgr.UIMgr.openAssetGetUI("money", _this2.getCoin, "payment");
          _this2.haveBought = true;
          cc.Mgr.game.coinBundleStartTimer = 0;
          _this2.refreshUI();
          _this2.onClickClose();
        }, cc.Mgr.UIMgr.tipRoot);
      },
      onClickGetByGems: function onClickGetByGems() {
        var _this3 = this;
        if (false == this.limitClick.clickTime()) return;
        if (cc.Mgr.game.gems < 30) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("NoGems"), "gem", this.node);
          setTimeout(function() {
            cc.Mgr.UIMgr.openPaymentUI(true);
            _this3.onClickClose();
          }, 300);
          return;
        }
        cc.Mgr.game.gems -= 30;
        cc.Mgr.UIMgr.openAssetGetUI("money", this.getCoin, "payment");
        this.haveBought = true;
        cc.Mgr.game.coinBundleStartTimer = 0;
        this.refreshUI();
        this.onClickClose();
      }
    });
    cc._RF.pop();
  }, {} ],
  Compensation: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ad5d9Yr/V9C6Yy3SAsiq1EJ", "Compensation");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        content: cc.Node,
        blurBg: cc.Node,
        desLabel: cc.Label,
        desLabel2: cc.Label,
        desLabel3: cc.Label,
        btnLabel: cc.Label,
        numLabel: cc.Label,
        gemIcon_1: cc.Node,
        coinIcon_1: cc.Node,
        gemIcon_2: cc.Node,
        coinIcon_2: cc.Node,
        restoreTipLabel: cc.Label
      },
      onLoad: function onLoad() {
        this.itemNameMap = {};
        this.itemNameMap.addCoin = "restore-coin";
        this.itemNameMap.addGem = "restore-gem";
        this.itemNameMap.isVIP = "restore-vip";
        this.itemNameMap.vipExpire = "restore-vipExpire";
        this.itemNameMap.removeAd = "restore-removeAd";
        this.itemNameMap.unlockSpecialGrid = "restore-unlockSpecialGrid";
        this.itemNameMap.offlineDouble = "restore-offlineDouble";
      },
      start: function start() {
        this.limitClick = this.node.getComponent("LimitClick");
        this.btnLabel.string = cc.Mgr.Utils.getTranslation("btn-claim");
        this.desLabel3.string = cc.Mgr.Utils.getTranslation("restore-tip");
        this.restoreTipLabel.string = cc.Mgr.Utils.getTranslation("restore-tip-2");
      },
      showUI: function showUI(_data) {
        this.desLabel.node.active = false;
        this.numLabel.node.active = false;
        this.restoreTipLabel.node.active = false;
        this.data = _data;
        this.num = 0;
        if (null != _data) {
          if ("gem" == _data.content.type) {
            this.gemIcon_1.active = true;
            this.gemIcon_2.active = true;
            this.coinIcon_1.active = false;
            this.coinIcon_2.active = false;
          } else {
            this.gemIcon_1.active = false;
            this.gemIcon_2.active = false;
            this.coinIcon_1.active = true;
            this.coinIcon_2.active = true;
          }
          this.type = _data.content.type;
          this.num = parseInt(_data.content.amount);
          this.numLabel.string = "x" + cc.Mgr.Utils.getNumStr(_data.content.amount);
          this.id = _data.id;
          "" != _data.content.description ? this.desLabel.string = _data.content.description : this.desLabel.string = cc.Mgr.Utils.getTranslation("compensation-des");
          this.desLabel.node.active = true;
          this.numLabel.node.active = true;
        } else {
          this.gemIcon_1.active = false;
          this.gemIcon_2.active = false;
          this.coinIcon_1.active = false;
          this.coinIcon_2.active = false;
          this.restoreTipLabel.node.active = true;
        }
        this.blurBg.opacity = 0;
        this.content.opacity = 0;
        this.content.setScale(.5);
        cc.tween(this.blurBg).to(.05, {
          opacity: 255
        }).call().start();
        cc.tween(this.content).to(.15, {
          opacity: 255,
          scale: 1
        }).start();
        this.desLabel3.node.active = false;
        this.desLabel2.string = "";
        if (null != cc.Mgr.Utils.preUpdateData) {
          this.result = {};
          for (var id in cc.Mgr.Utils.preUpdateData) {
            var data = cc.Mgr.Utils.preUpdateData[id];
            for (var key in data) {
              if ("id" === key) continue;
              !this.result[key] || "addCoin" !== key && "addGem" !== key ? this.result[key] = data[key] : this.result[key] += data[key];
            }
          }
          for (var _key2 in this.result) "" === this.desLabel2.string ? this.desLabel2.string += this.getContent(_key2, this.result[_key2]) : this.desLabel2.string += "\n" + this.getContent(_key2, this.result[_key2]);
          this.desLabel3.node.active = true;
        }
      },
      getContent: function getContent(_key, _value) {
        if ("addCoin" === _key || "addGem" === _key) return cc.Mgr.Utils.getTranslation(this.itemNameMap[_key]) + "  x" + cc.Mgr.Utils.getNumStr(_value);
        if (true === _value) return cc.Mgr.Utils.getTranslation(this.itemNameMap[_key]);
        if (false !== _value) {
          _value = Date.now() + 24 * _value * 3600 * 1e3;
          return cc.Mgr.Utils.getTranslation(this.itemNameMap[_key]) + "  " + new Date(_value).toUTCString();
        }
      },
      claim: function claim() {
        var _this = this;
        if (false == this.limitClick.clickTime()) return;
        cc.Mgr.AudioMgr.playSFX("click");
        cc.tween(this.blurBg).to(.15, {
          opacity: 0
        }).start();
        cc.tween(this.content).to(.15, {
          opacity: 0,
          scale: .5
        }).call(function() {
          var num = 0;
          null != cc.Mgr.Utils.preUpdateData && cc.Mgr.Utils.preUpdateData.addGem > 0 && (num += cc.Mgr.Utils.preUpdateData.addGem);
          if (null != _this.data) {
            if ("gem" == _this.type) {
              num += _this.num;
              cc.Mgr.UIMgr.openAssetGetUI("gem", num, "compensation");
            } else {
              cc.Mgr.game.money += _this.num;
              cc.Mgr.game.coin_gained_total += _this.num;
              cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "money");
              cc.Mgr.UIMgr.showJibEffect();
            }
            cc.Mgr.game.compensation[_this.id] = true;
          } else num > 0 && cc.Mgr.UIMgr.openAssetGetUI("gem", num, "compensation");
          setTimeout(function() {
            cc.Mgr.GameCenterCtrl.caculateOfflineAsset();
          }, 2e3);
          _this.node.active = false;
          var eventData = null;
          if (null != eventData) {
            eventData.addGem = num;
            eventData.elapsed = cc.Mgr.Utils.getDate9(true);
            cc.Mgr.analytics.logEvent("compensation_claim", JSON.stringify(eventData));
          }
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount("compensation");
      }
    });
    cc._RF.pop();
  }, {} ],
  Config: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1c7b0w9FLxIVZ1Pxh3tlyxY", "Config");
    "use strict";
    var Config = cc.Class({
      extends: cc.Component,
      statics: {
        isDebug: true,
        isTelegram: true,
        platform: "Telegram",
        version: "1.0.0",
        debug_version: "_debug_15",
        zOffsetY: 142,
        zBossLine: 100,
        allPlantCount: 75,
        angryCost: 50,
        lastWaveKey: "60_5",
        lastGameLevel: 60,
        language: "English",
        lastWaveWaitTime: 8,
        normalWaveWaitTime: 3,
        CheckPotGrownInterval: .3,
        missionDataList: [ {
          id: 0,
          checkType: 0,
          misType: 0,
          checkNum: 1,
          checklv: 0,
          progress: 0,
          claimed: 0,
          rewardType: "coin"
        }, {
          id: 1,
          checkType: 0,
          misType: 1,
          checkNum: 20,
          checklv: 0,
          progress: 0,
          claimed: 0,
          rewardType: "coin"
        }, {
          id: 2,
          checkType: 0,
          misType: 2,
          checkNum: 10,
          checklv: 0,
          progress: 0,
          claimed: 0,
          rewardType: "coin"
        }, {
          id: 3,
          checkType: 0,
          misType: 3,
          checkNum: 3,
          checklv: 0,
          progress: 0,
          claimed: 0,
          rewardType: "gem"
        }, {
          id: 4,
          checkType: 0,
          misType: 4,
          checkNum: 10,
          checklv: 0,
          progress: 0,
          claimed: 0,
          rewardType: "gem"
        }, {
          id: 5,
          checkType: 0,
          misType: 5,
          checkNum: 1,
          checklv: 0,
          progress: 0,
          claimed: 0,
          rewardType: "gem"
        } ],
        missionCheckList: [ [ 1 ], [ 20 ], [ 10 ], [ 3, 6 ], [ 300, 600, 1200 ], [ 1 ] ],
        missionRewardList: [ [ 0 ], [ 0 ], [ 0 ], [ 50, 50 ], [ 20, 50, 50 ], [ 50 ] ],
        achieveDataList: [ {
          id: 1,
          checkType: 1,
          achType: 0,
          level: 4,
          checklv: 0,
          progress: 0,
          finished: 0
        }, {
          id: 2,
          checkType: 1,
          achType: 0,
          level: 7,
          checklv: 0,
          progress: 0,
          finished: 0
        }, {
          id: 3,
          checkType: 1,
          achType: 0,
          level: 11,
          checklv: 0,
          progress: 0,
          finished: 0
        }, {
          id: 4,
          checkType: 1,
          achType: 0,
          level: 15,
          checklv: 0,
          progress: 0,
          finished: 0
        }, {
          id: 5,
          checkType: 1,
          achType: 0,
          level: 19,
          checklv: 0,
          progress: 0,
          finished: 0
        }, {
          id: 6,
          checkType: 1,
          achType: 0,
          level: 23,
          checklv: 0,
          progress: 0,
          finished: 0
        }, {
          id: 7,
          checkType: 1,
          achType: 0,
          level: 27,
          checklv: 0,
          progress: 0,
          finished: 0
        }, {
          id: 8,
          checkType: 1,
          achType: 0,
          level: 31,
          checklv: 0,
          progress: 0,
          finished: 0
        }, {
          id: 9,
          checkType: 1,
          achType: 0,
          level: 35,
          checklv: 0,
          progress: 0,
          finished: 0
        }, {
          id: 10,
          checkType: 1,
          achType: 0,
          level: 39,
          checklv: 0,
          progress: 0,
          finished: 0
        }, {
          id: 11,
          checkType: 1,
          achType: 0,
          level: 43,
          checklv: 0,
          progress: 0,
          finished: 0
        }, {
          id: 12,
          checkType: 1,
          achType: 0,
          level: 47,
          checklv: 0,
          progress: 0,
          finished: 0
        }, {
          id: 13,
          checkType: 1,
          achType: 0,
          level: 51,
          checklv: 0,
          progress: 0,
          finished: 0
        }, {
          id: 14,
          checkType: 1,
          achType: 0,
          level: 55,
          checklv: 0,
          progress: 0,
          finished: 0
        }, {
          id: 15,
          checkType: 1,
          achType: 0,
          level: 59,
          checklv: 0,
          progress: 0,
          finished: 0
        }, {
          id: 16,
          checkType: 1,
          achType: 0,
          level: 63,
          checklv: 0,
          progress: 0,
          finished: 0
        }, {
          id: 17,
          checkType: 1,
          achType: 0,
          level: 67,
          checklv: 0,
          progress: 0,
          finished: 0
        }, {
          id: 18,
          checkType: 1,
          achType: 1,
          level: 1,
          checklv: 0,
          progress: 0,
          finished: 0
        } ],
        signDataList: [ {
          id: 1,
          rewardType: 1,
          rewardNum: 5
        }, {
          id: 2,
          rewardType: 1,
          rewardNum: 5
        }, {
          id: 3,
          rewardType: 1,
          rewardNum: 5
        }, {
          id: 4,
          rewardType: 1,
          rewardNum: 10
        }, {
          id: 5,
          rewardType: 1,
          rewardNum: 10
        }, {
          id: 6,
          rewardType: 1,
          rewardNum: 10
        }, {
          id: 7,
          rewardType: 1,
          rewardNum: 30
        } ],
        signDataListSub: [ {
          id: 1,
          rewardType: 1,
          rewardNum: 5
        }, {
          id: 2,
          rewardType: 1,
          rewardNum: 5
        }, {
          id: 3,
          rewardType: 1,
          rewardNum: 5
        }, {
          id: 4,
          rewardType: 1,
          rewardNum: 10
        }, {
          id: 5,
          rewardType: 1,
          rewardNum: 10
        }, {
          id: 6,
          rewardType: 1,
          rewardNum: 10
        }, {
          id: 7,
          rewardType: 1,
          rewardNum: 30
        } ],
        cgZombieData: {
          totalHp: 200,
          spd: 1.5,
          spdRatio: 3
        },
        init: function init() {
          this.winSize = cc.view.getVisibleSize();
          this.initMoney = BigInt(2e3);
          this.onlineCoinRatio = BigInt(2);
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  1: [ function(require, module, exports) {
    (function(global) {
      (function(global, factory) {
        "object" === typeof exports && "undefined" !== typeof module ? module.exports = factory() : "function" === typeof define && define.amd ? define(factory) : function() {
          const _Base64 = global.Base64;
          const gBase64 = factory();
          gBase64.noConflict = () => {
            global.Base64 = _Base64;
            return gBase64;
          };
          global.Meteor && (Base64 = gBase64);
          global.Base64 = gBase64;
        }();
      })("undefined" !== typeof self ? self : "undefined" !== typeof window ? window : "undefined" !== typeof global ? global : this, function() {
        "use strict";
        const version = "3.2.4";
        const _b64chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        const _b64tab = (bin => {
          let tab = {}, i = 0;
          for (const c of bin) tab[c] = i++;
          return tab;
        })(_b64chars);
        const _fromCharCode = String.fromCharCode;
        const _mkUriSafe = src => String(src).replace(/[+\/]/g, m0 => "+" == m0 ? "-" : "_").replace(/=/g, "");
        const fromUint8Array = (src, urisafe) => {
          let b64 = "";
          for (let i = 0, l = src.length; i < l; i += 3) {
            const a0 = src[i], a1 = src[i + 1], a2 = src[i + 2];
            const ord = a0 << 16 | a1 << 8 | a2;
            b64 += _b64chars.charAt(ord >>> 18) + _b64chars.charAt(ord >>> 12 & 63) + ("undefined" != typeof a1 ? _b64chars.charAt(ord >>> 6 & 63) : "=") + ("undefined" != typeof a2 ? _b64chars.charAt(63 & ord) : "=");
          }
          return urisafe ? _mkUriSafe(b64) : b64;
        };
        const _btoa = "function" === typeof btoa ? s => btoa(s) : s => {
          if (s.match(/[^\x00-\xFF]/)) throw new RangeError("The string contains invalid characters.");
          return fromUint8Array(Uint8Array.from(s, c => c.charCodeAt(0)));
        };
        const utob = src => unescape(encodeURIComponent(src));
        const encode = (src, rfc4648) => {
          const b64 = _btoa(utob(src));
          return rfc4648 ? _mkUriSafe(b64) : b64;
        };
        const encodeURI = src => encode(src, true);
        const btou = src => decodeURIComponent(escape(src));
        const _cb_decode = cccc => {
          let len = cccc.length, padlen = len % 4, n = (len > 0 ? _b64tab[cccc.charAt(0)] << 18 : 0) | (len > 1 ? _b64tab[cccc.charAt(1)] << 12 : 0) | (len > 2 ? _b64tab[cccc.charAt(2)] << 6 : 0) | (len > 3 ? _b64tab[cccc.charAt(3)] : 0), chars = [ _fromCharCode(n >>> 16), _fromCharCode(n >>> 8 & 255), _fromCharCode(255 & n) ];
          chars.length -= [ 0, 0, 2, 1 ][padlen];
          return chars.join("");
        };
        const _atob = "function" === typeof atob ? a => atob(a) : a => String(a).replace(/[^A-Za-z0-9\+\/]/g, "").replace(/\S{1,4}/g, _cb_decode);
        const _decode = a => btou(_atob(a));
        const _fromURI = a => String(a).replace(/[-_]/g, m0 => "-" == m0 ? "+" : "/").replace(/[^A-Za-z0-9\+\/]/g, "");
        const decode = src => _decode(_fromURI(src));
        const toUint8Array = a => Uint8Array.from(_atob(_fromURI(a)), c => c.charCodeAt(0));
        const _noEnum = v => ({
          value: v,
          enumerable: false,
          writable: true,
          configurable: true
        });
        const extendString = function() {
          const _add = (name, body) => Object.defineProperty(String.prototype, name, _noEnum(body));
          _add("fromBase64", function() {
            return decode(this);
          });
          _add("toBase64", function(rfc4648) {
            return encode(this, rfc4648);
          });
          _add("toBase64URI", function() {
            return encode(this, true);
          });
          _add("toBase64URL", function() {
            return encode(this, true);
          });
          _add("toUint8Array", function() {
            return toUint8Array(this);
          });
        };
        const extendUint8Array = function() {
          const _add = (name, body) => Object.defineProperty(Uint8Array.prototype, name, _noEnum(body));
          _add("toBase64", function(rfc4648) {
            return fromUint8Array(this, rfc4648);
          });
          _add("toBase64URI", function() {
            return fromUint8Array(this, true);
          });
          _add("toBase64URL", function() {
            return fromUint8Array(this, true);
          });
        };
        const extendBuiltins = () => {
          extendString();
          extendUint8Array();
        };
        const gBase64 = {
          VERSION: version,
          atob: _atob,
          btoa: _btoa,
          fromBase64: decode,
          toBase64: encode,
          encode: encode,
          encodeURI: encodeURI,
          encodeURL: encodeURI,
          utob: utob,
          btou: btou,
          decode: decode,
          fromUint8Array: fromUint8Array,
          toUint8Array: toUint8Array,
          extendString: extendString,
          extendUint8Array: extendUint8Array,
          extendBuiltins: extendBuiltins
        };
        gBase64.Base64 = Object.assign({}, gBase64);
        return gBase64;
      });
    }).call(this, "undefined" !== typeof global ? global : "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : {});
  }, {} ],
  DB_achievementAwards: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "95773Y8lMpGOq1a/EQmRovz", "DB_achievementAwards");
    "use strict";
    var DB_achievementAwards = cc.Class({
      name: "DB_achievementAwards",
      statics: {
        dataLen: 15,
        dataHead: '["id", "Level", "Gain_5", "Gain_20", "Gain_50", "Gain_100", "Gain_200"]',
        data: '{"1":[1,4,1,0,0,0,0],"2":[2,7,2,3,5,8,10],"3":[3,11,2,3,5,8,10],"4":[4,15,3,5,8,15,15],"5":[5,19,3,5,8,15,20],"6":[6,23,5,8,10,15,20],"7":[7,27,5,8,10,15,20],"8":[8,31,5,8,15,20,20],"9":[9,35,5,8,15,20,20],"10":[10,39,10,15,20,20,20],"11":[11,43,10,15,20,20,20],"12":[12,47,15,20,20,20,20],"13":[13,51,15,20,20,20,0],"14":[14,55,20,20,20,0,0],"15":[15,59,20,20,0,0,0],"16":[16,63,25,20,0,0,0],"17":[17,67,25,20,0,0,0],"18":[18,1,5,20,50,100,0]}'
      }
    });
    module.exports = DB_achievementAwards;
    cc._RF.pop();
  }, {} ],
  DB_airdrop: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "11335GtX3lDrJIFsPjkNvez", "DB_airdrop");
    "use strict";
    var DB_airdrop = cc.Class({
      name: "DB_airdrop",
      statics: {
        dataLen: 70,
        dataHead: '["Level", "Plant1", "Plant2"]',
        data: '{"1":[1,1,0],"2":[2,1,0],"3":[3,1,0],"4":[4,1,2],"5":[5,1,2],"6":[6,2,0],"7":[7,2,0],"8":[8,3,0],"9":[9,3,0],"10":[10,3,4],"11":[11,4,0],"12":[12,4,0],"13":[13,4,5],"14":[14,5,0],"15":[15,5,6],"16":[16,6,0],"17":[17,7,0],"18":[18,8,0],"19":[19,9,0],"20":[20,10,0],"21":[21,11,0],"22":[22,12,0],"23":[23,13,0],"24":[24,14,0],"25":[25,15,0],"26":[26,16,0],"27":[27,17,0],"28":[28,18,0],"29":[29,19,0],"30":[30,20,0],"31":[31,21,0],"32":[32,22,0],"33":[33,23,0],"34":[34,24,0],"35":[35,25,0],"36":[36,26,0],"37":[37,27,0],"38":[38,28,0],"39":[39,29,0],"40":[40,30,0],"41":[41,31,0],"42":[42,32,0],"43":[43,33,0],"44":[44,34,0],"45":[45,35,0],"46":[46,36,0],"47":[47,37,0],"48":[48,38,0],"49":[49,39,0],"50":[50,40,0],"51":[51,41,0],"52":[52,42,0],"53":[53,43,0],"54":[54,44,0],"55":[55,45,0],"56":[56,46,0],"57":[57,47,0],"58":[58,48,0],"59":[59,49,0],"60":[60,50,0],"61":[61,51,0],"62":[62,52,0],"63":[63,53,0],"64":[64,54,0],"65":[65,55,0],"66":[66,56,0],"67":[67,57,0],"68":[68,58,0],"69":[69,59,0],"70":[70,60,0], "71":[71,61,0], "72":[72,62,0], "73":[73,63,0], "74":[74,64,0], "75":[75,65,0]}'
      }
    });
    module.exports = DB_airdrop;
    cc._RF.pop();
  }, {} ],
  DB_buyButton: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ae0d2g1t7BL+4n5tljRLWgK", "DB_buyButton");
    "use strict";
    var DB_buyButton = cc.Class({
      name: "DB_buyButton",
      statics: {
        dataLen: 6,
        dataHead: '["Level", "button"]',
        data: '{"1":[1,1],"2":[2,1],"3":[3,1],"4":[4,1],"5":[5,2],"6":[6,2],"7":[7,3],"8":[8,3],"9":[9,4],"10":[10,4],"11":[11,5],"12":[12,5],"13":[13,6],"14":[14,7],"15":[15,8],"16":[16,9],"17":[17,10],"18":[18,11],"19":[19,12],"20":[20,13],"21":[21,14],"22":[22,15],"23":[23,16],"24":[24,17],"25":[25,18],"26":[26,19],"27":[27,20],"28":[28,21],"29":[29,22],"30":[30,23],"31":[31,24],"32":[32,25],"33":[33,26],"34":[34,27],"35":[35,28],"36":[36,29],"37":[37,30],"38":[38,31],"39":[39,32],"40":[40,33],"41":[41,34],"42":[42,35],"43":[43,36],"44":[44,37],"45":[45,38],"46":[46,39],"47":[47,40],"48":[48,41],"49":[49,42],"50":[50,43],"51":[51,44],"52":[52,45],"53":[53,46],"54":[54,47],"55":[55,48],"56":[56,49],"57":[57,50],"58":[58,51],"59":[59,52],"60":[60,53],"61":[61,54],"62":[62,55],"63":[63,56],"64":[64,57],"65":[65,58],"66":[66,59],"67":[67,60],"68":[68,61],"69":[69,62],"70":[70,63]}'
      }
    });
    module.exports = DB_buyButton;
    cc._RF.pop();
  }, {} ],
  DB_droneRewards: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "73eb5/lxRVKw7ls4qlUMNDW", "DB_droneRewards");
    "use strict";
    var DB_droneRewards = cc.Class({
      name: "DB_droneRewards",
      statics: {
        dataLen: 6,
        dataHead: '["Level", "Drone"]',
        data: '{"1":[1,1],"2":[2,1],"3":[3,1],"4":[4,2],"5":[5,3],"6":[6,3],"7":[7,3],"8":[8,4],"9":[9,4],"10":[10,4],"11":[11,5],"12":[12,5],"13":[13,6],"14":[14,6],"15":[15,7],"16":[16,7],"17":[17,8],"18":[18,9],"19":[19,10],"20":[20,11],"21":[21,12],"22":[22,13],"23":[23,14],"24":[24,15],"25":[25,16],"26":[26,16],"27":[27,17],"28":[28,18],"29":[29,19],"30":[30,20],"31":[31,21],"32":[32,22],"33":[33,23],"34":[34,24],"35":[35,25],"36":[36,26],"37":[37,27],"38":[38,28],"39":[39,29],"40":[40,30],"41":[41,31],"42":[42,32],"43":[43,33],"44":[44,34],"45":[45,35],"46":[46,36],"47":[47,37],"48":[48,38],"49":[49,39],"50":[50,40],"51":[51,41],"52":[52,42],"53":[53,43],"54":[54,44],"55":[55,45],"56":[56,46],"57":[57,47],"58":[58,48],"59":[59,49],"60":[60,50],"61":[61,51],"62":[62,52],"63":[63,53],"64":[64,54],"65":[65,55],"66":[66,56],"67":[67,57],"68":[68,58],"69":[69,59],"70":[70,60], "71":[71,61], "72":[72,62], "73":[73,63], "74":[74,64], "75":[75,65]}'
      }
    });
    module.exports = DB_droneRewards;
    cc._RF.pop();
  }, {} ],
  DB_i18n: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9961dviWXVDPLn5xuM6Qx5W", "DB_i18n");
    "use strict";
    var DB_i18n = cc.Class({
      name: "DB_i18n",
      statics: {
        data: [ {
          Key: "btn-free",
          English: "FREE ",
          "Simplified Chinese": "\u514d\u8d39",
          "Traditional Chinese": "\u514d\u8d39",
          Japanese: "\u7121\u6599",
          Spanish: "GRATIS",
          Russian: "FREE"
        }, {
          Key: "btn-claim",
          English: "CLAIM",
          "Simplified Chinese": "\u9886\u53d6",
          "Traditional Chinese": "\u9886\u53d6",
          Japanese: "\u53d7\u3051\u53d6\u308b",
          Spanish: "RECLAMACI\xd3N",
          Russian: "\u0412\u0417\u042f\u0422\u042c"
        }, {
          Key: "btn-claimed",
          English: "CLAIMED",
          "Simplified Chinese": "\u5df2\u9886\u53d6",
          "Traditional Chinese": "\u5df2\u9886\u53d6",
          Japanese: "\u53d7\u53d6\u6e08\u307f",
          Spanish: "RECLAMADO",
          Russian: "\u0412\u0417\u042f\u0422\u041e"
        }, {
          Key: "plant-level",
          English: "GUARDIAN",
          "Simplified Chinese": "\u5b88\u62a4\u8005",
          "Traditional Chinese": "\u5b88\u62a4\u8005",
          Japanese: "\u30ac\u30fc\u30c7\u30a3\u30a2\u30f3",
          Spanish: "GUARDI\xc1N",
          Russian: "\u0417\u0410\u0429\u0418\u0422\u041d\u0418\u041a"
        }, {
          Key: "newItem-title",
          English: "CONGRATS!",
          "Simplified Chinese": "\u606d\u559c\u83b7\u5f97\uff01",
          "Traditional Chinese": "\u606d\u559c\u83b7\u5f97\uff01",
          Japanese: "\u304a\u3081\u3067\u3068\u3046\uff01",
          Spanish: "\xa1Felicidades!",
          Russian: "\u041f\u041e\u0417\u0414\u0420\u0410\u0412\u041b\u042f\u0415\u041c!"
        }, {
          Key: "NoCoins",
          English: "Not enough coins!",
          "Simplified Chinese": "\u91d1\u5e01\u4e0d\u8db3",
          "Traditional Chinese": "\u91d1\u5e01\u4e0d\u8db3",
          Japanese: "\u30b3\u30a4\u30f3\u304c\u8db3\u308a\u306a\u3044",
          Spanish: "\xa1No hay suficientes monedas!",
          Russian: "\u041d\u0435 \u0445\u0432\u0430\u0442\u0430\u0435\u0442 \u043c\u043e\u043d\u0435\u0442!"
        }, {
          Key: "NoGems",
          English: "Not enough gems!",
          "Simplified Chinese": "\u5b9d\u77f3\u4e0d\u8db3",
          "Traditional Chinese": "\u5b9d\u77f3\u4e0d\u8db3",
          Japanese: "\u5b9d\u77f3\u304c\u8db3\u308a\u306a\u3044",
          Spanish: "No hay suficientes piedras preciosas!",
          Russian: "\u041d\u0435 \u0445\u0432\u0430\u0442\u0430\u0435\u0442 \u0436\u0435\u043c\u0447\u0443\u0436\u0438\u043d!"
        }, {
          Key: "NoSpaceForPlant",
          English: "No more space",
          "Simplified Chinese": "\u4f4d\u7f6e\u4e0d\u591f\u5566",
          "Traditional Chinese": "\u4f4d\u7f6e\u4e0d\u591f\u5566",
          Japanese: "\u7a7a\u304d\u5730\u304c\u306a\u3044",
          Spanish: "No m\xe1s espacio",
          Russian: "\u0411\u043e\u043b\u044c\u0448\u0435 \u043d\u0435\u0442 \u043c\u0435\u0441\u0442\u0430"
        }, {
          Key: "TrashTip",
          English: "Drag Guardians here to recycle",
          "Simplified Chinese": "\u62d6\u52a8\u690d\u7269\u5230\u8fd9\u91cc\u53ef\u4ee5\u5356\u51fa",
          "Traditional Chinese": "\u62d6\u52a8\u5230\u8fd9\u91cc\u53ef\u4ee5\u5356\u51fa\u690d\u7269",
          Japanese: "\u3053\u3053\u3067\u30ac\u30fc\u30c7\u30a3\u30a2\u30f3\u3092\u30ea\u30b5\u30a4\u30af\u30eb\u3059\u308b",
          Spanish: "Guardianes Arrastre aqu\xed a reciclar",
          Russian: "\u0422\u0430\u0449\u0438 \u0417\u0430\u0449\u0438\u0442\u043d\u0438\u043a\u043e\u0432 \u0441\u044e\u0434\u0430, \u0447\u0442\u043e\u0431\u044b c\u0434\u0430\u0442\u044c"
        }, {
          Key: "skillDescs-slowdown",
          English: "Slow down the enemy for 1 second with {0} probability",
          "Simplified Chinese": "{0}\u7684\u51e0\u7387\u51cf\u901f\u76ee\u68071\u79d2",
          "Traditional Chinese": "{0}\u7684\u673a\u7387\u51cf\u901f\u602a\u72691\u79d2",
          Japanese: "{0}\u306e\u78ba\u7387\u3067\u6575\u3092\uff11\u79d2\u9593\u9045\u3089\u305b\u308b",
          Spanish: "Ralentizar el enemigo durante 1 segundo con {0} de probabilidad",
          Russian: "\u0417\u0430\u043c\u0435\u0434\u043b\u0438\u0442\u044c \u0432\u0440\u0430\u0433\u0430 \u043d\u0430 1 \u0441\u0435\u043a\u0443\u043d\u0434\u0443 \u0441 \u0432\u0435\u0440\u043e\u044f\u0442\u043d\u043e\u0441\u0442\u044c\u044e {0}"
        }, {
          Key: "skillDescs-crit",
          English: "Double damage with {0} probability",
          "Simplified Chinese": "{0}\u7684\u51e0\u7387\u5bf9\u76ee\u6807\u9020\u6210\u53cc\u500d\u4f24\u5bb3",
          "Traditional Chinese": "{0}\u7684\u673a\u7387\u5bf9\u602a\u7269\u9020\u6210\u53cc\u500d\u4f24\u5bb3",
          Japanese: "{0}\u306e\u78ba\u7387\u3067\u30c0\u30e1\u30fc\u30b8\u3092\uff12\u500d\u306b\u3059\u308b",
          Spanish: "da\xf1os doble con {0} de probabilidad",
          Russian: "\u0414\u0432\u043e\u0439\u043d\u043e\u0439 \u0443\u0440\u043e\u043d \u0441 \u0432\u0435\u0440\u043e\u044f\u0442\u043d\u043e\u0441\u0442\u044c\u044e {0}"
        }, {
          Key: "skillDescs-freeze",
          English: "Freeze the enemy for 1 second with {0} probability",
          "Simplified Chinese": "{0}\u7684\u51e0\u7387\u51bb\u7ed3\u76ee\u68071\u79d2",
          "Traditional Chinese": "{0}\u7684\u673a\u7387\u51bb\u7ed3\u602a\u72691\u79d2",
          Japanese: "{0}\u306e\u78ba\u7387\u3067\u6575\u3092\uff11\u79d2\u9593\u6b62\u3081\u308b",
          Spanish: "Congelar el enemigo durante 1 segundo con {0} de probabilidad",
          Russian: "\u0417\u0430\u043c\u043e\u0440\u043e\u0437\u0438\u0442\u044c \u0432\u0440\u0430\u0433\u0430 \u043d\u0430 1 \u0441\u0435\u043a\u0443\u043d\u0434\u0443 \u0441 \u0432\u0435\u0440\u043e\u044f\u0442\u043d\u043e\u0441\u0442\u044c\u044e {0}"
        }, {
          Key: "newPlant-title",
          English: "New Guardian",
          "Simplified Chinese": "\u65b0\u5b88\u62a4\u8005",
          "Traditional Chinese": "\u65b0\u5b88\u62a4\u8005",
          Japanese: "\u65b0\u30ac\u30fc\u30c7\u30a3\u30a2\u30f3",
          Spanish: "nueva Guardi\xe1n",
          Russian: "\u041d\u043e\u0432\u044b\u0439 \u0417\u0430\u0449\u0438\u0442\u043d\u0438\u043a"
        }, {
          Key: "mission-login-game",
          English: "Log in to the Game",
          "Simplified Chinese": "\u767b\u5f55\u6e38\u620f",
          "Traditional Chinese": "\u767b\u5165\u6e38\u620f",
          Japanese: "\u30b2\u30fc\u30e0\u306b\u30ed\u30b0\u30a4\u30f3",
          Spanish: "Iniciar sesi\xf3n en el juego",
          Russian: "\u0412\u043e\u0439\u0442\u0438 \u0432 \u0438\u0433\u0440\u0443"
        }, {
          Key: "mission-merge20-flowers",
          English: "Merge 20 Guardians",
          "Simplified Chinese": "\u5408\u621020\u53ea\u5b88\u62a4\u8005",
          "Traditional Chinese": "\u5408\u621020\u53ea\u5b88\u62a4\u8005",
          Japanese: "\u30ac\u30fc\u30c7\u30a3\u30a2\u30f3\u5408\u4f5320\u56de\u9054\u6210",
          Spanish: "Combinar 20 guardianes",
          Russian: "\u0421\u043e\u0435\u0434\u0438\u043d\u0438\u0442\u044c 20 \u0417\u0430\u0449\u0438\u0442\u043d\u0438\u043a\u043e\u0432"
        }, {
          Key: "mission-win10-times",
          English: "Defeat 10 Waves of Muckmongers",
          "Simplified Chinese": "\u6210\u529f\u62b5\u5fa110\u6b21\u602a\u7269",
          "Traditional Chinese": "\u6210\u529f\u62b5\u5fa110\u6b21\u602a\u7269",
          Japanese: "10\u6ce2\u306e\u6c5a\u30e2\u30f3\u30b9\u30bf\u30fc\u3092\u6483\u9000",
          Spanish: "Vence a 10 oleadas de Muckmongers",
          Russian: "\u041e\u0442\u0431\u0438\u0442\u044c 10 \u0432\u043e\u043b\u043d \u0413\u0430\u0434\u043e\u0432\u043e\u0434\u043e\u0432"
        }, {
          Key: "mission-watch3-videos",
          English: "Watch {0} Videos",
          "Simplified Chinese": "\u89c2\u770b{0}\u6b21\u5e7f\u544a",
          "Traditional Chinese": "\u89c2\u770b{0}\u6b21\u5e7f\u544a",
          Japanese: "{0}\u672c\u306e\u52d5\u753b\u3092\u518d\u751f",
          Spanish: "Reloj {0} V\xeddeos",
          Russian: "\u041f\u043e\u0441\u043c\u043e\u0442\u0440\u0435\u0442\u044c {0} \u0432\u0438\u0434\u0435\u043e"
        }, {
          Key: "mission-ingame-time",
          English: "Stay Online for {0} seconds",
          "Simplified Chinese": "\u5728\u7ebf\u65f6\u957f\u8fbe\u5230{0}\u79d2",
          "Traditional Chinese": "\u5728\u7ebf\u65f6\u957f\u8fbe\u5230{0}\u79d2",
          Japanese: "{0} \u79d2\u9593\u7d99\u7d9a\u30aa\u30f3\u30e9\u30a4\u30f3",
          Spanish: "Mant\xe9ngase en l\xednea para {0} segundos",
          Russian: "\u041f\u043e\u0438\u0433\u0440\u0430\u0442\u044c {0} \u0441\u0435\u043a\u0443\u043d\u0434"
        }, {
          Key: "mission-invite-count",
          English: "Invite {0} friend",
          "Simplified Chinese": "\u9080\u8bf7{0}\u4f4d\u597d\u53cb",
          "Traditional Chinese": "\u9080\u8bf7{0}\u4f4d\u597d\u53cb",
          Japanese: "\u53cb\u9054{0}\u540d\u3092\u62db\u5f85",
          Spanish: "",
          Russian: "\u041f\u0440\u0438\u0433\u043b\u0430\u0441\u0438\u0442\u044c {0} \u0434\u0440\u0443\u0437\u0435\u0439"
        }, {
          Key: "achieveItem-description",
          English: "Get {0} Lv.{1} Guardians",
          "Simplified Chinese": "\u83b7\u5f97{0}\u53ea{1}\u7ea7\u7684\u5b88\u62a4\u8005",
          "Traditional Chinese": "\u83b7\u5f97{0}\u53ea{1}\u7ea7\u7684\u5b88\u62a4\u8005",
          Japanese: "\u30ac\u30fc\u30c7\u30a3\u30a2\u30f3Lv.{1}\u3092{0}\u5339\u7372\u5f97",
          Spanish: "Obtener {0} Lv. {1} Guardi\xe1n",
          Russian: "\u041f\u043e\u043b\u0443\u0447\u0438\u0442\u044c {0} \u0417\u0430\u0449\u0438\u0442\u043d\u0438\u043a\u043e\u0432 {1}-\u0433\u043e \u0443\u0440\u043e\u0432\u043d\u044f"
        }, {
          Key: "achieveItem-description-2",
          English: "Invite {0} friends",
          "Simplified Chinese": "\u9080\u8bf7{0}\u4f4d\u597d\u53cb",
          "Traditional Chinese": "\u9080\u8bf7{0}\u4f4d\u597d\u53cb",
          Japanese: "\u53cb\u9054{0}\u540d\u3092\u62db\u5f85",
          Spanish: "",
          Russian: "\u041f\u0440\u0438\u0433\u043b\u0430\u0441\u0438\u0442\u044c {0} \u0434\u0440\u0443\u0437\u0435\u0439"
        }, {
          Key: "guide-1",
          English: "Click to buy a Guardian",
          "Simplified Chinese": "\u70b9\u51fb\u8fd9\u91cc\u8d2d\u4e70\u4e00\u53ea\u5b88\u62a4\u8005",
          "Traditional Chinese": "\u70b9\u51fb\u8fd9\u91cc\u8d2d\u4e70\u4e00\u53ea\u5b88\u62a4\u8005",
          Japanese: "\u30af\u30ea\u30c3\u30af\u3057\u3066\u30ac\u30fc\u30c7\u30a3\u30a2\u30f3\u3092\u8cfc\u5165",
          Spanish: "Haga clic para comprar a un Guardi\xe1n",
          Russian: "\u0416\u043c\u0438, \u0447\u0442\u043e\u0431\u044b \u043a\u0443\u043f\u0438\u0442\u044c \u0417\u0430\u0449\u0438\u0442\u043d\u0438\u043a\u0430"
        }, {
          Key: "guide-2",
          English: "Click one more time",
          "Simplified Chinese": "\u518d\u8d2d\u4e70\u4e00\u6b21",
          "Traditional Chinese": "\u518d\u8d2d\u4e70\u4e00\u6b21",
          Japanese: "\u3082\u3046\u4e00\u5ea6\u30af\u30ea\u30c3\u30af",
          Spanish: "Haga clic una vez m\xe1s",
          Russian: "\u0416\u043c\u0438 \u0435\u0449\u0435 \u0440\u0430\u0437"
        }, {
          Key: "guide-3",
          English: "Drag Guardians to merge and power up!",
          "Simplified Chinese": "\u62d6\u52a8\u5230\u4e00\u8d77\u5408\u6210\u4e00\u53ea\u65b0\u5b88\u62a4\u8005",
          "Traditional Chinese": "\u62d6\u52a8\u5230\u4e00\u8d77\u5408\u6210\u4e00\u53ea\u65b0\u5b88\u62a4\u8005",
          Japanese: "\u30ac\u30fc\u30c7\u30a3\u30a2\u30f3\u3092\u5408\u4f53\u3055\u305b\u3066\u30d1\u30ef\u30fc\u30a2\u30c3\u30d7\uff01",
          Spanish: "Guardianes de arrastre para fusionar y encienda!",
          Russian: "\u0422\u0430\u0449\u0438 \u0417\u0430\u0449\u0438\u0442\u043d\u0438\u043a\u043e\u0432 \u0438 \u0441\u043e\u0435\u0434\u0438\u043d\u044f\u0439 \u0434\u043b\u044f \u0443\u0441\u0438\u043b\u0435\u043d\u0438\u044f"
        }, {
          Key: "guide-4",
          English: "Tap to claim coins",
          "Simplified Chinese": "\u70b9\u51fb\u9886\u53d6\u91d1\u5e01\u5956\u52b1",
          "Traditional Chinese": "\u70b9\u51fb\u9886\u53d6\u91d1\u5e01\u5956\u52b1",
          Japanese: "\u30bf\u30c3\u30d7\u3057\u3066\u30b3\u30a4\u30f3\u7372\u5f97",
          Spanish: "Toque para las monedas de reclamaci\xf3n",
          Russian: "\u0416\u043c\u0438, \u0447\u0442\u043e\u0431\u044b \u0432\u0437\u044f\u0442\u044c \u043c\u043e\u043d\u0435\u0442\u044b"
        }, {
          Key: "guide-5",
          English: "Drag to move the Guardian",
          "Simplified Chinese": "\u79fb\u52a8\u5b88\u62a4\u8005\u6765\u62b5\u5fa1\u602a\u7269",
          "Traditional Chinese": "\u79fb\u52a8\u5b88\u62a4\u8005\u6765\u62b5\u5fa1\u602a\u7269",
          Japanese: "\u30c9\u30e9\u30c3\u30b0\u3057\u3066\u30ac\u30fc\u30c7\u30a3\u30a2\u30f3\u3092\u79fb\u52d5",
          Spanish: "Arrastre para mover el Guardi\xe1n",
          Russian: "\u0422\u0430\u0449\u0438, \u0447\u0442\u043e\u0431\u044b \u0434\u0432\u0438\u0433\u0430\u0442\u044c \u0417\u0430\u0449\u0438\u0442\u043d\u0438\u043a\u043e\u0432"
        }, {
          Key: "guide-6",
          English: "Tap to open the Pod!",
          "Simplified Chinese": "\u70b9\u51fb\u6253\u5f00",
          "Traditional Chinese": "\u70b9\u51fb\u6253\u5f00",
          Japanese: "\u30bf\u30c3\u30d7\u3057\u3066\u7a2e\u3092\u958b\u3051\u308b",
          Spanish: "Toque para abrir la vaina!",
          Russian: "\u0416\u043c\u0438, \u0447\u0442\u043e\u0431\u044b \u043e\u0442\u043a\u0440\u044b\u0442\u044c \u043a\u043e\u043a\u043e\u043d"
        }, {
          Key: "guide-7",
          English: "Attack the Pollution Army!",
          "Simplified Chinese": "\u62b5\u5fa1\u602a\u7269\u6765\u88ad\uff01",
          "Traditional Chinese": "\u62b5\u5fa1\u602a\u7269\u6765\u88ad\uff01",
          Japanese: "\u6c5a\u30e2\u30f3\u30b9\u30bf\u30fc\u8ecd\u56e3\u3092\u5012\u305d\u3046\uff01",
          Spanish: "Atacar al Ej\xe9rcito de la contaminaci\xf3n!",
          Russian: "\u0410\u0442\u0430\u043a\u0443\u0439 \u0410\u0440\u043c\u0438\u044e \u041d\u0435\u0447\u0438\u0441\u0442\u0438"
        }, {
          Key: "guide-8",
          English: "Drag Guardians here to recycle for coins",
          "Simplified Chinese": "\u62d6\u52a8\u5b88\u62a4\u8005\u5230\u8fd9\u91cc\u6765\u5356\u51fa",
          "Traditional Chinese": "\u62d6\u52a8\u5b88\u62a4\u8005\u5230\u8fd9\u91cc\u6765\u5356\u51fa",
          Japanese: "\u30ac\u30fc\u30c7\u30a3\u30a2\u30f3\u3092\u30ea\u30b5\u30a4\u30af\u30eb\u3057\u3066\u30b3\u30a4\u30f3\u7372\u5f97",
          Spanish: "Guardianes Arrastre aqu\xed a reciclar para las monedas",
          Russian: "\u0422\u0430\u0449\u0438 \u0417\u0430\u0449\u0438\u0442\u043d\u0438\u043a\u043e\u0432 \u0441\u044e\u0434\u0430, \u0447\u0442\u043e\u0431\u044b c\u0434\u0430\u0442\u044c \u0437\u0430 \u043c\u043e\u043d\u0435\u0442\u044b"
        }, {
          Key: "guideOver",
          English: "Earn more coins to unlock new guardians",
          "Simplified Chinese": "\u8d5a\u66f4\u591a\u7684\u94b1\u6765\u83b7\u5f97\u89e3\u9501\u65b0\u7684\u5b88\u62a4\u8005",
          "Traditional Chinese": "\u8d5a\u66f4\u591a\u7684\u94b1\u6765\u83b7\u5f97\u89e3\u9501\u65b0\u7684\u5b88\u62a4\u8005",
          Japanese: "\u30b3\u30a4\u30f3\u3092\u96c6\u3081\u3066\u65b0\u30ac\u30fc\u30c7\u30a3\u30a2\u30f3\u3092\u30a2\u30f3\u30ed\u30c3\u30af",
          Spanish: "Ganar m\xe1s monedas para desbloquear nuevos guardianes",
          Russian: "\u0417\u0430\u0440\u0430\u0431\u043e\u0442\u0430\u0439 \u0431\u043e\u043b\u044c\u0448\u0435 \u043c\u043e\u043d\u0435\u0442, \u0447\u0442\u043e\u0431\u044b \u043e\u0442\u043a\u0440\u044b\u0442\u044c \u043d\u043e\u0432\u044b\u0445 \u0437\u0430\u0449\u0438\u0442\u043d\u0438\u043a\u043e\u0432"
        }, {
          Key: "max-angry-time-150",
          English: "Rage mode lasts for up to 900s",
          "Simplified Chinese": "\u72c2\u66b4\u6700\u591a\u6301\u7eed900\u79d2",
          "Traditional Chinese": "\u72c2\u66b4\u6700\u591a\u6301\u7eed900\u79d2",
          Japanese: "\u30ec\u30a4\u30b8\u72b6\u614b\u306f\u6700\u5927900\u79d2\u9593\u307e\u3067\u7d9a\u304f",
          Spanish: "el modo de rabia tiene una duraci\xf3n de hasta 150s",
          Russian: "\u0420\u0435\u0436\u0438\u043c \u0434\u0438\u043a\u043e\u0441\u0442\u0438 \u0434\u043b\u0438\u0442\u0441\u044f \u0434\u043e 900 \u0441\u0435\u043d\u0443\u043d\u0434"
        }, {
          Key: "be-lock",
          English: "LOCKED!",
          "Simplified Chinese": "\u5c1a\u672a\u89e3\u9501",
          "Traditional Chinese": "\u5c1a\u672a\u89e3\u9501",
          Japanese: "\u30ed\u30c3\u30af\u72b6\u614b\uff01",
          Spanish: "BLOQUEADO!",
          Russian: "\u0417\u0410\u041a\u0420\u042b\u0422\u041e"
        }, {
          Key: "congratulation-get",
          English: "Purchased!\r",
          "Simplified Chinese": "\u606d\u559c\u83b7\u5f97\r",
          "Traditional Chinese": "\u606d\u559c\u83b7\u5f97\r",
          Japanese: "\u8cfc\u5165\u6e08\u307f\uff01\r",
          Spanish: "Comprar!  R",
          Russian: "\u041a\u0443\u043f\u043b\u0435\u043d\u043e!\r"
        }, {
          Key: "buy-success",
          English: "Purchase complete",
          "Simplified Chinese": "\u8d2d\u4e70\u6210\u529f!",
          "Traditional Chinese": "\u8d2d\u4e70\u6210\u529f!",
          Japanese: "\u8cfc\u5165\u5b8c\u4e86",
          Spanish: "Compra Completada",
          Russian: "\u041f\u043e\u043a\u0443\u043f\u043a\u0430 \u0443\u0441\u043f\u0435\u0448\u043d\u0430"
        }, {
          Key: "skill_des",
          English: "Skill",
          "Simplified Chinese": "\u6280\u80fd",
          "Traditional Chinese": "\u6280\u80fd",
          Japanese: "\u30b9\u30ad\u30eb",
          Spanish: "Habilidad",
          Russian: "\u041d\u0430\u0432\u044b\u043a"
        }, {
          Key: "plant-Max",
          English: "You have unlocked the highest level.\n New Guardians coming soon in next Update! ",
          "Simplified Chinese": "\u5f53\u524d\u5b88\u62a4\u7740\u5df2\u8fbe\u6700\u9ad8\u7b49\u7ea7\u3002\n \u65b0\u7684\u5b88\u62a4\u8005\u5c06\u5728\u4e0b\u4e00\u4e2a\u7248\u672c\u4e2d\u63a8\u51fa\uff01",
          "Traditional Chinese": "\u5f53\u524d\u5b88\u62a4\u8005\u5df2\u8fbe\u6700\u9ad8\u7b49\u7ea7\u3002 \n \u65b0\u7684\u5b88\u62a4\u8005\u5c06\u5728\u4e0b\u4e00\u4e2a\u7248\u672c\u4e2d\u63a8\u51fa\uff01",
          Japanese: "\u6700\u9ad8\u30ec\u30d9\u30eb\u307e\u3067\u30a2\u30f3\u30ed\u30c3\u30af\u6e08\u307f\n \u6b21\u56de\u306e\u66f4\u65b0\u3067\u65b0\u30ac\u30fc\u30c7\u30a3\u30a2\u30f3\u304c\u767b\u5834\uff01",
          Spanish: "Que haya desbloqueado el nivel m\xe1s alto.  N nuevos guardianes pr\xf3ximamente en la pr\xf3xima actualizaci\xf3n!",
          Russian: "\u0412\u044b \u0434\u043e\u0448\u043b\u0438 \u0434\u043e \u0441\u0430\u043c\u043e\u0433\u043e \u0432\u044b\u0441\u043e\u043a\u043e\u0433\u043e \u0443\u0440\u043e\u0432\u043d\u044f.\n \u041d\u043e\u0432\u044b\u0435 \u0437\u0430\u0449\u0438\u0442\u043d\u0438\u043a\u0438 \u043f\u043e\u044f\u0432\u044f\u0442\u0441\u044f \u0441\u043e \u0441\u043b\u0435\u0434\u0443\u044e\u0449\u0438\u043c \u043e\u0431\u043d\u043e\u0432\u043b\u0435\u043d\u0438\u0435\u043c"
        }, {
          Key: "is-double-now",
          English: "Double Coin bonus activated ",
          "Simplified Chinese": "\u53cc\u500d\u91d1\u5e01\u5df2\u6fc0\u6d3b",
          "Traditional Chinese": "\u53cc\u500d\u91d1\u5e01\u5df2\u6fc0\u6d3b",
          Japanese: "\uff12\u500d\u30b3\u30a4\u30f3\u30dc\u30fc\u30ca\u30b9\u767a\u52d5\u4e2d",
          Spanish: "bono Double Coin activa",
          Russian: "\u0412\u043a\u043b\u044e\u0447\u0435\u043d \u0431\u043e\u043d\u0443\u0441 \u0414\u0432\u043e\u0439\u043d\u044b\u0445 \u041c\u043e\u043d\u0435\u0442"
        }, {
          Key: "max-level-cannt-recovery",
          English: "You can't recycle your most powerful Guardian",
          "Simplified Chinese": "\u5f53\u524d\u6700\u9ad8\u7b49\u7ea7\u5b88\u62a4\u8005\u65e0\u6cd5\u56de\u6536",
          "Traditional Chinese": "\u5f53\u524d\u6700\u9ad8\u7b49\u7ea7\u5b88\u62a4\u8005\u65e0\u6cd5\u56de\u6536",
          Japanese: "\u6700\u3082\u5f37\u3044\u30ab\u30fc\u30c7\u30a3\u30a2\u30f3\u306f\u30ea\u30b5\u30a4\u30af\u30eb\u3067\u304d\u306a\u3044",
          Spanish: "No se puede reciclar su m\xe1s poderoso Guardi\xe1n",
          Russian: "\u041d\u0435\u043b\u044c\u0437\u044f \u0441\u0434\u0430\u0442\u044c \u0441\u0430\u043c\u043e\u0433\u043e \u0441\u0438\u043b\u044c\u043d\u043e\u0433\u043e \u0417\u0430\u0449\u0438\u0442\u043d\u0438\u043a\u0430"
        }, {
          Key: "signed",
          English: "Claimed",
          "Simplified Chinese": "\u5df2\u9886\u53d6",
          "Traditional Chinese": "\u5df2\u9886\u53d6",
          Japanese: "\u53d7\u53d6\u6e08\u307f",
          Spanish: "reclamado",
          Russian: "\u0412\u0437\u044f\u0442\u043e"
        }, {
          Key: "mission-toggle-button",
          English: "Daily Tasks",
          "Simplified Chinese": "\u6bcf\u65e5\u4efb\u52a1",
          "Traditional Chinese": "\u6bcf\u65e5\u4efb\u52a1",
          Japanese: "\u30c7\u30a4\u30ea\u30fc\u30bf\u30b9\u30af",
          Spanish: "Tareas diarias",
          Russian: "\u0414\u043d\u0435\u0432\u043d\u044b\u0435 \u0417\u0430\u0434\u0430\u0447\u0438"
        }, {
          Key: "achievement-toggle-button",
          English: "Achievements",
          "Simplified Chinese": "\u6210\u5c31",
          "Traditional Chinese": "\u6210\u5c31",
          Japanese: "\u9054\u6210\u5831\u916c",
          Spanish: "Logros",
          Russian: "\u0414\u043e\u0441\u0442\u0438\u0436\u0435\u043d\u0438\u044f"
        }, {
          Key: "noMission-tip",
          English: "All of today's tasks\n have been completed",
          "Simplified Chinese": "\u5df2\u5b8c\u6210\u4eca\u5929\u7684\u5168\u90e8\u4efb\u52a1",
          "Traditional Chinese": "\u5df2\u5b8c\u6210\u4eca\u5929\u7684\u5168\u90e8\u4efb\u52a1",
          Japanese: "\u672c\u65e5\u306e\u30bf\u30b9\u30af\u306f\u5168\u3066\u5b8c\u4e86",
          Spanish: "Todas las tareas de hoy se han completado",
          Russian: "\u0412\u0441\u0435 \u0437\u0430\u0434\u0430\u0447\u0438 \u043d\u0430 \u0441\u0435\u0433\u043e\u0434\u043d\u044f\n \u0443\u0436\u0435 \u0432\u044b\u043f\u043e\u043b\u043d\u0435\u043d\u044b"
        }, {
          Key: "rage-title",
          English: "Rage",
          "Simplified Chinese": "\u66b4\u6012",
          "Traditional Chinese": "\u66b4\u6012",
          Japanese: "\u30ec\u30a4\u30b8",
          Spanish: "Rabia",
          Russian: "\u0414\u0438\u043a\u043e\u0441\u0442\u044c"
        }, {
          Key: "rage-speedup-tip-1",
          English: "Attack Speed x 2",
          "Simplified Chinese": "\u653b\u51fb\u901f\u5ea6x2",
          "Traditional Chinese": "\u653b\u51fb\u901f\u5ea6x2",
          Japanese: "\u653b\u6483\u901f\u5ea6 x 2",
          Spanish: "Velocidad de ataque x 2",
          Russian: "\u0421\u043a\u043e\u0440\u043e\u0441\u0442\u044c \u0410\u0442\u0430\u043a\u0438 \u0445 2"
        }, {
          Key: "rage-speedup-tip-2",
          English: "Increase duration by 30s",
          "Simplified Chinese": "\u589e\u52a030\u79d2",
          "Traditional Chinese": "\u589e\u52a030\u79d2",
          Japanese: "\u767a\u52d5\u6642\u9593\u309230\u79d2\u30d7\u30e9\u30b9",
          Spanish: "Aumentar la duraci\xf3n de 30 a\xf1os",
          Russian: "\u0423\u0432\u0435\u043b\u0438\u0447\u0438\u0442\u044c \u0434\u043b\u0438\u0442\u0435\u043b\u044c\u043d\u043e\u0441\u0442\u044c \u043d\u0430 30\u0441"
        }, {
          Key: "getReward-title",
          English: "CONGRATS!",
          "Simplified Chinese": "\u606d\u559c\u83b7\u5f97\uff01",
          "Traditional Chinese": "\u606d\u559c\u83b7\u5f97\uff01",
          Japanese: "\u304a\u3081\u3067\u3068\u3046\uff01",
          Spanish: "\xa1Felicidades!",
          Russian: "\u041f\u041e\u0417\u0414\u0420\u0410\u0412\u041b\u042f\u0415\u041c!"
        }, {
          Key: "getReward-checkbox",
          English: "Watch a video to double the reward",
          "Simplified Chinese": "\u770b\u5e7f\u544a\u52a0\u500d\u9886\u53d6",
          "Traditional Chinese": "\u770b\u5e7f\u544a\u52a0\u500d\u9886\u53d6",
          Japanese: "\u52d5\u753b\u3092\u518d\u751f\u3057\u3066\u5831\u916c\uff12\u500d",
          Spanish: "Vea un video para duplicar la recompensa",
          Russian: "\u041f\u043e\u0441\u043c\u043e\u0442\u0440\u0438\u0442\u0435 \u0432\u0438\u0434\u0435\u043e \u0434\u043b\u044f \u0434\u0432\u043e\u0439\u043d\u043e\u0439 \u043d\u0430\u0433\u0440\u0430\u0434\u044b"
        }, {
          Key: "bigResult-win-checkbox",
          English: "Watch a video to double the reward",
          "Simplified Chinese": "\u770b\u5e7f\u544a\u52a0\u500d\u9886\u53d6",
          "Traditional Chinese": "\u770b\u5e7f\u544a\u52a0\u500d\u9886\u53d6",
          Japanese: "\u52d5\u753b\u3092\u518d\u751f\u3057\u3066\u5831\u916c\uff12\u500d",
          Spanish: "Vea un video para duplicar la recompensa",
          Russian: "\u041f\u043e\u0441\u043c\u043e\u0442\u0440\u0438\u0442\u0435 \u0432\u0438\u0434\u0435\u043e \u0434\u043b\u044f \u0434\u0432\u043e\u0439\u043d\u043e\u0439 \u043d\u0430\u0433\u0440\u0430\u0434\u044b"
        }, {
          Key: "bigResult-loss-checkbox",
          English: "Get a Rage bonus",
          "Simplified Chinese": "\u83b7\u53d6\u66b4\u6012\u5956\u52b1",
          "Traditional Chinese": "\u83b7\u53d6\u66b4\u6012\u5956\u52b1",
          Japanese: "\u30ec\u30a4\u30b8\u30dc\u30fc\u30ca\u30b9\u3092\u5165\u624b",
          Spanish: "Obtener un bono Rage",
          Russian: "\u041f\u043e\u043b\u0443\u0447\u0438\u0442\u044c \u0431\u043e\u043d\u0443\u0441 \u0414\u0438\u043a\u043e\u0441\u0442\u0438"
        }, {
          Key: "bigResult-loss-reborn",
          English: "Restart Stage",
          "Simplified Chinese": "\u91cd\u8bd5\u5f53\u524d\u7b49\u7ea7",
          "Traditional Chinese": "\u91cd\u8bd5\u5f53\u524d\u7b49\u7ea7",
          Japanese: "\u30b9\u30c6\u30fc\u30b8\u30ea\u30c8\u30e9\u30a4",
          Spanish: "Etapa reinicio",
          Russian: "\u0423\u0440\u043e\u0432\u0435\u043d\u044c \u0421 \u041d\u0430\u0447\u0430\u043b\u0430"
        }, {
          Key: "doubleCoin-des-1",
          English: "Defeated Enemies will drop x2 coins!",
          "Simplified Chinese": "\u6253\u8d25\u654c\u4eba\u65f6\u91d1\u5e01\u6389\u843d\u52a0\u500d",
          "Traditional Chinese": "\u6253\u8d25\u654c\u4eba\u65f6\u91d1\u5e01\u6389\u843d\u52a0\u500d",
          Japanese: "\u5012\u3057\u305f\u6575\u304b\u3089\u30b3\u30a4\u30f3\uff12\u500d\u7372\u5f97",
          Spanish: "Los enemigos derrotados se caen las monedas x2!",
          Russian: "\u041f\u043e\u0431\u0435\u0436\u0434\u0435\u043d\u043d\u044b\u0435 \u0432\u0440\u0430\u0433\u0438 \u0432\u044b\u0434\u0430\u044e\u0442 \u04452 \u043c\u043e\u043d\u0435\u0442!"
        }, {
          Key: "doubleCoin-des-2",
          English: "Bonus will last for 500 seconds",
          "Simplified Chinese": "\u91d1\u5e01\u52a0\u500d\u6301\u7eed500\u79d2",
          "Traditional Chinese": "\u91d1\u5e01\u52a0\u500d\u6301\u7eed500\u79d2",
          Japanese: "\u30dc\u30fc\u30ca\u30b9\u306f500\u79d2\u9593\u7d9a\u304f",
          Spanish: "Bonificaci\xf3n tendr\xe1 una duraci\xf3n de 500 segundos",
          Russian: "\u0411\u043e\u043d\u0443\u0441 \u0431\u0443\u0434\u0435\u0442 \u0434\u043b\u0438\u0442\u044c\u0441\u044f 500 \u0441\u0435\u043a\u0443\u043d\u0434"
        }, {
          Key: "coinExchange-title",
          English: "Gold Coin Exchange",
          "Simplified Chinese": "\u91d1\u5e01\u5151\u6362",
          "Traditional Chinese": "\u91d1\u5e01\u5151\u6362",
          Japanese: "\u30b3\u30a4\u30f3\u4ea4\u63db",
          Spanish: "Cambio de moneda de oro",
          Russian: "\u041e\u0431\u043c\u0435\u043d \u0417\u043e\u043b\u043e\u0442\u044b\u0445 \u041c\u043e\u043d\u0435\u0442"
        }, {
          Key: "coinExchange-des",
          English: "Remaining exchanges today",
          "Simplified Chinese": "\u4eca\u5929\u7684\u91d1\u5e01\u5151\u6362\u6b21\u6570\u5269\u4f59",
          "Traditional Chinese": "\u4eca\u5929\u7684\u91d1\u5e01\u5151\u6362\u6b21\u6570\u5269\u4f59",
          Japanese: "\u672c\u65e5\u306e\u6b8b\u308a\u306e\u4ea4\u63db\u56de\u6570",
          Spanish: "Restante intercambios hoy",
          Russian: "\u041e\u0441\u0442\u0430\u043b\u043e\u0441\u044c \u043e\u0431\u043c\u0435\u043d\u043e\u0432 \u043d\u0430 \u0441\u0435\u0433\u043e\u0434\u043d\u044f"
        }, {
          Key: "main-level",
          English: "Stage",
          "Simplified Chinese": "\u7b49\u7ea7",
          "Traditional Chinese": "\u7b49\u7ea7",
          Japanese: "\u30b9\u30c6\u30fc\u30b8",
          Spanish: "Etapa",
          Russian: "\u0423\u0440\u043e\u0432\u0435\u043d\u044c"
        }, {
          Key: "main-task",
          English: "Missions",
          "Simplified Chinese": "\u4efb\u52a1",
          "Traditional Chinese": "\u4efb\u52a1",
          Japanese: "\u30df\u30c3\u30b7\u30e7\u30f3",
          Spanish: "misiones",
          Russian: "\u041c\u0438\u0441\u0441\u0438\u0438"
        }, {
          Key: "main-signIn",
          English: "Daily Bonus",
          "Simplified Chinese": "\u6bcf\u65e5\u5956\u52b1",
          "Traditional Chinese": "\u6bcf\u65e5\u5956\u52b1",
          Japanese: "\u30ed\u30b0\u30dc",
          Spanish: "Bonus diario",
          Russian: "\u0414\u043d\u0435\u0432\u043d\u043e\u0439 \u0411\u043e\u043d\u0443\u0441"
        }, {
          Key: "main-roulette",
          English: "Roulette",
          "Simplified Chinese": "\u81ea\u7136\u5927\u8f6c\u76d8",
          "Traditional Chinese": "\u81ea\u7136\u5927\u8f6c\u76d8",
          Japanese: "\u30eb\u30fc\u30ec\u30c3\u30c8",
          Spanish: "Ruleta",
          Russian: "\u0420\u0443\u043b\u0435\u0442\u043a\u0430"
        }, {
          Key: "main-rank",
          English: "Ranking",
          "Simplified Chinese": "\u6392\u540d",
          "Traditional Chinese": "\u6392\u540d",
          Japanese: "\u30e9\u30f3\u30ad\u30f3\u30b0",
          Spanish: "Clasificaci\xf3n",
          Russian: "\u0420\u0430\u043d\u0433"
        }, {
          Key: "main-double",
          English: "Double Gold",
          "Simplified Chinese": "\u53cc\u500d\u91d1\u5e01",
          "Traditional Chinese": "\u53cc\u500d\u91d1\u5e01",
          Japanese: "\u30b3\u30a4\u30f3\uff12\u500d",
          Spanish: "doble oro",
          Russian: "\u0414\u0432\u043e\u0439\u043d\u043e\u0435 \u0417\u043e\u043b\u043e\u0442\u043e"
        }, {
          Key: "main-offline",
          English: "Collect",
          "Simplified Chinese": "\u9886\u53d6",
          "Traditional Chinese": "\u9886\u53d6",
          Japanese: "\u56de\u53ce",
          Spanish: "Recoger",
          Russian: "\u0421\u043e\u0431\u0440\u0430\u0442\u044c"
        }, {
          Key: "main-rage",
          English: "Rage",
          "Simplified Chinese": "\u66b4\u6012",
          "Traditional Chinese": "\u66b4\u6012",
          Japanese: "\u30ec\u30a4\u30b8",
          Spanish: "Rabia",
          Russian: "\u0414\u0438\u043a\u043e\u0441\u0442\u044c"
        }, {
          Key: "main-shop",
          English: "Shop",
          "Simplified Chinese": "\u5546\u5e97",
          "Traditional Chinese": "\u5546\u5e97",
          Japanese: "\u30b7\u30e7\u30c3\u30d7",
          Spanish: "tienda",
          Russian: "\u041c\u0430\u0433\u0430\u0437\u0438\u043d"
        }, {
          Key: "newRecord-title",
          English: "Next Stage",
          "Simplified Chinese": "\u4e0b\u4e00\u7b49\u7ea7",
          "Traditional Chinese": "\u4e0b\u4e00\u7b49\u7ea7",
          Japanese: "\u6b21\u306e\u30b9\u30c6\u30fc\u30b8",
          Spanish: "Siguiente etapa",
          Russian: "\u0421\u043b\u0435\u0434\u0443\u044e\u0449\u0438\u0439 \u0423\u0440\u043e\u0432\u0435\u043d\u044c"
        }, {
          Key: "newRecord-level",
          English: "Stage",
          "Simplified Chinese": "\u7b49\u7ea7",
          "Traditional Chinese": "\u7b49\u7ea7",
          Japanese: "\u30b9\u30c6\u30fc\u30b8",
          Spanish: "Etapa",
          Russian: "\u0423\u0440\u043e\u0432\u0435\u043d\u044c"
        }, {
          Key: "offline-des",
          English: "Offline Earnings",
          "Simplified Chinese": "\u79bb\u7ebf\u5956\u52b1",
          "Traditional Chinese": "\u79bb\u7ebf\u5956\u52b1",
          Japanese: "\u30aa\u30d5\u30e9\u30a4\u30f3\u5831\u916c",
          Spanish: "Las ganancias fuera de l\xednea",
          Russian: "\u041e\u0444\u0444\u043b\u0430\u0439\u043d \u0417\u0430\u0440\u0430\u0431\u043e\u0442\u043e\u043a"
        }, {
          Key: "offline-checkbox",
          English: "Watch a video to double the reward",
          "Simplified Chinese": "\u89c2\u770b\u5e7f\u544a\u53cc\u500d\u9886\u53d6",
          "Traditional Chinese": "\u89c2\u770b\u5e7f\u544a\u53cc\u500d\u9886\u53d6",
          Japanese: "\u52d5\u753b\u3092\u518d\u751f\u3057\u3066\u5831\u916c\uff12\u500d",
          Spanish: "Vea un video para duplicar la recompensa",
          Russian: "\u041f\u043e\u0441\u043c\u043e\u0442\u0440\u0435\u0442\u044c \u0432\u0438\u0434\u0435\u043e, \u0447\u0442\u043e\u0431\u044b \u0443\u0434\u0432\u043e\u0438\u0442\u044c \u043d\u0430\u0433\u0440\u0430\u0434\u0443"
        }, {
          Key: "vip-title",
          English: "VIP",
          "Simplified Chinese": "VIP",
          "Traditional Chinese": "VIP",
          Japanese: "VIP",
          Spanish: "VIP",
          Russian: "VIP"
        }, {
          Key: "uav-title",
          English: "Fairy Support",
          "Simplified Chinese": "\u7cbe\u7075\u652f\u63f4",
          "Traditional Chinese": "\u7cbe\u7075\u652f\u63f4",
          Japanese: "\u5996\u7cbe\u30b5\u30dd\u30fc\u30c8",
          Spanish: "Soporte de hadas",
          Russian: "\u041f\u043e\u043c\u043e\u0449\u044c \u0424\u0435\u0438"
        }, {
          Key: "roulette-start",
          English: "Start",
          "Simplified Chinese": "\u5f00\u59cb",
          "Traditional Chinese": "\u5f00\u59cb",
          Japanese: "\u30b9\u30bf\u30fc\u30c8",
          Spanish: "comienzo",
          Russian: "\u041d\u0430\u0447\u0430\u0442\u044c"
        }, {
          Key: "roulette-timeTip",
          English: "Ad button recovers in:",
          "Simplified Chinese": "\u5e7f\u544a\u6062\u590d\u8fd8\u5269\uff1a",
          "Traditional Chinese": "\u5e7f\u544a\u6062\u590d\u8fd8\u5269\uff1a",
          Japanese: "\u5e83\u544a\u30dc\u30bf\u30f3\u6709\u52b9\u307e\u3067\u6b8b\u308a\uff1a",
          Spanish: "La pr\xf3xima vez libre:",
          Russian: "\u041a\u043d\u043e\u043f\u043a\u0430 \u0440\u0435\u043a\u043b\u0430\u043c\u044b \u0432\u043e\u0441\u0441\u0442\u0430\u043d\u043e\u0432\u0438\u0442\u0441\u044f \u0447\u0435\u0440\u0435\u0437: "
        }, {
          Key: "signIn-day",
          English: "Day{0}",
          "Simplified Chinese": "\u7b2c{0}\u5929",
          "Traditional Chinese": "\u7b2c{0}\u5929",
          Japanese: "{0}\u65e5\u76ee",
          Spanish: "D\xeda {0}",
          Russian: "\u0414\u0435\u043d\u044c {0}"
        }, {
          Key: "signIn-checked",
          English: "Today\u2019s Bonus has been Claimed!\nPlease come back tomorrow.",
          "Simplified Chinese": "\u4eca\u5929\u7684\u5b9d\u77f3\u5956\u52b1\u5df2\u7ecf\u9886\u53d6\uff01\n \u6b22\u8fce\u660e\u5929\u518d\u6765\uff01",
          "Traditional Chinese": "\u4eca\u5929\u7684\u5b9d\u77f3\u5956\u52b1\u5df2\u7ecf\u9886\u53d6\uff01 \n \u6b22\u8fce\u660e\u5929\u518d\u6765\uff01",
          Japanese: "\u672c\u65e5\u306e\u5831\u916c\u306f\u3059\u3067\u306b\u56de\u53ce\u6e08\u307f\uff01\n \u307e\u305f\u660e\u65e5\u3082\u304d\u3066\u306d\uff01\u3000",
          Spanish: "Adicional de hoy ha sido reclamada!  N Por favor venga ma\xf1ana espalda.",
          Russian: "\u0421\u0435\u0433\u043e\u0434\u043d\u044f\u0448\u043d\u0438\u0439 \u0411\u043e\u043d\u0443\u0441 \u0443\u0436\u0435 \u0412\u0437\u044f\u0442!\n\u041f\u043e\u0436\u0430\u043b\u0443\u0439\u0441\u0442\u0430 \u043f\u0440\u0438\u0445\u043e\u0434\u0438\u0442\u0435 \u0437\u0430\u0432\u0442\u0440\u0430."
        }, {
          Key: "signIn-checkbox",
          English: "Watch a video to double the reward",
          "Simplified Chinese": "\u89c2\u770b\u5e7f\u544a\u53cc\u500d\u9886\u53d6",
          "Traditional Chinese": "\u89c2\u770b\u5e7f\u544a\u53cc\u500d\u9886\u53d6",
          Japanese: "\u52d5\u753b\u3092\u518d\u751f\u3057\u3066\u5831\u916c\uff12\u500d",
          Spanish: "Vea un video para duplicar la recompensa",
          Russian: "\u041f\u043e\u0441\u043c\u043e\u0442\u0440\u0438\u0442\u0435 \u0432\u0438\u0434\u0435\u043e \u0434\u043b\u044f \u0434\u0432\u043e\u0439\u043d\u043e\u0439 \u043d\u0430\u0433\u0440\u0430\u0434\u044b"
        }, {
          Key: "getPlant-nextLevel",
          English: "Next",
          "Simplified Chinese": "\u4e0b\u4e00\u7ea7",
          "Traditional Chinese": "\u4e0b\u4e00\u7ea7",
          Japanese: "\u6b21\u306e\u30ec\u30d9\u30eb",
          Spanish: "pr\xf3ximo",
          Russian: "\u0414\u0430\u043b\u044c\u0448\u0435"
        }, {
          Key: "getPlant-checkbox",
          English: "Watch a video to double the reward",
          "Simplified Chinese": "\u89c2\u770b\u5e7f\u544a\u53cc\u500d\u9886\u53d6",
          "Traditional Chinese": "\u89c2\u770b\u5e7f\u544a\u53cc\u500d\u9886\u53d6",
          Japanese: "\u52d5\u753b\u3092\u518d\u751f\u3057\u3066\u5831\u916c\uff12\u500d",
          Spanish: "Vea un video para duplicar la recompensa",
          Russian: "\u041f\u043e\u0441\u043c\u043e\u0442\u0440\u0438\u0442\u0435 \u0432\u0438\u0434\u0435\u043e \u0434\u043b\u044f \u0434\u0432\u043e\u0439\u043d\u043e\u0439 \u043d\u0430\u0433\u0440\u0430\u0434\u044b"
        }, {
          Key: "payment-shop",
          English: "Guardians",
          "Simplified Chinese": "\u5b88\u62a4\u8005",
          "Traditional Chinese": "\u5b88\u62a4\u8005",
          Japanese: "\u30ac\u30fc\u30c7\u30a3\u30a2\u30f3",
          Spanish: "guardianes",
          Russian: "\u0417\u0430\u0449\u0438\u0442\u043d\u0438\u043a\u0438"
        }, {
          Key: "payment-gem",
          English: "Gems",
          "Simplified Chinese": "\u5b9d\u77f3",
          "Traditional Chinese": "\u5b9d\u77f3",
          Japanese: "\u5b9d\u77f3",
          Spanish: "gemas",
          Russian: "\u0416\u0435\u043c\u0447\u0443\u0433\u0430"
        }, {
          Key: "max-exchange",
          English: "You have reached today's exchange limit!\n Come back tomorrow!",
          "Simplified Chinese": "\u5df2\u8fbe\u5230\u4eca\u65e5\u6700\u5927\u5151\u6362\u6b21\u6570! \n \u6b22\u8fce\u660e\u5929\u518d\u6765!",
          "Traditional Chinese": "\u5df2\u8fbe\u5230\u4eca\u65e5\u6700\u5927\u5151\u6362\u6b21\u6570! \n \u6b22\u8fce\u660e\u5929\u518d\u6765!",
          Japanese: "\u672c\u65e5\u306e\u4ea4\u63db\u56de\u6570\u306f\u4e0a\u9650\u306b\u5230\u9054!\n \u307e\u305f\u660e\u65e5\u3082\u6765\u3066\u306d\uff01",
          Spanish: "Has alcanzado el l\xedmite de cambio de hoy!  N Vuelve ma\xf1ana!",
          Russian: "\u0412\u044b \u0438\u0441\u0447\u0435\u0440\u043f\u0430\u043b\u0438 \u0441\u0435\u0433\u043e\u0434\u043d\u044f\u0448\u043d\u0438\u0439 \u043b\u0438\u043c\u0438\u0442 \u043e\u0431\u043c\u0435\u043d\u0430!\n \u0412\u043e\u0437\u0432\u0440\u0430\u0449\u0430\u0439\u0442\u0435\u0441\u044c \u0437\u0430\u0432\u0442\u0440\u0430!"
        }, {
          Key: "exchangeSuccess",
          English: "You exchanged {0} coins",
          "Simplified Chinese": "\u6210\u529f\u5151\u6362{0}\u91d1\u5e01!",
          "Traditional Chinese": "\u6210\u529f\u5151\u6362{0}\u91d1\u5e01!",
          Japanese: "\u30b3\u30a4\u30f3{0}\u679a\u3092\u4ea4\u63db\u3057\u305f",
          Spanish: "Ha intercambiado {0} monedas",
          Russian: "\u0412\u044b \u043e\u0431\u043c\u0435\u043d\u044f\u043b\u0438 {0} \u043c\u043e\u043d\u0435\u0442"
        }, {
          Key: "rankUnavailable",
          English: "Coming Soon",
          "Simplified Chinese": "\u656c\u8bf7\u671f\u5f85",
          "Traditional Chinese": "\u656c\u8bf7\u671f\u5f85",
          Japanese: "\u8fd1\u65e5\u516c\u958b",
          Spanish: "Pr\xf3ximamente",
          Russian: "\u0421\u043a\u043e\u0440\u043e \u0414\u043e\u0431\u0430\u0432\u0438\u0442\u0441\u044f"
        }, {
          Key: "main-buy-plant-tip",
          English: "Tap to get more Guardians",
          "Simplified Chinese": "\u70b9\u51fb\u8d2d\u4e70\u66f4\u591a\u5b88\u62a4\u8005",
          "Traditional Chinese": "\u70b9\u51fb\u8d2d\u4e70\u66f4\u591a\u5b88\u62a4\u8005",
          Japanese: "\u30bf\u30c3\u30d7\u3057\u3066\u30ac\u30fc\u30c7\u30a3\u30a2\u30f3\u3092\u5165\u624b",
          Spanish: "Toca para obtener m\xe1s guardianes",
          Russian: "\u0411\u043e\u043b\u044c\u0448\u0435 \u0432\u043e\u0439\u0441\u043a"
        }, {
          Key: "main-rage-tip",
          English: "Activate rage mode to attack the enemy",
          "Simplified Chinese": "\u6fc0\u6d3b\u66b4\u6012\u52a0\u901f\u653b\u51fb\u602a\u7269",
          "Traditional Chinese": "\u6fc0\u6d3b\u66b4\u6012\u52a0\u901f\u653b\u51fb\u602a\u7269",
          Japanese: "\u30ec\u30a4\u30b8\u3092\u767a\u52d5\u3057\u3066\u6575\u3092\u653b\u6483",
          Spanish: "Activar el modo de rabia para atacar al enemigo",
          Russian: "\u0412\u043a\u043b\u044e\u0447\u0438\u0442\u044c \u0440\u0435\u0436\u0438\u043c \u0434\u0438\u043a\u043e\u0441\u0442\u0438 \u0434\u043b\u044f \u0430\u0442\u0430\u043a\u0438 \u043d\u0430 \u0432\u0440\u0430\u0433\u043e\u0432"
        }, {
          Key: "main-rubbishTip",
          English: "Drag Guardian here to recycle",
          "Simplified Chinese": "\u53ef\u4ee5\u5c06\u5b88\u62a4\u8005\u62d6\u52a8\u5230\u8fd9\u91cc\u56de\u6536",
          "Traditional Chinese": "\u53ef\u4ee5\u5c06\u5b88\u62a4\u8005\u62d6\u52a8\u5230\u8fd9\u91cc\u56de\u6536",
          Japanese: "\u3053\u3053\u3067\u30ac\u30fc\u30c7\u30a3\u30a2\u30f3\u3092\u30ea\u30b5\u30a4\u30af\u30eb\u3059\u308b",
          Spanish: "Arrastre Guardi\xe1n aqu\xed para reciclar",
          Russian: "\u041f\u0435\u0440\u0435\u0442\u044f\u043d\u0438\u0442\u0435 \u0417\u0430\u0449\u0438\u0442\u043d\u0438\u043a\u0430 \u0441\u044e\u0434\u0430, \u0447\u0442\u043e\u0431\u044b \u0435\u0433\u043e \u0441\u0434\u0430\u0442\u044c"
        }, {
          Key: "main-rage-tip",
          English: "Boost Attack",
          "Simplified Chinese": "\u70b9\u6211\u52a0\u901f\u653b\u51fb",
          "Traditional Chinese": "\u70b9\u6211\u52a0\u901f\u653b\u51fb",
          Japanese: "\u653b\u6483\u30b9\u30d4\u30fc\u30c9UP",
          Spanish: "impulsar Ataque",
          Russian: "\u0423\u043b\u0443\u0447\u0448\u0438\u0442\u044c \u0410\u0442\u0430\u043a\u0443"
        }, {
          Key: "need-to-complete-guide",
          English: "Please finish the tutorial!",
          "Simplified Chinese": "\u5f15\u5bfc\u672a\u5b8c\u6210\uff0c\u8bf7\u5b8c\u6210\u5f15\u5bfc",
          "Traditional Chinese": "\u5f15\u5bfc\u672a\u5b8c\u6210\uff0c\u8bf7\u5b8c\u6210\u5f15\u5bfc",
          Japanese: "\u30c1\u30e5\u30fc\u30c8\u30ea\u30a2\u30eb\u3092\u5b8c\u4e86\u3057\u3088\u3046",
          Spanish: "Por favor, termina el tutorial!",
          Russian: "\u041f\u043e\u0436\u0430\u043b\u0443\u0439\u0441\u0442\u0430 \u0437\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u0435 \u0442\u0443\u0442\u043e\u0440\u0438\u0430\u043b!"
        }, {
          Key: "guide-move-plant",
          English: "Move me to fight!",
          "Simplified Chinese": "\u79fb\u52a8\u4f4d\u7f6e\u66f4\u597d\u653b\u51fb",
          "Traditional Chinese": "\u79fb\u52a8\u4f4d\u7f6e\u66f4\u597d\u653b\u51fb",
          Japanese: "\u79fb\u52d5\u3057\u3066\u6575\u3092\u653b\u6483",
          Spanish: "cambiarme a la lucha!",
          Russian: "\u041f\u0435\u0440\u0435\u0434\u0432\u0438\u043d\u044c\u0442\u0435 \u043c\u0435\u043d\u044f \u0434\u043b\u044f \u0431\u043e\u044f!"
        }, {
          Key: "not-supported",
          English: "Coming Soon",
          "Simplified Chinese": "\u656c\u8bf7\u671f\u5f85",
          "Traditional Chinese": "\u656c\u8bf7\u671f\u5f85",
          Japanese: "\u8fd1\u65e5\u516c\u958b",
          Spanish: "Pr\xf3ximamente",
          Russian: "\u0421\u043a\u043e\u0440\u043e \u0414\u043e\u0431\u0430\u0432\u0438\u0442\u0441\u044f"
        }, {
          Key: "exchange-tip",
          English: "You need to unlock level 4 Guardian to activate this feature",
          "Simplified Chinese": "\u4f60\u7684\u7b49\u7ea7\u4e0d\u591f",
          "Traditional Chinese": "\u4f60\u7684\u7b49\u7ea7\u4e0d\u591f",
          Japanese: "\u30b3\u30a4\u30f3\u4ea4\u63db\u3092\u4f7f\u7528\u3059\u308b\u306b\u306f\u30ec\u30d9\u30eb\uff17\u304c\u5fc5\u8981",
          Spanish: "Que necesita para alcanzar el nivel 7 para activar esta funci\xf3n",
          Russian: "\u041d\u0443\u0436\u043d\u043e \u043e\u0442\u043a\u0440\u044b\u0442\u044c \u0417\u0430\u0449\u0438\u0442\u043d\u0438\u043a\u0430 4-\u0433\u043e \u0443\u0440\u043e\u0432\u043d\u044f \u0434\u043b\u044f \u0430\u043a\u0442\u0438\u0432\u0430\u0446\u0438\u0438"
        }, {
          Key: "coinExchange-max",
          English: "Your reached the cap of currency exchange today!",
          "Simplified Chinese": "\u5df2\u8fbe\u5230\u4eca\u65e5\u6700\u5927\u5151\u6362\u6b21\u6570",
          "Traditional Chinese": "\u5df2\u8fbe\u5230\u4eca\u65e5\u6700\u5927\u5151\u6362\u6b21\u6570",
          Japanese: "\u672c\u65e5\u306e\u4ea4\u63db\u56de\u6570\u306f\u4e0a\u9650\u306b\u5230\u9054\uff01",
          Spanish: "Su alcanzado el l\xedmite de cambio de divisas hoy!",
          Russian: "\u0412\u044b \u0438\u0441\u0447\u0435\u0440\u043f\u0430\u043b\u0438 \u0441\u0435\u0433\u043e\u0434\u043d\u044f\u0448\u043d\u0438\u0439 \u043b\u0438\u043c\u0438\u0442 \u043e\u0431\u043c\u0435\u043d\u0430!\n \u0412\u043e\u0437\u0432\u0440\u0430\u0449\u0430\u0439\u0442\u0435\u0441\u044c \u0437\u0430\u0432\u0442\u0440\u0430!"
        }, {
          Key: "main-vip",
          English: "VIP",
          "Simplified Chinese": "VIP",
          "Traditional Chinese": "VIP",
          Japanese: "VIP",
          Spanish: "VIP",
          Russian: "VIP"
        }, {
          Key: "payment-successful",
          English: "Payment Succeeded ",
          "Simplified Chinese": "\u8d2d\u4e70\u6210\u529f",
          "Traditional Chinese": "\u8d2d\u4e70\u6210\u529f",
          Japanese: "\u652f\u6255\u3044\u5b8c\u4e86",
          Spanish: "Pago exitoso",
          Russian: "\u041f\u043b\u0430\u0442\u0435\u0436 \u0423\u0441\u043f\u0435\u0448\u043d\u044b\u0439"
        }, {
          Key: "payment-failed",
          English: "Payment Failed",
          "Simplified Chinese": "\u8d2d\u4e70\u5931\u8d25",
          "Traditional Chinese": "\u8d2d\u4e70\u5931\u8d25",
          Japanese: "\u652f\u6255\u3044\u5931\u6557",
          Spanish: "Pago fallido",
          Russian: "\u041f\u043b\u0430\u0442\u0435\u0436 \u041d\u0435 \u0421\u0440\u0430\u0431\u043e\u0442\u0430\u043b"
        }, {
          Key: "vip-tip",
          English: "Come back tomorrow!",
          "Simplified Chinese": "\u6b22\u8fce\u660e\u5929\u518d\u6765\uff01",
          "Traditional Chinese": "\u6b22\u8fce\u660e\u5929\u518d\u6765\uff01",
          Japanese: "\u307e\u305f\u660e\u65e5\u3082\u6765\u3066\u306d\uff01",
          Spanish: "\xa1Vuelve ma\xf1ana!",
          Russian: "\u0412\u043e\u0437\u0432\u0440\u0430\u0449\u0430\u0439\u0442\u0435\u0441\u044c \u0437\u0430\u0432\u0442\u0440\u0430!"
        }, {
          Key: "shopItem-coming-soon",
          English: "Coming soon in next update!",
          "Simplified Chinese": "\u656c\u8bf7\u671f\u5f85\u4e0b\u6b21\u66f4\u65b0\uff01",
          "Traditional Chinese": "\u656c\u8bf7\u671f\u5f85\u4e0b\u6b21\u66f4\u65b0\uff01",
          Japanese: "\u6b21\u56de\u306e\u66f4\u65b0\u3067\u8fd1\u65e5\u516c\u958b\uff01",
          Spanish: "Pr\xf3ximamente en la pr\xf3xima actualizaci\xf3n!",
          Russian: "\u0421\u043a\u043e\u0440\u043e \u0434\u043e\u0431\u0430\u0432\u0438\u0442\u0441\u044f \u0432 \u0441\u043b\u0435\u0434\u0443\u044e\u0449\u0435\u043c \u043e\u0431\u043d\u043e\u0432\u043b\u0435\u043d\u0438\u0438!"
        }, {
          Key: "signIn-tip",
          English: "Play every day to earn great bonuses!",
          "Simplified Chinese": "\u6bcf\u65e5\u767b\u9646\u9886\u53d6\u5b9d\u77f3\u5956\u52b1\uff01",
          "Traditional Chinese": "\u6bcf\u65e5\u767b\u9646\u9886\u53d6\u5b9d\u77f3\u5956\u52b1\uff01",
          Japanese: "\u6bce\u65e5\u30d7\u30ec\u30fc\u3057\u3066\u30dc\u30fc\u30ca\u30b9\u3092\u30b2\u30c3\u30c8\uff01",
          Spanish: "Jugar todos los d\xedas para ganar grandes primas!",
          Russian: "\u0418\u0433\u0440\u0430\u0439\u0442\u0435 \u043a\u0430\u0436\u0434\u044b\u0439 \u0434\u0435\u043d\u044c \u0434\u043b\u044f \u043f\u043e\u043b\u0443\u0447\u0435\u043d\u0438\u044f \u043a\u0440\u0443\u0442\u044b\u0445 \u0431\u043e\u043d\u0443\u0441\u043e\u0432"
        }, {
          Key: "fairyGift-tip",
          English: "GET {0} GUARDIANS TO \nBOOST YOUR DEFENSES",
          "Simplified Chinese": "\u53ec\u5524{0}\u5b88\u62a4\u8005 \n \u52a0\u5f3a\u9632\u5fa1",
          "Traditional Chinese": "\u53ec\u5524{0}\u5b88\u62a4\u8005 \n \u52a0\u5f3a\u9632\u5fa1",
          Japanese: "\u30ac\u30fc\u30c7\u30a3\u30a2\u30f3\u3092{0}\u5339\u7372\u5f97\u3057\u3066\n\u9632\u5fa1\u529b\u3092\u30a2\u30c3\u30d7\u3057\u3088\u3046",
          Spanish: "GET {0} tutores  nBOOST sus defensas",
          Russian: "\u041f\u041e\u041b\u0423\u0427\u0418\u0422\u042c {0} \u0417\u0410\u0429\u0418\u0422\u041d\u0418\u041a\u041e\u0412 \n \u0414\u041b\u042f \u0423\u0421\u0418\u041b\u0415\u041d\u0418\u042f \u0417\u0410\u0429\u0418\u0422\u042b"
        }, {
          Key: "getPlant-previousLevel",
          English: "Previous",
          "Simplified Chinese": "\u4e0a\u4e00\u7ea7",
          "Traditional Chinese": "\u4e0a\u4e00\u7ea7",
          Japanese: "\u524d\u306e\u30ec\u30d9\u30eb",
          Spanish: "Anterior",
          Russian: "\u041f\u0440\u0435\u0434\u044b\u0434\u0443\u0449\u0438\u0439"
        }, {
          Key: "btn-get",
          English: "Get",
          "Simplified Chinese": "\u83b7\u53d6",
          "Traditional Chinese": "\u83b7\u53d6",
          Japanese: "\u30b2\u30c3\u30c8",
          Spanish: "Obtener",
          Russian: "\u0412\u0437\u044f\u0442\u044c"
        }, {
          Key: "btn-ok",
          English: "OK",
          "Simplified Chinese": "OK",
          "Traditional Chinese": "OK",
          Japanese: "OK",
          Spanish: "Okay",
          Russian: "\u041e\u041a"
        }, {
          Key: "beCleared-tip",
          English: "Thank you for coming to Nature\u2019s defense and unlocking the highest level of Natural Guardian Spirits. \nThe MuckMonger Pollution Army will continue to threaten Nature so we are busy recruiting even more powerful Guardians to join in the fight!\nStay with us for the next update!",
          "Simplified Chinese": "\u611f\u8c22\u60a8\u957f\u4e45\u4ee5\u6765\u7684\u966a\u4f34\uff01 \n\u60a8\u5df2\u89e3\u9501\u5f53\u524d\u6700\u9ad8\u7b49\u7ea7\u7684\u5b88\u62a4\u8005\uff0c\u4f46\u662f\u6c61\u67d3\u519b\u56e2\u4f9d\u7136\u5728\u4e0d\u65ad\u7684\u653b\u51fb\u6211\u4eec\u3002\n \u6211\u4eec\u5c06\u5728\u4e0b\u6b21\u66f4\u65b0\u4e2d\u53ec\u5524\u66f4\u5f3a\u5927\u7684\u5b88\u62a4\u8005\u6765\u5e2e\u60a8\u5b88\u536b\u5927\u81ea\u7136\uff0c\u656c\u8bf7\u671f\u5f85\uff01",
          "Traditional Chinese": "\u611f\u8c22\u60a8\u957f\u4e45\u4ee5\u6765\u7684\u966a\u4f34\uff01 \n\u60a8\u5df2\u89e3\u9501\u5f53\u524d\u6700\u9ad8\u7b49\u7ea7\u7684\u5b88\u62a4\u8005\uff0c\u4f46\u662f\u6c61\u67d3\u602a\u7269\u519b\u56e2\u4f9d\u7136\u5728\u4e0d\u65ad\u7684\u653b\u51fb\u6211\u4eec\u3002 \n \u6211\u4eec\u5c06\u5728\u4e0b\u6b21\u66f4\u65b0\u4e2d\u53ec\u5524\u66f4\u5f3a\u5927\u7684\u5b88\u62a4\u8005\u6765\u5e2e\u60a8\u4fdd\u62a4\u5927\u81ea\u7136\uff0c\u656c\u8bf7\u671f\u5f85\uff01",
          Japanese: "\u9577\u304f\u4ed8\u304d\u5408\u3063\u3066\u304d\u3066\u3042\u308a\u304c\u3068\u3046\uff01\n \u6700\u9ad8\u30ec\u30d9\u30eb\u306e\u30ac\u30fc\u30c7\u30a3\u30a2\u30f3\u3092\u30a2\u30f3\u30ed\u30c3\u30af\u3067\u304d\u307e\u3057\u305f\u304c\u3001\u6c5a\u30e2\u30f3\u30b9\u30bf\u30fc\u8ecd\u56e3\u306e\u8972\u6483\u306f\u307e\u3060\u307e\u3060\u6b62\u307e\u3089\u306a\u3044\u3002 \n\u6b21\u56de\u306e\u66f4\u65b0\u3067\u306f\u66f4\u306b\u5f37\u529b\u306a\u30ac\u30fc\u30c7\u30a3\u30a2\u30f3\u3092\u53ec\u559a\u3059\u308b\u306e\u3067\u662f\u975e\u304a\u697d\u3057\u307f\u306b\uff01",
          Spanish: "Gracias por venir a la defensa de la naturaleza y desbloquear el nivel m\xe1s alto de Naturales Bebidas espirituosas de guarda usted.  NLa MuckMonger Ej\xe9rcito contaminaci\xf3n seguir\xe1 amenazando la naturaleza por lo que estamos ocupados de reclutamiento a\xfan m\xe1s poderosos guardianes para unirse en la lucha!  Nstay con nosotros para la pr\xf3xima actualizaci\xf3n!",
          Russian: "\u0421\u043f\u0430\u0441\u0438\u0431\u043e, \u0447\u0442\u043e \u043f\u0440\u0438\u0448\u043b\u0438 \u043d\u0430 \u043f\u043e\u043c\u043e\u0449\u044c \u041f\u0440\u0438\u0440\u043e\u0434\u0435 \u0438 \u043e\u0442\u043a\u0440\u044b\u043b\u0438 \u043d\u0430\u0438\u0432\u044b\u0441\u0448\u0438\u0439 \u0443\u0440\u043e\u0432\u0435\u043d\u044c \u0417\u0430\u0449\u0438\u0442\u043d\u0438\u043a\u043e\u0432. \n \u0410\u0440\u043c\u0438\u044f \u041d\u0435\u0447\u0438\u0441\u0442\u0438 \u0431\u0443\u0434\u0435\u0442 \u0434\u0430\u043b\u044c\u0448\u0435 \u0441\u0442\u0430\u0432\u0438\u0442\u044c \u041f\u0440\u0438\u0440\u043e\u0434\u0443 \u043f\u043e\u0434 \u0443\u0433\u0440\u043e\u0437\u0443, \u0442\u0430\u043a \u0447\u0442\u043e \u043c\u044b \u0440\u0430\u0431\u043e\u0442\u0430\u0435\u043c \u043d\u0430\u0434 \u043d\u0430\u0435\u043c\u043e\u043c \u0435\u0449\u0451 \u0431\u043e\u043b\u0435\u0435 \u0441\u0438\u043b\u044c\u043d\u044b\u0445 \u0417\u0430\u0449\u0438\u0442\u043d\u0438\u043a\u043e\u0432 \u0434\u043b\u044f \u0441\u043b\u0435\u0434\u0443\u044e\u0449\u0435\u0439 \u0441\u0445\u0432\u0430\u0442\u043a\u0438! \n \u0421\u043b\u0435\u0434\u0443\u044e\u0449\u0435\u0435 \u043e\u0431\u043d\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u0443\u0436\u0435 \u043d\u0435 \u0437\u0430 \u0433\u043e\u0440\u0430\u043c\u0438!"
        }, {
          Key: "vip-price",
          English: "3 DAY FREE TRIAL, THEN {0} PER WEEK",
          "Simplified Chinese": "\u524d\u4e09\u5929\u514d\u8d39\u8bd5\u7528\uff0c\u4e4b\u540e\u6bcf\u4e2a\u661f\u671f{0}",
          "Traditional Chinese": "\u524d\u4e09\u5929\u514d\u8d39\u8bd5\u7528\uff0c\u4e4b\u540e\u6bcf\u4e2a\u661f\u671f{0}",
          Japanese: "\u7121\u6599\u30c8\u30e9\u30a4\u30a2\u30eb\uff13\u65e5\u9593\u3001\u305d\u306e\u5f8c\u306f\u6bce\u9031 {0} ",
          Spanish: "3 D\xedas de Evaluaci\xf3n, ENTONCES {0} por semana",
          Russian: "3 \u0414\u041d\u042f \u0411\u0415\u0421\u041f\u041b\u0410\u0422\u041d\u0410\u042f \u0414\u0415\u041c\u041e-\u0412\u0415\u0420\u0421\u0418\u042f, \u041f\u041e\u0422\u041e\u041c {0} \u0417\u0410 \u041d\u0415\u0414\u0415\u041b\u042e"
        }, {
          Key: "vip-des",
          English: "VIP offers a weekly subscription for {0} after a 3 day free trial. During subscription period, the following privileges will be provided\uff1a\n1. Unlock Fort \n2. Free to claim 30 Gems/day \n3. Remove banner/interstitial Ads \n4. Triple the reward of Offline Earnings, Daily Bonuses and Mission Rewards. \nPayment will be charged to your {1} account at the confirmation of purchase. Subscription automatically renews unless it is cancelled at least 24-hours before the end of the current period. Your account will be charged for renewal within 24 hours prior to the end of the current period. You can manage and cancel your subscriptions in your account settings on the {2} after purchase.",
          "Simplified Chinese": "VIP\u8ba2\u9605\u63d0\u4f9b3\u5929\u514d\u8d39\u8bd5\u7528\uff0c\u4e09\u5929\u540e\u6bcf\u5468\u6536\u53d6{0}\u7684\u8d39\u7528\u3002\u8ba2\u9605\u671f\u95f4\u4eab\u53d7\u4e0b\u5217\u670d\u52a1\uff1a\n1. \u89e3\u9501\u70ae\u53f0 \n2. \u6bcf\u65e5\u514d\u8d39\u9886\u53d630\u679a\u5b9d\u77f3\n3.\u79fb\u9664\u6a2a\u5e45\u5e7f\u544a\u548c\u63d2\u5c4f\u5e7f\u544a\n4. \u79bb\u7ebf\u5956\u52b1\uff0c\u6bcf\u65e5\u5956\u52b1\u548c\u4efb\u52a1\u5956\u52b13\u500d\u9886\u53d6\n\u8d2d\u4e70\u5b8c\u6210\u540e\uff0c\u8d39\u7528\u5c06\u76f4\u63a5\u4ece\u60a8\u7684{1}\u8d26\u6237\u4e2d\u6263\u9664\u3002\u5982\u679c\u60a8\u672a\u53d6\u6d88\uff0c\u5219\u8ba2\u9605\u5c06\u5728\u5230\u671f\u524d24\u5c0f\u65f6\u81ea\u52a8\u7eed\u671f\u5e76\u652f\u4ed8\u4e0b\u4e00\u8ba2\u9605\u5468\u671f\u7684\u8d39\u7528\u3002\u60a8\u53ef\u4ee5\u5728{2}\u7684\u8d2d\u4e70\u6216\u8ba2\u9605\u76f8\u5173\u7684\u8bbe\u7f6e\u83dc\u5355\u4e2d\u7ba1\u7406\u6216\u53d6\u6d88\u60a8\u7684\u8ba2\u9605\u3002",
          "Traditional Chinese": "VIP\u8ba2\u9605\u63d0\u4f9b3\u5929\u514d\u8d39\u8bd5\u7528\uff0c\u4e09\u5929\u540e\u6bcf\u5468\u6536\u53d6{0}\u7684\u8d39\u7528\u3002\u8ba2\u9605\u671f\u95f4\u4eab\u53d7\u4e0b\u5217\u670d\u52a1\uff1a\n1. \u89e3\u9501\u70ae\u53f0\n2. \u6bcf\u65e5\u514d\u8d39\u9886\u53d630\u679a\u5b9d\u77f3\n3.\u79fb\u9664\u6a2a\u5e45\u5e7f\u544a\u548c\u63d2\u5c4f\u5e7f\u544a\n4. \u79bb\u7ebf\u5956\u52b1\uff0c\u6bcf\u65e5\u5956\u52b1\u548c\u4efb\u52a1\u5956\u52b13\u500d\u9886\u53d6\n\u8d2d\u4e70\u5b8c\u6210\u540e\uff0c\u8d39\u7528\u5c06\u76f4\u63a5\u4ece\u60a8\u7684{1}\u8d26\u6237\u4e2d\u6263\u9664\u3002\u5982\u679c\u60a8\u672a\u53d6\u6d88\uff0c\u5219\u8ba2\u9605\u5c06\u5728\u5230\u671f\u524d24\u5c0f\u65f6\u81ea\u52a8\u7eed\u671f\u5e76\u652f\u4ed8\u4e0b\u4e00\u8ba2\u9605\u5468\u671f\u7684\u8d39\u7528\u3002\u60a8\u53ef\u4ee5\u5728{2}\u7684\u8d2d\u4e70\u6216\u8ba2\u9605\u76f8\u5173\u7684\u8bbe\u7f6e\u83dc\u5355\u4e2d\u7ba1\u7406\u6216\u53d6\u6d88\u60a8\u7684\u8ba2\u9605\u3002",
          Japanese: "VIP\u306f\u9031\u3054\u3068\u306e\u30b5\u30d6\u30b9\u30af\u30ea\u30d7\u30b7\u30e7\u30f3\u3067\u3059\u3002\uff13\u65e5\u9593\u306e\u7121\u6599\u30c8\u30e9\u30a4\u30a2\u30eb\u5f8c\u3001\u6bce\u9031 {0}\u306e\u4f1a\u8cbb\u304c\u767a\u751f\u3057\u307e\u3059 \u3002VIP\u4f1a\u54e1\u306b\u306f\u6b21\u306e\u7279\u5178\u304c\u3042\u308a\u307e\u3059\u3002\n1. \u8981\u585e\u3092\u30a2\u30f3\u30ed\u30c3\u30af \n2. \u6bce\u65e5\u7121\u6599\u3067\u5b9d\u77f330\u500b\u7372\u5f97\u30c1\u30e3\u30f3\u30b9 \n3. \u5e83\u544a\u3092\u975e\u8868\u793a \n4. \u30aa\u30d5\u30e9\u30a4\u30f3\u5831\u916c\u3001\u30c7\u30a4\u30ea\u30fc\u30dc\u30fc\u30ca\u30b9\u3001\u30df\u30c3\u30b7\u30e7\u30f3\u5831\u916c\u304c\u5168\u30663\u500d \n\u304a\u652f\u6255\u3044\u65b9\u6cd5\u306f\u8cfc\u5165\u627f\u8a8d\u6642\u306b {1} \u30a2\u30ab\u30a6\u30f3\u30c8\u306b\u30c1\u30e3\u30fc\u30b8\u3055\u308c\u307e\u3059\u3002\u30b5\u30d6\u30b9\u30af\u30ea\u30d7\u30b7\u30e7\u30f3\u306f\u3001\u5951\u7d04\u671f\u9593\u306e\u7d42\u4e86\u65e5\u306e24\u6642\u9593\u4ee5\u4e0a\u524d\u306b\u89e3\u7d04\u3055\u308c\u306a\u3044\u9650\u308a\u81ea\u52d5\u66f4\u65b0\u3055\u308c\u307e\u3059\u3002 \u89e3\u7d04\u3057\u306a\u3044\u5834\u5408\u3001\u7d42\u4e86\u65e5\u306e24\u6642\u9593\u4ee5\u5185\u306b\u66f4\u65b0\u6599\u91d1\u304c\u30a2\u30ab\u30a6\u30f3\u30c8\u306b\u30c1\u30e3\u30fc\u30b8\u3055\u308c\u307e\u3059\u3002\u89e3\u7d04\u624b\u7d9a\u304d\u306f\u8cfc\u5165\u5f8c\u306b {2}\u306e\u30a2\u30ab\u30a6\u30f3\u30c8\u8a2d\u5b9a\u753b\u9762\u306b\u3066\u7ba1\u7406\u3067\u304d\u307e\u3059\u3002",
          Spanish: "VIP ofrece una suscripci\xf3n semanal para {0} despu\xe9s de una prueba gratuita de 3 d\xedas. Durante el per\xedodo de suscripci\xf3n, se proporcionar\xe1n los siguientes privilegios:  n 1. Desbloquear Fort  n2. Libre de la reivindicaci\xf3n 30 Gems / d\xeda  n3. Retire la bandera / Anuncios intersticiales  n4. Duplicar la recompensa de ganancias fuera de l\xednea, bonos diarios y recompensas de la misi\xf3n.  NPayment ser\xe1 cargado a su cuenta {1} en la confirmaci\xf3n de la compra. Suscripci\xf3n se renueva autom\xe1ticamente a menos que se cancela al menos 24 horas antes del final del per\xedodo actual. Su cuenta ser\xe1 cargada para la renovaci\xf3n dentro de las 24 horas previas a la final del per\xedodo actual. Puede gestionar y cancelar sus suscripciones en la configuraci\xf3n de su cuenta en la {2} despu\xe9s de la compra.",
          Russian: "VIP - \u044d\u0442\u043e \u0435\u0436\u0435\u043d\u0435\u0434\u0435\u043b\u044c\u043d\u0430\u044f \u043f\u043e\u0434\u043f\u0438\u0441\u043a\u0430 \u0437\u0430 {0} \u043f\u043e\u0441\u043b\u0435 3-\u0445 \u0434\u043d\u0435\u0432\u043d\u043e\u0439 \u0434\u0435\u043c\u043e-\u0432\u0435\u0440\u0441\u0438\u0438. \u0412\u043e \u0432\u0440\u0435\u043c\u044f \u043f\u043e\u0434\u043f\u0438\u0441\u043a\u0438, \u0432\u044b\u0434\u0430\u044e\u0442\u0441\u044f \u0441\u043b\u0435\u0434\u0443\u044e\u0449\u0438\u0435 \u043f\u0440\u0438\u0432\u0435\u043b\u0435\u0433\u0438\u0438: \n1. \u041e\u0442\u043a\u0440\u044b\u0442\u0438\u0435 \u0424\u043e\u0440\u0442\u0430 \n2. \u0412\u044b\u0434\u0430\u0447\u0430 30 \u0436\u0435\u043c\u0447\u0443\u0436\u0438\u043d \u0432 \u0434\u0435\u043d\u044c \n3. \u041e\u0442\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u0435 \u0431\u0430\u043d\u043d\u0435\u0440\u043e\u0432 \u0438 \u043c\u0435\u0436\u0441\u0442\u0440\u0430\u043d\u0438\u0447\u043d\u044b\u044a \u043e\u0431\u044a\u044f\u0432\u043b\u0435\u043d\u0438\u0439. \n4. \u0422\u0440\u043e\u0439\u043d\u044b\u0435 \u043e\u0444\u0444\u043b\u0430\u0439\u043d-\u0437\u0430\u0440\u0430\u0431\u043e\u0442\u043a\u0438, \u0434\u043d\u0435\u0432\u043d\u044b\u0435 \u0431\u043e\u043d\u0443\u0441\u044b \u0438 \u043d\u0430\u0433\u0440\u0430\u0434\u044b \u0437\u0430 \u043c\u0438\u0441\u0441\u0438\u0438. \n\u041f\u043b\u0430\u0442\u0451\u0436 \u0431\u0443\u0434\u0435\u0442 \u0441\u043d\u044f\u0442 \u0441 \u0432\u0430\u0448\u0435\u0433\u043e {1} \u0441\u0447\u0451\u0442\u0430 \u0432 \u043c\u043e\u043c\u0435\u043d\u0442 \u043f\u043e\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043d\u0438\u044f \u043f\u043e\u043a\u0443\u043f\u043a\u0438. \u041f\u043e\u0434\u043f\u0438\u0441\u043a\u0430 \u0430\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u0438 \u043e\u0431\u043d\u043e\u0432\u043b\u044f\u0435\u0442\u0441\u044f, \u0435\u0441\u043b\u0438 \u0435\u0451 \u043d\u0435 \u043e\u0442\u043c\u0435\u043d\u0438\u0442\u044c \u0437\u0430 24 \u0447\u0430\u0441\u0430 \u0434\u043e \u0438\u0441\u0442\u0435\u0447\u0435\u043d\u0438\u044f \u0442\u0435\u043a\u0443\u0449\u0435\u0433\u043e \u043f\u0435\u0440\u0438\u043e\u0434\u0430. \u0412\u044b \u043c\u043e\u0436\u0435\u0442\u0435 \u0438\u0437\u043c\u0435\u043d\u0438\u0442\u044c \u0438\u043b\u0438 \u043e\u0442\u043c\u0435\u043d\u0438\u0442\u044c \u043f\u043e\u0434\u043f\u0438\u0441\u043a\u0438 \u0432 \u043d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0430\u0445 \u0430\u043a\u043a\u0430\u0443\u043d\u0442\u0430 \u043d\u0430 {2} \u043f\u043e\u0441\u043b\u0435 \u043f\u043e\u043a\u0443\u043f\u043a\u0438. "
        }, {
          Key: "guide-unlock-tip",
          English: "Tap to unlock new plot!",
          "Simplified Chinese": "\u70b9\u51fb\u89e3\u9501\u65b0\u7684\u571f\u5730",
          "Traditional Chinese": "\u70b9\u51fb\u89e3\u9501\u65b0\u7684\u571f\u5730",
          Japanese: "\u30bf\u30c3\u30d7\u3057\u3066\u571f\u5730\u3092\u30a2\u30f3\u30ed\u30c3\u30af",
          Spanish: "Toque para desbloquear nueva parcela!",
          Russian: "\u0416\u043c\u0438\u0442\u0435, \u0447\u0442\u043e\u0431\u044b \u043e\u0442\u043a\u0440\u044b\u0442\u044c \u043d\u043e\u0432\u044b\u0439 \u0443\u0447\u0430\u0441\u0442\u043e\u043a!"
        }, {
          Key: "vip-double-tip",
          English: "Double reward for VIP",
          "Simplified Chinese": "VIP\u52a0\u500d\u7279\u6743",
          "Traditional Chinese": "VIP\u52a0\u500d\u7279\u6743",
          Japanese: "VIP\u4f1a\u54e1\u5831\u916c\uff12\u500d",
          Spanish: "Doble recompensa para VIP",
          Russian: "\u0414\u0432\u043e\u0439\u043d\u0430\u044f \u043d\u0430\u0433\u0440\u0430\u0434\u0430 \u0437\u0430 VIP"
        }, {
          Key: "offline-double-tip",
          English: "Offline Earning is tripled",
          "Simplified Chinese": "3\u500d\u9886\u53d6",
          "Traditional Chinese": "3\u500d\u9886\u53d6",
          Japanese: "\u5831\u916c3\u500d",
          Spanish: "Las ganancias fuera de l\xednea se triplicaron",
          Russian: "\u041e\u0444\u043b\u0430\u0439\u043d-\u0434\u043e\u0445\u043e\u0434 \u0443\u0432\u0435\u043b\u0438\u0447\u0438\u043b\u0441\u044f \u0432 \u0442\u0440\u0438 \u0440\u0430\u0437\u0430"
        }, {
          Key: "starterBundles0title",
          English: "Starter Bundles",
          "Simplified Chinese": "\u5927\u793c\u5305",
          "Traditional Chinese": "\u5927\u793c\u5305",
          Japanese: "\u30b9\u30bf\u30fc\u30bf\u30fc\u30d1\u30c3\u30af",
          Spanish: "Los paquetes de arranque",
          Russian: "\u041d\u0430\u0447\u0430\u043b\u044c\u043d\u044b\u0435 \u041f\u0430\u043a\u0435\u0442\u044b"
        }, {
          Key: "already-subscribed-vip",
          English: "This product is already included in your VIP Subscription.",
          "Simplified Chinese": "\u60a8\u7684VIP\u8ba2\u9605\u4e2d\u5df2\u5305\u542b\u6b64\u670d\u52a1",
          "Traditional Chinese": "\u60a8\u7684VIP\u8ba2\u9605\u4e2d\u5df2\u5305\u542b\u6b64\u670d\u52a1",
          Japanese: "\u3053\u3061\u3089\u306e\u5546\u54c1\u306fVIP\u30d1\u30c3\u30af\u306b\u542b\u307e\u308c\u3066\u3044\u307e\u3059",
          Spanish: "Este producto ya est\xe1 incluido en tu suscripci\xf3n VIP.",
          Russian: "\u042d\u0442\u043e\u0442 \u043f\u0440\u043e\u0434\u0443\u043a\u0442 \u0443\u0436\u0435 \u0432\u043a\u043b\u044e\u0447\u0435\u043d \u0432 \u0432\u0430\u0448\u0435\u0439 VIP \u043f\u043e\u0434\u043f\u0438\u0441\u043a\u0435"
        }, {
          Key: "already-subscribed",
          English: "You already purchased this product.",
          "Simplified Chinese": "\u60a8\u5df2\u7ecf\u8d2d\u4e70\u4e86\u6b64\u4ea7\u54c1",
          "Traditional Chinese": "\u60a8\u5df2\u7ecf\u8d2d\u4e70\u4e86\u6b64\u4ea7\u54c1",
          Japanese: "\u3053\u3061\u3089\u306e\u5546\u54c1\u306f\u8cfc\u5165\u6e08\u307f\u3067\u3059",
          Spanish: "Ya ha adquirido este producto.",
          Russian: "\u0412\u044b \u0443\u0436\u0435 \u043f\u0440\u0435\u043e\u0431\u0440\u0435\u043b\u0438 \u044d\u0442\u043e\u0442 \u043f\u0440\u043e\u0434\u0443\u043a\u0442"
        }, {
          Key: "plantDetail-title",
          English: "Nature Guardian",
          "Simplified Chinese": "\u81ea\u7136\u5b88\u62a4\u8005",
          "Traditional Chinese": "\u81ea\u7136\u5b88\u62a4\u8005",
          Japanese: "\u30ac\u30fc\u30c7\u30a3\u30a2\u30f3",
          Spanish: "Guardi\xe1n de la naturaleza",
          Russian: "\u0417\u0430\u0449\u0438\u0442\u043d\u0438\u043a \u041f\u0440\u0438\u0440\u043e\u0434\u044b"
        }, {
          Key: "plantDetail-tip",
          English: "Unlocked",
          "Simplified Chinese": "\u5df2\u89e3\u9501",
          "Traditional Chinese": "\u5df2\u89e3\u9501",
          Japanese: "\u30a2\u30f3\u30ed\u30c3\u30af\u6e08\u307f",
          Spanish: "desbloqueado",
          Russian: "\u041e\u0442\u043a\u0440\u044b\u0442\u043e"
        }, {
          Key: "roulette-title",
          English: "Roulette",
          "Simplified Chinese": "\u81ea\u7136\u5927\u8f6c\u76d8",
          "Traditional Chinese": "\u81ea\u7136\u5927\u8f6c\u76d8",
          Japanese: "\u30eb\u30fc\u30ec\u30c3\u30c8",
          Spanish: "Ruleta",
          Russian: "\u0420\u0443\u043b\u0435\u0442\u043a\u0430"
        }, {
          Key: "ad-tip",
          English: "Ad initialization is not complete",
          "Simplified Chinese": "\u5e7f\u544a\u64ad\u653e\u9519\u8bef",
          "Traditional Chinese": "\u5e7f\u544a\u64ad\u653e\u9519\u8bef",
          Japanese: "\u5e83\u544a\u304c\u8868\u793a\u3067\u304d\u307e\u305b\u3093",
          Spanish: "inicializaci\xf3n del anuncio no es completa",
          Russian: "\u0418\u043d\u0438\u0446\u0438\u0430\u043b\u0438\u0437\u0430\u0446\u0438\u044f \u0440\u0435\u043a\u043b\u0430\u043c\u044b \u043d\u0435 \u0437\u0430\u0432\u0435\u0440\u0448\u0438\u043b\u0430\u0441\u044c"
        }, {
          Key: "ad-tip-2",
          English: "Failed to load ads",
          "Simplified Chinese": "\u5e7f\u544a\u52a0\u8f7d\u9519\u8bef",
          "Traditional Chinese": "\u5e7f\u544a\u52a0\u8f7d\u9519\u8bef",
          Japanese: "\u5e83\u544a\u304c\u8868\u793a\u3067\u304d\u307e\u305b\u3093",
          Spanish: "No se ha podido anuncios de carga",
          Russian: "\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c \u0440\u0435\u043a\u043b\u0430\u043c\u0443"
        }, {
          Key: "policy-label",
          English: "PRIVACY POLICY",
          "Simplified Chinese": "\u9690\u79c1\u653f\u7b56",
          "Traditional Chinese": "\u9690\u79c1\u653f\u7b56",
          Japanese: "\u30d7\u30e9\u30a4\u30d0\u30b7\u30fc\u30dd\u30ea\u30b7\u30fc",
          Spanish: "POL\xcdTICA DE PRIVACIDAD",
          Russian: "\u041f\u041e\u041b\u0418\u0422\u0418\u041a\u0410 \u041a\u041e\u041d\u0424\u0418\u0414\u0415\u041d\u0426\u0418\u0410\u041b\u042c\u041d\u041e\u0421\u0422\u0418"
        }, {
          Key: "and",
          English: "AND",
          "Simplified Chinese": "\u4ee5\u53ca",
          "Traditional Chinese": "\u4ee5\u53ca",
          Japanese: "\u53ca\u3073",
          Spanish: "Y",
          Russian: "\u0418"
        }, {
          Key: "service-label",
          English: "TERMS OF SERVICE",
          "Simplified Chinese": "\u670d\u52a1\u6761\u6b3e",
          "Traditional Chinese": "\u670d\u52a1\u6761\u6b3e",
          Japanese: "\u5229\u7528\u898f\u7d04",
          Spanish: "T\xc9RMINOS DE SERVICIO",
          Russian: "\u0423\u0421\u041b\u041e\u0412\u0418\u042f \u041e\u0411\u0421\u041b\u0423\u0416\u0418\u0412\u0410\u041d\u0418\u042f"
        }, {
          Key: "dailyBonusTip",
          English: "Claim your Daily Bonuses!",
          "Simplified Chinese": "\u9886\u53d6\u6bcf\u65e5\u5956\u52b1",
          "Traditional Chinese": "\u9886\u53d6\u6bcf\u65e5\u5956\u52b1",
          Japanese: "\u30c7\u30a4\u30ea\u30fc\u30dc\u30fc\u30ca\u30b9\u3092\u30b2\u30c3\u30c8\u3057\u3088\u3046\uff01",
          Spanish: "Reclamar sus bonos diarios!",
          Russian: "\u0412\u043e\u0437\u044c\u043c\u0438\u0442\u0435 \u0441\u0432\u043e\u0438 \u0414\u043d\u0435\u0432\u043d\u044b\u0435 \u0411\u043e\u043d\u0443\u0441\u044b!"
        }, {
          Key: "taskTip",
          English: "Claim your Mission Rewards!",
          "Simplified Chinese": "\u9886\u53d6\u4efb\u52a1\u5956\u52b1",
          "Traditional Chinese": "\u9886\u53d6\u4efb\u52a1\u5956\u52b1",
          Japanese: "\u30df\u30c3\u30b7\u30e7\u30f3\u5831\u916c\u3092\u30b2\u30c3\u30c8\u3057\u3088\u3046\uff01",
          Spanish: "Reclamar su misi\xf3n Rewards!",
          Russian: "\u0412\u043e\u0437\u044c\u043c\u0438\u0442\u0435 \u0441\u0432\u043e\u0438 \u041d\u0430\u0433\u0440\u0430\u0434\u044b \u0437\u0430 \u041c\u0438\u0441\u0441\u0438\u0438!"
        }, {
          Key: "zoomTip",
          English: "You can zoom in/out here!",
          "Simplified Chinese": "\u70b9\u51fb\u6b64\u5904\u653e\u5927\u7f29\u5c0f",
          "Traditional Chinese": "\u70b9\u51fb\u6b64\u5904\u653e\u5927\u7f29\u5c0f",
          Japanese: "\u3053\u3053\u3067\u8868\u793a\u753b\u9762\u3092\u62e1\u5927\u30fb\u7e2e\u5c0f\uff01",
          Spanish: "Puede hacer zoom in / out aqu\xed!",
          Russian: "\u041c\u043e\u0436\u0435\u0442\u0435 \u0443\u0432\u0435\u043b\u0438\u0447\u0438\u0442\u044c/\u0443\u043c\u0435\u043d\u044c\u0448\u0438\u0442\u044c \u0437\u0434\u0435\u0441\u044c"
        }, {
          Key: "vip-tip-01",
          English: "You need to subscribe vip first!",
          "Simplified Chinese": "\u60a8\u9700\u8981\u8ba2\u9605VIP\u6765\u4f7f\u7528\u6b64\u529f\u80fd\uff01",
          "Traditional Chinese": "\u60a8\u9700\u8981\u8ba2\u9605VIP\u6765\u4f7f\u7528\u6b64\u529f\u80fd\uff01",
          Japanese: "VIP\u30b5\u30d6\u30b9\u30af\u30ea\u30d7\u30b7\u30e7\u30f3\u304c\u5fc5\u8981\u3067\u3059\uff01",
          Spanish: "Es necesario suscribirse vip primero!",
          Russian: "\u0421\u043f\u0435\u0440\u0432\u0430 \u043d\u0443\u0436\u043d\u0430 VIP \u043f\u043e\u0434\u043f\u0438\u0441\u043a\u0430"
        }, {
          Key: "unlock-fort-tip",
          English: "Unlock Fort to fight the enemies!",
          "Simplified Chinese": "\u89e3\u9501\u70ae\u53f0\u6765\u963b\u51fb\u602a\u7269\u5927\u519b\uff01",
          "Traditional Chinese": "\u89e3\u9501\u70ae\u53f0\u6765\u963b\u51fb\u602a\u7269\u5927\u519b\uff01",
          Japanese: "\u8981\u585e\u3092\u30a2\u30f3\u30ed\u30c3\u30af\u3057\u3066\u6575\u3068\u6226\u304a\u3046\uff01",
          Spanish: "Desbloquear la fortaleza para luchar contra los enemigos!",
          Russian: "\u041e\u0442\u043a\u0440\u043e\u0439\u0442\u0435 \u0424\u043e\u0440\u0442, \u0447\u0442\u043e\u0431\u044b \u043e\u0442\u0431\u0438\u0442\u044c\u0441\u044f \u043e\u0442 \u0432\u0440\u0430\u0433\u043e\u0432"
        }, {
          Key: "notification-title-1",
          English: "Guardian Hint 1",
          "Simplified Chinese": "\u5b88\u62a4\u8005\u79d8\u5bc6\u2460",
          "Traditional Chinese": "\u5b88\u62a4\u8005\u79d8\u5bc6\u2460",
          Japanese: "\u30ac\u30fc\u30c7\u30a3\u30a2\u30f3\u3000\u30d2\u30f3\u30c8\u2460",
          Spanish: "Guardi\xe1n Pista 1",
          Russian: "\u041f\u043e\u0434\u0441\u043a\u0430\u0437\u043a\u0430 \u0417\u0430\u0449\u0438\u0442\u043d\u0438\u043a\u0430 1"
        }, {
          Key: "notification-content-1",
          English: "You can get double gems of daily bonus if you claim it between 5pm - 11pm!",
          "Simplified Chinese": "\u6bcf\u65e5\u5956\u52b1\u572817:00~23:00\u53ef\u4ee5\u53cc\u500d\u9886\u53d6\uff01",
          "Traditional Chinese": "\u6bcf\u65e5\u5956\u52b1\u572817:00~23:00\u53ef\u4ee5\u53cc\u500d\u9886\u53d6\uff01",
          Japanese: "17\u6642\u301c23\u6642\u306b\u30ed\u30b0\u30a4\u30f3\u3059\u308b\u3068\u304c\u30c7\u30a4\u30ea\u30fc\u30dc\u30fc\u30ca\u30b9\u304c\uff12\u500d\u306b\uff01",
          Spanish: "Puede obtener dobles gemas de bonificaci\xf3n al d\xeda, si usted afirma que entre 17:00-23:00!",
          Russian: "\u041c\u043e\u0436\u0435\u0442\u0435 \u043f\u043e\u043b\u0443\u0447\u0438\u0442\u044c \u0434\u0432\u043e\u0439\u043d\u044b\u0435 \u0436\u0435\u043c\u0447\u0443\u0433\u0430 \u0434\u043d\u0435\u0432\u043d\u043e\u0433\u043e \u0431\u043e\u043d\u0443\u0441\u0430 \u043c\u0435\u0436\u0434\u0443 5-\u044e \u0438 11-\u044e \u0432\u0435\u0447\u0435\u0440\u0430"
        }, {
          Key: "notification-title-2",
          English: "Call for HELP!",
          "Simplified Chinese": "\u8bf7\u6c42\u652f\u63f4\uff01",
          "Traditional Chinese": "\u8bf7\u6c42\u652f\u63f4\uff01",
          Japanese: "\u30d8\u30eb\u30d7\u3092\u8981\u8acb\uff01",
          Spanish: "\xa1Llamar por ayuda!",
          Russian: "\u041d\u0443\u0436\u043d\u0430 \u041f\u041e\u0414\u041c\u041e\u0413\u0410!"
        }, {
          Key: "notification-content-2",
          English: "Nature needs your help to defend against the MuckMonger Pollution Army!",
          "Simplified Chinese": "\u5927\u81ea\u7136\u73b0\u5728\u9700\u8981\u4f60\u7684\u652f\u63f4\u6765\u62b5\u5fa1\u6c61\u67d3\u5927\u519b\uff01",
          "Traditional Chinese": "\u5927\u81ea\u7136\u73b0\u5728\u9700\u8981\u4f60\u7684\u652f\u63f4\u6765\u62b5\u5fa1\u6c61\u67d3\u602a\u7269\u5927\u519b\uff01",
          Japanese: "\u6c5a\u30e2\u30f3\u30b9\u30bf\u30fc\u8ecd\u56e3\u304b\u3089\u5927\u81ea\u7136\u3092\u5b88\u308d\u3046\uff01",
          Spanish: "La naturaleza necesita su ayuda para defenderse contra el Ej\xe9rcito de la contaminaci\xf3n MuckMonger!",
          Russian: "\u041f\u0440\u0438\u0440\u043e\u0434\u0435 \u043d\u0443\u0436\u043d\u0430 \u0412\u0430\u0448\u0430 \u043f\u043e\u043c\u043e\u0449\u044c, \u0447\u0442\u043e\u0431\u044b \u043e\u0442\u0431\u0438\u0442\u044c\u0441\u044f \u043e\u0442 \u0410\u0440\u043c\u0438\u0438 \u041d\u0435\u0447\u0438\u0441\u0442\u0438!"
        }, {
          Key: "notification-title-3",
          English: "Guardian Hint 2",
          "Simplified Chinese": "\u5b88\u62a4\u8005\u79d8\u5bc6\u2461",
          "Traditional Chinese": "\u5b88\u62a4\u8005\u79d8\u5bc6\u2461",
          Japanese: "\u30ac\u30fc\u30c7\u30a3\u30a2\u30f3\u3000\u30d2\u30f3\u30c8\u2461",
          Spanish: "Guardi\xe1n Pista 2",
          Russian: "\u041f\u043e\u0434\u0441\u043a\u0430\u0437\u043a\u0430 \u0417\u0430\u0449\u0438\u0442\u043d\u0438\u043a\u0430 1"
        }, {
          Key: "notification-content-3",
          English: "Try a new Guardian layout strategy and defend Nature from the MuckMonger Pollution Army!",
          "Simplified Chinese": "\u5c1d\u8bd5\u65b0\u7684\u4f4d\u7f6e\u7b56\u7565\u6765\u66f4\u597d\u7684\u62b5\u5fa1\u6c61\u67d3\u5927\u519b\u7684\u653b\u51fb\u5427\uff01",
          "Traditional Chinese": "\u5c1d\u8bd5\u65b0\u7684\u4f4d\u7f6e\u7b56\u7565\u6765\u66f4\u597d\u7684\u62b5\u5fa1\u6c61\u67d3\u602a\u7269\u5927\u519b\u7684\u653b\u51fb\u5427\uff01",
          Japanese: "\u30ac\u30fc\u30c7\u30a3\u30a2\u30f3\u306e\u914d\u7f6e\u3092\u5de5\u592b\u3057\u3066\u6c5a\u30e2\u30f3\u30b9\u30bf\u30fc\u8ecd\u56e3\u3092\u6483\u9000\u3057\u3088\u3046\uff01",
          Spanish: "Intentar una nueva estrategia de dise\xf1o guarda y defensa de la naturaleza de la contaminaci\xf3n del Ej\xe9rcito MuckMonger!",
          Russian: "\u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u043d\u043e\u0432\u0443\u044e \u0441\u0442\u0440\u0430\u0442\u0435\u0433\u0438\u044e \u0440\u0430\u0441\u043f\u043e\u043b\u043e\u0436\u0435\u043d\u0438\u044f \u0417\u0430\u0449\u0438\u0442\u043d\u0438\u043a\u043e\u0432, \u0447\u0442\u043e\u0431\u044b \u0437\u0430\u0449\u0438\u0442\u0438\u0442\u044c \u043f\u0440\u0438\u0440\u043e\u0434\u0443 \u043e\u0442 \u0410\u0440\u043c\u0438\u0438 \u041d\u0435\u0447\u0438\u0441\u0442\u0438!"
        }, {
          Key: "notification-title-4",
          English: "Knock Knock, Nature Commander!",
          "Simplified Chinese": "\u60a8\u597d\uff0c\u6307\u6325\u5b98\uff01",
          "Traditional Chinese": "\u60a8\u597d\uff0c\u6307\u6325\u5b98\uff01",
          Japanese: "\u3082\u3057\u3082\u3057\u3001\u968a\u9577\uff01",
          Spanish: "Golpe del golpe, la naturaleza comandante!",
          Russian: "\u0422\u0443\u043a-\u0442\u0443\u043a, \u041a\u043e\u043c\u0430\u043d\u0434\u0438\u0440 \u0417\u0430\u0449\u0438\u0442\u044b \u041f\u0440\u0438\u0440\u043e\u0434\u044b!"
        }, {
          Key: "notification-content-4",
          English: "You have an appointment with the Natural Guardians to defend Nature!",
          "Simplified Chinese": "\u5230\u4e86\u548c\u5b88\u62a4\u8005\u4e00\u8d77\u4fdd\u536b\u5927\u81ea\u7136\u7684\u65f6\u95f4\u4e86\uff01",
          "Traditional Chinese": "\u5230\u4e86\u548c\u5b88\u62a4\u8005\u4e00\u8d77\u4fdd\u536b\u5927\u81ea\u7136\u7684\u65f6\u95f4\u4e86\uff01",
          Japanese: "\u30ac\u30fc\u30c7\u30a3\u30a2\u30f3\u3068\u4e00\u7dd2\u306b\u5927\u81ea\u7136\u3092\u5b88\u308b\u6642\u9593\u3067\u3059\uff01",
          Spanish: "Usted tiene una cita con los tutores naturales para defender la naturaleza!",
          Russian: "\u0423 \u0412\u0430\u0441 \u0440\u0430\u043d\u0434\u0435\u0432\u0443 \u0441 \u0417\u0430\u0449\u0438\u0442\u043d\u0438\u043a\u0430\u043c\u0438, \u0447\u0442\u043e\u0431\u044b \u0437\u0430\u0449\u0438\u0442\u0438\u0442\u044c \u041f\u0440\u0438\u0440\u043e\u0434\u0443!"
        }, {
          Key: "notification-title-5",
          English: "Got time now?",
          "Simplified Chinese": "\u5728\u5417\uff1f",
          "Traditional Chinese": "\u5728\u5417\uff1f",
          Japanese: "\u4eca\u3001\u6642\u9593\u3042\u308b\uff1f",
          Spanish: "Tienes tiempo ahora?",
          Russian: "\u0415\u0441\u0442\u044c \u0432\u0440\u0435\u043c\u044f?"
        }, {
          Key: "notification-content-5",
          English: "Natural Guardians have been busy fighting while you were away! Come get your reward!",
          "Simplified Chinese": "\u60a8\u4e0d\u5728\u7684\u65f6\u5019\uff0c\u5b88\u62a4\u8005\u4eec\u4e00\u76f4\u5728\u548c\u6c61\u67d3\u5927\u519b\u4f5c\u6218\uff0c\u5feb\u6765\u9886\u53d6\u4ed6\u4eec\u5e2e\u60a8\u6323\u53d6\u7684\u5956\u52b1\uff01",
          "Traditional Chinese": "\u60a8\u4e0d\u5728\u7684\u65f6\u5019\uff0c\u5b88\u62a4\u8005\u4eec\u4e00\u76f4\u5728\u548c\u6c61\u67d3\u602a\u7269\u5927\u519b\u4f5c\u6218\uff0c\u5feb\u6765\u9886\u53d6\u4ed6\u4eec\u5e2e\u60a8\u6323\u53d6\u7684\u5956\u52b1\uff01",
          Japanese: "\u30aa\u30d5\u30e9\u30a4\u30f3\u6642\u306b\u30ac\u30fc\u30c7\u30a3\u30a2\u30f3\u304c\u5fc5\u6b7b\u306b\u6226\u3063\u3066\u305f\u305e\uff01 \u5831\u916c\u3092\u30b2\u30c3\u30c8\u3057\u3088\u3046\uff01",
          Spanish: "Guardianes naturales han sido ocupados luchando en su ausencia! Ven obtener su recompensa!",
          Russian: "\u0417\u0430\u0449\u0438\u0442\u043d\u0438\u043a\u0438 \u0443\u0447\u0430\u0441\u0442\u0432\u043e\u0432\u0430\u043b\u0438 \u0432 \u0431\u0438\u0442\u0432\u0430\u0445, \u043f\u043e\u043a\u0430 \u0412\u0430\u0441 \u043d\u0435 \u0431\u044b\u043b\u043e! \u041f\u0440\u0438\u043d\u0438\u043c\u0430\u0439\u0442\u0435 \u043d\u0430\u0433\u0440\u0430\u0434\u044b!"
        }, {
          Key: "notification-title-6",
          English: "Never Give Up!",
          "Simplified Chinese": "\u4e0d\u8981\u653e\u5f03\uff01",
          "Traditional Chinese": "\u4e0d\u8981\u653e\u5f03\uff01",
          Japanese: "\u7d76\u5bfe\u306b\u8ae6\u3081\u308b\u306a\uff01",
          Spanish: "\xa1Nunca te rindas!",
          Russian: "\u041d\u0438\u043a\u043e\u0433\u0434\u0430 \u043d\u0435 \u0441\u0434\u0430\u0432\u0430\u0439\u0442\u0435\u0441\u044c!"
        }, {
          Key: "notification-content-6",
          English: "Strike back! Show the MuckMongers who\u2019s the Boss!!",
          "Simplified Chinese": "\u52c7\u6562\u53cd\u51fb\uff01\u8ba9\u6c61\u67d3\u519b\u56e2\u770b\u770b\u8c01\u624d\u662f\u8001\u5927\uff01",
          "Traditional Chinese": "\u52c7\u6562\u53cd\u51fb\uff01\u8ba9\u6c61\u67d3\u602a\u7269\u519b\u56e2\u770b\u770b\u8c01\u624d\u662f\u8001\u5927\uff01",
          Japanese: "\u30ea\u30d9\u30f3\u30b8\u3060\uff01 \u6c5a\u30e2\u30f3\u30b9\u30bf\u30fc\u8ecd\u56e3\u3092\u5012\u305d\u3046\uff01",
          Spanish: "\xa1Golpear de vuelta! Mostrar los MuckMongers qui\xe9n manda !!",
          Russian: "\u041e\u0442\u0431\u0438\u0432\u0430\u0439\u0442\u0435\u0441\u044c! \u041f\u043e\u043a\u0430\u0436\u0438\u0442\u0435 \u0413\u0430\u0434\u043e\u0432\u043e\u0434\u0430\u043c, \u043a\u0442\u043e \u0437\u0434\u0435\u0441\u044c \u0433\u043b\u0430\u0432\u043d\u044b\u0439!"
        }, {
          Key: "notification-title-7",
          English: "The MuckMongers are chanting!",
          "Simplified Chinese": "\u6c61\u67d3\u519b\u56e2\u53c8\u5728\u6311\u8845\u4e86\uff01",
          "Traditional Chinese": "\u6c61\u67d3\u602a\u7269\u519b\u56e2\u53c8\u5728\u6311\u8845\u4e86\uff01",
          Japanese: "\u6c5a\u30e2\u30f3\u30b9\u30bf\u30fc\u304c\u6311\u767a\u3057\u3066\u308b\u305e\uff01",
          Spanish: "Los MuckMongers est\xe1n cantando!",
          Russian: "\u0413\u0430\u0434\u043e\u0432\u043e\u0434\u044b \u043d\u0430\u0447\u0430\u043b\u0438 \u0440\u0430\u0441\u043f\u0435\u0432\u0430\u0442\u044c \u043f\u0435\u0441\u043d\u0438!"
        }, {
          Key: "notification-content-7",
          English: "We came! We saw! We will conquer Nature!!",
          "Simplified Chinese": "\u6211\u4eec\u62b1\u7740\u5fc5\u80dc\u7684\u51b3\u5fc3\uff0c\u4e00\u5b9a\u4f1a\u653b\u9677\u5927\u81ea\u7136\u7684\uff01\uff01",
          "Traditional Chinese": "\u6211\u4eec\u6765\u4e86\uff0c\u5e76\u4e14\u4e00\u5b9a\u4f1a\u653b\u9677\u5927\u81ea\u7136\u7684\uff01 \uff01",
          Japanese: "\u6211\u3005\u306f\u6765\u305f\u3001\u898b\u305f\u3001\u305d\u3057\u3066\u52dd\u3064",
          Spanish: "\xa1Vinimos! \xa1Nosotros vimos! Vamos a conquistar la naturaleza !!",
          Russian: "\u041c\u044b \u043f\u0440\u0438\u0448\u043b\u0438! \u041c\u044b \u0443\u0432\u0438\u0434\u0435\u043b\u0438! \u041c\u044b \u0437\u0430\u0432\u043e\u044e\u0435\u043c \u041f\u0440\u0438\u0440\u043e\u0434\u0443!"
        }, {
          Key: "free-double-daily-tip",
          English: "Daily Bonus is doubled 5pm - 11pm everyday!",
          "Simplified Chinese": "\u6bcf\u65e5\u5956\u52b1\u572817:00~23:00\u53ef\u4ee5\u53cc\u500d\u9886\u53d6\uff01",
          "Traditional Chinese": "\u6bcf\u65e5\u5956\u52b1\u572817:00~23:00\u53ef\u4ee5\u53cc\u500d\u9886\u53d6\uff01",
          Japanese: "17\u6642\u301c23\u6642\u306b\u30ed\u30b0\u30a4\u30f3\u3059\u308b\u3068\n\u30c7\u30a4\u30ea\u30fc\u30dc\u30fc\u30ca\u30b9\u304c\uff12\u500d\u306b\uff01",
          Spanish: "Bonificaci\xf3n diaria se duplica 17:00-23:00 todos los d\xedas!",
          Russian: "\u0414\u043d\u0435\u0432\u043d\u043e\u0439 \u0411\u043e\u043d\u0443\u0441 \u0443\u0434\u0432\u043e\u0435\u043d \u0441 5-\u0438 \u0434\u043e \n 11-\u0438 \u0432\u0435\u0447\u0435\u0440\u0430 \u043a\u0430\u0436\u0434\u044b\u0439 \u0434\u0435\u043d\u044c!"
        }, {
          Key: "ad-tip-3",
          English: "No ads available",
          "Simplified Chinese": "\u6ca1\u6709\u5e7f\u544a\u53ef\u770b",
          "Traditional Chinese": "\u6ca1\u6709\u5e7f\u544a\u53ef\u770b",
          Japanese: "\u5e83\u544a\u304c\u3042\u308a\u307e\u305b\u3093",
          Spanish: "No hay anuncios disponibles",
          Russian: "\u0420\u0435\u043a\u043b\u0430\u043c\u0430 \u043d\u0435 \u0434\u043e\u0441\u0442\u0443\u043f\u043d\u0430"
        }, {
          Key: "payment-max-ad-count-tip",
          English: "Come back tomorrow!",
          "Simplified Chinese": "\u660e\u5929\u518d\u6765\u8bd5\u8bd5\uff01",
          "Traditional Chinese": "\u660e\u5929\u518d\u6765\u8bd5\u8bd5\uff01",
          Japanese: "\u660e\u65e5\u3082\u6765\u3066\u306d\uff01",
          Spanish: "\xa1Vuelve ma\xf1ana!",
          Russian: "\u0412\u0435\u0440\u043d\u0438\u0442\u0435\u0441\u044c \u0437\u0430\u0432\u0442\u0440\u0430!"
        }, {
          Key: "updateAvailable-tip",
          English: "Guardian Master! An update is available in the {0}. Update Now and check what's new!",
          "Simplified Chinese": "\u6307\u6325\u5b98\uff01{0}\u91cc\u6709\u66f4\u65b0\u53ef\u4ee5\u5b89\u88c5\uff0c\u5feb\u53bb\u770b\u770b\u6709\u4ec0\u4e48\u65b0\u7684\u5185\u5bb9\uff01",
          "Traditional Chinese": "\u6307\u6325\u5b98\uff01 {0}\u91cc\u6709\u66f4\u65b0\u53ef\u4ee5\u5b89\u88c5\uff0c\u5feb\u53bb\u770b\u770b\u6709\u4ec0\u4e48\u65b0\u7684\u5185\u5bb9\uff01",
          Japanese: "\u968a\u9577\uff01 {0}\u306b\u65b0\u305f\u306a\u30a2\u30c3\u30d7\u30c7\u30fc\u30c8\u304c\u3042\u308a\u307e\u3059\u3002 \u4eca\u3059\u3050\u66f4\u65b0\u3057\u3066\u6700\u65b0\u30b3\u30f3\u30c6\u30f3\u30c4\u3092\u30b2\u30c3\u30c8\u3057\u3046\u3088\u3046\uff01",
          Spanish: "Guardi\xe1n Maestro! Una actualizaci\xf3n est\xe1 disponible en el {0}. Actualizar ahora y comprobaci\xf3n de lo que hay de nuevo!",
          Russian: "\u041c\u0430\u0441\u0442\u0435\u0440 \u0417\u0430\u0449\u0438\u0442\u043d\u0438\u043a\u043e\u0432! \u0413\u043e\u0442\u043e\u0432\u043e \u043e\u0431\u043d\u043e\u0432\u043b\u0435\u043d\u0438\u0435 \u0432 {0}. \u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0439\u0442\u0435, \u0438 \u0441\u043c\u043e\u0442\u0440\u0438\u0442\u0435, \u0447\u0442\u043e \u043d\u043e\u0432\u043e\u0433\u043e!"
        }, {
          Key: "updateAvailable-update-now",
          English: "Update Now",
          "Simplified Chinese": "\u73b0\u5728\u66f4\u65b0",
          "Traditional Chinese": "\u73b0\u5728\u66f4\u65b0",
          Japanese: "\u4eca\u3059\u3050\u66f4\u65b0",
          Spanish: "Actualizar ahora",
          Russian: "\u041e\u0431\u043d\u043e\u0432\u0438\u0442\u044c \u0441\u0435\u0439\u0447\u0430\u0441"
        }, {
          Key: "updateAvailable-next-time",
          English: "Next Time",
          "Simplified Chinese": "\u4e0b\u6b21\u518d\u8bf4",
          "Traditional Chinese": "\u4e0b\u6b21\u518d\u8bf4",
          Japanese: "\u6b21\u56de",
          Spanish: "La pr\xf3xima vez",
          Russian: "\u0412 \u0441\u043b\u0435\u0434\u0443\u044e\u0449\u0438\u0439 \u0440\u0430\u0437"
        }, {
          Key: "enjoyNature-title",
          English: "Enjoying Nature SB?",
          "Simplified Chinese": "\u559c\u6b22\u6211\u4eec\u7684\u6e38\u620f\u5417\uff1f",
          "Traditional Chinese": "\u559c\u6b22\u6211\u4eec\u7684\u6e38\u620f\u5417\uff1f",
          Japanese: "\u3053\u306e\u30b2\u30fc\u30e0\u697d\u3057\u3093\u3067\u308b\uff1f",
          Spanish: "Disfrutando de la naturaleza SB?",
          Russian: "\u041d\u0440\u0430\u0432\u0438\u0442\u0441\u044f \u0418\u0433\u0440\u0430\u0442\u044c?"
        }, {
          Key: "enjoyNature-tip",
          English: "Tell us if you love our game!",
          "Simplified Chinese": "\u8bf7\u544a\u8bc9\u6211\u4eec\n\u5982\u679c\u60a8\u4e5f\u559c\u6b22\u6211\u4eec\u7684\u6e38\u620f\uff01",
          "Traditional Chinese": "\u8bf7\u4e0d\u541d\u6307\u6559\uff0c\u5982\u679c\u559c\u6b22\u6211\u4eec\u7684\u6e38\u620f\uff01",
          Japanese: "\u697d\u3057\u3051\u308c\u3070\u8a55\u4fa1\u3057\u3066\u306d\uff01",
          Spanish: "Dinos si te gusta nuestro juego!",
          Russian: "\u0420\u0430\u0441\u0441\u043a\u0430\u0436\u0438\u0442\u0435, \u043d\u0440\u0430\u0432\u0438\u0442\u0441\u044f \u043b\u0438 \u0432\u0430\u043c \u0438\u0433\u0440\u0430!"
        }, {
          Key: "enjoyNature-next-time",
          English: "Next Time",
          "Simplified Chinese": "\u4e0b\u6b21",
          "Traditional Chinese": "\u4e0b\u6b21\u518d\u8bf4",
          Japanese: "\u6b21\u56de",
          Spanish: "La pr\xf3xima vez",
          Russian: "\u0412 \u0441\u043b\u0435\u0434\u0443\u044e\u0449\u0438\u0439 \u0440\u0430\u0437"
        }, {
          Key: "enjoyNature-rate-now",
          English: "Love It",
          "Simplified Chinese": "\u8d85\u7231",
          "Traditional Chinese": "\u7ed9\u4e2a\u597d\u8bc4",
          Japanese: "\u3044\u3044\u306d\uff01",
          Spanish: "Qui\xe9ralo",
          Russian: "\u041d\u0440\u0430\u0432\u0438\u0442\u0441\u044f"
        }, {
          Key: "btn-double",
          English: "Double",
          "Simplified Chinese": "\u52a0\u500d",
          "Traditional Chinese": "\u52a0\u500d",
          Japanese: "\uff12\u500d",
          Spanish: "Doble",
          Russian: "\u0423\u0434\u0432\u043e\u0438\u0442\u044c"
        }, {
          Key: "btn-retry",
          English: "Retry",
          "Simplified Chinese": "\u91cd\u65b0\u6311\u6218",
          "Traditional Chinese": "\u91cd\u65b0\u6311\u6218",
          Japanese: "\u518d\u6311\u6226",
          Spanish: "Rever",
          Russian: "\u0415\u0449\u0451 \u0440\u0430\u0437"
        }, {
          Key: "enjoyNature-rated",
          English: "Already Rated",
          "Simplified Chinese": "\u5df2\u7ecf\u8bc4\u4ef7",
          "Traditional Chinese": "\u5df2\u7ecf\u8bc4\u4ef7",
          Japanese: "\u8a55\u4fa1\u6e08\u307f",
          Spanish: "ya nominal",
          Russian: "\u0423\u0436\u0435 \u043e\u0446\u0435\u043d\u0435\u043d\u043e"
        }, {
          Key: "compensation-des",
          English: "Thanks for being among the first wave of warriors to come to Nature's Defense. \nThe fight continues!",
          "Simplified Chinese": "\u611f\u8c22\u60a8\u6210\u4e3a\u7b2c\u4e00\u6279\u52c7\u6562\u7684\u6307\u6325\u5b98\uff01 \n\u6218\u6597\u4ecd\u5c06\u7ee7\u7eed!",
          "Traditional Chinese": "\u611f\u8c22\u60a8\u6210\u4e3a\u7b2c\u4e00\u6279\u52c7\u6562\u7684\u6307\u6325\u5b98\uff01 \n\u6218\u6597\u4ecd\u5c06\u7ee7\u7eed!",
          Japanese: "\u521d\u671f\u306e\u6226\u58eb\u306b\u306a\u3063\u3066\u304f\u308c\u3066\u3042\u308a\u304c\u3068\u3046\uff01  \n\u6226\u3044\u306f\u307e\u3060\u307e\u3060\u7d9a\u304f\u305e\uff01",
          Spanish: "Gracias por estar en la primera ola de guerreros a salir en defensa de la naturaleza.  NEl lucha contin\xfaa!",
          Russian: "\u0421\u043f\u0430\u0441\u0438\u0431\u043e, \u0447\u0442\u043e \u0431\u044b\u043b\u0438 \u0432 \u043f\u0435\u0440\u0432\u043e\u0439 \u0432\u043e\u043b\u043d\u0435 \u0432\u043e\u0438\u043d\u043e\u0432, \u043f\u0440\u0438\u0448\u0435\u0434\u0448\u0438\u0445 \u043d\u0430 \u0437\u0430\u0449\u0438\u0442\u0443 \u043f\u0440\u0438\u0440\u043e\u0434\u044b! \n\u0411\u0438\u0442\u0432\u0430 \u043f\u0440\u043e\u0434\u043e\u043b\u0436\u0430\u0435\u0442\u0441\u044f!"
        }, {
          Key: "bad-connection",
          English: "Network connection unstable",
          "Simplified Chinese": "\u7f51\u7edc\u8fde\u63a5\u4e0d\u7a33\u5b9a",
          "Traditional Chinese": "\u7f51\u7edc\u8fde\u63a5\u4e0d\u7a33\u5b9a",
          Japanese: "\u30cd\u30c3\u30c8\u30ef\u30fc\u30af\u4e0d\u5b89\u5b9a",
          Spanish: "conexi\xf3n de red inestable",
          Russian: "\u0421\u0432\u044f\u0437\u044c \u0441 \u0441\u0435\u0442\u044c\u044e \u043d\u0435\u0443\u0441\u0442\u043e\u0439\u0447\u0438\u0432\u0430\u044f"
        }, {
          Key: "recovery-tip",
          English: "No data available",
          "Simplified Chinese": "\u6ca1\u6709\u76f8\u5e94\u6570\u636e",
          "Traditional Chinese": "\u6ca1\u6709\u76f8\u5e94\u6570\u636e",
          Japanese: "\u56de\u5fa9\u3067\u304d\u308b\u30c7\u30fc\u30bf\u304c\u306a\u3044",
          Spanish: "Datos no disponibles",
          Russian: "\u041d\u0435\u0442 \u0434\u0430\u043d\u043d\u044b\u0445"
        }, {
          Key: "btn-recovery",
          English: "Restore Data",
          "Simplified Chinese": "\u6062\u590d\u6570\u636e",
          "Traditional Chinese": "\u6570\u636e\u56de\u6863",
          Japanese: "\u30c7\u30fc\u30bf\u56de\u5fa9",
          Spanish: "restaurar datos",
          Russian: "\u0412\u043e\u0441\u0441\u0442\u0430\u043d\u043e\u0432\u0438\u0442\u044c \u0434\u0430\u043d\u043d\u044b\u0435"
        }, {
          Key: "coinBundle-tip",
          English: "Purchase {0} coins",
          "Simplified Chinese": "\u8d2d\u4e70{0}\u91d1\u5e01",
          "Traditional Chinese": "\u8d2d\u4e70{0}\u91d1\u5e01",
          Japanese: "{0}\u30b3\u30a4\u30f3\u3092\u8cfc\u5165",
          Spanish: "Compra {0} monedas",
          Russian: "\u041a\u0443\u043f\u0438\u0442\u044c {0} \u043c\u043e\u043d\u0435\u0442"
        }, {
          Key: "coinBundle-tip2",
          English: "Limited Time Special Offer\nPurchase {0} coins",
          "Simplified Chinese": "\u9650\u65f6\u7279\u60e0\n\u8d2d\u4e70{0}\u91d1\u5e01",
          "Traditional Chinese": "\u9650\u65f6\u7279\u60e0\n\u8d2d\u4e70 {0} \u91d1\u5e01",
          Japanese: "\u30bf\u30a4\u30e0\u30bb\u30fc\u30eb\n {0} \u30b3\u30a4\u30f3\u3092\u8cfc\u5165",
          Spanish: "Oferta por tiempo limitado especial  nAdquiera {0} monedas",
          Russian: "\u041a\u0440\u0430\u0442\u043a\u043e\u0441\u0440\u043e\u0447\u043d\u043e\u0435 \u0421\u043f\u0435\u0446\u0438\u0430\u043b\u044c\u043d\u043e\u0435 \u041f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u0435\n\u041a\u0443\u043f\u0438\u0442\u044c {0} \u043c\u043e\u043d\u0435\u0442"
        }, {
          Key: "specialGridBundle-tip",
          English: "Special offer to Unlock the Fort",
          "Simplified Chinese": "\u89e3\u9501\u70ae\u53f0",
          "Traditional Chinese": "\u89e3\u9501\u70ae\u53f0",
          Japanese: "\u8981\u585e\u3092\u30a2\u30f3\u30ed\u30c3\u30af",
          Spanish: "Oferta especial para desbloquear el Fuerte",
          Russian: "\u0421\u043f\u0435\u0446\u0438\u0430\u043b\u044c\u043d\u043e\u0435 \u041f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u0435, \u0447\u0442\u043e\u0431\u044b \u041e\u0442\u043a\u0440\u044b\u0442\u044c \u0424\u043e\u0440\u0442"
        }, {
          Key: "specialGridBundle-tip2",
          English: "Limited Time Special Offer\nUnlock the Fort",
          "Simplified Chinese": "\u9650\u65f6\u7279\u60e0\n\u89e3\u9501\u70ae\u53f0",
          "Traditional Chinese": "\u9650\u65f6\u7279\u60e0\n\u89e3\u9501\u70ae\u53f0",
          Japanese: "\u30bf\u30a4\u30e0\u30bb\u30fc\u30eb\n\u8981\u585e\u3092\u30a2\u30f3\u30ed\u30c3\u30af",
          Spanish: "Oferta por tiempo limitado especial  nUnlock el Fuerte",
          Russian: "\u041a\u0440\u0430\u0442\u043a\u043e\u0441\u0440\u043e\u0447\u043d\u043e\u0435 \u0421\u043f\u0435\u0446\u0438\u0430\u043b\u044c\u043d\u043e\u0435 \u041f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u0435\n\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u0424\u043e\u0440\u0442"
        }, {
          Key: "removeAdBundle-tip",
          English: "Remove banner/interstitial ads",
          "Simplified Chinese": "\u6c38\u4e45\u79fb\u9664\u6a2a\u5e45\u5e7f\u544a\u4ee5\u53ca\u63d2\u5c4f\u5e7f\u544a",
          "Traditional Chinese": "\u6c38\u4e45\u79fb\u9664\u6a2a\u5e45\u5e7f\u544a\u4ee5\u53ca\u63d2\u5c4f\u5e7f\u544a",
          Japanese: "\u5e83\u544a\u3092\u975e\u8868\u793a",
          Spanish: "Retire la bandera / anuncios intersticiales",
          Russian: "\u0423\u0431\u0440\u0430\u0442\u044c \u0431\u0430\u043d\u043d\u0435\u0440\u044b/\u043c\u0435\u0436\u0441\u0442\u0440\u0430\u043d\u0438\u0447\u043d\u044b\u0435 \u043e\u0431\u044a\u044f\u0432\u043b\u0435\u043d\u0438\u044f"
        }, {
          Key: "removeAdBundle-tip2",
          English: "Limited Time Special Offer\nRemove banner/interstitial ads",
          "Simplified Chinese": "\u9650\u65f6\u7279\u60e0\n\u6c38\u4e45\u79fb\u9664\u6a2a\u5e45\u53ca\u63d2\u5c4f\u5e7f\u544a",
          "Traditional Chinese": "\u9650\u65f6\u7279\u60e0\n\u6c38\u4e45\u79fb\u9664\u6a2a\u5e45\u53ca\u63d2\u5c4f\u5e7f\u544a",
          Japanese: "\u30bf\u30a4\u30e0\u30bb\u30fc\u30eb\n\u5e83\u544a\u3092\u975e\u8868\u793a",
          Spanish: "Oferta por tiempo limitado especial  nRemove bandera / anuncios intersticiales",
          Russian: "\u041a\u0440\u0430\u0442\u043a\u043e\u0441\u0440\u043e\u0447\u043d\u043e\u0435 \u0421\u043f\u0435\u0446\u0438\u0430\u043b\u044c\u043d\u043e\u0435 \u041f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u0435\n\u0423\u0431\u0440\u0430\u0442\u044c \u0431\u0430\u043d\u043d\u0435\u0440\u044b/\u043c\u0435\u0436\u0441\u0442\u0440\u0430\u043d\u0438\u0447\u043d\u044b\u0435 \u043e\u0431\u044a\u044f\u0432\u043b\u0435\u043d\u0438\u044f"
        }, {
          Key: "offlineBundle-tip",
          English: "Triple your Offline Earnings",
          "Simplified Chinese": "\u6c38\u4e453\u500d\u79bb\u7ebf\u6536\u76ca",
          "Traditional Chinese": "\u6c38\u4e453\u500d\u79bb\u7ebf\u6536\u76ca",
          Japanese: "\u30aa\u30d5\u30e9\u30a4\u30f3\u53ce\u76ca\u3092\u305a\u3063\u30683\u500d\u306b",
          Spanish: "Duplicar sus ganancias fuera de l\xednea",
          Russian: "\u0423\u0434\u0432\u043e\u0438\u0442\u044c \u043e\u0444\u0444\u043b\u0430\u0439\u043d-\u0437\u0430\u0440\u0430\u0431\u043e\u0442\u043e\u043a"
        }, {
          Key: "bundle-time-tip",
          English: "The offer ends in:",
          "Simplified Chinese": "\u7279\u60e0\u65f6\u95f4\u8fd8\u5269\uff1a",
          "Traditional Chinese": "\u7279\u60e0\u65f6\u95f4\u8fd8\u5269\uff1a",
          Japanese: "\u30bf\u30a4\u30e0\u30bb\u30fc\u30eb\u6b8b\u308a\uff1a",
          Spanish: "La oferta termina en:",
          Russian: "\u041f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u0435 \u0438\u0441\u0442\u0435\u043a\u0430\u0435\u0442 \u0447\u0435\u0440\u0435\u0437: "
        }, {
          Key: "bgm",
          English: "BGM",
          "Simplified Chinese": "\u80cc\u666f\u97f3\u4e50",
          "Traditional Chinese": "\u80cc\u666f\u97f3\u4e50",
          Japanese: "BGM",
          Spanish: "BGM",
          Russian: "\u0424\u043e\u043d-\u043c\u0443\u0437\u044b\u043a\u0430"
        }, {
          Key: "sfx",
          English: "SFX",
          "Simplified Chinese": "\u7279\u6548\u97f3\u4e50",
          "Traditional Chinese": "\u7279\u6548\u97f3\u4e50",
          Japanese: "SFX",
          Spanish: "SFX",
          Russian: "\u042d\u0444\u0444\u0435\u043a\u0442\u044b"
        }, {
          Key: "set-on",
          English: "ON",
          "Simplified Chinese": "\u5f00",
          "Traditional Chinese": "\u5f00",
          Japanese: "\u30aa\u30f3",
          Spanish: "EN",
          Russian: "\u0412\u044b\u043a\u043b\u044e\u0447\u0438\u0442\u044c"
        }, {
          Key: "set-off",
          English: "OFF",
          "Simplified Chinese": "\u5173",
          "Traditional Chinese": "\u5173",
          Japanese: "\u30aa\u30d5",
          Spanish: "APAGADO",
          Russian: "\u0412\u043a\u043b\u044e\u0447\u0438\u0442\u044c"
        }, {
          Key: "set-version",
          English: "Version:",
          "Simplified Chinese": "\u7248\u672c\u53f7\uff1a",
          "Traditional Chinese": "\u7248\u672c\u53f7\uff1a",
          Japanese: "\u30d0\u30fc\u30b8\u30e7\u30f3\uff1a",
          Spanish: "Versi\xf3n:",
          Russian: "\u0412\u0435\u0440\u0441\u0438\u044f: "
        }, {
          Key: "set-copy",
          English: "CopyID",
          "Simplified Chinese": "\u590d\u5236ID",
          "Traditional Chinese": "\u590d\u5236ID",
          Japanese: "ID\u30b3\u30d4\u30fc",
          Spanish: "CopyID",
          Russian: "CopyID"
        }, {
          Key: "restore-coin",
          English: "Coins",
          "Simplified Chinese": "\u91d1\u5e01",
          "Traditional Chinese": "\u91d1\u5e01",
          Japanese: "\u30b3\u30a4\u30f3",
          Spanish: "",
          Russian: "\u041c\u043e\u043d\u0435\u0442\u044b"
        }, {
          Key: "restore-gem",
          English: "Gems",
          "Simplified Chinese": "\u5b9d\u77f3",
          "Traditional Chinese": "\u5b9d\u77f3",
          Japanese: "\u5b9d\u77f3",
          Spanish: "",
          Russian: "\u0416\u0435\u043c\u0447\u0443\u0433\u0430"
        }, {
          Key: "restore-vip",
          English: "VIP Subscription",
          "Simplified Chinese": "VIP\u8ba2\u9605",
          "Traditional Chinese": "VIP\u8ba2\u9605",
          Japanese: "VIP",
          Spanish: "",
          Russian: "VIP \u041f\u043e\u0434\u043f\u0438\u0441\u043a\u0430"
        }, {
          Key: "restore-vipExpire",
          English: "Expiration Time Of VIP",
          "Simplified Chinese": "VIP\u8ba2\u9605\u4e0b\u6b21\u66f4\u65b0",
          "Traditional Chinese": "VIP\u8ba2\u9605\u4e0b\u6b21\u66f4\u65b0",
          Japanese: "VIP\u6b21\u56de\u66f4\u65b0",
          Spanish: "",
          Russian: "\u0418\u0441\u0442\u0435\u0447\u0435\u043d\u0438\u0435 \u041f\u043e\u0434\u043f\u0438\u0441\u043a\u0438 VIP"
        }, {
          Key: "restore-removeAd",
          English: "Ads Removed",
          "Simplified Chinese": "\u53bb\u5e7f\u544a",
          "Traditional Chinese": "\u53bb\u5e7f\u544a",
          Japanese: "\u5e83\u544a\u3092\u975e\u8868\u793a",
          Spanish: "",
          Russian: "\u0420\u0435\u043a\u043b\u0430\u043c\u0430 \u0443\u0431\u0440\u0430\u043d\u0430"
        }, {
          Key: "restore-unlockSpecialGrid",
          English: "Fort Unlocked",
          "Simplified Chinese": "\u89e3\u9501\u70ae\u53f0",
          "Traditional Chinese": "\u89e3\u9501\u70ae\u53f0",
          Japanese: "\u8981\u585e\u3092\u30a2\u30f3\u30ed\u30c3\u30af",
          Spanish: "",
          Russian: "\u0424\u043e\u0440\u0442 \u043e\u0442\u043a\u0440\u044b\u0442"
        }, {
          Key: "restore-offlineDouble",
          English: "Triple Offline Earnings",
          "Simplified Chinese": "\u79bb\u7ebf\u5956\u52b13\u500d",
          "Traditional Chinese": "\u79bb\u7ebf\u5956\u52b13\u500d",
          Japanese: "\u30aa\u30d5\u30e9\u30a4\u30f3\u53ce\u76ca3\u500d",
          Spanish: "",
          Russian: "\u0422\u0440\u043e\u0439\u043d\u043e\u0439 \u043e\u0444\u0444\u043b\u0430\u0439\u043d \u0437\u0430\u0440\u0430\u0431\u043e\u0442\u043e\u043a"
        }, {
          Key: "restore-tip",
          English: "Compensation:",
          "Simplified Chinese": "\u8865\u507f\u7269\u54c1\uff1a",
          "Traditional Chinese": "\u8865\u507f\u7269\u54c1\uff1a",
          Japanese: "\u88dc\u586b\u5546\u54c1\uff1a",
          Spanish: "",
          Russian: "\u041a\u043e\u043c\u043f\u0435\u043d\u0441\u0430\u0446\u0438\u044f:"
        }, {
          Key: "restore-tip-2",
          English: "We're sorry for the trouble we've caused you, \nand we hope you continue to enjoy the game.\nPlease accept these rewards and\n let us know if you continue to have any problems!",
          "Simplified Chinese": "\u6211\u4eec\u4e3a\u60a8\u9047\u5230\u7684\u95ee\u9898\u6df1\u611f\u62b1\u6b49\uff0c\n\u8bf7\u63a5\u53d7\u6211\u4eec\u7684\u8865\u507f\u5e76\u7ee7\u7eed\u4f53\u9a8c\u6211\u4eec\u6e38\u620f\u7684\u4e50\u8da3\uff0c\n\u5982\u679c\u60a8\u6709\u4efb\u4f55\u95ee\u9898\u6b22\u8fce\u968f\u65f6\u8054\u7cfb\u6211\u4eec\uff01",
          "Traditional Chinese": "\u6211\u4eec\u4e3a\u60a8\u9047\u5230\u7684\u95ee\u9898\u6df1\u611f\u62b1\u6b49\uff0c\n\u8bf7\u63a5\u53d7\u6211\u4eec\u7684\u8865\u507f\u5e76\u7ee7\u7eed\u4f53\u9a8c\u6211\u4eec\u6e38\u620f\u7684\u4e50\u8da3\uff0c\n\u5982\u679c\u60a8\u6709\u4efb\u4f55\u95ee\u9898\u6b22\u8fce\u968f\u65f6\u8054\u7cfb\u6211\u4eec\uff01",
          Japanese: "\u3053\u306e\u5ea6\u3001\u30b2\u30fc\u30e0\u306e\u4e0d\u5177\u5408\u306b\u3088\u308a\u3054\u8ff7\u60d1\u3092\u304a\u304b\u3051\u3057\u3001\n\u5927\u5909\u7533\u3057\u8a33\u3054\u3056\u3044\u307e\u305b\u3093\u3067\u3057\u305f\u3002\n\u5f15\u304d\u7d9a\u304d\u3088\u308d\u3057\u304f\u304a\u9858\u3044\u81f4\u3057\u307e\u3059\uff01",
          Spanish: "",
          Russian: "\u0418\u0437\u0432\u0438\u043d\u0438\u0442\u0435 \u0437\u0430 \u043d\u0435\u0443\u0434\u043e\u0431\u0441\u0442\u0432\u043e!\n\u041d\u0430\u0434\u0435\u0435\u043c\u0441\u044f, \u0447\u0442\u043e \u0432\u044b \u043f\u0440\u043e\u0434\u043e\u043b\u0436\u0438\u0442\u0435 \u0438\u0433\u0440\u0430\u0442\u044c.\n\u041f\u043e\u0436\u0430\u043b\u0443\u0439\u0441\u0442\u0430 \u043f\u0440\u0438\u0439\u043c\u0438\u0442\u0435 \u044d\u0442\u0443 \u043d\u0430\u0433\u0440\u0430\u0434\u0443 \u0438\n\u043d\u0430\u043f\u0438\u0448\u0438\u0442\u0435, \u0435\u0441\u043b\u0438 \u0431\u0443\u0434\u0443\u0442 \u0434\u0440\u0443\u0433\u0438\u0435 \u043d\u0435\u0438\u0441\u043f\u0440\u0430\u0432\u043d\u043e\u0441\u0442\u0438."
        }, {
          Key: "language-cn",
          English: "\u7b80\u4f53\u4e2d\u6587",
          "Simplified Chinese": "\u7b80\u4f53\u4e2d\u6587",
          "Traditional Chinese": "\u7b80\u4f53\u4e2d\u6587",
          Japanese: "\u7c21\u4f53\u4e2d\u6587",
          Spanish: "",
          Russian: "\u7b80\u4f53\u4e2d\u6587"
        }, {
          Key: "language-en",
          English: "English",
          "Simplified Chinese": "English",
          "Traditional Chinese": "English",
          Japanese: "English",
          Spanish: "",
          Russian: "English"
        }, {
          Key: "language-jp",
          English: "\u65e5\u672c\u8bed",
          "Simplified Chinese": "\u65e5\u672c\u8bed",
          "Traditional Chinese": "\u65e5\u672c\u8bed",
          Japanese: "\u65e5\u672c\u8a9e",
          Spanish: "",
          Russian: "\u65e5\u672c\u8bed"
        }, {
          Key: "language-tc",
          English: "\u7e41\u4f53\u4e2d\u6587",
          "Simplified Chinese": "\u7e41\u4f53\u4e2d\u6587",
          "Traditional Chinese": "\u7e41\u4f53\u4e2d\u6587",
          Japanese: "\u7e41\u4f53\u4e2d\u6587",
          Spanish: "",
          Russian: "\u7e41\u4f53\u4e2d\u6587"
        }, {
          Key: "language-ru",
          English: "\u0420\u0443\u0441\u0441\u043a\u0438\u0439",
          "Simplified Chinese": "\u0420\u0443\u0441\u0441\u043a\u0438\u0439",
          "Traditional Chinese": "\u0420\u0443\u0441\u0441\u043a\u0438\u0439",
          Japanese: "\u0420\u0443\u0441\u0441\u043a\u0438\u0439",
          Spanish: "\u0420\u0443\u0441\u0441\u043a\u0438\u0439",
          Russian: "\u0420\u0443\u0441\u0441\u043a\u0438\u0439"
        }, {
          Key: "buff-auto",
          English: "Merge Automatically",
          "Simplified Chinese": "\u81ea\u52a8\u5408\u5e76\u5b88\u62a4\u8005",
          "Traditional Chinese": "\u81ea\u52a8\u5408\u5e76\u5b88\u62a4\u8005",
          Japanese: "\u30ac\u30fc\u30c7\u30a3\u30a2\u30f3\u3092\u81ea\u52d5\u30de\u30fc\u30b8",
          Spanish: "",
          Russian: "\u0421\u043e\u0435\u0434\u0438\u043d\u044f\u0442\u044c \u0430\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u0438"
        }, {
          Key: "buff-rage",
          English: "Attack Speed x 1.5",
          "Simplified Chinese": "\u653b\u51fb\u901f\u5ea6 x 1.5",
          "Traditional Chinese": "\u653b\u51fb\u901f\u5ea6x1.5",
          Japanese: "\u653b\u6483\u901f\u5ea6 x 1.5",
          Spanish: "",
          Russian: "\u0421\u043a\u043e\u0440\u043e\u0441\u0442\u044c \u0410\u0442\u0430\u043a\u0438 \u0445 1.5"
        }, {
          Key: "buff-flame",
          English: "Attack Damage x 1.5",
          "Simplified Chinese": "\u653b\u51fb\u4f24\u5bb3 x 1.5",
          "Traditional Chinese": "\u653b\u51fb\u4f24\u5bb3 x 1.5,",
          Japanese: "\u653b\u6483\u529b x 1.5",
          Spanish: "",
          Russian: "\u0423\u0440\u043e\u043d \u0410\u0442\u0430\u043a\u0438 \u0445 1.5"
        }, {
          Key: "buff-freeze",
          English: "Freeze Attack Rate x 2",
          "Simplified Chinese": "\u51b0\u51bb\u6982\u7387 x 2",
          "Traditional Chinese": "\u51b0\u51bb\u6982\u7387 x 2",
          Japanese: "\u6c37\u7d50\u653b\u6483\u7387 x 2",
          Spanish: "",
          Russian: "\u0421\u043a\u043e\u0440\u043e\u0441\u0442\u044c \u0410\u0442\u0430\u043a\u0438 \u041c\u043e\u0440\u043e\u0437\u0430 \u0445 2"
        }, {
          Key: "buff-crit",
          English: "Critical Damage Rate x 2",
          "Simplified Chinese": "\u66b4\u51fb\u6982\u7387 x 2",
          "Traditional Chinese": "\u66b4\u51fb\u6982\u7387 x 2",
          Japanese: "\u30af\u30ea\u30c6\u30a3\u30ab\u30eb\u7387 x 2",
          Spanish: "",
          Russian: "\u041a\u0440\u0438\u0442\u0438\u0447\u0435\u0441\u043a\u0438\u0439 \u0443\u0440\u043e\u043d \u0443\u0434\u0432\u043e\u0435\u043d"
        }, {
          Key: "max-flame-time-150",
          English: "Flame mode lasts for up to 900s",
          "Simplified Chinese": "\u706b\u7130\u9053\u5177\u6700\u591a\u6301\u7eed900s",
          "Traditional Chinese": "\u706b\u7130\u9053\u5177\u6700\u591a\u6301\u7eed900s",
          Japanese: "\u706b\u708e\u52b9\u679c\u304c\u6700\u5927900s\u6301\u7d9a\u53ef\u80fd",
          Spanish: "",
          Russian: "\u0420\u0435\u0436\u0438\u043c \u043f\u043b\u0430\u043c\u0435\u043d\u0438 \u0434\u043b\u0438\u0442\u0441\u044f \u0434\u043e 900\u0441"
        }, {
          Key: "max-freeze-time-150",
          English: "Freeze mode lasts for up to 900s",
          "Simplified Chinese": "\u51b0\u51bb\u9053\u5177\u6700\u591a\u6301\u7eed900s",
          "Traditional Chinese": "\u51b0\u51bb\u9053\u5177\u6700\u591a\u6301\u7eed900s",
          Japanese: "\u6c37\u7d50\u52b9\u679c\u304c\u6700\u5927900s\u6301\u7d9a\u53ef\u80fd",
          Spanish: "",
          Russian: "\u0420\u0435\u0436\u0438\u043c \u043c\u043e\u0440\u043e\u0437\u0430 \u0434\u043b\u0438\u0442\u0441\u044f \u0434\u043e 900\u0441"
        }, {
          Key: "max-crit-time-150",
          English: "Critical mode lasts for up to 900s",
          "Simplified Chinese": "\u66b4\u51fb\u9053\u5177\u6700\u591a\u6301\u7eed900s",
          "Traditional Chinese": "\u66b4\u51fb\u9053\u5177\u6700\u591a\u6301\u7eed900s",
          Japanese: "\u30af\u30ea\u30c6\u30a3\u30ab\u30eb\u52b9\u679c\u304c\u6700\u5927900s\u6301\u7d9a\u53ef\u80fd",
          Spanish: "",
          Russian: "\u0420\u0435\u0436\u0438\u043c \u043a\u0440\u0438\u0442\u0438\u0447\u0435\u0441\u043a\u043e\u0433\u043e \u0443\u0440\u043e\u043d\u0430 \u0434\u043b\u0438\u0442\u0441\u044f \u0434\u043e 900\u0441"
        }, {
          Key: "max-auto-time-300",
          English: "Auto mode lasts for up to 900s",
          "Simplified Chinese": "\u81ea\u52a8\u5408\u5e76\u9053\u5177\u6700\u591a\u6301\u7eed900s",
          "Traditional Chinese": "\u81ea\u52a8\u5408\u5e76\u9053\u5177\u6700\u591a\u6301\u7eed900s",
          Japanese: "\u81ea\u52d5\u30de\u30fc\u30b8\u52b9\u679c\u304c\u6700\u5927900s\u6301\u7d9a\u53ef\u80fd",
          Spanish: "",
          Russian: "\u0410\u0432\u0442\u043e-\u0440\u0435\u0436\u0438\u043c \u0434\u043b\u0438\u0442\u0441\u044f \u0434\u043e 900\u0441"
        }, {
          Key: "main-buff",
          English: "Powers",
          "Simplified Chinese": "\u9053\u5177",
          "Traditional Chinese": "\u9053\u5177",
          Japanese: "\u30a2\u30a4\u30c6\u30e0",
          Spanish: "",
          Russian: "\u0421\u0438\u043b\u044b"
        }, {
          Key: "language",
          English: "Language",
          "Simplified Chinese": "\u8bed\u8a00",
          "Traditional Chinese": "\u8bed\u8a00",
          Japanese: "\u8a00\u8a9e",
          Spanish: "",
          Russian: "\u042f\u0437\u044b\u043a"
        }, {
          Key: "vip-week",
          English: "week",
          "Simplified Chinese": "\u5468",
          "Traditional Chinese": "\u5468",
          Japanese: "\u9031",
          Spanish: "",
          Russian: "\u043d\u0435\u0434\u0435\u043b\u044f"
        }, {
          Key: "btn-no-thanks",
          English: "No Thanks!",
          "Simplified Chinese": "\u5355\u500d\u9886\u53d6",
          "Traditional Chinese": "\u5355\u500d\u9886\u53d6",
          Japanese: "\u7d50\u69cb\u3067\u3059\uff01",
          Spanish: "",
          Russian: "\u041d\u0435\u0442, \u0441\u043f\u0430\u0441\u0438\u0431\u043e!"
        }, {
          Key: "btn-treble",
          English: "Triple",
          "Simplified Chinese": "3\u500d",
          "Traditional Chinese": "3\u500d",
          Japanese: "3\u500d",
          Spanish: "",
          Russian: "\u0423\u0442\u0440\u043e\u0438\u0442\u044c"
        }, {
          Key: "main-treble",
          English: "Triple Gold",
          "Simplified Chinese": "3\u500d\u91d1\u5e01",
          "Traditional Chinese": "3\u500d\u91d1\u5e01",
          Japanese: "\u30b3\u30a4\u30f33\u500d",
          Spanish: "",
          Russian: "\u0423\u0442\u0440\u043e\u0438\u0442\u044c \u0417\u043e\u043b\u043e\u0442\u043e"
        }, {
          Key: "is-treble-now",
          English: "Triple Coin bonus activated ",
          "Simplified Chinese": "3\u500d\u91d1\u5e01\u5df2\u6fc0\u6d3b",
          "Traditional Chinese": "3\u500d\u91d1\u5e01\u5df2\u6fc0\u6d3b",
          Japanese: "\u30b3\u30a4\u30f33\u500d\u6709\u52b9\u4e2d",
          Spanish: "",
          Russian: "\u0422\u0440\u043e\u0439\u043d\u043e\u0439 \u0431\u043e\u043d\u0443\u0441 \u043c\u043e\u043d\u0435\u0442 \u0430\u043a\u0442\u0438\u0432\u0438\u0440\u043e\u0432\u0430\u043d"
        }, {
          Key: "trebleCoin-des-1",
          English: "Defeated Enemies will drop x3 coins!",
          "Simplified Chinese": "\u6253\u8d25\u654c\u4eba\u65f6\u91d1\u5e01\u6389\u843d3\u500d",
          "Traditional Chinese": "\u6253\u8d25\u654c\u4eba\u65f6\u91d1\u5e01\u6389\u843d3\u500d",
          Japanese: "\u5012\u3057\u305f\u6575\u304b\u3089\u30b3\u30a4\u30f33\u500d\u7372\u5f97",
          Spanish: "",
          Russian: "\u041f\u043e\u0431\u0435\u0436\u0434\u0435\u043d\u043d\u044b\u0435 \u0432\u0440\u0430\u0433\u0438 \u0432\u044b\u0434\u0430\u044e\u0442 \u04453 \u043c\u043e\u043d\u0435\u0442!"
        }, {
          Key: "trebleCoin-des-2",
          English: "Bonus will last for 500 seconds",
          "Simplified Chinese": "\u91d1\u5e013\u500d\u6301\u7eed500\u79d2",
          "Traditional Chinese": "\u91d1\u5e013\u500d\u6301\u7eed500\u79d2",
          Japanese: "\u30dc\u30fc\u30ca\u30b9\u306f500\u79d2\u9593\u7d9a\u304f",
          Spanish: "",
          Russian: "\u0411\u043e\u043d\u0443\u0441 \u0431\u0443\u0434\u0435\u0442 \u0434\u043b\u0438\u0442\u044c\u0441\u044f 500 \u0441\u0435\u043a\u0443\u043d\u0434"
        }, {
          Key: "getReward-checkbox-treble",
          English: "Watch a video to triple the reward",
          "Simplified Chinese": "\u770b\u5e7f\u544a3\u500d\u9886\u53d6",
          "Traditional Chinese": "\u770b\u5e7f\u544a3\u500d\u9886\u53d6",
          Japanese: "\u52d5\u753b\u3092\u518d\u751f\u3057\u3066\u5831\u916c3\u500d",
          Spanish: "",
          Russian: "\u041f\u043e\u0441\u043c\u043e\u0442\u0440\u0438\u0442\u0435 \u0432\u0438\u0434\u0435\u043e \u0434\u043b\u044f \u0442\u0440\u043e\u0439\u043d\u043e\u0439 \u043d\u0430\u0433\u0440\u0430\u0434\u044b"
        }, {
          Key: "offline-treble-tip",
          English: "Offline Earning is tripled",
          "Simplified Chinese": "3\u500d\u9886\u53d6",
          "Traditional Chinese": "3\u500d\u9886\u53d6",
          Japanese: "\u5831\u916c3\u500d",
          Spanish: "",
          Russian: "\u041e\u0444\u0444\u043b\u0430\u0439\u043d \u0437\u0430\u0440\u0430\u0431\u043e\u0442\u043e\u043a \u0443\u0442\u0440\u043e\u0435\u043d"
        }, {
          Key: "vip-treble-tip",
          English: "Triple reward for VIP",
          "Simplified Chinese": "VIP3\u500d\u7279\u6743",
          "Traditional Chinese": "VIP3\u500d\u7279\u6743",
          Japanese: "VIP\u4f1a\u54e1\u5831\u916c3\u500d",
          Spanish: "",
          Russian: "\u0422\u0440\u043e\u0439\u043d\u0430\u044f \u043d\u0430\u0433\u0440\u0430\u0434\u0430 \u0437\u0430 VIP"
        }, {
          Key: "trebleCoin-des-1",
          English: "Defeated Enemies will drop x3 coins!",
          "Simplified Chinese": "\u6253\u8d25\u654c\u4eba\u65f6\u91d1\u5e01\u6389\u843d3\u500d",
          "Traditional Chinese": "\u6253\u8d25\u654c\u4eba\u65f6\u91d1\u5e01\u6389\u843d3\u500d",
          Japanese: "\u5012\u3057\u305f\u6575\u304b\u3089\u30b3\u30a4\u30f33\u500d\u7372\u5f97",
          Spanish: "",
          Russian: "\u041f\u043e\u0431\u0435\u0436\u0434\u0435\u043d\u043d\u044b\u0435 \u0432\u0440\u0430\u0433\u0438 \u0432\u044b\u0434\u0430\u044e\u0442 \u04453 \u043c\u043e\u043d\u0435\u0442!"
        }, {
          Key: "free-treble-daily-tip",
          English: "Daily Bonus is tripled 5pm - 11pm everyday!",
          "Simplified Chinese": "\u6bcf\u65e5\u5956\u52b1\u572817:00~23:00\u53ef\u4ee53\u500d\u9886\u53d6\uff01",
          "Traditional Chinese": "\u6bcf\u65e5\u5956\u52b1\u572817:00~23:00\u53ef\u4ee53\u500d\u9886\u53d6\uff01",
          Japanese: "17\u6642\u301c23\u6642\u306b\u30ed\u30b0\u30a4\u30f3\u3059\u308b\u3068\n\u30c7\u30a4\u30ea\u30fc\u30dc\u30fc\u30ca\u30b9\u304c3\u500d\u306b\uff01",
          Spanish: "",
          Russian: "\u0414\u043d\u0435\u0432\u043d\u043e\u0439 \u0411\u043e\u043d\u0443\u0441 \u0443\u0442\u0440\u043e\u0435\u043d \u0441 5-\u0438 \u0434\u043e \n11-\u0438 \u0432\u0435\u0447\u0435\u0440\u0430 \u043a\u0430\u0436\u0434\u044b\u0439 \u0434\u0435\u043d\u044c!"
        }, {
          Key: "main-recycle",
          English: "Recycle",
          "Simplified Chinese": "\u56de\u6536",
          "Traditional Chinese": "\u56de\u6536",
          Japanese: "\u30ea\u30b5\u30a4\u30af\u30eb",
          Spanish: "",
          Russian: "\u0421\u0434\u0430\u0442\u044c"
        }, {
          Key: "rank-ranking",
          English: "Rank",
          "Simplified Chinese": "\u6392\u540d",
          "Traditional Chinese": "\u6392\u540d",
          Japanese: "\u30e9\u30f3\u30ad\u30f3\u30b0",
          Spanish: "",
          Russian: "\u0420\u0430\u043d\u0433"
        }, {
          Key: "rank-icon",
          English: "Icon",
          "Simplified Chinese": "\u56fe\u6807",
          "Traditional Chinese": "\u56fe\u6807",
          Japanese: "\u30a2\u30a4\u30b3\u30f3",
          Spanish: "",
          Russian: "\u0417\u043d\u0430\u0447\u0435\u043a"
        }, {
          Key: "rank-name",
          English: "Name",
          "Simplified Chinese": "\u540d\u5b57",
          "Traditional Chinese": "\u540d\u5b57",
          Japanese: "\u540d\u524d",
          Spanish: "",
          Russian: "\u0418\u043c\u044f"
        }, {
          Key: "rank-top",
          English: "Top Guardian",
          "Simplified Chinese": "\u6700\u9ad8\u7b49\u7ea7\u5b88\u62a4\u8005",
          "Traditional Chinese": "\u6700\u9ad8\u7b49\u7ea7\u5b88\u62a4\u8005",
          Japanese: "\u6700\u9ad8\u30ec\u30d9\u30eb\u30ac\u30fc\u30c7\u30a3\u30a2\u30f3",
          Spanish: "",
          Russian: "\u041d\u0430\u0438\u0432\u044b\u0441\u0448\u0438\u0439 \u0417\u0430\u0449\u0438\u0442\u043d\u0438\u043a"
        }, {
          Key: "ask-friends",
          English: "Ask Friends",
          "Simplified Chinese": "\u6c42\u52a9\u597d\u53cb",
          "Traditional Chinese": "\u6c42\u52a9\u597d\u53cb",
          Japanese: "\u53cb\u9054\u306b\u304a\u9858\u3044",
          Spanish: "",
          Russian: "\u0421\u043f\u0440\u043e\u0441\u0438\u0442\u044c \u0434\u0440\u0443\u0433\u0430"
        }, {
          Key: "invite",
          English: "Invite",
          "Simplified Chinese": "\u9080\u8bf7",
          "Traditional Chinese": "\u9080\u8acb",
          Japanese: "\u62db\u5f85",
          Spanish: "",
          Russian: "\u041f\u0440\u0438\u0433\u043b\u0430\u0448\u0435\u043d\u0438\u0435 "
        }, {
          Key: "special-gift",
          English: "Special Gift",
          "Simplified Chinese": "\u7279\u6b8a\u5927\u793c",
          "Traditional Chinese": "\u7279\u6b8a\u5927\u79ae",
          Japanese: "\u30b9\u30da\u30b7\u30e3\u30eb\u30ae\u30d5\u30c8",
          Spanish: "",
          Russian: "\u041e\u0441\u043e\u0431\u044b\u0439 \u043f\u043e\u0434\u0430\u0440\u043e\u043a"
        }, {
          Key: "special-gift-desc",
          English: "Your friend sent you free guardians!\nThanks your friend for this special gift!",
          "Simplified Chinese": "\u4f60\u7684\u670b\u53cb\u9001\u7ed9\u4f60\u7684\u5b88\u62a4\u8005\uff01\u5feb\u53bb\u8868\u8fbe\u611f\u8c22\u5427\uff01",
          "Traditional Chinese": "\u4f60\u7684\u670b\u53cb\u9001\u7d66\u4f60\u7684\u5b88\u8b77\u8005\uff01\u5feb\u53bb\u8868\u9054\u611f\u8b1d\u5427\uff01",
          Japanese: "\u53cb\u9054\u304b\u3089\u30ac\u30fc\u30c7\u30a3\u30a2\u30f3\u3092\u3044\u305f\u3060\u304d\u307e\u3057\u305f\uff01\u611f\u8b1d\u3057\u307e\u3057\u3087\u3046\uff01",
          Spanish: "",
          Russian: "\u0412\u0430\u0448 \u0434\u0440\u0443\u0433 \u043f\u0440\u0438\u0441\u043b\u0430\u043b \u0432\u0430\u043c \u0431\u0435\u0441\u043f\u043b\u0430\u0442\u043d\u044b\u0445 \u043e\u043f\u0435\u043a\u0443\u043d\u043e\u0432!\n\u041e\u0442\u0431\u043b\u0430\u0433\u043e\u0434\u043e\u0440\u0438\u0442\u044c \u0437\u0430 \u044d\u0442\u043e\u0442 \u043e\u0441\u043e\u0431\u044b\u0439 \u043f\u043e\u0434\u0430\u0440\u043e\u043a!"
        }, {
          Key: "btn-thanks",
          English: "Thanks",
          "Simplified Chinese": "\u611f\u8c22\u597d\u53cb",
          "Traditional Chinese": "\u611f\u8b1d\u597d\u53cb",
          Japanese: "\u53cb\u9054\u306b\u611f\u8b1d",
          Spanish: "",
          Russian: "\u0421\u043f\u0430\u0441\u0438\u0431\u043e"
        }, {
          Key: "invite-double-tip",
          English: "Invite friends to double bonus!",
          "Simplified Chinese": "\u9080\u8bf7\u670b\u53cb\u83b7\u5f97\u53cc\u500d\u5956\u52b1\uff01",
          "Traditional Chinese": "\u9080\u8acb\u670b\u53cb\u7372\u5f97\u96d9\u500d\u734e\u52f5",
          Japanese: "\u53cb\u9054\u62db\u5f85\u3067\u30dc\u30fc\u30ca\u30b9\u30922\u500d\uff01",
          Spanish: "",
          Russian: "\u041f\u0440\u0438\u0433\u043b\u0430\u0441\u0438\u0442\u0435 \u0434\u0440\u0443\u0437\u0435\u0439, \u0447\u0442\u043e\u0431\u044b \u043f\u043e\u043b\u0443\u0447\u0438\u0442\u044c \u0434\u0432\u043e\u0439\u043d\u043e\u0439 \u0431\u043e\u043d\u0443\u0441!"
        }, {
          Key: "buy-offline-desc",
          English: "Triple Your Offline Earning!",
          "Simplified Chinese": "\u83b7\u53d6\u4e09\u500d\u79bb\u7ebf\u5956\u52b1\uff01",
          "Traditional Chinese": "\u7372\u53d6\u4e09\u500d\u96e2\u7dda\u734e\u52f5\uff01",
          Japanese: "\u30aa\u30d5\u30e9\u30a4\u30f3\u53ce\u76ca\u3092\u305a\u3063\u30683\u500d\u306b\uff01",
          Spanish: "",
          Russian: "\u0423\u0441\u0442\u0440\u043e\u0439\u0442\u0435 \u0441\u0432\u043e\u0439 \u043e\u0444\u043b\u0430\u0439\u043d-\u0434\u043e\u0445\u043e\u0434!"
        }, {
          Key: "unlock-all-desc",
          English: "Unlock Your All Plots!",
          "Simplified Chinese": "\u89e3\u9501\u6240\u6709\u7684\u571f\u5730\uff01",
          "Traditional Chinese": "\u89e3\u9396\u6240\u6709\u7684\u571f\u5730\uff01",
          Japanese: "\u5168\u3066\u306e\u571f\u5730\u3092\u30a2\u30f3\u30ed\u30c3\u30af\uff01",
          Spanish: "",
          Russian: "\u0440\u0430\u0437\u0431\u043b\u043e\u043a\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0432\u0441\u0435 \u0437\u0435\u043c\u043b\u0438!"
        }, {
          Key: "already-unlock-allGrids",
          English: "You have Already Unlock all Plots!",
          "Simplified Chinese": "\u5df2\u7ecf\u89e3\u9501\u4e86\u6240\u6709\u7684\u571f\u5730\uff01",
          "Traditional Chinese": "\u5df2\u7d93\u89e3\u9396\u4e86\u6240\u6709\u7684\u571f\u5730\uff01",
          Japanese: "\u5168\u3066\u306e\u571f\u5730\u3092\u30a2\u30f3\u30ed\u30c3\u30af\u3057\u307e\u3057\u305f\uff01",
          Spanish: "",
          Russian: "\u0412\u044b \u0443\u0436\u0435 \u0440\u0430\u0437\u0431\u043b\u043e\u043a\u0438\u0440\u043e\u0432\u0430\u043b\u0438 \u0432\u0441\u0435 \u0437\u0435\u043c\u043b\u0438!"
        }, {
          Key: "buy-gems-desc",
          English: "Get {0}  Diamonds Now!",
          "Simplified Chinese": "\u73b0\u5728\u83b7\u5f97 {0} \u9897\u94bb\u77f3\uff01",
          "Traditional Chinese": "\u73fe\u5728\u7372\u5f97 {0} \u9846\u947d\u77f3\uff01",
          Japanese: "{0}  \u30c0\u30a4\u30e4\u30e2\u30f3\u30c9\u3092\u7372\u5f97\uff01",
          Spanish: "",
          Russian: "\u043f\u043e\u043b\u0443\u0447\u0438 {0} \u0431\u0440\u0438\u043b\u043b\u0438\u0430\u043d\u0442\u0430 \u0441\u0435\u0439\u0447\u0430\u0441"
        }, {
          Key: "buy-coins-desc",
          English: "Get {0} Coins Now!",
          "Simplified Chinese": "\u73b0\u5728\u83b7\u5f97 {0} \u679a\u91d1\u5e01\uff01",
          "Traditional Chinese": "\u73fe\u5728\u7372\u5f97 {0} \u9846\u91d1\u5e63\uff01",
          Japanese: "{0} \u30b3\u30a4\u30f3\u3092\u7372\u5f97\uff01",
          Spanish: "",
          Russian: "\u041f\u043e\u043b\u0443\u0447\u0438\u0442\u0435 {0} \u043c\u043e\u043d\u0435\u0442\u044b \u0441\u0435\u0439\u0447\u0430\u0441!"
        } ]
      }
    });
    module.exports = DB_i18n;
    cc._RF.pop();
  }, {} ],
  DB_invite: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f5f5fkAcd9HHaPfZAv8Y46f", "DB_invite");
    "use strict";
    var DB_invite = cc.Class({
      name: "DB_invite",
      statics: {
        dataLen: 6,
        dataHead: '["id", "invitePeople", "gem"]',
        data: '{"1":[1,1,5],"2":[2,2,8],"3":[3,3,10],"4":[4,5,25],"5":[5,8,45],"6":[6,12,60]}'
      }
    });
    module.exports = DB_invite;
    cc._RF.pop();
  }, {} ],
  DB_level: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0a7e1SQCThJH7KfINZcQE3b", "DB_level");
    "use strict";
    var DB_level = cc.Class({
      name: "DB_level",
      statics: {
        dataLen: 60,
        dataHead: '["level", "wave", "waveCount", "zombieID1", "zombieCount1", "zombieID2", "zombieCount2"]',
        data: '{"1_1":[1,1,3,1,5,2,1],"1_2":[1,2,3,1,7,2,1],"1_3":[1,3,3,101,1,2,0],"2_1":[2,1,4,2,5,3,1],"2_2":[2,2,4,2,7,3,1],"2_3":[2,3,4,2,9,3,1],"2_4":[2,4,4,102,1,3,0],"3_1":[3,1,5,3,5,4,1],"3_2":[3,2,5,3,7,4,1],"3_3":[3,3,5,3,9,4,1],"3_4":[3,4,5,3,11,4,1],"3_5":[3,5,5,103,1,4,0],"4_1":[4,1,5,4,5,5,1],"4_2":[4,2,5,4,7,5,1],"4_3":[4,3,5,4,9,5,1],"4_4":[4,4,5,4,11,5,1],"4_5":[4,5,5,104,1,5,0],"5_1":[5,1,5,5,5,6,1],"5_2":[5,2,5,5,7,6,1],"5_3":[5,3,5,5,9,6,1],"5_4":[5,4,5,5,11,6,1],"5_5":[5,5,5,105,1,6,0],"6_1":[6,1,5,6,5,7,1],"6_2":[6,2,5,6,7,7,1],"6_3":[6,3,5,6,9,7,1],"6_4":[6,4,5,6,11,7,1],"6_5":[6,5,5,106,1,7,0],"7_1":[7,1,5,7,5,8,1],"7_2":[7,2,5,7,7,8,1],"7_3":[7,3,5,7,9,8,1],"7_4":[7,4,5,7,11,8,1],"7_5":[7,5,5,107,1,8,0],"8_1":[8,1,5,8,5,9,1],"8_2":[8,2,5,8,7,9,1],"8_3":[8,3,5,8,9,9,1],"8_4":[8,4,5,8,11,9,1],"8_5":[8,5,5,108,1,9,0],"9_1":[9,1,5,9,5,10,1],"9_2":[9,2,5,9,7,10,1],"9_3":[9,3,5,9,9,10,1],"9_4":[9,4,5,9,11,10,1],"9_5":[9,5,5,109,1,10,0],"10_1":[10,1,5,10,5,11,1],"10_2":[10,2,5,10,7,11,1],"10_3":[10,3,5,10,9,11,1],"10_4":[10,4,5,10,11,11,1],"10_5":[10,5,5,110,1,11,0],"11_1":[11,1,5,11,5,12,1],"11_2":[11,2,5,11,7,12,1],"11_3":[11,3,5,11,9,12,1],"11_4":[11,4,5,11,11,12,1],"11_5":[11,5,5,111,1,12,0],"12_1":[12,1,5,12,5,13,1],"12_2":[12,2,5,12,7,13,1],"12_3":[12,3,5,12,9,13,1],"12_4":[12,4,5,12,11,13,1],"12_5":[12,5,5,112,1,13,0],"13_1":[13,1,5,13,5,14,1],"13_2":[13,2,5,13,7,14,1],"13_3":[13,3,5,13,9,14,1],"13_4":[13,4,5,13,11,14,1],"13_5":[13,5,5,113,1,14,0],"14_1":[14,1,5,14,5,15,1],"14_2":[14,2,5,14,7,15,1],"14_3":[14,3,5,14,9,15,1],"14_4":[14,4,5,14,11,15,1],"14_5":[14,5,5,114,1,15,0],"15_1":[15,1,5,15,5,16,1],"15_2":[15,2,5,15,7,16,1],"15_3":[15,3,5,15,9,16,1],"15_4":[15,4,5,15,11,16,1],"15_5":[15,5,5,115,1,16,0],"16_1":[16,1,5,16,5,17,1],"16_2":[16,2,5,16,7,17,1],"16_3":[16,3,5,16,9,17,1],"16_4":[16,4,5,16,11,17,1],"16_5":[16,5,5,116,1,17,0],"17_1":[17,1,5,17,5,18,1],"17_2":[17,2,5,17,7,18,1],"17_3":[17,3,5,17,9,18,1],"17_4":[17,4,5,17,11,18,1],"17_5":[17,5,5,117,1,18,0],"18_1":[18,1,5,18,5,19,1],"18_2":[18,2,5,18,7,19,1],"18_3":[18,3,5,18,9,19,1],"18_4":[18,4,5,18,11,19,1],"18_5":[18,5,5,118,1,19,0],"19_1":[19,1,5,19,5,20,1],"19_2":[19,2,5,19,7,20,1],"19_3":[19,3,5,19,9,20,1],"19_4":[19,4,5,19,11,20,1],"19_5":[19,5,5,119,1,20,0],"20_1":[20,1,5,20,5,21,1],"20_2":[20,2,5,20,7,21,1],"20_3":[20,3,5,20,9,21,1],"20_4":[20,4,5,20,11,21,1],"20_5":[20,5,5,120,1,21,0],"21_1":[21,1,5,21,5,22,1],"21_2":[21,2,5,21,7,22,1],"21_3":[21,3,5,21,9,22,1],"21_4":[21,4,5,21,11,22,1],"21_5":[21,5,5,121,1,22,0],"22_1":[22,1,5,22,5,23,1],"22_2":[22,2,5,22,7,23,1],"22_3":[22,3,5,22,9,23,1],"22_4":[22,4,5,22,11,23,1],"22_5":[22,5,5,122,1,23,0],"23_1":[23,1,5,23,5,24,1],"23_2":[23,2,5,23,7,24,1],"23_3":[23,3,5,23,9,24,1],"23_4":[23,4,5,23,11,24,1],"23_5":[23,5,5,123,1,24,0],"24_1":[24,1,5,24,5,25,1],"24_2":[24,2,5,24,7,25,1],"24_3":[24,3,5,24,9,25,1],"24_4":[24,4,5,24,11,25,1],"24_5":[24,5,5,124,1,25,0],"25_1":[25,1,5,25,5,26,1],"25_2":[25,2,5,25,7,26,1],"25_3":[25,3,5,25,9,26,1],"25_4":[25,4,5,25,11,26,1],"25_5":[25,5,5,125,1,26,0],"26_1":[26,1,5,26,5,27,1],"26_2":[26,2,5,26,7,27,1],"26_3":[26,3,5,26,9,27,1],"26_4":[26,4,5,26,11,27,1],"26_5":[26,5,5,126,1,27,0],"27_1":[27,1,5,27,5,28,1],"27_2":[27,2,5,27,7,28,1],"27_3":[27,3,5,27,9,28,1],"27_4":[27,4,5,27,11,28,1],"27_5":[27,5,5,127,1,28,0],"28_1":[28,1,5,28,5,29,1],"28_2":[28,2,5,28,7,29,1],"28_3":[28,3,5,28,9,29,1],"28_4":[28,4,5,28,11,29,1],"28_5":[28,5,5,128,1,29,0],"29_1":[29,1,5,29,5,30,1],"29_2":[29,2,5,29,7,30,1],"29_3":[29,3,5,29,9,30,1],"29_4":[29,4,5,29,11,30,1],"29_5":[29,5,5,129,1,30,0],"30_1":[30,1,5,30,5,31,1],"30_2":[30,2,5,30,7,31,1],"30_3":[30,3,5,30,9,31,1],"30_4":[30,4,5,30,11,31,1],"30_5":[30,5,5,130,1,31,0],"31_1":[31,1,5,31,5,32,1],"31_2":[31,2,5,31,7,32,1],"31_3":[31,3,5,31,9,32,1],"31_4":[31,4,5,31,11,32,1],"31_5":[31,5,5,131,1,32,0],"32_1":[32,1,5,32,5,33,1],"32_2":[32,2,5,32,7,33,1],"32_3":[32,3,5,32,9,33,1],"32_4":[32,4,5,32,11,33,1],"32_5":[32,5,5,132,1,33,0],"33_1":[33,1,5,33,5,34,1],"33_2":[33,2,5,33,7,34,1],"33_3":[33,3,5,33,9,34,1],"33_4":[33,4,5,33,11,34,1],"33_5":[33,5,5,133,1,34,0],"34_1":[34,1,5,34,5,35,1],"34_2":[34,2,5,34,7,35,1],"34_3":[34,3,5,34,9,35,1],"34_4":[34,4,5,34,11,35,1],"34_5":[34,5,5,134,1,35,0],"35_1":[35,1,5,35,5,36,1],"35_2":[35,2,5,35,7,36,1],"35_3":[35,3,5,35,9,36,1],"35_4":[35,4,5,35,11,36,1],"35_5":[35,5,5,135,1,36,0],"36_1":[36,1,5,36,5,37,1],"36_2":[36,2,5,36,7,37,1],"36_3":[36,3,5,36,9,37,1],"36_4":[36,4,5,36,11,37,1],"36_5":[36,5,5,136,1,37,0],"37_1":[37,1,5,37,5,38,1],"37_2":[37,2,5,37,7,38,1],"37_3":[37,3,5,37,9,38,1],"37_4":[37,4,5,37,11,38,1],"37_5":[37,5,5,137,1,38,0],"38_1":[38,1,5,38,5,39,1],"38_2":[38,2,5,38,7,39,1],"38_3":[38,3,5,38,9,39,1],"38_4":[38,4,5,38,11,39,1],"38_5":[38,5,5,138,1,39,0],"39_1":[39,1,5,39,5,40,1],"39_2":[39,2,5,39,7,40,1],"39_3":[39,3,5,39,9,40,1],"39_4":[39,4,5,39,11,40,1],"39_5":[39,5,5,139,1,40,0],"40_1":[40,1,5,40,5,41,1],"40_2":[40,2,5,40,7,41,1],"40_3":[40,3,5,40,9,41,1],"40_4":[40,4,5,40,11,41,1],"40_5":[40,5,5,140,1,41,0],"41_1":[41,1,5,41,5,42,1],"41_2":[41,2,5,41,7,42,1],"41_3":[41,3,5,41,9,42,1],"41_4":[41,4,5,41,11,42,1],"41_5":[41,5,5,141,1,42,0],"42_1":[42,1,5,42,5,43,1],"42_2":[42,2,5,42,7,43,1],"42_3":[42,3,5,42,9,43,1],"42_4":[42,4,5,42,11,43,1],"42_5":[42,5,5,142,1,43,0],"43_1":[43,1,5,43,5,44,1],"43_2":[43,2,5,43,7,44,1],"43_3":[43,3,5,43,9,44,1],"43_4":[43,4,5,43,11,44,1],"43_5":[43,5,5,143,1,44,0],"44_1":[44,1,5,44,5,45,1],"44_2":[44,2,5,44,7,45,1],"44_3":[44,3,5,44,9,45,1],"44_4":[44,4,5,44,11,45,1],"44_5":[44,5,5,144,1,45,0],"45_1":[45,1,5,45,5,46,1],"45_2":[45,2,5,45,7,46,1],"45_3":[45,3,5,45,9,46,1],"45_4":[45,4,5,45,11,46,1],"45_5":[45,5,5,145,1,46,0],"46_1":[46,1,5,46,5,47,1],"46_2":[46,2,5,46,7,47,1],"46_3":[46,3,5,46,9,47,1],"46_4":[46,4,5,46,11,47,1],"46_5":[46,5,5,146,1,47,0],"47_1":[47,1,5,47,5,48,1],"47_2":[47,2,5,47,7,48,1],"47_3":[47,3,5,47,9,48,1],"47_4":[47,4,5,47,11,48,1],"47_5":[47,5,5,147,1,48,0],"48_1":[48,1,5,48,5,49,1],"48_2":[48,2,5,48,7,49,1],"48_3":[48,3,5,48,9,49,1],"48_4":[48,4,5,48,11,49,1],"48_5":[48,5,5,148,1,49,0],"49_1":[49,1,5,49,5,50,1],"49_2":[49,2,5,49,7,50,1],"49_3":[49,3,5,49,9,50,1],"49_4":[49,4,5,49,11,50,1],"49_5":[49,5,5,149,1,50,0],"50_1":[50,1,5,50,5,51,1],"50_2":[50,2,5,50,7,51,1],"50_3":[50,3,5,50,9,51,1],"50_4":[50,4,5,50,11,51,1],"50_5":[50,5,5,150,1,51,0],"51_1":[51,1,5,51,5,52,1],"51_2":[51,2,5,51,7,52,1],"51_3":[51,3,5,51,9,52,1],"51_4":[51,4,5,51,11,52,1],"51_5":[51,5,5,151,1,52,0],"52_1":[52,1,5,52,5,53,1],"52_2":[52,2,5,52,7,53,1],"52_3":[52,3,5,52,9,53,1],"52_4":[52,4,5,52,11,53,1],"52_5":[52,5,5,152,1,53,0],"53_1":[53,1,5,53,5,54,1],"53_2":[53,2,5,53,7,54,1],"53_3":[53,3,5,53,9,54,1],"53_4":[53,4,5,53,11,54,1],"53_5":[53,5,5,153,1,54,0],"54_1":[54,1,5,54,5,55,1],"54_2":[54,2,5,54,7,55,1],"54_3":[54,3,5,54,9,55,1],"54_4":[54,4,5,54,11,55,1],"54_5":[54,5,5,154,1,55,0],"55_1":[55,1,5,55,5,56,1],"55_2":[55,2,5,55,7,56,1],"55_3":[55,3,5,55,9,56,1],"55_4":[55,4,5,55,11,56,1],"55_5":[55,5,5,155,1,56,0],"56_1":[56,1,5,56,5,57,1],"56_2":[56,2,5,56,7,57,1],"56_3":[56,3,5,56,9,57,1],"56_4":[56,4,5,56,11,57,1],"56_5":[56,5,5,156,1,57,0],"57_1":[57,1,5,57,5,58,1],"57_2":[57,2,5,57,7,58,1],"57_3":[57,3,5,57,9,58,1],"57_4":[57,4,5,57,11,58,1],"57_5":[57,5,5,157,1,58,0],"58_1":[58,1,5,58,5,59,1],"58_2":[58,2,5,58,7,59,1],"58_3":[58,3,5,58,9,59,1],"58_4":[58,4,5,58,11,59,1],"58_5":[58,5,5,158,1,59,0],"59_1":[59,1,5,59,5,60,1],"59_2":[59,2,5,59,7,60,1],"59_3":[59,3,5,59,9,60,1],"59_4":[59,4,5,59,11,60,1],"59_5":[59,5,5,159,1,60,0],"60_1":[60,1,5,60,5,60,1],"60_2":[60,2,5,60,7,60,1],"60_3":[60,3,5,60,9,60,1],"60_4":[60,4,5,60,11,60,1],"60_5":[60,5,5,160,1,60,0]}'
      }
    });
    module.exports = DB_level;
    cc._RF.pop();
  }, {} ],
  DB_levelupGem: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ff61bcftMZCV7C5W8v7t1d/", "DB_levelupGem");
    "use strict";
    var DB_levelupGem = cc.Class({
      name: "DB_levelupGem",
      statics: {
        dataLen: 60,
        dataHead: '["level", "gem"]',
        data: '{"3":[3,3],"5":[5,3],"8":[8,3],"11":[11,3],"14":[14,5],"17":[17,5],"19":[19,5],"21":[21,5],"23":[23,5],"25":[25,5],"27":[27,5],"29":[29,5],"31":[31,8],"33":[33,8],"35":[35,8],"37":[37,8],"39":[39,8],"41":[41,8],"43":[43,8],"45":[45,8],"47":[47,10],"49":[49,10],"51":[51,10],"53":[53,10],"55":[55,10],"57":[57,10],"59":[59,10]}',
        data_101: '{"3":[3,3],"5":[5,3],"8":[8,3],"11":[11,3],"14":[14,5],"17":[17,5],"19":[19,5],"21":[21,5],"23":[23,5],"25":[25,5],"27":[27,5],"29":[29,5],"31":[31,8],"33":[33,8],"35":[35,8],"37":[37,8],"39":[39,8],"41":[41,8],"43":[43,8],"45":[45,8],"47":[47,10],"49":[49,10],"51":[51,10],"53":[53,10],"55":[55,10],"57":[57,10],"59":[59,10]}',
        data_102: '{"1":[1,5],"2":[2,5],"3":[3,5],"4":[4,5],"5":[5,5],"6":[6,10],"7":[7,10],"8":[8,10],"9":[9,10],"10":[10,10],"11":[11,20],"12":[12,20],"13":[13,20],"14":[14,20],"15":[15,20],"16":[16,30],"17":[17,30],"18":[18,30],"19":[19,30],"20":[20,30],"21":[21,40],"22":[22,40],"23":[23,40],"24":[24,40],"25":[25,40],"26":[26,50],"27":[27,50],"28":[28,50],"29":[29,50],"30":[30,50],"31":[31,60],"32":[32,60],"33":[33,60],"34":[34,60],"35":[35,60],"36":[36,70],"37":[37,70],"38":[38,70],"39":[39,70],"40":[40,70],"41":[41,80],"42":[42,80],"43":[43,80],"44":[44,80],"45":[45,80],"46":[46,90],"47":[47,90],"48":[48,90],"49":[49,90],"50":[50,90],"51":[51,100],"52":[52,100],"53":[53,100],"54":[54,100],"55":[55,100],"56":[56,120],"57":[57,120],"58":[58,120],"59":[59,120],"60":[60,120]}'
      }
    });
    module.exports = DB_levelupGem;
    cc._RF.pop();
  }, {} ],
  DB_plantName: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "46259O/ct9H+Jd5a2HCfXCm", "DB_plantName");
    "use strict";
    var DB_plantName = cc.Class({
      name: "DB_plantName",
      statics: {
        data: [ {
          Key: "guardian-1",
          English: "Twig",
          "Simplified Chinese": "\u5c0f\u6811\u679d",
          "Traditional Chinese": "\u5c0f\u6811\u679d",
          Japanese: "\u30c4\u30a4\u30c3\u30b0",
          Spanish: "Ramita",
          Russian: "\u0412\u0435\u0442\u043e\u0447\u043a\u0430"
        }, {
          Key: "guardian-2",
          English: "Woody",
          "Simplified Chinese": "\u65e0\u654c\u5c0f\u6811",
          "Traditional Chinese": "\u65e0\u654c\u5c0f\u6811",
          Japanese: "\u30a6\u30c3\u30c7\u30a3",
          Spanish: "Le\xf1oso",
          Russian: "\u041f\u0440\u0443\u0442\u0438\u043a"
        }, {
          Key: "guardian-3",
          English: "FallFro",
          "Simplified Chinese": "\u7206\u70b8\u5934",
          "Traditional Chinese": "\u7206\u70b8\u5934",
          Japanese: "\u30cf\u30d5\u30ed",
          Spanish: "FallFro",
          Russian: "\u0410\u0444\u0440\u043e\u0441\u0435\u043d\u044c"
        }, {
          Key: "guardian-4",
          English: "GrassPutin",
          "Simplified Chinese": "\u5927\u80e1\u5b50\u6811\u53d4",
          "Traditional Chinese": "\u5927\u80e1\u5b50\u6811\u53d4",
          Japanese: "\u30a6\u30b7\u30e3\u30f3\u30ab",
          Spanish: "GrassPutin",
          Russian: "\u0413\u0440\u0430\u0441\u0441\u043f\u0443\u0442\u0438\u043d"
        }, {
          Key: "guardian-5",
          English: "Cyclog",
          "Simplified Chinese": "\u72ec\u773c\u6811\u4fa0",
          "Traditional Chinese": "\u72ec\u773c\u6811\u4fa0",
          Japanese: "\u30b5\u30a4\u30af\u30ed\u30d7\u30b9",
          Spanish: "Cyclog",
          Russian: "\u0426\u0438\u043a\u043b\u043e\u0433"
        }, {
          Key: "guardian-6",
          English: "Cypress",
          "Simplified Chinese": "\u5927\u809a\u9ec4\u67cf",
          "Traditional Chinese": "\u5927\u809a\u9ec4\u67cf",
          Japanese: "\u30dd\u30f3\u30dd\u30f3",
          Spanish: "Cipr\xe9s",
          Russian: "\u041a\u0438\u043f\u0430\u0440\u0438\u0441"
        }, {
          Key: "guardian-7",
          English: "Eggwood",
          "Simplified Chinese": "\u5927\u809a\u7eff\u67cf",
          "Traditional Chinese": "\u5927\u809a\u7eff\u67cf",
          Japanese: "\u30dc\u30f3\u30dc\u30f3",
          Spanish: "Eggwood",
          Russian: "\u0414\u0440\u043e\u0432\u043e\u044f\u0439\u043a"
        }, {
          Key: "guardian-8",
          English: "Bluecap",
          "Simplified Chinese": "\u5c0f\u84dd\u5e3d",
          "Traditional Chinese": "\u5c0f\u84dd\u5e3d",
          Japanese: "\u30a2\u30aa\u30bf\u30b1",
          Spanish: "Gorra azul",
          Russian: "\u0421\u0438\u043d\u0435\u0433\u043b\u0430\u0432"
        }, {
          Key: "guardian-9",
          English: "Redcap",
          "Simplified Chinese": "\u5927\u7ea2\u5e3d",
          "Traditional Chinese": "\u5927\u7ea2\u5e3d",
          Japanese: "\u30a2\u30ab\u30bf\u30b1",
          Spanish: "Gorra roja",
          Russian: "\u041c\u0443\u0445\u043e\u043c\u043e\u0440"
        }, {
          Key: "guardian-10",
          English: "Antlers",
          "Simplified Chinese": "\u9762\u5177\u4fa0",
          "Traditional Chinese": "\u9762\u5177\u4fa0",
          Japanese: "\u30c4\u30ce\u30ab\u30e1\u30f3",
          Spanish: "Cornamenta",
          Russian: "\u0420\u043e\u0433\u0430\u0447"
        }, {
          Key: "guardian-11",
          English: "Woodface",
          "Simplified Chinese": "\u53cc\u89d2\u9762\u5177\u4fa0",
          "Traditional Chinese": "\u53cc\u89d2\u9762\u5177\u4fa0",
          Japanese: "\u30cf\u30a6\u30c1\u30ef\u30f3",
          Spanish: "Cara de madera",
          Russian: "\u0414\u0440\u043e\u0432\u043e\u043b\u0438\u0446"
        }, {
          Key: "guardian-12",
          English: "Rocky",
          "Simplified Chinese": "\u6d1b\u57fa\u77f3\u4eba",
          "Traditional Chinese": "\u6d1b\u57fa\u77f3\u4eba",
          Japanese: "\u30ed\u30c3\u30ad\u30fc",
          Spanish: "Rocoso",
          Russian: "\u041a\u0430\u043c\u0435\u043d\u0435\u0446"
        }, {
          Key: "guardian-13",
          English: "GreenPup",
          "Simplified Chinese": "\u7eff\u6811\u77f3\u72ee",
          "Traditional Chinese": "\u7eff\u6811\u77f3\u72ee",
          Japanese: "\u30cf\u30c3\u30d1\u30d4\u30fc",
          Spanish: "GreenPup",
          Russian: "\u0417\u0435\u043b\u0435\u043d\u0435\u0446"
        }, {
          Key: "guardian-14",
          English: "IcePup",
          "Simplified Chinese": "\u84dd\u51b0\u77f3\u72ee",
          "Traditional Chinese": "\u84dd\u51b0\u77f3\u72ee",
          Japanese: "\u30a2\u30a4\u30b9\u30d1\u30d4\u30fc",
          Spanish: "IcePup",
          Russian: "\u041b\u0435\u0434\u0438\u043d\u0435\u0446"
        }, {
          Key: "guardian-15",
          English: "GorillHot",
          "Simplified Chinese": "\u7ea2\u5b9d\u77f3\u72ee",
          "Traditional Chinese": "\u7ea2\u5b9d\u77f3\u72ee",
          Japanese: "\u30db\u30c3\u30c8\u30d2\u30d2",
          Spanish: "GorillHot",
          Russian: "\u0413\u043e\u0440\u0438\u043b\u0435\u0446"
        }, {
          Key: "guardian-16",
          English: "Salamandarin",
          "Simplified Chinese": "\u8428\u62c9\u70ed\u86d9",
          "Traditional Chinese": "\u8428\u62c9\u70ed\u86d9",
          Japanese: "\u30a4\u30e2\u30ea\u30f3",
          Spanish: "Salamandarin",
          Russian: "\u0421\u0430\u043b\u0430\u043c\u0430\u043d\u0434\u0430\u0440\u0438\u043d"
        }, {
          Key: "guardian-17",
          English: "LemonToad",
          "Simplified Chinese": "\u67e0\u6aac\u9676\u5fb3",
          "Traditional Chinese": "\u67e0\u6aac\u9676\u5fb3",
          Japanese: "\u30ec\u30e2\u30ac\u30a8\u30eb",
          Spanish: "LemonToad",
          Russian: "\u041b\u0438\u043c\u043e\u0433\u0443\u0448\u043a\u0430"
        }, {
          Key: "guardian-18",
          English: "GardenGnome",
          "Simplified Chinese": "\u7eff\u5e3d\u77ee\u4eba",
          "Traditional Chinese": "\u7eff\u5e3d\u77ee\u4eba",
          Japanese: "\u30cb\u30ef\u30ce\u30fc\u30e0",
          Spanish: "Gnomo de jardin",
          Russian: "\u0421\u0430\u0434\u043e\u0432\u044b\u0439\u0413\u043d\u043e\u043c"
        }, {
          Key: "guardian-19",
          English: "Sprite",
          "Simplified Chinese": "\u7eff\u5e3d\u4fa0",
          "Traditional Chinese": "\u7eff\u5e3d\u4fa0",
          Japanese: "\u30b9\u30d7\u30e9\u30a4\u30c4",
          Spanish: "Duende",
          Russian: "\u042d\u043b\u044c\u0444"
        }, {
          Key: "guardian-20",
          English: "Lilac",
          "Simplified Chinese": "\u7d2b\u8346\u516c\u4e3b",
          "Traditional Chinese": "\u7d2b\u8346\u516c\u4e3b",
          Japanese: "\u30e9\u30a4\u30e9\u30c3\u30af\u30eb",
          Spanish: "Lila",
          Russian: "\u0421\u0438\u0440\u0435\u043d\u044c"
        }, {
          Key: "guardian-21",
          English: "Eidelweiss",
          "Simplified Chinese": "\u706b\u7ed2\u516c\u4e3b",
          "Traditional Chinese": "\u706b\u7ed2\u516c\u4e3b",
          Japanese: "\u30a8\u30fc\u30c7\u30eb\u30f3",
          Spanish: "Eidelweiss",
          Russian: "\u042d\u0439\u0434\u0435\u043b\u044c\u0432\u0435\u0439\u0441"
        }, {
          Key: "guardian-22",
          English: "Rose",
          "Simplified Chinese": "\u73ab\u7470\u516c\u4e3b",
          "Traditional Chinese": "\u73ab\u7470\u516c\u4e3b",
          Japanese: "\u30e9\u30d9\u30f3\u30c7\u30a3",
          Spanish: "Rosa",
          Russian: "\u0420\u043e\u0437\u0430"
        }, {
          Key: "guardian-23",
          English: "Daisy",
          "Simplified Chinese": "\u96cf\u83ca\u516c\u4e3b",
          "Traditional Chinese": "\u96cf\u83ca\u516c\u4e3b",
          Japanese: "\u30c7\u30a4\u30b8\u30fc",
          Spanish: "Margarita",
          Russian: "\u041c\u0430\u0440\u0433\u0430\u0440\u0438\u0442\u043a\u0430"
        }, {
          Key: "guardian-24",
          English: "Teala",
          "Simplified Chinese": "\u7eff\u6728\u516c\u4e3b",
          "Traditional Chinese": "\u7eff\u6728\u516c\u4e3b",
          Japanese: "\u30c1\u30e3\u30d0\u30c6\u30a3",
          Spanish: "Teala",
          Russian: "\u0422\u0435\u0430\u043b\u0430"
        }, {
          Key: "guardian-25",
          English: "Cupidog",
          "Simplified Chinese": "\u90b1\u6bd4\u718a",
          "Traditional Chinese": "\u90b1\u6bd4\u718a",
          Japanese: "\u30d4\u30c3\u30c9\u30ad\u30e5\u30fc",
          Spanish: "Cupidog",
          Russian: "\u041a\u0443\u043f\u0438\u0434\u043e\u0433"
        }, {
          Key: "guardian-26",
          English: "BlueBunny",
          "Simplified Chinese": "\u84dd\u5154\u4fa0",
          "Traditional Chinese": "\u84dd\u5154\u4fa0",
          Japanese: "\u30e9\u30d3\u30ed\u30c3\u30c8",
          Spanish: "Bluebunny",
          Russian: "\u0421\u0438\u043d\u0435\u0437\u0430\u0439"
        }, {
          Key: "guardian-27",
          English: "Turnip",
          "Simplified Chinese": "\u751c\u83dc\u718a",
          "Traditional Chinese": "\u751c\u83dc\u718a",
          Japanese: "\u30bf\u30fc\u30cb\u30c3\u30d7",
          Spanish: "Nabo",
          Russian: "\u0420\u0435\u043f\u0430"
        }, {
          Key: "guardian-28",
          English: "GrassBlade",
          "Simplified Chinese": "\u7eff\u5251\u718a",
          "Traditional Chinese": "\u7eff\u5251\u718a",
          Japanese: "\u30cf\u30c4\u30eb\u30ae\u30ea\u30b9",
          Spanish: "GrassBlade",
          Russian: "\u041b\u0435\u0437\u0432\u0438\u0435\u0422\u0440\u0430\u0432\u044b"
        }, {
          Key: "guardian-29",
          English: "PeaWing",
          "Simplified Chinese": "\u9752\u8c46\u9690\u8005",
          "Traditional Chinese": "\u9752\u8c46\u9690\u8005",
          Japanese: "\u30b9\u30ca\u30c3\u30d4\u30fc",
          Spanish: "PeaWing",
          Russian: "\u0413\u043e\u0440\u043e\u0445\u043e\u043a\u0440\u044b\u043b"
        }, {
          Key: "guardian-30",
          English: "Barkling",
          "Simplified Chinese": "\u6811\u6d1e\u5bc6\u7075",
          "Traditional Chinese": "\u6811\u6d1e\u5bc6\u7075",
          Japanese: "\u30ad\u30ce\u30b3\u30ce\u30ad",
          Spanish: "Barkling",
          Russian: "\u0413\u0430\u0432\u0447\u0443\u043d"
        }, {
          Key: "guardian-31",
          English: "Totem",
          "Simplified Chinese": "\u56fe\u817e\u9886\u4e3b",
          "Traditional Chinese": "\u56fe\u817e\u9886\u4e3b",
          Japanese: "\u30c8\u30fc\u30c6\u30e0",
          Spanish: "T\xf3tem",
          Russian: "\u0422\u043e\u0442\u0435\u043c"
        }, {
          Key: "guardian-32",
          English: "Pebbles",
          "Simplified Chinese": "\u9e45\u5375\u5854\u7075",
          "Traditional Chinese": "\u9e45\u5375\u5854\u7075",
          Japanese: "\u30da\u30d6\u30eb\u30f3",
          Spanish: "guijarros",
          Russian: "\u041a\u0430\u043c\u0443\u0448\u0435\u043a"
        }, {
          Key: "guardian-33",
          English: "StoneHead",
          "Simplified Chinese": "\u77f3\u50cf\u5de8\u5934",
          "Traditional Chinese": "\u77f3\u50cf\u5de8\u5934",
          Japanese: "\u30b3\u30ef\u30a4\u30be\u30a6",
          Spanish: "Cabeza de piedra",
          Russian: "\u041a\u0430\u043c\u043d\u0435\u0413\u043b\u0430\u0432"
        }, {
          Key: "guardian-34",
          English: "Dolmen",
          "Simplified Chinese": "\u795e\u79d8\u77f3\u7891",
          "Traditional Chinese": "\u795e\u79d8\u77f3\u7891",
          Japanese: "\u30c9\u30eb\u30e1\u30f3",
          Spanish: "Dolmen",
          Russian: "\u0414\u043e\u043b\u044c\u043c\u0435\u043d"
        }, {
          Key: "guardian-35",
          English: "Golem",
          "Simplified Chinese": "\u7070\u77f3\u5b88\u536b",
          "Traditional Chinese": "\u7070\u77f3\u5b88\u536b",
          Japanese: "\u30b4\u30fc\u30ec\u30e0",
          Spanish: "Golem",
          Russian: "\u0413\u043e\u043b\u0435\u043c"
        }, {
          Key: "guardian-36",
          English: "NutJob",
          "Simplified Chinese": "\u677e\u9f20\u62f3\u51fb\u624b",
          "Traditional Chinese": "\u677e\u9f20\u62f3\u51fb\u624b",
          Japanese: "\u30ca\u30c3\u30c4\u30ea\u30b9",
          Spanish: "Trabajo de bobos",
          Russian: "\u041e\u0440\u0435\u0448\u0435\u043a"
        }, {
          Key: "guardian-37",
          English: "PowOwl",
          "Simplified Chinese": "\u732b\u5934\u9e70\u7235\u58eb",
          "Traditional Chinese": "\u732b\u5934\u9e70\u7235\u58eb",
          Japanese: "\u30d5\u30af\u30ed\u30a6\u30eb",
          Spanish: "PowOwl",
          Russian: "\u0424\u0438\u043b\u0438\u043d"
        }, {
          Key: "guardian-38",
          English: "SeanHick",
          "Simplified Chinese": "\u523a\u732c\u8096\u6069",
          "Traditional Chinese": "\u523a\u732c\u8096\u6069",
          Japanese: "\u30cf\u30ea\u30db\u30c3\u30b0",
          Spanish: "SeanHick",
          Russian: "\u0422\u0443\u043c\u0430\u043d\u0435\u0446"
        }, {
          Key: "guardian-39",
          English: "TrashPanda",
          "Simplified Chinese": "\u6218\u6597\u72f8\u732b",
          "Traditional Chinese": "\u6218\u6597\u72f8\u732b",
          Japanese: "\u30a2\u30e9\u30a4\u30d9\u30a2",
          Spanish: "TrashPanda",
          Russian: "\u041f\u0430\u043d\u0434\u0430\u0414\u0432\u043e\u0440\u043d\u0438\u043a"
        }, {
          Key: "guardian-40",
          English: "Justin",
          "Simplified Chinese": "\u6d77\u736d\u536b\u58eb",
          "Traditional Chinese": "\u6d77\u736d\u536b\u58eb",
          Japanese: "\u30b8\u30e3\u30b9\u30c6\u30a3\u30f3",
          Spanish: "Justin",
          Russian: "\u0411\u043e\u0431\u0440\u0438\u043a"
        }, {
          Key: "guardian-41",
          English: "Chief",
          "Simplified Chinese": "\u795e\u79d8\u914b\u957f",
          "Traditional Chinese": "\u795e\u79d8\u914b\u957f",
          Japanese: "\u30ea\u30eb\u30c1\u30fc\u30d5",
          Spanish: "Jefe",
          Russian: "\u0428\u0435\u0444"
        }, {
          Key: "guardian-42",
          English: "Sylvid",
          "Simplified Chinese": "\u6728\u795e\u5e0c\u5c14",
          "Traditional Chinese": "\u6728\u795e\u5e0c\u5c14",
          Japanese: "\u30b7\u30eb\u30d3\u30c3\u30c9",
          Spanish: "Sylvid",
          Russian: "\u0421\u0438\u043b\u044c\u0432\u0438\u0434\u0430"
        }, {
          Key: "guardian-43",
          English: "Onidine",
          "Simplified Chinese": "\u6c34\u795e\u5965\u59ae",
          "Traditional Chinese": "\u6c34\u795e\u5965\u59ae",
          Japanese: "\u30aa\u30cb\u30c0\u30a4\u30f3",
          Spanish: "Onidine",
          Russian: "\u041e\u043d\u0438\u0434\u0438\u043d\u0430"
        }, {
          Key: "guardian-44",
          English: "Zenine",
          "Simplified Chinese": "\u51a5\u60f3\u7231\u739b",
          "Traditional Chinese": "\u51a5\u60f3\u7231\u739b",
          Japanese: "\u30bc\u30f3\u30c6\u30fc\u30eb",
          Spanish: "Zenine",
          Russian: "\u0417\u0435\u043d\u0438\u043d\u0430"
        }, {
          Key: "guardian-45",
          English: "Tritail",
          "Simplified Chinese": "\u7d2b\u83f1\u7fe0\u897f",
          "Traditional Chinese": "\u7d2b\u83f1\u7fe0\u897f",
          Japanese: "\u30c8\u30e9\u30a4\u30c6\u30fc\u30eb",
          Spanish: "Tritail",
          Russian: "\u0422\u0440\u0438\u0425\u0432\u043e\u0441\u0442\u0438\u0446\u0430"
        }, {
          Key: "guardian-46",
          English: "Pinkwind",
          "Simplified Chinese": "\u5343\u624b\u6e29\u8482",
          "Traditional Chinese": "\u5343\u624b\u6e29\u8482",
          Japanese: "\u30d4\u30f3\u30af\u30cd\u30fc\u30c9",
          Spanish: "Pinkwind",
          Russian: "\u0420\u043e\u0437\u0430\u0412\u0435\u0442\u0440\u043e\u0432"
        }, {
          Key: "guardian-47",
          English: "Unitaur",
          "Simplified Chinese": "\u72ec\u89d2\u4f18\u5a1c",
          "Traditional Chinese": "\u72ec\u89d2\u4f18\u5a1c",
          Japanese: "\u30e6\u30cb\u30bf\u30a6\u30ed\u30b9",
          Spanish: "Unitaur",
          Russian: "\u0423\u043d\u0438\u0442\u0430\u0432\u0440"
        }, {
          Key: "guardian-48",
          English: "LadyBug",
          "Simplified Chinese": "\u4e03\u661f\u884c\u8005",
          "Traditional Chinese": "\u4e03\u661f\u884c\u8005",
          Japanese: "\u30c6\u30f3\u30c8\u30a5\u30fc",
          Spanish: "Mariquita",
          Russian: "\u041a\u043e\u0440\u043e\u0432\u043a\u0430"
        }, {
          Key: "guardian-49",
          English: "Queeny",
          "Simplified Chinese": "\u9ec4\u8702\u7687\u540e",
          "Traditional Chinese": "\u9ec4\u8702\u7687\u540e",
          Japanese: "\u30af\u30a4\u30f3\u30d3\u30fc",
          Spanish: "Queeny",
          Russian: "\u041f\u0447\u0435\u043b\u043e\u041c\u0430\u0442\u043a\u0430"
        }, {
          Key: "guardian-50",
          English: "Beetle",
          "Simplified Chinese": "\u72ec\u89d2\u4ed9\u4eba",
          "Traditional Chinese": "\u72ec\u89d2\u4ed9\u4eba",
          Japanese: "\u30ab\u30d6\u30c8\u30ed\u30f3",
          Spanish: "Escarabajo",
          Russian: "\u0416\u0443\u0447\u0435\u043a"
        }, {
          Key: "guardian-51",
          English: "Monna",
          "Simplified Chinese": "\u8774\u8776\u516c\u4e3b",
          "Traditional Chinese": "\u8774\u8776\u516c\u4e3b",
          Japanese: "\u30a2\u30b2\u30cf\u30e9\u30f3",
          Spanish: "Monna",
          Russian: "\u041c\u043e\u043d\u043d\u0430"
        }, {
          Key: "guardian-52",
          English: "CottonBall",
          "Simplified Chinese": "\u68c9\u7403\u516c\u4e3b",
          "Traditional Chinese": "\u68c9\u7403\u516c\u4e3b",
          Japanese: "\u30e2\u30b9\u30df\u30b9",
          Spanish: "Bola de algod\xf3n",
          Russian: "\u0425\u043b\u043e\u043f\u043a\u043e\u0428\u0430\u0440"
        }, {
          Key: "guardian-53",
          English: "DragonEgg",
          "Simplified Chinese": "\u9f99\u86cb\u4ed4",
          "Traditional Chinese": "\u9f99\u86cb\u4ed4",
          Japanese: "\u30c9\u30e9\u30bf\u30de\u30b4\u30f3",
          Spanish: "DragonEgg",
          Russian: "\u0414\u0440\u0430\u043a\u043e\u044f\u0439\u043a"
        }, {
          Key: "guardian-54",
          English: "Dragonlet",
          "Simplified Chinese": "\u5c0f\u7d2b\u9f99",
          "Traditional Chinese": "\u5c0f\u7d2b\u9f99",
          Japanese: "\u30c9\u30e9\u30b5\u30a6\u30eb\u30b9",
          Spanish: "Dragonlet",
          Russian: "\u0414\u0440\u0430\u043a\u043e\u043d\u0447\u0438\u043a"
        }, {
          Key: "guardian-55",
          English: "Wyvernling",
          "Simplified Chinese": "\u706b\u9f99\u738b\u5b50",
          "Traditional Chinese": "\u706b\u9f99\u738b\u5b50",
          Japanese: "\u30c9\u30e9\u30c7\u30d3\u30eb",
          Spanish: "Wyvernling",
          Russian: "\u0412\u0438\u0432\u0435\u0440\u043d\u043b\u0438\u043d\u0433"
        }, {
          Key: "guardian-56",
          English: "Dragon",
          "Simplified Chinese": "\u5ca9\u6d46\u9886\u4e3b",
          "Traditional Chinese": "\u5ca9\u6d46\u9886\u4e3b",
          Japanese: "\u30c9\u30e9\u30b7\u30fc\u30b5\u30fc",
          Spanish: "Continuar",
          Russian: "\u0414\u0440\u0430\u043a\u043e\u0448\u0430"
        }, {
          Key: "guardian-57",
          English: "GreatWyrm",
          "Simplified Chinese": "\u5de8\u9f99\u97e6\u6069",
          "Traditional Chinese": "\u5de8\u9f99\u97e6\u6069",
          Japanese: "\u30c9\u30e9\u30b5\u30bf\u30f3",
          Spanish: "GreatWyrm",
          Russian: "\u0412\u0438\u0440\u043c"
        }, {
          Key: "guardian-58",
          English: "GreenMagi",
          "Simplified Chinese": "\u7eff\u6728\u5723\u5973",
          "Traditional Chinese": "\u7eff\u6728\u5723\u5973",
          Japanese: "\u30b0\u30ea\u30f3\u30de\u30ae\u30fc",
          Spanish: "GreenMagi",
          Russian: "\u0417\u0435\u043b\u0435\u0424\u0435\u044f"
        }, {
          Key: "guardian-59",
          English: "DarkMagi",
          "Simplified Chinese": "\u7d2b\u8346\u5723\u5973",
          "Traditional Chinese": "\u7d2b\u8346\u5723\u5973",
          Japanese: "\u30c0\u30fc\u30af\u30de\u30ae\u30fc",
          Spanish: "DarkMagi",
          Russian: "\u0427\u0435\u0440\u043d\u043e\u0424\u0435\u044f"
        }, {
          Key: "guardian-60",
          English: "UltiMagi",
          "Simplified Chinese": "\u5929\u4f7f\u5723\u5973",
          "Traditional Chinese": "\u5929\u4f7f\u5723\u5973",
          Japanese: "\u30df\u30f3\u30c8\u30de\u30ae\u30fc",
          Spanish: "UltiMagi",
          Russian: "\u0423\u043b\u044c\u0442\u0438\u0424\u0435\u044f"
        }, {
          Key: "guardian-61",
          English: "Picasso",
          "Simplified Chinese": "\u795e\u9f9f\u6597\u58eb",
          "Traditional Chinese": "\u795e\u9f9f\u6597\u58eb",
          Japanese: "\u30d4\u30c3\u30ab\u30bd",
          Spanish: "Picasso",
          Russian: "\u041f\u0438\u043a\u0430\u0441\u0441\u043e"
        }, {
          Key: "guardian-62",
          English: "Chitinus",
          "Simplified Chinese": "\u9f99\u867e\u8d85\u4eba",
          "Traditional Chinese": "\u9f99\u867e\u8d85\u4eba",
          Japanese: "\u30ab\u30cb\u30ab\u30d6\u30c8",
          Spanish: "Chitinus",
          Russian: "\u0425\u0438\u0442\u0438\u043d"
        }, {
          Key: "guardian-63",
          English: "Neptune",
          "Simplified Chinese": "\u4e09\u53c9\u5de8\u9cb6",
          "Traditional Chinese": "\u4e09\u53c9\u5de8\u9cb6",
          Japanese: "\u30dd\u30bb\u30a4\u30ae\u30e7\u30f3",
          Spanish: "Neptuno",
          Russian: "\u041d\u0435\u043f\u0442\u0443\u043d"
        }, {
          Key: "guardian-64",
          English: "Siren",
          "Simplified Chinese": "\u4eba\u9c7c\u516c\u4e3b",
          "Traditional Chinese": "\u4eba\u9c7c\u516c\u4e3b",
          Japanese: "\u30b5\u30a4\u30ec\u30fc\u30f3",
          Spanish: "Sirena",
          Russian: "\u0421\u0438\u0440\u0435\u043d\u0430"
        }, {
          Key: "guardian-65",
          English: "MK",
          "Simplified Chinese": "\u7334\u738b\u609f\u7a7a",
          "Traditional Chinese": "\u7334\u738b\u609f\u7a7a",
          Japanese: "\u30b4\u30f3\u30bd\u30af\u30fc",
          Spanish: "MK",
          Russian: "\u041c\u0430\u043a\u0430\u043a"
        }, {
          Key: "guardian-66",
          English: "Pussenboot",
          "Simplified Chinese": "\u51fb\u5251\u732b\u4fa0",
          "Traditional Chinese": "\u51fb\u5251\u732b\u4fa0",
          Japanese: "\u30cd\u30b3\u30d6\u30fc\u30c4",
          Spanish: "Pussenboot",
          Russian: "\u041a\u043e\u0442\u0421\u0430\u043f\u043e\u0433"
        }, {
          Key: "guardian-67",
          English: "Aries",
          "Simplified Chinese": "\u7ef5\u7f8a\u6597\u58eb",
          "Traditional Chinese": "\u7ef5\u7f8a\u6597\u58eb",
          Japanese: "\u30a2\u30ec\u30fc\u30b9",
          Spanish: "Aries",
          Russian: "\u041e\u0432\u0435\u043d"
        }, {
          Key: "guardian-68",
          English: "Bestet",
          "Simplified Chinese": "\u80e1\u72fc\u5deb\u5e08",
          "Traditional Chinese": "\u80e1\u72fc\u5deb\u5e08",
          Japanese: "\u30d0\u30b9\u30c6\u30c8",
          Spanish: "Bestet",
          Russian: "\u0411\u0430\u0441\u0442\u0435\u0442"
        }, {
          Key: "guardian-69",
          English: "Peacock",
          "Simplified Chinese": "\u795e\u9e70\u9886\u4e3b",
          "Traditional Chinese": "\u795e\u9e70\u9886\u4e3b",
          Japanese: "\u30af\u30b8\u30e3\u30c3\u30ad\u30fc",
          Spanish: "Pavo real",
          Russian: "\u041f\u0430\u0432\u043b\u0438\u043d"
        }, {
          Key: "guardian-70",
          English: "Tinkerbelle",
          "Simplified Chinese": "\u5947\u5999\u4ed9\u5b50",
          "Traditional Chinese": "\u5947\u5999\u4ed9\u5b50",
          Japanese: "\u30b0\u30ea\u30f3\u30c0\u30ea\u30f3",
          Spanish: "Tinkerbelle",
          Russian: "\u0422\u0438\u043d\u043a\u0435\u0440\u0431\u0435\u043b\u043b"
        }, {
          Key: "guardian-71",
          English: "Teddy",
          "Simplified Chinese": "\u6cf0\u8fea\u718a\u5b9d",
          "Traditional Chinese": "\u6cf0\u8fea\u718a\u5b9d",
          Japanese: "\u30c6\u30c7\u30a3",
          Spanish: "Peluche",
          Russian: "\u0422\u0435\u0434\u0434\u0438"
        }, {
          Key: "guardian-72",
          English: "Koala",
          "Simplified Chinese": "\u5927\u8033\u8003\u62c9",
          "Traditional Chinese": "\u5927\u8033\u8003\u62c9",
          Japanese: "\u30b3\u30a2\u30e9",
          Spanish: "Coala",
          Russian: "\u041a\u043e\u0430\u043b\u0430"
        }, {
          Key: "guardian-73",
          English: "Wombat",
          "Simplified Chinese": "\u888b\u718a\u52c7\u58eb",
          "Traditional Chinese": "\u888b\u718a\u52c7\u58eb",
          Japanese: "\u30a6\u30a9\u30f3\u30d0\u30c3\u30c8",
          Spanish: "Wombat",
          Russian: "\u0412\u043e\u043c\u0431\u0430\u0442"
        }, {
          Key: "guardian-74",
          English: "Fenec",
          "Simplified Chinese": "\u8033\u5ed3\u72d0\u4ed9",
          "Traditional Chinese": "\u8033\u5ed3\u72d0\u4ed9",
          Japanese: "\u30d5\u30a7\u30cd\u30c3\u30af",
          Spanish: "Fenec",
          Russian: "\u0424\u0435\u043d\u0435\u043a"
        }, {
          Key: "guardian-75",
          English: "Platypus",
          "Simplified Chinese": "\u9e2d\u5634\u6218\u58eb",
          "Traditional Chinese": "\u9e2d\u5634\u6218\u58eb",
          Japanese: "\u30d7\u30e9\u30c6\u30a3\u30d1\u30b9",
          Spanish: "Ornitorrinco",
          Russian: "\u0423\u0442\u043a\u043e\u043d\u043e\u0441"
        } ]
      }
    });
    module.exports = DB_plantName;
    cc._RF.pop();
  }, {} ],
  DB_plant: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "99e9aR5Sl1LMJeZ/mf1FQay", "DB_plant");
    "use strict";
    var DB_plant = cc.Class({
      name: "DB_plant",
      statics: {
        dataLen: 70,
        dataHead: '["level", "cd", "power", "skill", "offline", "price", "gem", "prefab", "shootPos", "steakColor", "head"]',
        data: '{"1":[1,1,10,"1|10",60,100,0,"01_58wdss","38,34","0xddff8d","01_58wdss",1,1,26,19,1,1],"2":[2,0.96,16,"2|10",28,1548,0,"63_80stwd","15,85","0xddff8d","63_80stwd",1,0,26,19,2,1.1],"3":[3,0.92,25,"3|5",13,6969,0,"35_75scss","20,45","0xddff8d","35_75scss",1,1,26,19,1,1],"4":[4,0.88,42,"1|11",6,18539,0,"02_29jqwd","35,45","0xffe400","02_29jqwd",0,1,26,19,1,1],"5":[5,0.84,75,"2|11",3,49314,0,"50_72yswdss","60,80","0xddff8d","50_72yswdss",1,1,25,35,1,1],"6":[6,0.81,140,"3|5.5",2,131176,0,"42_02aywd","40,58","0x9c00ff","42_02aywd",1,1,22,28,1,1],"7":[7,0.78,293,"1|12",11,348928,0,"33_28hywdss","30,78","0xffae00","33_28hywdss",1,1,22,26,1,1.1],"8":[8,0.75,601,"2|12",136,928149,0,"58_14dnwdss","31,71","0x00ff8a","58_14dnwdss",1,1,25,20,1,1],"9":[9,0.72,1214,"3|6",145,2468878,0,"18_30jgd","43,53","0x00fcff","18_30jgd",1,1,23,18,1,0.9],"10":[10,0.69,2536,"1|13",23,6567215,0,"38_55sxh","20,47","0xffffff","38_55sxh",1,1,20,29,1,1.1],"11":[11,0.67,5307,"2|13",76,17468797,6,"11_15dyg","33,53","0x7800ff","11_15dyg",1,1,18,23,1,1.1],"12":[12,0.65,11615,"3|6.5",113,46467000,8,"36_49qslm","30,50","0xffe400","36_49qslm",1,1,16,45,1,1],"13":[13,0.63,24392,"1|14",10,123602221,10,"13_70ymts","40,57","0xffe400","13_70ymts",1,1,24,12,1,1],"14":[14,0.61,51224,"2|14",25,328781909,13,"65_79mgck","40,57","0xffffff","65_79mgck",0,0,15,9,1,1],"15":[15,0.6,107572,"3|7",9,874559877,17,"15_11dxq","40,57","0xddff8d","15_11dxq",1,1,20,28,1,1],"16":[16,0.59,225903,"1|15",9,2326329273,22,"16_68yllj","26,73","0x7bbfff","16_68yllj",1,1,20,37,1,1],"17":[17,0.58,474396,"2|15",6,6188035867,30,"26_05blc","48,61","0x00fcff","26_05blc",1,1,17,40,1,0.9],"18":[18,0.57,996232,"3|7.5",8,16460175406,40,"05_25hxbss","29,44","0xffe400","05_25hxbss",0,1,20,29,1,1],"19":[19,0.56,2092088,"1|16",10,43784066580,50,"61_77mhs","30,46","0xff2c16","61_77mhs",0,1,23,12,1,1.1],"20":[20,0.55,4393386,"2|16",13,116465617103,60,"03_59xgts","25,80","0xddff8d","03_59xgts",1,1,26,18,1,1],"21":[21,0.54,9226110,"3|8",16,309798541495,80,"21_06bxg","25,80","0x00fcff","21_06bxg",1,1,26,18,1,1],"22":[22,0.53,19374831,"1|17",21,824064120378,100,"22_65xgjp","45,71","0xffc7ba","22_65xgjp",1,1,22,14,1,1],"23":[23,0.52,40687144,"2|17",10,2192010560204,130,"23_26hlc","54,73","0xff2c16","23_26hlc",1,1,22,29,1,0.9],"24":[24,0.51,85443003,"3|8.5",12,5830748090144,160,"24_34lbh","14,66","0xff92f6","24_34lbh",1,1,22,27,1,0.9],"25":[25,0.51,179430308,"1|17.5",16,15509789919784,200,"56_04bzg","45,52","0x20f3fa","56_04bzg",1,1,30,19,1,0.9],"26":[26,0.51,376803646,"2|17.5",20,41256041186627,240,"17_31jlmvw","49,44","0xffe400","17_31jlmvw",0,1,17,39,1,0.9],"27":[27,0.51,791287659,"3|8.5",25,109741069556429,290,"27_22hlbddc","41,54","0xffe400","27_22hlbddc",0,1,22,14,1,0.9],"28":[28,0.51,1661704084,"1|18",32,291911245020100,340,"44_32jfgl","75,63","0xddff8d","44_32jfgl",1,1,27,12,1,0.9],"29":[29,0.51,3489578577,"2|18",41,776483911753466,400,"52_13dlcl","52,60","0xff2751","52_13dlcl",0,1,26,15,1,0.9],"30":[30,0.51,7328115014,"3|9",52,2065447205264220,460,"06_46msg","15,115","0xffffff","06_46msg",1,1,21,14,2,0.9],"31":[31,0.51,15389041529,"1|18.5",25,5494089566002820,530,"31_35ljts","22,90","0xffd800","31_35ljts",1,1,29,14,1,1],"32":[32,0.51,32316987211,"2|18.5",31,14614278245567600,600,"32_60xrz","20,110","0xffd200","32_60xrz",1,1,11,32,1,1],"33":[33,0.51,67865673145,"3|9",40,38873980133209600,680,"20_03bj","10,100","0xccf824","20_03bj",1,1,18,16,1,1],"34":[34,0.51,142517913605,"1|19",51,103404787154336000,760,"34_54sjl","15,48","0x00fcff","34_54sjl",1,1,22,19,1,1],"35":[35,0.51,299287618570,"2|19",64,275056733830537000,850,"29_19hbg","22,50","0x00fcff","29_19hbg",1,1,26,39,1,0.85],"36":[36,0.51,628503998998,"3|9.5",81,731650911989229000,940,"14_66yzjlp","25,60","0xff2c16","14_66yzjlp",0,1,26,12,1,1],"37":[37,0.51,1319858397895,"1|19.5",103,1946191425891390000,1040,"37_41llys","62,108","0x00fcff","37_41llys",1,1,26,14,1,0.9],"38":[38,0.51,2771702635582,"2|19.5",131,5176869192871100000,1140,"62_69ymts","40,50","0xff00cc","62_69ymts",1,1,22,22,1,0.9],"39":[39,0.51,5820575534722,"3|9.5",166,13770472053037099008,1250,"39_18ffc","45,80","0xff2c16","39_18ffc",1,1,26,23,1,1],"40":[40,0.51,12223208622916,"1|20",210,36629455661078601728,1360,"40_67yylk","35,65","0x00fcff","40_67yylk",0,1,18,21,1,0.9],"41":[41,0.51,25668738108123,"2|20",267,97434352058469007360,1480,"10_12djlm","35,50","0x32ceff","10_12djlm",1,1,14,32,1,1],"42":[42,0.51,53904350027060,"3|10",338,259175376475526987776,1600,"08_38lo","30,70","0x00f0ff","08_38lo",1,1,24,37,1,1],"43":[43,0.51,113199135056826,"1|20.5",428,689406501424900997120,1730,"43_40lrcts","30,60","0xff2c16","43_40lrcts",0,1,26,20,1,1],"44":[44,0.51,237718183619334,"2|20.5",542,1833821293790229954560,1860,"28_36llc","25,90","0x00fcff","28_36llc",1,1,26,17,1,1],"45":[45,0.51,499208185600602,"3|10",687,4877964641482029662208,2000,"53_50jzrz","25,95","0xddff8d","53_50jzrz",0,1,26,36,1,1],"46":[46,0.51,1048337189761260,"1|21",871,12975385946342199132160,2140,"46_61xmgs","0,110","0x00fcff","46_61xmgs",1,0,0,0,2,1],"47":[47,0.51,2201508098498650,"2|21",1103,34514526617270298345472,2290,"25_47pgpjp","30,90","0xff2c16","25_47pgpjp",1,1,26,10,1,1],"48":[48,0.51,4623167006847160,"3|10.5",1397,91808640801938899730432,2440,"48_73zsf","25,55","0xafff00","48_73zsf",0,1,17,11,1,1],"49":[49,0.51,9708650714379030,"1|21.5",1770,244210984533157014929408,2600,"49_74zrsk","30,50","0xffe400","49_74zrsk",0,1,22,35,1,1],"50":[50,0.51,20388166500196000,"2|21.5",2242,649601218858199050878976,2760,"12_09cfjl","45,55","0xffe400","12_09cfjl",1,1,18,17,1,1],"51":[51,0.51,42815149650411500,"3|10.5",2840,1727939242162809982681088,2930,"51_48pgy","15,65","0xfdffe5","51_48pgy",0,1,24,23,1,1],"52":[52,0.51,89911814265864100,"1|22",3598,4596318384153069807992832,3100,"04_71yjxhs","45,50","0xff2c16","04_71yjxhs",1,1,22,15,1,1],"53":[53,0.51,188814809958315000,"2|22",4557,12226206901847200714719232,3280,"09_21hzh","30,55","0xef42ff","09_21hzh",0,1,12,41,1,1],"54":[54,0.51,396511100912460000,"3|11",5773,32521710358913501416652800,3460,"54_23hjbxz","30,65","0x00fcff","54_23hjbxz",0,1,20,26,1,1],"55":[55,0.51,832673311916168000,"1|22.5",7312,86507749554709900883394560,3650,"55_76hchqs","30,65","0x9c00ff","55_76hchqs",0,0,0,0,1,1],"56":[56,0.51,1748613955023950000,"2|22.5",9262,230110613815527994470432768,3840,"19_53sqsg","20,65","0xff2c16","19_53sqsg",1,1,19,19,1,1],"57":[57,0.51,3672089305550300000,"3|11",11729,612094232749305026729476096,4040,"57_42mwc","50,80","0x00fcff","57_42mwc",1,1,20,13,1,1],"58":[58,0.51,7711387541655640000,"1|23",14861,1628170659113149875764592640,4240,"66_78dwh","25,65","0x00ff8a","66_78dwh",1,1,32,26,1,1],"59":[59,0.51,16193913837476800512,"2|23",18824,4330933953240979741557653504,4350,"59_27hyhvw","25,65","0xffb400","59_27hyhvw",1,1,23,48,1,1],"60":[60,0.51,34007219058701398016,"3|11.5",23844,11520284315620999911297777664,4460,"60_07cw","20,65","0xddff8d","60_07cw",0,0,27,28,1,1], "61":[61,0.51,71443737518280200000,"1|23.5",30202,30720758174989333096794073770,4574,"evo_61","25,55","0x61423A","evo_61",0,0,27,28,1,1], "62":[62,0.51,150091885542605462184,"2|23.5",36242,81922021799971554924784196720,4691,"evo_62","25,45","0xECCDA0","evo_62",0,0,27,28,1,1], "63":[63,0.51,315319087274381223075,"3|12",43490,218458724799924146466091191253,4811,"evo_63","40,45","0xddff8d","evo_63",0,0,27,28,1,1], "64":[64,0.51,662435057299120216544,"1|24",52188,582556599466464390576243176674,4934,"evo_64","25,55","0x2173B4","evo_64",0,0,27,28,1,1], "65":[65,0.51,1391670288443529866689,"2|24",62625,1553484265243905041536648471130,5060,"evo_65","30,75","0xddff8d","evo_65",0,0,27,28,1,1], "66":[66,0.51,2923677076562037535060,"3|12.5",75150,4142624707317080110764395923013,5189,"evo_66","25,45","0x773F3F","evo_66",0,0,27,28,1,1], "67":[67,0.51,6142178732273188098865,"1|24.5",90180,11046999219512213628705055794701,5322,"evo_67","30,45","0xddff8d","evo_67",0,0,27,28,1,1], "68":[68,0.51,12903736832506697686691,"2|24.5",108216,29458664585365903009880148785869,5458,"evo_68","25,105","0xddff8d","evo_68",0,0,27,28,1,1], "69":[69,0.51,27108690824593902703132,"3|13",129859,78556438894309074693013730095650,5597,"evo_69","30,45","0xddff8d","evo_69",0,0,27,28,1,1], "70":[70,0.51,56951031144104837611621,"1|25",155830,209483837051490865848036613588400,5740,"evo_70","50,85","0xD824CA","evo_70",0,0,27,28,1,1], "71":[71,0.51,119597165402620158984404,"2|25",185437,557227006556965703155777392145144,5883,"evo_71","40,50","0xD12323","evo_71",0,0,27,28,1,1], "72":[72,0.51,251154047345502333867248,"3|14",220670,1482223837441528770394367863106083,6000,"evo_72","40,65","0x756E6E","evo_72",0,0,27,28,1,1], "73":[73,0.51,527423499425554901121220,"1|26",262597,3853781977347974803025356444075815,6120,"evo_73","40,65","0x815151","evo_73",0,0,27,28,1,1], "74":[74,0.51,1107589348793665292354562,"2|26",312490,10019833141104734487865926754597119,6242,"evo_74","50,85","0x815151","evo_74",0,0,27,28,1,1], "75":[75,0.51,2325937632466697113944580,"3|15",371863,26051566166872309668451409561952509,6366,"evo_75","50,65","0xC5961C","evo_75",0,0,27,28,1,1]}'
      }
    });
    module.exports = DB_plant;
    cc._RF.pop();
  }, {} ],
  DB_shopSort: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9a5a8nSkuJIDZKd0H4hanXD", "DB_shopSort");
    "use strict";
    var DB_shopSort = cc.Class({
      name: "DB_shopSort",
      statics: {
        dataLen: 70,
        dataHead: '["level", "MAX", "MAX_1", "MAX_2", "MAX_3", "MAX_4", "MAX_5", "MAX_6", "MAX_7", "MAX_8"]',
        data: '{"1":[1,"M","","","","","","","",""],"2":[2,"U","M","","","","","","",""],"3":[3,"U","U","M","","","","","",""],"4":[4,"U","U","M","M","","","","",""],"5":[5,"U","U","AD","M","M","","","",""],"6":[6,"U","U","AD","M","M","M","","",""],"7":[7,"U","U","AD","M","M","M","M","",""],"8":[8,"U","U","AD","M","M","M","M","M",""],"9":[9,"U","U","AD","M","M","M","M","M","M"],"10":[10,"U","U","AD","M","M","M","M","M","M"],"11":[11,"U","U","AD","M","M","M","M","M","M"],"12":[12,"U","U","M","AD","M","M","M","M","M"],"13":[13,"U","U","G","M","AD","M","M","M","M"],"14":[14,"U","U","G","G","M","AD","M","M","M"],"15":[15,"U","U","G","G","M","AD","M","M","M"],"16":[16,"U","U","G","G","M","AD","M","M","M"],"17":[17,"U","U","G","G","M","AD","M","M","M"],"18":[18,"U","U","G","G","M","AD","M","M","M"],"19":[19,"U","U","G","G","M","AD","M","M","M"],"20":[20,"U","U","G","G","M","AD","M","M","M"],"21":[21,"U","U","G","G","M","AD","M","M","M"],"22":[22,"U","U","G","G","M","AD","M","M","M"],"23":[23,"U","U","G","G","M","M","AD","M","M"],"24":[24,"U","U","G","G","M","M","AD","M","M"],"25":[25,"U","U","G","G","M","M","AD","M","M"],"26":[26,"U","U","G","G","M","M","AD","M","M"],"27":[27,"U","U","G","G","M","M","AD","M","M"],"28":[28,"U","U","G","G","M","M","AD","M","M"],"29":[29,"U","U","G","G","M","M","AD","M","M"],"30":[30,"U","U","G","G","M","M","AD","M","M"],"31":[31,"U","U","G","G","M","M","M","AD","M"],"32":[32,"U","U","G","G","M","M","M","AD","M"],"33":[33,"U","U","G","G","M","M","M","AD","M"],"34":[34,"U","U","G","G","M","M","M","AD","M"],"35":[35,"U","U","G","G","M","M","M","AD","M"],"36":[36,"U","U","G","G","M","M","M","AD","M"],"37":[37,"U","U","G","G","M","M","M","AD","M"],"38":[38,"U","U","G","G","M","M","M","AD","M"],"39":[39,"U","U","G","G","M","M","M","AD","M"],"40":[40,"U","U","G","G","M","M","M","AD","M"],"41":[41,"U","U","G","G","M","M","M","AD","M"],"42":[42,"U","U","G","G","M","M","M","AD","M"],"43":[43,"U","U","G","G","M","M","M","AD","M"],"44":[44,"U","U","G","G","M","M","M","AD","M"],"45":[45,"U","U","G","G","M","M","M","AD","M"],"46":[46,"U","U","G","G","M","M","M","AD","M"],"47":[47,"U","U","G","G","M","M","M","AD","M"],"48":[48,"U","U","G","G","M","M","M","AD","M"],"49":[49,"U","U","G","G","M","M","M","AD","M"],"50":[50,"U","U","G","G","M","M","M","AD","M"],"51":[51,"U","U","G","G","M","M","M","AD","M"],"52":[52,"U","U","G","G","M","M","M","AD","M"],"53":[53,"U","U","G","G","M","M","M","AD","M"],"54":[54,"U","U","G","G","M","M","M","AD","M"],"55":[55,"U","U","G","G","M","M","M","AD","M"],"56":[56,"U","U","G","G","M","M","M","AD","M"],"57":[57,"U","U","G","G","M","M","M","AD","M"],"58":[58,"U","U","G","G","M","M","M","AD","M"],"59":[59,"U","U","G","G","M","M","M","AD","M"],"60":[60,"U","U","G","G","M","M","M","AD","M"],"61":[61,"U","U","G","G","M","M","M","AD","M"],"62":[62,"U","U","G","G","M","M","M","AD","M"],"63":[63,"U","U","G","G","M","M","M","AD","M"],"64":[64,"U","U","G","G","M","M","M","AD","M"],"65":[65,"U","U","G","G","M","M","M","AD","M"],"66":[66,"U","U","G","G","M","M","M","AD","M"],"67":[67,"U","U","G","G","M","M","M","AD","M"],"68":[68,"U","U","G","G","M","M","M","AD","M"],"69":[69,"U","U","G","G","M","M","M","AD","M"],"70":[70,"U","U","G","G","M","M","M","AD","M"], "71":[71,"U","U","G","G","M","M","M","AD","M"], "72":[72,"U","U","G","G","M","M","M","AD","M"], "73":[73,"U","U","G","G","M","M","M","AD","M"], "74":[74,"U","U","G","G","M","M","M","AD","M"], "75":[75,"U","U","G","G","M","M","M","AD","M"]}'
      }
    });
    module.exports = DB_shopSort;
    cc._RF.pop();
  }, {} ],
  DB_spinLevel: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "302f5cxMGlNfIdmeDXrd5KP", "DB_spinLevel");
    "use strict";
    var DB_spinLevel = cc.Class({
      name: "DB_spinLevel",
      statics: {
        dataLen: 70,
        dataHead: '["Level", "SpinS", "SpinA", "SpinB", "SpinC"]',
        data: '{"1":[1,1,1,1,1],"2":[2,1,1,1,1],"3":[3,1,1,1,1],"4":[4,2,2,1,1],"5":[5,3,3,2,1],"6":[6,4,3,3,2],"7":[7,5,4,3,2],"8":[8,6,5,4,3],"9":[9,6,5,4,3],"10":[10,7,6,5,4],"11":[11,7,6,5,4],"12":[12,8,7,6,5],"13":[13,9,8,7,6],"14":[14,10,9,8,7],"15":[15,11,10,9,8],"16":[16,12,11,10,9],"17":[17,13,12,11,10],"18":[18,14,13,12,11],"19":[19,15,14,13,12],"20":[20,16,15,14,13],"21":[21,17,16,15,14],"22":[22,18,17,16,15],"23":[23,19,18,17,16],"24":[24,20,19,18,17],"25":[25,21,20,19,18],"26":[26,22,21,20,19],"27":[27,23,22,21,20],"28":[28,24,23,22,21],"29":[29,25,24,23,22],"30":[30,26,25,24,23],"31":[31,27,26,25,24],"32":[32,28,27,26,25],"33":[33,29,28,27,26],"34":[34,30,29,28,27],"35":[35,31,30,29,28],"36":[36,32,31,30,29],"37":[37,33,32,31,30],"38":[38,34,33,32,31],"39":[39,35,34,33,32],"40":[40,36,35,34,33],"41":[41,37,36,35,34],"42":[42,38,37,36,35],"43":[43,39,38,37,36],"44":[44,40,39,38,37],"45":[45,41,40,39,38],"46":[46,42,41,40,39],"47":[47,43,42,41,40],"48":[48,44,43,42,41],"49":[49,45,44,43,42],"50":[50,46,45,44,43],"51":[51,47,46,45,44],"52":[52,48,47,46,45],"53":[53,49,48,47,46],"54":[54,50,49,48,47],"55":[55,51,50,49,48],"56":[56,52,51,50,49],"57":[57,53,52,51,50],"58":[58,54,53,52,51],"59":[59,55,54,53,52],"60":[60,56,55,54,53],"61":[61,57,56,55,54],"62":[62,58,57,56,55],"63":[63,59,58,57,56],"64":[64,60,59,58,57],"65":[65,61,60,59,58],"66":[66,62,61,60,59],"67":[67,63,62,61,60],"68":[68,64,63,62,61],"69":[69,65,64,63,62],"70":[70,66,65,64,63], "71":[71,67,66,65,64], "72":[72,68,67,66,65], "73":[73,69,68,67,66], "74":[74,70,69,68,67], "75":[75,71,70,69,68]}'
      }
    });
    module.exports = DB_spinLevel;
    cc._RF.pop();
  }, {} ],
  DB_turntable: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "64065XfzjJKvKlrh0erRkH1", "DB_turntable");
    "use strict";
    var DB_turntable = cc.Class({
      name: "DB_turntable",
      statics: {
        dataLen: 11,
        dataHead: '["id", "type", "rarity", "weight", "rewards"]',
        data: '{"1":[1,"coin","C",8,-7.0],"2":[2,"coin","B",4,-6.0],"3":[3,"coin","A",2,-5.0],"4":[4,"coin","S",1,-4.0],"5":[5,"plant","C",8,-7.0],"6":[6,"plant","B",4,-6.0],"7":[7,"plant","A",2,-5.0],"8":[8,"plant","S",1,-4.0],"9":[9,"gem","S",2,10.0],"10":[10,"buff","A",2,300.0],"11":[11,"drone","C",8,1.0]}'
      }
    });
    module.exports = DB_turntable;
    cc._RF.pop();
  }, {} ],
  DataType: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2a3879x5LpJ54fBTMS3SwQx", "DataType");
    "use strict";
    var DataType = cc.Enum({
      InviteData: 1,
      AchievementData: 2,
      AirDropData: 3,
      BuyButtonData: 4,
      DroneData: 5,
      LevelGemData: 6,
      LevelData: 7,
      PlantData: 8,
      ZombieData: 9,
      TurnTableData: 10,
      ShopData: 11,
      SpinLevelData: 12,
      Translation: 13
    });
    module.exports = DataType;
    cc._RF.pop();
  }, {} ],
  DragonMgr: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9bb9bftkmpNaoona8Evtxim", "DragonMgr");
    "use strict";
    var DragonType = require("DragonType");
    var DragonMgr = cc.Class({
      extends: cc.Component,
      statics: {
        handles_: {},
        create: function create(type, dragon) {
          this.handles_[type] = this.handles_[type] || [];
          var index = this.handles_[type].indexOf(dragon);
          if (index > -1) return;
          this.handles_[type].push(dragon);
        },
        playAnimation: function playAnimation(type, dragon, aniName, isloop, spd) {
          void 0 === spd && (spd = 1);
          var index = this.handles_[type].indexOf(dragon);
          if (index > -1) {
            this.handles_[type][index].timeScale = spd;
            this.handles_[type][index].playAnimation(aniName, isloop ? -1 : 1);
          }
        },
        playPlantAcelerate: function playPlantAcelerate(type, dragon, ac) {
          var index = this.handles_[type].indexOf(dragon);
          index > -1 && (this.handles_[type][index].timeScale = ac);
        },
        deleteDragon: function deleteDragon(type, dragon) {
          var index = this.handles_[type].indexOf(dragon);
          index > -1 && this.handles_[type].splice(index, 1);
        }
      }
    });
    module.exports = DragonMgr;
    cc._RF.pop();
  }, {
    DragonType: "DragonType"
  } ],
  DragonType: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "91396qbrO5F5ZWqnE3aqawU", "DragonType");
    "use strict";
    var DragonType = cc.Enum({
      Plant: "plant",
      Zombie: "zombie"
    });
    module.exports = DragonType;
    cc._RF.pop();
  }, {} ],
  DroneData: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b67ecaEfp5L/47VzFlSQybx", "DroneData");
    "use strict";
    var DroneData = cc.Class({
      name: "DroneData",
      properties: {
        Level: 1,
        Drone: 1
      }
    });
    module.exports = DroneData;
    cc._RF.pop();
  }, {} ],
  DroneMapMgr: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "61bffcDoHpFLrMFuuEK2ldR", "DroneMapMgr");
    "use strict";
    var DroneData = require("DroneData");
    var DroneMap = require("DB_droneRewards");
    var DroneMapMgr = cc.Class({
      extends: cc.Component,
      properties: {
        dataList: {
          default: [],
          type: [ DroneData ]
        }
      },
      DecodeJson: function DecodeJson() {
        var jsonAsset = JSON.parse(DroneMap.data);
        for (var key in jsonAsset) {
          var dt = new DroneData();
          dt.Level = jsonAsset[key][0];
          dt.Drone = jsonAsset[key][1];
          this.dataList[key] = dt;
        }
      },
      getDataByKey: function getDataByKey(Id) {
        return this.dataList[Id];
      }
    });
    module.exports = DroneMapMgr;
    cc._RF.pop();
  }, {
    DB_droneRewards: "DB_droneRewards",
    DroneData: "DroneData"
  } ],
  EffectMgr: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3a004OjyE9KIIcGLjt8QicQ", "EffectMgr");
    "use strict";
    var EffectType = require("EffectType");
    var EffectMgr = cc.Class({
      extends: cc.Component,
      properties: {
        obCoinPre: cc.Prefab,
        obCrickPre: cc.Prefab,
        obVertigoPre: cc.Prefab,
        obDieSmokePre: cc.Prefab,
        mergePre: cc.Prefab,
        flowerOpenPre: cc.Prefab,
        tipMoveAttackPre: cc.Prefab
      },
      InitPool: function InitPool() {
        var self = this;
        this.coinFlyPool = new cc.NodePool();
        cc.loader.loadRes("prefab/effect/coinFly", function(errmsg, prefab) {
          if (errmsg) {
            cc.error(errmsg.message || errmsg);
            return;
          }
          self.obCoinPre = prefab;
          var initCount = 8;
          for (var i = 0; i < initCount; i++) {
            var Obj = cc.instantiate(prefab);
            self.coinFlyPool.put(Obj);
          }
        });
        this.crickPool = new cc.NodePool();
        cc.loader.loadRes("prefab/effect/crick", function(errmsg, prefab) {
          if (errmsg) {
            cc.error(errmsg.message || errmsg);
            return;
          }
          self.obCrickPre = prefab;
          var initCount = 12;
          for (var i = 0; i < initCount; i++) {
            var Obj = cc.instantiate(prefab);
            self.crickPool.put(Obj);
          }
        });
        this.dieSmokePool = new cc.NodePool();
        cc.loader.loadRes("prefab/effect/dieSmoke", function(errmsg, prefab) {
          if (errmsg) {
            cc.error(errmsg.message || errmsg);
            return;
          }
          self.obDieSmokePre = prefab;
          var initCount = 8;
          for (var i = 0; i < initCount; i++) {
            var Obj = cc.instantiate(prefab);
            self.dieSmokePool.put(Obj);
          }
        });
        this.mergeEffectPool = new cc.NodePool();
        cc.loader.loadRes("prefab/effect/merge", function(errmsg, prefab) {
          if (errmsg) {
            cc.error(errmsg.message || errmsg);
            return;
          }
          self.mergePre = prefab;
          var initCount = 3;
          for (var i = 0; i < initCount; i++) {
            var Obj = cc.instantiate(prefab);
            self.mergeEffectPool.put(Obj);
          }
        });
        this.flowerOpenPool = new cc.NodePool();
        cc.loader.loadRes("prefab/effect/FlowerOpen", function(errmsg, prefab) {
          if (errmsg) {
            cc.error(errmsg.message || errmsg);
            return;
          }
          self.flowerOpenPre = prefab;
          var initCount = 3;
          for (var i = 0; i < initCount; i++) {
            var Obj = cc.instantiate(prefab);
            self.flowerOpenPool.put(Obj);
          }
        });
        this.tipMoveAttackPool = new cc.NodePool();
        cc.loader.loadRes("prefab/effect/tipMoveAttack", function(errmsg, prefab) {
          if (errmsg) {
            cc.error(errmsg.message || errmsg);
            return;
          }
          self.tipMoveAttackPre = prefab;
          var initCount = 1;
          for (var i = 0; i < initCount; i++) {
            var Obj = cc.instantiate(prefab);
            self.tipMoveAttackPool.put(Obj);
          }
        });
      },
      clearList: function clearList() {
        this.coinFlyPool.clear();
        this.crickPool.clear();
        this.dieSmokePool.clear();
        this.mergeEffectPool.clear();
        this.flowerOpenPool.clear();
        this.tipMoveAttackPool.clear();
      },
      getObFromPool: function getObFromPool(objType) {
        var obj = null;
        if (objType == EffectType.CoinFly) if (this.coinFlyPool.size() > 0) {
          obj = this.coinFlyPool.get();
          obj.active = true;
        } else obj = cc.instantiate(this.obCoinPre); else if (objType == EffectType.Crick) if (this.crickPool.size() > 0) {
          obj = this.crickPool.get();
          obj.active = true;
        } else obj = cc.instantiate(this.obCrickPre); else if (objType == EffectType.DieSmoke) if (this.dieSmokePool.size() > 0) {
          obj = this.dieSmokePool.get();
          obj.active = true;
        } else obj = cc.instantiate(this.obDieSmokePre); else if (objType == EffectType.Merge) if (this.mergeEffectPool.size() > 0) {
          obj = this.mergeEffectPool.get();
          obj.active = true;
        } else obj = cc.instantiate(this.mergePre); else if (objType == EffectType.flowerPotOpen) if (this.flowerOpenPool.size() > 0) {
          obj = this.flowerOpenPool.get();
          obj.active = true;
        } else obj = cc.instantiate(this.flowerOpenPre); else if (objType == EffectType.TipMoveAttack) if (this.tipMoveAttackPool.size() > 0) {
          obj = this.tipMoveAttackPool.get();
          obj.active = true;
        } else obj = cc.instantiate(this.tipMoveAttackPre);
        return obj;
      },
      ObBackToPool: function ObBackToPool(obj, objType) {
        objType == EffectType.CoinFly ? this.coinFlyPool.put(obj) : objType == EffectType.Crick ? this.crickPool.put(obj) : objType == EffectType.Vertigo ? cc.log("") : objType == EffectType.DieSmoke ? this.dieSmokePool.put(obj) : objType == EffectType.Merge ? this.mergeEffectPool.put(obj) : objType == EffectType.flowerPotOpen ? this.flowerOpenPool.put(obj) : objType == EffectType.TipMoveAttack && this.tipMoveAttackPool.put(obj);
      }
    });
    module.exports = EffectMgr;
    cc._RF.pop();
  }, {
    EffectType: "EffectType"
  } ],
  EffectType: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4fd9dB2EGZK2Y6US5aNEfsv", "EffectType");
    "use strict";
    var EffectType = cc.Enum({
      CoinFly: 1,
      Crick: 2,
      Vertigo: 3,
      DieSmoke: 4,
      Merge: 5,
      flowerPotOpen: 6,
      TipMoveAttack: 7
    });
    module.exports = EffectType;
    cc._RF.pop();
  }, {} ],
  EnjoyNature: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "46e48KofmpFY77X0mRlQerm", "EnjoyNature");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        des: cc.Label,
        content: cc.Node,
        blurBg: cc.Node,
        title: cc.Label,
        btnLabel: cc.Label,
        btnLabel2: cc.Label,
        alreadyBtn: cc.Node,
        alreadyLabel: cc.Label,
        uavNode: cc.Node
      },
      start: function start() {
        this.title.string = cc.Mgr.Utils.getTranslation("enjoyNature-title");
        this.des.string = cc.Mgr.Utils.getTranslation("enjoyNature-tip");
        this.btnLabel2.string = cc.Mgr.Utils.getTranslation("enjoyNature-rate-now");
        this.btnLabel.string = cc.Mgr.Utils.getTranslation("enjoyNature-next-time");
        this.alreadyLabel.string = cc.Mgr.Utils.getTranslation("enjoyNature-rated");
        this.limitClick = this.node.getComponent("LimitClick");
      },
      rateNow: function rateNow() {
        if (false == this.limitClick.clickTime()) return;
        cc.Mgr.Utils.openRating();
        if (1 === cc.Mgr.game.rateState) cc.Mgr.game.rateState = 2; else {
          cc.Mgr.game.rateState = 1;
          true === cc.Mgr.game.hasShowRate && (cc.Mgr.game.rateState = 2);
        }
        var data = {};
        data.elapsed = cc.Mgr.Utils.getDate9(true);
        cc.Mgr.analytics.logEvent("askForRating_love", JSON.stringify(data));
        this.closeUI(true);
      },
      showUI: function showUI() {
        this.blurBg.opacity = 0;
        this.content.opacity = 0;
        this.content.setScale(.5);
        cc.tween(this.blurBg).to(.05, {
          opacity: 255
        }).call().start();
        cc.tween(this.content).to(.15, {
          opacity: 255,
          scale: 1
        }).start();
        this.alreadyBtn.active = 1 === cc.Mgr.game.rateState;
        this.left2Right();
      },
      left2Right: function left2Right() {
        var _this = this;
        this.uavNode.x = -200;
        this.uavNode.scaleX = 1;
        cc.tween(this.uavNode).to(10, {
          position: cc.v2(200, 100)
        }, {
          easing: "sineOut"
        }).call(function() {
          _this.right2Left();
        }).start();
      },
      right2Left: function right2Left() {
        var _this2 = this;
        this.uavNode.x = 200;
        this.uavNode.scaleX = -1;
        cc.tween(this.uavNode).to(10, {
          position: cc.v2(-200, 100)
        }, {
          easing: "sineOut"
        }).call(function() {
          _this2.left2Right();
        }).start();
      },
      alreadyRate: function alreadyRate() {
        if (false == this.limitClick.clickTime()) return;
        if (1 === cc.Mgr.game.rateState) cc.Mgr.game.rateState = 2; else {
          cc.Mgr.game.rateState = 1;
          true === cc.Mgr.game.hasShowRate && (cc.Mgr.game.rateState = 2);
        }
        var data = {};
        data.elapsed = cc.Mgr.Utils.getDate9(true);
        cc.Mgr.analytics.logEvent("askForRating_no", JSON.stringify(data));
        this.closeUI(true);
      },
      closeUI: function closeUI(_blockEvent) {
        if (true !== _blockEvent) {
          var data = {};
          data.elapsed = cc.Mgr.Utils.getDate9(true);
          cc.Mgr.analytics.logEvent("askForRating_no", JSON.stringify(data));
        }
        cc.Mgr.AudioMgr.playSFX("click");
        var self = this;
        cc.tween(this.blurBg).to(.15, {
          opacity: 0
        }).start();
        cc.tween(this.content).to(.15, {
          opacity: 0,
          scale: .5
        }).call(function() {
          self.node.active = false;
        }).start();
        cc.Mgr.game.hasShowRate = true;
        cc.Mgr.UIMgr.reduceShowUICount("enjoyNature");
      }
    });
    cc._RF.pop();
  }, {} ],
  Event: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "bf1b7bGpDxFNZxQSrgXQdYl", "Event");
    "use strict";
    var Event = cc.Class({
      extends: cc.Component,
      statics: {
        ParseFinish: "ParseFinish",
        BuyPlantInShop: "BuyPlantInShop",
        defense: "defense",
        flowerPotOpen: "flowerPotOpen",
        BuyPlant: "BuyPlant",
        unlockGird: "unlockGird",
        checkMissionAndAchieve: "checkMissionAndAchieve",
        singleGuideComplete: "guideComplete",
        AllGuideComplete: "AllGuideComplete",
        showSingleGuide: "showSingleGuide"
      }
    });
    module.exports = Event;
    cc._RF.pop();
  }, {} ],
  FirstUI: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "91e9eK5t0dKr6/q8pu3GgS4", "FirstUI");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        progressSprite: cc.Sprite,
        monsterNode: cc.Node,
        progressNode: cc.Node,
        title: cc.Node,
        title_r: cc.Node,
        playButton: cc.Node
      },
      start: function start() {
        if ("English" == cc.Mgr.Config.language) {
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
        cc.Mgr.UserDataMgr.initData(function() {
          cc.Mgr.GameCenterCtrl.init();
        });
        this.initCallback();
        this.winSize = cc.view.getVisibleSize();
        this.logoNode.y > this.winSize.height / 2 && (this.logoNode.y = this.winSize.height / 2 - this.logoNode.height / 2 - 10);
        this.progressNode.y < this.winSize.height / 2 * -1 && (this.progressNode.y = this.winSize.height / 2 * -1 + this.progressNode.height / 2 + 10);
      },
      initCallback: function initCallback() {
        setTimeout(function() {
          cc.Mgr.notification.clearNotifications();
        }, 15e3);
        setTimeout(function() {
          cc.Mgr.notification.init();
        }, 2e4);
        cc.Mgr.Utils.downloadRanking();
      },
      onClickPlay: function onClickPlay() {
        this.node.destroy();
        this.monsterNode.destroy();
        cc.Mgr.GameCenterCtrl.checkUpdate();
      },
      updateProgress: function updateProgress(_value) {
        this.progressSprite.fillRange = _value;
        this.monsterNode.x = 450 * _value - 235;
        if (1 === _value) {
          this.node.destroy();
          this.monsterNode.destroy();
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  FontManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "659564nzoZAT6EIT6rWv59K", "FontManager");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        font_en: cc.Font,
        font_en_noStroke: cc.Font,
        font_ru: cc.Font,
        font_ru_noStroke: cc.Font
      },
      start: function start() {
        cc.Mgr.fontManager = this;
      }
    });
    cc._RF.pop();
  }, {} ],
  GameCenterCtrl: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0ee76vQB/lLLJdwvoDjxLfA", "GameCenterCtrl");
    "use strict";
    var Event = require("Event");
    var DataType = require("DataType");
    var MyEnum = require("MyEnum");
    var MissionType = require("MissionType");
    var bigDecimal = require("js-big-decimal");
    cc.Class({
      extends: cc.Component,
      properties: {
        _type: -1,
        rubbishLabel: cc.Label,
        loadScreen: cc.Node,
        gameBg: cc.Node,
        gameFront: cc.Node,
        unitsContainer: cc.Node,
        rubbishNode: cc.Node
      },
      zoomIn: function zoomIn() {
        cc.Mgr.game.zoomIn = cc.Mgr.game.isZoomIn = true;
        cc.tween(this.gameBg).to(.2, {
          scale: 1.2
        }).start();
        cc.tween(this.gameBg).to(.2, {
          position: cc.v2(50, 0)
        }).start();
        cc.tween(this.gameFront).to(.2, {
          scale: 1.2
        }).start();
        cc.tween(this.unitsContainer).to(.2, {
          scale: 1.2
        }).start();
        cc.tween(this.unitsContainer).to(.2, {
          position: cc.v2(50, 0)
        }).start();
        cc.tween(this.gameFront).to(.2, {
          position: cc.v2(248, 176)
        }).start();
        cc.tween(this.rubbishNode).to(.2, {
          scale: .83
        }).start();
        var currentX = -30;
        cc.tween(this.rubbishNode).to(.2, {
          position: cc.v2(currentX, -310)
        }).start();
      },
      zoomOut: function zoomOut() {
        cc.Mgr.game.zoomIn = cc.Mgr.game.isZoomIn = false;
        cc.tween(this.gameBg).to(.2, {
          scale: 1
        }).start();
        cc.tween(this.gameBg).to(.2, {
          position: cc.v2(0, 0)
        }).start();
        cc.tween(this.gameFront).to(.2, {
          scale: 1
        }).start();
        cc.tween(this.unitsContainer).to(.2, {
          scale: 1
        }).start();
        cc.tween(this.unitsContainer).to(.2, {
          position: cc.v2(0, 0)
        }).start();
        cc.tween(this.gameFront).to(.2, {
          position: cc.v2(169, 154)
        }).start();
        cc.tween(this.rubbishNode).to(.2, {
          scale: 1
        }).start();
        var currentX = 10;
        cc.tween(this.rubbishNode).to(.2, {
          position: cc.v2(currentX, -370)
        }).start();
      },
      setLanguage: function setLanguage() {
        cc.Mgr.Config.language = "" === cc.Mgr.game.setLanguageManually ? "English" : cc.Mgr.game.setLanguageManually;
      },
      start: function start() {
        cc.Mgr.GameCenterCtrl = this;
        cc.director.GlobalEvent.on(Event.defense, this.defense, this);
        cc.director.GlobalEvent.on(Event.AllGuideComplete, this.AllGuideComplete, this);
        cc.Mgr.game.enterGameTimeStamp = cc.Mgr.Utils.GetSysTime();
        var self = this;
        this.pauseFight = false;
        cc.Mgr.game.enterBackgroundTimer = 0;
        cc.game.on(cc.game.EVENT_HIDE, function() {
          if (cc.Mgr.admob.isPlayingAd) return;
          cc.Mgr.game.enterBackgroundTimer = Date.now();
          cc.Mgr.game.pauseGame();
        });
        cc.game.on(cc.game.EVENT_SHOW, function() {
          cc.Mgr.admob.adClicked && false === cc.Mgr.admob.hasShowPopup_banner && (cc.Mgr.admob.hasShowPopup_banner = true);
          cc.Mgr.admob.adClicked = false;
          cc.Mgr.game.enterGameTimeStamp = cc.Mgr.Utils.GetSysTime();
          if (cc.Mgr.admob.isPlayingAd) return;
          cc.Mgr.game.resumeGame();
          if (cc.Mgr.game.enterBackgroundTimer > 0 && Date.now() - cc.Mgr.game.enterBackgroundTimer >= 6e5) {
            cc.Mgr.game.enterBackgroundTimer = 0;
            cc.Mgr.AudioMgr.stopAll();
            cc.Mgr.admob.hideBanner("all");
            cc.game.restart();
          }
        });
        self.isInit = false;
        if (cc.Mgr.game.sendFirstInstall) {
          var data = {};
          data.elapsed = cc.Mgr.Utils.getDate9(true);
          data.date = cc.Mgr.Utils.getDate9();
          data.version = cc.Mgr.Config.version;
          data.InternalVersion = cc.Mgr.Config.version;
          cc.Mgr.analytics.logEvent("first_install", JSON.stringify(data));
        }
        cc.Mgr.game.vipExpire > 0 && this.scheduleOnce(function() {
          cc.Mgr.game.isVIP = cc.Mgr.game.vipExpire > Date.now();
          if (true === cc.Mgr.game.isVIP && cc.Mgr.game.vipStartTimer > 0 && Date.now() - cc.Mgr.game.vipStartTimer > 6048e5) {
            var _data = {};
            _data.elapsed = cc.Mgr.Utils.getDate9(true);
            _data.state = "convert";
            cc.Mgr.analytics.logEvent("vip_subscription", JSON.stringify(_data));
            cc.Mgr.game.openSpecialGridCount = 0;
          } else if (false === cc.Mgr.game.isVIP) {
            var _data2 = {};
            _data2.elapsed = cc.Mgr.Utils.getDate9(true);
            _data2.state = "unsubscribed";
            cc.Mgr.analytics.logEvent("vip_subscription", JSON.stringify(_data2));
            cc.Mgr.game.vipExpire = 0;
          }
        }, 300);
        cc.Mgr.game.vip = cc.Mgr.game.isVIP ? "active" : "inactive";
        this.checkTimer = 0;
        this.rubbishNode.active = false;
      },
      defense: function defense(data) {
        cc.Mgr.plantMgr.hideTipAttackNode();
        var interval = cc.Mgr.Config.normalWaveWaitTime;
        var coin = 0;
        var isBigLv = false;
        var bossComing = false;
        this.clearZombiePool = false;
        var key = cc.Mgr.game.level > 60 ? cc.Mgr.game.level % 60 + "_" + cc.Mgr.game.curBoshu : cc.Mgr.game.level + "_" + cc.Mgr.game.curBoshu;
        var levelData = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.LevelData, key);
        if (data.state) {
          cc.Mgr.game.updateMissionProgressById(MissionType.DefenseSuc);
          if (cc.Mgr.game.curBoshu == levelData.waveCount) {
            interval = cc.Mgr.Config.lastWaveWaitTime + 2;
            isBigLv = true;
            var dt = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.ZombieData, levelData.zombieID1);
            coin = dt.money * BigInt(Math.round(100 * (.8 + .4 * Math.random()))) / BigInt(100);
            cc.Mgr.game.level++;
            cc.Mgr.game.curBoshu = 1;
          } else {
            cc.Mgr.game.curBoshu++;
            cc.Mgr.game.curBoshu == levelData.waveCount && (bossComing = true);
          }
        } else {
          if (cc.Mgr.game.curBoshu == levelData.waveCount) {
            var dt = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.ZombieData, levelData.zombieID1);
            coin = dt.money * BigInt(Math.round(100 * (1 - bigDecimal.divide(data.zhp.toString(), dt.hp.toString(), 2)))) / BigInt(100);
            isBigLv = true;
          }
          cc.Mgr.game.curBoshu = 1;
        }
        isBigLv && data.state && (this.clearZombiePool = true);
        if (isBigLv) cc.Mgr.admob.showInterstitial("newStage", "next", function() {
          cc.Mgr.UIMgr.showBigResult(data.state, coin);
        }, false); else {
          cc.Mgr.UIMgr.showSmallResult(data.state);
          true === data.state && 4 === cc.Mgr.game.curBoshu && levelData.waveCount >= 5 || false === data.state;
        }
        bossComing && this.scheduleOnce(function() {
          cc.Mgr.UIMgr.showBossComing(levelData.zombieID1);
          cc.Mgr.UIMgr.InGameUI.showBuffTip();
        }, 2);
        this.createCallback = function() {
          this.createZoombie();
        };
        isBigLv || this.scheduleOnce(this.createCallback, interval);
      },
      unschedduleCreateCallBack: function unschedduleCreateCallBack(isNewCreate) {
        void 0 === isNewCreate && (isNewCreate = true);
        this.unschedule(this.createCallback);
        if (false == isNewCreate) return;
        this.scheduleOnce(function() {
          this.clearZombiePool && cc.Mgr.ZombieMgr.clearZombiesPool();
          this.createZoombie();
        }, 1);
      },
      AllGuideComplete: function AllGuideComplete(data) {
        this.createZoombie();
        cc.Mgr.plantMgr.checkHasAnySpaceGird(true) && cc.Mgr.UIMgr.InGameUI.showTipBuyTimesNode(true);
      },
      rebornToLvLastWave: function rebornToLvLastWave() {
        var key = cc.Mgr.game.level > 60 ? cc.Mgr.game.level % 60 + "_" + cc.Mgr.game.curBoshu : cc.Mgr.game.level + "_" + cc.Mgr.game.curBoshu;
        var levelData = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.LevelData, key);
        cc.Mgr.game.curBoshu = levelData.waveCount;
        cc.Mgr.UIMgr.InGameUI.RefreshLvData();
        this.scheduleOnce(function() {
          this.clearZombiePool && cc.Mgr.ZombieMgr.clearZombiesPool();
          this.createZoombie();
        }, 1);
      },
      checkIphoneX: function checkIphoneX() {
        return false;
      },
      init: function init() {
        if (this.isInit) return;
        this.setLanguage();
        cc.Mgr.game.winSize = cc.view.getVisibleSize();
        this.isIphoneX = this.checkIphoneX();
        cc.Mgr.admob.isInit = true;
        var self = this;
        cc.Mgr.MapDataMgr.initMaps();
        var isFrist = cc.Mgr.game.analytics_isFirst;
        var data = {};
        data.elapsed = cc.Mgr.Utils.getDate9(true);
        data.first = "" + isFrist;
        cc.Mgr.analytics.logEvent("start_loading", JSON.stringify(data));
        this.curProgress = 0;
        this.targetProgress = .6;
        this.isInit = true;
        cc.Mgr.flowerPotMgr.init(function() {
          self.targetProgress = .7;
          cc.Mgr.plantMgr.init(function() {
            self.targetProgress = .8;
            cc.Mgr.ZombieMgr.InitZombiesMgr();
            self.showGameUI();
            cc.Mgr.plantMgr.loadPlantsPrefab();
          });
        });
        if (cc.Mgr.Utils.getDays(cc.Mgr.Utils.GetSysTime()) - cc.Mgr.Utils.getDays(cc.Mgr.UserDataMgr.lastPlayTime) >= 1) {
          cc.Mgr.game.clearMissionDataToNextDay();
          cc.Mgr.game.currentExchangeCount = 0;
          cc.Mgr.game.vipDailyBonus = true;
          cc.Mgr.game.first_daily = true;
          cc.Mgr.game.paymentAdCount = 5;
          cc.Mgr.game.coinBundleFlag = true;
          cc.Mgr.game.paymentAdCountList = [ 1, 1, 1, 2, 2, 2, 3, 3, 3 ];
        }
        if (cc.Mgr.Utils.GetSysTime() - cc.Mgr.UserDataMgr.lastPlayTime >= 7200) {
          cc.Mgr.game.spinADResetTime = 0;
          cc.Mgr.game.spinUseGemTime = 0;
          cc.Mgr.game.level <= 10 ? cc.Mgr.game.uavAdsCount = 5 : cc.Mgr.game.level <= 20 ? cc.Mgr.game.uavAdsCount = 5 : cc.Mgr.game.level <= 30 ? cc.Mgr.game.uavAdsCount = 5 : cc.Mgr.game.level <= 40 ? cc.Mgr.game.uavAdsCount = 5 : (cc.Mgr.game.level <= 50, 
          cc.Mgr.game.uavAdsCount = 5);
        }
        var score = 100 * cc.Mgr.game.level + cc.Mgr.game.curBoshu;
        cc.Mgr.game.lastMaxWave = score;
        cc.Mgr.game.updateMissionProgressById(MissionType.Login);
        this.rubbishLabel.string = cc.Mgr.Utils.getTranslation("main-rubbishTip");
      },
      checkUpdate: function checkUpdate() {
        this.startGame();
        return;
      },
      compareVersion: function compareVersion(_a, _b) {
        var versionAList = _a.split(".");
        var versionBList = _b.split(".");
        var numA = 100 * parseInt(versionAList[0]) + 10 * parseInt(versionAList[1]) + 1 * parseInt(versionAList[2]);
        var numB = 100 * parseInt(versionBList[0]) + 10 * parseInt(versionBList[1]) + 1 * parseInt(versionBList[2]);
        return numA < numB;
      },
      caculateOfflineAsset: function caculateOfflineAsset() {
        var allminute = Math.floor((cc.Mgr.Utils.GetSysTime() - cc.Mgr.game.lastOfflineTime) / 60);
        if (allminute < 1) return;
        var hours = Math.floor(allminute / 60);
        var leftmin = Math.floor(allminute % 60);
        var intervalMode = (cc.Mgr.Utils.GetSysTime() - cc.Mgr.game.lastOfflineTime) % 60;
        if (intervalMode >= 30) {
          allminute += .5;
          leftmin += .5;
        }
        var money = 0;
        var allPerMinMoney = 0;
        var ratio = 0;
        if (hours < 1) ratio = .83; else if (hours < 2) ratio = .49; else if (hours < 3) ratio = .34; else if (hours < 4) ratio = .25; else if (hours < 5) ratio = .16; else if (hours < 6) ratio = .08; else if (hours < 7) ratio = .05; else if (hours < 8) ratio = .03; else {
          leftmin = allminute - 480;
          ratio = .0167;
        }
        var offlineMoney = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData, cc.Mgr.game.plantMaxLv).offline;
        for (var i = 0; i < cc.Mgr.game.plantsPK.length; i++) if (cc.Mgr.game.plantsPK[i].type == MyEnum.GridState.plant) {
          var dt = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData, cc.Mgr.game.plantsPK[i].level);
          var per = Math.floor(offlineMoney * Math.pow(2.1, dt.level - 1));
          money += per;
          var onePer = per * ratio;
          onePer >= 1 ? onePer : 1;
          allPerMinMoney += onePer * leftmin;
        }
        console.log("offlineMoney = " + offlineMoney + "  hours = " + hours + "  money = " + money);
        var outMoney = 0;
        if (hours <= 1) outMoney = Math.floor(money * allminute * .83); else if (hours < 2) outMoney = Math.floor(60 * money * .83 + allPerMinMoney); else if (hours < 3) outMoney = Math.floor(60 * money * (.83 + .49) + allPerMinMoney); else if (hours < 4) outMoney = Math.floor(60 * money * 1.66 + allPerMinMoney); else if (hours < 5) outMoney = Math.floor(60 * money * 1.91 + allPerMinMoney); else if (hours < 6) outMoney = Math.floor(60 * money * 2.07 + allPerMinMoney); else if (hours < 7) outMoney = Math.floor(60 * money * 2.15 + allPerMinMoney); else if (hours < 8) outMoney = Math.floor(60 * money * (2.15 + .05) + allPerMinMoney); else {
          outMoney = Math.floor(60 * money * (2.15 + .05 + .03) + allPerMinMoney);
          console.log("offlineMoney = " + offlineMoney + "  hours = " + hours + "  money = " + money + " outMoney = " + outMoney);
        }
        outMoney = Math.round(.8 * outMoney);
        outMoney > 0 && cc.Mgr.UIMgr.openOfflineAssetsUI(BigInt(outMoney));
      },
      getChannel: function getChannel() {
        return "Telegram";
      },
      showGameUI: function showGameUI() {
        var self = this;
        cc.Mgr.UIMgr.openGameInUI(function() {
          cc.Mgr.UIMgr.InGameUI.checkSignState();
          self.targetProgress = 1;
          cc.Mgr.game.isZoomIn && self.zoomIn();
        });
        var entryPoint = "solo";
        var fromFeature = "";
        var isFrist = cc.Mgr.game.analytics_isFirst;
        var data = {};
        data.elapsed = cc.Mgr.Utils.getDate9(true);
        data.first = "" + isFrist;
        data.gamePlatform = cc.Mgr.Config.platform;
        data.entryPoint = entryPoint;
        data.feature = fromFeature || "none";
        cc.Mgr.analytics.logEvent("enter_game", JSON.stringify(data));
        cc.Mgr.game.first_daily = false;
      },
      startGame: function startGame() {
        var _this = this;
        this.SaveUserDataSchedule();
        cc.Mgr.AudioMgr.playBGM("bgm");
        this.createPlant();
        cc.Mgr.game.needGuide || setTimeout(function() {
          _this.caculateOfflineAsset();
        }, 5e3);
      },
      unscheduleSaveData: function unscheduleSaveData() {
        this.unschedule(this.SaveUserData);
      },
      SaveUserDataSchedule: function SaveUserDataSchedule() {
        this.schedule(this.SaveUserData, 10, cc.macro.REPEAT_FOREVER, 5);
      },
      SaveUserData: function SaveUserData() {
        cc.Mgr.UserDataMgr.SaveUserData();
      },
      createPlant: function createPlant() {
        cc.Mgr.plantMgr.initPlants();
        cc.Mgr.game.needGuide ? cc.Mgr.UIMgr.openGuide() : this.createZoombie();
      },
      createZoombie: function createZoombie() {
        cc.Mgr.ZombieMgr.getOneWaveZombies(cc.Mgr.game.level, cc.Mgr.game.curBoshu);
      },
      update: function update(dt) {
        if (!this.isInit) return;
        if (Date.now() - this.checkTimer >= 5e3) {
          var currentDate = new Date();
          var h = currentDate.getHours();
          cc.Mgr.game.isFreeDoubleDaily = h <= 23 && h >= 17;
          this.checkTimer = Date.now();
        }
        if (null == this.loadScreen || false === this.loadScreen.getComponent("FirstUI").startUpdate) return;
        this.curProgress += .02;
        this.curProgress >= this.targetProgress && (this.curProgress = this.targetProgress);
        this.loadScreen.getComponent("FirstUI").updateProgress(this.curProgress);
        if (this.curProgress >= 1) {
          this.checkUpdate();
          this.loadScreen = null;
        }
      }
    });
    cc._RF.pop();
  }, {
    DataType: "DataType",
    Event: "Event",
    MissionType: "MissionType",
    MyEnum: "MyEnum",
    "js-big-decimal": "js-big-decimal"
  } ],
  GlobalEvent: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b5a94AUBhhFQKkBpmCdMQ6J", "GlobalEvent");
    "use strict";
    cc.director.GlobalEvent = {
      handles_: {},
      emit: function emit(eventName, data) {
        var returns = [];
        data.eventName = eventName;
        for (var findEvenName in this.handles_) if (findEvenName == eventName) for (var i = 0; i < this.handles_[findEvenName].length; i++) if (this.handles_[findEvenName][i]) {
          var returnValue = this.handles_[findEvenName][i](data);
          returns.push(returnValue);
        }
        return returns;
      },
      on: function on(eventName, callback, target) {
        this.handles_[eventName] = this.handles_[eventName] || [];
        this.handles_[eventName].push(callback.bind(target));
      },
      off: function off(eventName) {
        if (!this.handles_[eventName]) return;
        for (var i = 0; i < this.handles_[eventName].length; i++) this.handles_[eventName][i] = null;
      },
      clear: function clear() {
        for (var findEvenName in this.handles_) for (var i = 0; i < this.handles_[findEvenName].length; i++) this.handles_[findEvenName][i] = null;
      }
    };
    cc._RF.pop();
  }, {} ],
  GoodMapDecoder: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1cc1e0yXE5O8avRRE3Olzp4", "GoodMapDecoder");
    "use strict";
    var GoodsData = require("GoodsData");
    var GoodMapDecoder = cc.Class({
      extends: cc.Component,
      properties: {
        jsonName: "goods",
        goodsList: {
          default: [],
          type: [ GoodsData ]
        }
      },
      DecodeJson: function DecodeJson(event) {
        var self = this;
        self.reCb = event;
        cc.loader.loadRes("json/" + self.jsonName, function(error, obj) {
          if (error) {
            self.reCb(false);
            return;
          }
          var jsonRoot = obj.json.goods;
          for (var i = 0; i < jsonRoot.length; i++) {
            var goodsData = new GoodsData();
            goodsData.Id = jsonRoot[i].goodsId;
            goodsData.icon = jsonRoot[i].icon;
            goodsData.name = jsonRoot[i].name;
            goodsData.price = jsonRoot[i].price;
            self.goodsList[i] = goodsData;
          }
          self.reCb(true);
        });
      },
      getDataByName: function getDataByName(name) {
        var data = null;
        for (var i = this.goodsList.length - 1; i >= 0; i--) if (name == this.goodsList[i].name) {
          data = this.goodsList[i];
          break;
        }
        return data;
      },
      getDataById: function getDataById(itemId) {
        var data = null;
        for (var i = this.goodsList.length - 1; i >= 0; i--) if (itemId == this.goodsList[i].Id) {
          data = this.goodsList[i];
          break;
        }
        return data;
      },
      getJsonLength: function getJsonLength() {
        return this.goodsList.length;
      },
      getDataList: function getDataList() {
        return this.goodsList;
      }
    });
    module.exports = GoodMapDecoder;
    cc._RF.pop();
  }, {
    GoodsData: "GoodsData"
  } ],
  GoodsData: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3181a0eu+BDhoNZrrSBRV5p", "GoodsData");
    "use strict";
    var GoodsData = cc.Class({
      name: "GoodsData",
      properties: {
        icon: "",
        name: "",
        Id: 1,
        price: 0
      }
    });
    module.exports = GoodsData;
    cc._RF.pop();
  }, {} ],
  Guides: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "bc93dAJV3hAEIAHRtOiz5mx", "Guides");
    "use strict";
    var MyEnum = require("MyEnum");
    var Event = require("Event");
    var uiConfig = require("uiConfig");
    cc.Class({
      extends: cc.Component,
      properties: {
        guideNodes: [ cc.Node ],
        guideLbls: [ cc.Label ]
      },
      start: function start() {
        this.guideList = [ MyEnum.GuideType.guide3, MyEnum.GuideType.guide4, MyEnum.GuideType.guide5, MyEnum.GuideType.guide6 ];
        cc.director.GlobalEvent.on(Event.singleGuideComplete, this.singleGuideComplete, this);
        cc.director.GlobalEvent.on(Event.showSingleGuide, this.showSingleGuide, this);
        this.guideStepList = [ "", "", "", "tutorial_merge_guardian", "tutorial_claim_coins", "tutorial_move_guardian", "tutorial_open_pot" ];
        if (0 === cc.Mgr.game.curGuide) {
          var data = {};
          data.elapsed = cc.Mgr.Utils.getDate9(true);
          cc.Mgr.analytics.logEvent("tutorial_begin", JSON.stringify(data));
        }
        this.curStep = this.guideList[cc.Mgr.game.curGuide];
        this.guideNodes[this.curStep].active = true;
        cc.Mgr.game.curGuideStep = this.curStep;
        this.node.zIndex = uiConfig.guide.Layer;
        for (var i = 2; i < 6; i++) {
          var des = "guide-" + (i + 1);
          this.guideLbls[i].string = cc.Mgr.Utils.getTranslation(des);
        }
        this.showSingleGuide({
          step: this.curStep
        });
      },
      singleGuideComplete: function singleGuideComplete(_data) {
        var data = {};
        data.elapsed = cc.Mgr.Utils.getDate9(true);
        data.step = this.guideStepList[_data.step + 1];
        cc.Mgr.analytics.logEvent("tutorial_step", JSON.stringify(data));
        var step = _data.step;
        this.guideNodes[step].active = false;
        cc.Mgr.game.curGuide++;
        if (3 == cc.Mgr.game.curGuide) {
          cc.Mgr.flowerPotMgr.addDropFlowerFot(1);
          cc.Mgr.plantMgr.checkSpaceGird();
        }
        if (4 === cc.Mgr.game.curGuide) {
          cc.director.GlobalEvent.emit(Event.AllGuideComplete, {});
          cc.Mgr.game.needGuide = false;
          data = {};
          data.elapsed = cc.Mgr.Utils.getDate9(true);
          cc.Mgr.analytics.logEvent("tutorial_complete", JSON.stringify(data));
          cc.Mgr.UIMgr.openShareUI();
        }
      },
      showSingleGuide: function showSingleGuide(data) {
        var _this = this;
        for (var i = 0; i < this.guideNodes.length; i++) null != this.guideNodes[i] && (this.guideNodes[i].active = false);
        var step = data.step;
        3 === cc.Mgr.game.curGuide ? setTimeout(function() {
          _this.guideNodes[step].active = true;
        }, 600) : this.guideNodes[step].active = true;
        step == MyEnum.GuideType.guide3 && cc.Mgr.plantMgr.guideStep3Run();
        cc.Mgr.game.curGuideStep = step;
      }
    });
    cc._RF.pop();
  }, {
    Event: "Event",
    MyEnum: "MyEnum",
    uiConfig: "uiConfig"
  } ],
  HttpUtils: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "386c4NxWj9BW7Z2xUnfIPgq", "HttpUtils");
    "use strict";
    var httpUtils = cc.Class({
      extends: cc.Component,
      properties: {},
      statics: {
        instance: null
      },
      onLoad: function onLoad() {},
      httpGets: function httpGets(url, callback) {
        var request = cc.loader.getXMLHttpRequest();
        console.log("Status: Send Get Request to " + url);
        request.open("GET", url, true);
        request.setRequestHeader("Content-Type", "application/json");
        request.onreadystatechange = function() {
          4 == request.readyState && (request.status >= 200 && request.status <= 207 ? callback(false, request.responseText) : callback(true, request.responseText));
        };
        request.send();
      },
      httpPost: function httpPost(url, params, callback) {
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("POST", url);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function() {
          var err;
          if (4 == xhr.readyState) {
            err = !(xhr.status >= 200 && xhr.status <= 207);
            var response = xhr.responseText;
            callback(err, response);
          }
        };
        xhr.send(params);
      }
    });
    module.exports = httpUtils;
    cc._RF.pop();
  }, {} ],
  InGameUI: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2e531d48NJLnoC37E1mziCK", "InGameUI");
    "use strict";
    var DataType = require("DataType");
    var Event = require("Event");
    var AtlasType = require("AtlasType");
    var MySprite = require("MySprite");
    var MyEnum = require("MyEnum");
    var uav = require("uav");
    var InGameUI = cc.Class({
      extends: cc.Component,
      properties: {
        curLvLbl: cc.Label,
        waveCountLbl: cc.Label,
        coinNumLbl: cc.Label,
        diamondNumLbl: cc.Label,
        coinNumEffect: cc.Node,
        gemNumEffect: cc.Node,
        coinSpriteNode: cc.Node,
        gemSpriteNode: cc.Node,
        topNode: cc.Node,
        buyCostLbl: cc.Label,
        plantHead: MySprite,
        buffTip: cc.Node,
        doubleCoinTimeLbl: cc.Label,
        doubleCoinNode: cc.Node,
        doubleCoinLabel: cc.Node,
        uav: uav,
        buyButtonNode: cc.Node,
        missionTip: cc.Node,
        turntableTip: cc.Node,
        signTip: cc.Node,
        tipBuyTimesNode: cc.Node,
        shopTip: cc.Node,
        levelLabel: cc.Label,
        taskLabel: cc.Label,
        signInLabel: cc.Label,
        rankLabel: cc.Label,
        rouletteLabel: cc.Label,
        vipLabel: cc.Label,
        doubleLabel: cc.Label,
        exchangeLabel: cc.Label,
        rageLabel: cc.Label,
        shopLabel: cc.Label,
        guideBuyPlant: cc.Label,
        rageTipLabel: cc.Label,
        vipNode: cc.Node,
        vipIcon: cc.Node,
        vipEffect: cc.Node,
        spriteBtn: cc.Sprite,
        nomarlM: cc.Material,
        grayM: cc.Material,
        zoomInBtn: cc.Node,
        zoomOutBtn: cc.Node,
        starterBundleEffect: cc.Node,
        starterBundleBg: cc.Node,
        starterBundleNode: cc.Node,
        showTipList: [ cc.Node ],
        showTipLabelList: [ cc.Label ],
        vipStarterBundleNode: cc.Node,
        auto_on: cc.Node,
        auto_off: cc.Node,
        rage_on: cc.Node,
        rage_off: cc.Node,
        fire_on: cc.Node,
        fire_off: cc.Node,
        ice_on: cc.Node,
        ice_off: cc.Node,
        crit_on: cc.Node,
        crit_off: cc.Node,
        leftNode: cc.Node,
        rightNode: cc.Node,
        coinBonusNode: cc.Node,
        bottomNode: cc.Node,
        pauseBtnNode: cc.Node,
        autoTimerLabel: cc.Label,
        rageTimerLabel: cc.Label,
        iceTimerLabel: cc.Label,
        fireTimerLabel: cc.Label,
        critTimerLabel: cc.Label,
        autoOffNode: cc.Node,
        rageOffNode: cc.Node,
        iceOffNode: cc.Node,
        fireOffNode: cc.Node,
        critOffNode: cc.Node,
        autoOnNode: cc.Node,
        rageOnNode: cc.Node,
        iceOnNode: cc.Node,
        fireOnNode: cc.Node,
        critOnNode: cc.Node,
        buffBtn: cc.Node,
        shopBtn: cc.Node,
        gemBtn: cc.Node,
        gemBtn_2: cc.Node,
        coinsNGemsNode: cc.Node
      },
      showBtnTip: function showBtnTip() {
        var index = cc.Mgr.game.btnTipList.indexOf(0);
        if (index < 0) return;
        for (var i = 0; i < cc.Mgr.game.btnTipList.length; i++) if (0 == cc.Mgr.game.btnTipList[i]) {
          this.showTipList[i].active = true;
          break;
        }
      },
      zoomIn: function zoomIn() {
        var _this = this;
        if (cc.Mgr.game.needGuide) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("need-to-complete-guide"), "", this.node);
          return;
        }
        cc.Mgr.GameCenterCtrl.zoomIn();
        this.zoomInBtn.active = false;
        this.zoomOutBtn.active = true;
        if (!cc.Mgr.game.needGuide) {
          cc.Mgr.game.btnTipList[2] = 1;
          this.showTipList[2].active = false;
          setTimeout(function() {
            _this.showBtnTip();
          }, 500);
          var index = cc.Mgr.game.btnTipList.indexOf(0);
          index < 0 && this.unschedule(this.loopBtnTip);
        }
      },
      zoomOut: function zoomOut() {
        if (cc.Mgr.game.needGuide) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("need-to-complete-guide"), "", this.node);
          return;
        }
        cc.Mgr.GameCenterCtrl.zoomOut();
        this.zoomInBtn.active = true;
        this.zoomOutBtn.active = false;
        if (!cc.Mgr.game.needGuide) {
          cc.Mgr.game.btnTipList[2] = 1;
          this.showTipList[2].active = false;
          this.showBtnTip();
        }
      },
      start: function start() {
        this.showCount = 0;
        this.zoomInBtn.active = !cc.Mgr.game.isZoomIn;
        this.zoomOutBtn.active = cc.Mgr.game.isZoomIn;
        this.limitClick = this.node.getComponent("LimitClick");
        this.levelLabel.string = cc.Mgr.Utils.getTranslation("main-level");
        this.taskLabel.string = cc.Mgr.Utils.getTranslation("main-task");
        this.signInLabel.string = cc.Mgr.Utils.getTranslation("main-signIn");
        this.rankLabel.string = cc.Mgr.Utils.getTranslation("main-rank");
        this.rouletteLabel.string = cc.Mgr.Utils.getTranslation("main-roulette");
        this.vipLabel.string = cc.Mgr.Utils.getTranslation("main-vip");
        this.doubleLabel.string = cc.Mgr.Utils.getTranslation("main-treble");
        this.exchangeLabel.string = cc.Mgr.Utils.getTranslation("main-offline");
        this.rageLabel.string = cc.Mgr.Utils.getTranslation("main-buff");
        this.shopLabel.string = cc.Mgr.Utils.getTranslation("main-shop");
        this.guideBuyPlant.string = cc.Mgr.Utils.getTranslation("main-buy-plant-tip");
        this.rageTipLabel.string = cc.Mgr.Utils.getTranslation("main-rage-tip");
        this.showTipLabelList[0].string = cc.Mgr.Utils.getTranslation("dailyBonusTip");
        this.showTipLabelList[1].string = cc.Mgr.Utils.getTranslation("taskTip");
        this.showTipLabelList[2].string = cc.Mgr.Utils.getTranslation("zoomTip");
        this.uav.node.active = false;
        cc.director.GlobalEvent.on(Event.checkMissionAndAchieve, function(data) {
          this.checkMissionAchieveTip();
        }, this);
        this.recordState = 0;
        this.isInitMoney = false;
        this.isInitGem = false;
        this.showStarterBundleEffect = true;
        if (cc.Mgr.game.showStarterBundleEffectFlag) {
          this.starterBundleEffect.active = true;
          this.starterBundleNode.getComponent(cc.Button).target = this.starterBundleEffect;
          this.starterBundleBg.active = false;
        } else {
          this.starterBundleEffect.active = false;
          this.starterBundleBg.active = true;
          this.starterBundleNode.getComponent(cc.Button).target = this.starterBundleBg;
        }
        this.starterBundleNode.active = true;
        this.showVipIconEffect = true;
        if (cc.Mgr.game.showStarterBundleEffectFlag && !cc.Mgr.game.isVIP) {
          this.vipIcon.active = false;
          this.vipEffect.active = true;
          this.vipNode.getComponent(cc.Button).target = this.vipEffect;
        } else {
          this.vipIcon.active = true;
          this.vipNode.getComponent(cc.Button).target = this.vipIcon;
          this.vipEffect.active = false;
        }
        this.vipStarterBundleNode.active = true;
        this.vipStarterBundleNode.active = true;
        if (true === cc.Mgr.game.isPad) {
          this.leftNode.removeComponent(cc.Widget);
          this.rightNode.removeComponent(cc.Widget);
          this.doubleCoinNode.removeComponent(cc.Widget);
          this.coinBonusNode.removeComponent(cc.Widget);
          this.pauseBtnNode.removeComponent(cc.Widget);
          this.leftNode.x = -40 - cc.Mgr.game.ratioOffsetX;
          this.leftNode.x < -150 && (this.leftNode.x = -150);
          this.rightNode.x = 240 + cc.Mgr.game.ratioOffsetX;
          this.rightNode.x > 350 && (this.rightNode.x = 350);
          this.doubleCoinNode.x = -245 - cc.Mgr.game.ratioOffsetX;
          this.doubleCoinNode.x < -350 && (this.doubleCoinNode.x = -350);
          this.coinBonusNode.x = 370 + cc.Mgr.game.ratioOffsetX;
          this.coinBonusNode.x > 500 && (this.coinBonusNode.x = 500);
          this.coinsNGemsNode.x = 350 + cc.Mgr.game.ratioOffsetX;
          this.coinsNGemsNode.x > 500 && (this.coinsNGemsNode.x = 500);
          this.pauseBtnNode.x = 370 + cc.Mgr.game.ratioOffsetX;
          this.pauseBtnNode.x > 500 && (this.pauseBtnNode.x = 500);
          this.shopBtn.removeComponent(cc.Widget);
          this.shopBtn.x = cc.view.getVisibleSizeInPixel().width;
          this.shopBtn.x >= 425 && (this.shopBtn.x = 425);
        }
        true === cc.Mgr.GameCenterCtrl.isIphoneX && (this.topNode.getComponent(cc.Widget).top -= 30);
        this.whiteColor = new cc.Color(255, 255, 255);
        this.greenColor = new cc.Color(59, 218, 52);
        this.gemBtn.active = true;
        this.gemBtn_2.active = false;
      },
      onClickVIP: function onClickVIP() {
        cc.Mgr.UIMgr.openSpecialGridBundle();
        return;
      },
      showTipBuyTimesNode: function showTipBuyTimesNode(needShow) {
        var _this2 = this;
        void 0 === needShow && (needShow = false);
        if (this.tipBuyTimesNode.active == needShow) return;
        this.tipBuyTimesNode.active = needShow;
        needShow || (cc.Mgr.game.tipBuyTimes = 5);
        needShow || (cc.Mgr.plantMgr.otherTipCount > 0 ? this.schedule(this.loopBtnTip, 30) : setTimeout(function() {
          _this2.showBtnTip();
        }, 6e4));
      },
      loopBtnTip: function loopBtnTip() {
        cc.Mgr.plantMgr.otherTipCount <= 0 && this.showBtnTip();
      },
      caculateShopHasAds: function caculateShopHasAds() {
        if (cc.Mgr.game.plantMaxLv <= 4) return false;
        var shopSortDt = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.ShopData, cc.Mgr.game.plantMaxLv);
        for (var i = 0; i < 9; i++) {
          var cond = "";
          switch (i) {
           case 0:
            cond = shopSortDt.MAX;
            break;

           case 1:
            cond = shopSortDt.MAX_1;
            break;

           case 2:
            cond = shopSortDt.MAX_2;
            break;

           case 3:
            cond = shopSortDt.MAX_3;
            break;

           case 4:
            cond = shopSortDt.MAX_4;
            break;

           case 5:
            cond = shopSortDt.MAX_5;
            break;

           case 6:
            cond = shopSortDt.MAX_6;
            break;

           case 7:
            cond = shopSortDt.MAX_7;
            break;

           case 8:
            cond = shopSortDt.MAX_8;
          }
          if (cond == MyEnum.ShopItemType.Ads && cc.Mgr.Utils.GetSysTime() - cc.Mgr.game.lastAdsGetPlantTime >= 60) return true;
        }
        return false;
      },
      checkShopTipState: function checkShopTipState() {
        this.caculateShopHasAds() ? this.shopTip.opacity = 255 : this.shopTip.opacity = 0;
      },
      checkTurnTableLeftTime: function checkTurnTableLeftTime() {
        if (0 === cc.Mgr.game.spinADTimeCount) return;
        if (cc.Mgr.game.spinADTimeCount <= cc.Mgr.Utils.GetSysTime()) {
          cc.Mgr.game.freeFlag.TurnTable = true;
          cc.Mgr.game.spinADTimeCount = 0;
          cc.Mgr.game.spinADResetTime = 0;
        }
      },
      showUav: function showUav() {
        this.uav.node.active = true;
        this.uav.show();
      },
      closeUav: function closeUav() {
        true == this.uav.node.active && this.uav.uavOutScreen();
      },
      unscheduleShowUav: function unscheduleShowUav() {
        this.unschedule(this.showUav);
      },
      showUavNextTime: function showUavNextTime(dt) {
        if (cc.Mgr.game.plantMaxLv < 5) return;
        this.scheduleOnce(this.showUav, dt);
      },
      subDoubleCoin: function subDoubleCoin() {
        if (cc.Mgr.game.doubleCoinLeftTime <= 0) {
          cc.Mgr.game.doubleCoinState = false;
          this.unschedule(this.subDoubleCoin);
          return;
        }
        cc.Mgr.game.doubleCoinLeftTime -= 1;
        this.doubleCoinTimeLbl.string = cc.Mgr.Utils.FormatNumToTime(cc.Mgr.game.doubleCoinLeftTime, true);
        this.doubleCoinTimeLbl.node.active = true;
        this.doubleCoinLabel.active = false;
        if (cc.Mgr.game.doubleCoinLeftTime <= 0) {
          this.doubleCoinTimeLbl.node.active = false;
          this.doubleCoinLabel.active = true;
          cc.Mgr.game.doubleCoinState = false;
          this.showDoubleCoinBtn(false);
          this.unschedule(this.subDoubleCoin);
          cc.Mgr.game.doubleBtnIntervalTime = 300;
          this.startCaculateIntervalDou();
        }
      },
      startDoubleCoinState: function startDoubleCoinState() {
        cc.Mgr.game.doubleCoinLeftTime = 100;
        cc.Mgr.game.doubleCoinState = true;
        this.schedule(this.subDoubleCoin, 1, 100, .1);
      },
      adsDoubleCoin: function adsDoubleCoin() {
        if (cc.Mgr.game.doubleCoinLeftTime > 0) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("is-treble-now"), "", this.node);
          return;
        }
        cc.Mgr.UIMgr.openDoubleCoinUI();
      },
      subIntervalDoubleCoin: function subIntervalDoubleCoin() {
        cc.Mgr.game.doubleBtnIntervalTime -= 1;
        if (cc.Mgr.game.doubleBtnIntervalTime <= 0) {
          this.unschedule(this.subIntervalDoubleCoin);
          this.showDoubleCoinBtn(true);
        }
      },
      startCaculateIntervalDou: function startCaculateIntervalDou() {
        var intervarl = cc.Mgr.game.doubleBtnIntervalTime;
        this.schedule(this.subIntervalDoubleCoin, 1, intervarl, .1);
      },
      updateDoubleCoinBtn: function updateDoubleCoinBtn() {
        this.checkAvailabelAds = cc.Mgr.admob.checkAvailableRewardedAd();
        false == this.checkAvailabelAds && this.showDoubleCoinBtn(false);
      },
      showDoubleCoinBtn: function showDoubleCoinBtn(toShow) {
        toShow = cc.Mgr.admob.checkAvailableRewardedAd() && toShow;
        if (cc.Mgr.game.doubleCoinLeftTime <= 0) {
          this.doubleCoinTimeLbl.node.active = false;
          this.doubleCoinLabel.active = true;
        } else {
          this.doubleCoinTimeLbl.node.active = true;
          this.doubleCoinLabel.active = false;
        }
        this.doubleCoinNode.active = toShow;
        if (false === this.hasSetPos) {
          var worldPoint_doubleCoinNode = this.doubleCoinNode.convertToWorldSpaceAR(cc.Mgr.plantMgr.rubbishNode.position);
          cc.Mgr.game.localPoint_doubleCoinNode = cc.Mgr.plantMgr.rubbishNode.convertToNodeSpaceAR(worldPoint_doubleCoinNode);
          this.hasSetPos = true;
        }
      },
      onClickPause: function onClickPause() {
        cc.Mgr.UIMgr.openPauseUI();
      },
      showTopNode: function showTopNode(isShow) {
        void 0 === isShow && (isShow = true);
        this.topNode.active = isShow;
      },
      showPayment: function showPayment() {
        cc.Mgr.UIMgr.openPaymentUI(true);
      },
      showCoinExchange: function showCoinExchange() {
        cc.Mgr.UIMgr.openExchangeCoinUI();
      },
      init: function init() {
        cc.Mgr.UIMgr.InGameUI = this;
        cc.Mgr.UIMgr.topCoinNode = this.coinNumLbl.node;
        cc.Mgr.UIMgr.topGemNode = this.diamondNumLbl.node;
        this.hasSetPos = false;
        this.scheduleOnce(function() {
          this.RefreshLvData();
          this.checkMissionAchieveTip();
          this.checkShopTipState();
        }, .5);
        cc.director.GlobalEvent.on(Event.defense, function() {
          this.RefreshLvData();
        }, this);
        this.RefreshAssetData(true, "money");
        this.RefreshAssetData(true, "gem");
        this.RefreshBuyButtonAll();
        cc.Mgr.game.resetKeepInGameTime();
        if (0 !== cc.Mgr.game.spinADTimeCount && cc.Mgr.game.spinADTimeCount < cc.Mgr.Utils.GetSysTime()) {
          cc.Mgr.game.freeFlag.TurnTable = true;
          cc.Mgr.game.spinADTimeCount = 0;
          cc.Mgr.game.spinADResetTime = 0;
        }
        this.checkShopTipState();
        this.schedule(function() {
          this.checkTurnTableLeftTime();
          this.checkShopTipState();
          this.checkKeepInGameTime();
          this.checkSignState();
        }, 1);
        this.airDropShowTime = 0;
        this.airDropFriendIndex = 0;
        this.showUavNextTime(30);
        if (cc.Mgr.game.doubleBtnIntervalTime > 0) {
          this.showDoubleCoinBtn(false);
          this.startCaculateIntervalDou();
        } else cc.Mgr.game.plantMaxLv >= 6 ? this.showDoubleCoinBtn(true) : this.showDoubleCoinBtn(false);
        cc.Mgr.game.needGuide || this.schedule(this.loopBtnTip, 30);
      },
      checkKeepInGameTime: function checkKeepInGameTime() {
        cc.Mgr.game.keepInGameTime += 1;
        cc.Mgr.game.dailyMissions[4].progress = cc.Mgr.game.keepInGameTime;
        (300 == cc.Mgr.game.keepInGameTime && 0 == cc.Mgr.game.dailyMissions[4].checklv || 600 == cc.Mgr.game.keepInGameTime && cc.Mgr.game.dailyMissions[4].checklv <= 1 || 1200 == cc.Mgr.game.keepInGameTime && 0 == cc.Mgr.game.dailyMissions[4].claimed) && (this.missionTip.active = true);
      },
      checkMissionAchieveTip: function checkMissionAchieveTip() {
        cc.Mgr.game.checkOutAchieveDataIsFinished() || cc.Mgr.game.checkOutMissionIsFinished() ? this.missionTip.active = true : this.missionTip.active = false;
      },
      setTopNodeLayer: function setTopNodeLayer(downNode) {},
      RefreshAssetData: function RefreshAssetData(_isInit, _type) {
        if ("money" === _type) {
          var money = cc.Mgr.Utils.getNumStr2(cc.Mgr.game.money);
          this.coinNumEffect.getComponent("NumEffect").setNumber(money, _isInit);
          this.RefreshBuyButtonMergeAll();
        } else {
          var gems = cc.Mgr.Utils.getNumStr(cc.Mgr.game.gems);
          this.gemNumEffect.getComponent("NumEffect").setNumber(gems, _isInit);
        }
      },
      RefreshLvData: function RefreshLvData() {
        this.curLvLbl.string = cc.Mgr.game.level;
        var key = cc.Mgr.game.level > 60 ? cc.Mgr.game.level % 60 + "_" + cc.Mgr.game.curBoshu : cc.Mgr.game.level + "_" + cc.Mgr.game.curBoshu;
        var lvData = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.LevelData, key);
        this.waveCountLbl.string = cc.Mgr.game.curBoshu + "/" + lvData.waveCount;
      },
      RefreshBuyButtonAll: function RefreshBuyButtonAll() {
        var param = this.caculateBuyPlantPrice();
        param.needRefresh && this.RefreshBuyButton(param.interactable);
      },
      RefreshBuyButtonMergeAll: function RefreshBuyButtonMergeAll() {
        var param = this.caculateBuyPlantPrice(true);
        param.needRefresh && this.RefreshBuyButton(param.interactable);
      },
      buyButton: function buyButton() {
        if (cc.Mgr.game.needGuide) {
          cc.Mgr.AudioMgr.playSFX(MyEnum.AudioType.click);
          return;
        }
        this.showTipBuyTimesNode(false);
        if (!cc.Mgr.plantMgr.checkHasAnySpaceGird()) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("NoSpaceForPlant"), "", this.node);
          return;
        }
        var plantData = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData, cc.Mgr.game.canBuyPlantId);
        var buyNum = cc.Mgr.game.plantBuyRecord[cc.Mgr.game.canBuyPlantId];
        buyNum = buyNum || 0;
        var price = 0;
        price = cc.Mgr.game.canBuyPlantId >= 1 && cc.Mgr.game.canBuyPlantId <= 20 ? plantData.price * BigInt(Math.floor(Math.pow(1.1, buyNum))) : plantData.price * BigInt(Math.floor(Math.pow(1.2, buyNum)));
        if (cc.Mgr.game.money >= price) {
          cc.director.GlobalEvent.emit(Event.BuyPlant, {
            money: price
          });
          this.RefreshBuyButtonAll();
        } else {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("NoCoins"), "coin", this.node);
          cc.Mgr.game.plantMaxLv >= cc.Mgr.game.exchangeCoinConfig.openLevel && cc.Mgr.game.needShowExchangeCoinCount++;
          if (cc.Mgr.game.needShowExchangeCoinCount >= 3 && cc.Mgr.game.plantMaxLv >= cc.Mgr.game.exchangeCoinConfig.openLevel) {
            var exchangeGemNum = cc.Mgr.UIMgr.gemNum();
            cc.Mgr.game.currentExchangeCount < cc.Mgr.game.exchangeCoinConfig.maxExchangeNum && cc.Mgr.game.gems >= exchangeGemNum ? cc.Mgr.UIMgr.openExchangeCoinUI(true) : cc.Mgr.game.level > 1 && this.showCount >= 3 ? this.showCount = 0 : this.showCount++;
            cc.Mgr.game.needShowExchangeCoinCount = 0;
          }
          this.buyBtnInteractable = false;
          this.spriteBtn.setMaterial(0, this.grayM);
        }
      },
      RefreshBuyButton: function RefreshBuyButton(interactable) {
        void 0 === interactable && (interactable = false);
        this.buyBtnInteractable = interactable;
        interactable ? this.spriteBtn.setMaterial(0, this.nomarlM) : this.spriteBtn.setMaterial(0, this.grayM);
      },
      caculateCanBuyPlant: function caculateCanBuyPlant() {
        if (cc.Mgr.game.plantMaxLv <= 5) return cc.Mgr.game.plantMaxLv - 2 >= 1 ? cc.Mgr.game.plantMaxLv - 2 : 1;
        var shopSortDt = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.ShopData, cc.Mgr.game.plantMaxLv);
        var index = 0;
        for (var key in shopSortDt) {
          var dt = shopSortDt[key];
          if (dt == MyEnum.ShopItemType.Money || dt == MyEnum.ShopItemType.Ads) return cc.Mgr.game.plantMaxLv - index + 1;
          index += 1;
        }
        return cc.Mgr.game.plantMaxLv - 2;
      },
      pickCanBuyPlantData: function pickCanBuyPlantData(forSub) {
        void 0 === forSub && (forSub = false);
        var maxPlantId = this.caculateCanBuyPlant();
        var outList = [];
        if (cc.Mgr.game.plantMaxLv <= 5) for (var i = 1; i <= maxPlantId; i++) outList.push(i); else {
          var limit = 3;
          for (var i = 0; i <= 3; i++) if (maxPlantId - i == 1) {
            limit = i;
            break;
          }
          for (var i = maxPlantId - limit; i <= maxPlantId; i++) outList.push(i);
        }
        var param = {};
        param.plantId = outList[0];
        var data = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData, outList[0]);
        param.plantData = data;
        param.price = data.price;
        param.hasOne = true;
        if (forSub) {
          for (var i = outList.length - 1; i >= 0; i--) if (cc.Mgr.game.canBuyPlantId == outList[i]) {
            var plantData = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData, outList[i]);
            var buyNum = cc.Mgr.game.plantBuyRecord[outList[i]];
            var price = cc.Mgr.game.caculatePlantPrice(outList[i], buyNum);
            param.plantId = cc.Mgr.game.canBuyPlantId;
            param.price = price;
            cc.Mgr.game.money < price && (param.hasOne = false);
            param.plantData = plantData;
            return param;
          }
          for (var i = outList.length - 1; i >= 0; i--) {
            var plantData = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData, outList[i]);
            var buyNum = cc.Mgr.game.plantBuyRecord[outList[i]];
            var price = cc.Mgr.game.caculatePlantPrice(outList[i], buyNum);
            if (1 == outList[i] || 0 == i) {
              if (cc.Mgr.game.money > price) {
                param.plantId = outList[i];
                param.price = price;
                param.hasOne = true;
                param.plantData = plantData;
                return param;
              }
              param.plantId = outList[i];
              param.price = price;
              param.hasOne = false;
              param.plantData = plantData;
              return param;
            }
            if (cc.Mgr.game.money > price) {
              param.plantId = outList[i];
              param.price = price;
              param.hasOne = true;
              param.plantData = plantData;
              return param;
            }
          }
        } else for (var i = outList.length - 1; i >= 0; i--) {
          var plantData = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData, outList[i]);
          var buyNum = cc.Mgr.game.plantBuyRecord[outList[i]];
          var price = cc.Mgr.game.caculatePlantPrice(outList[i], buyNum);
          if (1 == outList[i] || 0 == i) {
            if (cc.Mgr.game.money > price) {
              param.plantId = outList[i];
              param.price = price;
              param.hasOne = true;
              param.plantData = plantData;
              return param;
            }
            param.plantId = outList[i];
            param.price = price;
            param.hasOne = false;
            param.plantData = plantData;
            return param;
          }
          if (cc.Mgr.game.money > price) {
            param.plantId = outList[i];
            param.price = price;
            param.hasOne = true;
            param.plantData = plantData;
            return param;
          }
        }
        return param;
      },
      caculateBuyPlantPrice: function caculateBuyPlantPrice(forSub) {
        void 0 === forSub && (forSub = false);
        var outdata = this.pickCanBuyPlantData(forSub);
        var plantId = outdata.plantId;
        var plantData = outdata.plantData;
        this.plantHead.setSprite(AtlasType.PlantHead, plantData.head);
        var price2 = cc.Mgr.Utils.getNumStr2(outdata.price);
        this.buyCostLbl.string = price2;
        var param = {};
        param.plantData = outdata.plantData;
        cc.Mgr.game.canBuyPlantId = plantId;
        param.needRefresh = false;
        param.interactable = true;
        if (this.buyBtnInteractable && !outdata.hasOne) {
          param.needRefresh = true;
          param.interactable = false;
        } else if (!this.buyBtnInteractable && outdata.hasOne) {
          param.needRefresh = true;
          param.interactable = true;
        }
        return param;
      },
      openMissionUI: function openMissionUI() {
        var _this3 = this;
        cc.Mgr.UIMgr.openMissionUI();
        if (!cc.Mgr.game.needGuide) {
          cc.Mgr.game.btnTipList[1] = 1;
          this.showTipList[1].active = false;
          setTimeout(function() {
            _this3.showBtnTip();
          }, 500);
          var index = cc.Mgr.game.btnTipList.indexOf(0);
          index < 0 && this.unschedule(this.loopBtnTip);
        }
      },
      openStarterBundle: function openStarterBundle() {
        if (this.showStarterBundleEffect && cc.Mgr.game.showStarterBundleEffectFlag) {
          this.showStarterBundleEffect = false;
          this.starterBundleEffect.active = false;
          this.starterBundleBg.active = true;
          this.starterBundleNode.getComponent(cc.Button).target = this.starterBundleBg;
        }
        cc.Mgr.UIMgr.openStarterBundle();
      },
      openSignUI: function openSignUI() {
        var _this4 = this;
        cc.Mgr.UIMgr.openSignUI();
        if (!cc.Mgr.game.needGuide) {
          cc.Mgr.game.btnTipList[0] = 1;
          this.showTipList[0].active = false;
          setTimeout(function() {
            _this4.showBtnTip();
          }, 500);
          var index = cc.Mgr.game.btnTipList.indexOf(0);
          index < 0 && this.unschedule(this.loopBtnTip);
        }
      },
      openBuffUI: function openBuffUI() {
        cc.Mgr.UIMgr.openBuffUI();
      },
      openSetUI: function openSetUI() {
        cc.Mgr.UIMgr.openSetting();
      },
      onClickRank: function onClickRank() {
        cc.Mgr.UIMgr.openRankingUI();
      },
      openTurnTableUI: function openTurnTableUI() {
        cc.Mgr.UIMgr.openTurnTableUI();
      },
      openShopUI: function openShopUI() {
        cc.Mgr.UIMgr.openPaymentUI(false);
      },
      updateBuffShow: function updateBuffShow() {
        this.auto_on.active = cc.Mgr.game.autoTimer > 0;
        this.auto_off.active = cc.Mgr.game.autoTimer <= 0;
        this.rage_on.active = cc.Mgr.game.rageTimer > 0;
        this.rage_off.active = cc.Mgr.game.rageTimer <= 0;
        this.fire_on.active = cc.Mgr.game.fireTimer > 0;
        this.fire_off.active = cc.Mgr.game.fireTimer <= 0;
        this.ice_on.active = cc.Mgr.game.iceTimer > 0;
        this.ice_off.active = cc.Mgr.game.iceTimer <= 0;
        this.crit_on.active = cc.Mgr.game.critTimer > 0;
        this.crit_off.active = cc.Mgr.game.critTimer <= 0;
      },
      updateBuffTimer: function updateBuffTimer() {
        if (cc.Mgr.game.autoTimer > 0) {
          this.autoTimerLabel.string = cc.Mgr.Utils.FormatNumToTime(cc.Mgr.game.autoTimer);
          this.autoOffNode.active = false;
          this.autoOnNode.active = true;
          this.autoTimerLabel.node.color = this.greenColor;
        } else {
          this.autoTimerLabel.string = "00:00";
          this.autoOffNode.active = true;
          this.autoOnNode.active = false;
          this.autoTimerLabel.node.color = this.whiteColor;
        }
        if (cc.Mgr.game.rageTimer > 0) {
          this.rageTimerLabel.string = cc.Mgr.Utils.FormatNumToTime(cc.Mgr.game.rageTimer);
          this.rageOffNode.active = false;
          this.rageOnNode.active = true;
          this.rageTimerLabel.node.color = this.greenColor;
        } else {
          this.rageTimerLabel.string = "00:00";
          this.rageOffNode.active = true;
          this.rageOnNode.active = false;
          this.rageTimerLabel.node.color = this.whiteColor;
        }
        if (cc.Mgr.game.fireTimer > 0) {
          this.fireTimerLabel.string = cc.Mgr.Utils.FormatNumToTime(cc.Mgr.game.fireTimer);
          this.fireOffNode.active = false;
          this.fireOnNode.active = true;
          this.fireTimerLabel.node.color = this.greenColor;
        } else {
          this.fireTimerLabel.string = "00:00";
          this.fireOffNode.active = true;
          this.fireOnNode.active = false;
          this.fireTimerLabel.node.color = this.whiteColor;
        }
        if (cc.Mgr.game.iceTimer > 0) {
          this.iceTimerLabel.string = cc.Mgr.Utils.FormatNumToTime(cc.Mgr.game.iceTimer);
          this.iceOffNode.active = false;
          this.iceOnNode.active = true;
          this.iceTimerLabel.node.color = this.greenColor;
        } else {
          this.iceTimerLabel.string = "00:00";
          this.iceOffNode.active = true;
          this.iceOnNode.active = false;
          this.iceTimerLabel.node.color = this.whiteColor;
        }
        if (cc.Mgr.game.critTimer > 0) {
          this.critTimerLabel.string = cc.Mgr.Utils.FormatNumToTime(cc.Mgr.game.critTimer);
          this.critOffNode.active = false;
          this.critOnNode.active = true;
          this.critTimerLabel.node.color = this.greenColor;
        } else {
          this.critTimerLabel.string = "00:00";
          this.critOffNode.active = true;
          this.critOnNode.active = false;
          this.critTimerLabel.node.color = this.whiteColor;
        }
      },
      checkAnyBuff: function checkAnyBuff() {
        if (cc.Mgr.game.rageTimer > 0) return true;
        if (cc.Mgr.game.autoTimer > 0) return true;
        if (cc.Mgr.game.fireTimer > 0) return true;
        if (cc.Mgr.game.iceTimer > 0) return true;
        if (cc.Mgr.game.critTimer > 0) return true;
        return false;
      },
      showBuffTip: function showBuffTip() {
        var _this5 = this;
        if (cc.Mgr.game.level > 3 || this.checkAnyBuff() || cc.Mgr.plantMgr.otherTipCount > 0) return;
        if (true === this.buffTip.active) return;
        cc.Mgr.plantMgr.otherTipCount++;
        this.buffTip.active = true;
        this.buffTipTimeout = setTimeout(function() {
          _this5.buffTip.active = false;
          cc.Mgr.plantMgr.otherTipCount--;
        }, 5e3);
      },
      openBuff: function openBuff() {
        cc.Mgr.UIMgr.openBuffUI();
        clearTimeout(this.buffTipTimeout);
        this.buffTip.active = false;
        cc.Mgr.plantMgr.otherTipCount--;
      },
      checkSignState: function checkSignState() {
        cc.Mgr.Utils.getDays(cc.Mgr.Utils.GetSysTime()) - cc.Mgr.Utils.getDays(cc.Mgr.game.lastSignDate) < 1 ? this.signTip.active = false : this.signTip.active = true;
      },
      updateVIPIcon: function updateVIPIcon() {
        var hasLockGrid = false;
        for (var i = 0; i < 12; i++) if (cc.Mgr.plantMgr.grids[i].type == MyEnum.GridState.lock) {
          hasLockGrid = true;
          break;
        }
        this.vipNode.active = !hasLockGrid;
        if (cc.Mgr.game.isVIP) {
          this.vipIcon.active = true;
          this.vipEffect.active = false;
        } else {
          this.vipIcon.active = false;
          this.vipEffect.active = true;
          this.vipNode.getComponent(cc.Button).target = this.vipIcon;
        }
      }
    });
    module.exports = InGameUI;
    cc._RF.pop();
  }, {
    AtlasType: "AtlasType",
    DataType: "DataType",
    Event: "Event",
    MyEnum: "MyEnum",
    MySprite: "MySprite",
    uav: "uav"
  } ],
  InviteData: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "70fb2utf5pFXYNY0RBXagKj", "InviteData");
    "use strict";
    var InviteData = cc.Class({
      name: "InviteData",
      properties: {
        id: 1,
        invitePeople: 0,
        gem: 0
      }
    });
    module.exports = InviteData;
    cc._RF.pop();
  }, {} ],
  InviteManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "735a298lMtN1bG4j2IFDeY1", "InviteManager");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      start: function start() {
        cc.Mgr.inviteManager = this;
      },
      getFriendsList: function getFriendsList() {
        this.friendsList = [];
        return;
      },
      shuffle: function shuffle(arr) {
        if (null == arr) return null;
        var length = arr.length, randomIndex, temp;
        while (length) {
          randomIndex = Math.floor(Math.random() * length--);
          temp = arr[randomIndex];
          arr[randomIndex] = arr[length];
          arr[length] = temp;
        }
        return arr;
      },
      sendInvitations: function sendInvitations(_feature) {
        if (null == this.friendsList) return;
        if (this.friendsList.length <= 0) return;
        returnl;
        if (this.startIndex >= this.friendsList.length) {
          this.startIndex = 0;
          return;
        }
        var friend = this.friendsList[this.startIndex];
        this.sendInvitation("resources/tex/shareImage_4.png", friend.id, "Guess what PlayerName just got\uff01", "Check", _feature);
      },
      sendInvitation: function sendInvitation(_image, _playerId, _content, _btnText, _feature, _callback) {
        var _this = this;
        cc.Mgr.Utils.getBase64Image(_image, function(_data) {
          Wortal.context.updateAsync({
            image: _data,
            text: _content,
            caption: _btnText,
            data: {
              entryPoint: "invitation",
              feature: _feature
            }
          }).then(function() {
            _this.startIndex++;
            _callback && _callback(true);
            var data = {};
            data.elapsed = cc.Mgr.Utils.getDate9(true);
            data.stage = cc.Mgr.game.level;
            data.feature = _feature || "none";
            cc.Mgr.analytics.logEvent("share_message", JSON.stringify(data));
          })["catch"](function(error) {
            console.log(error);
            _callback && _callback(false);
          });
        });
      }
    });
    cc._RF.pop();
  }, {} ],
  InviteMapMgr: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d47cdT4kWBIIYTHDLKElrOS", "InviteMapMgr");
    "use strict";
    var inviteMap = require("DB_invite");
    var InviteData = require("InviteData");
    var InviteMapMgr = cc.Class({
      extends: cc.Component,
      properties: {
        dataList: {
          default: [],
          type: [ InviteData ]
        }
      },
      DecodeJson: function DecodeJson() {
        var jsonAsset = JSON.parse(inviteMap.data);
        for (var key in jsonAsset) {
          var dt = new InviteData();
          dt.id = jsonAsset[key][0];
          dt.invitePeople = jsonAsset[key][1];
          dt.gem = jsonAsset[key][2];
          this.dataList[key] = dt;
        }
      },
      getDataByKey: function getDataByKey(lv) {
        return this.dataList[lv];
      }
    });
    module.exports = InviteMapMgr;
    cc._RF.pop();
  }, {
    DB_invite: "DB_invite",
    InviteData: "InviteData"
  } ],
  LanguageItem: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ab130wLTxdDaYDsqXpiXCdW", "LanguageItem");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        nameLabel: cc.Label
      },
      start: function start() {},
      getLanguageLabel: function getLanguageLabel(_name) {
        switch (_name) {
         case "English":
          this.nameLabel.string = cc.Mgr.Utils.getTranslation("language-en");
          break;

         case "Simplified Chinese":
          this.nameLabel.string = cc.Mgr.Utils.getTranslation("language-cn");
          break;

         case "Traditional Chinese":
          this.nameLabel.string = cc.Mgr.Utils.getTranslation("language-tc");
          break;

         case "Japanese":
          this.nameLabel.string = cc.Mgr.Utils.getTranslation("language-jp");
          break;

         case "Russian":
          this.nameLabel.string = cc.Mgr.Utils.getTranslation("language-ru");
        }
      },
      setContent: function setContent(_name, _parent) {
        this.getLanguageLabel(_name);
        this.selectName = _name;
        this.parentCtrl = _parent;
      },
      onClick: function onClick() {
        this.parentCtrl.updateLanguage(this.selectName);
      }
    });
    cc._RF.pop();
  }, {} ],
  LanguageSelector: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "050b2huWwtBfZaYz65iSOe5", "LanguageSelector");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        container: cc.Node,
        currentNameLabel: cc.Label,
        languageItem: cc.Prefab
      },
      start: function start() {
        this.getLanguageLabel();
        this.languageList = [ "English", "Russian" ];
        for (var i = 0; i < this.languageList.length; i++) {
          if (this.languageList[i] === cc.Mgr.Config.language) continue;
          var otherItem = cc.instantiate(this.languageItem);
          otherItem.parent = this.container;
          otherItem.getComponent("LanguageItem").setContent(this.languageList[i], this);
        }
        this.container.active = false;
      },
      getLanguageLabel: function getLanguageLabel() {
        switch (cc.Mgr.Config.language) {
         case "English":
          this.currentNameLabel.string = cc.Mgr.Utils.getTranslation("language-en");
          break;

         case "Simplified Chinese":
          this.currentNameLabel.string = cc.Mgr.Utils.getTranslation("language-cn");
          break;

         case "Traditional Chinese":
          this.currentNameLabel.string = cc.Mgr.Utils.getTranslation("language-tc");
          break;

         case "Japanese":
          this.currentNameLabel.string = cc.Mgr.Utils.getTranslation("language-jp");
          break;

         case "Russian":
          this.currentNameLabel.string = cc.Mgr.Utils.getTranslation("language-ru");
        }
      },
      onClick: function onClick() {
        this.container.active = true;
      },
      hideContainer: function hideContainer() {
        this.container.active = false;
      },
      updateLanguage: function updateLanguage(_name) {
        this.currentNameLabel.string = _name;
        cc.Mgr.game.setLanguageManually = _name;
        cc.Mgr.UserDataMgr.SaveUserData();
        this.hideContainer();
        setTimeout(function() {
          cc.Mgr.AudioMgr.stopAll();
          cc.Mgr.admob.hideBanner("all");
          cc.game.restart();
        }, 300);
      }
    });
    cc._RF.pop();
  }, {} ],
  LevelData: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "25d1asmftRCPKX2JxuFi504", "LevelData");
    "use strict";
    var LevelData = cc.Class({
      name: "LevelData",
      properties: {
        level: 1,
        wave: 0,
        waveCount: 0,
        zombieID1: 0,
        zombieCount1: 0,
        zombieID2: 0,
        zombieCount2: 0
      }
    });
    module.exports = LevelData;
    cc._RF.pop();
  }, {} ],
  LevelMapMgr: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4d560IPvYdOCYWNj7c9Kpad", "LevelMapMgr");
    "use strict";
    var LevelMap = require("DB_level");
    var LevelData = require("LevelData");
    var LevelMapMgr = cc.Class({
      extends: cc.Component,
      properties: {
        dataList: {
          default: [],
          type: [ LevelData ]
        }
      },
      DecodeJson: function DecodeJson() {
        var jsonAsset = JSON.parse(LevelMap.data);
        for (var key in jsonAsset) if (null != jsonAsset[key] && "undefined" != jsonAsset[key]) {
          var dt = new LevelData();
          dt.level = jsonAsset[key][0];
          dt.wave = jsonAsset[key][1];
          dt.waveCount = jsonAsset[key][2];
          dt.zombieID1 = jsonAsset[key][3];
          dt.zombieCount1 = jsonAsset[key][4];
          dt.zombieID2 = jsonAsset[key][5];
          dt.zombieCount2 = jsonAsset[key][6];
          this.dataList[key] = dt;
        }
      },
      getDataByKey: function getDataByKey(lvKey) {
        return this.dataList[lvKey];
      }
    });
    module.exports = LevelMapMgr;
    cc._RF.pop();
  }, {
    DB_level: "DB_level",
    LevelData: "LevelData"
  } ],
  LimitClick: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6ce7bccdcBMzr0bYa48AYZq", "LimitClick");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        _startTimer: 0,
        _allowClick: true
      },
      onLoad: function onLoad() {
        this.time = 300;
      },
      clickTime: function clickTime(time) {
        void 0 != time && null != time && (this.time = time);
        if (false === this._allowClick) return false;
        this._startTimer = Date.now();
        this._allowClick = false;
        return true;
      },
      update: function update() {
        Date.now() - this._startTimer >= this.time && (this._allowClick = true);
      }
    });
    cc._RF.pop();
  }, {} ],
  LvUpGemData: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "571185Rw9NGRrNhUzy68oDh", "LvUpGemData");
    "use strict";
    var LvUpGemData = cc.Class({
      name: "LvUpGemData",
      properties: {
        level: 1,
        gem: 1
      }
    });
    module.exports = LvUpGemData;
    cc._RF.pop();
  }, {} ],
  LvUpGemMapMgr: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d1d42gSEgFOEqIDI4OwcpbC", "LvUpGemMapMgr");
    "use strict";
    var LvgemMap = require("DB_levelupGem");
    var LvUpGemData = require("LvUpGemData");
    var LvUpGemMapMgr = cc.Class({
      extends: cc.Component,
      properties: {
        dataList: {
          default: [],
          type: [ LvUpGemData ]
        }
      },
      DecodeJson: function DecodeJson() {
        var jsonAsset = JSON.parse(LvgemMap.data);
        for (var key in jsonAsset) {
          var dt = new LvUpGemData();
          dt.level = jsonAsset[key][0];
          dt.gem = jsonAsset[key][1];
          this.dataList[key] = dt;
        }
      },
      getDataByKey: function getDataByKey(Id) {
        return this.dataList[Id];
      }
    });
    cc._RF.pop();
  }, {
    DB_levelupGem: "DB_levelupGem",
    LvUpGemData: "LvUpGemData"
  } ],
  MapDataMgr: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4cf54GTOt5F3rbUgATuyqq9", "MapDataMgr");
    "use strict";
    var DataType = require("DataType");
    var PlantMapMgr = require("PlantMapMgr");
    var ZombieMapMgr = require("ZombieMapMgr");
    var LevelMapMgr = require("LevelMapMgr");
    var AchieveMapMgr = require("AchieveMapMgr");
    var AirDropMapMgr = require("AirDropMapMgr");
    var InviteMapMgr = require("InviteMapMgr");
    var TurnTableMapMgr = require("TurnTableMapMgr");
    var ShopMapMgr = require("ShopMapMgr");
    var SpinLvMapMgr = require("SpinLvMapMgr");
    var LvUpGemMapMgr = require("LvUpGemMapMgr");
    var BuyButtonMapMgr = require("BuyButtonMapMgr");
    var DroneMapMgr = require("DroneMapMgr");
    var TransMapMgr = require("TransMapMgr");
    var MapDataMgr = cc.Class({
      extends: cc.Component,
      properties: {
        goodsMap: null,
        decodeAll: 0
      },
      checkInitMapSuc: function checkInitMapSuc() {
        100 == this.decodeAll;
      },
      initMaps: function initMaps() {
        cc.Mgr.Parse = false;
        this.plantMap = new PlantMapMgr();
        this.plantMap.DecodeJson();
        this.zombieMap = new ZombieMapMgr();
        this.zombieMap.DecodeJson();
        this.levelMap = new LevelMapMgr();
        this.levelMap.DecodeJson();
        this.achieveMap = new AchieveMapMgr();
        this.achieveMap.DecodeJson();
        this.airdropMap = new AirDropMapMgr();
        this.airdropMap.DecodeJson();
        this.inviteMap = new InviteMapMgr();
        this.inviteMap.DecodeJson();
        this.turnMap = new TurnTableMapMgr();
        this.turnMap.DecodeJson();
        this.shopMap = new ShopMapMgr();
        this.shopMap.DecodeJson();
        this.spinMap = new SpinLvMapMgr();
        this.spinMap.DecodeJson();
        this.lvupgemMap = new LvUpGemMapMgr();
        this.lvupgemMap.DecodeJson();
        this.buttonMap = new BuyButtonMapMgr();
        this.buttonMap.DecodeJson();
        this.droneMap = new DroneMapMgr();
        this.droneMap.DecodeJson();
        this.transMap = new TransMapMgr();
        this.transMap.DecodeJson();
      },
      getDataByDataTypeAndKey: function getDataByDataTypeAndKey(itemType, itemId) {
        var data = null;
        switch (itemType) {
         case DataType.InviteData:
          data = this.inviteMap.getDataByKey(itemId);
          break;

         case DataType.AchievementData:
          data = this.achieveMap.getDataByKey(itemId);
          break;

         case DataType.AirDropData:
          data = this.airdropMap.getDataByKey(itemId);
          break;

         case DataType.BuyButtonData:
          data = this.buttonMap.getDataByKey(itemId);
          break;

         case DataType.DroneData:
          data = this.droneMap.getDataByKey(itemId);
          break;

         case DataType.LevelGemData:
          data = this.lvupgemMap.getDataByKey(itemId);
          break;

         case DataType.LevelData:
          data = this.levelMap.getDataByKey(itemId);
          break;

         case DataType.PlantData:
          data = this.plantMap.getDataByKey(itemId);
          break;

         case DataType.ZombieData:
          data = this.zombieMap.getDataByKey(itemId);
          break;

         case DataType.TurnTableData:
          data = this.turnMap.getDataByKey(itemId);
          break;

         case DataType.ShopData:
          data = this.shopMap.getDataByKey(itemId);
          break;

         case DataType.SpinLevelData:
          data = this.spinMap.getDataByKey(itemId);
          break;

         case DataType.Translation:
          data = this.transMap.getDataByKey(itemId);
        }
        return data;
      },
      getDataListByDataType: function getDataListByDataType(itemType) {
        var data = null;
        switch (itemType) {
         case DataType.InviteData:
          data = this.inviteMap.dataList;
          break;

         case DataType.AchievementData:
          data = this.achieveMap.dataList;
          break;

         case DataType.AirDropData:
          data = this.airdropMap.dataList;
          break;

         case DataType.BuyButtonData:
          data = this.buttonMap.dataList;
          break;

         case DataType.DroneData:
          data = this.droneMap.dataList;
          break;

         case DataType.LevelGemData:
          data = this.lvupgemMap.dataList;
          break;

         case DataType.LevelData:
          data = this.levelMap.dataList;
          break;

         case DataType.PlantData:
          data = this.plantMap.dataList;
          break;

         case DataType.ZombieData:
          data = this.zombieMap.dataList;
          break;

         case DataType.TurnTableData:
          data = this.turnMap.dataList;
          break;

         case DataType.ShopData:
          data = this.shopMap.dataList;
          break;

         case DataType.SpinLevelData:
          data = this.spinMap.dataList;
          break;

         case DataType.Translation:
          data = this.transMap.dataList;
        }
        return data;
      }
    });
    module.exports = MapDataMgr;
    cc._RF.pop();
  }, {
    AchieveMapMgr: "AchieveMapMgr",
    AirDropMapMgr: "AirDropMapMgr",
    BuyButtonMapMgr: "BuyButtonMapMgr",
    DataType: "DataType",
    DroneMapMgr: "DroneMapMgr",
    InviteMapMgr: "InviteMapMgr",
    LevelMapMgr: "LevelMapMgr",
    LvUpGemMapMgr: "LvUpGemMapMgr",
    PlantMapMgr: "PlantMapMgr",
    ShopMapMgr: "ShopMapMgr",
    SpinLvMapMgr: "SpinLvMapMgr",
    TransMapMgr: "TransMapMgr",
    TurnTableMapMgr: "TurnTableMapMgr",
    ZombieMapMgr: "ZombieMapMgr"
  } ],
  MaxLevel: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "45f54P5HHNH+KvPX7SfBVId", "MaxLevel");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        blurBg: cc.Node,
        content: cc.Node,
        db: dragonBones.ArmatureDisplay,
        btnLabel: cc.Label,
        tipLabel: cc.Label
      },
      start: function start() {},
      showUI: function showUI() {
        this.btnLabel.string = cc.Mgr.Utils.getTranslation("btn-ok");
        this.tipLabel.string = cc.Mgr.Utils.getTranslation("beCleared-tip");
        this.blurBg.opacity = 0;
        this.content.opacity = 0;
        this.content.setScale(.5);
        cc.tween(this.blurBg).to(.05, {
          opacity: 255
        }).call().start();
        cc.tween(this.content).to(.15, {
          opacity: 255,
          scale: 1
        }).start();
        this.db.playAnimation("Congratsstar", 1);
      },
      onClickClose: function onClickClose() {
        cc.Mgr.AudioMgr.playSFX("click");
        var self = this;
        cc.tween(this.blurBg).to(.15, {
          opacity: 0
        }).start();
        cc.tween(this.content).to(.15, {
          opacity: 0,
          scale: .5
        }).call(function() {
          self.node.active = false;
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount("maxLevel");
      }
    });
    cc._RF.pop();
  }, {} ],
  MissionType: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4e56cYefANMC4Hw3D/WIzMB", "MissionType");
    "use strict";
    var MissionType = cc.Enum({
      Login: 0,
      MergePlant: 1,
      DefenseSuc: 2,
      AdsShow: 3,
      InGameTime: 4,
      InviteCount: 5
    });
    module.exports = MissionType;
    cc._RF.pop();
  }, {} ],
  MyEnum: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "997fa36ynpLP5/qt8XTSFdw", "MyEnum");
    "use strict";
    var MyEnum = cc.Class({
      extends: cc.Component,
      statics: {
        PlantState: {
          idle: 0,
          cd: 1,
          attacking: 2
        },
        GridState: {
          none: 0,
          plant: 1,
          flowerPot: 2,
          lock: 3,
          vip: 4,
          vipLock: 5
        },
        DragonType: {
          plant: 1,
          zombie: 2,
          jinggai: 3
        },
        BulletType: {
          Straight: 1,
          Curve: 2
        },
        NodeGroup: {
          Zombie: "zombie",
          Bullet: "bullet",
          UI: "ui"
        },
        BulletSkillType: {
          Null: 0,
          Slow: 1,
          DouKill: 2,
          Vertigo: 3
        },
        FlowerPotType: {
          Drop: 0,
          Drone: 1,
          Buy: 2,
          Shop: 3
        },
        AudioType: {
          bgm: "bgm",
          click: "click",
          coin: "coin",
          dog: "dog",
          fail: "fail",
          flower_pot_land: "flower-pot-land",
          flower_pot_tap: "flower-pot-tap",
          gem: "gem",
          hit: "hit",
          merge: "merge",
          pig: "pig",
          plane: "plane",
          skill_crit: "skill-crit",
          skill_freeze: "skill-freeze",
          skill_slow: "skill-slow",
          spin: "spin",
          success1: "success1",
          success2: "success2",
          zombie_lady: "zombie-lady",
          zombie_man: "zombie-man"
        },
        ShopItemType: {
          Lock: "U",
          Gem: "G",
          Ads: "AD",
          Money: "M",
          Null: ""
        },
        GuideType: {
          none: -1,
          guide1: 0,
          guide2: 1,
          guide3: 2,
          guide4: 3,
          guide5: 4,
          guide6: 5,
          guide7: 6,
          guide8: 7
        }
      }
    });
    module.exports = MyEnum;
    cc._RF.pop();
  }, {} ],
  MySprite: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fb117FyR/NJxb6webpK3JtQ", "MySprite");
    "use strict";
    var MySprite = cc.Class({
      extends: cc.Sprite,
      properties: {},
      setSprite: function setSprite(atlasType, frame) {
        this.atlas = cc.Mgr.AtlasMgr.getSpriteAtlas(atlasType);
        this.spriteFrame = this.atlas.getSpriteFrame(frame);
      }
    });
    module.exports = MySprite;
    cc._RF.pop();
  }, {} ],
  NoticeText: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6e728mTT3BL/ZbAzEukPxcK", "NoticeText");
    "use strict";
    cc.director.NoticeText = {
      Trans_1: "\u4f60\u600e\u4e48\u73b0\u5728\u624d\u6765\uff1f\u6211\u8017\u5c3d\u4e86\u6574\u4e2a\u9752\u6625\u4e00\u76f4\u5728\u8fd9\u91cc\u7b49\u4f60\u3002"
    };
    cc._RF.pop();
  }, {} ],
  Notification: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "bd7ebbMo7BILr1+AWak+fxq", "Notification");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {},
      start: function start() {
        cc.Mgr.notification = this;
      },
      init: function init() {
        0 !== cc.Mgr.game.lastNotificationTimer && (this.isToday(cc.Mgr.game.lastNotificationTimer) || cc.Mgr.game.notificationIndex++);
        cc.Mgr.game.lastNotificationTimer = Date.now();
        var days = [ 1, 2, 3, 4, 5 ];
        var notificationList = [];
        for (var i = 0; i < 7; i++) {
          var notification = {};
          notification.title = cc.Mgr.Utils.getTranslation("notification-title-" + (i + 1));
          notification.content = cc.Mgr.Utils.getTranslation("notification-content-" + (i + 1));
          notificationList.push(notification);
        }
        cc.Mgr.game.notificationIndex >= 7 && (cc.Mgr.game.notificationIndex = 0);
        var currentIndex = cc.Mgr.game.notificationIndex;
        for (var j = 0; j < days.length; j++) {
          this.sendNotification("" + j, notificationList[currentIndex].title, notificationList[currentIndex].content, 24 * days[j] * 3600 + 1200);
          currentIndex++;
          currentIndex >= 7 && (currentIndex = 0);
        }
      },
      sendNotification: function sendNotification(_id, _title, _content, _interval) {},
      clearNotifications: function clearNotifications() {},
      isToday: function isToday(_ms) {
        return new Date().toDateString() === new Date(_ms).toDateString();
      }
    });
    cc._RF.pop();
  }, {} ],
  NumEffect: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c702cSKBmVIbLe8hXIT1ay/", "NumEffect");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        numColNodeList: [ cc.Node ],
        numColPrefab: cc.Prefab,
        container: cc.Node,
        symbolNode: cc.Node,
        unitLabel: cc.Label,
        offsetY: 18,
        scaleNumer: 1.5
      },
      start: function start() {
        this.currentNumber = "";
      },
      setNumber: function setNumber(_numStr, _isInit) {
        if (this.currentNumber === _numStr) return;
        this.currentNumber = _numStr;
        _numStr = "" + _numStr;
        this.symbolNode.parent = null;
        this.unitLabel.node.parent = null;
        for (var i = 0; i < this.numColNodeList.length; i++) this.numColNodeList[i].parent = null;
        var currentNumCount = 0;
        for (var _i = 0; _i < _numStr.length; _i++) {
          var currentString = _numStr[_i];
          var currentNumber = Number(currentString);
          if (isNaN(currentNumber)) if ("." === currentString) this.symbolNode.parent = this.container; else {
            this.unitLabel.string = currentString;
            this.unitLabel.node.parent = this.container;
          } else {
            currentNumCount++;
            var numNode = void 0;
            if (_i >= this.numColNodeList.length) {
              numNode = cc.instantiate(this.numColPrefab);
              numNode.setPosition(0, this.offsetY);
              numNode.parent = this.container;
              numNode.getComponent("NumberCol").init(currentNumber, currentNumCount);
              this.numColNodeList.push(numNode);
            } else {
              numNode = this.numColNodeList[_i];
              numNode.parent = this.container;
              _isInit ? numNode.getComponent("NumberCol").init(currentNumber, currentNumCount) : numNode.getComponent("NumberCol").changeNum(currentNumber, currentNumCount);
            }
          }
        }
        cc.tween(this.node).to(.2, {
          scale: this.scaleNumer
        }).to(.2, {
          scale: 1
        }).start();
      }
    });
    cc._RF.pop();
  }, {} ],
  NumberCol: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9f3215Yjr1M/bjS24jTsooT", "NumberCol");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        offsetY: 18,
        intervalY: 35,
        duration: .3,
        intervalTime: .05
      },
      onLoad: function onLoad() {},
      start: function start() {},
      init: function init(_num, _index) {
        this.node.y = _num * this.intervalY + this.offsetY;
      },
      changeNum: function changeNum(_num, _index) {
        var self = this;
        if (_num == this.lastNum) {
          var temNum = _num > 4 ? 0 : 9;
          this.node.y = temNum * this.intervalY + this.offsetY;
          this.scheduleOnce(function() {
            cc.tween(self.node).to(self.duration, {
              position: cc.v2(0, _num * self.intervalY + self.offsetY)
            }).start();
          }, _index * self.intervalTime);
        } else this.scheduleOnce(function() {
          cc.tween(self.node).to(self.duration, {
            position: cc.v2(0, _num * self.intervalY + self.offsetY)
          }).start();
        }, _index * self.intervalTime);
        this.lastNum = _num;
      }
    });
    cc._RF.pop();
  }, {} ],
  OfflineBundle: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f59f3dCemFCaZ6HPxJFHXbn", "OfflineBundle");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        content: cc.Node,
        blurBg: cc.Node,
        btnLabel: cc.Label,
        btnLabel2: cc.Label,
        priceSaleLabel: cc.Label,
        priceLabel: cc.Label,
        singlePriceLabel: cc.Label,
        saleNode: cc.Node,
        priceNode: cc.Node,
        gemsNode: cc.Node,
        btn: cc.Node,
        btn_2: cc.Node,
        desLabel: cc.Label,
        saleSprite: cc.Node,
        title: cc.Node,
        title_zh: cc.Node,
        title_ja: cc.Node,
        title_ru: cc.Node
      },
      onLoad: function onLoad() {
        this.limitClick = this.node.getComponent("LimitClick");
      },
      start: function start() {
        this.btnLabel2.string = this.btnLabel.string = cc.Mgr.Utils.getTranslation("btn-get");
        this.desLabel.string = cc.Mgr.Utils.getTranslation("offlineBundle-tip");
        this.title.active = false;
        this.title_zh.active = false;
        this.title_ja.active = false;
        this.title_ru.active = false;
        "Japanese" === cc.Mgr.Config.language ? this.title_ja.active = true : "Simplified Chinese" === cc.Mgr.Config.language || "Traditional Chinese" === cc.Mgr.Config.language ? this.title_zh.active = true : "Russian" === cc.Mgr.Config.language ? this.title_ru.active = true : this.title.active = true;
      },
      showUI: function showUI(_sale) {
        this.singlePriceLabel.string = cc.Mgr.payment.priceList[10];
        this.saleSprite.width = this.priceLabel.node.width;
        this.blurBg.opacity = 0;
        this.content.opacity = 0;
        this.content.setScale(.5);
        cc.tween(this.blurBg).to(.05, {
          opacity: 255
        }).call().start();
        cc.tween(this.content).to(.15, {
          opacity: 255,
          scale: 1
        }).start();
        this.gemsNode.active = this.saleNode.active = this.priceNode.active = false;
        this.btn.active = this.btn_2.active = false;
        cc.Mgr.admob.showBanner("offlineBunlde");
        this.saleNode.active = _sale;
        this.priceNode.active = !_sale;
        this.btn.active = true;
      },
      onClickClose: function onClickClose() {
        cc.Mgr.AudioMgr.playSFX("click");
        cc.Mgr.admob.hideBanner("offlineBunlde");
        var self = this;
        cc.tween(this.blurBg).to(.15, {
          opacity: 0
        }).start();
        cc.tween(this.content).to(.15, {
          opacity: 0,
          scale: .5
        }).call(function() {
          self.node.active = false;
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount("offlineBundle");
      },
      onClickGet: function onClickGet() {
        var _this = this;
        cc.Mgr.payment.purchaseByIndex(10, function() {
          cc.Mgr.game.offlineDouble = true;
          _this.onClickClose();
        }, cc.Mgr.UIMgr.tipRoot);
      },
      onClickGetByGems: function onClickGetByGems() {
        var _this2 = this;
        if (false == this.limitClick.clickTime()) return;
        if (cc.Mgr.game.gems < 30) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("NoGems"), "gem", this.node);
          setTimeout(function() {
            cc.Mgr.UIMgr.openPaymentUI(true);
            _this2.onClickClose();
          }, 300);
          return;
        }
        cc.Mgr.game.gems -= 30;
        cc.Mgr.game.offlineDouble = true;
        this.onClickClose();
      }
    });
    cc._RF.pop();
  }, {} ],
  ParticleMgr: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f06e8LLZ2pA1oa9LK9HtksI", "ParticleMgr");
    "use strict";
    var ParticleMgr = cc.Class({
      extends: cc.Component,
      statics: {
        handles_: [],
        create: function create(particle) {
          var index = this.handles_.indexOf(particle);
          if (index > -1) return;
          this.handles_.push(particle);
        },
        playParticle: function playParticle(particle) {
          var index = this.handles_.indexOf(particle);
          if (index > -1) {
            this.handles_[index].active = true;
            this.handles_[index].resetSystem();
          }
        },
        stopParticle: function stopParticle() {
          var index = this.handles_.indexOf(particle);
          if (index > -1) {
            this.handles_[index].active = false;
            this.handles_[index].stopSystem();
          }
        },
        deleteParticle: function deleteParticle(particle) {
          var index = this.handles_.indexOf(particle);
          index > -1 && this.handles_.splice(index, 1);
        }
      }
    });
    module.exports = ParticleMgr;
    cc._RF.pop();
  }, {} ],
  PauseUI: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "699a5/61/BFto3LdOxwJpnQ", "PauseUI");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        content: cc.Node,
        blurBg: cc.Node
      },
      start: function start() {},
      showUI: function showUI() {
        this.blurBg.opacity = 0;
        this.content.opacity = 0;
        this.content.setScale(.5);
        cc.tween(this.blurBg).to(.05, {
          opacity: 255
        }).call().start();
        cc.tween(this.content).to(.15, {
          opacity: 255,
          scale: 1
        }).start();
        cc.Mgr.AudioMgr.pauseAll();
      },
      closeUI: function closeUI() {
        cc.Mgr.AudioMgr.playSFX("click");
        var self = this;
        cc.tween(this.blurBg).to(.15, {
          opacity: 0
        }).start();
        cc.tween(this.content).to(.15, {
          opacity: 0,
          scale: .5
        }).call(function() {
          self.node.active = false;
          cc.Mgr.AudioMgr.resumeAll();
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount("pause");
      }
    });
    cc._RF.pop();
  }, {} ],
  PaymentUI: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c351eLEuy5NcKxkj+TyHqCh", "PaymentUI");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        toggleGems: cc.Toggle,
        toggleShop: cc.Toggle,
        shopItemListView: cc.Node,
        shopView: cc.Node,
        paymentView: cc.Node,
        toggleShopLabel: cc.Label,
        toggleShopLabel_2: cc.Label,
        toggleGemLabel: cc.Label,
        toggleGemLabel_2: cc.Label,
        freeLabel: cc.Label,
        getLabel: cc.Label,
        adCountLabel: cc.Label,
        content: cc.Node,
        blurBg: cc.Node,
        vipDailyBonusBtn: cc.Button,
        spriteBtn: cc.Sprite,
        nomarlM: cc.Material,
        grayM: cc.Material,
        spriteCoin: cc.Sprite,
        priceLabelList: [ cc.Label ],
        gemLabelList: [ cc.Label ],
        topNode: cc.Node,
        topNode2: cc.Node,
        middleNode: cc.Node,
        middleNode2: cc.Node,
        bottomNode: cc.Node,
        bottomNode2: cc.Node,
        adCountLabelList: [ cc.Label ],
        spriteCoinList: [ cc.Sprite ],
        adFreeLabellist: [ cc.Label ],
        title: cc.Node,
        title_zh: cc.Node,
        title_ja: cc.Node,
        title_ru: cc.Node,
        showCount: 0,
        bottom_desc: cc.Label,
        bottom_price: cc.Label,
        payment_bottom_node: cc.Node,
        shop_bottom_node: cc.Node,
        bottom_coins: cc.Label,
        bottom_btn_gems: cc.Label,
        bottom_btn_coins: cc.Label
      },
      onLoad: function onLoad() {
        this._scrollViewComponent = this.shopItemListView.getComponent("WaterfallFlow");
        this.shopItemDataList = [];
        for (var i = 1; i <= cc.Mgr.Config.allPlantCount; i++) this.shopItemDataList.push({
          lv: i
        });
        this.shopItemDataList.push({
          lv: cc.Mgr.Config.allPlantCount + 1
        });
        this._scrollViewComponent.setBaseInfo(this.shopItemDataList.length, 4, 12, 140, this.setShopList.bind(this));
        this.limitClick = this.node.getComponent("LimitClick");
        this.adGetGemsList = [ 5, 5, 5, 4, 4, 4, 3, 3, 3 ];
      },
      start: function start() {
        this.toggleShopLabel.string = this.toggleShopLabel_2.string = cc.Mgr.Utils.getTranslation("payment-shop");
        this.toggleGemLabel.string = this.toggleGemLabel_2.string = cc.Mgr.Utils.getTranslation("payment-gem");
        this.freeLabel.string = cc.Mgr.Utils.getTranslation("btn-free");
        this.getLabel.string = cc.Mgr.Utils.getTranslation("btn-claim");
        for (var i = 0; i < this.adFreeLabellist.length; i++) this.adFreeLabellist[i].string = cc.Mgr.Utils.getTranslation("btn-free");
        this.title.active = false;
        this.title_zh.active = false;
        this.title_ja.active = false;
        this.title_ru.active = false;
        "Japanese" === cc.Mgr.Config.language ? this.title_ja.active = true : "Simplified Chinese" === cc.Mgr.Config.language || "Traditional Chinese" === cc.Mgr.Config.language ? this.title_zh.active = true : "Russian" === cc.Mgr.Config.language ? this.title_ru.active = true : this.title.active = true;
      },
      showShop: function showShop() {
        this._scrollViewComponent.clear();
        this._scrollViewComponent.scrollTo(cc.Mgr.game.plantMaxLv - 2);
        false === this.toggleShop.isChecked ? this.toggleShop.isChecked = true : this.onClickShop();
      },
      setShopList: function setShopList(_index, _updateIdx, _curShowIdxListLen) {
        void 0 == _updateIdx && (_updateIdx = -1);
        var result;
        if (this.shopItemDataList.length <= 4) result = this.shopItemDataList; else {
          var idx = -1 == _updateIdx ? 4 * _index : 4 * _updateIdx;
          var endIdx = -1 == _updateIdx ? idx + 4 : idx + 4 * _curShowIdxListLen;
          result = this.shopItemDataList.slice(idx, endIdx);
        }
        this._scrollViewComponent.updateShowList(result, "shopItem", this);
      },
      showPayment: function showPayment() {
        false === this.toggleGems.isChecked ? this.toggleGems.isChecked = true : this.onClickGems();
      },
      showUI: function showUI(_isPayment) {
        this.isPayment = _isPayment;
        this.payment_bottom_node.active = false;
        this.shop_bottom_node.active = false;
        if (_isPayment) {
          this.showPayment();
          this.payment_bottom_node.active = true;
        } else {
          this.showShop();
          this.shop_bottom_node.active = true;
        }
        var coinNumber = cc.Mgr.UIMgr.getCoinNumber() * BigInt(30);
        coinNumber = coinNumber < BigInt(1e6) ? BigInt(1e6) : coinNumber;
        this.getCoin = coinNumber *= BigInt(2);
        var coinString = cc.Mgr.Utils.getNumStr2(coinNumber);
        this.bottom_coins.string = coinString;
        this.bottom_btn_coins.string = cc.Mgr.payment.priceList[11];
        this.bottom_btn_gems.string = cc.Mgr.payment.priceList[0];
        this.blurBg.opacity = 0;
        this.content.opacity = 0;
        this.content.setScale(.5);
        cc.tween(this.blurBg).to(.05, {
          opacity: 255
        }).call().start();
        cc.tween(this.content).to(.15, {
          opacity: 255,
          scale: 1
        }).start();
        this.adCountLabel.string = cc.Mgr.game.paymentAdCount + "/5";
        if (cc.Mgr.game.isVIP && cc.Mgr.game.vipDailyBonus) {
          this.spriteBtn.setMaterial(0, this.nomarlM);
          this.getLabel.string = cc.Mgr.Utils.getTranslation("btn-claim");
        } else if (cc.Mgr.game.isVIP && !cc.Mgr.game.vipDailyBonus) {
          this.getLabel.string = cc.Mgr.Utils.getTranslation("btn-claimed");
          this.spriteBtn.setMaterial(0, this.grayM);
        } else {
          this.spriteBtn.setMaterial(0, this.nomarlM);
          this.getLabel.string = cc.Mgr.Utils.getTranslation("btn-claim");
        }
        this.bottom_desc.string = cc.Mgr.Utils.getTranslation("buy-gems-desc", [ 100 ]);
        for (var i = 0; i < this.priceLabelList.length; i++) {
          this.priceLabelList[i].string = cc.Mgr.payment.priceList[i];
          this.gemLabelList[i].string = "X" + cc.Mgr.payment.getGems[i];
        }
        this.bottom_price.string = cc.Mgr.payment.priceList[0];
        this.checkAvailabelAds = cc.Mgr.admob.checkAvailableRewardedAd();
        this.checkAvailabelAds ? this.spriteCoin.setMaterial(0, this.nomarlM) : this.spriteCoin.setMaterial(0, this.grayM);
        this.topNode.active = true;
        this.middleNode.active = true;
        this.topNode2.active = false;
        this.middleNode2.active = false;
        this.bottomNode.active = true;
        this.bottomNode2.active = false;
      },
      onClickGetCoins: function onClickGetCoins() {
        var _this = this;
        if (false == this.limitClick.clickTime()) return;
        var currentProductID = this.isSale ? 11 : 7;
        currentProductID = 11;
        cc.Mgr.payment.purchaseByIndex(currentProductID, function() {
          cc.Mgr.UIMgr.openAssetGetUI("money", _this.getCoin, "payment");
          _this.onClickClose();
        }, cc.Mgr.UIMgr.tipRoot);
      },
      updateItems: function updateItems() {
        this._scrollViewComponent.refreshAtCurPosition();
      },
      onClickShop: function onClickShop() {
        this.toggleShop.node.zIndex = 3;
        this.toggleGems.node.zIndex = 1;
        this.shopView.active = true;
        this.paymentView.active = false;
        this._scrollViewComponent.clear();
        this._scrollViewComponent.scrollTo(cc.Mgr.game.plantMaxLv - 2);
      },
      onClickGems: function onClickGems() {
        this.toggleGems.node.zIndex = 3;
        this.toggleShop.node.zIndex = 1;
        this.shopView.active = false;
        this.paymentView.active = true;
      },
      onClickClose: function onClickClose() {
        var _this2 = this;
        cc.Mgr.AudioMgr.playSFX("click");
        var self = this;
        cc.tween(this.blurBg).to(.15, {
          opacity: 0
        }).start();
        cc.tween(this.content).to(.15, {
          opacity: 0,
          scale: .5
        }).call(function() {
          self.node.active = false;
          _this2.showCount++;
          _this2.showCount >= 3 && (_this2.showCount = 0);
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount("payment");
      },
      onClickAd: function onClickAd(_event, _index) {
        if (false == this.limitClick.clickTime()) return;
        if (false === this.checkAvailabelAds) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("ad-tip-3"), "", this.node);
          return;
        }
        if (cc.Mgr.game.paymentAdCountList[_index] > 0) {
          var self = this;
          cc.Mgr.admob.showRewardedVideoAd(function(_state) {
            if (_state) {
              cc.Mgr.game.paymentAdCountList[_index]--;
              var maxCount;
              maxCount = _index <= 2 ? "1" : _index <= 5 ? "2" : "3";
              self.adCountLabelList[_index].string = cc.Mgr.game.paymentAdCountList[_index] + "/" + maxCount;
              cc.Mgr.game.paymentAdCountList[_index] > 0 ? self.spriteCoinList[_index].setMaterial(0, self.nomarlM) : self.spriteCoinList[_index].setMaterial(0, self.grayM);
              cc.Mgr.UIMgr.openAssetGetUI("gem", self.adGetGemsList[_index], "payment_ads");
            }
          }, this.node, "payment", this);
        } else {
          this.spriteCoinList[_index].setMaterial(0, this.grayM);
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("payment-max-ad-count-tip"), "", this.node);
        }
      },
      onClickBottom: function onClickBottom() {
        var _this3 = this;
        if (false == this.limitClick.clickTime()) return;
        cc.Mgr.payment.purchaseByIndex(0, function(_gems) {
          var self = _this3;
          cc.tween(_this3.blurBg).to(.15, {
            opacity: 0
          }).start();
          cc.tween(_this3.content).to(.15, {
            opacity: 0,
            scale: .5
          }).call(function() {
            self.node.active = false;
            cc.Mgr.UIMgr.reduceShowUICount("payment");
            cc.Mgr.UIMgr.openAssetGetUI("gem", _gems, "payment");
          }).start();
        }, this.node);
      },
      onClickPurchase: function onClickPurchase(_event, _index) {
        var _this4 = this;
        if (false == this.limitClick.clickTime()) return;
        cc.Mgr.payment.purchaseByIndex(_index, function(_gems) {
          var self = _this4;
          cc.tween(_this4.blurBg).to(.15, {
            opacity: 0
          }).start();
          cc.tween(_this4.content).to(.15, {
            opacity: 0,
            scale: .5
          }).call(function() {
            self.node.active = false;
            cc.Mgr.UIMgr.reduceShowUICount("payment");
            cc.Mgr.UIMgr.openAssetGetUI("gem", _gems, "payment");
          }).start();
        }, this.node);
      },
      onClickWatchAd: function onClickWatchAd() {
        if (false == this.limitClick.clickTime()) return;
        if (false === this.checkAvailabelAds) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("ad-tip-3"), "", this.node);
          return;
        }
        if (cc.Mgr.game.paymentAdCount > 0) {
          var self = this;
          cc.Mgr.admob.showRewardedVideoAd(function(_state) {
            if (_state) {
              cc.Mgr.game.paymentAdCount--;
              self.adCountLabel.string = cc.Mgr.game.paymentAdCount + "/5";
              cc.Mgr.UIMgr.openAssetGetUI("gem", 3, "payment_ads");
              self.checkAvailabelAds = cc.Mgr.admob.checkAvailableRewardedAd();
              self.checkAvailabelAds ? self.spriteCoin.setMaterial(0, self.nomarlM) : self.spriteCoin.setMaterial(0, self.grayM);
            }
          }, this.node, "payment", this);
        } else cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("payment-max-ad-count-tip"), "", this.node);
      },
      updateAdsBtnState: function updateAdsBtnState() {
        this.checkAvailabelAds = cc.Mgr.admob.checkAvailableRewardedAd();
        this.checkAvailabelAds ? this.spriteCoin.setMaterial(0, this.nomarlM) : this.spriteCoin.setMaterial(0, this.grayM);
      },
      onClickVIP: function onClickVIP() {
        cc.Mgr.UIMgr.openSpecialGridBundle();
        return;
        var self;
      }
    });
    cc._RF.pop();
  }, {} ],
  Payment: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4c4f36LLxVCurrK8mdoIMZq", "Payment");
    "use strict";
    var Base64 = require("js-base64").Base64;
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        cc.Mgr.payment = this;
      },
      start: function start() {
        this.priceList = [ "50 Stars", "150 Stars", "250 Stars", "600 Stars", "1500 Stars", "2500 Stars", "400 Stars", "100 Stars", "250 Stars", "100 Stars", "50 Stars", "50 Stars", "150 Stars", "50 Stars", "200 Stars", "50 Stars" ];
        this.priceValueList = [ 50, 150, 250, 600, 1500, 2500, 400, 100, 250, 100, 50, 50, 150, 50, 200, 50 ];
        this.getGems = [ 100, 360, 700, 2e3, 5400, 1e4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
        this.productsIDList = [ "gem_01", "gem_02", "gem_03", "gem_04", "gem_05", "gem_06", "vip_subscription_01", "purchase.coin_01", "special_grid", "remove_ad", "triple_offline", "purchase.coin_02", "special_grid_02", "remove_ad_02", "vip_subscription_02", "unlock_all_grids" ];
        this.productsNameList = [ "100 Gems", "360 Gems", "700 Gems", "2000 Gems", "5400 Gems", "10000 Gems", "VIP", "Coin Bundle", "Unlock Fort", "Remove Ads", "Triple Offline", "Coin Bundle", "Unlock Fort", "Remove Ads", "VIP", "Unlock All Plots" ];
        this.purchaseTimer = 0;
      },
      purchaseByIndex: function purchaseByIndex(_index, _callback, _tipParent) {
        this.tipParent = _tipParent;
        this.index = _index;
        var curProductID = this.productsIDList[_index];
        this.callback = _callback;
        cc.Mgr.Config.isTelegram ? this.purchase(curProductID) : this.callback(this.getGems[_index]);
      },
      purchase: function purchase(_productId) {
        var _this = this;
        this.purchaseProductID = _productId;
        var priceValue = cc.Mgr.Config.isDebug ? 1 : this.priceValueList[this.index];
        var requestBody = JSON.stringify({
          user_id: window.Telegram.WebApp.initDataUnsafe.user.id,
          product_name: this.productsNameList[this.index],
          amount: priceValue
        });
        var data = {};
        data.elapsed = cc.Mgr.Utils.getDate9(true);
        data.productName = this.purchaseProductID;
        cc.Mgr.analytics.logEvent("purchase_start", JSON.stringify(data));
        cc.Mgr.UIMgr.showLoading(true);
        var url = cc.Mgr.Config.isDebug ? "https://tg-api-service-test.lunamou.com/orders/create" : "https://tg-api-service.lunamou.com/orders/create";
        cc.Mgr.http.httpPost(url, requestBody, function(error, response) {
          if (true == error) {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("payment-failed"), "", _this.tipParent);
            cc.Mgr.UIMgr.hideLoading();
            _this.callback = null;
            return;
          }
          data = JSON.parse(response);
          if (data && data.invoice_url) window.Telegram.WebApp.openInvoice(data.invoice_url, function(status) {
            if ("paid" === status) _this.checkOrderStatus(data.id); else if ("failed" === status) {
              window.Telegram.WebApp.showAlert("Payment failed. Please try again.");
              cc.Mgr.UIMgr.hideLoading();
              _this.callback = null;
            } else if ("cancelled" === status) {
              window.Telegram.WebApp.showAlert("Payment was cancelled.");
              cc.Mgr.UIMgr.hideLoading();
              _this.callback = null;
            } else {
              window.Telegram.WebApp.showAlert("Unexpected payment status: " + status);
              cc.Mgr.UIMgr.hideLoading();
              _this.callback = null;
            }
          }); else {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("payment-failed"), "", _this.tipParent);
            cc.Mgr.UIMgr.hideLoading();
            _this.callback = null;
          }
        });
      },
      checkOrderStatus: function checkOrderStatus(orderId) {
        var _this2 = this;
        var url = cc.Mgr.Config.isDebug ? "https://tg-api-service-test.lunamou.com/orders/" : "https://tg-api-service.lunamou.com/orders/";
        cc.Mgr.http.httpGets(url + orderId + "/status", function(error, response) {
          if (true == error) {
            window.Telegram.WebApp.showAlert("Error checking order status. Please try again later.");
            return;
          }
          var data = JSON.parse(response);
          if (data.status && "paid" === data.status) {
            window.Telegram.WebApp.showAlert("Payment successful! Thank you for your purchase.");
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("payment-successful"), "", _this2.tipParent);
            _this2.callback(_this2.getGems[_this2.index]);
            cc.Mgr.game.isPayingUser = true;
            cc.Mgr.game.ltv += _this2.priceList[_this2.index];
            cc.Mgr.UIMgr.hideLoading();
            _this2.callback = null;
          } else if (data.status && "pending" === data.status) setTimeout(function() {
            return _this2.checkOrderStatus(orderId);
          }, 5e3); else {
            window.Telegram.WebApp.showAlert(response + "   Please contact support if you have any questions.");
            cc.Mgr.UIMgr.hideLoading();
            _this2.callback = null;
          }
        });
      },
      updateVIPState: function updateVIPState(_date) {
        cc.Mgr.game.vipExpire = parseInt(_date);
        cc.Mgr.game.isVIP = cc.Mgr.game.vipExpire > Date.now();
        cc.Mgr.game.vip = cc.Mgr.game.isVIP ? "active" : "inactive";
        if (true === cc.Mgr.game.isVIP && cc.Mgr.game.vipStartTimer > 0 && Date.now() - cc.Mgr.game.vipStartTimer > 6048e5) {
          var data = {};
          data.elapsed = cc.Mgr.Utils.getDate9(true);
          data.state = "convert";
          cc.Mgr.analytics.logEvent("vip_subscription", JSON.stringify(data));
          cc.Mgr.game.openSpecialGridCount = 0;
        } else if (false === cc.Mgr.game.isVIP && cc.Mgr.game.vipStartTimer > 0) {
          var _data = {};
          _data.elapsed = cc.Mgr.Utils.getDate9(true);
          _data.state = "unsubscribed";
          cc.Mgr.analytics.logEvent("vip_subscription", JSON.stringify(_data));
          cc.Mgr.game.vipExpire = 0;
        } else if (true === cc.Mgr.game.isVip && cc.Mgr.game.vipStartTimer > 0 && Date.now() - cc.Mgr.game.vipStartTimer <= 6048e5) {
          var _data2 = {};
          _data2.elapsed = cc.Mgr.Utils.getDate9(true);
          _data2.state = "subscribed";
          cc.Mgr.analytics.logEvent("vip_subscription", JSON.stringify(_data2));
        }
      },
      update: function update(dt) {
        if (this.purchaseTimer <= 0) return;
        if (true == this.canPurchase) {
          this.purchaseTimer = 0;
          this.purchase(this.purchaseProductID);
        }
        if (this.purchaseTimer > 0 && Date.now() - this.purchaseTimer > 5e3) {
          this.purchaseTimer = 0;
          this.canPurchase = false;
          cc.Mgr.UIMgr.hideLoading();
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("bad-connection"), "", this.tipParent);
          var data = {};
          data.elapsed = cc.Mgr.Utils.getDate9(true);
          data.productName = this.purchaseProductID;
          data.reason = "network_connection_unstable";
          cc.Mgr.analytics.logEvent("purchase_failed", JSON.stringify(data));
        }
      }
    });
    cc._RF.pop();
  }, {
    "js-base64": 1
  } ],
  PlantData: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ad2c8o+O7RKoKfbH/FLJ4Up", "PlantData");
    "use strict";
    var PlantData = cc.Class({
      name: "PlantData",
      properties: {
        level: 1,
        cd: 1,
        power: 0,
        skill: "",
        offline: 0,
        price: 0,
        gem: 0,
        prefab: "",
        shootPos: {
          default: [],
          type: [ cc.v2 ]
        },
        steakColor: "",
        head: "",
        sNeedMask: false,
        isNeedTrail: false,
        bulletHeight: 0,
        bulletNearLeftDis: 0
      }
    });
    module.exports = PlantData;
    cc._RF.pop();
  }, {} ],
  PlantMapMgr: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "27a04/1jZVBJqiEkTfllLyt", "PlantMapMgr");
    "use strict";
    var PlantMap = require("DB_plant");
    var PlantData = require("PlantData");
    var PlantMapMgr = cc.Class({
      extends: cc.Component,
      properties: {
        dataList: {
          default: [],
          type: [ PlantData ]
        }
      },
      DecodeJson: function DecodeJson() {
        var jsonAsset = JSON.parse(PlantMap.data);
        for (var key in jsonAsset) {
          var dt = new PlantData();
          dt.level = jsonAsset[key][0];
          dt.cd = jsonAsset[key][1];
          dt.power = BigInt(jsonAsset[key][2]);
          dt.skill = jsonAsset[key][3];
          dt.offline = jsonAsset[key][4];
          dt.price = BigInt(jsonAsset[key][5]);
          dt.gem = jsonAsset[key][6];
          dt.prefab = jsonAsset[key][7];
          var posL = jsonAsset[key][8].split(",");
          if (2 == posL.length) dt.shootPos[0] = cc.v2(parseInt(posL[0]), parseInt(posL[1])); else if (4 == posL.length) {
            dt.shootPos[0] = cc.v2(parseInt(posL[0]), parseInt(posL[1]));
            dt.shootPos[1] = cc.v2(parseInt(posL[2]), parseInt(posL[3]));
          } else if (6 == posL.length) {
            dt.shootPos[0] = cc.v2(parseInt(posL[0]), parseInt(posL[1]));
            dt.shootPos[1] = cc.v2(parseInt(posL[2]), parseInt(posL[3]));
            dt.shootPos[2] = cc.v2(parseInt(posL[4]), parseInt(posL[5]));
          } else if (8 == posL.length) {
            dt.shootPos[0] = cc.v2(parseInt(posL[0]), parseInt(posL[1]));
            dt.shootPos[1] = cc.v2(parseInt(posL[2]), parseInt(posL[3]));
            dt.shootPos[2] = cc.v2(parseInt(posL[4]), parseInt(posL[5]));
            dt.shootPos[3] = cc.v2(parseInt(posL[6]), parseInt(posL[7]));
          } else if (10 == posL.length) {
            dt.shootPos[0] = cc.v2(parseInt(posL[0]), parseInt(posL[1]));
            dt.shootPos[1] = cc.v2(parseInt(posL[2]), parseInt(posL[3]));
            dt.shootPos[2] = cc.v2(parseInt(posL[4]), parseInt(posL[5]));
            dt.shootPos[3] = cc.v2(parseInt(posL[6]), parseInt(posL[7]));
            dt.shootPos[3] = cc.v2(parseInt(posL[8]), parseInt(posL[9]));
          }
          dt.steakColor = jsonAsset[key][9];
          dt.head = jsonAsset[key][10];
          dt.isNeedMask = jsonAsset[key][11];
          dt.isNeedTrail = jsonAsset[key][12];
          dt.bulletHeight = jsonAsset[key][13];
          dt.bulletNearLeftDis = jsonAsset[key][14];
          dt.bulletType = jsonAsset[key][15];
          dt.zoom = jsonAsset[key][16];
          this.dataList[key] = dt;
        }
      },
      getDataByKey: function getDataByKey(lv) {
        return this.dataList[lv];
      }
    });
    module.exports = PlantMapMgr;
    cc._RF.pop();
  }, {
    DB_plant: "DB_plant",
    PlantData: "PlantData"
  } ],
  PlantMergeGuide: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cdff6UHrAFIUZmUjZQtWBGJ", "PlantMergeGuide");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        circle: cc.Sprite,
        finger: cc.Sprite
      },
      startMove: function startMove(startPos, endPos) {
        this.move(startPos, endPos);
      },
      stopMove: function stopMove() {
        null != this.fingerTween && this.fingerTween.stop();
        null != this.circleTween && this.circleTween.stop();
      },
      move: function move(startPos, endPos) {
        var self = this;
        this.finger.node.position = startPos;
        this.finger.node.opacity = 255;
        this.circle.node.position = startPos;
        this.circle.node.opacity = 255;
        this.circle.node.scale = 1;
        this.fingerTween = cc.tween(this.finger.node).to(1, {
          position: endPos
        }).to(.3, {
          opacity: 0
        }).call(function() {
          self.move(startPos, endPos);
        });
        this.fingerTween.start();
        this.circleTween = cc.tween(this.circle.node).to(.5, {
          scale: 2,
          opacity: 0
        });
        this.circleTween.start();
      },
      start: function start() {}
    });
    cc._RF.pop();
  }, {} ],
  RankingItem: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "47a0fdishVEV5K2tJnFNkST", "RankingItem");
    "use strict";
    var MySprite = require("MySprite");
    var DataType = require("DataType");
    var AtlasType = require("AtlasType");
    cc.Class({
      extends: cc.Component,
      properties: {
        rankingLabel: cc.Label,
        rankingImg_1: cc.Node,
        rankingImg_2: cc.Node,
        rankingImg_3: cc.Node,
        playerName: cc.Node,
        plantLevel: cc.Label,
        plantPhoto: MySprite,
        playerPhoto: cc.Sprite,
        isSelfNode: cc.Node
      },
      start: function start() {},
      setParent: function setParent(parent) {
        this.Parent = parent;
      },
      setContent: function setContent(_data) {
        var _this = this;
        switch (_data.rank) {
         case 1:
          this.rankingLabel.node.active = false;
          this.rankingImg_1.active = true;
          this.rankingImg_2.active = false;
          this.rankingImg_3.active = false;
          break;

         case 2:
          this.rankingLabel.node.active = false;
          this.rankingImg_1.active = false;
          this.rankingImg_2.active = true;
          this.rankingImg_3.active = false;
          break;

         case 3:
          this.rankingLabel.node.active = false;
          this.rankingImg_1.active = false;
          this.rankingImg_2.active = false;
          this.rankingImg_3.active = true;
          break;

         default:
          this.rankingLabel.node.active = true;
          this.rankingImg_1.active = false;
          this.rankingImg_2.active = false;
          this.rankingImg_3.active = false;
          this.rankingLabel.string = _data.rank;
        }
        this.playerName.getComponent("ScrollLabel").setLabel(_data.player.name);
        this.plantLevel.string = "lv." + _data.formattedScore;
        var plantData = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData, _data.formattedScore);
        this.plantPhoto.setSprite(AtlasType.PlantHead, plantData.head);
        cc.assetManager.loadRemote(_data.player.photo, function(err, texture) {
          if (null == err) {
            var spriteFrame = new cc.SpriteFrame(texture);
            _this.playerPhoto.spriteFrame = spriteFrame;
            _this.playerPhoto.node.width = _this.playerPhoto.node.height = 50;
          }
        });
        this.isSelfNode.active = 1 == _data.rank;
      }
    });
    cc._RF.pop();
  }, {
    AtlasType: "AtlasType",
    DataType: "DataType",
    MySprite: "MySprite"
  } ],
  RankingUI: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "374038PtZhFmrPZHJNBl45z", "RankingUI");
    "use strict";
    var MissionType = require("MissionType");
    var AchieveType = require("AchieveType");
    cc.Class({
      extends: cc.Component,
      properties: {
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
      onLoad: function onLoad() {
        this._scrollViewComponent = this.rankItemListView.getComponent("WaterfallFlow");
        this.rankingData = cc.Mgr.Utils.rankingData;
      },
      start: function start() {
        this.rankLabel.string = cc.Mgr.Utils.getTranslation("rank-ranking");
        this.iconLabel.string = cc.Mgr.Utils.getTranslation("rank-icon");
        this.nameLabel.string = cc.Mgr.Utils.getTranslation("rank-name");
        this.topLabel.string = cc.Mgr.Utils.getTranslation("rank-top");
        this.title.active = false;
        this.title_zh.active = false;
        this.title_ja.active = false;
        this.title_ru.active = false;
        "Japanese" === cc.Mgr.Config.language ? this.title_ja.active = true : "Simplified Chinese" === cc.Mgr.Config.language || "Traditional Chinese" === cc.Mgr.Config.language ? this.title_zh.active = true : "Russian" === cc.Mgr.Config.language ? this.title_ru.active = true : this.title.active = true;
      },
      showUI: function showUI() {
        this.blurBg.opacity = 0;
        this.content.opacity = 0;
        this.content.setScale(.5);
        cc.tween(this.blurBg).to(.05, {
          opacity: 255
        }).call().start();
        cc.tween(this.content).to(.15, {
          opacity: 255,
          scale: 1
        }).start();
        "Japanese" === cc.Mgr.Config.language ? this.rankLabel.fontSize = this.iconLabel.fontSize = this.nameLabel.fontSize = this.topLabel.fontSize = 16 : "Russian" === cc.Mgr.Config.language && (this.rankLabel.fontSize = this.iconLabel.fontSize = this.nameLabel.fontSize = this.topLabel.fontSize = 13);
        this.rankingData = [];
        for (var i = 0; i < 10; i++) {
          var rankData = {};
          rankData.rank = i + 1;
          rankData.player = {};
          rankData.player.name = "Tester_" + (i + 1);
          rankData.formattedScore = 10 - i;
          rankData.player.photo = "";
          this.rankingData.push(rankData);
        }
        this.rankingData && this._scrollViewComponent.setBaseInfo(this.rankingData.length, 5, 15, 85, this.setRankList.bind(this));
        this._scrollViewComponent.clear();
        this._scrollViewComponent.scrollTo(0);
        this.shareNode.active = false;
      },
      setRankList: function setRankList(_index, _updateIdx, _curShowIdxListLen) {
        void 0 == _updateIdx && (_updateIdx = -1);
        var result;
        if (this.rankingData.length <= 5) result = this.rankingData; else {
          var idx = -1 == _updateIdx ? 5 * _index : 5 * _updateIdx;
          var endIdx = -1 == _updateIdx ? idx + 5 : idx + 5 * _curShowIdxListLen;
          result = this.rankingData.slice(idx, endIdx);
        }
        this._scrollViewComponent.updateShowList(result, "RankingItem", this);
      },
      closeUI: function closeUI() {
        cc.Mgr.AudioMgr.playSFX("click");
        var self = this;
        cc.tween(this.blurBg).to(.15, {
          opacity: 0
        }).start();
        cc.tween(this.content).to(.15, {
          opacity: 0,
          scale: .5
        }).call(function() {
          self.node.active = false;
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount("ranking");
      },
      onClickShare: function onClickShare() {
        var self = this;
        cc.Mgr.UIMgr.showLoading();
        cc.Mgr.Utils.getBase64Image("resources/tex/shareImage_6.png", function(_data) {
          cc.Mgr.UIMgr.hideLoading();
          cc.Mgr.game.updateMissionProgressById(MissionType.InviteCount);
          cc.Mgr.game.updateAchieveProgressByType(AchieveType.Invite);
          cc.Mgr.UIMgr.InGameUI.checkMissionAchieveTip();
          var data = {};
          data.elapsed = cc.Mgr.Utils.getDate9(true);
          data.stage = cc.Mgr.game.level;
          data.feature = "rank";
          cc.Mgr.analytics.logEvent("share_message", JSON.stringify(data));
          self.closeUI();
          cc.Mgr.UIMgr.showPrompt("Invitation Failed", "", self.node);
          cc.Mgr.UIMgr.hideLoading();
        });
      }
    });
    cc._RF.pop();
  }, {
    AchieveType: "AchieveType",
    MissionType: "MissionType"
  } ],
  RemoveAdBundle: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b79ceUFSsFFtaTD7X7hKzTv", "RemoveAdBundle");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        content: cc.Node,
        blurBg: cc.Node,
        btnLabel: cc.Label,
        priceSaleLabel: cc.Label,
        priceLabel: cc.Label,
        singlePriceLabel: cc.Label,
        saleNode: cc.Node,
        priceNode: cc.Node,
        desLabel: cc.Label,
        saleSprite: cc.Node,
        saleSprite2: cc.Node,
        timeNode: cc.Node,
        timeLabel: cc.Label,
        timeTip: cc.Label,
        title: cc.Node,
        title_zh: cc.Node,
        title_ja: cc.Node,
        title_ru: cc.Node
      },
      onLoad: function onLoad() {
        this.limitClick = this.node.getComponent("LimitClick");
      },
      start: function start() {
        this.btnLabel.string = cc.Mgr.Utils.getTranslation("btn-get");
        this.timeTip.string = cc.Mgr.Utils.getTranslation("bundle-time-tip");
        this.title.active = false;
        this.title_zh.active = false;
        this.title_ja.active = false;
        this.title_ru.active = false;
        "Japanese" === cc.Mgr.Config.language ? this.title_ja.active = true : "Simplified Chinese" === cc.Mgr.Config.language || "Traditional Chinese" === cc.Mgr.Config.language ? this.title_zh.active = true : "Russian" === cc.Mgr.Config.language ? this.title_ru.active = true : this.title.active = true;
      },
      showUI: function showUI() {
        this.priceLabel.string = cc.Mgr.payment.priceList[9];
        this.priceSaleLabel.string = cc.Mgr.payment.priceList[13];
        this.singlePriceLabel.string = cc.Mgr.payment.priceList[9];
        this.saleSprite.width = this.saleSprite2.width = 16 * this.priceLabel.string.length;
        this.blurBg.opacity = 0;
        this.content.opacity = 0;
        this.content.setScale(.5);
        cc.tween(this.blurBg).to(.05, {
          opacity: 255
        }).call().start();
        cc.tween(this.content).to(.15, {
          opacity: 255,
          scale: 1
        }).start();
        this.refreshUI();
        cc.Mgr.admob.showBanner("removeAdBunlde");
        this.startTimeCount();
      },
      refreshUI: function refreshUI() {
        this.isSale = 0 !== cc.Mgr.game.removeAdStartTimer && Date.now() - cc.Mgr.game.removeAdStartTimer < 864e5;
        this.saleNode.active = this.isSale;
        this.priceNode.active = !this.isSale;
        this.timeNode.active = this.isSale;
        this.isSale ? this.desLabel.string = cc.Mgr.Utils.getTranslation("removeAdBundle-tip2") : this.desLabel.string = cc.Mgr.Utils.getTranslation("removeAdBundle-tip");
      },
      startTimeCount: function startTimeCount() {
        this.unschedule(this.countTime);
        if (false === this.isSale) return;
        this.seconds = Math.floor((cc.Mgr.game.removeAdStartTimer + 864e5 - Date.now()) / 1e3);
        if (this.seconds > 0) {
          this.timeNode.active = true;
          var timeStr = cc.Mgr.Utils.FormatNumToTime(this.seconds);
          this.timeLabel.string = timeStr;
          this.schedule(this.countTime, 1);
        }
      },
      countTime: function countTime() {
        this.seconds -= 1;
        if (this.seconds < 0) {
          this.unschedule(this.countTime);
          this.refreshUI();
          return;
        }
        var timeStr = cc.Mgr.Utils.FormatNumToTime(this.seconds);
        this.timeLabel.string = timeStr;
      },
      onClickClose: function onClickClose() {
        cc.Mgr.AudioMgr.playSFX("click");
        cc.Mgr.admob.hideBanner("removeAdBunlde");
        var self = this;
        cc.tween(this.blurBg).to(.15, {
          opacity: 0
        }).start();
        cc.tween(this.content).to(.15, {
          opacity: 0,
          scale: .5
        }).call(function() {
          self.node.active = false;
          cc.Mgr.UIMgr.starterBundleNode && cc.Mgr.UIMgr.starterBundleNode.active && cc.Mgr.UIMgr.starterBundleNode.getComponent("StarterBundle").refreshUI();
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount("removeAdBundle");
      },
      onClickGet: function onClickGet() {
        var _this = this;
        if (false == this.limitClick.clickTime()) return;
        var currentProductID = this.isSale ? 13 : 9;
        cc.Mgr.payment.purchaseByIndex(currentProductID, function() {
          cc.Mgr.game.removeAd = true;
          cc.Mgr.admob.hideBanner("all");
          _this.onClickClose();
          cc.Mgr.game.removeAdStartTimer = 0;
          _this.refreshUI();
        }, cc.Mgr.UIMgr.tipRoot);
      }
    });
    cc._RF.pop();
  }, {} ],
  SButton: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d1280/UdJ5LGbvbtRXd3/54", "SButton");
    "use strict";
    var SButton = cc.Class({
      extends: cc.Button,
      properties: {},
      start: function start() {
        this.node.on(cc.Node.EventType.TOUCH_START, function() {
          this.node.runAction(cc.scaleTo(.1, 1.2));
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_END, function() {
          this.node.runAction(cc.scaleTo(.1, 1));
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function() {
          this.node.runAction(cc.scaleTo(.1, 1));
        }, this);
      }
    });
    module.exports = SButton;
    cc._RF.pop();
  }, {} ],
  SceneAdapter: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "de98bwWI5dJhbOuVPZDGweG", "SceneAdapter");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, menu = _a.menu;
    var SceneAdapter = function(_super) {
      __extends(SceneAdapter, _super);
      function SceneAdapter() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      SceneAdapter.prototype.start = function() {
        var cvs = this.node.getComponent(cc.Canvas);
        if (null === cvs) {
          cc.warn("\u8282\u70b9" + this.node.name + "\u6ca1\u6709cc.Canvas\u7ec4\u4ef6, SceneAdapter\u6dfb\u52a0\u5931\u8d25!");
          this.destroy();
          return;
        }
        cvs.fitWidth = true;
        cvs.fitHeight = true;
        this.resize();
        cc.view.setResizeCallback(this.resize.bind(this));
      };
      SceneAdapter.prototype.resize = function() {
        var node = this.node;
        if (cc.sys.isMobile) {
          node.width = cc.winSize.width;
          node.height = cc.winSize.height;
        } else cc.winSize.width / cc.winSize.height > node.width / node.height ? node.scale = cc.winSize.height / node.height : node.scale = cc.winSize.width / node.width;
      };
      SceneAdapter = __decorate([ ccclass, menu("Comp/SceneAdapter") ], SceneAdapter);
      return SceneAdapter;
    }(cc.Component);
    exports.default = SceneAdapter;
    cc._RF.pop();
  }, {} ],
  ScrollLabel: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "071dehrdAFJ7ZV3XhnslGjy", "ScrollLabel");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        label: cc.Label
      },
      onLoad: function onLoad() {
        this.label.node.x = -1 * this.node.width / 2;
        this.isInit = false;
      },
      start: function start() {},
      setLabel: function setLabel(_content) {
        var _this = this;
        this.label.string = _content;
        this.label.node.x = -1 * this.node.width / 2;
        this.isInit = false;
        this.minPosX = -1 * this.node.width / 2;
        this.isRight = true;
        setTimeout(function() {
          _this.intervalTimer = Date.now();
          _this.currentTimer = Date.now();
          _this.maxPosX = -1 * _this.node.width / 2 - (_this.label.node.width - _this.node.width);
          _this.isInit = true;
        }, 1e3);
      },
      update: function update(dt) {
        if (false == this.isInit) return;
        if (this.label.node.width <= this.node.width) return;
        if (this.intervalTimer > 0) {
          if (!(Date.now() - this.intervalTimer >= 3e3)) return;
          this.intervalTimer = 0;
        }
        if (Date.now() - this.currentTimer >= 100) {
          this.currentTimer = Date.now();
          if (this.isRight) {
            this.label.node.x -= 2;
            if (this.label.node.x <= this.maxPosX) {
              this.label.node.x = this.maxPosX;
              this.intervalTimer = Date.now();
              this.isRight = false;
            }
          } else {
            this.label.node.x += 2;
            if (this.label.node.x >= this.minPosX) {
              this.label.node.x = this.minPosX;
              this.intervalTimer = Date.now();
              this.isRight = true;
            }
          }
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  ShopData: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9b01bjGPhpLoKlNNRFgM+s1", "ShopData");
    "use strict";
    var ShopData = cc.Class({
      name: "ShopData",
      properties: {
        level: 1,
        MAX: "",
        MAX_1: "",
        MAX_2: "",
        MAX_3: "",
        MAX_4: "",
        MAX_5: "",
        MAX_6: "",
        MAX_7: "",
        MAX_8: ""
      }
    });
    module.exports = ShopData;
    cc._RF.pop();
  }, {} ],
  ShopMapMgr: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4bce0Hptr1HUJByRULsz4t9", "ShopMapMgr");
    "use strict";
    var shopData = require("ShopData");
    var shopMap = require("DB_shopSort");
    var ShopMapMgr = cc.Class({
      extends: cc.Component,
      properties: {
        dataList: {
          default: [],
          type: [ shopData ]
        }
      },
      DecodeJson: function DecodeJson() {
        var jsonAsset = JSON.parse(shopMap.data);
        for (var key in jsonAsset) {
          var dt = new shopData();
          dt.level = jsonAsset[key][0];
          dt.MAX = jsonAsset[key][1];
          dt.MAX_1 = jsonAsset[key][2];
          dt.MAX_2 = jsonAsset[key][3];
          dt.MAX_3 = jsonAsset[key][4];
          dt.MAX_4 = jsonAsset[key][5];
          dt.MAX_5 = jsonAsset[key][6];
          dt.MAX_6 = jsonAsset[key][7];
          dt.MAX_7 = jsonAsset[key][8];
          dt.MAX_8 = jsonAsset[key][9];
          this.dataList[key] = dt;
        }
      },
      getDataByKey: function getDataByKey(Id) {
        return this.dataList[Id];
      }
    });
    module.exports = ShopMapMgr;
    cc._RF.pop();
  }, {
    DB_shopSort: "DB_shopSort",
    ShopData: "ShopData"
  } ],
  SpecialGridBundle: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c67e1/8wFlB0qVZorv8ABqJ", "SpecialGridBundle");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        content: cc.Node,
        blurBg: cc.Node,
        btnLabel: cc.Label,
        btnLabel2: cc.Label,
        priceSaleLabel: cc.Label,
        priceLabel: cc.Label,
        singlePriceLabel: cc.Label,
        saleNode: cc.Node,
        priceNode: cc.Node,
        desLabel: cc.Label,
        saleSprite: cc.Node,
        saleSprite2: cc.Node,
        timeNode: cc.Node,
        timeLabel: cc.Label,
        timeTip: cc.Label,
        gemNode: cc.Node,
        getBtn: cc.Node,
        getByGemsBtn: cc.Node,
        title: cc.Node,
        title_zh: cc.Node,
        title_ja: cc.Node,
        title_ru: cc.Node
      },
      onLoad: function onLoad() {
        this.limitClick = this.node.getComponent("LimitClick");
      },
      start: function start() {
        this.btnLabel.string = cc.Mgr.Utils.getTranslation("btn-get");
        this.btnLabel2.string = cc.Mgr.Utils.getTranslation("btn-get");
        this.timeTip.string = cc.Mgr.Utils.getTranslation("bundle-time-tip");
        this.title.active = false;
        this.title_zh.active = false;
        this.title_ja.active = false;
        this.title_ru.active = false;
        "Japanese" === cc.Mgr.Config.language ? this.title_ja.active = true : "Simplified Chinese" === cc.Mgr.Config.language || "Traditional Chinese" === cc.Mgr.Config.language ? this.title_zh.active = true : "Russian" === cc.Mgr.Config.language ? this.title_ru.active = true : this.title.active = true;
        this.allowShow = true;
      },
      showUI: function showUI(_sale) {
        this.gemNode.active = false;
        this.getByGemsBtn.active = false;
        this.priceLabel.string = cc.Mgr.payment.priceList[8];
        this.priceSaleLabel.string = cc.Mgr.payment.priceList[12];
        this.singlePriceLabel.string = cc.Mgr.payment.priceList[8];
        this.saleSprite.width = this.saleSprite2.width = 16 * this.priceLabel.string.length;
        (0 === cc.Mgr.game.specialGridStartTimer || 0 != cc.Mgr.game.specialGridStartTimer && Date.now() - cc.Mgr.game.specialGridStartTimer >= 864e5) && _sale && (cc.Mgr.game.specialGridStartTimer = Date.now());
        this.refreshUI();
        this.startTimeCount();
        this.blurBg.opacity = 0;
        this.content.opacity = 0;
        this.content.setScale(.5);
        cc.tween(this.blurBg).to(.05, {
          opacity: 255
        }).call().start();
        cc.tween(this.content).to(.15, {
          opacity: 255,
          scale: 1
        }).start();
        cc.Mgr.admob.showBanner("specialGridBunlde");
      },
      refreshUI: function refreshUI() {
        this.isSale = 0 !== cc.Mgr.game.specialGridStartTimer && Date.now() - cc.Mgr.game.specialGridStartTimer < 864e5;
        this.saleNode.active = this.isSale;
        this.priceNode.active = !this.isSale;
        this.timeNode.active = this.isSale;
        this.isSale ? this.desLabel.string = cc.Mgr.Utils.getTranslation("specialGridBundle-tip2") : this.desLabel.string = cc.Mgr.Utils.getTranslation("specialGridBundle-tip");
      },
      startTimeCount: function startTimeCount() {
        this.unschedule(this.countTime);
        if (false === this.isSale) return;
        this.seconds = Math.floor((cc.Mgr.game.specialGridStartTimer + 864e5 - Date.now()) / 1e3);
        if (this.seconds > 0) {
          this.timeNode.active = true;
          var timeStr = cc.Mgr.Utils.FormatNumToTime(this.seconds);
          this.timeLabel.string = timeStr;
          this.schedule(this.countTime, 1);
        }
      },
      countTime: function countTime() {
        this.seconds -= 1;
        if (this.seconds < 0) {
          this.unschedule(this.countTime);
          this.refreshUI();
          return;
        }
        var timeStr = cc.Mgr.Utils.FormatNumToTime(this.seconds);
        this.timeLabel.string = timeStr;
      },
      onClickClose: function onClickClose() {
        cc.Mgr.AudioMgr.playSFX("click");
        cc.Mgr.admob.hideBanner("specialGridBunlde");
        var self = this;
        cc.tween(this.blurBg).to(.15, {
          opacity: 0
        }).start();
        cc.tween(this.content).to(.15, {
          opacity: 0,
          scale: .5
        }).call(function() {
          self.node.active = false;
          cc.Mgr.game.unlockSpecialGrid && cc.Mgr.plantMgr.activateSpecialGrid();
          cc.Mgr.UIMgr.starterBundleNode && cc.Mgr.UIMgr.starterBundleNode.active && cc.Mgr.UIMgr.starterBundleNode.getComponent("StarterBundle").refreshUI();
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount("specialGrid");
      },
      onClickGet: function onClickGet() {
        var _this = this;
        if (false == this.limitClick.clickTime()) return;
        var currentProductID = this.isSale ? 12 : 8;
        cc.Mgr.payment.purchaseByIndex(currentProductID, function() {
          cc.Mgr.game.unlockSpecialGrid = true;
          _this.onClickClose();
          cc.Mgr.game.specialGridStartTimer = 0;
          _this.refreshUI();
        }, cc.Mgr.UIMgr.tipRoot);
      },
      onClickGetByGems: function onClickGetByGems() {
        var _this2 = this;
        if (false == this.limitClick.clickTime()) return;
        if (cc.Mgr.game.gems < 300) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("NoGems"), "gem", this.node);
          setTimeout(function() {
            cc.Mgr.UIMgr.openPaymentUI(true);
            _this2.onClickClose();
          }, 300);
          return;
        }
        cc.Mgr.game.gems -= 300;
        cc.Mgr.game.unlockSpecialGrid = true;
        this.onClickClose();
      }
    });
    cc._RF.pop();
  }, {} ],
  SpinLvData: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c11daDNO4hF3ZGjnp4xE3Ne", "SpinLvData");
    "use strict";
    var SpinLvData = cc.Class({
      name: "SpinLvData",
      properties: {
        Level: 1,
        SpinS: 1,
        SpinA: 2,
        SpinB: 3,
        SpinC: 4
      }
    });
    cc._RF.pop();
  }, {} ],
  SpinLvMapMgr: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5afe8Z/96hIVKMMxRn/Ab3l", "SpinLvMapMgr");
    "use strict";
    var spinMap = require("DB_spinLevel");
    var spinLvData = require("SpinLvData");
    var SpinLvMapMgr = cc.Class({
      extends: cc.Component,
      properties: {
        dataList: {
          default: [],
          type: [ spinLvData ]
        }
      },
      DecodeJson: function DecodeJson() {
        var jsonAsset = JSON.parse(spinMap.data);
        for (var key in jsonAsset) {
          var dt = new spinLvData();
          dt.Level = jsonAsset[key][0];
          dt.SpinS = jsonAsset[key][1];
          dt.SpinA = jsonAsset[key][2];
          dt.SpinB = jsonAsset[key][3];
          dt.SpinC = jsonAsset[key][4];
          this.dataList[key] = dt;
        }
      },
      getDataByKey: function getDataByKey(Id) {
        return this.dataList[Id];
      }
    });
    module.exports = SpinLvMapMgr;
    cc._RF.pop();
  }, {
    DB_spinLevel: "DB_spinLevel",
    SpinLvData: "SpinLvData"
  } ],
  StarterBundle: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0a2bf9j3g9Ibo3JFZ8ppLyV", "StarterBundle");
    "use strict";
    var DataType = require("DataType");
    var MyEnum = require("MyEnum");
    cc.Class({
      extends: cc.Component,
      properties: {
        blurBg: cc.Node,
        content: cc.Node,
        titleLabel: cc.Label,
        coinlabel: cc.Label,
        priceLabelList: [ cc.Label ],
        effectList: [ cc.Node ],
        priceNodeList: [ cc.Node ],
        moduleList: [ cc.Node ],
        content_en_coin: cc.Node,
        content_zh_coin: cc.Node,
        content_ja_coin: cc.Node,
        content_ru_coin: cc.Node,
        content_en_unlock: cc.Node,
        content_zh_unlock: cc.Node,
        content_ja_unlock: cc.Node,
        content_ru_unlock: cc.Node,
        content_en_removeAd: cc.Node,
        content_zh_removeAd: cc.Node,
        content_ja_removeAd: cc.Node,
        content_ru_removeAd: cc.Node,
        content_en_offline: cc.Node,
        content_zh_offline: cc.Node,
        content_ja_offline: cc.Node,
        content_ru_offline: cc.Node,
        content_en_unlockAll: cc.Node,
        content_zh_unlockAll: cc.Node,
        content_ja_unlockAll: cc.Node,
        content_ru_unlockAll: cc.Node,
        unlockAllPrice: cc.Label,
        diamondNodeCoin: cc.Node,
        diamondNodeSpecial: cc.Node,
        diamondNodeUnlockAll: cc.Node,
        diamondNodeOffline: cc.Node,
        moneyNodeCoin: cc.Node,
        moneyNodeSpecial: cc.Node,
        moneyNodeUnlockAll: cc.Node,
        moneyNodeOffline: cc.Node
      },
      start: function start() {
        this.limitClick = this.node.getComponent("LimitClick");
        this.content_en_coin.active = false;
        this.content_zh_coin.active = false;
        this.content_ja_coin.active = false;
        this.content_ru_coin.active = false;
        this.content_en_unlock.active = false;
        this.content_zh_unlock.active = false;
        this.content_ja_unlock.active = false;
        this.content_ru_unlock.active = false;
        this.content_en_removeAd.active = false;
        this.content_zh_removeAd.active = false;
        this.content_ja_removeAd.active = false;
        this.content_ru_removeAd.active = false;
        this.content_en_offline.active = false;
        this.content_zh_offline.active = false;
        this.content_ja_offline.active = false;
        this.content_ru_offline.active = false;
        this.content_en_unlockAll.active = false;
        this.content_zh_unlockAll.active = false;
        this.content_ja_unlockAll.active = false;
        this.content_ru_unlockAll.active = false;
        if ("Japanese" === cc.Mgr.Config.language) {
          this.content_ja_coin.active = true;
          this.content_ja_unlock.active = true;
          this.content_ja_removeAd.active = true;
          this.content_ja_offline.active = true;
          this.content_ja_unlockAll.active = true;
        } else if ("Simplified Chinese" === cc.Mgr.Config.language || "Traditional Chinese" === cc.Mgr.Config.language) {
          this.content_zh_coin.active = true;
          this.content_zh_unlock.active = true;
          this.content_zh_removeAd.active = true;
          this.content_zh_offline.active = true;
          this.content_zh_unlockAll.active = true;
        } else if ("Russian" === cc.Mgr.Config.language) {
          this.content_ru_coin.active = true;
          this.content_ru_unlock.active = true;
          this.content_ru_removeAd.active = true;
          this.content_ru_offline.active = true;
          this.content_ru_unlockAll.active = true;
        } else {
          this.content_en_coin.active = true;
          this.content_en_unlock.active = true;
          this.content_en_removeAd.active = true;
          this.content_en_offline.active = true;
          this.content_en_unlockAll.active = true;
        }
        var iapEnable = true;
        this.diamondNodeCoin.active = !iapEnable;
        this.diamondNodeSpecial.active = !iapEnable;
        this.diamondNodeUnlockAll.active = !iapEnable;
        this.diamondNodeOffline.active = !iapEnable;
        this.moneyNodeCoin.active = iapEnable;
        this.moneyNodeSpecial.active = iapEnable;
        this.moneyNodeUnlockAll.active = iapEnable;
        this.moneyNodeOffline.active = iapEnable;
      },
      getCoin: function getCoin() {
        if (false == this.limitClick.clickTime()) return;
        cc.Mgr.UIMgr.openCoinBundle(this.coinNumber, true);
      },
      getSpecialGrid: function getSpecialGrid() {
        if (false == this.limitClick.clickTime()) return;
        if (cc.Mgr.game.isVIP) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("already-subscribed-vip"), "", this.node);
          return;
        }
        if (cc.Mgr.game.unlockSpecialGrid) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("already-subscribed"), "", this.node);
          return;
        }
        cc.Mgr.UIMgr.openSpecialGridBundle(false);
      },
      unlockAllGrids: function unlockAllGrids() {
        if (false == this.limitClick.clickTime()) return;
        if (false == cc.Mgr.plantMgr.hasLockGrid()) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("already-unlock-allGrids"), "", this.node);
          return;
        }
        cc.Mgr.UIMgr.openUnlockAllBundle();
      },
      removeAd: function removeAd() {
        if (false == this.limitClick.clickTime()) return;
        if (cc.Mgr.game.isVIP) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("already-subscribed-vip"), "", this.node);
          return;
        }
        if (cc.Mgr.game.removeAd) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("already-subscribed"), "", this.node);
          return;
        }
        cc.Mgr.UIMgr.openRemoveAdBundle();
      },
      getDoubleInOffline: function getDoubleInOffline() {
        if (false == this.limitClick.clickTime()) return;
        if (cc.Mgr.game.isVIP) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("already-subscribed-vip"), "", this.node);
          return;
        }
        if (cc.Mgr.game.offlineDouble) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("already-subscribed"), "", this.node);
          return;
        }
        cc.Mgr.UIMgr.openOfflineBundle(false);
      },
      refreshUI: function refreshUI() {
        this.effectList[0].active = 0 !== cc.Mgr.game.coinBundleStartTimer && Date.now() - cc.Mgr.game.coinBundleStartTimer < 864e5;
        this.effectList[1].active = 0 !== cc.Mgr.game.specialGridStartTimer && Date.now() - cc.Mgr.game.specialGridStartTimer < 864e5;
        this.effectList[2].active = 0 !== cc.Mgr.game.removeAdStartTimer && Date.now() - cc.Mgr.game.removeAdStartTimer < 864e5;
        var currentPriceList;
        currentPriceList = cc.Mgr.payment.priceList;
        for (var i = 0; i < this.priceLabelList.length; i++) this.priceLabelList[i].string = cc.Mgr.payment.priceList[i + 7];
        this.unlockAllPrice.string = currentPriceList[15];
        0 !== cc.Mgr.game.coinBundleStartTimer && Date.now() - cc.Mgr.game.coinBundleStartTimer < 864e5 && (this.priceLabelList[0].string = cc.Mgr.payment.priceList[11]);
        0 !== cc.Mgr.game.specialGridStartTimer && Date.now() - cc.Mgr.game.specialGridStartTimer < 864e5 && (this.priceLabelList[1].string = cc.Mgr.payment.priceList[12]);
        0 !== cc.Mgr.game.removeAdStartTimer && Date.now() - cc.Mgr.game.removeAdStartTimer < 864e5 && (this.priceLabelList[2].string = cc.Mgr.payment.priceList[13]);
      },
      showUI: function showUI() {
        this.titleLabel.string = cc.Mgr.Utils.getTranslation("starterBundles0title");
        this.blurBg.opacity = 0;
        this.content.opacity = 0;
        this.content.setScale(.5);
        cc.tween(this.blurBg).to(.05, {
          opacity: 255
        }).call().start();
        cc.tween(this.content).to(.15, {
          opacity: 255,
          scale: 1
        }).start();
        this.coinNumber = cc.Mgr.UIMgr.getCoinNumber() * BigInt(30);
        this.coinNumber = this.coinNumber < BigInt(1e6) ? BigInt(1e6) : this.coinNumber;
        this.coinNumber = this.coinNumber * BigInt(2);
        this.coinlabel.string = cc.Mgr.Utils.getNumStr2(this.coinNumber);
        cc.Mgr.admob.showBanner("starterBundle");
        this.refreshUI();
      },
      onClickClose: function onClickClose() {
        cc.Mgr.AudioMgr.playSFX("click");
        cc.Mgr.admob.hideBanner("starterBundle");
        var self = this;
        cc.tween(this.blurBg).to(.15, {
          opacity: 0
        }).start();
        cc.tween(this.content).to(.15, {
          opacity: 0,
          scale: .5
        }).call(function() {
          self.node.active = false;
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount("starterBundle");
      }
    });
    cc._RF.pop();
  }, {
    DataType: "DataType",
    MyEnum: "MyEnum"
  } ],
  SwitchFont: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b9bc9BbubJI4KZQrJuCE6z/", "SwitchFont");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        isStroke: true,
        offsetY: 0
      },
      start: function start() {
        this.label = this.node.getComponent(cc.Label);
        this.originalY = this.node.y;
        switch (cc.Mgr.Config.language) {
         case "English":
          this.isStroke ? this.label.font = cc.Mgr.fontManager.font_en : this.label.font = cc.Mgr.fontManager.font_en_noStroke;
          this.node.y = this.originalY;
          break;

         case "Russian":
          this.isStroke ? this.label.font = cc.Mgr.fontManager.font_ru : this.label.font = cc.Mgr.fontManager.font_ru_noStroke;
          this.node.y = this.originalY + 8 + this.offsetY;
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  TransData: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "598baAWuoNIupoBDWIiiRz6", "TransData");
    "use strict";
    var TransData = cc.Class({
      name: "TransData",
      properties: {
        en_US: "",
        zh_CN: "",
        zh_TW: "",
        zh_HK: "",
        de_DE: ""
      }
    });
    module.exports = TransData;
    cc._RF.pop();
  }, {} ],
  TransMapMgr: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "529c73Po5RAs4wgPM965snk", "TransMapMgr");
    "use strict";
    var TransMap = require("DB_i18n");
    var TransMapMgr = cc.Class({
      extends: cc.Component,
      properties: {},
      DecodeJson: function DecodeJson() {
        this.data = {};
        var jsonAsset = TransMap.data;
        for (var i = 0; i < jsonAsset.length; i++) {
          var item = jsonAsset[i];
          this.data[item.Key] = item;
        }
      },
      getDataByKey: function getDataByKey(Id) {
        return this.data[Id][cc.Mgr.Config.language];
      }
    });
    module.exports = TransMapMgr;
    cc._RF.pop();
  }, {
    DB_i18n: "DB_i18n"
  } ],
  TurnTableData: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "297c50BAC1IA7ZaQchA8S1h", "TurnTableData");
    "use strict";
    var TurnTableData = cc.Class({
      name: "TurnTableData",
      properties: {
        id: 1,
        type: 0,
        rarity: 0,
        weight: 0,
        rewards: 0
      }
    });
    module.exports = TurnTableData;
    cc._RF.pop();
  }, {} ],
  TurnTableGetType: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "389343LkklJs7LTf6CZOC26", "TurnTableGetType");
    "use strict";
    var TurnTableGetType = cc.Enum({
      coin: "coin",
      plant: "plant",
      gem: "gem",
      buff: "buff",
      drone: "drone"
    });
    module.exports = TurnTableGetType;
    cc._RF.pop();
  }, {} ],
  TurnTableMapMgr: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3e58ductqhBvLFQAsyGGttW", "TurnTableMapMgr");
    "use strict";
    var turnMap = require("DB_turntable");
    var turnData = require("TurnTableData");
    var TurnTableMapMgr = cc.Class({
      extends: cc.Component,
      properties: {
        dataList: {
          default: [],
          type: [ turnData ]
        }
      },
      DecodeJson: function DecodeJson() {
        var jsonAsset = JSON.parse(turnMap.data);
        for (var key in jsonAsset) {
          var dt = new turnData();
          dt.id = jsonAsset[key][0];
          dt.type = jsonAsset[key][1];
          dt.rarity = jsonAsset[key][2];
          dt.weight = jsonAsset[key][3];
          dt.rewards = jsonAsset[key][4];
          this.dataList[key] = dt;
        }
      },
      getDataByKey: function getDataByKey(Id) {
        return this.dataList[Id];
      }
    });
    module.exports = TurnTableMapMgr;
    cc._RF.pop();
  }, {
    DB_turntable: "DB_turntable",
    TurnTableData: "TurnTableData"
  } ],
  UIMgr: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "17061XGCOJL+qzfTLX/yjSj", "UIMgr");
    "use strict";
    var uiConfig = require("uiConfig");
    var DataType = require("DataType");
    var EffectType = require("EffectType");
    var MyEnum = require("MyEnum");
    var UIMgr = cc.Class({
      extends: cc.Component,
      properties: {
        uiRoot: cc.Node,
        tipTrashBackNode: cc.Node,
        trashBoxNode: cc.Node,
        tipRoot: cc.Node,
        loading: cc.Node
      },
      addShowUICount: function addShowUICount(_name) {
        this.openUINameList || (this.openUINameList = []);
        if (this.openUINameList.indexOf(_name) >= 0) return;
        this.openUINameList.push(_name);
        this.currentShowUICount++;
        console.log("cc.Mgr.UIMgr.currentShowUICount: " + cc.Mgr.UIMgr.currentShowUICount);
        cc.Mgr.ZombieMgr.pause();
        cc.Mgr.GameCenterCtrl.pauseFight = true;
      },
      reduceShowUICount: function reduceShowUICount(_name) {
        var index = this.openUINameList.indexOf(_name);
        if (index < 0) return;
        this.currentShowUICount--;
        index >= 0 && this.openUINameList.splice(index, 1);
        if (cc.Mgr.UIMgr.currentShowUICount <= 0) {
          cc.Mgr.GameCenterCtrl.pauseFight = false;
          cc.Mgr.ZombieMgr.resume();
          cc.Mgr.plantMgr.resume();
          cc.Mgr.plantMgr.autoMerge();
        }
        console.log("cc.Mgr.UIMgr.currentShowUICount: " + cc.Mgr.UIMgr.currentShowUICount);
      },
      showLoading: function showLoading(_needShow) {
        this.loading.opacity = 0;
        this.loading.active = true;
        var fadeIn = cc.fadeIn(.5);
        this.loading.runAction(fadeIn);
      },
      hideLoading: function hideLoading() {
        this.loading.stopAllActions();
        this.loading.active = false;
      },
      statics: {
        instance: null
      },
      onLoad: function onLoad() {
        UIMgr.instance = this;
        this.currentShowUICount = 0;
      },
      start: function start() {
        var self = this;
        cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.promptUI.Name, cc.Prefab, function(errmsg, prefab) {
          if (errmsg) {
            cc.error(errmsg.message || errmsg);
            return;
          }
          self.promptPre = prefab;
        });
      },
      showTrashBoxNode: function showTrashBoxNode(isShow) {
        void 0 === isShow && (isShow = true);
        this.trashBoxNode.active = isShow;
      },
      showTipToTrash: function showTipToTrash(needShow) {
        if (this.tipTrashBackNode.active === needShow) return;
        if (needShow && cc.Mgr.plantMgr.otherTipCount > 0) return;
        this.tipTrashBackNode.active = needShow;
        needShow ? cc.Mgr.plantMgr.otherTipCount++ : cc.Mgr.plantMgr.otherTipCount--;
      },
      playCoinFlyForRecovery: function playCoinFlyForRecovery(money) {
        var obj = cc.Mgr.EffectMgr.getObFromPool(EffectType.CoinFly);
        if (null == obj) return;
        obj.parent = this.trashBoxNode;
        obj.active = true;
        obj.zIndex = 101;
        obj.y = 60;
        obj.x = 0;
        obj.getComponent("coinFly").setData(cc.Mgr.Utils.getNumStr2(money));
        obj.scale = 1;
        cc.tween(obj).to(.1, {
          position: cc.v2(0, 90),
          scale: .8
        }).to(.5, {
          position: cc.v2(0, 100)
        }).call(function() {
          cc.Mgr.game.money += money;
          cc.Mgr.game.coin_gained_total += money;
          cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "money");
          cc.Mgr.EffectMgr.ObBackToPool(obj, EffectType.CoinFly);
        }).start();
      },
      openSetting: function openSetting() {
        var self = this;
        cc.Mgr.AudioMgr.playSFX("click");
        if (cc.Mgr.game.needGuide) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("need-to-complete-guide"), "", this.uiRoot);
          return;
        }
        this.clearPrompt();
        if (this.setUI) {
          this.addShowUICount("setting");
          this.setUI.active = true;
          self.setUI.getComponent("setPanel").showUI();
          this.setUI.zIndex = uiConfig.setUI.Layer;
        } else {
          this.setUI = null;
          this.showLoading();
          cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.setUI.Name, cc.Prefab, function(errmsg, prefab) {
            if (errmsg) {
              cc.error(errmsg.message || errmsg);
              return;
            }
            self.addShowUICount("setting");
            self.hideLoading();
            self.setUI = cc.instantiate(prefab);
            self.setUI.parent = self.uiRoot;
            self.setUI.active = true;
            self.setUI.getComponent("setPanel").showUI();
            self.setUI.zIndex = uiConfig.setUI.Layer;
          });
        }
      },
      closeShop: function closeShop() {
        null != this.paymentUINode && this.paymentUINode.getComponent("PaymentUI").onClickClose();
      },
      openPlantGetUI: function openPlantGetUI(from, lv, isDrone) {
        void 0 === isDrone && (isDrone = false);
        this.clearPrompt();
        var self = this;
        cc.Mgr.AudioMgr.playSFX("click");
        if (this.plantGetUINode) {
          this.addShowUICount("plantGet");
          this.plantGetUINode.active = true;
          this.plantGetUINode.opacity = 0;
          var fadeIn = cc.fadeIn(.25);
          this.plantGetUINode.getComponent("plantGetUI").showUI(from, lv, isDrone);
          this.plantGetUINode.runAction(fadeIn);
          this.plantGetUINode.zIndex = uiConfig.plantGetUI.Layer;
        } else {
          this.plantGetUINode = null;
          this.showLoading();
          cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.plantGetUI.Name, cc.Prefab, function(errmsg, prefab) {
            if (errmsg) {
              cc.error(errmsg.message || errmsg);
              return;
            }
            self.addShowUICount("plantGet");
            self.hideLoading();
            self.plantGetUINode = cc.instantiate(prefab);
            self.plantGetUINode.parent = self.uiRoot;
            self.plantGetUINode.active = true;
            self.plantGetUINode.opacity = 0;
            var fadeIn = cc.fadeIn(.25);
            self.plantGetUINode.getComponent("plantGetUI").showUI(from, lv, isDrone);
            self.plantGetUINode.runAction(fadeIn);
            self.plantGetUINode.zIndex = uiConfig.plantGetUI.Layer;
          });
        }
        "unlock" == from && 5 == lv && cc.Mgr.UIMgr.InGameUI.showUavNextTime(.5);
      },
      openDoubleCoinUI: function openDoubleCoinUI() {
        this.clearPrompt();
        var self = this;
        cc.Mgr.AudioMgr.playSFX("click");
        if (this.doubleCoinUI) {
          this.addShowUICount("doubleCoin");
          this.doubleCoinUI.active = true;
          this.doubleCoinUI.opacity = 0;
          var fadeIn = cc.fadeIn(.25);
          this.doubleCoinUI.getComponent("doubleCoinUI").showUI();
          this.doubleCoinUI.runAction(fadeIn);
          this.doubleCoinUI.zIndex = uiConfig.doubleCoinUI.Layer;
        } else {
          this.doubleCoinUI = null;
          this.showLoading();
          cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.doubleCoinUI.Name, cc.Prefab, function(errmsg, prefab) {
            if (errmsg) {
              cc.error(errmsg.message || errmsg);
              return;
            }
            self.addShowUICount("doubleCoin");
            self.hideLoading();
            self.doubleCoinUI = cc.instantiate(prefab);
            self.doubleCoinUI.parent = self.uiRoot;
            self.doubleCoinUI.active = true;
            self.doubleCoinUI.opacity = 0;
            var fadeIn = cc.fadeIn(.25);
            self.doubleCoinUI.getComponent("doubleCoinUI").showUI();
            self.doubleCoinUI.runAction(fadeIn);
            self.doubleCoinUI.zIndex = uiConfig.doubleCoinUI.Layer;
          });
        }
      },
      clearPrompt: function clearPrompt() {
        if (null != this.currentTip) {
          this.currentTip.stopAllActions();
          this.currentTip.destroy();
          this.currentTip = null;
        }
        if (null != this.lastTip) {
          this.lastTip.stopAllActions();
          this.lastTip.destroy();
          this.lastTip = null;
        }
      },
      showPrompt: function showPrompt(str, _type, _parent) {
        var _this = this;
        var self = this;
        if (null != this.currentTip) {
          this.lastTip = this.currentTip;
          this.lastTip.stopAllActions();
          var act3 = cc.moveBy(.2, 0, 150);
          var act4 = cc.fadeOut(.2);
          this.lastTip.runAction(cc.sequence(cc.spawn(act3, act4), cc.callFunc(function() {
            null != _this.lastTip && _this.lastTip.destroy();
            _this.lastTip = _this.currentTip;
          })));
        }
        if (void 0 == this.promptPre) cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.promptUI.Name, cc.Prefab, function(errmsg, prefab) {
          if (errmsg) {
            cc.error(errmsg.message || errmsg);
            return;
          }
          self.promptPre = prefab;
          self.currentTip = cc.instantiate(prefab);
          self.currentTip.y = 100 - self.currentTip.height / 2;
          self.currentTip.parent = _parent || self.uiRoot;
          self.currentTip.zIndex = uiConfig.promptUI.Layer;
          self.currentTip.getComponent("promptUI").showDes(str, _type);
          var act1 = cc.moveBy(.2, 0, 150);
          var act2 = cc.moveBy(1, 0, 0);
          var act3 = cc.moveBy(.2, 0, 150);
          var act4 = cc.fadeOut(.2);
          self.currentTip.runAction(cc.sequence(act1, act2, cc.callFunc(function() {
            self.currentTip.runAction(cc.sequence(cc.spawn(act3, act4), cc.callFunc(function() {
              if (null != self.currentTip) {
                self.currentTip.destroy();
                self.currentTip = null;
              }
            })));
          })));
        }); else {
          self.currentTip = cc.instantiate(this.promptPre);
          self.currentTip.y = 100 - self.currentTip.height / 2;
          self.currentTip.parent = _parent || self.uiRoot;
          self.currentTip.zIndex = uiConfig.promptUI.Layer;
          self.currentTip.getComponent("promptUI").showDes(str, _type);
          var act1 = cc.moveBy(.2, 0, 150);
          var act2 = cc.moveBy(1, 0, 0);
          var act3 = cc.moveBy(.2, 0, 150);
          var act4 = cc.fadeOut(.2);
          self.currentTip.runAction(cc.sequence(act1, act2, cc.callFunc(function() {
            self.currentTip.runAction(cc.sequence(cc.spawn(act3, act4), cc.callFunc(function() {
              if (null != self.currentTip) {
                self.currentTip.destroy();
                self.currentTip = null;
              }
            })));
          })));
        }
      },
      showSmallResult: function showSmallResult(suc) {
        var self = this;
        if (this.smallResultNode) {
          this.smallResultNode.active = true;
          this.smallResultNode.scaleY = .1;
          this.smallResultNode.getComponent("smallResult").show(suc);
          this.smallResultNode.runAction(cc.scaleTo(.25, 1, 1));
          this.smallResultNode.zIndex = uiConfig.smallResult.Layer;
          this.smallResultNode.y = 200;
        } else {
          this.smallResultNode = null;
          cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.smallResult.Name, cc.Prefab, function(errmsg, prefab) {
            if (errmsg) {
              cc.error(errmsg.message || errmsg);
              return;
            }
            self.smallResultNode = cc.instantiate(prefab);
            self.smallResultNode.parent = self.uiRoot;
            self.smallResultNode.active = true;
            self.smallResultNode.scaleY = .1;
            self.smallResultNode.getComponent("smallResult").show(suc);
            self.smallResultNode.runAction(cc.scaleTo(.25, 1, 1));
            self.smallResultNode.zIndex = uiConfig.smallResult.Layer;
            self.smallResultNode.y = 200;
          });
        }
      },
      showBigResult: function showBigResult(suc, coin) {
        this.clearPrompt();
        var self = this;
        if (this.bigResultNode) {
          this.addShowUICount("bigResult");
          this.bigResultNode.active = true;
          this.bigResultNode.getComponent("bigResult").show(suc, coin);
          this.bigResultNode.zIndex = uiConfig.bigResult.Layer;
        } else {
          this.bigResultNode = null;
          this.showLoading();
          cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.bigResult.Name, cc.Prefab, function(errmsg, prefab) {
            if (errmsg) {
              cc.error(errmsg.message || errmsg);
              return;
            }
            self.addShowUICount("bigResult");
            self.hideLoading();
            self.bigResultNode = cc.instantiate(prefab);
            self.bigResultNode.parent = self.uiRoot;
            self.bigResultNode.active = true;
            self.bigResultNode.getComponent("bigResult").show(suc, coin);
            self.bigResultNode.zIndex = uiConfig.bigResult.Layer;
          });
        }
      },
      showBossComing: function showBossComing(_id) {
        var self = this;
        if (this.bossComingNode) {
          this.bossComingNode.active = true;
          this.bossComingNode.getComponent("bossComing").playAnimation(_id);
          this.bossComingNode.zIndex = uiConfig.bossComing.Layer;
          this.bossComingNode.setScale(cc.Mgr.game.isPad ? 1.35 : 1);
        } else {
          this.bossComingNode = null;
          cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.bossComing.Name, cc.Prefab, function(errmsg, prefab) {
            if (errmsg) {
              cc.error(errmsg.message || errmsg);
              return;
            }
            self.bossComingNode = cc.instantiate(prefab);
            self.bossComingNode.parent = self.uiRoot;
            self.bossComingNode.active = true;
            self.bossComingNode.getComponent("bossComing").playAnimation(_id);
            self.bossComingNode.zIndex = uiConfig.bossComing.Layer;
            self.bossComingNode.setScale(cc.Mgr.game.isPad ? 1.35 : 1);
          });
        }
      },
      openBuffUI: function openBuffUI() {
        cc.Mgr.AudioMgr.playSFX("click");
        if (cc.Mgr.game.needGuide) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("need-to-complete-guide"), "", this.uiRoot);
          return;
        }
        this.clearPrompt();
        var self = this;
        if (this.buffUINode) {
          this.addShowUICount("buff");
          this.buffUINode.active = true;
          this.buffUINode.getComponent("BuffUI").showUI();
          this.buffUINode.zIndex = uiConfig.buffUI.Layer;
        } else {
          this.buffUINode = null;
          this.showLoading();
          cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.buffUI.Name, cc.Prefab, function(errmsg, prefab) {
            if (errmsg) {
              cc.error(errmsg.message || errmsg);
              return;
            }
            self.addShowUICount("buff");
            self.hideLoading();
            self.buffUINode = cc.instantiate(prefab);
            self.buffUINode.parent = self.uiRoot;
            self.buffUINode.active = true;
            self.buffUINode.getComponent("BuffUI").showUI();
            self.buffUINode.zIndex = uiConfig.buffUI.Layer;
          });
        }
      },
      openTurnTableUI: function openTurnTableUI() {
        cc.Mgr.AudioMgr.playSFX("click");
        if (cc.Mgr.game.needGuide) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("need-to-complete-guide"), "", this.uiRoot);
          return;
        }
        this.clearPrompt();
        var self = this;
        if (this.turnTableUINode) {
          this.addShowUICount("turnTable");
          this.turnTableUINode.active = true;
          this.turnTableUINode.getComponent("turnTableUI").showUI();
          this.turnTableUINode.zIndex = uiConfig.turnTableUI.Layer;
        } else {
          this.turnTableUINode = null;
          this.showLoading();
          cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.turnTableUI.Name, cc.Prefab, function(errmsg, prefab) {
            if (errmsg) {
              cc.error(errmsg.message || errmsg);
              return;
            }
            self.addShowUICount("turnTable");
            self.hideLoading();
            self.turnTableUINode = cc.instantiate(prefab);
            self.turnTableUINode.parent = self.uiRoot;
            self.turnTableUINode.active = true;
            self.turnTableUINode.getComponent("turnTableUI").showUI();
            self.turnTableUINode.zIndex = uiConfig.turnTableUI.Layer;
          });
        }
        cc.Mgr.UIMgr.InGameUI.setTopNodeLayer(this.turnTableUINode);
      },
      openAssetGetUI: function openAssetGetUI(rtype, num, fromType, callback) {
        void 0 === fromType && (fromType = "");
        void 0 === callback && (callback = null);
        this.clearPrompt();
        var self = this;
        if (this.assetGetUINode) {
          this.addShowUICount("assetGet");
          this.assetGetUINode.active = true;
          this.assetGetUINode.getComponent("assetGetUI").showUI(rtype, num, fromType, callback);
          this.assetGetUINode.zIndex = uiConfig.assetGetUI.Layer;
        } else {
          this.assetGetUINode = null;
          this.showLoading();
          cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.assetGetUI.Name, cc.Prefab, function(errmsg, prefab) {
            if (errmsg) {
              cc.error(errmsg.message || errmsg);
              return;
            }
            self.addShowUICount("assetGet");
            self.hideLoading();
            self.assetGetUINode = cc.instantiate(prefab);
            self.assetGetUINode.parent = self.uiRoot;
            self.assetGetUINode.active = true;
            self.assetGetUINode.getComponent("assetGetUI").showUI(rtype, num, fromType, callback);
            self.assetGetUINode.zIndex = uiConfig.assetGetUI.Layer;
          });
        }
      },
      openStarterBundle: function openStarterBundle() {
        cc.Mgr.AudioMgr.playSFX("click");
        if (cc.Mgr.game.needGuide) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("need-to-complete-guide"), "", this.uiRoot);
          return;
        }
        this.clearPrompt();
        var self = this;
        if (this.starterBundleNode) {
          this.addShowUICount("starterBundle");
          this.starterBundleNode.active = true;
          self.starterBundleNode.getComponent("StarterBundle").showUI();
          this.starterBundleNode.zIndex = uiConfig.starterBundleUI.Layer;
        } else {
          this.starterBundleNode = null;
          this.showLoading();
          cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.starterBundleUI.Name, cc.Prefab, function(errmsg, prefab) {
            if (errmsg) {
              cc.error(errmsg.message || errmsg);
              return;
            }
            self.addShowUICount("starterBundle");
            self.hideLoading();
            self.starterBundleNode = cc.instantiate(prefab);
            self.starterBundleNode.parent = self.uiRoot;
            self.starterBundleNode.active = true;
            self.starterBundleNode.getComponent("StarterBundle").showUI();
            self.starterBundleNode.zIndex = uiConfig.starterBundleUI.Layer;
          });
        }
      },
      openCoinBundle: function openCoinBundle(_coin, _sale) {
        cc.Mgr.AudioMgr.playSFX("click");
        if (cc.Mgr.game.needGuide) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("need-to-complete-guide"), "", this.uiRoot);
          return;
        }
        this.clearPrompt();
        var self = this;
        if (this.coinBundleNode) {
          this.addShowUICount("coinBundle");
          this.coinBundleNode.active = true;
          self.coinBundleNode.getComponent("CoinBundle").showUI(_coin, _sale);
          this.coinBundleNode.zIndex = uiConfig.coinBundle.Layer;
        } else {
          this.coinBundleNode = null;
          this.showLoading();
          cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.coinBundle.Name, cc.Prefab, function(errmsg, prefab) {
            if (errmsg) {
              cc.error(errmsg.message || errmsg);
              return;
            }
            self.addShowUICount("coinBundle");
            self.hideLoading();
            self.coinBundleNode = cc.instantiate(prefab);
            self.coinBundleNode.parent = self.uiRoot;
            self.coinBundleNode.active = true;
            self.coinBundleNode.getComponent("CoinBundle").showUI(_coin, _sale);
            self.coinBundleNode.zIndex = uiConfig.coinBundle.Layer;
          });
        }
      },
      openOfflineBundle: function openOfflineBundle(_sale) {
        cc.Mgr.AudioMgr.playSFX("click");
        if (cc.Mgr.game.needGuide) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("need-to-complete-guide"), "", this.uiRoot);
          return;
        }
        this.clearPrompt();
        var self = this;
        if (this.offlineBundleNode) {
          this.addShowUICount("offlineBundle");
          this.offlineBundleNode.active = true;
          self.offlineBundleNode.getComponent("OfflineBundle").showUI(_sale);
          this.offlineBundleNode.zIndex = uiConfig.offlineBundle.Layer;
        } else {
          this.offlineBundleNode = null;
          this.showLoading();
          cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.offlineBundle.Name, cc.Prefab, function(errmsg, prefab) {
            if (errmsg) {
              cc.error(errmsg.message || errmsg);
              return;
            }
            self.addShowUICount("offlineBundle");
            self.hideLoading();
            self.offlineBundleNode = cc.instantiate(prefab);
            self.offlineBundleNode.parent = self.uiRoot;
            self.offlineBundleNode.active = true;
            self.offlineBundleNode.getComponent("OfflineBundle").showUI(_sale);
            self.offlineBundleNode.zIndex = uiConfig.offlineBundle.Layer;
          });
        }
      },
      openUnlockAllBundle: function openUnlockAllBundle() {
        cc.Mgr.AudioMgr.playSFX("click");
        if (cc.Mgr.game.needGuide) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("need-to-complete-guide"), "", this.uiRoot);
          return;
        }
        this.clearPrompt();
        var self = this;
        if (this.unlockAllBundleNode) {
          this.addShowUICount("unlockAllBundle");
          this.unlockAllBundleNode.active = true;
          self.unlockAllBundleNode.getComponent("UnlockAllBundle").showUI();
          this.unlockAllBundleNode.zIndex = uiConfig.unlockAllBundle.Layer;
        } else {
          this.unlockAllBundleNode = null;
          this.showLoading();
          cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.unlockAllBundle.Name, cc.Prefab, function(errmsg, prefab) {
            if (errmsg) {
              cc.error(errmsg.message || errmsg);
              return;
            }
            self.addShowUICount("unlockAllBundle");
            self.hideLoading();
            self.unlockAllBundleNode = cc.instantiate(prefab);
            self.unlockAllBundleNode.parent = self.uiRoot;
            self.unlockAllBundleNode.active = true;
            self.unlockAllBundleNode.getComponent("UnlockAllBundle").showUI();
            self.unlockAllBundleNode.zIndex = uiConfig.unlockAllBundle.Layer;
          });
        }
      },
      openRemoveAdBundle: function openRemoveAdBundle() {
        cc.Mgr.AudioMgr.playSFX("click");
        if (cc.Mgr.game.needGuide) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("need-to-complete-guide"), "", this.uiRoot);
          return;
        }
        this.clearPrompt();
        var self = this;
        if (this.removeAdBundleNode) {
          this.addShowUICount("removeAdBundle");
          this.removeAdBundleNode.active = true;
          self.removeAdBundleNode.getComponent("RemoveAdBundle").showUI();
          this.removeAdBundleNode.zIndex = uiConfig.removeAdBundle.Layer;
        } else {
          this.removeAdBundleNode = null;
          this.showLoading();
          cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.removeAdBundle.Name, cc.Prefab, function(errmsg, prefab) {
            if (errmsg) {
              cc.error(errmsg.message || errmsg);
              return;
            }
            self.addShowUICount("removeAdBundle");
            self.hideLoading();
            self.removeAdBundleNode = cc.instantiate(prefab);
            self.removeAdBundleNode.parent = self.uiRoot;
            self.removeAdBundleNode.active = true;
            self.removeAdBundleNode.getComponent("RemoveAdBundle").showUI();
            self.removeAdBundleNode.zIndex = uiConfig.removeAdBundle.Layer;
          });
        }
      },
      openSpecialGridBundle: function openSpecialGridBundle(_sale) {
        cc.Mgr.AudioMgr.playSFX("click");
        if (cc.Mgr.game.needGuide) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("need-to-complete-guide"), "", this.uiRoot);
          return;
        }
        this.clearPrompt();
        var self = this;
        if (this.specialGridBundleNode) {
          this.addShowUICount("specialGrid");
          this.specialGridBundleNode.active = true;
          self.specialGridBundleNode.getComponent("SpecialGridBundle").showUI(_sale);
          this.specialGridBundleNode.zIndex = uiConfig.specialGridBundle.Layer;
        } else {
          this.specialGridBundleNode = null;
          this.showLoading();
          cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.specialGridBundle.Name, cc.Prefab, function(errmsg, prefab) {
            if (errmsg) {
              cc.error(errmsg.message || errmsg);
              return;
            }
            self.addShowUICount("specialGrid");
            self.hideLoading();
            self.specialGridBundleNode = cc.instantiate(prefab);
            self.specialGridBundleNode.parent = self.uiRoot;
            self.specialGridBundleNode.active = true;
            self.specialGridBundleNode.getComponent("SpecialGridBundle").showUI(_sale);
            self.specialGridBundleNode.zIndex = uiConfig.specialGridBundle.Layer;
          });
        }
      },
      openSignUI: function openSignUI() {
        cc.Mgr.AudioMgr.playSFX("click");
        if (cc.Mgr.game.needGuide) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("need-to-complete-guide"), "", this.uiRoot);
          return;
        }
        this.clearPrompt();
        var self = this;
        if (this.signUINode) {
          this.addShowUICount("sign");
          this.signUINode.active = true;
          this.signUINode.getComponent("signUI").showUI();
          this.signUINode.zIndex = uiConfig.signUI.Layer;
        } else {
          this.signUINode = null;
          this.showLoading();
          cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.signUI.Name, cc.Prefab, function(errmsg, prefab) {
            if (errmsg) {
              cc.error(errmsg.message || errmsg);
              return;
            }
            self.addShowUICount("sign");
            self.hideLoading();
            self.signUINode = cc.instantiate(prefab);
            self.signUINode.parent = self.uiRoot;
            self.signUINode.active = true;
            self.signUINode.getComponent("signUI").showUI();
            self.signUINode.zIndex = uiConfig.signUI.Layer;
          });
        }
      },
      openMissionUI: function openMissionUI() {
        cc.Mgr.AudioMgr.playSFX("click");
        if (cc.Mgr.game.needGuide) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("need-to-complete-guide"), "", this.uiRoot);
          return;
        }
        this.clearPrompt();
        var self = this;
        if (this.missionUINode) {
          this.addShowUICount("mission");
          this.missionUINode.active = true;
          this.missionUINode.getComponent("missionUI").showUI();
          this.missionUINode.zIndex = uiConfig.missionUI.Layer;
        } else {
          this.missionUINode = null;
          this.showLoading();
          cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.missionUI.Name, cc.Prefab, function(errmsg, prefab) {
            if (errmsg) {
              cc.error(errmsg.message || errmsg);
              return;
            }
            self.addShowUICount("mission");
            self.hideLoading();
            self.missionUINode = cc.instantiate(prefab);
            self.missionUINode.parent = self.uiRoot;
            self.missionUINode.active = true;
            self.missionUINode.getComponent("missionUI").showUI();
            self.missionUINode.zIndex = uiConfig.missionUI.Layer;
          });
        }
      },
      openPaymentUI: function openPaymentUI(_isPayment) {
        cc.Mgr.AudioMgr.playSFX("click");
        if (cc.Mgr.game.needGuide) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("need-to-complete-guide"), "", this.uiRoot);
          return;
        }
        this.clearPrompt();
        var self = this;
        if (this.paymentUINode) {
          this.addShowUICount("payment");
          this.paymentUINode.active = true;
          this.paymentUINode.getComponent("PaymentUI").showUI(_isPayment);
          this.paymentUINode.zIndex = uiConfig.paymentUI.Layer;
        } else {
          this.paymentUINode = null;
          this.showLoading();
          cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.paymentUI.Name, cc.Prefab, function(errmsg, prefab) {
            if (errmsg) {
              cc.error(errmsg.message || errmsg);
              return;
            }
            self.addShowUICount("payment");
            self.hideLoading();
            self.paymentUINode = cc.instantiate(prefab);
            self.paymentUINode.parent = self.uiRoot;
            self.paymentUINode.active = true;
            self.paymentUINode.getComponent("PaymentUI").showUI(_isPayment);
            self.paymentUINode.zIndex = uiConfig.paymentUI.Layer;
          });
        }
      },
      openMaxLevelUI: function openMaxLevelUI() {
        cc.Mgr.AudioMgr.playSFX("click");
        if (cc.Mgr.game.needGuide) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("need-to-complete-guide"), "", this.uiRoot);
          return;
        }
        this.clearPrompt();
        var self = this;
        if (this.maxLevelNode) {
          this.addShowUICount("maxLevel");
          this.maxLevelNode.active = true;
          this.maxLevelNode.getComponent("MaxLevel").showUI();
          this.maxLevelNode.zIndex = uiConfig.maxLevel.Layer;
        } else {
          this.maxLevelNode = null;
          this.showLoading();
          cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.maxLevel.Name, cc.Prefab, function(errmsg, prefab) {
            if (errmsg) {
              cc.error(errmsg.message || errmsg);
              return;
            }
            self.addShowUICount("maxLevel");
            self.hideLoading();
            self.maxLevelNode = cc.instantiate(prefab);
            self.maxLevelNode.parent = self.uiRoot;
            self.maxLevelNode.active = true;
            self.maxLevelNode.getComponent("MaxLevel").showUI();
            self.maxLevelNode.zIndex = uiConfig.maxLevel.Layer;
          });
        }
      },
      openUpdateAvailable: function openUpdateAvailable() {
        cc.Mgr.AudioMgr.playSFX("click");
        this.clearPrompt();
        var self = this;
        if (this.updateAvailableNode) {
          this.addShowUICount("updateAvailable");
          this.updateAvailableNode.active = true;
          this.updateAvailableNode.getComponent("UpdateAvailable").showUI();
          this.updateAvailableNode.zIndex = uiConfig.updateAvailable.Layer;
        } else {
          this.updateAvailableNode = null;
          this.showLoading();
          cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.updateAvailable.Name, cc.Prefab, function(errmsg, prefab) {
            if (errmsg) {
              cc.error(errmsg.message || errmsg);
              return;
            }
            self.addShowUICount("updateAvailable");
            self.hideLoading();
            self.updateAvailableNode = cc.instantiate(prefab);
            self.updateAvailableNode.parent = self.uiRoot;
            self.updateAvailableNode.active = true;
            self.updateAvailableNode.getComponent("UpdateAvailable").showUI();
            self.updateAvailableNode.zIndex = uiConfig.updateAvailable.Layer;
          });
        }
      },
      openEnjoyNature: function openEnjoyNature() {
        cc.Mgr.AudioMgr.playSFX("click");
        if (cc.Mgr.game.needGuide) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("need-to-complete-guide"), "", this.uiRoot);
          return;
        }
        this.clearPrompt();
        var self = this;
        if (this.enjoyNatureNode) {
          this.addShowUICount("enjoyNature");
          this.enjoyNatureNode.active = true;
          this.enjoyNatureNode.getComponent("EnjoyNature").showUI();
          this.enjoyNatureNode.zIndex = uiConfig.enjoyNature.Layer;
        } else {
          this.enjoyNatureNode = null;
          this.showLoading();
          cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.enjoyNature.Name, cc.Prefab, function(errmsg, prefab) {
            if (errmsg) {
              cc.error(errmsg.message || errmsg);
              return;
            }
            self.addShowUICount("enjoyNature");
            self.hideLoading();
            self.enjoyNatureNode = cc.instantiate(prefab);
            self.enjoyNatureNode.parent = self.uiRoot;
            self.enjoyNatureNode.active = true;
            self.enjoyNatureNode.getComponent("EnjoyNature").showUI();
            self.enjoyNatureNode.zIndex = uiConfig.enjoyNature.Layer;
          });
        }
      },
      openVipUI: function openVipUI(_from) {
        cc.Mgr.AudioMgr.playSFX("click");
        if (cc.Mgr.game.needGuide) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("need-to-complete-guide"), "", this.uiRoot);
          return;
        }
        this.clearPrompt();
        var self = this;
        if (this.vipNode) {
          this.addShowUICount("vip");
          this.vipNode.active = true;
          this.vipNode.getComponent("Vip").showUI(_from);
          this.vipNode.zIndex = uiConfig.vipUI.Layer;
        } else {
          this.vipNode = null;
          this.showLoading();
          cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.vipUI.Name, cc.Prefab, function(errmsg, prefab) {
            if (errmsg) {
              cc.error(errmsg.message || errmsg);
              return;
            }
            self.addShowUICount("vip");
            self.hideLoading();
            self.vipNode = cc.instantiate(prefab);
            self.vipNode.parent = self.uiRoot;
            self.vipNode.active = true;
            self.vipNode.getComponent("Vip").showUI(_from);
            self.vipNode.zIndex = uiConfig.vipUI.Layer;
          });
        }
      },
      openOfflineAssetsUI: function openOfflineAssetsUI(num) {
        cc.Mgr.AudioMgr.playSFX("click");
        if (cc.Mgr.game.needGuide) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("need-to-complete-guide"), "", this.uiRoot);
          return;
        }
        this.clearPrompt();
        var self = this;
        if (this.offlineAssetUINode) {
          this.addShowUICount("offlineAssets");
          this.offlineAssetUINode.active = true;
          this.offlineAssetUINode.getComponent("offlineAssetUI").showUI(num);
          this.offlineAssetUINode.zIndex = uiConfig.offlineAssetUI.Layer;
        } else {
          this.offlineAssetUINode = null;
          this.showLoading();
          cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.offlineAssetUI.Name, cc.Prefab, function(errmsg, prefab) {
            if (errmsg) {
              cc.error(errmsg.message || errmsg);
              return;
            }
            self.addShowUICount("offlineAssets");
            self.hideLoading();
            self.offlineAssetUINode = cc.instantiate(prefab);
            self.offlineAssetUINode.parent = self.uiRoot;
            self.offlineAssetUINode.active = true;
            self.offlineAssetUINode.getComponent("offlineAssetUI").showUI(num);
            self.offlineAssetUINode.zIndex = uiConfig.offlineAssetUI.Layer;
          });
        }
      },
      openShareUI: function openShareUI() {
        cc.Mgr.AudioMgr.playSFX("click");
        if (cc.Mgr.game.needGuide) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("need-to-complete-guide"), "", this.uiRoot);
          return;
        }
        this.clearPrompt();
        var self = this;
        if (this.shareUINode) {
          this.addShowUICount("shareUI");
          this.shareUINode.active = true;
          this.shareUINode.getComponent("shareUI").showUI();
          this.shareUINode.zIndex = uiConfig.shareUI.Layer;
        } else {
          this.shareUINode = null;
          this.showLoading();
          cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.shareUI.Name, cc.Prefab, function(errmsg, prefab) {
            if (errmsg) {
              cc.error(errmsg.message || errmsg);
              return;
            }
            self.addShowUICount("offlineAssets");
            self.hideLoading();
            self.shareUINode = cc.instantiate(prefab);
            self.shareUINode.parent = self.uiRoot;
            self.shareUINode.active = true;
            self.shareUINode.getComponent("shareUI").showUI();
            self.shareUINode.zIndex = uiConfig.shareUI.Layer;
          });
        }
      },
      openGameInUI: function openGameInUI(callback) {
        void 0 === callback && (callback = null);
        this.callback = callback;
        var self = this;
        cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.gameInUI.Name, cc.Prefab, function(errmsg, prefab) {
          if (errmsg) {
            cc.error(errmsg.message || errmsg);
            return;
          }
          self.GameInUINode = cc.instantiate(prefab);
          self.GameInUINode.parent = self.uiRoot;
          self.GameInUINode.active = true;
          self.GameInUINode.getComponent("InGameUI").init();
          self.GameInUINode.zIndex = uiConfig.gameInUI.Layer;
          self.callback && self.callback();
        });
      },
      showJibEffect: function showJibEffect(_flyout) {
        var self = this;
        cc.loader.loadRes("prefab/uiPrefab/jinbis", function(errmsg, prefab) {
          if (errmsg) {
            cc.error(errmsg.message || errmsg);
            return;
          }
          var jinbis = cc.instantiate(prefab);
          jinbis.parent = self.uiRoot;
          jinbis.zIndex = uiConfig.jinbi.Layer;
          jinbis.getComponent("jinbiCtrl").showUI(_flyout);
        });
      },
      showGemsEffect: function showGemsEffect(_flyout) {
        var self = this;
        cc.loader.loadRes("prefab/uiPrefab/gems", function(errmsg, prefab) {
          if (errmsg) {
            cc.error(errmsg.message || errmsg);
            return;
          }
          var jinbis = cc.instantiate(prefab);
          jinbis.parent = self.uiRoot;
          jinbis.zIndex = uiConfig.jinbi.Layer;
          jinbis.getComponent("jinbiCtrl").showUI(_flyout);
        });
      },
      openGuide: function openGuide() {
        var self = this;
        cc.loader.loadRes("prefab/uiPrefab/Guides", function(errmsg, prefab) {
          if (errmsg) {
            cc.error(errmsg.message || errmsg);
            return;
          }
          var jinbis = cc.instantiate(prefab);
          jinbis.parent = self.uiRoot;
          self.guideNode = jinbis;
        });
      },
      openUavUI: function openUavUI(_isInvite, _photo, _playerId) {
        cc.Mgr.AudioMgr.playSFX("click");
        var self = this;
        this.clearPrompt();
        if (this.uavUINode) {
          this.addShowUICount("uav");
          this.uavUINode.active = true;
          this.uavUINode.getComponent("uavUI").showUI(_isInvite, _photo, _playerId);
          this.uavUINode.zIndex = uiConfig.uavUI.Layer;
        } else {
          this.uavUINode = null;
          this.showLoading();
          cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.uavUI.Name, cc.Prefab, function(errmsg, prefab) {
            if (errmsg) {
              cc.error(errmsg.message || errmsg);
              return;
            }
            self.addShowUICount("uav");
            self.hideLoading();
            self.uavUINode = cc.instantiate(prefab);
            self.uavUINode.parent = self.uiRoot;
            self.uavUINode.active = true;
            self.uavUINode.getComponent("uavUI").showUI(_isInvite, _photo, _playerId);
            self.uavUINode.zIndex = uiConfig.uavUI.Layer;
          });
        }
      },
      openCompensationUI: function openCompensationUI(_data) {
        cc.Mgr.AudioMgr.playSFX("click");
        var self = this;
        this.clearPrompt();
        if (this.compensationUINode) {
          this.addShowUICount("compensation");
          this.compensationUINode.active = true;
          this.compensationUINode.getComponent("Compensation").showUI(_data);
          this.compensationUINode.zIndex = uiConfig.compensationUI.Layer;
        } else {
          this.compensationUINode = null;
          this.showLoading();
          cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.compensationUI.Name, cc.Prefab, function(errmsg, prefab) {
            if (errmsg) {
              cc.error(errmsg.message || errmsg);
              return;
            }
            self.addShowUICount("compensation");
            self.hideLoading();
            self.compensationUINode = cc.instantiate(prefab);
            self.compensationUINode.parent = self.uiRoot;
            self.compensationUINode.active = true;
            self.compensationUINode.getComponent("Compensation").showUI(_data);
            self.compensationUINode.zIndex = uiConfig.compensationUI.Layer;
          });
        }
      },
      gemNum: function gemNum() {
        var costGem1 = [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 20 ];
        return costGem1[cc.Mgr.game.currentExchangeCount];
      },
      getCoinNumber: function getCoinNumber() {
        var shopSortDt = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.ShopData, cc.Mgr.game.plantMaxLv);
        var index = 0;
        var plantIds = {};
        var index = 0;
        var i = 0;
        for (var key in shopSortDt) {
          var dt = shopSortDt[key];
          if (dt == MyEnum.ShopItemType.Money) {
            plantIds[i] = cc.Mgr.game.plantMaxLv - index + 1;
            i++;
          }
          index++;
        }
        if (!plantIds[0] || !plantIds[1]) {
          plantIds[0] = 2;
          plantIds[1] = 1;
        }
        var buyNum = cc.Mgr.game.plantBuyRecord[plantIds[0]];
        var price1 = cc.Mgr.game.caculatePlantPrice(plantIds[0], buyNum);
        var buyNum = cc.Mgr.game.plantBuyRecord[plantIds[1]];
        var price2 = cc.Mgr.game.caculatePlantPrice(plantIds[1], buyNum);
        var plantData1 = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData, plantIds[0]);
        var plantData2 = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData, plantIds[1]);
        var currentGems = 30;
        plantData1.gem > 0 && plantData2.gem > 0 && (currentGems = plantData1.gem + plantData2.gem);
        var price = 0;
        price = (price1 + price2) / BigInt(currentGems);
        return price;
      },
      openExchangeCoinUI: function openExchangeCoinUI(_prompt) {
        var needGem = this.gemNum();
        if ((needGem > cc.Mgr.game.gems || cc.Mgr.game.currentExchangeCount >= cc.Mgr.game.exchangeCoinConfig.maxExchangeNum) && _prompt) return;
        cc.Mgr.AudioMgr.playSFX("click");
        if (cc.Mgr.game.plantMaxLv < cc.Mgr.game.exchangeCoinConfig.openLevel) {
          this.showPrompt(cc.Mgr.Utils.getTranslation("exchange-tip"), "", this.uiRoot);
          return;
        }
        this.clearPrompt();
        var self = this;
        if (this.exchangeUINode) {
          this.addShowUICount("exchange");
          this.exchangeUINode.active = true;
          this.exchangeUINode.getComponent("exchangeCoinUI").showUI();
          this.exchangeUINode.zIndex = uiConfig.exchangeCoinUI.Layer;
        } else {
          this.exchangeUINode = null;
          this.showLoading();
          cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.exchangeCoinUI.Name, cc.Prefab, function(errmsg, prefab) {
            if (errmsg) {
              cc.error(errmsg.message || errmsg);
              return;
            }
            self.addShowUICount("exchange");
            self.hideLoading();
            self.exchangeUINode = cc.instantiate(prefab);
            self.exchangeUINode.parent = self.uiRoot;
            self.exchangeUINode.active = true;
            self.exchangeUINode.getComponent("exchangeCoinUI").showUI();
            self.exchangeUINode.zIndex = uiConfig.exchangeCoinUI.Layer;
          });
        }
      },
      openPauseUI: function openPauseUI() {
        this.clearPrompt();
        cc.Mgr.AudioMgr.playSFX("click");
        if (cc.Mgr.game.needGuide) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("need-to-complete-guide"), "", this.uiRoot);
          return;
        }
        var self = this;
        if (this.pauseUINode) {
          this.addShowUICount("pause");
          this.pauseUINode.active = true;
          this.pauseUINode.getComponent("PauseUI").showUI();
          this.pauseUINode.zIndex = uiConfig.pauseUI.Layer;
        } else {
          this.pauseUINode = null;
          this.showLoading();
          cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.pauseUI.Name, cc.Prefab, function(errmsg, prefab) {
            if (errmsg) {
              cc.error(errmsg.message || errmsg);
              return;
            }
            self.addShowUICount("pause");
            self.hideLoading();
            self.pauseUINode = cc.instantiate(prefab);
            self.pauseUINode.parent = self.uiRoot;
            self.pauseUINode.active = true;
            self.pauseUINode.getComponent("PauseUI").showUI();
            self.pauseUINode.zIndex = uiConfig.pauseUI.Layer;
          });
        }
      },
      openRecordUI: function openRecordUI() {
        this.clearPrompt();
        cc.Mgr.AudioMgr.playSFX("click");
        var self = this;
        if (this.newRecordUINode) {
          this.addShowUICount("record");
          this.newRecordUINode.active = true;
          this.newRecordUINode.getComponent("newRecordUI").showUI();
          this.newRecordUINode.zIndex = uiConfig.newRecordUI.Layer;
        } else {
          this.newRecordUINode = null;
          cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.newRecordUI.Name, cc.Prefab, function(errmsg, prefab) {
            if (errmsg) {
              cc.error(errmsg.message || errmsg);
              return;
            }
            self.addShowUICount("record");
            self.newRecordUINode = cc.instantiate(prefab);
            self.newRecordUINode.parent = self.uiRoot;
            self.newRecordUINode.active = true;
            self.newRecordUINode.getComponent("newRecordUI").showUI();
            self.newRecordUINode.zIndex = uiConfig.newRecordUI.Layer;
          });
        }
      },
      openRankingUI: function openRankingUI() {
        cc.Mgr.AudioMgr.playSFX("click");
        if (cc.Mgr.game.needGuide) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("need-to-complete-guide"), "", this.uiRoot);
          return;
        }
        this.clearPrompt();
        var self = this;
        if (this.rankingUINode) {
          this.addShowUICount("ranking");
          this.rankingUINode.active = true;
          self.rankingUINode.getComponent("RankingUI").showUI();
          this.rankingUINode.zIndex = uiConfig.rankingUI.Layer;
        } else {
          this.rankingUINode = null;
          this.showLoading();
          cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.rankingUI.Name, cc.Prefab, function(errmsg, prefab) {
            if (errmsg) {
              cc.error(errmsg.message || errmsg);
              return;
            }
            self.addShowUICount("ranking");
            self.hideLoading();
            self.rankingUINode = cc.instantiate(prefab);
            self.rankingUINode.parent = self.uiRoot;
            self.rankingUINode.active = true;
            self.rankingUINode.getComponent("RankingUI").showUI();
            self.rankingUINode.zIndex = uiConfig.rankingUI.Layer;
          });
        }
      },
      openAdsBlocker: function openAdsBlocker(_callback) {
        return;
        var self;
      },
      update: function update() {}
    });
    module.exports = UIMgr;
    cc._RF.pop();
  }, {
    DataType: "DataType",
    EffectType: "EffectType",
    MyEnum: "MyEnum",
    uiConfig: "uiConfig"
  } ],
  UnlockAllBundle: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "75e92PW4Y1CQZwwXMcYEWbI", "UnlockAllBundle");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        content: cc.Node,
        blurBg: cc.Node,
        btnLabel: cc.Label,
        singlePriceLabel: cc.Label,
        desLabel: cc.Label,
        title: cc.Node,
        title_zh: cc.Node,
        title_ja: cc.Node,
        title_ru: cc.Node,
        gemsNode: cc.Node,
        gemsNode_2: cc.Node,
        btn: cc.Node,
        btn_2: cc.Node
      },
      onLoad: function onLoad() {
        this.limitClick = this.node.getComponent("LimitClick");
      },
      start: function start() {
        this.desLabel.string = cc.Mgr.Utils.getTranslation("unlock-all-desc");
        this.title.active = false;
        this.title_zh.active = false;
        this.title_ja.active = false;
        this.title_ru.active = false;
        "Japanese" === cc.Mgr.Config.language ? this.title_ja.active = true : "Simplified Chinese" === cc.Mgr.Config.language || "Traditional Chinese" === cc.Mgr.Config.language ? this.title_zh.active = true : "Russian" === cc.Mgr.Config.language ? this.title_ru.active = true : this.title.active = true;
      },
      showUI: function showUI() {
        this.singlePriceLabel.string = cc.Mgr.payment.priceList[15];
        this.blurBg.opacity = 0;
        this.content.opacity = 0;
        this.content.setScale(.5);
        cc.tween(this.blurBg).to(.05, {
          opacity: 255
        }).call().start();
        cc.tween(this.content).to(.15, {
          opacity: 255,
          scale: 1
        }).start();
        this.gemsNode.active = this.gemsNode_2.active = false;
        this.btn.active = this.btn_2.active = false;
        this.btn.active = true;
        this.gemsNode.active = true;
      },
      onClickClose: function onClickClose() {
        if (false == this.limitClick.clickTime()) return;
        cc.Mgr.AudioMgr.playSFX("click");
        var self = this;
        cc.tween(this.blurBg).to(.15, {
          opacity: 0
        }).start();
        cc.tween(this.content).to(.15, {
          opacity: 0,
          scale: .5
        }).call(function() {
          self.node.active = false;
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount("unlockAllBundle");
      },
      onClickGet: function onClickGet() {
        var _this = this;
        if (false == this.limitClick.clickTime()) return;
        cc.Mgr.payment.purchaseByIndex(15, function() {
          cc.Mgr.plantMgr.unlockAllGrids();
          _this.onClickClose();
        }, cc.Mgr.UIMgr.tipRoot);
      },
      onClickGetByGems: function onClickGetByGems() {
        var _this2 = this;
        if (false == this.limitClick.clickTime()) return;
        if (cc.Mgr.game.gems < 30) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("NoGems"), "gem", this.node);
          setTimeout(function() {
            cc.Mgr.UIMgr.openPaymentUI(true);
            _this2.onClickClose();
          }, 300);
          return;
        }
        cc.Mgr.game.gems -= 30;
        cc.Mgr.plantMgr.unlockAllGrids();
        this.onClickClose();
      }
    });
    cc._RF.pop();
  }, {} ],
  UnlockTip: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7332asFQ5dI7azgohNiqTy+", "UnlockTip");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        desLabel: cc.Label
      },
      start: function start() {
        this.desLabel.string = cc.Mgr.Utils.getTranslation("guide-unlock-tip");
      },
      closeTip: function closeTip() {
        this.node.active = false;
        this.node.destroy();
      }
    });
    cc._RF.pop();
  }, {} ],
  UpdateAvailable: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1aed55OlqNCU41OoraL5fm7", "UpdateAvailable");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        des: cc.Label,
        content: cc.Node,
        blurBg: cc.Node,
        btnLabel: cc.Label,
        btnLabel2: cc.Label,
        title: cc.Node,
        title_zh: cc.Node,
        title_ja: cc.Node,
        title_ru: cc.Node
      },
      start: function start() {
        this.des.string = cc.Mgr.Utils.getTranslation("updateAvailable-tip").format(cc.Mgr.Config.platform);
        this.btnLabel2.string = cc.Mgr.Utils.getTranslation("updateAvailable-update-now");
        this.btnLabel.string = cc.Mgr.Utils.getTranslation("updateAvailable-next-time");
        this.title.active = false;
        this.title_zh.active = false;
        this.title_ja.active = false;
        this.title_ru.active = false;
        "Japanese" === cc.Mgr.Config.language ? this.title_ja.active = true : "Simplified Chinese" === cc.Mgr.Config.language || "Traditional Chinese" === cc.Mgr.Config.language ? this.title_zh.active = true : "Russian" === cc.Mgr.Config.language ? this.title_ru.active = true : this.title.active = true;
      },
      showUI: function showUI() {
        this.blurBg.opacity = 0;
        this.content.opacity = 0;
        this.content.setScale(.5);
        cc.tween(this.blurBg).to(.05, {
          opacity: 255
        }).call().start();
        cc.tween(this.content).to(.15, {
          opacity: 255,
          scale: 1
        }).start();
      },
      closeUI: function closeUI() {
        cc.Mgr.AudioMgr.playSFX("click");
        var self = this;
        cc.tween(this.blurBg).to(.15, {
          opacity: 0
        }).start();
        cc.tween(this.content).to(.15, {
          opacity: 0,
          scale: .5
        }).call(function() {
          self.node.active = false;
          cc.Mgr.game.vipSaleTimer > Date.now() && false === cc.Mgr.game.isVIP ? cc.Mgr.UIMgr.openVipUI("enterGame") : cc.Mgr.GameCenterCtrl.startGame();
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount("updateAvailable");
      }
    });
    cc._RF.pop();
  }, {} ],
  UserDataMgr: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d200aUEaNBB3IdNzh1nSm20", "UserDataMgr");
    "use strict";
    var Config = require("Config");
    var MyEnum = require("MyEnum");
    var UserDataMgr = cc.Class({
      extends: cc.Component,
      properties: {
        jsName: "userdata"
      },
      initData: function initData(_callback) {
        cc.Mgr.initData = false;
        this.callback = _callback;
        if (cc.Mgr.Config.isTelegram) window.Telegram.WebApp.CloudStorage.getItem(this.jsName, function(err, data) {
          if (null == err) {
            var jsonData = null == data || "" == data ? {} : JSON.parse(JSON.stringify(data));
            this.initDataCallback(jsonData);
            this.callback && this.callback();
          } else {
            var storageData = cc.sys.localStorage.getItem(this.jsName);
            storageData = null == storageData || "" == storageData ? {} : JSON.parse(storageData);
            this.initDataCallback(storageData);
            this.callback && this.callback();
          }
        }.bind(this)); else {
          var storageData = cc.sys.localStorage.getItem(this.jsName);
          storageData = null == storageData || "" == storageData ? {} : JSON.parse(storageData);
          this.initDataCallback(storageData);
          this.callback && this.callback();
        }
      },
      initDataCallback: function initDataCallback(storageData) {
        cc.Mgr.AudioMgr.sfxVolume = void 0 == storageData.sfxVolume ? 1 : storageData.sfxVolume;
        cc.Mgr.AudioMgr.bgmVolume = void 0 == storageData.bgmVolume ? 1 : storageData.bgmVolume;
        cc.Mgr.game.needGuide = storageData.needGuide = void 0 == storageData.needGuide || storageData.needGuide;
        cc.Mgr.game.curGuide = storageData.curGuide = void 0 == storageData.curGuide ? 0 : storageData.curGuide;
        if (cc.Mgr.game.curGuide <= 1) {
          cc.Mgr.Config.isTelegram ? window.Telegram.WebApp.CloudStorage.removeItem(this.jsName, function(err, data) {
            null == err && console.log("removed!");
          }.bind(this)) : cc.sys.localStorage.clear();
          cc.Mgr.game.needGuide = storageData.needGuide = void 0 == storageData.needGuide || storageData.needGuide;
          cc.Mgr.game.curGuide = storageData.curGuide = void 0 == storageData.curGuide ? 0 : storageData.curGuide;
        } else 3 == cc.Mgr.game.curGuide && (cc.Mgr.game.needGuide = false);
        cc.Mgr.game.btnTipList = storageData.btnTipList = void 0 == storageData.btnTipList ? [ 0, 0, 0 ] : storageData.btnTipList;
        cc.Mgr.game.isFirstEnter = storageData.isFirstEnter = void 0 == storageData.isFirstEnter || storageData.isFirstEnter;
        cc.Mgr.game.firstTime = storageData.firstTime = void 0 == storageData.firstTime ? cc.Mgr.Utils.GetSysTime() : storageData.firstTime;
        cc.Mgr.game.isPayingUser = storageData.isPayingUser = void 0 != storageData.isPayingUser && storageData.isPayingUser;
        cc.Mgr.game.isZoomIn = storageData.isZoomIn = void 0 == storageData.isZoomIn || storageData.isZoomIn;
        cc.Mgr.game.analytics_isFirst = false;
        if (cc.Mgr.game.isFirstEnter) {
          cc.Mgr.game.analytics_isFirst = true;
          cc.Mgr.game.checkDoubleReward = false;
          cc.Mgr.game.isFirstEnter = false;
          cc.Mgr.game.sendFirstInstall = true;
        } else cc.Mgr.game.checkDoubleReward = !cc.Mgr.game.isPayingUser;
        void 0 == storageData.paymentAdCountList || storageData.paymentAdCountList && storageData.paymentAdCountList.length < 9 ? cc.Mgr.game.paymentAdCountList = [ 1, 1, 1, 2, 2, 2, 3, 3, 3 ] : cc.Mgr.game.paymentAdCountList = storageData.paymentAdCountList;
        cc.Mgr.game.lastNotificationTimer = storageData.lastNotificationTimer = void 0 == storageData.lastNotificationTimer ? 0 : storageData.lastNotificationTimer;
        cc.Mgr.game.notificationIndex = storageData.notificationIndex = void 0 == storageData.notificationIndex ? 0 : storageData.notificationIndex;
        cc.Mgr.game.first_version = storageData.first_version = void 0 == storageData.first_version ? cc.Mgr.Config.version : storageData.first_version;
        cc.Mgr.game.first_internal_version = cc.Mgr.game.first_version;
        cc.Mgr.game.rewarded_ct = storageData.rewarded_ct = void 0 == storageData.rewarded_ct ? 0 : storageData.rewarded_ct;
        cc.Mgr.game.Interstitial_ct = storageData.Interstitial_ct = void 0 == storageData.Interstitial_ct ? 0 : storageData.Interstitial_ct;
        cc.Mgr.game.banner_ct = storageData.banner_ct = void 0 == storageData.banner_ct ? 0 : storageData.banner_ct;
        cc.Mgr.game.gem_gained_total = storageData.gem_gained_total = void 0 == storageData.gem_gained_total ? 0 : storageData.gem_gained_total;
        cc.Mgr.game.isManualSetting_payingUser = storageData.isManualSetting_payingUser = void 0 != storageData.isManualSetting_payingUser && storageData.isManualSetting_payingUser;
        cc.Mgr.game.isVIP = storageData.isVIP = void 0 != storageData.isVIP && storageData.isVIP;
        cc.Mgr.game.vipExpire = storageData.vipExpire = void 0 == storageData.vipExpire ? 0 : storageData.vipExpire;
        cc.Mgr.game.vipStartTimer = storageData.vipStartTimer = void 0 == storageData.vipStartTimer ? 0 : storageData.vipStartTimer;
        cc.Mgr.game.vipDailyBonus = storageData.vipDailyBonus = void 0 == storageData.vipDailyBonus || storageData.vipDailyBonus;
        cc.Mgr.game.paymentAdCount = storageData.paymentAdCount = storageData.paymentAdCount || 5;
        cc.Mgr.game.level = storageData.level = storageData.level || 1;
        cc.Mgr.game.lastShareOpen = storageData.lastShareOpen = storageData.lastShareOpen || 0;
        cc.Mgr.game.compensation = storageData.compensation = void 0 == storageData.compensation ? {} : storageData.compensation;
        void 0 == storageData.uavAdsCount ? cc.Mgr.game.level <= 10 ? cc.Mgr.game.uavAdsCount = 5 : cc.Mgr.game.level <= 20 ? cc.Mgr.game.uavAdsCount = 5 : cc.Mgr.game.level <= 30 ? cc.Mgr.game.uavAdsCount = 5 : cc.Mgr.game.level <= 40 ? cc.Mgr.game.uavAdsCount = 5 : (cc.Mgr.game.level <= 50, 
        cc.Mgr.game.uavAdsCount = 5) : cc.Mgr.game.uavAdsCount = storageData.uavAdsCount;
        cc.Mgr.game.uavAdsTimeCount = storageData.uavAdsTimeCount = void 0 == storageData.uavAdsTimeCount ? 0 : storageData.uavAdsTimeCount;
        cc.Mgr.game.needShowUavTip = cc.Mgr.game.level <= 10;
        cc.Mgr.game.needUpdateMoneyInGame = storageData.needUpdateMoneyInGame = void 0 == storageData.needUpdateMoneyInGame || storageData.needUpdateMoneyInGame;
        if (storageData.coin_gained_total) {
          if (true === cc.Mgr.game.needUpdateMoneyInGame) {
            storageData.coin_gained_total = Math.round(storageData.coin_gained_total);
            var moneyString = storageData.coin_gained_total.toLocaleString();
            moneyString = moneyString.replace(/[,]/g, "");
            moneyString.length > 30 && (storageData.coin_gained_total = moneyString.substring(0, 30));
          }
          cc.Mgr.game.coin_gained_total = BigInt(storageData.coin_gained_total);
        } else {
          cc.Mgr.game.coin_gained_total = BigInt(0);
          storageData.coin_gained_total = cc.Mgr.game.coin_gained_total.toString();
        }
        if (storageData.onlineCoinNum) {
          if (true === cc.Mgr.game.needUpdateMoneyInGame) {
            storageData.onlineCoinNum = Math.round(storageData.onlineCoinNum);
            var _moneyString = storageData.onlineCoinNum.toLocaleString();
            _moneyString = _moneyString.replace(/[,]/g, "");
            _moneyString.length > 30 && (storageData.onlineCoinNum = _moneyString.substring(0, 30));
          }
          cc.Mgr.game.onlineCoinNum = BigInt(storageData.onlineCoinNum);
        } else {
          cc.Mgr.game.onlineCoinNum = BigInt(0);
          storageData.onlineCoinNum = cc.Mgr.game.onlineCoinNum.toString();
        }
        if (storageData.money) {
          if (true === cc.Mgr.game.needUpdateMoneyInGame) {
            storageData.money = Math.round(storageData.money);
            var _moneyString2 = storageData.money.toLocaleString();
            _moneyString2 = _moneyString2.replace(/[,]/g, "");
            _moneyString2.length > 30 && (storageData.money = _moneyString2.substring(0, 30));
            cc.Mgr.game.needUpdateMoneyInGame = false;
          }
          cc.Mgr.game.money = BigInt(storageData.money);
        } else {
          cc.Mgr.game.money = Config.initMoney;
          storageData.money = cc.Mgr.game.money.toString();
        }
        cc.Mgr.game.gems = storageData.gems = storageData.gems || 0;
        cc.Mgr.game.spinADResetTime = storageData.spinADResetTime = storageData.spinADResetTime || 0;
        cc.Mgr.game.spinADTimeCount = storageData.spinADTimeCount = storageData.spinADTimeCount || 0;
        cc.Mgr.game.plantMaxLv = storageData.plantMaxLv = storageData.plantMaxLv || 1;
        cc.Mgr.game.lastAdsGetPlantTime = storageData.lastAdsGetPlantTime = storageData.lastAdsGetPlantTime || 0;
        cc.Mgr.game.tipBuyTimes = storageData.tipBuyTimes = storageData.tipBuyTimes || 0;
        cc.Mgr.game.needShowExchangeCoinCount = storageData.needShowExchangeCoinCount = storageData.needShowExchangeCoinCount || 0;
        cc.Mgr.game.currentExchangeCount = storageData.currentExchangeCount = storageData.currentExchangeCount || 0;
        cc.Mgr.game.unlockSpecialGrid = storageData.unlockSpecialGrid = void 0 != storageData.unlockSpecialGrid && storageData.unlockSpecialGrid;
        cc.Mgr.game.removeAd = storageData.removeAd = void 0 != storageData.removeAd && storageData.removeAd;
        cc.Mgr.game.offlineDouble = storageData.offlineDouble = void 0 != storageData.offlineDouble && storageData.offlineDouble;
        cc.Mgr.game.session_ct = storageData.session_ct = void 0 == storageData.session_ct ? 0 : storageData.session_ct;
        cc.Mgr.game.session_ct++;
        cc.Mgr.game.ltv = storageData.ltv = void 0 == storageData.ltv ? 0 : storageData.ltv;
        cc.Mgr.game.showStarterBundleEffectFlag = storageData.showStarterBundleEffectFlag = void 0 != storageData.showStarterBundleEffectFlag;
        cc.Mgr.game.first_daily = storageData.first_daily = void 0 == storageData.first_daily || storageData.first_daily;
        cc.Mgr.game.hasShowLevel8 = storageData.hasShowLevel8 = void 0 != storageData.hasShowLevel8 && storageData.hasShowLevel8;
        cc.Mgr.game.hasShowLevel14 = storageData.hasShowLevel14 = void 0 != storageData.hasShowLevel14 && storageData.hasShowLevel14;
        cc.Mgr.game.hasShowLevel28 = storageData.hasShowLevel28 = void 0 != storageData.hasShowLevel28 && storageData.hasShowLevel28;
        cc.Mgr.game.rateState = storageData.rateState = void 0 == storageData.rateState ? 0 : storageData.rateState;
        cc.Mgr.game.hasShowRate = storageData.hasShowRate = void 0 != storageData.hasShowRate && storageData.rateState;
        storageData.plantBuyRecord || cc.Mgr.game.resetplantBuyRecord();
        cc.Mgr.game.plantBuyRecord = storageData.plantBuyRecord = storageData.plantBuyRecord || cc.Mgr.game.plantBuyRecord;
        if (storageData.dailyMissions) {
          var offset = Config.missionDataList.length - storageData.dailyMissions.length;
          var startIndex = storageData.dailyMissions.length;
          if (offset > 0) for (var _i = 0; _i < offset; _i++) {
            var _missionData = Config.missionDataList[startIndex];
            var _dt = {};
            _dt.id = _missionData.id;
            _dt.checkType = _missionData.checkType;
            _dt.misType = _missionData.misType;
            _dt.checkNum = _missionData.checkNum;
            _dt.progress = _missionData.progress;
            _dt.checklv = null == _missionData.checklv || "" == _missionData.checklv ? 0 : _missionData.checklv;
            _dt.rewardType = _missionData.rewardType;
            _dt.claimed = 0;
            storageData.dailyMissions.push(_dt);
            startIndex++;
          }
        } else {
          storageData.dailyMissions = [];
          for (var i = 0; i < Config.missionDataList.length; i++) {
            var missionData = Config.missionDataList[i];
            var dt = {};
            dt.id = missionData.id;
            dt.checkType = missionData.checkType;
            dt.misType = missionData.misType;
            dt.checkNum = missionData.checkNum;
            dt.progress = missionData.progress;
            dt.checklv = null == missionData.checklv || "" == missionData.checklv ? 0 : missionData.checklv;
            dt.rewardType = missionData.rewardType;
            dt.claimed = 0;
            storageData.dailyMissions.push(dt);
          }
        }
        cc.Mgr.game.dailyMissions = storageData.dailyMissions;
        if (storageData.achievementProgress) {
          var _offset = Config.achieveDataList.length - storageData.achievementProgress.length;
          var _startIndex = storageData.achievementProgress.length;
          if (_offset > 0) for (var _i3 = 0; _i3 < _offset; _i3++) {
            var _achieveData = Config.achieveDataList[_startIndex];
            var _dt3 = {};
            _dt3.id = _achieveData.id;
            _dt3.checkType = _achieveData.checkType;
            _dt3.level = _achieveData.level;
            _dt3.checklv = _achieveData.checklv;
            _dt3.achType = _achieveData.achType;
            _dt3.progress = _achieveData.progress;
            _dt3.finished = 0;
            storageData.achievementProgress.push(_dt3);
            _startIndex++;
          }
        } else {
          storageData.achievementProgress = [];
          for (var _i2 = 0; _i2 < Config.achieveDataList.length; _i2++) {
            var achieveData = Config.achieveDataList[_i2];
            var _dt2 = {};
            _dt2.id = achieveData.id;
            _dt2.checkType = achieveData.checkType;
            _dt2.level = achieveData.level;
            _dt2.checklv = achieveData.checklv;
            _dt2.achType = achieveData.achType;
            _dt2.progress = achieveData.progress;
            _dt2.finished = 0;
            storageData.achievementProgress.push(_dt2);
          }
        }
        cc.Mgr.game.achievementProgress = storageData.achievementProgress;
        this.claimedColumn = storageData.claimedColumn = storageData.claimedColumn || [];
        cc.Mgr.game.dronePot = storageData.dronePot = storageData.dronePot || [];
        cc.Mgr.game.turntablePot = storageData.turntablePot = storageData.turntablePot || [];
        cc.Mgr.game.shopBuyPot = storageData.shopBuyPot = storageData.shopBuyPot || [];
        if (!storageData.plantsOwn) {
          storageData.plantsOwn = [];
          for (var _i4 = 0; _i4 < cc.Mgr.Config.allPlantCount; _i4++) {
            var _dt4 = {};
            _dt4.lv = _i4 + 1;
            _dt4.ownNum = 0;
            storageData.plantsOwn.push(_dt4);
          }
        }
        cc.Mgr.game.plantsOwn = storageData.plantsOwn;
        var plantLevelList = [ 3069e3, 1767e3, 344163, 73785, 10560, 1500, 100, 1, 1, 0, 0, 0, -1 ];
        cc.Mgr.game.hasLockGrid = false;
        if (void 0 == storageData.plantsPK) {
          storageData.plantsPK = [];
          for (var _i5 = 0; _i5 < plantLevelList.length; _i5++) {
            var pk = {};
            var level = plantLevelList[_i5];
            if (level > 1) {
              pk.type = MyEnum.GridState.lock;
              pk.level = level;
            } else if (1 === level) {
              pk.type = MyEnum.GridState.plant;
              pk.level = level;
            } else pk.type = -1 === level ? MyEnum.GridState.vip : MyEnum.GridState.none;
            pk.index = _i5;
            storageData.plantsPK.push(pk);
          }
        } else {
          var result = 0;
          for (var _i6 = 0; _i6 < storageData.plantsPK.length; _i6++) {
            var _pk = storageData.plantsPK[_i6];
            if (_pk.type === MyEnum.GridState.lock) {
              cc.Mgr.game.hasLockGrid = true;
              break;
            }
          }
        }
        cc.Mgr.game.needShowBanner = cc.Mgr.game.plantMaxLv >= 6;
        cc.Mgr.game.needShowInterstitial = cc.Mgr.game.plantMaxLv >= 6;
        cc.Mgr.game.openSpecialGridCount = storageData.openSpecialGridCount = void 0 == storageData.openSpecialGridCount ? 0 : storageData.openSpecialGridCount;
        cc.Mgr.game.openRemoveAdCount = storageData.openRemoveAdCount = void 0 == storageData.openRemoveAdCount ? 0 : storageData.openRemoveAdCount;
        cc.Mgr.game.openRemoveAdCount_interstitial = storageData.openRemoveAdCount_interstitial = void 0 == storageData.openRemoveAdCount_interstitial ? 0 : storageData.openRemoveAdCount_interstitial;
        cc.Mgr.game.specialGridStartTimer = storageData.specialGridStartTimer = void 0 == storageData.specialGridStartTimer ? 0 : storageData.specialGridStartTimer;
        cc.Mgr.game.removeAdStartTimer = storageData.removeAdStartTimer = void 0 == storageData.removeAdStartTimer ? 0 : storageData.removeAdStartTimer;
        cc.Mgr.game.coinBundleStartTimer = storageData.coinBundleStartTimer = void 0 == storageData.coinBundleStartTimer ? 0 : storageData.coinBundleStartTimer;
        cc.Mgr.game.coinBundleFlag = storageData.coinBundleFlag = void 0 == storageData.coinBundleFlag || storageData.coinBundleFlag;
        cc.Mgr.game.coinBundleFlag = true;
        cc.Mgr.game.setLanguageManually = storageData.setLanguageManually = void 0 == storageData.setLanguageManually ? "" : storageData.setLanguageManually;
        cc.Mgr.game.vipSaleTimer = storageData.vipSaleTimer = void 0 == storageData.vipSaleTimer ? 0 : storageData.vipSaleTimer;
        cc.Mgr.game.vipSaleTimer < Date.now() && (cc.Mgr.game.vipSaleTimer = 0);
        if (cc.Mgr.game.vipSaleTimer > 0 || cc.Mgr.game.isVIP) {
          cc.Mgr.game.vipCloseCount = 0;
          cc.Mgr.game.vipEnterGameCount = 0;
        } else {
          cc.Mgr.game.vipCloseCount = storageData.vipCloseCount = void 0 == storageData.vipCloseCount ? 0 : storageData.vipCloseCount;
          cc.Mgr.game.vipEnterGameCount = storageData.vipEnterGameCount = void 0 == storageData.vipEnterGameCount ? 0 : storageData.vipEnterGameCount;
        }
        cc.Mgr.game.plantsPK = storageData.plantsPK;
        if (!storageData.freeFlag) {
          storageData.freeFlag = {};
          storageData.freeFlag.TurnTable = true;
        }
        cc.Mgr.game.freeFlag = storageData.freeFlag;
        storageData.lastPlayTime ? cc.Mgr.game.days_inactive = cc.Mgr.Utils.getDays(cc.Mgr.Utils.GetSysTime()) - cc.Mgr.Utils.getDays(storageData.lastPlayTime) : cc.Mgr.game.days_inactive = 1;
        cc.Mgr.game.days_installed = cc.Mgr.Utils.getDays(cc.Mgr.Utils.GetSysTime()) - cc.Mgr.Utils.getDays(storageData.firstTime);
        this.lastPlayTime = storageData.lastPlayTime = storageData.lastPlayTime || cc.Mgr.Utils.GetSysTime();
        cc.Mgr.game.lastOfflineTime = storageData.lastOfflineTime = void 0 == storageData.lastOfflineTime ? this.lastPlayTime : storageData.lastOfflineTime;
        cc.Mgr.game.days_engaged = storageData.days_engaged = void 0 == storageData.days_engaged ? 1 : storageData.days_engaged;
        cc.Mgr.Utils.getDays(cc.Mgr.Utils.GetSysTime()) - cc.Mgr.Utils.getDays(cc.Mgr.UserDataMgr.lastPlayTime) >= 1 && cc.Mgr.game.days_engaged++;
        cc.Mgr.game.spinUseGemTime = storageData.spinUseGemTime = storageData.spinUseGemTime || 0;
        cc.Mgr.game.lastSignDate = storageData.lastSignDate = storageData.lastSignDate || 0;
        cc.Mgr.game.hasSignDayNum = storageData.hasSignDayNum = storageData.hasSignDayNum || 0;
        cc.Mgr.game.lastInviteDate = storageData.lastInviteDate = storageData.lastInviteDate || 0;
        cc.Mgr.game.doubleBtnIntervalTime = storageData.doubleBtnIntervalTime = storageData.doubleBtnIntervalTime || 0;
        cc.Mgr.game.vipdiscount = storageData.vipdiscount = void 0 == storageData.vipdiscount ? null : storageData.vipdiscount;
        cc.Mgr.game.vipdiscount = true;
        cc.Mgr.game.unlockGridFirst = storageData.unlockGridFirst = void 0 != storageData.unlockGridFirst && storageData.unlockGridFirst;
        cc.Mgr.game.openEggCount = 0;
        cc.Mgr.Config.isTelegram && window.Telegram.WebApp.CloudStorage.setItem(this.jsName, JSON.stringify(storageData), function(err, data) {
          null == err && console.log("saved!");
        }.bind(this));
        cc.sys.localStorage.setItem(this.jsName, JSON.stringify(storageData));
        cc.Mgr.initData = true;
      },
      SaveUserData: function SaveUserData(_recoveryData) {
        if (_recoveryData) {
          cc.Mgr.Config.isTelegram && window.Telegram.WebApp.CloudStorage.setItem(this.jsName, JSON.stringify(_recoveryData), function(err, data) {
            null == err && console.log("saved!");
          }.bind(this));
          cc.sys.localStorage.setItem(this.jsName, JSON.stringify(_recoveryData));
          return;
        }
        var userdata = {};
        userdata.sfxVolume = cc.Mgr.AudioMgr.sfxVolume;
        userdata.bgmVolume = cc.Mgr.AudioMgr.bgmVolume;
        userdata.btnTipList = cc.Mgr.game.btnTipList;
        userdata.curGuide = cc.Mgr.game.curGuide;
        userdata.needGuide = cc.Mgr.game.needGuide;
        userdata.level = cc.Mgr.game.level;
        userdata.isManualSetting_payingUser = cc.Mgr.game.isManualSetting_payingUser;
        userdata.isVIP = cc.Mgr.game.isVIP;
        userdata.vipExpire = cc.Mgr.game.vipExpire;
        userdata.vipStartTimer = cc.Mgr.game.vipStartTimer;
        userdata.vipDailyBonus = cc.Mgr.game.vipDailyBonus;
        userdata.isPayingUser = cc.Mgr.game.isPayingUser;
        userdata.isZoomIn = cc.Mgr.game.isZoomIn;
        userdata.isFirstEnter = cc.Mgr.game.isFirstEnter;
        userdata.paymentAdCount = cc.Mgr.game.paymentAdCount;
        userdata.lastShareOpen = cc.Mgr.game.lastShareOpen;
        userdata.money = cc.Mgr.game.money.toString();
        userdata.gems = cc.Mgr.game.gems;
        userdata.spinADResetTime = cc.Mgr.game.spinADResetTime, userdata.spinADTimeCount = cc.Mgr.game.spinADTimeCount;
        userdata.plantMaxLv = cc.Mgr.game.plantMaxLv;
        userdata.plantBuyRecord = cc.Mgr.game.plantBuyRecord;
        userdata.dailyMissions = cc.Mgr.game.dailyMissions;
        userdata.achievementProgress = cc.Mgr.game.achievementProgress;
        userdata.claimedColumn = this.claimedColumn;
        userdata.needShowExchangeCoinCount = cc.Mgr.game.needShowExchangeCoinCount;
        userdata.currentExchangeCount = cc.Mgr.game.currentExchangeCount;
        userdata.lastOfflineTime = cc.Mgr.game.lastOfflineTime;
        userdata.lastNotificationTimer = cc.Mgr.game.lastNotificationTimer;
        userdata.notificationIndex = cc.Mgr.game.notificationIndex;
        userdata.unlockSpecialGrid = cc.Mgr.game.unlockSpecialGrid;
        userdata.removeAd = cc.Mgr.game.removeAd;
        userdata.offlineDouble = cc.Mgr.game.offlineDouble;
        userdata.uavAdsCount = cc.Mgr.game.uavAdsCount;
        userdata.uavAdsTimeCount = cc.Mgr.game.uavAdsTimeCount;
        userdata.rateState = cc.Mgr.game.rateState;
        userdata.hasShowRate = cc.Mgr.game.hasShowRate;
        userdata.session_ct = cc.Mgr.game.session_ct;
        userdata.ltv = cc.Mgr.game.ltv;
        userdata.days_engaged = cc.Mgr.game.days_engaged;
        userdata.rewarded_ct = cc.Mgr.game.rewarded_ct;
        userdata.Interstitial_ct = cc.Mgr.game.Interstitial_ct;
        userdata.banner_ct = cc.Mgr.game.banner_ct;
        userdata.first_daily = cc.Mgr.game.first_daily;
        userdata.coin_gained_total = cc.Mgr.game.coin_gained_total.toString();
        userdata.gem_gained_total = cc.Mgr.game.gem_gained_total;
        userdata.showStarterBundleEffectFlag = cc.Mgr.game.showStarterBundleEffectFlag;
        userdata.spinUseGemTime = cc.Mgr.game.spinUseGemTime;
        userdata.dronePot = cc.Mgr.game.getDronePot();
        userdata.turntablePot = cc.Mgr.game.getTurntablePot();
        userdata.shopBuyPot = cc.Mgr.game.getShopBuyPot();
        userdata.plantsOwn = cc.Mgr.game.plantsOwn;
        userdata.plantsPK = cc.Mgr.game.getPlantsPK();
        userdata.freeFlag = cc.Mgr.game.freeFlag;
        userdata.lastPlayTime = cc.Mgr.Utils.GetSysTime();
        userdata.lastAdsGetPlantTime = cc.Mgr.game.lastAdsGetPlantTime;
        userdata.tipBuyTimes = cc.Mgr.game.tipBuyTimes;
        userdata.onlineCoinNum = cc.Mgr.game.onlineCoinNum.toString();
        userdata.lastSignDate = cc.Mgr.game.lastSignDate;
        userdata.lastInviteDate = cc.Mgr.game.lastInviteDate;
        userdata.hasSignDayNum = cc.Mgr.game.hasSignDayNum;
        userdata.hasShowLevel8 = cc.Mgr.game.hasShowLevel8;
        userdata.hasShowLevel14 = cc.Mgr.game.hasShowLevel14;
        userdata.hasShowLevel28 = cc.Mgr.game.hasShowLevel28;
        userdata.first_version = cc.Mgr.game.first_version;
        userdata.firstTime = cc.Mgr.game.firstTime;
        userdata.compensation = cc.Mgr.game.compensation;
        userdata.openSpecialGridCount = cc.Mgr.game.openSpecialGridCount;
        userdata.specialGridStartTimer = cc.Mgr.game.specialGridStartTimer;
        userdata.removeAdStartTimer = cc.Mgr.game.removeAdStartTimer;
        userdata.coinBundleStartTimer = cc.Mgr.game.coinBundleStartTimer;
        userdata.coinBundleFlag = cc.Mgr.game.coinBundleFlag;
        userdata.paymentAdCountList = cc.Mgr.game.paymentAdCountList;
        userdata.doubleBtnIntervalTime = cc.Mgr.game.doubleBtnIntervalTime;
        userdata.setLanguageManually = cc.Mgr.game.setLanguageManually;
        userdata.vipSaleTimer = cc.Mgr.game.vipSaleTimer;
        userdata.vipCloseCount = cc.Mgr.game.vipCloseCount;
        userdata.vipEnterGameCount = cc.Mgr.game.vipEnterGameCount;
        userdata.needUpdateMoneyInGame = cc.Mgr.game.needUpdateMoneyInGame;
        userdata.vipdiscount = cc.Mgr.game.vipdiscount;
        userdata.unlockGridFirst = cc.Mgr.game.unlockGridFirst;
        cc.Mgr.Config.isTelegram && window.Telegram.WebApp.CloudStorage.setItem(this.jsName, JSON.stringify(userdata), function(err, data) {
          null == err && console.log("saved!");
        }.bind(this));
        cc.sys.localStorage.setItem(this.jsName, JSON.stringify(userdata));
      }
    });
    module.exports = UserDataMgr;
    cc._RF.pop();
  }, {
    Config: "Config",
    MyEnum: "MyEnum"
  } ],
  Utils: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8fde9BkXa9PRJVejPBOOoTq", "Utils");
    "use strict";
    var DataType = require("DataType");
    var achieveLevelList = [ 4, 7, 11, 15, 19, 23, 27, 31, 35, 39, 43, 47, 51, 55, 59, 63, 67 ];
    var achieveIdList = [ "CgkIooHd4-wCEAIQAQ", "CgkIooHd4-wCEAIQAg", "CgkIooHd4-wCEAIQAw", "CgkIooHd4-wCEAIQBA", "CgkIooHd4-wCEAIQBQ", "CgkIooHd4-wCEAIQBg", "CgkIooHd4-wCEAIQBw", "CgkIooHd4-wCEAIQCA", "CgkIooHd4-wCEAIQCQ", "CgkIooHd4-wCEAIQCg", "CgkIooHd4-wCEAIQCw", "CgkIooHd4-wCEAIQDA", "CgkIooHd4-wCEAIQDQ", "CgkIooHd4-wCEAIQDg", "CgkIooHd4-wCEAIQDw", "CgkIooHd4-wCEAIQEA", "CgkIooHd4-wCEAIQEQ" ];
    var achieveIdList_20 = [ "CgkIooHd4-wCEAIQFA", "CgkIooHd4-wCEAIQFQ", "CgkIooHd4-wCEAIQFg", "CgkIooHd4-wCEAIQFw", "CgkIooHd4-wCEAIQGA", "CgkIooHd4-wCEAIQGQ", "CgkIooHd4-wCEAIQGg", "CgkIooHd4-wCEAIQGw", "CgkIooHd4-wCEAIQHA", "CgkIooHd4-wCEAIQHQ", "CgkIooHd4-wCEAIQHg", "CgkIooHd4-wCEAIQHw", "CgkIooHd4-wCEAIQIA", "CgkIooHd4-wCEAIQIQ", "CgkIooHd4-wCEAIQIg", "CgkIooHd4-wCEAIQIw", "CgkIooHd4-wCEAIQJA" ];
    var achieveIdList_50 = [ "CgkIooHd4-wCEAIQJQ", "CgkIooHd4-wCEAIQJg", "CgkIooHd4-wCEAIQJw", "CgkIooHd4-wCEAIQKA", "CgkIooHd4-wCEAIQKQ", "CgkIooHd4-wCEAIQKg", "CgkIooHd4-wCEAIQKw", "CgkIooHd4-wCEAIQLA", "CgkIooHd4-wCEAIQLQ", "CgkIooHd4-wCEAIQLg", "CgkIooHd4-wCEAIQLw", "CgkIooHd4-wCEAIQMA", "CgkIooHd4-wCEAIQMQ", "CgkIooHd4-wCEAIQMg", "CgkIooHd4-wCEAIQMw", "CgkIooHd4-wCEAIQNA", "CgkIooHd4-wCEAIQNQ" ];
    var achieveIdList_100 = [ "CgkIooHd4-wCEAIQNg", "CgkIooHd4-wCEAIQNw", "CgkIooHd4-wCEAIQOA", "CgkIooHd4-wCEAIQOQ", "CgkIooHd4-wCEAIQOg", "CgkIooHd4-wCEAIQOw", "CgkIooHd4-wCEAIQPA", "CgkIooHd4-wCEAIQPQ", "CgkIooHd4-wCEAIQPg", "CgkIooHd4-wCEAIQPw", "CgkIooHd4-wCEAIQQA", "CgkIooHd4-wCEAIQQQ", "CgkIooHd4-wCEAIQQg", "CgkIooHd4-wCEAIQQw", "CgkIooHd4-wCEAIQRA", "CgkIooHd4-wCEAIQRQ", "CgkIooHd4-wCEAIQRg" ];
    var Utils = cc.Class({
      extends: cc.Component,
      statics: {
        init: function init() {
          String.prototype.format || (String.prototype.format = function() {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function(match, number) {
              return "undefined" != typeof args[number] ? args[number] : "";
            });
          });
        },
        FormatNumToTime: function FormatNumToTime(num, _short) {
          void 0 === _short && (_short = false);
          var hour = Math.floor(num / 3600);
          var min = Math.floor((num - 3600 * hour) / 60);
          var sec = Math.floor(num - 3600 * hour - 60 * min);
          var str1 = hour;
          var str2 = min;
          var str3 = sec;
          hour < 10 && (str1 = "0" + hour);
          min < 10 && (str2 = "0" + min);
          sec < 10 && (str3 = "0" + sec);
          var out = str1 + ":" + str2 + ":" + str3;
          _short && (out = str2 + ":" + str3);
          hour < 1 && (out = str2 + ":" + str3);
          return out;
        },
        GetSysTime: function GetSysTime() {
          return Math.round(Date.now() / 1e3);
        },
        getDays: function getDays(timestamp) {
          var date = Math.floor(timestamp / 3600 / 24);
          return date;
        },
        FormatNum: function FormatNum(num) {
          num += "";
          var str = "";
          for (var i = num.length - 1, j = 1; i >= 0; i--, j++) {
            if (j % 3 == 0 && 0 != i) {
              str += num[i] + ",";
              continue;
            }
            str += num[i];
          }
          var out = str.split("").reverse().join("");
          if ("," == out[0]) return out.splice(0, 1);
          return out;
        },
        getTranslationLocal: function getTranslationLocal(desId) {
          for (var prop in cc.director.NoticeText) if (prop.toString() == desId) return cc.director.NoticeText[prop];
          var des = "\u7ffb\u8bd1\u5b57\u6bb5null";
          return des;
        },
        getTranslation: function getTranslation(desId, param) {
          void 0 === param && (param = []);
          var des = desId;
          var dt = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.Translation, desId);
          if ("" == dt || null == dt) return desId;
          switch (cc.Mgr.Config.language) {
           case "English":
           case "Japanese":
           case "Simplified Chinese":
           case "Traditional Chinese":
           case "Russian":
            des = dt;
          }
          switch (param.length) {
           case 0:
            des = des;
            break;

           case 1:
            des = des.format(param[0]);
            break;

           case 2:
            des = des.format(param[0], param[1]);
            break;

           case 3:
            des = des.format(param[0], param[1], param[2]);
            break;

           case 4:
            des = des.format(param[0], param[1], param[2], param[3]);
            break;

           case 5:
            des = des.format(param[0], param[1], param[2], param[3], param[4]);
          }
          return des;
        },
        decodeUnicode: function decodeUnicode(str) {
          str = str.replace(/\\/g, "%");
          return unescape(str);
        },
        hexToColor: function hexToColor(hex) {
          hex = hex.replace(/^#?/, "0x");
          var c = parseInt(hex);
          var r = c >> 16;
          var g = (65280 & c) >> 8;
          var b = 255 & c;
          return cc.color(r, g, b);
        },
        pAdd: function pAdd(v1, v2) {
          return cc.v2(v1.x + v2.x, v1.y + v2.y);
        },
        pDistance: function pDistance(v1, v2) {
          var dx = Math.abs(v2.x - v1.x);
          var dy = Math.abs(v2.y - v1.y);
          return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        },
        calculateAngle: function calculateAngle(startPos, endPos) {
          var len_y = endPos.y - startPos.y;
          var len_x = endPos.x - startPos.x;
          var tan_yx = Math.abs(len_y / len_x);
          var temp = 180 * Math.atan(tan_yx) / Math.PI;
          var angle = 0;
          len_y > 0 && len_x < 0 ? angle = temp - 90 : len_y > 0 && len_x > 0 ? angle = 90 - temp : len_y < 0 && len_x < 0 ? angle = -temp - 90 : len_y < 0 && len_x > 0 ? angle = temp + 90 : 0 == len_y && 0 != len_x ? angle = len_x < 0 ? -90 : 90 : 0 == len_x && 0 != len_y && (angle = len_y < 0 ? 180 : 0);
          return angle;
        },
        scientificNotationToString: function scientificNotationToString(param) {
          var strParam = String(param);
          var flag = /e/.test(strParam);
          if (!flag) return strParam;
          var sysbol = true;
          /e-/.test(strParam) && (sysbol = false);
          var index = Number(strParam.match(/\d+$/)[0]);
          var basis = strParam.match(/^[\d\.]+/)[0].replace(/\./, "");
          return sysbol ? basis.padEnd(index + 1, 0) : basis.padStart(index + basis.length, 0).replace(/^0/, "0.");
        },
        formatLoclPrice: function formatLoclPrice(_price) {
          _price = _price.split(",").join("");
          var symbol = _price.charAt(0);
          _price = _price.split(symbol).join("");
          var price = parseFloat(_price);
          return symbol + this.getNumStr(price);
        },
        numberFormat2: function numberFormat2(value) {
          var param = {};
          var k = 1e3, sizes = [ "", "K", "M", "G", "T", "P", "E", "Z", "Y", "aa", "bb", "cc", "dd", "ee", "ff", "gg", "hh", "ii", "jj", "kk", "ll", "mm", "nn", "oo", "pp", "qq", "rr", "ss", "tt", "uu", "vv", "ww", "xx", "yy", "zz" ], i;
          if (value.toString().length <= 6) param = this.numberFormat(value.toString()); else {
            i = Math.floor((value.toString().length - 1) / 3);
            param.value = (Number((value * BigInt(100) / BigInt(Math.pow(k, i))).toString()) / 100).toFixed(2);
            param.unit = sizes[i];
          }
          return param;
        },
        getNumStr2: function getNumStr2(num) {
          var numValue = this.numberFormat2(num);
          if ("" === numValue.unit) return "" + numValue.value;
          var numStr = "" + numValue.value;
          var dotIndex = numStr.indexOf(".");
          if (dotIndex >= 0 && 3 !== dotIndex) {
            numStr = numStr.substring(0, 4);
            while (numStr.length > 0) {
              var _char = numStr[numStr.length - 1];
              if ("0" != _char && "." != _char) break;
              numStr = numStr.substring(0, numStr.length - 1);
              if ("." === _char) break;
            }
          } else numStr = numStr.substring(0, 3);
          return numStr + numValue.unit;
        },
        numberFormat: function numberFormat(value) {
          var param = {};
          var k = 1e3, sizes = [ "", "K", "M", "G", "T", "P", "E", "Z", "Y", "aa", "bb", "cc", "dd", "ee", "ff", "gg", "hh", "ii", "jj", "kk", "ll", "mm", "nn", "oo", "pp", "qq", "rr", "ss", "tt", "uu", "vv", "ww", "xx", "yy", "zz" ], i;
          if (value < k) {
            param.value = value;
            param.unit = "";
          } else {
            i = Math.floor(Math.log(value) / Math.log(k));
            param.value = (value / Math.pow(k, i)).toFixed(2);
            param.unit = sizes[i];
          }
          return param;
        },
        getNumStr: function getNumStr(num) {
          var numValue = this.numberFormat(num);
          var numStr = "" + numValue.value;
          var dotIndex = numStr.indexOf(".");
          if (dotIndex >= 0 && 3 !== dotIndex) {
            numStr = numStr.substring(0, 4);
            while (numStr.length > 0) {
              var _char2 = numStr[numStr.length - 1];
              if ("0" != _char2 && "." != _char2) break;
              numStr = numStr.substring(0, numStr.length - 1);
              if ("." === _char2) break;
            }
          } else numStr = numStr.substring(0, 3);
          return numStr + numValue.unit;
        },
        getArrayItems: function getArrayItems(arr, num) {
          var temp_array = new Array();
          for (var index = 0; index < arr.length; index++) temp_array.push(arr[index]);
          var return_array = new Array();
          for (var i = 0; i < num; i++) {
            if (!(temp_array.length > 0)) break;
            var arrIndex = Math.floor(Math.random() * temp_array.length);
            return_array[i] = temp_array[arrIndex];
            temp_array.splice(arrIndex, 1);
          }
          return return_array;
        },
        getArrayItemsAndChangeArr: function getArrayItemsAndChangeArr(temp_array, num) {
          var return_array = new Array();
          for (var i = 0; i < num; i++) {
            if (!(temp_array.length > 0)) break;
            var arrIndex = Math.floor(Math.random() * temp_array.length);
            return_array[i] = temp_array[arrIndex];
            temp_array.splice(arrIndex, 1);
          }
          return return_array;
        },
        dateFormat: function dateFormat(fmt, _date) {
          var ret;
          var date = new Date(1e3 * _date);
          var opt = {
            "Y+": date.getFullYear().toString(),
            "m+": (date.getMonth() + 1).toString(),
            "d+": date.getDate().toString(),
            "H+": date.getHours().toString(),
            "M+": date.getMinutes().toString(),
            "S+": date.getSeconds().toString()
          };
          for (var k in opt) {
            ret = new RegExp("(" + k + ")").exec(fmt);
            ret && (fmt = fmt.replace(ret[1], 1 == ret[1].length ? opt[k] : opt[k].padStart(ret[1].length, "0")));
          }
          return fmt;
        },
        generateUUID: function generateUUID() {
          var s = [];
          var result = "";
          var seed = "0123456789abcdef";
          result = "" !== this.deviceId ? this.deviceId.length > 16 ? this.deviceId.substring(0, 16) : this.deviceId + seed.substring(0, 16 - this.deviceId.length + 1) : seed;
          var hexDigits = result;
          for (var i = 0; i < 36; i++) s[i] = hexDigits.substr(Math.floor(16 * Math.random()), 1);
          s[14] = "4";
          s[19] = hexDigits.substr(3 & s[19] | 8, 1);
          s[8] = s[13] = s[18] = s[23] = "-";
          var uuid = s.join("");
          return uuid;
        },
        copyID: function copyID() {},
        openRating: function openRating() {},
        getDate9: function getDate9(_needTime) {
          var targetTimezone = -9;
          var _dif = new Date().getTimezoneOffset();
          var east9time = new Date().getTime() + 60 * _dif * 1e3 - 60 * targetTimezone * 60 * 1e3;
          var date = new Date(east9time);
          return _needTime ? date.toDateString() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() : date.toDateString();
        },
        uploadAchievment: function uploadAchievment(_id, _level, _count) {
          var index = achieveLevelList.indexOf(_level);
          if (index < 0) return;
          var currentAchieveIdList;
          5 === _count ? currentAchieveIdList = achieveIdList : 20 === _count ? currentAchieveIdList = achieveIdList_20 : 50 === _count ? currentAchieveIdList = achieveIdList_50 : 100 === _count && (currentAchieveIdList = achieveIdList_100);
          var androidID = currentAchieveIdList[index];
          var iosID = 5 === _count ? _id : _id + "_" + _count;
        },
        reportScore: function reportScore(_level) {},
        downloadRanking: function downloadRanking() {},
        getBase64Image: function getBase64Image(_url, _callback) {
          var canvas = document.createElement("CANVAS");
          var ctx = canvas.getContext("2d");
          var img = new Image();
          img.crossOrigin = "Anonymous";
          var url = cc.url.raw(_url);
          img.src = url;
          img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            var photo = new Image();
            photo.crossOrigin = "Anonymous";
            photo.src = Wortal.player.getPhoto();
            photo.onload = function() {
              ctx.drawImage(photo, 64, 185, 620, 620);
              var dataURL = canvas.toDataURL("image/png");
              canvas = null;
              _callback && _callback(dataURL);
            };
          };
        }
      }
    });
    module.exports = Utils;
    cc._RF.pop();
  }, {
    DataType: "DataType"
  } ],
  Vip: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d6b13/s4q5GFrbqCB2ytdsL", "Vip");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        titleLabel: cc.Label,
        btnLabel: cc.Label,
        content: cc.Node,
        blurBg: cc.Node,
        getBtn: cc.Button,
        vipIcon: cc.Node,
        priceLabel: cc.Label,
        priceLabel2: cc.Label,
        tipLabel: cc.Label,
        scrollView: cc.Node,
        policyAndService: cc.Node,
        policyLabel: cc.Label,
        andLabel: cc.Label,
        serviceLabel: cc.Label,
        scrollViewNode: cc.Node,
        recoveryBtnLabel: cc.Label,
        recoveryBtn: cc.Node,
        content_en: cc.Node,
        content_ja: cc.Node,
        content_zh: cc.Node,
        content_ru: cc.Node,
        normaleNode: cc.Node,
        saleNode: cc.Node,
        timeNode: cc.Node,
        timeLabel: cc.Label,
        timeTip: cc.Label,
        weekLabel: cc.Label,
        weekLabel2: cc.Label,
        originalPriceLabel: cc.Label,
        salePriceLabel: cc.Label,
        originalPriceNode: cc.Node,
        lineNode: cc.Node,
        saleLabel: cc.Label
      },
      start: function start() {
        this.titleLabel.string = cc.Mgr.Utils.getTranslation("vip-title");
        this.btnLabel.string = cc.Mgr.Utils.getTranslation("btn-get");
        this.policyLabel.string = cc.Mgr.Utils.getTranslation("policy-label");
        this.andLabel.string = cc.Mgr.Utils.getTranslation("and");
        this.serviceLabel.string = cc.Mgr.Utils.getTranslation("service-label");
        this.recoveryBtnLabel.string = cc.Mgr.Utils.getTranslation("btn-recovery");
        this.timeTip.string = cc.Mgr.Utils.getTranslation("bundle-time-tip");
        this.weekLabel.string = cc.Mgr.Utils.getTranslation("vip-week");
        this.weekLabel2.string = cc.Mgr.Utils.getTranslation("vip-week");
        this.limitClick = this.node.getComponent("LimitClick");
        this.openSpecialCountList = [ 3, 5, 8, 10, 20, 30 ];
        this.content_en.active = false;
        this.content_ja.active = false;
        this.content_zh.active = false;
        this.content_ru.active = false;
        "Japanese" === cc.Mgr.Config.language ? this.content_ja.active = true : "Simplified Chinese" === cc.Mgr.Config.language || "Traditional Chinese" === cc.Mgr.Config.language ? this.content_zh.active = true : "Russian" === cc.Mgr.Config.language ? this.content_ru.active = true : this.content_en.active = true;
      },
      showUI: function showUI(_from) {
        var _this = this;
        this.from = _from;
        this.scrollViewNode.opacity = 0;
        this.blurBg.opacity = 0;
        this.content.opacity = 0;
        this.content.setScale(.5);
        cc.tween(this.blurBg).to(.05, {
          opacity: 255
        }).call().start();
        cc.tween(this.content).to(.15, {
          opacity: 255,
          scale: 1
        }).call(function() {
          cc.tween(_this.scrollViewNode).to(.15, {
            opacity: 255
          }).call().start();
        }).start();
        if (true === cc.Mgr.game.vipdiscount && cc.Mgr.game.vipCloseCount >= 1 && 0 === cc.Mgr.game.vipSaleTimer) {
          cc.Mgr.game.vipCloseCount = 0;
          cc.Mgr.game.vipSaleTimer = Date.now() + 2592e5;
        }
        this.refreshUI();
        this.vipIcon.active = cc.Mgr.game.isVIP;
        cc.Mgr.plantMgr.hideVipTip();
        this.recoveryBtn.active = false;
        this.startTimeCount();
      },
      startTimeCount: function startTimeCount() {
        this.unschedule(this.countTime);
        if (false === this.isSale) return;
        this.seconds = Math.floor((cc.Mgr.game.vipSaleTimer - Date.now()) / 1e3);
        if (this.seconds > 0) {
          this.timeNode.active = true;
          var timeStr = cc.Mgr.Utils.FormatNumToTime(this.seconds);
          this.timeLabel.string = timeStr;
          this.schedule(this.countTime, 1);
        }
      },
      countTime: function countTime() {
        this.seconds -= 1;
        if (this.seconds < 0) {
          this.unschedule(this.countTime);
          this.refreshUI();
          return;
        }
        var timeStr = cc.Mgr.Utils.FormatNumToTime(this.seconds);
        this.timeLabel.string = timeStr;
      },
      refreshUI: function refreshUI() {
        this.isSale = cc.Mgr.game.vipSaleTimer > Date.now();
        var currentPrice, salePrice, currentPriceValue, salePriceValue;
        currentPrice = "$7.99";
        salePrice = "$3.99";
        currentPriceValue = 7.99;
        salePriceValue = 3.99;
        this.saleLabel.string = Math.ceil(salePriceValue / currentPriceValue * 100) + "%OFF";
        this.originalPriceLabel.string = currentPrice;
        if (cc.Mgr.game.isVIP) {
          this.normaleNode.active = false;
          this.saleNode.active = false;
        } else {
          this.normaleNode.active = !this.isSale;
          this.saleNode.active = this.isSale;
        }
        this.salePriceLabel.string = salePrice;
        this.lineNode.width = this.originalPriceNode.width;
        this.priceLabel.string = cc.Mgr.Utils.getTranslation("vip-price").format(currentPrice);
        this.priceLabel2.string = cc.Mgr.Utils.getTranslation("vip-price").format(salePrice);
        this.isSale ? this.tipLabel.string = cc.Mgr.Utils.getTranslation("vip-des").format(salePrice, cc.Mgr.Config.platform, cc.Mgr.Config.platform) : this.tipLabel.string = cc.Mgr.Utils.getTranslation("vip-des").format(currentPrice, cc.Mgr.Config.platform, cc.Mgr.Config.platform);
      },
      onClickRecovery: function onClickRecovery() {
        cc.Mgr.GameCenterCtrl.unscheduleSaveData();
        cc.Mgr.AudioMgr.stopAll();
        cc.Mgr.admob.hideBanner("all");
        cc.game.restart();
      },
      onClickClose: function onClickClose() {
        var _this2 = this;
        cc.Mgr.AudioMgr.playSFX("click");
        var self = this;
        this.scrollViewNode.opacity = 0;
        cc.tween(this.blurBg).to(.15, {
          opacity: 0
        }).start();
        cc.tween(this.content).to(.15, {
          opacity: 0,
          scale: .5
        }).call(function() {
          self.node.active = false;
          if (_this2.showUnlock && "enterGame" !== _this2.from) {
            cc.Mgr.plantMgr.activateSpecialGrid();
            _this2.showUnlock = false;
          } else if ("fort" === _this2.from && false === cc.Mgr.game.isVIP && false === cc.Mgr.game.unlockSpecialGrid) {
            cc.Mgr.game.openSpecialGridCount++;
            var index = _this2.openSpecialCountList.indexOf(cc.Mgr.game.openSpecialGridCount);
            index >= 0 && cc.Mgr.UIMgr.openSpecialGridBundle(true);
          }
          0 === cc.Mgr.game.vipSaleTimer && true === cc.Mgr.game.vipdiscount && cc.Mgr.game.vipCloseCount++;
          "enterGame" === _this2.from && cc.Mgr.GameCenterCtrl.startGame();
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount("vip");
      },
      onClickVIP: function onClickVIP() {
        var _this3 = this;
        if (false == this.limitClick.clickTime()) return;
        cc.Mgr.payment.updateVIPState(Date.now() + 6e5);
        var currentProductId = this.isSale ? 14 : 6;
        cc.Mgr.payment.purchaseByIndex(currentProductId, function() {
          cc.Mgr.game.isVIP = true;
          cc.Mgr.admob.hideBanner("all");
          cc.Mgr.game.vip = "active";
          _this3.updateVip();
          cc.Mgr.game.vipStartTimer = Date.now();
          var data = {};
          data.elapsed = cc.Mgr.Utils.getDate9(true);
          data.state = "subscribed";
          cc.Mgr.analytics.logEvent("vip_subscription", JSON.stringify(data));
        }, this.node);
      },
      updateVip: function updateVip() {
        this.vipIcon.active = cc.Mgr.game.isVIP;
        this.priceLabel.node.active = this.getBtn.node.active = !cc.Mgr.game.isVIP;
        this.showUnlock = cc.Mgr.game.isVIP;
        cc.Mgr.game.isVIP && (this.normaleNode.active = this.saleNode.active = false);
      },
      gotoPolicy: function gotoPolicy() {
        cc.sys.openURL("https://digitalwill.co.jp/privacy-policy/");
      },
      gotoService: function gotoService() {
        cc.sys.openURL("https://digitalwill.co.jp/terms-of-service/");
      }
    });
    cc._RF.pop();
  }, {} ],
  WaterfallFlow: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "250263WJHFKL601wrjygR3l", "WaterfallFlow");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        _curDir: 0,
        _curAppIndex: 0,
        _lastIndex: 0,
        _updateIdx: -1,
        _showIndexArr: [],
        _totalCount: 0,
        _onePageCount: 0,
        _onePageHeight: 0,
        _scrollViewHeight: 0,
        _totalShowCount: 0,
        _oneItemHeight: 0,
        _updateShowCallback: null,
        itemPrefab: cc.Prefab,
        _showItemArr: [],
        _showItemPool: []
      },
      onLoad: function onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMoved, this);
        this.node.on(cc.Node.EventType.MOUSE_WHEEL, this.touchMoved, this);
      },
      touchMoved: function touchMoved(_event) {
        _event.type == cc.Node.EventType.TOUCH_MOVE ? this._curDir = _event.getDeltaY() > 0 ? 1 : -1 : this._curDir = _event.getScrollY() < 0 ? 1 : -1;
      },
      clear: function clear() {
        if (!this.content) return;
        this._curAppIndex = 0;
        this._lastIndex = 0;
        this.content.y = 0;
        this._showIndexArr = [];
        this._showIndexArr.push(this._curAppIndex);
        this._curDir = 0;
        this._updateIdx = -1;
        var item;
        while (this._showItemArr.length > 0) {
          item = this._showItemArr.pop();
          null != item.parent && this.content.removeChild(item);
          this._showItemPool.push(item);
        }
      },
      refreshAtCurPosition: function refreshAtCurPosition() {
        this._refreshAtCurPosition = true;
        this._updateIdx = this._showIndexArr.length > 0 ? this._showIndexArr[0] : 0;
        null != this._updateDataCallback && this._updateDataCallback(this._curAppIndex, this._updateIdx, this._showIndexArr.length);
      },
      setBaseInfo: function setBaseInfo(_totalCount, _onePageCount, _totalShowCount, _oneItemHeight, _updateDataCallback) {
        this._totalCount = _totalCount;
        this._onePageCount = _onePageCount;
        this._scrollViewHeight = this.node.height;
        this.content = this.node.getComponent("cc.ScrollView").content;
        this.content.height = _totalCount * _oneItemHeight;
        this._onePageHeight = this._onePageCount * _oneItemHeight;
        this._totalShowCount = _totalShowCount;
        this._oneItemHeight = _oneItemHeight;
        this._updateDataCallback = _updateDataCallback;
        this._refreshAtCurPosition = false;
      },
      scrollTo: function scrollTo(_index) {
        if (!this.content) return;
        this._curAppIndex = Math.floor(_index / this._onePageCount);
        if (0 === this._curAppIndex) {
          this._updateDataCallback(0);
          return;
        }
        var subIndex = _index % this._onePageCount;
        var targetY = this._curAppIndex * this._onePageHeight - (this._onePageCount - subIndex) * this._oneItemHeight;
        this.content.y = targetY;
        this.content.y < 0 && (this.content.y = 0);
        this._updateIdx = this._curAppIndex - 2;
        this._updateIdx < 0 && (this._updateIdx = 0);
        this._lastIndex = this._updateIdx;
        this._showIndexArr = [ this._updateIdx, this._updateIdx + 1, this._updateIdx + 2 ];
        this._updateDataCallback(this._curAppIndex, this._updateIdx, this._showIndexArr.length);
      },
      update: function update() {
        if (0 == this._curDir || !this.content) return;
        var offsetY = 1 == this._curDir ? this._scrollViewHeight : -1 * this._scrollViewHeight / 2;
        this._curAppIndex = Math.floor((this.content.getPosition().y + offsetY) / this._onePageHeight);
        if (this._curAppIndex * this._onePageCount >= this._totalCount) return;
        if (this._curAppIndex < 0) return;
        if (this._curAppIndex != this._lastIndex && this._showIndexArr.indexOf(this._curAppIndex) < 0) {
          console.log("this.content.getPosition().y: " + this.content.getPosition().y);
          this._showIndexArr.push(this._curAppIndex);
          this._showIndexArr.sort(function(a, b) {
            return a - b;
          });
          this._showIndexArr.length > 3 && (this._curAppIndex > this._lastIndex ? this._showIndexArr.shift() : this._showIndexArr.pop());
          if (null != this._updateDataCallback) {
            this.node.getComponent("cc.ScrollView").stopAutoScroll();
            this._updateDataCallback(this._curAppIndex, this._updateIdx, this._curDir);
          }
          this._lastIndex = this._curAppIndex;
        }
      },
      updateShowList: function updateShowList(_data, _componentName, _context, _needRefresh) {
        var len = _data.length;
        var item;
        var itemStartIndx = -1 == this._updateIdx ? this._curAppIndex : this._updateIdx;
        if (this._showItemArr.length >= this._totalShowCount && false == this._refreshAtCurPosition) {
          var idx = 0;
          var curIdX;
          var startPageCount = 0 == itemStartIndx ? 0 : 1;
          while (idx < this._onePageCount) {
            if (1 == this._curDir) {
              item = this._showItemArr.shift();
              curIdX = true == _needRefresh ? idx + this._onePageCount * startPageCount : idx;
              if (idx < _data.length) {
                item.setPosition(0, -1 * (itemStartIndx * this._onePageHeight + idx * this._oneItemHeight));
                item.getComponent(_componentName).setContent(_data[idx]);
              } else {
                null != item.parent && item.parent.removeChild(item);
                this._showItemPool.push(item);
              }
              this._showItemArr.push(item);
            } else {
              item = this._showItemArr.pop();
              item.setPosition(0, -1 * (itemStartIndx * this._onePageHeight + idx * this._oneItemHeight));
              null == item.parent && this.content.addChild(item);
              item.getComponent(_componentName).setContent(_data[idx]);
              0 == idx ? this._showItemArr.unshift(item) : this._showItemArr.splice(idx, 0, item);
            }
            idx++;
          }
        } else {
          if (true == this._refreshAtCurPosition) {
            var item;
            while (this._showItemArr.length > 0) {
              item = this._showItemArr.pop();
              null != item.parent && _data.length != this._showItemArr.length && this.content.removeChild(item);
              this._showItemPool.push(item);
            }
            this._refreshAtCurPosition = false;
          }
          var maxLen = -1 == this._updateIdx ? this._onePageCount : this._showIndexArr.length * this._onePageCount;
          var curIdX;
          var startPageCount = 0 == itemStartIndx ? 0 : 1;
          for (var i = 0; i < maxLen; i++) {
            item = this._showItemPool.length > 0 ? this._showItemPool.pop() : cc.instantiate(this.itemPrefab);
            item.getComponent(_componentName).setParent(_context);
            curIdX = true == _needRefresh ? i + this._onePageCount * startPageCount : i;
            if (curIdX < _data.length) {
              item.setPosition(0, -1 * (itemStartIndx * this._onePageHeight + i * this._oneItemHeight));
              null == item.parent && this.content.addChild(item);
              item.getComponent(_componentName).setContent(_data[i]);
            } else {
              null != item.parent && item.parent.removeChild(item);
              this._showItemPool.push(item);
            }
            this._showItemArr.push(item);
          }
        }
        if (true == _needRefresh) for (var j = 0; j < this._showItemArr.length; j++) {
          item = this._showItemArr[j];
          item.parent = null;
          if (j < _data.length) {
            item.getComponent(_componentName).setContent(_data[j]);
            null == item.parent && this.content.addChild(item);
          }
        }
        this._updateIdx = -1;
      }
    });
    cc._RF.pop();
  }, {} ],
  ZomBieMgr: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b6ae1gMNYVF6K2jPlzajm7R", "ZomBieMgr");
    "use strict";
    var DataType = require("DataType");
    var Event = require("Event");
    var MyEnum = require("MyEnum");
    var ZombieMgr = cc.Class({
      extends: cc.Component,
      properties: {
        waveZombieCount: 0,
        backToPoolCount: 0,
        shadow: cc.Prefab,
        _zombieIsEscape: false
      },
      statics: {
        instance: null
      },
      onLoad: function onLoad() {},
      start: function start() {
        cc.Mgr.ZombieMgr = this;
        this.zombiesParent = this.node;
        this.isPause = false;
      },
      pause: function pause() {
        if (null == this.currentZombieList) return;
        for (var i = 0; i < this.currentZombieList.length; i++) this.currentZombieList[i].getComponent("zombie").pause();
        this.isPause = true;
        this.timer = Date.now();
        if (this.runningStart) {
          this.runningDuration += Date.now() - this.runningStart;
          this.runningStart = Date.now();
        }
        this.timeoutId && clearTimeout(this.timeoutId);
      },
      resume: function resume() {
        if (null == this.currentZombieList) return;
        var index = 0;
        for (var i = 0; i < this.currentZombieList.length; i++) if (0 == this.currentZombieList[i].getComponent("zombie").posIndex) {
          this.currentZombieList[i].getComponent("zombie").moveToNextPos();
          index++;
        } else this.currentZombieList[i].getComponent("zombie").moveToNextPos();
        this.runningDuration >= this.dt2 ? this.dt = 0 : this.dt = this.dt2 - this.runningDuration;
        this.generateZombies1();
        this.isPause = false;
      },
      InitZombiesMgr: function InitZombiesMgr() {
        this.zombieObjs = {};
      },
      unscheduleCreateZombieForCG: function unscheduleCreateZombieForCG() {
        this.unschedule(this.createZombieTimes);
      },
      getOneWaveZombies: function getOneWaveZombies(lv, wave) {
        var key = lv > 60 ? lv % 60 + "_" + wave : lv + "_" + wave;
        this.lvdt = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.LevelData, key);
        this.zombie1Counts = this.lvdt.zombieCount1;
        this.zombie2Counts = this.lvdt.zombieCount2;
        if (cc.Mgr.game.level > 60) {
          var maxKey = "60_" + wave;
          this.maxLevelData = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.LevelData, maxKey);
        }
        if (cc.Mgr.game.level <= 5) {
          this.attackTipTimeout && clearTimeout(this.attackTipTimeout);
          this.attackTipTimeout = setTimeout(function() {
            cc.Mgr.plantMgr.showLaterTipAttack();
          }, 3);
        }
        this.backToPoolCount = 0;
        this.createZombieCount = 0;
        this.waveZombieCount = this.lvdt.zombieCount1 + this.lvdt.zombieCount2;
        this.dt = 0;
        this.dt2 = 2e3;
        var canPlayZombieSound = true;
        this.zombieZIndex = 100;
        this.moveZIndex = 100;
        this.moveZIndex_2 = -100;
        this.zombieList = [];
        if (canPlayZombieSound) {
          canPlayZombieSound = false;
          cc.Mgr.AudioMgr.playSFX(MyEnum.AudioType.zombie_man);
        }
        this.currentZombieList = [];
        this.generateZombies1();
        this._zombieIsEscape = false;
      },
      generateZombies2: function generateZombies2() {
        if (this.zombie2Counts <= 0) return;
        this.timeoutId = setTimeout(function() {
          if (false == this.isPause && this.zombie2Counts > 0) {
            this.createZombies(this.lvdt.zombieID2, "zombieID2");
            this.zombie2Counts--;
            this.dt = this.dt2;
            this.runningStart = Date.now();
            this.runningDuration = 0;
            this.zombie2Counts > 0 && this.generateZombies2();
          }
        }.bind(this), this.dt);
      },
      generateZombies1: function generateZombies1() {
        if (this.zombie1Counts <= 0) {
          this.generateZombies2();
          return;
        }
        this.timeoutId = setTimeout(function() {
          if (false == this.isPause && this.zombie1Counts > 0) {
            this.createZombies(this.lvdt.zombieID1, "zombieID1");
            console.log("create zombie - " + this.dt);
            this.zombie1Counts--;
            this.dt = this.dt2;
            this.runningStart = Date.now();
            this.runningDuration = 0;
            this.zombie1Counts > 0 ? this.generateZombies1() : this.generateZombies2();
          }
        }.bind(this), this.dt);
      },
      createZombies: function createZombies(id, _zombieIndez) {
        var self = this;
        this.createZombieCount++;
        var data = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.ZombieData, id.toString());
        var currentData = {};
        if (cc.Mgr.game.level > 60) {
          var monsterData = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.ZombieData, this.maxLevelData[_zombieIndez]);
          currentData.id = data.id;
          currentData.hp = monsterData.hp * BigInt(Math.round(Math.pow(2.15, cc.Mgr.game.level % 60)));
          currentData.spd = data.spd;
          currentData.money = monsterData.money * BigInt(Math.round(Math.pow(2.15, cc.Mgr.game.level % 60)));
          currentData.prefab = data.prefab;
          currentData.gender = data.gender;
        } else currentData = data;
        this.zombieObjs[id.toString()] = this.zombieObjs[id.toString()] || [];
        var zomObj = null;
        if (this.zombieObjs[id.toString()].length > 3) {
          zomObj = this.zombieObjs[id.toString()].shift();
          this.currentZombieList.push(zomObj);
          zomObj.parent = this.node;
          zomObj.zIndex = this.zombieZIndex;
          zomObj.active = true;
          var zombieScript = zomObj.getComponent("zombie");
          zombieScript.isSetZIndex = false;
          currentData.id > cc.Mgr.Config.zBossLine || self.createZombieCount == self.waveZombieCount ? zombieScript.init(data, 1.1) : zombieScript.init(currentData);
          zombieScript.moveToNextPos();
          this.zombieZIndex--;
        } else cc.loader.loadRes("prefab/zombiesnew/" + currentData.prefab, function(errmsg, prefab) {
          if (errmsg) {
            cc.error(errmsg.message || errmsg);
            return;
          }
          zomObj = cc.instantiate(prefab);
          self.currentZombieList.push(zomObj);
          zomObj.parent = self.node;
          zomObj.zIndex = self.zombieZIndex;
          zomObj.active = true;
          var zombieScript = zomObj.getComponent("zombie");
          currentData.id > cc.Mgr.Config.zBossLine || self.createZombieCount == self.waveZombieCount ? zombieScript.init(currentData, 1.1, cc.instantiate(self.shadow)) : zombieScript.init(currentData, .9, cc.instantiate(self.shadow));
          zombieScript.moveToNextPos();
          self.zombieZIndex--;
        });
      },
      zombieEscape: function zombieEscape() {
        this._zombieIsEscape = true;
      },
      clearZombiesPool: function clearZombiesPool() {
        this.zombieList = [];
        for (var key in this.zombieObjs) {
          for (var i = 0; i < this.zombieObjs[key].length; i++) this.zombieObjs[key][i].destroy();
          this.zombieObjs[key] = [];
        }
      },
      backToPool: function backToPool(obj, id, hp) {
        void 0 === hp && (hp = 0);
        var lhp = hp || 0;
        obj.active = false;
        obj.parent = null;
        this.zombieObjs[id.toString()].push(obj);
        var index = this.currentZombieList.indexOf(obj);
        this.currentZombieList.splice(index, 1);
        this.backToPoolCount += 1;
        this.backToPoolCount == this.waveZombieCount && this.scheduleOnce(function() {
          cc.director.GlobalEvent.emit(Event.defense, {
            state: !this._zombieIsEscape,
            zhp: lhp
          });
          this.backToPoolCount = 0;
        }, .6);
      }
    });
    module.exports = ZombieMgr;
    cc._RF.pop();
  }, {
    DataType: "DataType",
    Event: "Event",
    MyEnum: "MyEnum"
  } ],
  ZombieData: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "04f933F5qNLo7aVuZQFPjou", "ZombieData");
    "use strict";
    var ZombieData = cc.Class({
      name: "ZombieData",
      properties: {
        id: 0,
        hp: 100,
        spd: 0,
        money: 0,
        prefab: "",
        gender: ""
      }
    });
    module.exports = ZombieData;
    cc._RF.pop();
  }, {} ],
  ZombieMapMgr: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "33dc4CiL0lCtYUxFPR0imk2", "ZombieMapMgr");
    "use strict";
    var ZombieMap = require("db_zombie");
    var ZombieData = require("ZombieData");
    var ZombieMapMgr = cc.Class({
      extends: cc.Component,
      properties: {
        dataList: {
          default: [],
          type: [ ZombieData ]
        }
      },
      DecodeJson: function DecodeJson() {
        var jsonAsset = JSON.parse(ZombieMap.data);
        for (var key in jsonAsset) {
          var dt = new ZombieData();
          dt.id = jsonAsset[key][0];
          dt.hp = BigInt(jsonAsset[key][1]);
          dt.spd = jsonAsset[key][2];
          dt.money = BigInt(jsonAsset[key][3]);
          dt.prefab = jsonAsset[key][4];
          dt.gender = jsonAsset[key][5];
          this.dataList[key] = dt;
        }
      },
      getDataByKey: function getDataByKey(Id) {
        return this.dataList[Id];
      }
    });
    module.exports = ZombieMapMgr;
    cc._RF.pop();
  }, {
    ZombieData: "ZombieData",
    db_zombie: "db_zombie"
  } ],
  achieveItem: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "334e7W+zrZDHrsD+AtXWr48", "achieveItem");
    "use strict";
    var DataType = require("DataType");
    var checkLvNumList = [ 5, 20, 50, 100 ];
    var AchieveType = require("AchieveType");
    var achieveItem = cc.Class({
      extends: cc.Component,
      properties: {
        rewardIcon: cc.Sprite,
        claimBtn: cc.Node,
        proBar: cc.ProgressBar,
        desLbl: cc.Label,
        numLbl: cc.Label,
        sliderLbl: cc.Label,
        rewardNum: 5,
        rewardType: "gem",
        acId: 0,
        receiveBtnLabel: cc.Label
      },
      onLoad: function onLoad() {
        this.limitClick = this.node.getComponent("LimitClick");
      },
      setData: function setData(data) {
        this.acData = data;
        this.acId = data.id;
        this.receiveBtnLabel.string = cc.Mgr.Utils.getTranslation("btn-claim");
        var checkNum = checkLvNumList[data.checklv];
        this.rewardType = "gem";
        var dt = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.AchievementData, data.id);
        var stringContent = data.achType == AchieveType.Invite ? cc.Mgr.Utils.getTranslation("achieveItem-description-2", [ checkNum ]) : cc.Mgr.Utils.getTranslation("achieveItem-description", [ checkNum, dt.Level ]);
        this.desLbl.string = stringContent;
        if (data.achType == AchieveType.Invite) {
          var progressData = cc.Mgr.game.getAchieveDataById(data.id);
          progressData.progress > checkNum && (progressData.progress = checkNum);
          this.proBar.progress = progressData.progress / checkNum;
          progressData.progress < checkNum ? this.claimBtn.active = false : this.claimBtn.active = true;
          this.sliderLbl.string = progressData.progress + "/" + checkNum;
        } else {
          var plantOwnsNum = cc.Mgr.game.getPlantOwnsDataByLv(dt.Level);
          plantOwnsNum > checkNum && (plantOwnsNum = checkNum);
          this.proBar.progress = plantOwnsNum / checkNum;
          this.claimBtn.active = !(plantOwnsNum < checkNum);
          this.sliderLbl.string = plantOwnsNum + "/" + checkNum;
        }
        this.rewardNum = this.checkLvToGainGems(data.id, data.checklv);
        this.numLbl.string = "x" + this.rewardNum;
      },
      checkLvToGainGems: function checkLvToGainGems(id, checklv) {
        var dt = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.AchievementData, id);
        if (0 == checklv) return dt.Gain_5;
        if (1 == checklv) return dt.Gain_20;
        if (2 == checklv) return dt.Gain_50;
        if (3 == checklv) return dt.Gain_100;
        if (4 == checklv) return dt.Gain_200;
      },
      claim: function claim() {
        if (false == this.limitClick.clickTime()) return;
        cc.Mgr.AudioMgr.playSFX("click");
        cc.Mgr.UIMgr.openAssetGetUI(this.rewardType, this.rewardNum, "achieve");
        var data = {};
        data.elapsed = cc.Mgr.Utils.getDate9(true);
        data.rewardCount = this.rewardNum;
        data.rewardID = this.acId;
        cc.Mgr.analytics.logEvent("achieveItem_gain", JSON.stringify(data));
        this.getRewardAndUpdateAchieve();
        cc.Mgr.UIMgr.missionUI.showUI(true);
        4 == this.acData.checklv && (this.node.active = false);
      },
      getRewardAndUpdateAchieve: function getRewardAndUpdateAchieve() {
        cc.Mgr.game.claimAchieveRewardById(this.acId);
      }
    });
    module.exports = achieveItem;
    cc._RF.pop();
  }, {
    AchieveType: "AchieveType",
    DataType: "DataType"
  } ],
  achieveMissonData: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9607aun6k1Nz6/JIbzcJUtk", "achieveMissonData");
    "use strict";
    var achieveMissonData = cc.Class({
      name: "achieveMissonData",
      properties: {
        id: 0,
        checkType: 0,
        misType: 0,
        achType: 0,
        level: 1,
        checkLv: 1,
        checkNum: 5,
        progress: 0
      }
    });
    module.exports = achieveMissonData;
    cc._RF.pop();
  }, {} ],
  angryEffect: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cb68atL+phPoKolRFrMhBzY", "angryEffect");
    "use strict";
    var angryEffect = cc.Class({
      extends: cc.Component,
      properties: {
        angryNode: cc.Node
      },
      changeAngryState: function changeAngryState(beAngry) {
        this.angryNode.active = !!beAngry;
      }
    });
    module.exports = angryEffect;
    cc._RF.pop();
  }, {} ],
  angryUI: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5f39dWdwcRL4Y3fVAf4L7Ir", "angryUI");
    "use strict";
    var tweenTime = .25;
    var angryUI = cc.Class({
      extends: cc.Component,
      properties: {
        angryLeftTimeLbl: cc.Label,
        progressbarMask: cc.Node,
        dragonNode: cc.Node,
        gemLabel: cc.Label,
        adsIconNode: cc.Node,
        freeLabelNode: cc.Label,
        tip_1: cc.Label,
        tip_2: cc.Label,
        title: cc.Label,
        content: cc.Node,
        blurBg: cc.Node,
        okLabel: cc.Label,
        spriteCoin: cc.Sprite,
        nomarlM: cc.Material,
        grayM: cc.Material
      },
      doTween: function doTween() {
        this.dragonNode.opacity = 0;
        this.dragonNode.scale = 0;
        this.dragonNode.active = true;
        cc.tween(this.dragonNode).to(tweenTime, {
          opacity: 255,
          scale: 1
        }).call(function() {}).start();
      },
      start: function start() {
        cc.Mgr.UIMgr.angryUI = this;
        this.title.string = cc.Mgr.Utils.getTranslation("rage-title");
        this.tip_1.string = cc.Mgr.Utils.getTranslation("rage-speedup-tip-1");
        this.tip_2.string = cc.Mgr.Utils.getTranslation("rage-speedup-tip-2");
        this.okLabel.string = cc.Mgr.Utils.getTranslation("btn-ok");
        this.limitClick = this.node.getComponent("LimitClick");
      },
      showUI: function showUI() {
        this.costGem = 3;
        this.node.width = cc.Mgr.Config.winSize.width;
        this.node.height = cc.Mgr.Config.winSize.height;
        this.refreshUI();
        if (cc.Mgr.game.beAngryleftTime > 0) {
          this.angryLeftTimeLbl.string = cc.Mgr.Utils.FormatNumToTime(cc.Mgr.game.beAngryleftTime);
          this.schedule(this.cancelAngryCb, 1);
        } else this.angryLeftTimeLbl.string = "00:00";
        this.doTween();
        this.gemLabel.string = this.costGem;
        this.adsIconNode.active = true;
        this.freeLabelNode.node.x = 26.7;
        this.freeLabelNode.string = cc.Mgr.Utils.getTranslation("btn-get");
        this.blurBg.opacity = 0;
        this.content.opacity = 0;
        this.content.setScale(.5);
        cc.tween(this.blurBg).to(.05, {
          opacity: 255
        }).call().start();
        cc.tween(this.content).to(.15, {
          opacity: 255,
          scale: 1
        }).start();
        cc.Mgr.admob.showBanner("angry");
        this.checkAvailabelAds = cc.Mgr.admob.checkAvailableRewardedAd();
        this.checkAvailabelAds ? this.spriteCoin.setMaterial(0, this.nomarlM) : this.spriteCoin.setMaterial(0, this.grayM);
      },
      cancelAngryCb: function cancelAngryCb() {
        cc.Mgr.plantMgr.changePlantAngryState(true);
        cc.Mgr.game.beAngryleftTime -= 1;
        this.progressbarMask.width = cc.Mgr.game.beAngryleftTime / 150 * 456;
        if (cc.Mgr.game.beAngryleftTime <= 0) {
          cc.Mgr.plantMgr.changePlantAngryState(false);
          this.unschedule(this.cancelAngryCb);
          this.angryLeftTimeLbl.string = "00:00";
        } else this.angryLeftTimeLbl.string = cc.Mgr.Utils.FormatNumToTime(cc.Mgr.game.beAngryleftTime);
      },
      adsGetMoreTime: function adsGetMoreTime() {
        if (false == this.limitClick.clickTime()) return;
        if (false === this.checkAvailabelAds) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("ad-tip-3"), "", this.node);
          return;
        }
        var self = this;
        cc.Mgr.admob.showRewardedVideoAd(function(_state) {
          if (true === _state) {
            self.addMoreAngryTime();
            self.checkAvailabelAds = cc.Mgr.admob.checkAvailableRewardedAd();
            self.checkAvailabelAds ? self.spriteCoin.setMaterial(0, self.nomarlM) : self.spriteCoin.setMaterial(0, self.grayM);
          }
        }, this.node, "rage", this);
      },
      updateAdsBtnState: function updateAdsBtnState() {
        this.checkAvailabelAds = cc.Mgr.admob.checkAvailableRewardedAd();
        this.checkAvailabelAds ? this.spriteCoin.setMaterial(0, this.nomarlM) : this.spriteCoin.setMaterial(0, this.grayM);
      },
      refreshUI: function refreshUI() {
        this.progressbarMask.width = cc.Mgr.game.beAngryleftTime / 150 * 456;
        this.angryLeftTimeLbl.string = cc.Mgr.Utils.FormatNumToTime(cc.Mgr.game.beAngryleftTime);
      },
      addMoreAngryTime: function addMoreAngryTime() {
        this.unschedule(this.cancelAngryCb);
        cc.Mgr.game.beAngryleftTime += 30;
        cc.Mgr.game.beAngryleftTime > 150 && (cc.Mgr.game.beAngryleftTime = 150);
        this.refreshUI();
        this.schedule(this.cancelAngryCb, 1);
      },
      gemsGetMoreTime: function gemsGetMoreTime() {
        if (cc.Mgr.game.beAngryleftTime >= 150) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("max-angry-time-150"), "", this.node);
          return;
        }
        if (cc.Mgr.game.gems >= this.costGem) {
          cc.Mgr.game.gems -= this.costGem;
          cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "gem");
          var data = {};
          data.elapsed = cc.Mgr.Utils.getDate9(true);
          data.costGems = this.costGem;
          cc.Mgr.analytics.logEvent("angry_get_more_time", JSON.stringify(data));
          this.addMoreAngryTime();
        } else {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("NoGems"), "gem", this.node);
          cc.Mgr.game.needShowIAPCount++;
          if (cc.Mgr.game.needShowIAPCount >= 1) {
            cc.Mgr.UIMgr.openPaymentUI(true);
            cc.Mgr.game.needShowIAPCount = 0;
          }
        }
      },
      closeUI: function closeUI() {
        cc.Mgr.AudioMgr.playSFX("click");
        cc.Mgr.admob.hideBanner("angry");
        var self = this;
        cc.tween(this.blurBg).to(.15, {
          opacity: 0
        }).start();
        cc.tween(this.content).to(.15, {
          opacity: 0,
          scale: .5
        }).call(function() {
          self.unschedule(self.cancelAngryCb);
          self.node.active = false;
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount();
      }
    });
    module.exports = angryUI;
    cc._RF.pop();
  }, {} ],
  assetGetUI: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d2458R2d01H1LjhfQcxR5Df", "assetGetUI");
    "use strict";
    var MySprite = require("MySprite");
    var AtlasType = require("AtlasType");
    var DataType = require("DataType");
    var MyEnum = require("MyEnum");
    var iconList = [ "icon_coins", "icon_coin", "icon_diamonds", "icon_diamond" ];
    var scaleConfig = 1.3;
    var tweenTime = .25;
    var assetGetUI = cc.Class({
      extends: cc.Component,
      properties: {
        titleLbl: cc.Label,
        icon: MySprite,
        numLbl: cc.Label,
        dragonParent: cc.Node,
        num: 1,
        btnNode: cc.Node,
        doubleGetNode: cc.Node,
        freeLabelNode: cc.Label,
        toggle: cc.Toggle,
        coinNode: cc.Node,
        gemNode: cc.Node,
        rageNode: cc.Node,
        autoNode: cc.Node,
        flameNode: cc.Node,
        freezeNode: cc.Node,
        critNode: cc.Node,
        smallCoinNode: cc.Node,
        smallGemNode: cc.Node,
        checkboxLabel: cc.Label,
        content: cc.Node,
        blurBg: cc.Node,
        blackBg: cc.Node,
        checkboxNode: cc.Node,
        vipNode: cc.Node,
        vipTip: cc.Label,
        numEffect: cc.Node,
        freeDoubleDailyLabel: cc.Label,
        getBtn: cc.Node,
        adsBtn: cc.Node,
        adsLabel: cc.Label,
        gemBtnlabel: cc.Label,
        noThanks: cc.Node,
        noThanksLabel: cc.Label
      },
      onLoad: function onLoad() {
        this.limitClick = this.node.getComponent("LimitClick");
      },
      updateReward: function updateReward() {
        if ("payment" === this.fromType || "compensation" === this.fromType) return;
        var num;
        if ("money" == this.rtype) num = true === this.toggle.isChecked && this.checkboxNode.active || cc.Mgr.game.isVIP && ("sign" === this.fromType || "mission" === this.fromType || "achieve" === this.fromType) ? this.num * BigInt(3) : this.num; else {
          num = true === this.toggle.isChecked && this.checkboxNode.active || cc.Mgr.game.isVIP && ("sign" === this.fromType || "mission" === this.fromType || "achieve" === this.fromType) ? 3 * this.num : this.num;
          "plant" == this.rtype && (num = true === this.toggle.isChecked && this.checkboxNode.active || cc.Mgr.game.isVIP && ("sign" === this.fromType || "mission" === this.fromType || "achieve" === this.fromType) ? 3 : 1);
          "drone" == this.rtype && (num = true === this.toggle.isChecked && this.checkboxNode.active || cc.Mgr.game.isVIP && ("sign" === this.fromType || "mission" === this.fromType || "achieve" === this.fromType) ? 18 : 6);
        }
        "rage" == this.rtype || "auto" == this.rtype || "flame" == this.rtype || "freeze" == this.rtype || "crit" == this.rtype ? this.numEffect.getComponent("NumEffect").setNumber(num + "s") : "money" == this.rtype ? this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr2(num)) : this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr(num));
        cc.Mgr.game.isManualSetting = cc.Mgr.game.isManualSetting_payingUser = this.toggle.isChecked;
        this.getBtn.active = false;
        this.adsBtn.active = false;
        this.checkboxNode.active && this.toggle.isChecked && (this.adsBtn.active = true);
        (this.vipNode.active || this.checkboxNode.active && !this.toggle.isChecked) && (this.getBtn.active = true);
      },
      doTween: function doTween(rtype) {
        this.dragonParent.opacity = 0;
        this.coinNode.opacity = 0;
        this.coinNode.scale = 1;
        this.gemNode.opacity = 0;
        this.gemNode.scale = 1;
        "money" == rtype ? cc.tween(this.coinNode).to(tweenTime, {
          opacity: 255,
          scale: scaleConfig
        }).to(.1, {
          scale: 1
        }).start() : "gem" == rtype ? cc.tween(this.gemNode).to(tweenTime, {
          opacity: 255,
          scale: scaleConfig
        }).to(.1, {
          scale: 1
        }).start() : cc.tween(this.dragonParent).to(tweenTime, {
          opacity: 255,
          scale: 1
        }).to(.1, {
          scale: .75
        }).start();
      },
      showUI: function showUI(rtype, num, fromType, callback) {
        void 0 === callback && (callback = null);
        this.titleLbl.string = cc.Mgr.Utils.getTranslation("getReward-title");
        this.freeLabelNode.string = cc.Mgr.Utils.getTranslation("btn-claim");
        this.checkboxLabel.string = cc.Mgr.Utils.getTranslation("getReward-checkbox-treble");
        this.vipTip.string = cc.Mgr.Utils.getTranslation("vip-treble-tip");
        this.freeDoubleDailyLabel.string = cc.Mgr.Utils.getTranslation("free-treble-daily-tip");
        this.adsLabel.string = cc.Mgr.Utils.getTranslation("btn-treble");
        this.gemBtnlabel.string = cc.Mgr.Utils.getTranslation("btn-claim");
        this.noThanksLabel.string = cc.Mgr.Utils.getTranslation("btn-no-thanks");
        this.num = num;
        this.callback = callback;
        this.node.width = cc.Mgr.Config.winSize.width;
        this.node.height = cc.Mgr.Config.winSize.height;
        this.icon.node.active = false;
        this.dragonParent.active = false;
        this.coinNode.active = false;
        this.gemNode.active = false;
        this.rageNode.active = false;
        this.autoNode.active = false;
        this.flameNode.active = false;
        this.freezeNode.active = false;
        this.critNode.active = false;
        this.smallCoinNode.active = false;
        this.smallGemNode.active = false;
        this.freeDoubleDailyLabel.node.active = false;
        this.fromType = fromType;
        this.noThanks.opacity = 0;
        this.noThanks.active = false;
        this.btnNode.active = false;
        this.doubleGetNode.active = false;
        this.rtype = rtype;
        var self = this;
        this.showBtnCounter && clearTimeout(this.showBtnCounter);
        var checkState;
        if (cc.Mgr.game.isPayingUser) {
          checkState = void 0 == cc.Mgr.game.isManualSetting_payingUser ? cc.Mgr.game.checkDoubleReward : cc.Mgr.game.isManualSetting_payingUser;
          this.toggle.isChecked != checkState && (this.toggle.isChecked = checkState);
        } else {
          checkState = void 0 == cc.Mgr.game.isManualSetting ? cc.Mgr.game.checkDoubleReward : cc.Mgr.game.isManualSetting;
          this.toggle.isChecked != checkState && (this.toggle.isChecked = checkState);
        }
        var currentRewardedAvailable = cc.Mgr.admob.checkAvailableRewardedAd();
        if ("money" == rtype) {
          this.coinNode.active = true;
          "payment" == this.fromType || "exchange" == this.fromType || "compensation" === this.fromType ? this.btnNode.active = true : this.doubleGetNode.active = true;
          if ((this.doubleGetNode.active && this.toggle.isChecked && true === currentRewardedAvailable || cc.Mgr.game.isVIP && ("sign" === this.fromType || "mission" === this.fromType || "achieve" === this.fromType)) && "payment" != this.fromType && "compensation" !== this.fromType && "exchange" != this.fromType) {
            var currentNum = num * BigInt(3);
            this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr2(currentNum), true);
          } else this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr2(num), true);
        } else if ("gem" == rtype) {
          this.gemNode.active = true;
          this.smallGemNode.active = true;
          "payment" == this.fromType || "compensation" === this.fromType ? this.btnNode.active = true : this.doubleGetNode.active = true;
          if ((this.doubleGetNode.active && this.toggle.isChecked && true === currentRewardedAvailable || cc.Mgr.game.isVIP && ("sign" === this.fromType || "mission" === this.fromType || "achieve" === this.fromType)) && "payment" != this.fromType && "compensation" !== this.fromType || "sign" === this.fromType && cc.Mgr.game.isFreeDoubleDaily) {
            var _currentNum = 3 * num;
            this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr(_currentNum), true);
          } else this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr(num), true);
        } else if ("plant" == rtype) {
          this.plantId = num;
          this.num = 1;
          if (this.toggle.isChecked && true === currentRewardedAvailable) {
            var _currentNum2 = 3 * this.num;
            this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr(_currentNum2), true);
          } else {
            var _currentNum3 = this.num;
            this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr(_currentNum3), true);
          }
          this.dragonParent.active = true;
          this.doubleGetNode.active = true;
          var plantData = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData, num);
          cc.loader.loadRes("prefab/plant/" + plantData.prefab, function(errmsg, prefab) {
            if (errmsg) {
              cc.error(errmsg.message || errmsg);
              return;
            }
            self.plantNodeA = cc.instantiate(prefab);
            self.plantNodeA.parent = self.dragonParent;
            self.plantNodeA.group = MyEnum.NodeGroup.UI;
            self.plantNodeA.position = cc.v2(0, 0);
            self.plantNodeA.active = true;
            self.plantNodeA.setScale(.75);
            var scp = self.plantNodeA.getComponent("plant");
            scp.setShowDetailsInUI(2, "#ffffff", true);
          });
        } else if ("drone" == rtype) {
          this.droneId = num;
          this.num = 6;
          this.doubleGetNode.active = true;
          if (this.toggle.isChecked && true === currentRewardedAvailable) {
            var _currentNum4 = 3 * this.num;
            this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr(_currentNum4), true);
          } else this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr(this.num), true);
          this.dragonParent.active = true;
          cc.loader.loadRes("prefab/flowerPot/HuaPen_v1", function(errmsg, prefab) {
            if (errmsg) {
              cc.error(errmsg.message || errmsg);
              return;
            }
            self.plantNodeA = cc.instantiate(prefab);
            self.plantNodeA.parent = self.dragonParent;
            self.plantNodeA.group = MyEnum.NodeGroup.UI;
            self.plantNodeA.position = cc.v2(0, 0);
            self.plantNodeA.active = true;
            var scp = self.plantNodeA.getComponent("flowerPot");
            scp.setShowDetailsInUI(2, "#ffffff", true);
          });
        } else if ("rage" == rtype || "auto" == rtype || "flame" == rtype || "freeze" == rtype || "crit" == rtype) {
          switch (rtype) {
           case "rage":
            this.rageNode.active = true;
            break;

           case "auto":
            this.autoNode.active = true;
            break;

           case "flame":
            this.flameNode.active = true;
            break;

           case "freeze":
            this.freezeNode.active = true;
            break;

           case "crit":
            this.critNode.active = true;
          }
          "buff" == this.fromType ? this.btnNode.active = true : this.doubleGetNode.active = true;
          this.doubleGetNode.active && this.toggle.isChecked && true === currentRewardedAvailable || cc.Mgr.game.isVIP && "turnTable" === this.fromType ? this.numEffect.getComponent("NumEffect").setNumber(3 * this.num + "s", true) : this.numEffect.getComponent("NumEffect").setNumber(this.num + "s", true);
        }
        this.isDouble = false;
        this.doTween(rtype);
        this.blurBg.active = false;
        this.blackBg.active = false;
        this.blurBg.active = true;
        this.blurBg.opacity = 0;
        cc.tween(this.blurBg).to(.05, {
          opacity: 255
        }).call().start();
        this.content.opacity = 0;
        this.content.setScale(.5);
        cc.tween(this.content).to(.15, {
          opacity: 255,
          scale: 1
        }).start();
        cc.Mgr.admob.showBanner("getReward");
        this.checkboxNode.opacity = 255;
        this.checkboxNode.active = !(cc.Mgr.game.isVIP && ("sign" === this.fromType || "mission" === this.fromType || "achieve" === this.fromType));
        false === currentRewardedAvailable && (this.checkboxNode.active = false);
        this.vipNode.active = cc.Mgr.game.isVIP && ("sign" === this.fromType || "mission" === this.fromType || "achieve" === this.fromType);
        if ("payment" == this.fromType || "exchange" == this.fromType || "compensation" === this.fromType) {
          this.checkboxNode.active = false;
          this.vipNode.active = false;
        }
        this.getBtn.active = false;
        this.adsBtn.active = false;
        if ("sign" === this.fromType && cc.Mgr.game.isFreeDoubleDaily) {
          this.checkboxNode.active = false;
          this.vipNode.active = false;
          this.freeDoubleDailyLabel.node.active = true;
          this.getBtn.active = true;
        } else {
          this.checkboxNode.active && this.toggle.isChecked && (this.adsBtn.active = true);
          !this.vipNode.active && this.checkboxNode.active && this.toggle.isChecked || (this.getBtn.active = true);
        }
      },
      updateAdsBtnState: function updateAdsBtnState() {
        this.icon.node.active = false;
        this.dragonParent.active = false;
        this.coinNode.active = false;
        this.gemNode.active = false;
        this.rageNode.active = false;
        this.autoNode.active = false;
        this.flameNode.active = false;
        this.freezeNode.active = false;
        this.critNode.active = false;
        this.smallCoinNode.active = false;
        this.smallGemNode.active = false;
        this.freeDoubleDailyLabel.node.active = false;
        this.btnNode.active = false;
        this.doubleGetNode.active = false;
        var checkState;
        if (cc.Mgr.game.isPayingUser) {
          checkState = void 0 == cc.Mgr.game.isManualSetting_payingUser ? cc.Mgr.game.checkDoubleReward : cc.Mgr.game.isManualSetting_payingUser;
          this.toggle.isChecked != checkState && (this.toggle.isChecked = checkState);
        } else {
          checkState = void 0 == cc.Mgr.game.isManualSetting ? cc.Mgr.game.checkDoubleReward : cc.Mgr.game.isManualSetting;
          this.toggle.isChecked != checkState && (this.toggle.isChecked = checkState);
        }
        var currentRewardedAvailable = cc.Mgr.admob.checkAvailableRewardedAd();
        if ("money" == this.rtype) {
          this.coinNode.active = true;
          this.smallCoinNode.active = true;
          this.doubleGetNode.active = true;
          "payment" == this.fromType || "exchange" == this.fromType || "compensation" === this.fromType ? this.btnNode.active = true : this.doubleGetNode.active = true;
          if ((this.toggle.isChecked && true === currentRewardedAvailable || cc.Mgr.game.isVIP && ("sign" === this.fromType || "mission" === this.fromType || "achieve" === this.fromType)) && "payment" != this.fromType && "compensation" !== this.fromType) {
            var currentNum = this.num * BigInt(3);
            this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr2(currentNum), true);
          } else this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr2(this.num), true);
        } else if ("gem" == this.rtype) {
          this.gemNode.active = true;
          this.smallGemNode.active = true;
          "payment" == this.fromType || "compensation" === this.fromType ? this.btnNode.active = true : this.doubleGetNode.active = true;
          if ((this.toggle.isChecked && true === currentRewardedAvailable || cc.Mgr.game.isVIP && ("sign" === this.fromType || "mission" === this.fromType || "achieve" === this.fromType)) && "payment" != this.fromType && "compensation" !== this.fromType || "sign" === this.fromType && cc.Mgr.game.isFreeDoubleDaily) {
            var _currentNum5 = 3 * this.num;
            this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr(_currentNum5), true);
          } else this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr(this.num), true);
        } else if ("plant" == this.rtype) {
          this.num = 1;
          this.dragonParent.active = true;
          this.doubleGetNode.active = true;
          if (this.toggle.isChecked && true === currentRewardedAvailable) {
            var _currentNum6 = 3 * this.num;
            this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr(_currentNum6), true);
          } else {
            var _currentNum7 = this.num;
            this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr(_currentNum7), true);
          }
        } else if ("drone" == this.rtype) {
          this.num = 6;
          this.doubleGetNode.active = true;
          this.dragonParent.active = true;
          if (this.toggle.isChecked && true === currentRewardedAvailable) {
            var _currentNum8 = 3 * this.num;
            this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr(_currentNum8), true);
          } else this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr(this.num), true);
        } else if ("rage" == this.rtype || "auto" == this.rtype || "flame" == this.rtype || "freeze" == this.rtype || "crit" == this.rtype) {
          switch (this.rtype) {
           case "rage":
            this.rageNode.active = true;
            break;

           case "auto":
            this.autoNode.active = true;
            break;

           case "flame":
            this.flameNode.active = true;
            break;

           case "freeze":
            this.freezeNode.active = true;
            break;

           case "crit":
            this.critNode.active = true;
          }
          "buff" == this.fromType ? this.btnNode.active = true : this.doubleGetNode.active = true;
          this.toggle.isChecked && true === currentRewardedAvailable || cc.Mgr.game.isVIP && ("sign" === this.fromType || "mission" === this.fromType || "achieve" === this.fromType) ? this.numEffect.getComponent("NumEffect").setNumber(3 * this.num + "s", true) : this.numEffect.getComponent("NumEffect").setNumber(this.num + "s", true);
        }
        this.checkboxNode.active = !(cc.Mgr.game.isVIP && ("sign" === this.fromType || "mission" === this.fromType || "achieve" === this.fromType));
        false === currentRewardedAvailable && (this.checkboxNode.active = false);
        this.vipNode.active = cc.Mgr.game.isVIP && ("sign" === this.fromType || "mission" === this.fromType || "achieve" === this.fromType);
        if ("payment" == this.fromType || "exchange" == this.fromType || "compensation" === this.fromType) {
          this.checkboxNode.active = false;
          this.vipNode.active = false;
        }
        this.getBtn.active = false;
        this.adsBtn.active = false;
        if ("sign" === this.fromType && cc.Mgr.game.isFreeDoubleDaily) {
          this.checkboxNode.active = false;
          this.vipNode.active = false;
          this.freeDoubleDailyLabel.node.active = true;
          this.getBtn.active = true;
        } else {
          this.checkboxNode.active && this.toggle.isChecked && (this.adsBtn.active = true);
          !this.vipNode.active && this.checkboxNode.active && this.toggle.isChecked || (this.getBtn.active = true);
        }
      },
      doubleGetAds: function doubleGetAds() {
        if (false == this.limitClick.clickTime()) return;
        var self = this;
        cc.Mgr.admob.showRewardedVideoAd(function(_state) {
          if (true === _state) {
            "money" == self.rtype ? self.num = self.num * BigInt(3) : self.num = 3 * self.num;
            self.isDouble = true;
          } else self.isDouble = false;
          self.closeUI();
        }, this.node, this.fromType, this);
      },
      doubleGet: function doubleGet() {
        if (false == this.limitClick.clickTime()) return;
        if (cc.Mgr.game.isVIP && ("sign" === this.fromType || "mission" === this.fromType || "achieve" === this.fromType) && "payment" != this.fromType && "compensation" !== this.fromType || "sign" === this.fromType && cc.Mgr.game.isFreeDoubleDaily) {
          "money" == this.rtype ? this.num = this.num * BigInt(3) : this.num = 3 * this.num;
          this.isDouble = true;
          this.closeUI();
        } else {
          this.isDouble = false;
          this.closeUI();
        }
      },
      closeUI: function closeUI() {
        var _this = this;
        cc.Mgr.AudioMgr.playSFX("click");
        cc.Mgr.admob.hideBanner("getReward");
        var self = this;
        "payment" == this.fromType || "exchange" == this.fromType || "compensation" === this.fromType ? cc.tween(this.blackBg).to(.15, {
          opacity: 0
        }).start() : cc.tween(this.blurBg).to(.15, {
          opacity: 0
        }).start();
        cc.tween(this.content).to(.15, {
          opacity: 0,
          scale: .5
        }).call(function() {
          self.plantNodeA && _this.plantNodeA.destroy();
          if ("gem" == self.rtype) {
            cc.Mgr.game.gems += self.num;
            cc.Mgr.game.gem_gained_total += self.num;
            cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "gem");
            cc.Mgr.UIMgr.showGemsEffect();
          }
          if ("money" == self.rtype) {
            cc.Mgr.game.money += self.num;
            cc.Mgr.game.coin_gained_total += self.num;
            cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "money");
            cc.Mgr.UIMgr.showJibEffect();
          }
          "plant" == self.rtype && cc.Mgr.flowerPotMgr.addTurnTableFlowerFot(_this.plantId, self.num);
          if ("rage" == self.rtype) {
            cc.Mgr.game.rageTimer += self.num;
            cc.Mgr.game.rageTimer > 900 && (cc.Mgr.game.rageTimer = 900);
            cc.Mgr.plantMgr.changePlantAngryState(true);
          }
          if ("auto" == self.rtype) {
            cc.Mgr.game.autoTimer += self.num;
            cc.Mgr.game.autoTimer > 900 && (cc.Mgr.game.autoTimer = 900);
            cc.Mgr.plantMgr.changePlantAutoState(true);
          }
          if ("flame" == self.rtype) {
            cc.Mgr.game.fireTimer += self.num;
            cc.Mgr.game.fireTimer > 900 && (cc.Mgr.game.fireTimer = 900);
            cc.Mgr.plantMgr.changePlantFireState(true);
          }
          if ("freeze" == self.rtype) {
            cc.Mgr.game.iceTimer += self.num;
            cc.Mgr.game.iceTimer > 900 && (cc.Mgr.game.iceTimer = 900);
            cc.Mgr.plantMgr.changePlantIceState(true);
          }
          if ("crit" == self.rtype) {
            cc.Mgr.game.critTimer += self.num;
            cc.Mgr.game.critTimer > 900 && (cc.Mgr.game.critTimer = 900);
            cc.Mgr.plantMgr.changePlantCritState(true);
          }
          "drone" == self.rtype && cc.Mgr.flowerPotMgr.addDroneFlowerFot(_this.droneId, self.num);
          "mission" !== self.fromType && "achieve" !== self.fromType && "sign" !== self.fromType || true !== self.isDouble;
          self.node.active = false;
          null != self.callback && "function" == typeof self.callback && self.callback();
          null != cc.Mgr.UIMgr.turnTableUINode && true == cc.Mgr.UIMgr.turnTableUINode.active && cc.Mgr.UIMgr.turnTableUI.showBtns();
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount("assetGet");
      }
    });
    module.exports = assetGetUI;
    cc._RF.pop();
  }, {
    AtlasType: "AtlasType",
    DataType: "DataType",
    MyEnum: "MyEnum",
    MySprite: "MySprite"
  } ],
  attackEffect: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "12afeXFtapOmJg/9+UZnoXq", "attackEffect");
    "use strict";
    var EffectType = require("EffectType");
    var attackEffect = cc.Class({
      extends: cc.Component,
      properties: {
        dragon: dragonBones.ArmatureDisplay
      },
      start: function start() {
        this.dragon.on(dragonBones.EventObject.COMPLETE, this.onAnimComplete, this);
      },
      onAnimComplete: function onAnimComplete() {
        this.node.active = false;
      },
      playAnimation: function playAnimation() {
        this.dragon.playAnimation("newAnimation", 1);
      }
    });
    module.exports = attackEffect;
    cc._RF.pop();
  }, {
    EffectType: "EffectType"
  } ],
  bigResult: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "628bfJlNBlIuKAY/JH/YCGx", "bigResult");
    "use strict";
    var MyEnum = require("MyEnum");
    var MissionType = require("MissionType");
    var AchieveType = require("AchieveType");
    var bigResult = cc.Class({
      extends: cc.Component,
      properties: {
        sucNode: cc.Node,
        failNode: cc.Node,
        coinNode: cc.Node,
        coinLbl: cc.Label,
        timeLbl: cc.Label,
        failedToggle: cc.Toggle,
        winToggle: cc.Toggle,
        winCheckLabel: cc.Label,
        failedCheckLabel: cc.Label,
        rebornLabel: cc.Label,
        getRewardLabel: cc.Label,
        vipTip: cc.Label,
        content: cc.Node,
        blurBg: cc.Node,
        winDb: dragonBones.ArmatureDisplay,
        failedDb: dragonBones.ArmatureDisplay,
        checkboxNode: cc.Node,
        vipNode: cc.Node,
        failedCheckboxNode: cc.Node,
        failedVipNode: cc.Node,
        failed_adsLabel: cc.Label,
        win_getBtn: cc.Node,
        win_adsBtn: cc.Node,
        failed_adsBtn: cc.Node,
        win_adsLabel: cc.Label,
        inviteBtn: cc.Node,
        inviteLabel: cc.Node,
        numEffect: cc.Node,
        spriteCoin: cc.Sprite,
        nomarlM: cc.Material,
        grayM: cc.Material,
        noThanks: cc.Node,
        noThanksLabel: cc.Label
      },
      onLoad: function onLoad() {
        this.showVipCount = 0;
        this.limitClick = this.node.getComponent("LimitClick");
      },
      onClickToggle: function onClickToggle() {
        cc.Mgr.game.isManualSetting = cc.Mgr.game.isManualSetting_payingUser = this.winToggle.isChecked;
        var num = true === this.winToggle.isChecked && this.checkboxNode.active ? this.coin * BigInt(3) : this.coin;
        this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr2(num));
        this.win_getBtn.active = false;
        this.win_adsBtn.active = false;
        this.winToggle.isChecked && this.checkboxNode.active ? this.win_adsBtn.active = this.failed_adsBtn.active = true : this.win_getBtn.active = this.failed_adsBtn.active = true;
      },
      onClickFaileToggle: function onClickFaileToggle() {},
      onClickInvite: function onClickInvite() {
        if (false == this.limitClick.clickTime()) return;
        this.unschedule(this.callback);
        var self = this;
        cc.Mgr.UIMgr.showLoading();
        cc.Mgr.Utils.getBase64Image("resources/tex/shareImage_2.png", function(_data) {
          cc.Mgr.UIMgr.hideLoading();
          cc.Mgr.GameCenterCtrl.unschedduleCreateCallBack(false);
          cc.Mgr.game.updateMissionProgressById(MissionType.InviteCount);
          cc.Mgr.game.updateAchieveProgressByType(AchieveType.Invite);
          cc.Mgr.UIMgr.InGameUI.checkMissionAchieveTip();
          cc.Mgr.game.rageTimer += 30;
          cc.Mgr.game.rageTimer > 150 && (cc.Mgr.game.rageTimer = 150);
          cc.Mgr.plantMgr.changePlantAngryState(true);
          var data = {};
          data.elapsed = cc.Mgr.Utils.getDate9(true);
          data.stage = cc.Mgr.game.level;
          data.coin = self.coin.toString();
          data.isWin = "NO";
          data["double"] = "YES";
          cc.Mgr.analytics.logEvent("stage_end", JSON.stringify(data));
          data = {};
          data.elapsed = cc.Mgr.Utils.getDate9(true);
          data.stage = cc.Mgr.game.level;
          data.feature = "end of stage";
          cc.Mgr.analytics.logEvent("share_message", JSON.stringify(data));
          self.rebornHandler();
          cc.Mgr.UIMgr.hideLoading();
          cc.Mgr.UIMgr.showPrompt("Invitation Failed", "", self.node);
          cc.Mgr.GameCenterCtrl.unschedduleCreateCallBack(false);
        });
      },
      show: function show(suc, coin) {
        void 0 === suc && (suc = false);
        coin || (coin = BigInt(0));
        this.winCheckLabel.string = cc.Mgr.Utils.getTranslation("getReward-checkbox-treble");
        this.failedCheckLabel.string = cc.Mgr.Utils.getTranslation("bigResult-loss-checkbox");
        this.rebornLabel.string = cc.Mgr.Utils.getTranslation("bigResult-loss-reborn");
        this.getRewardLabel.string = cc.Mgr.Utils.getTranslation("btn-claim");
        this.vipTip.string = cc.Mgr.Utils.getTranslation("vip-treble-tip");
        this.failed_adsLabel.string = cc.Mgr.Utils.getTranslation("btn-retry");
        this.win_adsLabel.string = cc.Mgr.Utils.getTranslation("btn-treble");
        this.noThanksLabel.string = cc.Mgr.Utils.getTranslation("btn-no-thanks");
        this.coin = coin * BigInt(4) / BigInt(5);
        this.sucNode.active = suc;
        this.failNode.active = !suc;
        this.suc = suc;
        this.suc && cc.Mgr.inviteManager.sendInvitations("end of stage - auto");
        this.coinNode.active = false;
        this.timeLbl.node.active = false;
        this.noThanks.opacity = 0;
        this.noThanks.active = false;
        this.showBtnCounter && clearTimeout(this.showBtnCounter);
        if (suc) {
          cc.Mgr.AudioMgr.playSFX(MyEnum.AudioType.success1);
          this.winDb.playAnimation("win", 1);
          this.showVipCount = 0;
        } else {
          cc.Mgr.AudioMgr.playSFX(MyEnum.AudioType.fail);
          this.failedDb.playAnimation("Defeat", 1);
          this.showVipCount++;
        }
        if (this.showVipCount >= 10) {
          cc.Mgr.plantMgr.showVipTip();
          this.showVipCount = 0;
        }
        this.blurBg.opacity = 0;
        this.content.opacity = 0;
        this.content.setScale(.5);
        cc.tween(this.blurBg).to(.05, {
          opacity: 255
        }).call().start();
        cc.tween(this.content).to(.15, {
          opacity: 255,
          scale: 1
        }).start();
        this.countDown();
        var checkState;
        if (cc.Mgr.game.isPayingUser) {
          checkState = void 0 == cc.Mgr.game.isManualSetting_payingUser ? cc.Mgr.game.checkDoubleReward : cc.Mgr.game.isManualSetting_payingUser;
          this.winToggle.isChecked != checkState && (this.winToggle.isChecked = checkState);
        } else {
          checkState = void 0 == cc.Mgr.game.isManualSetting ? cc.Mgr.game.checkDoubleReward : cc.Mgr.game.isManualSetting;
          this.winToggle.isChecked != checkState && (this.winToggle.isChecked = checkState);
        }
        this.checkAvailabelAds = cc.Mgr.admob.checkAvailableRewardedAd();
        if (this.checkAvailabelAds) {
          this.win_adsBtn.active = true;
          this.failed_adsBtn.active = true;
          this.spriteCoin.setMaterial(0, this.nomarlM);
        } else {
          this.spriteCoin.setMaterial(0, this.grayM);
          this.win_adsBtn.active = false;
          this.failed_adsBtn.active = false;
        }
        this.checkboxNode.opacity = 255;
        this.checkboxNode.active = this.checkAvailabelAds;
        this.vipNode.active = false;
        this.failedCheckboxNode.active = false;
        this.failedVipNode.active = false;
        this.win_getBtn.active = false;
        this.win_adsBtn.active = false;
        this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr2(this.coin), true);
        if (this.winToggle.isChecked && this.checkboxNode.active) {
          this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr2(this.coin * BigInt(3)), true);
          this.win_adsBtn.active = true;
        } else this.win_getBtn.active = true;
        var showInvite = false;
        this.failed_adsBtn.active = !showInvite && this.checkAvailabelAds;
        this.inviteBtn.active = showInvite;
        this.inviteLabel.active = showInvite;
      },
      countDown: function countDown() {
        this.count = 9;
        this.timeLbl.string = "00:0" + this.count;
        this.callback = function() {
          0 == this.count && this.claim();
          this.timeLbl.string = "00:0" + this.count;
          this.count--;
        };
        this.timeLbl.node.active = true;
        this.coinNode.active = true;
        this.schedule(this.callback, 1);
      },
      claim: function claim() {
        this.unschedule(this.callback);
        cc.Mgr.GameCenterCtrl.unschedduleCreateCallBack();
        cc.Mgr.game.money += this.coin;
        cc.Mgr.game.coin_gained_total += this.coin;
        cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "money");
        cc.Mgr.UIMgr.showJibEffect();
        var data = {};
        data.elapsed = cc.Mgr.Utils.getDate9(true);
        data.stage = cc.Mgr.game.level;
        data.coin = this.coin.toString();
        data.isWin = this.suc ? "YES" : "NO";
        data["double"] = "NO";
        cc.Mgr.analytics.logEvent("stage_end", JSON.stringify(data));
        this.closeUI();
      },
      closeUI: function closeUI() {
        var _this = this;
        var self = this;
        cc.tween(this.blurBg).to(.15, {
          opacity: 0
        }).start();
        cc.tween(this.content).to(.15, {
          opacity: 0,
          scale: .5
        }).call(function() {
          self.unscheduleAllCallbacks();
          self.node.active = false;
          var score = 100 * cc.Mgr.game.level + cc.Mgr.game.curBoshu;
          if (score > cc.Mgr.game.lastMaxWave && _this.suc) {
            cc.Mgr.UIMgr.openRecordUI();
            var data = {};
            data.elapsed = cc.Mgr.Utils.getDate9(true);
            data.stage = cc.Mgr.game.level;
            cc.Mgr.analytics.logEvent("level_up", JSON.stringify(data));
          }
          cc.Mgr.game.lastMaxWave = score;
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount("bigResult");
      },
      doubleClaim: function doubleClaim() {
        cc.Mgr.GameCenterCtrl.unschedduleCreateCallBack();
        cc.Mgr.game.money += BigInt(3) * this.coin;
        cc.Mgr.game.coin_gained_total += BigInt(3) * this.coin;
        var data = {};
        data.elapsed = cc.Mgr.Utils.getDate9(true);
        data.stage = cc.Mgr.game.level;
        data.coin = (BigInt(3) * this.coin).toString();
        data.isWin = this.suc ? "YES" : "NO";
        data["double"] = "YES";
        cc.Mgr.analytics.logEvent("stage_end", JSON.stringify(data));
        cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "money");
        cc.Mgr.UIMgr.showJibEffect();
        this.closeUI();
      },
      reSchedule: function reSchedule() {
        this.schedule(this.callback, 1);
      },
      adsDoubleClaim: function adsDoubleClaim() {
        if (false == this.limitClick.clickTime()) return;
        var self = this;
        this.unschedule(this.callback);
        cc.Mgr.admob.showRewardedVideoAd(function(_state) {
          _state ? self.doubleClaim() : self.claim();
        }, this.node, "win", this);
      },
      updateAdsBtnState: function updateAdsBtnState() {
        this.checkAvailabelAds = cc.Mgr.admob.checkAvailableRewardedAd();
        if (this.checkAvailabelAds) {
          this.win_adsBtn.active = true;
          this.failed_adsBtn.active = true;
          this.spriteCoin.setMaterial(0, this.nomarlM);
        } else {
          this.spriteCoin.setMaterial(0, this.grayM);
          this.win_adsBtn.active = false;
          this.failed_adsBtn.active = false;
        }
        this.checkboxNode.active = this.checkAvailabelAds;
        this.vipNode.active = false;
        this.failedCheckboxNode.active = false;
        this.failedVipNode.active = false;
        this.win_getBtn.active = false;
        this.win_adsBtn.active = false;
        this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr2(this.coin), true);
        if (this.winToggle.isChecked && this.checkboxNode.active) {
          this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr2(this.coin * BigInt(3)), true);
          this.win_adsBtn.active = true;
        } else this.win_getBtn.active = true;
      },
      rebornToGameAds: function rebornToGameAds() {
        if (false == this.limitClick.clickTime()) return;
        if (false === this.checkAvailabelAds) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("ad-tip-3"), "", this.node);
          return;
        }
        this.unschedule(this.callback);
        cc.Mgr.GameCenterCtrl.unschedduleCreateCallBack(false);
        var self = this;
        cc.Mgr.admob.showRewardedVideoAd(function(_state) {
          if (_state) {
            cc.Mgr.game.rageTimer += 30;
            cc.Mgr.game.rageTimer > 150 && (cc.Mgr.game.rageTimer = 150);
            cc.Mgr.plantMgr.changePlantAngryState(true);
            var data = {};
            data.elapsed = cc.Mgr.Utils.getDate9(true);
            data.stage = cc.Mgr.game.level;
            data.coin = self.coin.toString();
            data.isWin = "NO";
            data["double"] = "YES";
            cc.Mgr.analytics.logEvent("stage_end", JSON.stringify(data));
          }
          self.rebornHandler();
        }, this.node, "failed", this);
      },
      rebornToGame: function rebornToGame() {
        if (false == this.limitClick.clickTime()) return;
        this.claim();
      },
      rebornHandler: function rebornHandler() {
        cc.Mgr.game.hasUseFreeBorn = true;
        cc.Mgr.GameCenterCtrl.rebornToLvLastWave();
        cc.Mgr.game.money += this.coin;
        cc.Mgr.game.coin_gained_total += this.coin;
        cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "money");
        cc.Mgr.UIMgr.showJibEffect();
        this.closeUI();
      }
    });
    module.exports = bigResult;
    cc._RF.pop();
  }, {
    AchieveType: "AchieveType",
    MissionType: "MissionType",
    MyEnum: "MyEnum"
  } ],
  bossComing: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d56ad/M+fdPwrBhL8ciRqVq", "bossComing");
    "use strict";
    var DataType = require("DataType");
    var bossComing = cc.Class({
      extends: cc.Component,
      properties: {
        dragon: dragonBones.ArmatureDisplay,
        box: cc.Node,
        monsterContainer: cc.Node
      },
      start: function start() {
        if (window.winSize) {
          this.box.width = window.winSize.width;
          this.box.height = window.winSize.height;
        } else {
          this.box.width = window.innerWidth;
          this.box.height = window.innerHeight;
        }
        this.dragon.on(dragonBones.EventObject.COMPLETE, this.onAnimComplete, this);
      },
      onAnimComplete: function onAnimComplete() {
        var _this = this;
        setTimeout(function() {
          _this.zomObj.destroy();
          _this.node.active = false;
        }, 1e3);
      },
      playAnimation: function playAnimation(_id) {
        var data = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.ZombieData, _id.toString());
        this.monsterContainer.x = -400;
        this.box.opacity = 150;
        cc.tween(this.box).to(.2, {
          opacity: 255
        }).to(.2, {
          opacity: 150
        }).to(.2, {
          opacity: 255
        }).to(.2, {
          opacity: 150
        }).start();
        this.dragon.playAnimation("boss", 1);
        var self = this;
        cc.loader.loadRes("prefab/zombiesnew/" + data.prefab, function(errmsg, prefab) {
          if (errmsg) {
            cc.error(errmsg.message || errmsg);
            return;
          }
          self.zomObj = cc.instantiate(prefab);
          self.zomObj.parent = self.monsterContainer;
          var zombieScript = self.zomObj.getComponent("zombie");
          zombieScript.showComing();
          cc.tween(self.monsterContainer).to(1, {
            position: cc.v2(-194, 350)
          }, {
            easing: "cubicOut"
          }).start();
        });
      }
    });
    module.exports = bossComing;
    cc._RF.pop();
  }, {
    DataType: "DataType"
  } ],
  bullet: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "000862xnGpC8JWw9nOPnrjL", "bullet");
    "use strict";
    var MyEnum = require("MyEnum");
    var bullet = cc.Class({
      extends: cc.Component,
      properties: {
        speed: .2,
        power: 100,
        Sp: cc.Sprite,
        Atlas: cc.SpriteAtlas,
        tuowei: cc.Sprite,
        mask: cc.Node,
        bulletSkill: 0
      },
      initData: function initData(plantData, zombieNode, plantNode) {
        this.node.setScale(.8);
        this.plantNode = plantNode;
        this.zombieNode = zombieNode;
        this.power = plantData.power;
        this.Sp.spriteFrame = this.Atlas.getSpriteFrame(plantData.spName);
        this.tuowei.node.color = plantData.color;
        this.node.position = plantData.pos;
        this.bulletType = plantData.bulletType;
        var skilldata = plantData.skill.split("|");
        this.bulletSkill = 0;
        var seed = Math.random();
        var skillRatio;
        skillRatio = "3" === skilldata[0] ? plantData.enter_ice ? 2 * parseInt(skilldata[1]) : parseInt(skilldata[1]) : "2" === skilldata[0] && plantData.enter_crit ? 2 * parseInt(skilldata[1]) : parseInt(skilldata[1]);
        var ratio = skillRatio / 100;
        seed <= ratio && (this.bulletSkill = parseInt(skilldata[0]));
        this.isNeedMask = 1 == plantData.isNeedMask;
        this.isNeedTrail = this.bulletType == MyEnum.BulletType.Straight;
        this.tuowei.node.width = 25;
        this.mask.position = cc.v2(-5, 0);
        this.node.active = true;
        this.tuowei.node.active = this.isNeedTrail;
        this.zombieComponent = this.zombieNode.getComponent("zombie");
        this.plantLevel = plantData.level;
        this.startPos = this.node.position;
        this.plantNodePos = this.plantNode.node.position;
        if (this.bulletType == MyEnum.BulletType.Straight) {
          this.durationTimer = 500;
          var endPos = this.zombieComponent.getHitPosition();
          this.node.angle = -1 * (cc.Mgr.Utils.calculateAngle(endPos, this.startPos) + 90);
          if (this.isNeedTrail) {
            this.tuowei.node.position = cc.v2(90, 0);
            cc.tween(this.tuowei.node).to(.3, {
              position: cc.v2(0, 0)
            }).start();
          }
        } else {
          this.durationTimer = 1e3;
          this.node.angle = 0;
          this.lastPos = this.startPos;
          this.t = 0;
        }
        this.currentTimer = Date.now();
        this.currentSpeedTimer = Date.now();
        this.Sp.node.angle = 30;
      },
      ObBackToPool: function ObBackToPool(_flyOut) {
        if (_flyOut) {
          var self = this;
          setTimeout(function() {
            cc.Mgr.BulletPool.ObBackToPool(self.node);
          }, 1);
        } else cc.Mgr.BulletPool.ObBackToPool(this.node);
      },
      twoBezier: function twoBezier(t, p1, cp, p2) {
        var x = (1 - t) * (1 - t) * p1.x + 2 * t * (1 - t) * cp.x + t * t * p2.x;
        var y = (1 - t) * (1 - t) * p1.y + 2 * t * (1 - t) * cp.y + t * t * p2.y;
        return [ x, y ];
      },
      update: function update() {
        if (null == this.zombieNode || false === this.zombieNode.activeInHierarchy) {
          this.ObBackToPool();
          return;
        }
        55 !== this.plantLevel && 56 !== this.plantLevel && 57 !== this.plantLevel && (this.Sp.node.angle += 20);
        var endPos = this.zombieComponent.getHitPosition();
        if (this.bulletType === MyEnum.BulletType.Straight) {
          this.node.x += .03 * (endPos.x - this.startPos.x);
          this.node.y += .03 * (endPos.y - this.startPos.y);
          this.node.angle = -1 * (cc.Mgr.Utils.calculateAngle(endPos, this.startPos) + 90);
        } else {
          this.plantNodePos.y > this.zombieNode.position.y ? this.middlePos = cc.v2(this.plantNodePos.x, this.plantNodePos.y + 400) : this.middlePos = cc.v2(this.plantNodePos.x, this.zombieNode.position.y + 400);
          var pos = this.twoBezier(this.t, this.startPos, this.middlePos, endPos);
          this.node.x = pos[0];
          this.node.y = pos[1];
          this.t += .017;
          this.lastPos = this.node.position;
        }
        if (Date.now() - this.currentSpeedTimer >= this.durationTimer) {
          this.zombieNode.getComponent("zombie").beAttack(this);
          this.ObBackToPool();
        }
        this.zombieNode.activeInHierarchy || this.ObBackToPool();
      }
    });
    module.exports = bullet;
    cc._RF.pop();
  }, {
    MyEnum: "MyEnum"
  } ],
  coinBonus: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c6e3bT++eBMVYZwRfzIZcai", "coinBonus");
    "use strict";
    var DataType = require("DataType");
    var coinBonus = cc.Class({
      extends: cc.Component,
      properties: {
        numLbl: cc.Label,
        proBar: cc.ProgressBar,
        coinNum: 0,
        durTime: 0,
        clickTimes: 1
      },
      start: function start() {
        this.clickTimes = 1;
        this.init(true);
        this.limitClick = this.node.getComponent("LimitClick");
      },
      init: function init(useOldData) {
        void 0 === useOldData && (useOldData = false);
        this.coinNum = useOldData ? cc.Mgr.game.onlineCoinNum : BigInt(0);
        this.numLbl.string = cc.Mgr.Utils.getNumStr2(this.coinNum);
        this.durTime = 0;
        this.proBar.progress = 0;
        this.schedule(this.caculateNum, .1);
      },
      caculateNum: function caculateNum() {
        this.durTime += 1;
        if (this.durTime < 100) {
          var money = cc.Mgr.Utils.getNumStr2(this.coinNum);
          this.numLbl.string = money;
          this.proBar.progress = this.durTime / 100;
        } else {
          var currentLevel = cc.Mgr.game.level > 60 ? 60 : cc.Mgr.game.level;
          var key = currentLevel + "_1";
          var lvdt = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.LevelData, key);
          var monsterData = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.ZombieData, lvdt.zombieID1);
          var monsterMoney = cc.Mgr.game.level > 60 ? monsterData.money * BigInt(Math.round(Math.pow(2.15, cc.Mgr.game.level % 60))) : monsterData.money;
          var num = monsterMoney / cc.Mgr.Config.onlineCoinRatio;
          var ratio = BigInt(1);
          this.clickTimes % 3 == 0 && (ratio = BigInt(6) / BigInt(5));
          this.durTime % 100 == 0 && 0 != this.durTime && (this.coinNum += num * ratio * BigInt(4) / BigInt(5));
          this.durTime = 0;
          cc.Mgr.game.onlineCoinNum = this.coinNum;
          var money = cc.Mgr.Utils.getNumStr2(this.coinNum);
          this.numLbl.string = money;
          this.proBar.progress = 0;
        }
      },
      getCoin: function getCoin() {
        if (false == this.limitClick.clickTime()) return;
        if (this.coinNum <= 0 || cc.Mgr.game.needGuide) return;
        this.unschedule(this.caculateNum);
        this.clickTimes += 1;
        cc.Mgr.game.money += this.coinNum;
        cc.Mgr.game.coin_gained_total += this.coinNum;
        cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "money");
        cc.Mgr.UIMgr.showJibEffect();
        this.init(false);
      }
    });
    module.exports = coinBonus;
    cc._RF.pop();
  }, {
    DataType: "DataType"
  } ],
  coinFly: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ed9d5mbKIFGBJ8c+nKAcyFh", "coinFly");
    "use strict";
    var coinFly = cc.Class({
      extends: cc.Component,
      properties: {
        numLbl: cc.Label
      },
      setData: function setData(data) {
        this.numLbl.string = "+" + data;
      }
    });
    module.exports = coinFly;
    cc._RF.pop();
  }, {} ],
  db_zombie: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "22d9asu/gNEuoVZVF55gNfx", "db_zombie");
    "use strict";
    var db_zombie = cc.Class({
      name: "db_zombie",
      statics: {
        dataLen: 160,
        dataHead: '["id", "hp", "spd", "money", "prefab", "gender"]',
        data: '{"1":[1,57,0.862529,137,"11jiangshi","male"],"2":[2,163,0.90565545,170,"12jiangshi","male"],"3":[3,413,0.9509382225,432,"18jiangshi","male"],"4":[4,705,0.998485133625,736,"21jiangshi","male"],"5":[5,1166,1.04840939081,1218,"19jiangshi","male"],"6":[6,1636,1.10082985969,1709,"22jiangshi","male"],"7":[7,2470,1.15587135329,2580,"23jiangshi","male"],"8":[8,3657,1.21366492019,3820,"20jiangshi","male"],"9":[9,8104,1.27434816625,8467,"01jiangshi","male"],"10":[10,17947,1.33806557522,18751,"02jiangshi","male"],"11":[11,39752,1.40496885378,41533,"03jiangshi","male"],"12":[12,88056,1.47521729581,92000,"04jiangshi","female"],"13":[13,195038,1.54897816091,203774,"05jiangshi","male"],"14":[14,419648,1.57995772459,438444,"06jiangshi","male"],"15":[15,902906,1.61155687837,943347,"07jiangshi","male"],"16":[16,1942629,1.64378801629,2029640,"08jiangshi","female"],"17":[17,4179527,1.67666377692,4366728,"09jiangshi","female"],"18":[18,8991989,1.71019705254,9394740,"10jiangshi","male"],"19":[19,19345313,1.74440099316,20211789,"13jiangshi","male"],"20":[20,41618614,1.77928901264,43482712,"14jiangshi","male"],"21":[21,89534672,1.81487479372,93544930,"32jiangshi","male"],"22":[22,192613493,1.85117228909,201240651,"15jiangshi","male"],"23":[23,414356456,1.88819573453,432915482,"28jiangshi","male"],"24":[24,891360763,1.92595964995,931284812,"16jiangshi","male"],"25":[25,1917454133,1.92595964995,2003336903,"29jiangshi","male"],"26":[26,4124664141,1.92595964995,4309407848,"27jiangshi","male"],"27":[27,8872467162,1.92595964995,9269864966,"30jiangshi","male"],"28":[28,19085013790,1.92595964995,19939831558,"17jiangshi","male"],"29":[29,41051864668,1.92595964995,42890577687,"31jiangshi","male"],"30":[30,88301015025,1.92595964995,92256017488,"26jiangshi","male"],"31":[31,189140774188,1.92595964995,197612389464,"34jiangshi","female"],"32":[32,405139538313,1.92595964995,423285738234,"45jiangshi","male"],"33":[33,867808891065,1.92595964995,906678051296,"24jiangshi","male"],"34":[34,1858846644666,1.92595964995,1942104385880,"25jiangshi","male"],"35":[35,3981649512877,1.92595964995,4159987594558,"35jiangshi","male"],"36":[36,8528693256581,1.92595964995,8910693427544,"33jiangshi","male"],"37":[37,18268460955598,1.92595964995,19086705321800,"37jiangshi","male"],"38":[38,39131043366891,1.92595964995,40883722799296,"36jiangshi","male"],"39":[39,83818694891880,1.92595964995,87572934236092,"43jiangshi","male"],"40":[40,179539644458409,1.92595964995,187581225133709,"42jiangshi","male"],"41":[41,384573918429912,1.92595964995,401798984236404,"44jiangshi","male"],"42":[42,823757333276871,1.92595964995,860653424234377,"46jiangshi","male"],"43":[43,1764488207879050,1.92595964995,1843519634710030,"47jiangshi","male"],"44":[44,3779533741276920,1.92595964995,3948819057548880,"48jiangshi","male"],"45":[45,8095761273815170,1.92595964995,8458370421269710,"49jiangshi","male"],"46":[46,17341120648512100,1.92595964995,18117829442359700,"50jiangshi","male"],"47":[47,37144680429112896,1.92595964995,38808390665534496,"51jiangshi","male"],"48":[48,79563905479159904,1.92595964995,83127572805574896,"52jiangshi","male"],"49":[49,170425885536360000,1.92595964995,178059260949540992,"49_enemy","male"],"50":[50,365052246818883968,1.92595964995,381402936953918016,"50_enemy","male"],"51":[51,781941912686050048,1.92595964995,816965090955292032,"51_enemy","male"],"52":[52,1674919576973519872,1.92595964995,1749939224826240000,"52_enemy","female"],"53":[53,3587677733877279744,1.92595964995,3748369819577800192,"53_enemy","male"],"54":[54,7684805705965119488,1.92595964995,8029008153535639552,"54_enemy","male"],"55":[55,16460853822177300480,1.92595964995,17198135464873299968,"55_enemy","male"],"56":[56,35259148887103799296,1.92595964995,36838406165758701568,"56_enemy","female"],"57":[57,75525096916176306176,1.92595964995,78907866007055106048,"57_enemy","female"],"58":[58,161774757594450001920,1.92595964995,169020648987112013824,"58_enemy","male"],"59":[59,346521530767310979072,1.92595964995,362042230130394005504,"59_enemy","male"],"60":[60,742249118903579967488,1.92595964995,775494456939304058880,"60_enemy","male"],"101":[101,1567,0.575019333672,1637,"11jiangshi","male"],"102":[102,2351,0.6037703,2456,"12jiangshi","male"],"103":[103,4231,0.633958815,4421,"18jiangshi","male"],"104":[104,7680,0.66565675575,8024,"21jiangshi","male"],"105":[105,14576,0.698939593538,15229,"19jiangshi","male"],"106":[106,29152,0.733886573468,30458,"22jiangshi","male"],"107":[107,61754,0.770580902192,64520,"23jiangshi","male"],"108":[108,137144,0.809109946794,143287,"20jiangshi","male"],"109":[109,303912,0.84956544383,317524,"01jiangshi","male"],"110":[110,673026,0.892043716478,703171,"02jiangshi","male"],"111":[111,1490720,0.93664590286,1557490,"03jiangshi","male"],"112":[112,3302124,0.983478197546,3450026,"04jiangshi","female"],"113":[113,7313952,1.03265210727,7641543,"05jiangshi","male"],"114":[114,15736814,1.05330514905,16441666,"06jiangshi","male"],"115":[115,33859002,1.07437125293,35375547,"07jiangshi","male"],"116":[116,72848617,1.09585867786,76111506,"08jiangshi","female"],"117":[117,156732268,1.11777585128,163752306,"09jiangshi","female"],"118":[118,337199614,1.14013136802,352302785,"10jiangshi","male"],"119":[119,725449247,1.16293399544,757942119,"13jiangshi","male"],"120":[120,1553912289,1.23411485973,1623512021,"14jiangshi","male"],"121":[121,3357550213,1.20991652847,3507934887,"32jiangshi","male"],"122":[122,7223005995,1.23411485973,7546524433,"15jiangshi","male"],"123":[123,15538367121,1.25879715703,16234330585,"28jiangshi","male"],"124":[124,33426028646,1.28397309997,34923180469,"16jiangshi","male"],"125":[125,71904529998,1.28397309997,75125133896,"29jiangshi","male"],"126":[126,154674905317,1.28397309997,161602794327,"27jiangshi","male"],"127":[127,332717518589,1.28397309997,347619936247,"30jiangshi","male"],"128":[128,715688017161,1.28397309997,747743683449,"17jiangshi","male"],"129":[129,1539444925073,1.28397309997,1608396663267,"31jiangshi","male"],"130":[130,3311288063449,1.28397309997,3459600655811,"26jiangshi","male"],"131":[131,7092779031898,1.28397309997,7410464604736,"34jiangshi","female"],"132":[132,15192732686449,1.28397309997,15873215183475,"45jiangshi","male"],"133":[133,32542833414490,1.28397309997,34000426923126,"24jiangshi","male"],"134":[134,69706749174357,1.28397309997,72828914469877,"25jiangshi","male"],"135":[135,149311856732109,1.28397309997,155999534795140,"35jiangshi","male"],"136":[136,319825997120177,1.28397309997,334151003531189,"33jiangshi","male"],"137":[137,685067285831420,1.28397309997,715751449563808,"37jiangshi","male"],"138":[138,1467414126250900,1.28397309997,1533139604965670,"36jiangshi","male"],"139":[139,3143201058429420,1.28397309997,3283985033836460,"43jiangshi","male"],"140":[140,6732736667155810,1.28397309997,7034295942477690,"42jiangshi","male"],"141":[141,14421521941047700,1.28397309997,15067461908787200,"44jiangshi","male"],"142":[142,30890899997724100,1.28397309997,32274503408622100,"46jiangshi","male"],"143":[143,66168307795125000,1.28397309997,69131986301268496,"47jiangshi","male"],"144":[144,141732515297158000,1.28397309997,148080714657316992,"48jiangshi","male"],"145":[145,303591047766512000,1.28397309997,317188890795972992,"49jiangshi","male"],"146":[146,650292024315868032,1.28397309997,679418604084974976,"50jiangshi","male"],"147":[147,1392925516084590080,1.28397309997,1455314649950020096,"51jiangshi","male"],"148":[148,2983646455453190144,1.28397309997,3117283980192929792,"52jiangshi","male"],"149":[149,6390970707580739584,1.28397309997,6677222285573260288,"49_enemy","male"],"150":[150,13689459255637899264,1.28397309997,14302610135697899520,"50_enemy","male"],"151":[151,29322821725576499200,1.28397309997,30636190910664998912,"51_enemy","male"],"152":[152,62809484136184799232,1.28397309997,65622720930644402176,"52_enemy","female"],"153":[153,134537915019708006400,1.28397309997,140563868233440002048,"53_enemy","male"],"154":[154,288180213972213989376,1.28397309997,301087805756029009920,"54_enemy","male"],"155":[155,617282018328482021376,1.28397309997,644930079929414057984,"55_enemy","male"],"156":[156,1322218083259610038272,1.28397309997,1381440231208799961088,"56_enemy","female"],"157":[157,2832191134342080102400,1.28397309997,2959044975249260019712,"57_enemy","female"],"158":[158,6066553409760740245504,1.28397309997,6338274336983910187008,"58_enemy","male"],"159":[159,12994557403707499085824,1.28397309997,13576583629819500036096,"59_enemy","male"],"160":[160,27834341958741498265600,1.28397309997,29081042135073498857472,"60_enemy","male"]}'
      }
    });
    module.exports = db_zombie;
    cc._RF.pop();
  }, {} ],
  dieSmoke: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "34c08P1qOFNJZ2gubC9oYrD", "dieSmoke");
    "use strict";
    var EffectType = require("EffectType");
    var dieSmoke = cc.Class({
      extends: cc.Component,
      properties: {
        dragon: dragonBones.ArmatureDisplay
      },
      start: function start() {
        this.dragon.on(dragonBones.EventObject.COMPLETE, this.onAnimComplete, this);
      },
      onAnimComplete: function onAnimComplete() {
        null != this.callback && this.callback();
        cc.Mgr.EffectMgr.ObBackToPool(this.node, EffectType.DieSmoke);
      },
      playAnimation: function playAnimation(cb) {
        this.callback = null;
        this.callback = cb;
        this.dragon.playAnimation("Sprite", 1);
      }
    });
    module.exports = dieSmoke;
    cc._RF.pop();
  }, {
    EffectType: "EffectType"
  } ],
  doubleCoinUI: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "395acIAHrhPibXMtqOyXRVx", "doubleCoinUI");
    "use strict";
    var doubleCoinUI = cc.Class({
      extends: cc.Component,
      properties: {
        adsIconNode: cc.Node,
        freeLabelNode: cc.Label,
        desLabel: cc.Label,
        timeTipLabel: cc.Label,
        content: cc.Node,
        blurBg: cc.Node,
        spriteCoin: cc.Sprite,
        nomarlM: cc.Material,
        grayM: cc.Material,
        title: cc.Node,
        title_zh: cc.Node,
        title_ja: cc.Node,
        title_ru: cc.Node
      },
      onLoad: function onLoad() {
        this.limitClick = this.node.getComponent("LimitClick");
      },
      start: function start() {
        this.title.active = false;
        this.title_zh.active = false;
        this.title_ja.active = false;
        this.title_ru.active = false;
        "Japanese" === cc.Mgr.Config.language ? this.title_ja.active = true : "Simplified Chinese" === cc.Mgr.Config.language || "Traditional Chinese" === cc.Mgr.Config.language ? this.title_zh.active = true : "Russian" === cc.Mgr.Config.language ? this.title_ru.active = true : this.title.active = true;
      },
      showUI: function showUI() {
        this.desLabel.string = cc.Mgr.Utils.getTranslation("trebleCoin-des-1");
        this.timeTipLabel.string = cc.Mgr.Utils.getTranslation("doubleCoin-des-2");
        this.freeLabelNode.node.x = 20;
        this.freeLabelNode.string = cc.Mgr.Utils.getTranslation("btn-get");
        this.blurBg.opacity = 0;
        this.content.opacity = 0;
        this.content.setScale(.5);
        cc.tween(this.blurBg).to(.05, {
          opacity: 255
        }).call().start();
        cc.tween(this.content).to(.15, {
          opacity: 255,
          scale: 1
        }).start();
        cc.Mgr.admob.showBanner("getDoubleReward");
        this.checkAvailabelAds = cc.Mgr.admob.checkAvailableRewardedAd();
        this.checkAvailabelAds ? this.spriteCoin.setMaterial(0, this.nomarlM) : this.spriteCoin.setMaterial(0, this.grayM);
      },
      closeUI: function closeUI() {
        cc.Mgr.AudioMgr.playSFX("click");
        cc.Mgr.admob.hideBanner("getDoubleReward");
        var self = this;
        cc.tween(this.blurBg).to(.15, {
          opacity: 0
        }).start();
        cc.tween(this.content).to(.15, {
          opacity: 0,
          scale: .5
        }).call(function() {
          self.node.active = false;
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount("doubleCoin");
      },
      adsDouble: function adsDouble() {
        if (false == this.limitClick.clickTime()) return;
        if (false === this.checkAvailabelAds) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("ad-tip-3"), "", this.node);
          return;
        }
        var self = this;
        cc.Mgr.admob.showRewardedVideoAd(function(_state) {
          _state && cc.Mgr.UIMgr.InGameUI.startDoubleCoinState();
        }, this.node, "doubleCoin", this);
        self.closeUI();
      },
      updateAdsBtnState: function updateAdsBtnState() {
        this.checkAvailabelAds = cc.Mgr.admob.checkAvailableRewardedAd();
        this.checkAvailabelAds ? this.spriteCoin.setMaterial(0, this.nomarlM) : this.spriteCoin.setMaterial(0, this.grayM);
        cc.Mgr.UIMgr.InGameUI.showDoubleCoinBtn(false);
      }
    });
    module.exports = doubleCoinUI;
    cc._RF.pop();
  }, {} ],
  exchangeCoinUI: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "38696cc7WhLl6WHE7OD+t4X", "exchangeCoinUI");
    "use strict";
    var DataType = require("DataType");
    var MyEnum = require("MyEnum");
    var exchangeCoinUI = cc.Class({
      extends: cc.Component,
      properties: {
        coinLabel: cc.Label,
        lastNunDis: cc.Label,
        getBtnNode: cc.Node,
        gemLabel: cc.Label,
        maxNode: cc.Node,
        titleLabel: cc.Label,
        desLabel: cc.Label,
        maxCountLabel: cc.Label,
        content: cc.Node,
        blurBg: cc.Node,
        bottomNode: cc.Node,
        bottomCoinsLabel: cc.Label,
        bottomDesc: cc.Label,
        bottomBtnLabel: cc.Label
      },
      onLoad: function onLoad() {
        this.titleLabel.string = cc.Mgr.Utils.getTranslation("coinExchange-title");
        this.desLabel.string = cc.Mgr.Utils.getTranslation("coinExchange-des");
        this.maxCountLabel.string = cc.Mgr.Utils.getTranslation("coinExchange-max");
        this.limitClick = this.node.getComponent("LimitClick");
        this.allowShow = true;
      },
      coinNum: function coinNum() {
        var beishu = [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 20 ];
        var shopSortDt = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.ShopData, cc.Mgr.game.plantMaxLv);
        var index = 0;
        var plantIds = {};
        var index = 0;
        var i = 0;
        for (var key in shopSortDt) {
          var dt = shopSortDt[key];
          if (dt == MyEnum.ShopItemType.Money) {
            plantIds[i] = cc.Mgr.game.plantMaxLv - index + 1;
            i++;
          }
          index++;
        }
        var buyNum = cc.Mgr.game.plantBuyRecord[plantIds[0]];
        var price1 = cc.Mgr.game.caculatePlantPrice(plantIds[0], buyNum);
        var buyNum = cc.Mgr.game.plantBuyRecord[plantIds[1]];
        var price2 = cc.Mgr.game.caculatePlantPrice(plantIds[1], buyNum);
        var plantData1 = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData, plantIds[0]);
        var plantData2 = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData, plantIds[1]);
        var currentGems = 30;
        plantData1.gem > 0 && plantData2.gem > 0 && (currentGems = plantData1.gem + plantData2.gem);
        var price = 0;
        price = (price1 + price2) / BigInt(currentGems);
        return price * BigInt(beishu[cc.Mgr.game.currentExchangeCount]);
      },
      showUI: function showUI() {
        this.refreshUI();
        cc.Mgr.admob.showBanner("exchangeCoin");
        this.blurBg.opacity = 0;
        this.content.opacity = 0;
        this.content.setScale(.5);
        cc.tween(this.blurBg).to(.05, {
          opacity: 255
        }).call().start();
        cc.tween(this.content).to(.15, {
          opacity: 255,
          scale: 1
        }).start();
        this.showPaymentCount = 0;
        this.bottomDesc.string = cc.Mgr.Utils.getTranslation("buy-coins-desc");
        this.bottomBtnLabel.string = cc.Mgr.payment.priceList[11];
        var coinNumber = cc.Mgr.UIMgr.getCoinNumber() * BigInt(30);
        coinNumber = coinNumber < BigInt(1e6) ? BigInt(1e6) : coinNumber;
        this.getCoin = coinNumber *= BigInt(2);
        var coinString = cc.Mgr.Utils.getNumStr2(coinNumber);
        this.bottomCoinsLabel.string = coinString;
        this.bottomDesc.string = cc.Mgr.Utils.getTranslation("buy-coins-desc", [ coinString ]);
        this.bottomNode.active = true;
      },
      onClickGet: function onClickGet() {
        var _this = this;
        if (false == this.limitClick.clickTime()) return;
        var currentProductID = this.isSale ? 11 : 7;
        currentProductID = 11;
        cc.Mgr.payment.purchaseByIndex(currentProductID, function() {
          cc.Mgr.UIMgr.openAssetGetUI("money", _this.getCoin, "payment");
          _this.closeUI();
        }, cc.Mgr.UIMgr.tipRoot);
      },
      refreshUI: function refreshUI() {
        this.node.active = true;
        this.exchangeCoinNum = this.coinNum();
        this.exchangeGemNum = cc.Mgr.UIMgr.gemNum();
        this.coinLabel.string = "x" + cc.Mgr.Utils.getNumStr2(this.exchangeCoinNum);
        this.gemLabel.string = this.exchangeGemNum;
        var last = "{0} / {1}";
        var dis = last.format(cc.Mgr.game.exchangeCoinConfig.maxExchangeNum - cc.Mgr.game.currentExchangeCount, cc.Mgr.game.exchangeCoinConfig.maxExchangeNum);
        this.lastNunDis.string = dis;
        if (cc.Mgr.game.exchangeCoinConfig.maxExchangeNum == cc.Mgr.game.currentExchangeCount) {
          this.maxNode.active = true;
          this.getBtnNode.active = false;
        } else {
          this.maxNode.active = false;
          this.getBtnNode.active = true;
        }
      },
      closeUI: function closeUI() {
        cc.Mgr.AudioMgr.playSFX("click");
        cc.Mgr.admob.hideBanner("exchangeCoin");
        var self = this;
        cc.tween(this.blurBg).to(.15, {
          opacity: 0
        }).start();
        cc.tween(this.content).to(.15, {
          opacity: 0,
          scale: .5
        }).call(function() {
          self.node.active = false;
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount("exchange");
      },
      exchangeButtonOnclick: function exchangeButtonOnclick() {
        var _this2 = this;
        if (cc.Mgr.game.currentExchangeCount >= cc.Mgr.game.exchangeCoinConfig.maxExchangeNum) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("max-exchange"), "", this.node);
          return;
        }
        if (this.exchangeGemNum > cc.Mgr.game.gems) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("NoGems"), "gem", this.node);
          if (true === this.allowShow) {
            this.allowShow = false;
            setTimeout(function() {
              cc.Mgr.UIMgr.openPaymentUI(true);
              _this2.allowShow = true;
            }, 300);
          }
          return;
        }
        cc.Mgr.game.gems -= this.exchangeGemNum;
        cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "gem");
        cc.Mgr.game.currentExchangeCount++;
        cc.Mgr.UIMgr.openAssetGetUI("money", this.exchangeCoinNum, "exchange");
        this.refreshUI();
      }
    });
    module.exports = exchangeCoinUI;
    cc._RF.pop();
  }, {
    DataType: "DataType",
    MyEnum: "MyEnum"
  } ],
  flowerPotManage: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "97b38ITPMpKiIEavRt8jNVV", "flowerPotManage");
    "use strict";
    var MyEnum = require("MyEnum");
    var DataType = require("DataType");
    var flowerPotManage = cc.Class({
      extends: cc.Component,
      properties: {},
      statics: {
        instance: null
      },
      init: function init(callback) {
        var self = this;
        self.loadedPrefabNum = 0;
        self.loadedPrefabNum++;
        cc.loader.loadRes("prefab/flowerPot/HuaPen_v1", function(err, prefab) {
          if (err) {
            cc.error(err.message || err);
            return;
          }
          self.loadedPrefabNum--;
          0 == self.loadedPrefabNum && callback();
          self.airDropFlowerFot_Prefab = prefab;
        });
        self.loadedPrefabNum++;
        cc.loader.loadRes("prefab/flowerPot/HuaPen_v2", function(err, prefab) {
          if (err) {
            cc.error(err.message || err);
            return;
          }
          self.loadedPrefabNum--;
          0 == self.loadedPrefabNum && callback();
          self.droneFlowerFot_Prefab = prefab;
        });
        self.loadedPrefabNum++;
        cc.loader.loadRes("prefab/flowerPot/HuaPen_v3", function(err, prefab) {
          if (err) {
            cc.error(err.message || err);
            return;
          }
          self.loadedPrefabNum--;
          0 == self.loadedPrefabNum && callback();
          self.turnTableAndBuyFlowerFot_Prefab = prefab;
        });
        this.droneFlowerFot = {};
        this.droneFlowerFot.num = cc.Mgr.game.dronePot.length;
        this.droneFlowerFot.type = MyEnum.FlowerPotType.Drone;
        this.droneFlowerFot.plantInfos = cc.Mgr.game.dronePot;
        this.turnTableFlowerFot = {};
        this.turnTableFlowerFot.type = MyEnum.FlowerPotType.Turntable;
        this.turnTableFlowerFot.num = cc.Mgr.game.turntablePot.length;
        this.turnTableFlowerFot.plantInfos = cc.Mgr.game.turntablePot;
        this.shopFlowerFot = {};
        this.shopFlowerFot.type = MyEnum.FlowerPotType.Shop;
        this.shopFlowerFot.num = cc.Mgr.game.shopBuyPot.length;
        this.shopFlowerFot.plantInfos = cc.Mgr.game.shopBuyPot;
        var timeInterVal = cc.Mgr.Utils.GetSysTime() - cc.Mgr.UserDataMgr.lastPlayTime;
        var spaceGirdNun = cc.Mgr.game.getSpaceGirdNum() - this.droneFlowerFot.num - this.turnTableFlowerFot.num - this.shopFlowerFot.num;
        var canAirDropNun = Math.floor(timeInterVal / cc.Mgr.game.airDropTime);
        var airDropNun = 0;
        airDropNun = spaceGirdNun <= 0 ? 0 : spaceGirdNun >= canAirDropNun ? canAirDropNun : spaceGirdNun;
        this.airDropFlowerFot = {};
        this.airDropFlowerFot.num = airDropNun;
        this.airDropFlowerFot.type = MyEnum.FlowerPotType.Drop;
        this.airDropFlowerFot.plantInfo = [];
      },
      noneDropFlowerFotNun: function noneDropFlowerFotNun() {
        var num = this.turnTableFlowerFot.num + this.shopFlowerFot.num + this.droneFlowerFot.num + this.airDropFlowerFot.num;
        return num;
      },
      haveFlowerFot: function haveFlowerFot() {
        var num = this.turnTableFlowerFot.num + this.shopFlowerFot.num + this.droneFlowerFot.num + this.airDropFlowerFot.num;
        return num > 0;
      },
      addDropFlowerFot: function addDropFlowerFot(maxNum) {
        (0 == this.airDropFlowerFot.num && 0 == maxNum || this.airDropFlowerFot.num < maxNum) && this.airDropFlowerFot.num++;
      },
      addDroneFlowerFot: function addDroneFlowerFot(level, num) {
        for (var i = 0; i < num; i++) {
          this.droneFlowerFot.plantInfos[this.droneFlowerFot.num] = level;
          this.droneFlowerFot.num++;
        }
      },
      addTurnTableFlowerFot: function addTurnTableFlowerFot(level, num, callback) {
        void 0 === num && (num = 1);
        void 0 === callback && (callback = null);
        for (var i = 0; i < num; i++) {
          this.turnTableFlowerFot.plantInfos[this.turnTableFlowerFot.num] = level;
          this.turnTableFlowerFot.num++;
        }
      },
      addShopFlowerFot: function addShopFlowerFot(level, num, callback) {
        void 0 === num && (num = 1);
        void 0 === callback && (callback = null);
        for (var i = 0; i < num; i++) {
          this.shopFlowerFot.plantInfos[this.shopFlowerFot.num] = level;
          this.shopFlowerFot.num++;
        }
      },
      getFlowerFot: function getFlowerFot() {
        var flowerFot = null;
        if (this.turnTableFlowerFot.num > 0) {
          this.turnTableFlowerFot.num--;
          flowerFot = cc.instantiate(this.turnTableAndBuyFlowerFot_Prefab);
          var flowerFotItem = flowerFot.getComponent("flowerPot");
          var level = this.turnTableFlowerFot.plantInfos[this.turnTableFlowerFot.num];
          flowerFotItem.setPlantInfo(level);
          this.turnTableFlowerFot.plantInfos.length--;
          return flowerFot;
        }
        if (this.shopFlowerFot.num > 0) {
          this.shopFlowerFot.num--;
          flowerFot = cc.instantiate(this.turnTableAndBuyFlowerFot_Prefab);
          var flowerFotItem = flowerFot.getComponent("flowerPot");
          var level = this.shopFlowerFot.plantInfos[this.shopFlowerFot.num];
          flowerFotItem.setPlantInfo(level);
          this.shopFlowerFot.plantInfos.length--;
          return flowerFot;
        }
        if (this.droneFlowerFot.num > 0) {
          this.droneFlowerFot.num--;
          flowerFot = cc.instantiate(this.droneFlowerFot_Prefab);
          var flowerFotItem = flowerFot.getComponent("flowerPot");
          var level = this.droneFlowerFot.plantInfos[this.droneFlowerFot.num];
          flowerFotItem.setPlantInfo(level);
          this.droneFlowerFot.plantInfos.length--;
          return flowerFot;
        }
        if (this.airDropFlowerFot.num > 0) {
          this.airDropFlowerFot.num--;
          flowerFot = cc.instantiate(this.airDropFlowerFot_Prefab);
          var airdropData = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.AirDropData, cc.Mgr.game.plantMaxLv);
          var level = 0;
          if (0 == airdropData.Plant2) level = airdropData.Plant1; else {
            var random = Math.floor(100 * Math.random());
            level = random % 2 == 0 ? airdropData.Plant1 : airdropData.Plant2;
          }
          var flowerFotItem = flowerFot.getComponent("flowerPot");
          flowerFotItem.setPlantInfo(level);
          return flowerFot;
        }
        return null;
      },
      onLoad: function onLoad() {
        flowerPotManage.instance = this;
      },
      start: function start() {}
    });
    module.exports = flowerPotManage;
    cc._RF.pop();
  }, {
    DataType: "DataType",
    MyEnum: "MyEnum"
  } ],
  flowerPotOpen: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a16c789/ntAX7ld24FiLTFs", "flowerPotOpen");
    "use strict";
    var EffectType = require("EffectType");
    var flowerPotOpen = cc.Class({
      extends: cc.Component,
      properties: {
        dragon: dragonBones.ArmatureDisplay
      },
      start: function start() {
        this.dragon.on(dragonBones.EventObject.COMPLETE, this.onAnimComplete, this);
      },
      onAnimComplete: function onAnimComplete() {
        cc.Mgr.EffectMgr.ObBackToPool(this.node, EffectType.flowerPotOpen);
      },
      playAnimation: function playAnimation() {
        this.dragon.playAnimation("newAnimation", 1);
      }
    });
    module.exports = flowerPotOpen;
    cc._RF.pop();
  }, {
    EffectType: "EffectType"
  } ],
  flowerPot: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9d715P7w+tAW4A78b3FtBtr", "flowerPot");
    "use strict";
    var MyEnum = require("MyEnum");
    var Event = require("Event");
    var flowerPot = cc.Class({
      extends: cc.Component,
      properties: {
        dragon: dragonBones.ArmatureDisplay
      },
      init: function init(index, pos) {
        var _this = this;
        this.index = index;
        this.node.position = cc.v2(pos.x, pos.y + 200);
        cc.tween(this.node).to(.1, {
          position: cc.v2(pos.x, pos.y)
        }, {
          easing: "quadIn"
        }).call(function() {
          cc.Mgr.game.needGuide || _this.scheduleOnce(_this.playDianji, 8);
        }).start();
        this.node.zIndex = 50 + index;
        cc.Mgr.DragonMgr.create(MyEnum.DragonType.plant, this.dragon);
        cc.Mgr.DragonMgr.playAnimation(MyEnum.DragonType.plant, this.dragon, "idle", true);
        this.dragon.on(dragonBones.EventObject.FRAME_EVENT, this.onFrameEvent, this);
        this.dragon.on(dragonBones.EventObject.COMPLETE, this.plantDestroy, this);
        this.node.on(cc.Node.EventType.TOUCH_START, function(event) {
          this.TouchStart(event);
        }, this);
        cc.Mgr.AudioMgr.playSFX(MyEnum.AudioType.flower_pot_land);
        this.hasTouched = false;
      },
      setPlantInfo: function setPlantInfo(level) {
        this.level = level;
      },
      setShowDetailsInUI: function setShowDetailsInUI(scale, color, isBig) {
        void 0 === isBig && (isBig = true);
        this.node.getChildByName("shadow").active = false;
        this.dragon.node.color = cc.Mgr.Utils.hexToColor(color);
        isBig && this.dragon.playAnimation("idle", -1);
        this.node.scale = scale;
      },
      playDianji: function playDianji() {
        this.hasTouched = true;
        cc.Mgr.DragonMgr.playAnimation(MyEnum.DragonType.plant, this.dragon, "open", false);
      },
      onFrameEvent: function onFrameEvent(e) {
        if ("O" == e.name) {
          var param = {};
          param.level = this.level;
          param.index = this.index;
          cc.Mgr.plantMgr.flowerPotOpen(param);
          cc.Mgr.game.openEggCount++;
          if (cc.Mgr.game.openEggCount >= 10) {
            cc.Mgr.game.openEggCount = 0;
            cc.Mgr.plantMgr.hasLockGrid();
          }
        }
      },
      TouchStart: function TouchStart(event) {
        if (true === this.hasTouched) return;
        this.hasTouched = true;
        cc.Mgr.DragonMgr.playAnimation(MyEnum.DragonType.plant, this.dragon, "open", false);
        this.unscheduleAllCallbacks();
      },
      plantDestroy: function plantDestroy() {
        cc.Mgr.DragonMgr.deleteDragon(MyEnum.DragonType.plant, this.dragon);
        this.node.destroy();
        cc.Mgr.game.needGuide && cc.Mgr.game.curGuideStep == MyEnum.GuideType.guide6 && cc.director.GlobalEvent.emit(Event.singleGuideComplete, {
          step: MyEnum.GuideType.guide6
        });
      },
      start: function start() {}
    });
    module.exports = flowerPot;
    cc._RF.pop();
  }, {
    Event: "Event",
    MyEnum: "MyEnum"
  } ],
  game: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3d2ceceV2lFhoeGwWKzLlSQ", "game");
    "use strict";
    var MyEnum = require("MyEnum");
    var Config = require("Config");
    var Event = require("Event");
    var MissionType = require("MissionType");
    var DataType = require("DataType");
    var AchieveType = require("AchieveType");
    var game = cc.Class({
      ctor: function ctor() {
        this.init();
      },
      properties: {
        level: 1,
        curBoshu: 1,
        curLevelMaxBoshu: 0,
        money: 0,
        gems: 0,
        plantMaxLv: 1,
        rageTimer: 0,
        autoTimer: 0,
        fireTimer: 0,
        iceTimer: 0,
        critTimer: 0,
        plantAttackRange: 400,
        bulletSpeed: 500,
        zombieSpeedCoefficient: 55,
        zombieDistance: 200,
        spinADResetTime: 0,
        spinADTimeCount: 0,
        spinUseGemTime: 0,
        coinPos: cc.Vec2,
        gemPos: cc.Vec2,
        curProgress: 0,
        needGuide: false,
        curGuideStep: 0,
        plantMergeGuideTime: 20,
        plantMergeGuideHideTime: 20,
        airDropTime: 16,
        lastAdsGetPlantTime: 0,
        enterGameTimeStamp: 0,
        shareSwitch: false,
        shareMaxNum: 10,
        doubleCoinLeftTime: 0,
        doubleBtnIntervalTime: 0,
        doubleCoinState: false,
        keepInGameTime: 0,
        tipBuyTimes: 0,
        canBuyPlantId: 1,
        onlineCoinNum: 0,
        pickOutMaxLvPlant: -1,
        lastSignDate: 0,
        hasSignDayNum: 0,
        lastInviteDate: 0,
        clearCg: true,
        noFillCount: 0
      },
      statics: {
        instance: null,
        getInstance: function getInstance() {
          null == game.instance && (game.instance = new game());
          return game.instance;
        }
      },
      init: function init() {
        this.plantBuyRecord = {};
        this.plantsPK = new Array();
        this.achievementProgress = new Array();
        this.dailyMissions = new Array();
        this.plantsOwn = new Array();
        this.exchangeCoinConfig = {};
        this.exchangeCoinConfig.openLevel = 4;
        this.exchangeCoinConfig.buyBuyButtonWight = 30;
        this.exchangeCoinConfig.wrongClickWight = 50;
        this.exchangeCoinConfig.maxExchangeNum = 20;
        this.exchangeCoinConfig.bannerUpNum = 3;
        this.freeFlag = {};
        this.freeFlag.TurnTable = true;
        this.currentExchangeCount = 0;
        this.needShowExchangeCoinCount = 0;
        this.needShowIAPCount = 0;
        this.winSize = cc.view.getVisibleSize();
      },
      resetKeepInGameTime: function resetKeepInGameTime() {
        this.keepInGameTime = cc.Mgr.game.dailyMissions[4].progress;
      },
      resetplantBuyRecord: function resetplantBuyRecord() {
        for (var i = 0; i < cc.Mgr.Config.allPlantCount; i++) this.plantBuyRecord[i + 1] = 0;
      },
      pauseGame: function pauseGame() {
        cc.game.pause();
        cc.Mgr.AudioMgr.pauseAll();
      },
      resumeGame: function resumeGame() {
        cc.game.resume();
        cc.Mgr.AudioMgr.resumeAll();
        cc.Mgr.game.enterGameTimeStamp = cc.Mgr.Utils.GetSysTime();
        null != cc.Mgr.UIMgr.bigResultNode && true === cc.Mgr.UIMgr.bigResultNode.active && cc.Mgr.UIMgr.bigResultNode.getComponent("bigResult").reSchedule();
      },
      updatePlantBuyRecord: function updatePlantBuyRecord(lv) {
        this.plantBuyRecord && this.plantBuyRecord[lv] ? this.plantBuyRecord[lv] += 1 : this.plantBuyRecord[lv] = 0;
      },
      getSpaceGirdNum: function getSpaceGirdNum() {
        var num = 0;
        for (var i = 0; i < this.plantsPK.length; i++) {
          var pk = this.plantsPK[i];
          pk.type == MyEnum.GridState.none && num++;
        }
        return num;
      },
      getPlantsPK: function getPlantsPK() {
        var plantsPK = [];
        for (var i = 0; i < cc.Mgr.plantMgr.grids.length; i++) {
          var plant = cc.Mgr.plantMgr.grids[i];
          var pk = {};
          pk.type = plant.type;
          if (pk.type == MyEnum.GridState.plant || pk.type == MyEnum.GridState.lock || pk.type == MyEnum.GridState.flowerPot) {
            pk.level = plant.content.level;
            pk.index = plant.content.index;
          }
          plantsPK.push(pk);
        }
        cc.Mgr.game.plantsPK = plantsPK;
        return 0 == plantsPK.length ? void 0 : plantsPK;
      },
      getTGAPlantLayer: function getTGAPlantLayer() {
        var plants = this.plantsPK;
        var layerInfo = "";
        for (var i = 0; i < plants.length; i++) {
          var plant = plants[i];
          plant.type == MyEnum.GridState.plant || plant.type == MyEnum.GridState.flowerPot ? layerInfo += plant.level : plant.type == MyEnum.GridState.lock ? layerInfo += "-1" : layerInfo += "0";
          i < plants.length - 1 && (layerInfo += "_");
        }
        return layerInfo;
      },
      getTGAPlantLayerByIndex: function getTGAPlantLayerByIndex(index) {
        var plant;
        if (null == cc.Mgr.plantMgr.grids || cc.Mgr.plantMgr.grids.length <= 0) {
          plant = this.plantsPK[index];
          return plant.type == MyEnum.GridState.plant || plant.type == MyEnum.GridState.flowerPot ? plant.level : plant.type == MyEnum.GridState.lock ? -1 : 0;
        }
        plant = cc.Mgr.plantMgr.grids[index];
        return plant.type == MyEnum.GridState.plant || plant.type == MyEnum.GridState.flowerPot ? plant.content.level : plant.type == MyEnum.GridState.lock ? -1 : 0;
      },
      getMissionProgressById: function getMissionProgressById(id) {
        for (var i = 0; i < this.dailyMissions.length; i++) {
          var dt = this.dailyMissions[i];
          if (id == dt.id) return dt;
        }
        return this.dailyMissions[0];
      },
      updateMissionProgressById: function updateMissionProgressById(id) {
        for (var i = 0; i < this.dailyMissions.length; i++) if (id == this.dailyMissions[i].id) {
          if ((id < MissionType.AdsShow || id == MissionType.InviteCount) && this.dailyMissions[i].progress < this.dailyMissions[i].checkNum) this.dailyMissions[i].progress += 1; else if (id == MissionType.AdsShow || id == MissionType.InGameTime) if (this.dailyMissions[i].checklv) this.dailyMissions[i].checklv < cc.Mgr.Config.missionCheckList[id].length - 1 ? this.dailyMissions[i].progress += 1 : this.dailyMissions[i].progress < cc.Mgr.Config.missionCheckList[id][this.dailyMissions[i].checklv] && (this.dailyMissions[i].progress += 1); else {
            this.dailyMissions[i].checklv = 0;
            this.dailyMissions[i].progress += 1;
          }
          cc.director.GlobalEvent.emit(Event.checkMissionAndAchieve, {});
          return;
        }
      },
      updateMissionProgressByType: function updateMissionProgressByType(id, progress) {
        for (var i = 0; i < this.dailyMissions.length; i++) if (id == this.dailyMissions[i].id) {
          this.dailyMissions[i].progress = progress;
          return;
        }
      },
      claimMissionRewardById: function claimMissionRewardById(id) {
        for (var i = 0; i < this.dailyMissions.length; i++) if (id == this.dailyMissions[i].id) {
          if (id < MissionType.AdsShow || id == MissionType.InviteCount) {
            this.dailyMissions[i].claimed = 1;
            this.dailyMissions[i].progress = 0;
          } else if (id == MissionType.AdsShow || id == MissionType.InGameTime) if (this.dailyMissions[i].checklv) {
            this.dailyMissions[i].checklv += 1;
            if (this.dailyMissions[i].checklv > cc.Mgr.Config.missionCheckList[id].length - 1) {
              this.dailyMissions[i].claimed = 1;
              this.dailyMissions[i].progress = 0;
            }
          } else this.dailyMissions[i].checklv = 1;
          return;
        }
      },
      clearMissionDataToNextDay: function clearMissionDataToNextDay() {
        for (var i = 0; i < Config.missionDataList.length; i++) if (this.dailyMissions[i]) {
          this.dailyMissions[i].progress = 0;
          this.dailyMissions[i].checklv = 0;
          this.dailyMissions[i].claimed = 0;
        }
      },
      getAchieveDataById: function getAchieveDataById(id) {
        for (var i = 0; i < this.achievementProgress.length; i++) {
          var dt = this.achievementProgress[i];
          if (id == dt.id) return dt;
        }
        return this.achievementProgress[0];
      },
      updateAchieveProgressByType: function updateAchieveProgressByType(_type) {
        for (var i = 0; i < this.achievementProgress.length; i++) if (_type == this.achievementProgress[i].achType) {
          this.achievementProgress[i].progress += 1;
          return;
        }
      },
      claimAchieveRewardById: function claimAchieveRewardById(id) {
        for (var i = 0; i < this.achievementProgress.length; i++) if (id == this.achievementProgress[i].id) {
          this.achievementProgress[i].checklv += 1;
          this.achievementProgress[i].progress = 0;
          this.achievementProgress[i].checklv > 4 ? this.achievementProgress[i].finished = 1 : this.achievementProgress[i].finished = 0;
          return;
        }
      },
      updatePlantOwnsByLv: function updatePlantOwnsByLv(lv) {
        for (var i = 0; i < this.plantsOwn.length; i++) if (lv == this.plantsOwn[i].lv) {
          this.plantsOwn[i].ownNum += 1;
          cc.director.GlobalEvent.emit(Event.checkMissionAndAchieve, {});
          return;
        }
      },
      getPlantOwnsDataByLv: function getPlantOwnsDataByLv(lv) {
        for (var i = 0; i < this.plantsOwn.length; i++) if (lv == this.plantsOwn[i].lv) return this.plantsOwn[i].ownNum;
      },
      getDronePot: function getDronePot() {
        this.dronePot = cc.Mgr.flowerPotMgr.droneFlowerFot.plantInfos;
        return this.dronePot;
      },
      getTurntablePot: function getTurntablePot() {
        this.turntablePot = cc.Mgr.flowerPotMgr.turnTableFlowerFot.plantInfos;
        return this.turntablePot;
      },
      getShopBuyPot: function getShopBuyPot() {
        this.shopBuyPot = cc.Mgr.flowerPotMgr.shopFlowerFot.plantInfos;
        return this.shopBuyPot;
      },
      checkOutMissionIsFinished: function checkOutMissionIsFinished() {
        for (var i = 0; i < this.dailyMissions.length; i++) {
          var dt = this.dailyMissions[i];
          if (dt.misType < MissionType.AdsShow) {
            if (dt.progress >= dt.checkNum && 1 != dt.claimed) return true;
          } else if (dt.misType == MissionType.AdsShow) {
            if (0 == dt.checklv && dt.progress >= cc.Mgr.Config.missionCheckList[dt.id][0] && 1 != dt.claimed) return true;
            if (1 == dt.checklv && dt.progress >= cc.Mgr.Config.missionCheckList[dt.id][1] && 1 != dt.claimed) return true;
          } else if (dt.misType == MissionType.InGameTime) {
            if (0 == dt.checklv && dt.progress >= cc.Mgr.Config.missionCheckList[dt.id][0] && 1 != dt.claimed) return true;
            if (1 == dt.checklv && dt.progress >= cc.Mgr.Config.missionCheckList[dt.id][1] && 1 != dt.claimed) return true;
            if (2 == dt.checklv && dt.progress >= cc.Mgr.Config.missionCheckList[dt.id][2] && 1 != dt.claimed) return true;
          } else if (dt.misType == MissionType.InviteCount) {
            if (0 == dt.checklv && dt.progress >= cc.Mgr.Config.missionCheckList[dt.id][0] && 1 != dt.claimed) return true;
            if (1 == dt.checklv && dt.progress >= cc.Mgr.Config.missionCheckList[dt.id][1] && 1 != dt.claimed) return true;
          }
        }
        return false;
      },
      checkOutAchieveDataIsFinished: function checkOutAchieveDataIsFinished() {
        var checkLvNumList = [ 5, 20, 50, 100 ];
        var outList = [];
        for (var i = 0; i < this.achievementProgress.length; i++) {
          var dt = this.achievementProgress[i];
          if (0 != this.checkLvToGainGems(dt.id, dt.checklv) && 0 == dt.finished) {
            outList.length < 5 && outList.push(dt);
            dt.achType == AchieveType.Invite && outList.push(dt);
          }
        }
        for (var i = 0; i < outList.length; i++) {
          var da = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.AchievementData, outList[i].id);
          var checkNum = checkLvNumList[outList[i].checklv];
          if (outList[i].achType == AchieveType.Invite) {
            if (outList[i].progress >= checkNum) return true;
          } else {
            var plantOwnsNum = this.getPlantOwnsDataByLv(da.Level);
            if (plantOwnsNum >= checkNum) return true;
          }
        }
        return false;
      },
      checkLvToGainGems: function checkLvToGainGems(id, checklv) {
        var dt = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.AchievementData, id);
        if (0 == checklv) return dt.Gain_5;
        if (1 == checklv) return dt.Gain_20;
        if (2 == checklv) return dt.Gain_50;
        if (3 == checklv) return dt.Gain_100;
        if (4 == checklv) return dt.Gain_200;
      },
      caculatePlantPrice: function caculatePlantPrice(plantId, buyNum) {
        buyNum = buyNum || 0;
        var price = 0;
        var plantData = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData, plantId);
        price = plantId >= 1 && plantId <= 20 ? plantData.price * BigInt(Math.round(100 * Math.pow(1.1, buyNum))) / BigInt(100) : plantData.price * BigInt(Math.round(100 * Math.pow(1.2, buyNum))) / BigInt(100);
        return price;
      }
    });
    module.exports = game;
    cc._RF.pop();
  }, {
    AchieveType: "AchieveType",
    Config: "Config",
    DataType: "DataType",
    Event: "Event",
    MissionType: "MissionType",
    MyEnum: "MyEnum"
  } ],
  jinbiCtrl: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ddceegtwodP3oU90zxYMfDB", "jinbiCtrl");
    "use strict";
    var uiConfig = require("uiConfig");
    var MyEnum = require("MyEnum");
    cc.Class({
      extends: cc.Component,
      properties: {
        type: 0,
        jinbiEffectNode: cc.Node,
        jinbis: [ cc.Node ]
      },
      jinbiStart: function jinbiStart() {
        var self = this;
        var jinbiScript = this.jinbis[this.index].getComponent("jinbi");
        var targetPos;
        if (0 == this.type) {
          var worldPos_coin = cc.Mgr.UIMgr.topCoinNode.convertToWorldSpaceAR(this.node);
          var targetPos_coin = this.node.convertToNodeSpaceAR(worldPos_coin);
          targetPos_coin.x -= 20;
          targetPos = targetPos_coin;
        } else {
          var worldPos_gem = cc.Mgr.UIMgr.topGemNode.convertToWorldSpaceAR(this.node);
          var targetPos_gem = this.node.convertToNodeSpaceAR(worldPos_gem);
          targetPos_gem.x -= 20;
          targetPos = targetPos_gem;
        }
        var flyoutOffsetY = 0;
        this.flyout && (flyoutOffsetY = 200);
        var currentTargetPos = cc.v2(targetPos.x, targetPos.y + flyoutOffsetY);
        jinbiScript.init(this.type, currentTargetPos);
        jinbiScript.complete = function() {
          self.completeNum++;
          if (!self.jinbiEffectNode.active) {
            var offsetY = 0 == self.type ? 60 : 100;
            var effectPos = cc.v2(targetPos.x, currentTargetPos.y - offsetY);
            self.jinbiEffectNode.position = effectPos;
            self.jinbiEffectNode.active = true;
          }
          self.completeNum == self.jinbis.length && self.node.destroy();
        };
        this.index++;
      },
      showUI: function showUI(_flyout) {
        this.flyout = _flyout;
        this.completeNum = 0;
        this.index = 0;
        var dt = 0;
        var va = 0;
        if (0 == this.type) {
          va = .03;
          cc.Mgr.AudioMgr.playSFX(MyEnum.AudioType.coin);
        } else {
          va = .045;
          cc.Mgr.AudioMgr.playSFX(MyEnum.AudioType.gem);
        }
        for (var i = 0; i < this.jinbis.length; i++) {
          this.scheduleOnce(function() {
            this.jinbiStart();
          }, dt);
          dt += va;
        }
      },
      start: function start() {}
    });
    cc._RF.pop();
  }, {
    MyEnum: "MyEnum",
    uiConfig: "uiConfig"
  } ],
  jinbi: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "12016hKCxdCV7ae7jferEYl", "jinbi");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        delayTime: 0
      },
      start: function start() {},
      init: function init(type, targetPos) {
        var self = this;
        if (0 == type) {
          this.node.scale = 0;
          cc.tween(this.node).to(.2, {
            scale: 1
          }).by(.1, {
            position: cc.v2(0, 20)
          }).to(.2, {
            position: targetPos
          }, {
            easing: "sineInOut"
          }).call(function() {
            self.complete();
          }).start();
        } else {
          this.node.opacity = 0;
          cc.tween(this.node).to(.2, {
            opacity: 255
          }).to(.3, {
            scale: 1.5,
            position: targetPos,
            angle: 0
          }, {
            easing: "sineInOut"
          }).call(function() {
            self.complete();
          }).start();
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  jinggai: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "77f88UCtKdAyJKlLwU+XQHt", "jinggai");
    "use strict";
    var MyEnum = require("MyEnum");
    cc.Class({
      extends: cc.Component,
      properties: {
        dragon: dragonBones.ArmatureDisplay
      },
      start: function start() {
        cc.Mgr.DragonMgr.create(MyEnum.DragonType.jinggai, this.dragon);
      },
      onCollisionEnter: function onCollisionEnter(other) {
        "zombie" == other.node.group && 1 == other.tag && cc.Mgr.DragonMgr.playAnimation(MyEnum.DragonType.jinggai, this.dragon, "touch", false, 1);
      },
      onCollisionExit: function onCollisionExit(other) {
        "zombie" == other.node.group && 1 == other.tag;
      }
    });
    cc._RF.pop();
  }, {
    MyEnum: "MyEnum"
  } ],
  "js-big-decimal": [ function(require, module, exports) {
    (function(global) {
      "use strict";
      cc._RF.push(module, "b8742j7JClOIJ7HVJj3ykbg", "js-big-decimal");
      "use strict";
      (function webpackUniversalModuleDefinition(root, factory) {
        "object" === typeof exports && "object" === typeof module ? module.exports = factory() : "function" === typeof define && define.amd ? define([], factory) : "object" === typeof exports ? exports["bigDecimal"] = factory() : root["bigDecimal"] = factory();
      })(global, function() {
        return function(modules) {
          var installedModules = {};
          function __webpack_require__(moduleId) {
            if (installedModules[moduleId]) return installedModules[moduleId].exports;
            var module = installedModules[moduleId] = {
              i: moduleId,
              l: false,
              exports: {}
            };
            modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
            module.l = true;
            return module.exports;
          }
          __webpack_require__.m = modules;
          __webpack_require__.c = installedModules;
          __webpack_require__.d = function(exports, name, getter) {
            __webpack_require__.o(exports, name) || Object.defineProperty(exports, name, {
              enumerable: true,
              get: getter
            });
          };
          __webpack_require__.r = function(exports) {
            "undefined" !== typeof Symbol && Symbol.toStringTag && Object.defineProperty(exports, Symbol.toStringTag, {
              value: "Module"
            });
            Object.defineProperty(exports, "__esModule", {
              value: true
            });
          };
          __webpack_require__.t = function(value, mode) {
            1 & mode && (value = __webpack_require__(value));
            if (8 & mode) return value;
            if (4 & mode && "object" === typeof value && value && value.__esModule) return value;
            var ns = Object.create(null);
            __webpack_require__.r(ns);
            Object.defineProperty(ns, "default", {
              enumerable: true,
              value: value
            });
            if (2 & mode && "string" != typeof value) for (var key in value) __webpack_require__.d(ns, key, function(key) {
              return value[key];
            }.bind(null, key));
            return ns;
          };
          __webpack_require__.n = function(module) {
            var getter = module && module.__esModule ? function getDefault() {
              return module["default"];
            } : function getModuleExports() {
              return module;
            };
            __webpack_require__.d(getter, "a", getter);
            return getter;
          };
          __webpack_require__.o = function(object, property) {
            return Object.prototype.hasOwnProperty.call(object, property);
          };
          __webpack_require__.p = "";
          return __webpack_require__(__webpack_require__.s = 6);
        }([ function(module, exports, __webpack_require__) {
          Object.defineProperty(exports, "__esModule", {
            value: true
          });
          exports.pad = exports.trim = exports.add = void 0;
          function add(number1, number2) {
            var _a;
            void 0 === number2 && (number2 = "0");
            var neg = 0, ind = -1, neg_len;
            if ("-" == number1[0]) {
              neg++;
              ind = 1;
              number1 = number1.substring(1);
              neg_len = number1.length;
            }
            if ("-" == number2[0]) {
              neg++;
              ind = 2;
              number2 = number2.substring(1);
              neg_len = number2.length;
            }
            number1 = trim(number1);
            number2 = trim(number2);
            _a = pad(trim(number1), trim(number2)), number1 = _a[0], number2 = _a[1];
            1 == neg && (1 == ind ? number1 = compliment(number1) : number2 = compliment(number2));
            var res = addCore(number1, number2);
            return neg ? 2 == neg ? "-" + trim(res) : number1.length < res.length ? trim(res.substring(1)) : "-" + trim(compliment(res)) : trim(res);
          }
          exports.add = add;
          function compliment(number) {
            var s = "", l = number.length, dec = number.split(".")[1], ld = dec ? dec.length : 0;
            for (var i = 0; i < l; i++) number[i] >= "0" && number[i] <= "9" ? s += 9 - parseInt(number[i]) : s += number[i];
            var one = ld > 0 ? "0." + new Array(ld).join("0") + "1" : "1";
            return addCore(s, one);
          }
          function trim(number) {
            var parts = number.split(".");
            parts[0] || (parts[0] = "0");
            while ("0" == parts[0][0] && parts[0].length > 1) parts[0] = parts[0].substring(1);
            return parts[0] + (parts[1] ? "." + parts[1] : "");
          }
          exports.trim = trim;
          function pad(number1, number2) {
            var parts1 = number1.split("."), parts2 = number2.split(".");
            var length1 = parts1[0].length, length2 = parts2[0].length;
            length1 > length2 ? parts2[0] = new Array(Math.abs(length1 - length2) + 1).join("0") + (parts2[0] ? parts2[0] : "") : parts1[0] = new Array(Math.abs(length1 - length2) + 1).join("0") + (parts1[0] ? parts1[0] : "");
            length1 = parts1[1] ? parts1[1].length : 0, length2 = parts2[1] ? parts2[1].length : 0;
            (length1 || length2) && (length1 > length2 ? parts2[1] = (parts2[1] ? parts2[1] : "") + new Array(Math.abs(length1 - length2) + 1).join("0") : parts1[1] = (parts1[1] ? parts1[1] : "") + new Array(Math.abs(length1 - length2) + 1).join("0"));
            number1 = parts1[0] + (parts1[1] ? "." + parts1[1] : "");
            number2 = parts2[0] + (parts2[1] ? "." + parts2[1] : "");
            return [ number1, number2 ];
          }
          exports.pad = pad;
          function addCore(number1, number2) {
            var _a;
            _a = pad(number1, number2), number1 = _a[0], number2 = _a[1];
            var sum = "", carry = 0;
            for (var i = number1.length - 1; i >= 0; i--) {
              if ("." === number1[i]) {
                sum = "." + sum;
                continue;
              }
              var temp = parseInt(number1[i]) + parseInt(number2[i]) + carry;
              sum = temp % 10 + sum;
              carry = Math.floor(temp / 10);
            }
            return carry ? carry.toString() + sum : sum;
          }
        }, function(module, exports, __webpack_require__) {
          Object.defineProperty(exports, "__esModule", {
            value: true
          });
          exports.roundOff = void 0;
          var roundingModes_1 = __webpack_require__(2);
          function roundOff(input, n, mode) {
            void 0 === n && (n = 0);
            void 0 === mode && (mode = roundingModes_1.RoundingModes.HALF_EVEN);
            if (mode === roundingModes_1.RoundingModes.UNNECESSARY) throw new Error("UNNECESSARY Rounding Mode has not yet been implemented");
            "number" == typeof input && (input = input.toString());
            var neg = false;
            if ("-" === input[0]) {
              neg = true;
              input = input.substring(1);
            }
            var parts = input.split("."), partInt = parts[0], partDec = parts[1];
            if (n < 0) {
              n = -n;
              if (partInt.length <= n) return "0";
              var prefix = partInt.substr(0, partInt.length - n);
              input = prefix + "." + partInt.substr(partInt.length - n) + partDec;
              prefix = roundOff(input, 0, mode);
              return (neg ? "-" : "") + prefix + new Array(n + 1).join("0");
            }
            if (0 == n) {
              var l = partInt.length;
              if (greaterThanFive(parts[1], partInt, neg, mode)) return (neg ? "-" : "") + increment(partInt);
              return (neg ? "-" : "") + partInt;
            }
            if (!parts[1]) return (neg ? "-" : "") + partInt + "." + new Array(n + 1).join("0");
            if (parts[1].length < n) return (neg ? "-" : "") + partInt + "." + parts[1] + new Array(n - parts[1].length + 1).join("0");
            partDec = parts[1].substring(0, n);
            var rem = parts[1].substring(n);
            if (rem && greaterThanFive(rem, partDec, neg, mode)) {
              partDec = increment(partDec);
              if (partDec.length > n) return increment(partInt, parseInt(partDec[0])) + "." + partDec.substring(1);
            }
            return (neg ? "-" : "") + partInt + "." + partDec;
          }
          exports.roundOff = roundOff;
          function greaterThanFive(part, pre, neg, mode) {
            if (!part || part === new Array(part.length + 1).join("0")) return false;
            if (mode === roundingModes_1.RoundingModes.DOWN || !neg && mode === roundingModes_1.RoundingModes.FLOOR || neg && mode === roundingModes_1.RoundingModes.CEILING) return false;
            if (mode === roundingModes_1.RoundingModes.UP || neg && mode === roundingModes_1.RoundingModes.FLOOR || !neg && mode === roundingModes_1.RoundingModes.CEILING) return true;
            var five = "5" + new Array(part.length).join("0");
            if (part > five) return true;
            if (part < five) return false;
            switch (mode) {
             case roundingModes_1.RoundingModes.HALF_DOWN:
              return false;

             case roundingModes_1.RoundingModes.HALF_UP:
              return true;

             case roundingModes_1.RoundingModes.HALF_EVEN:
             default:
              return parseInt(pre[pre.length - 1]) % 2 == 1;
            }
          }
          function increment(part, c) {
            void 0 === c && (c = 0);
            c || (c = 1);
            "number" == typeof part && part.toString();
            var l = part.length - 1, s = "";
            for (var i = l; i >= 0; i--) {
              var x = parseInt(part[i]) + c;
              if (10 == x) {
                c = 1;
                x = 0;
              } else c = 0;
              s += x;
            }
            c && (s += c);
            return s.split("").reverse().join("");
          }
        }, function(module, exports, __webpack_require__) {
          Object.defineProperty(exports, "__esModule", {
            value: true
          });
          exports.RoundingModes = void 0;
          var RoundingModes;
          (function(RoundingModes) {
            RoundingModes[RoundingModes["CEILING"] = 0] = "CEILING";
            RoundingModes[RoundingModes["DOWN"] = 1] = "DOWN";
            RoundingModes[RoundingModes["FLOOR"] = 2] = "FLOOR";
            RoundingModes[RoundingModes["HALF_DOWN"] = 3] = "HALF_DOWN";
            RoundingModes[RoundingModes["HALF_EVEN"] = 4] = "HALF_EVEN";
            RoundingModes[RoundingModes["HALF_UP"] = 5] = "HALF_UP";
            RoundingModes[RoundingModes["UNNECESSARY"] = 6] = "UNNECESSARY";
            RoundingModes[RoundingModes["UP"] = 7] = "UP";
          })(RoundingModes = exports.RoundingModes || (exports.RoundingModes = {}));
        }, function(module, exports, __webpack_require__) {
          Object.defineProperty(exports, "__esModule", {
            value: true
          });
          exports.multiply = void 0;
          function multiply(number1, number2) {
            number1 = number1.toString();
            number2 = number2.toString();
            var negative = 0;
            if ("-" == number1[0]) {
              negative++;
              number1 = number1.substr(1);
            }
            if ("-" == number2[0]) {
              negative++;
              number2 = number2.substr(1);
            }
            number1 = trailZero(number1);
            number2 = trailZero(number2);
            var decimalLength1 = 0;
            var decimalLength2 = 0;
            -1 != number1.indexOf(".") && (decimalLength1 = number1.length - number1.indexOf(".") - 1);
            -1 != number2.indexOf(".") && (decimalLength2 = number2.length - number2.indexOf(".") - 1);
            var decimalLength = decimalLength1 + decimalLength2;
            number1 = trailZero(number1.replace(".", ""));
            number2 = trailZero(number2.replace(".", ""));
            if (number1.length < number2.length) {
              var temp = number1;
              number1 = number2;
              number2 = temp;
            }
            if ("0" == number2) return "0";
            var length = number2.length;
            var carry = 0;
            var positionVector = [];
            var currentPosition = length - 1;
            var result = "";
            for (var i = 0; i < length; i++) positionVector[i] = number1.length - 1;
            for (var i = 0; i < 2 * number1.length; i++) {
              var sum = 0;
              for (var j = number2.length - 1; j >= currentPosition && j >= 0; j--) positionVector[j] > -1 && positionVector[j] < number1.length && (sum += parseInt(number1[positionVector[j]--]) * parseInt(number2[j]));
              sum += carry;
              carry = Math.floor(sum / 10);
              result = sum % 10 + result;
              currentPosition--;
            }
            result = trailZero(adjustDecimal(result, decimalLength));
            1 == negative && (result = "-" + result);
            return result;
          }
          exports.multiply = multiply;
          function adjustDecimal(number, decimal) {
            if (0 == decimal) return number;
            number = decimal >= number.length ? new Array(decimal - number.length + 1).join("0") + number : number;
            return number.substr(0, number.length - decimal) + "." + number.substr(number.length - decimal, decimal);
          }
          function trailZero(number) {
            while ("0" == number[0]) number = number.substr(1);
            if (-1 != number.indexOf(".")) while ("0" == number[number.length - 1]) number = number.substr(0, number.length - 1);
            "" == number || "." == number ? number = "0" : "." == number[number.length - 1] && (number = number.substr(0, number.length - 1));
            "." == number[0] && (number = "0" + number);
            return number;
          }
        }, function(module, exports, __webpack_require__) {
          Object.defineProperty(exports, "__esModule", {
            value: true
          });
          exports.divide = void 0;
          var add_1 = __webpack_require__(0);
          var round_1 = __webpack_require__(1);
          function divide(dividend, divisor, precission) {
            void 0 === precission && (precission = 8);
            if (0 == divisor) throw new Error("Cannot divide by 0");
            dividend = dividend.toString();
            divisor = divisor.toString();
            dividend = dividend.replace(/(\.\d*?[1-9])0+$/g, "$1").replace(/\.0+$/, "");
            divisor = divisor.replace(/(\.\d*?[1-9])0+$/g, "$1").replace(/\.0+$/, "");
            if (0 == dividend) return "0";
            var neg = 0;
            if ("-" == divisor[0]) {
              divisor = divisor.substring(1);
              neg++;
            }
            if ("-" == dividend[0]) {
              dividend = dividend.substring(1);
              neg++;
            }
            var pt_dvsr = divisor.indexOf(".") > 0 ? divisor.length - divisor.indexOf(".") - 1 : -1;
            divisor = add_1.trim(divisor.replace(".", ""));
            if (pt_dvsr >= 0) {
              var pt_dvnd = dividend.indexOf(".") > 0 ? dividend.length - dividend.indexOf(".") - 1 : -1;
              if (-1 == pt_dvnd) dividend = add_1.trim(dividend + new Array(pt_dvsr + 1).join("0")); else if (pt_dvsr > pt_dvnd) {
                dividend = dividend.replace(".", "");
                dividend = add_1.trim(dividend + new Array(pt_dvsr - pt_dvnd + 1).join("0"));
              } else if (pt_dvsr < pt_dvnd) {
                dividend = dividend.replace(".", "");
                var loc = dividend.length - pt_dvnd + pt_dvsr;
                dividend = add_1.trim(dividend.substring(0, loc) + "." + dividend.substring(loc));
              } else pt_dvsr == pt_dvnd && (dividend = add_1.trim(dividend.replace(".", "")));
            }
            var prec = 0, dl = divisor.length, rem = "0", quotent = "";
            var dvnd = dividend.indexOf(".") > -1 && dividend.indexOf(".") < dl ? dividend.substring(0, dl + 1) : dividend.substring(0, dl);
            dividend = dividend.indexOf(".") > -1 && dividend.indexOf(".") < dl ? dividend.substring(dl + 1) : dividend.substring(dl);
            if (dvnd.indexOf(".") > -1) {
              var shift = dvnd.length - dvnd.indexOf(".") - 1;
              dvnd = dvnd.replace(".", "");
              if (dl > dvnd.length) {
                shift += dl - dvnd.length;
                dvnd += new Array(dl - dvnd.length + 1).join("0");
              }
              prec = shift;
              quotent = "0." + new Array(shift).join("0");
            }
            precission += 2;
            while (prec <= precission) {
              var qt = 0;
              while (parseInt(dvnd) >= parseInt(divisor)) {
                dvnd = add_1.add(dvnd, "-" + divisor);
                qt++;
              }
              quotent += qt;
              if (dividend) {
                if ("." == dividend[0]) {
                  quotent += ".";
                  prec++;
                  dividend = dividend.substring(1);
                }
                dvnd += dividend.substring(0, 1);
                dividend = dividend.substring(1);
              } else {
                prec || (quotent += ".");
                prec++;
                dvnd += "0";
              }
            }
            return (1 == neg ? "-" : "") + add_1.trim(round_1.roundOff(quotent, precission - 2));
          }
          exports.divide = divide;
        }, function(module, exports, __webpack_require__) {
          Object.defineProperty(exports, "__esModule", {
            value: true
          });
          exports.negate = exports.subtract = void 0;
          var add_1 = __webpack_require__(0);
          function subtract(number1, number2) {
            number1 = number1.toString();
            number2 = number2.toString();
            number2 = negate(number2);
            return add_1.add(number1, number2);
          }
          exports.subtract = subtract;
          function negate(number) {
            number = "-" == number[0] ? number.substr(1) : "-" + number;
            return number;
          }
          exports.negate = negate;
        }, function(module, exports, __webpack_require__) {
          var add_1 = __webpack_require__(0);
          var round_1 = __webpack_require__(1);
          var multiply_1 = __webpack_require__(3);
          var divide_1 = __webpack_require__(4);
          var modulus_1 = __webpack_require__(7);
          var compareTo_1 = __webpack_require__(8);
          var subtract_1 = __webpack_require__(5);
          var roundingModes_1 = __webpack_require__(2);
          var bigDecimal = function() {
            function bigDecimal(number) {
              void 0 === number && (number = "0");
              this.value = bigDecimal.validate(number);
            }
            bigDecimal.validate = function(number) {
              if (number) {
                number = number.toString();
                if (isNaN(number)) throw Error("Parameter is not a number: " + number);
                "+" == number[0] && (number = number.substring(1));
              } else number = "0";
              if (/e/i.test(number)) {
                var _a = number.split(/[eE]/), mantisa = _a[0], exponent = _a[1];
                mantisa = add_1.trim(mantisa);
                exponent = parseInt(exponent) + mantisa.indexOf(".");
                mantisa = mantisa.replace(".", "");
                number = mantisa.length < exponent ? mantisa + new Array(exponent - mantisa.length + 1).join("0") : mantisa.length >= exponent && exponent > 0 ? add_1.trim(mantisa.substring(0, exponent)) + (mantisa.length > exponent ? "." + mantisa.substring(exponent) : "") : "0." + new Array(1 - exponent).join("0") + mantisa;
              }
              return number;
            };
            bigDecimal.prototype.getValue = function() {
              return this.value;
            };
            bigDecimal.getPrettyValue = function(number, digits, separator) {
              if (digits || separator) {
                if (!(digits && separator)) throw Error("Illegal Arguments. Should pass both digits and separator or pass none");
              } else {
                digits = 3;
                separator = ",";
              }
              number = bigDecimal.validate(number);
              var neg = "-" == number.charAt(0);
              neg && (number = number.substring(1));
              var len = number.indexOf(".");
              len = len > 0 ? len : number.length;
              var temp = "";
              for (var i = len; i > 0; ) {
                if (i < digits) {
                  digits = i;
                  i = 0;
                } else i -= digits;
                temp = number.substring(i, i + digits) + (i < len - digits && i >= 0 ? separator : "") + temp;
              }
              return (neg ? "-" : "") + temp + number.substring(len);
            };
            bigDecimal.prototype.getPrettyValue = function(digits, separator) {
              return bigDecimal.getPrettyValue(this.value, digits, separator);
            };
            bigDecimal.round = function(number, precision, mode) {
              void 0 === precision && (precision = 0);
              void 0 === mode && (mode = roundingModes_1.RoundingModes.HALF_EVEN);
              number = bigDecimal.validate(number);
              if (isNaN(precision)) throw Error("Precision is not a number: " + precision);
              return round_1.roundOff(number, precision, mode);
            };
            bigDecimal.prototype.round = function(precision, mode) {
              void 0 === precision && (precision = 0);
              void 0 === mode && (mode = roundingModes_1.RoundingModes.HALF_EVEN);
              if (isNaN(precision)) throw Error("Precision is not a number: " + precision);
              return new bigDecimal(round_1.roundOff(this.value, precision, mode));
            };
            bigDecimal.floor = function(number) {
              number = bigDecimal.validate(number);
              if (-1 === number.indexOf(".")) return number;
              return bigDecimal.round(number, 0, roundingModes_1.RoundingModes.FLOOR);
            };
            bigDecimal.prototype.floor = function() {
              if (-1 === this.value.indexOf(".")) return new bigDecimal(this.value);
              return new bigDecimal(this.value).round(0, roundingModes_1.RoundingModes.FLOOR);
            };
            bigDecimal.ceil = function(number) {
              number = bigDecimal.validate(number);
              if (-1 === number.indexOf(".")) return number;
              return bigDecimal.round(number, 0, roundingModes_1.RoundingModes.CEILING);
            };
            bigDecimal.prototype.ceil = function() {
              if (-1 === this.value.indexOf(".")) return new bigDecimal(this.value);
              return new bigDecimal(this.value).round(0, roundingModes_1.RoundingModes.CEILING);
            };
            bigDecimal.add = function(number1, number2) {
              number1 = bigDecimal.validate(number1);
              number2 = bigDecimal.validate(number2);
              return add_1.add(number1, number2);
            };
            bigDecimal.prototype.add = function(number) {
              return new bigDecimal(add_1.add(this.value, number.getValue()));
            };
            bigDecimal.subtract = function(number1, number2) {
              number1 = bigDecimal.validate(number1);
              number2 = bigDecimal.validate(number2);
              return subtract_1.subtract(number1, number2);
            };
            bigDecimal.prototype.subtract = function(number) {
              return new bigDecimal(subtract_1.subtract(this.value, number.getValue()));
            };
            bigDecimal.multiply = function(number1, number2) {
              number1 = bigDecimal.validate(number1);
              number2 = bigDecimal.validate(number2);
              return multiply_1.multiply(number1, number2);
            };
            bigDecimal.prototype.multiply = function(number) {
              return new bigDecimal(multiply_1.multiply(this.value, number.getValue()));
            };
            bigDecimal.divide = function(number1, number2, precision) {
              number1 = bigDecimal.validate(number1);
              number2 = bigDecimal.validate(number2);
              return divide_1.divide(number1, number2, precision);
            };
            bigDecimal.prototype.divide = function(number, precision) {
              return new bigDecimal(divide_1.divide(this.value, number.getValue(), precision));
            };
            bigDecimal.modulus = function(number1, number2) {
              number1 = bigDecimal.validate(number1);
              number2 = bigDecimal.validate(number2);
              return modulus_1.modulus(number1, number2);
            };
            bigDecimal.prototype.modulus = function(number) {
              return new bigDecimal(modulus_1.modulus(this.value, number.getValue()));
            };
            bigDecimal.compareTo = function(number1, number2) {
              number1 = bigDecimal.validate(number1);
              number2 = bigDecimal.validate(number2);
              return compareTo_1.compareTo(number1, number2);
            };
            bigDecimal.prototype.compareTo = function(number) {
              return compareTo_1.compareTo(this.value, number.getValue());
            };
            bigDecimal.negate = function(number) {
              number = bigDecimal.validate(number);
              return subtract_1.negate(number);
            };
            bigDecimal.prototype.negate = function() {
              return new bigDecimal(subtract_1.negate(this.value));
            };
            bigDecimal.RoundingModes = roundingModes_1.RoundingModes;
            return bigDecimal;
          }();
          module.exports = bigDecimal;
        }, function(module, exports, __webpack_require__) {
          Object.defineProperty(exports, "__esModule", {
            value: true
          });
          exports.modulus = void 0;
          var divide_1 = __webpack_require__(4);
          var round_1 = __webpack_require__(1);
          var multiply_1 = __webpack_require__(3);
          var subtract_1 = __webpack_require__(5);
          var roundingModes_1 = __webpack_require__(2);
          function modulus(dividend, divisor) {
            if (0 == divisor) throw new Error("Cannot divide by 0");
            dividend = dividend.toString();
            divisor = divisor.toString();
            validate(dividend);
            validate(divisor);
            var sign = "";
            if ("-" == dividend[0]) {
              sign = "-";
              dividend = dividend.substr(1);
            }
            "-" == divisor[0] && (divisor = divisor.substr(1));
            var result = subtract_1.subtract(dividend, multiply_1.multiply(divisor, round_1.roundOff(divide_1.divide(dividend, divisor), 0, roundingModes_1.RoundingModes.FLOOR)));
            return sign + result;
          }
          exports.modulus = modulus;
          function validate(oparand) {
            if (-1 != oparand.indexOf(".")) throw new Error("Modulus of non-integers not supported");
          }
        }, function(module, exports, __webpack_require__) {
          Object.defineProperty(exports, "__esModule", {
            value: true
          });
          exports.compareTo = void 0;
          var add_1 = __webpack_require__(0);
          function compareTo(number1, number2) {
            var _a;
            var negative = false;
            if ("-" == number1[0] && "-" != number2[0]) return -1;
            if ("-" != number1[0] && "-" == number2[0]) return 1;
            if ("-" == number1[0] && "-" == number2[0]) {
              number1 = number1.substr(1);
              number2 = number2.substr(1);
              negative = true;
            }
            _a = add_1.pad(number1, number2), number1 = _a[0], number2 = _a[1];
            if (0 == number1.localeCompare(number2)) return 0;
            for (var i = 0; i < number1.length; i++) {
              if (number1[i] == number2[i]) continue;
              return number1[i] > number2[i] ? negative ? -1 : 1 : negative ? 1 : -1;
            }
            return 0;
          }
          exports.compareTo = compareTo;
        } ]);
      });
      cc._RF.pop();
    }).call(this, "undefined" !== typeof global ? global : "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : {});
  }, {} ],
  lockGird: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "bae7c6iND1FHbrCShjS8zc1", "lockGird");
    "use strict";
    var MyEnum = require("MyEnum");
    var Event = require("Event");
    var DataType = require("DataType");
    var lockGird = cc.Class({
      extends: cc.Component,
      properties: {
        price: cc.Label
      },
      onLoad: function onLoad() {
        this.limitClick = this.node.getComponent("LimitClick");
      },
      init: function init(index, money, pos) {
        this.index = index;
        this.level = money;
        this.money = BigInt(money);
        this.price.string = cc.Mgr.Utils.getNumStr2(this.money);
        this.node.position = pos;
        this.node.on(cc.Node.EventType.TOUCH_START, function(event) {
          this.TouchStart(event);
        }, this);
      },
      setPlantInfo: function setPlantInfo(level) {
        this.plantLevel = level;
      },
      setShowDetailsInUI: function setShowDetailsInUI(scale, color, isBig) {
        void 0 === isBig && (isBig = true);
        this.node.getChildByName("shadow").active = false;
        this.dragon.node.color = cc.Mgr.Utils.hexToColor(color);
        isBig && this.dragon.playAnimation("DaiJi", -1);
        this.node.scale = scale;
      },
      TouchStart: function TouchStart(event) {
        if (false == this.limitClick.clickTime()) return;
        if (cc.Mgr.game.needGuide) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("need-to-complete-guide"), "", cc.Mgr.UIMgr.uiRoot);
          return;
        }
        if (cc.Mgr.game.money >= this.money) {
          var param = {};
          param.index = this.index;
          cc.Mgr.game.money -= this.money;
          cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "money");
          cc.director.GlobalEvent.emit(Event.unlockGird, param);
          false == cc.Mgr.game.unlockGridFirst && cc.Mgr.plantMgr.hasLockGrid() && (cc.Mgr.game.unlockGridFirst = true);
        } else {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("NoCoins"), "coin", cc.Mgr.UIMgr.uiRoot);
          cc.Mgr.game.plantMaxLv >= cc.Mgr.game.exchangeCoinConfig.openLevel && cc.Mgr.game.needShowExchangeCoinCount++;
          if (cc.Mgr.game.needShowExchangeCoinCount >= 3 && cc.Mgr.game.plantMaxLv >= cc.Mgr.game.exchangeCoinConfig.openLevel) {
            var exchangeGemNum = cc.Mgr.UIMgr.gemNum();
            cc.Mgr.game.currentExchangeCount < cc.Mgr.game.exchangeCoinConfig.maxExchangeNum && cc.Mgr.game.gems >= exchangeGemNum ? cc.Mgr.UIMgr.openExchangeCoinUI(true) : cc.Mgr.game.coinBundleFlag;
            cc.Mgr.game.needShowExchangeCoinCount = 0;
          }
        }
      },
      plantDestroy: function plantDestroy() {
        this.node.destroy();
      },
      start: function start() {}
    });
    module.exports = lockGird;
    cc._RF.pop();
  }, {
    DataType: "DataType",
    Event: "Event",
    MyEnum: "MyEnum"
  } ],
  missionItem: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3adeb2YS/9NU6FhHeQCaYTD", "missionItem");
    "use strict";
    var DataType = require("DataType");
    var MissionType = require("MissionType");
    var missionTrans = [ "mission-login-game", "mission-merge20-flowers", "mission-win10-times", "mission-watch3-videos", "mission-ingame-time", "mission-invite-count" ];
    var oldMissionRewardList = [ [ 0 ], [ 0 ], [ 0 ], [ 5, 5 ], [ 2, 5, 5 ], [ 5 ] ];
    var missionItem = cc.Class({
      extends: cc.Component,
      properties: {
        missionSp: cc.Sprite,
        missionIconList: [ cc.SpriteFrame ],
        rewardIcon: cc.Sprite,
        rewardIconList: [ cc.SpriteFrame ],
        claimBtn: cc.Node,
        proBar: cc.ProgressBar,
        desLbl: cc.Label,
        numLbl: cc.Label,
        sliderLbl: cc.Label,
        effect: cc.Node,
        rewardType: "money",
        rewardNum: 5,
        misId: 0,
        receiveBtnLabel: cc.Label
      },
      onLoad: function onLoad() {
        this.limitClick = this.node.getComponent("LimitClick");
      },
      pickOutDataLv: function pickOutDataLv(shopSortDt) {
        for (var i = 0; i < 9; i++) switch (i) {
         case 0:
          if ("M" == shopSortDt.MAX) return 0;
          break;

         case 1:
          if ("M" == shopSortDt.MAX_1) return 1;
          break;

         case 2:
          if ("M" == shopSortDt.MAX_2) return 2;
          break;

         case 3:
          if ("M" == shopSortDt.MAX_3) return 3;
          break;

         case 4:
          if ("M" == shopSortDt.MAX_4) return 4;
          break;

         case 5:
          if ("M" == shopSortDt.MAX_5) return 5;
          break;

         case 6:
          if ("M" == shopSortDt.MAX_6) return 6;
          break;

         case 7:
          if ("M" == shopSortDt.MAX_7) return 7;
          break;

         case 8:
          if ("M" == shopSortDt.MAX_8) return 8;
        }
        return 0;
      },
      caculateMoneyPrice: function caculateMoneyPrice(lv, plantData) {
        var buyNum = cc.Mgr.game.plantBuyRecord[lv];
        buyNum = buyNum || 0;
        this.price = plantData.price;
        var price = plantData.price * BigInt(Math.round(Math.pow(1.2, buyNum) / 2 * 100)) / BigInt(100);
        1 == lv && (price = plantData.price * BigInt(Math.round(Math.pow(1.1, buyNum) / 2 * 100)) / BigInt(100));
        this.price = price;
        return price;
      },
      setData: function setData(data) {
        this.receiveBtnLabel.string = cc.Mgr.Utils.getTranslation("btn-claim");
        this.missionSp.spriteFrame = this.missionIconList[data.misType];
        this.misId = data.id;
        this.checklv = data.checklv;
        if ("coin" == data.rewardType) {
          this.rewardType = "money";
          var lvDis = cc.Mgr.game.plantMaxLv - 3 > 0 ? cc.Mgr.game.plantMaxLv - 3 : 1;
          var plantData = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData, lvDis);
          this.rewardNum = this.caculateMoneyPrice(lvDis, plantData) * BigInt(8) / BigInt(10);
          this.numLbl.string = "x" + cc.Mgr.Utils.getNumStr2(this.rewardNum);
          this.rewardIcon.spriteFrame = this.rewardIconList[0];
        } else if ("gem" == data.rewardType) {
          this.rewardType = "gem";
          data.checklv ? this.rewardNum = cc.Mgr.Config.missionRewardList[this.misId][data.checklv] : this.rewardNum = cc.Mgr.Config.missionRewardList[this.misId][0];
          data.checklv ? this.rewardNum = oldMissionRewardList[this.misId][data.checklv] : this.rewardNum = oldMissionRewardList[this.misId][0];
          this.numLbl.string = "x" + this.rewardNum;
          this.rewardIcon.spriteFrame = this.rewardIconList[1];
        }
        this.unscheduleAllCallbacks();
        var checkNum = data.checkNum;
        if (data.misType == MissionType.AdsShow || data.misType == MissionType.InGameTime || data.misType == MissionType.InviteCount) {
          checkNum = data.checklv ? cc.Mgr.Config.missionCheckList[this.misId][data.checklv] : cc.Mgr.Config.missionCheckList[this.misId][0];
          this.desLbl.string = cc.Mgr.Utils.getTranslation(missionTrans[data.misType], [ checkNum ]);
          data.misType == MissionType.InGameTime ? this.schedule(function() {
            if (cc.Mgr.game.dailyMissions[data.misType].progress < checkNum) {
              this.sliderLbl.string = cc.Mgr.game.dailyMissions[data.misType].progress + "/" + checkNum;
              this.proBar.progress = cc.Mgr.game.dailyMissions[data.misType].progress / checkNum;
              this.effect.active = false;
              this.claimBtn.active = false;
            } else {
              this.sliderLbl.string = checkNum + "/" + checkNum;
              this.proBar.progress = 1;
              this.effect.active = true;
              this.claimBtn.active = true;
            }
          }, 1) : this.desLbl.string = cc.Mgr.Utils.getTranslation(missionTrans[data.misType], [ checkNum ]);
        } else {
          checkNum = data.checkNum;
          this.desLbl.string = cc.Mgr.Utils.getTranslation(missionTrans[data.misType]);
        }
        this.sliderLbl.string = data.progress + "/" + checkNum;
        this.proBar.progress = data.progress / checkNum;
        if (data.progress < checkNum) {
          this.effect.active = false;
          this.claimBtn.active = false;
        } else {
          this.effect.active = true;
          this.claimBtn.active = true;
        }
      },
      scheduleInGameTimeMission: function scheduleInGameTimeMission(checkNum, data) {
        this.desLbl.string = cc.Mgr.Utils.getTranslation(missionTrans[data.misType]);
        if (cc.Mgr.game.dailyMissions[data.misType].progress < checkNum) {
          this.sliderLbl.string = cc.Mgr.game.dailyMissions[data.misType].progress + "/" + checkNum;
          this.proBar.progress = cc.Mgr.game.dailyMissions[data.misType].progress / checkNum;
          this.effect.active = false;
          this.claimBtn.active = false;
        } else {
          this.sliderLbl.string = checkNum + "/" + checkNum;
          this.proBar.progress = 1;
          this.effect.active = true;
          this.claimBtn.active = true;
        }
      },
      claim: function claim() {
        if (false == this.limitClick.clickTime()) return;
        cc.Mgr.AudioMgr.playSFX("click");
        this.getRewardAndUpdateMission();
        cc.Mgr.UIMgr.openAssetGetUI(this.rewardType, this.rewardNum, "mission");
        if ("gem" === this.rewardType) {
          var data = {};
          data.elapsed = cc.Mgr.Utils.getDate9(true);
          data.getGems = this.rewardNum;
          cc.Mgr.analytics.logEvent("mission_get_gems", JSON.stringify(data));
        }
        cc.Mgr.UIMgr.missionUI.showUI(true);
      },
      getRewardAndUpdateMission: function getRewardAndUpdateMission() {
        cc.Mgr.game.claimMissionRewardById(this.misId);
      }
    });
    module.exports = missionItem;
    cc._RF.pop();
  }, {
    DataType: "DataType",
    MissionType: "MissionType"
  } ],
  missionUI: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "64236pu20dCb46IDnvxndNR", "missionUI");
    "use strict";
    var missionItem = require("missionItem");
    var achieveItem = require("achieveItem");
    var uiConfig = require("uiConfig");
    var MissionType = require("MissionType");
    var DataType = require("DataType");
    var AchieveType = require("AchieveType");
    var scaleConfig = 1.3;
    var tweenTime = .15;
    var missionUI = cc.Class({
      extends: cc.Component,
      properties: {
        closeNode: cc.Node,
        newMItemParent: cc.Node,
        newAItemParent: cc.Node,
        misList: [ missionItem ],
        achList: [ achieveItem ],
        missContent: cc.Node,
        achieveContent: cc.Node,
        missionToggle: cc.Toggle,
        achievementToggle: cc.Toggle,
        noMisTip: cc.Label,
        redAchieveTip: cc.Node,
        missionLable_1: cc.Label,
        missionLabel_2: cc.Label,
        achievementLabel_1: cc.Label,
        achievementlabel_2: cc.Label,
        content: cc.Node,
        blurBg: cc.Node,
        title: cc.Node,
        title_zh: cc.Node,
        title_ja: cc.Node,
        title_ru: cc.Node
      },
      doTween: function doTween() {
        this.closeNode.opacity = 0;
        this.closeNode.scale = 0;
        cc.tween(this.closeNode).to(tweenTime, {
          opacity: 255,
          scale: 1
        }).start();
      },
      start: function start() {
        cc.Mgr.UIMgr.missionUI = this;
        this.missionLabel_2.string = this.missionLable_1.string = cc.Mgr.Utils.getTranslation("mission-toggle-button");
        this.achievementlabel_2.string = this.achievementLabel_1.string = cc.Mgr.Utils.getTranslation("achievement-toggle-button");
        this.noMisTip.string = cc.Mgr.Utils.getTranslation("noMission-tip");
        this.title.active = false;
        this.title_zh.active = false;
        this.title_ja.active = false;
        this.title_ru.active = false;
        "Japanese" === cc.Mgr.Config.language ? this.title_ja.active = true : "Simplified Chinese" === cc.Mgr.Config.language || "Traditional Chinese" === cc.Mgr.Config.language ? this.title_zh.active = true : "Russian" === cc.Mgr.Config.language ? this.title_ru.active = true : this.title.active = true;
      },
      pickOutAchieveDataList: function pickOutAchieveDataList() {
        var outList = [];
        for (var i = 0; i < cc.Mgr.game.achievementProgress.length; i++) {
          var dt = cc.Mgr.game.achievementProgress[i];
          if (!dt.finished && 0 != this.checkLvToGainGems(dt.id, dt.checklv)) {
            outList.length < 5 && outList.push(dt);
            dt.achType == AchieveType.Invite && outList.push(dt);
          }
        }
        return outList;
      },
      pickOutMissionDataList: function pickOutMissionDataList() {
        var outList = [];
        for (var i = 0; i < cc.Mgr.game.dailyMissions.length; i++) {
          var dt = cc.Mgr.game.dailyMissions[i];
          var param = {};
          param.needShow = true;
          param.data = dt;
          if (1 == dt.claimed && (dt.misType < MissionType.AdsShow || dt.misType == MissionType.InviteCount)) param.needShow = false; else if (dt.misType == MissionType.AdsShow) 1 == dt.claimed && (param.needShow = false); else if (dt.misType == MissionType.InGameTime) 1 == dt.claimed && (param.needShow = false); else if (dt.misType == MissionType.InviteCount) {
            param.needShow = false;
            continue;
          }
          outList.push(param);
        }
        return outList;
      },
      checkLvToGainGems: function checkLvToGainGems(id, checklv) {
        var dt = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.AchievementData, id);
        if (0 == checklv) return dt.Gain_5;
        if (1 == checklv) return dt.Gain_20;
        if (2 == checklv) return dt.Gain_50;
        if (3 == checklv) return dt.Gain_100;
        if (4 == checklv) return dt.Gain_200;
      },
      showUI: function showUI(_refresh) {
        this.node.width = cc.Mgr.Config.winSize.width;
        this.node.height = cc.Mgr.Config.winSize.height;
        this.redAchieveTip.active = false;
        this.missionToggle.isChecked = true;
        var misshowList = this.pickOutMissionDataList();
        this.loadMissionItemsNew(misshowList);
        this.loadAchieveItemsNew();
        if (true === _refresh) return;
        this.doTween();
        this.blurBg.opacity = 0;
        this.content.opacity = 0;
        this.content.setScale(.5);
        cc.tween(this.blurBg).to(.05, {
          opacity: 255
        }).call().start();
        cc.tween(this.content).to(.15, {
          opacity: 255,
          scale: 1
        }).start();
        cc.Mgr.admob.showBanner("mission");
      },
      showMissionContent: function showMissionContent() {
        this.achieveContent.active = false;
        this.missContent.active = true;
      },
      showAchieveContent: function showAchieveContent() {
        this.redAchieveTip.active = false;
        this.missContent.active = false;
        this.achieveContent.active = true;
      },
      loadMissionItemsNew: function loadMissionItemsNew(misshowList) {
        var self = this;
        this.noMisTip.node.active = false;
        var showOut = false;
        for (var i = 0; i < misshowList.length; i++) if (misshowList[i].needShow) {
          showOut = true;
          break;
        }
        var maxLen = Math.min(6, misshowList.length);
        if (showOut) {
          this.newMItemParent.active = true;
          if (0 == this.misList.length) {
            var itimes = 0;
            this.initMissionItems = function() {
              if (itimes >= maxLen) {
                this.unschedule(this.initMissionItems);
                if (cc.Mgr.game.checkOutMissionIsFinished()) {
                  this.showMissionContent();
                  cc.Mgr.game.checkOutAchieveDataIsFinished() && (this.redAchieveTip.active = true);
                }
                return;
              }
              var item = cc.instantiate(cc.Mgr.UIItemMgr.getMissionItemPre());
              item.parent = this.newMItemParent;
              var scp = item.getComponent("missionItem");
              1 == misshowList[itimes].data.claimed ? item.active = false : item.active = true;
              var data = misshowList[itimes].data;
              true == item.active && scp.setData(data);
              this.misList.push(scp);
              itimes += 1;
            };
            this.schedule(this.initMissionItems, .005, 5, .01);
          } else {
            for (var i = 0; i < this.misList.length; i++) this.misList[i].node.active = false;
            for (var i = 0; i < misshowList.length; i++) if (misshowList[i].needShow) {
              this.misList[i].node.active = true;
              var dt = misshowList[i].data;
              this.misList[i].setData(dt);
            }
            if (cc.Mgr.game.checkOutMissionIsFinished()) {
              this.showMissionContent();
              cc.Mgr.game.checkOutAchieveDataIsFinished() && (this.redAchieveTip.active = true);
            } else if (cc.Mgr.game.checkOutAchieveDataIsFinished()) {
              this.redAchieveTip.active = false;
              this.achievementToggle.isChecked = true;
            }
          }
        } else {
          this.newMItemParent.active = false;
          this.noMisTip.node.active = true;
          this.redAchieveTip.active = false;
          this.achievementToggle.isChecked = true;
        }
      },
      loadAchieveItemsNew: function loadAchieveItemsNew() {
        var self = this;
        var acshowList = this.pickOutAchieveDataList();
        if (0 == acshowList.length) this.newAItemParent.active = false; else {
          this.newAItemParent.active = true;
          if (0 == this.achList.length) {
            var itimes = 0;
            this.initAchieveItems = function() {
              if (itimes >= acshowList.length) {
                this.unschedule(this.initAchieveItems);
                return;
              }
              var item = cc.instantiate(cc.Mgr.UIItemMgr.getAchieveItemPre());
              item.parent = this.newAItemParent;
              var scp = item.getComponent("achieveItem");
              item.active = true;
              var dt = acshowList[itimes];
              scp.setData(dt);
              this.achList.push(scp);
              itimes += 1;
            };
            this.schedule(this.initAchieveItems, .005, this.acshowList, .01);
          } else {
            for (var i = 0; i < this.achList.length; i++) this.achList[i].node.active = false;
            for (var i = 0; i < acshowList.length; i++) {
              var data = acshowList[i];
              this.achList[i].node.active = true;
              this.achList[i].setData(data);
            }
          }
        }
      },
      closeUI: function closeUI() {
        cc.Mgr.AudioMgr.playSFX("click");
        var self = this;
        cc.Mgr.admob.hideBanner("mission");
        cc.tween(this.blurBg).to(.15, {
          opacity: 0
        }).start();
        cc.tween(this.content).to(.15, {
          opacity: 0,
          scale: .5
        }).call(function() {
          cc.Mgr.UIMgr.InGameUI.checkMissionAchieveTip();
          self.node.active = false;
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount("mission");
      }
    });
    module.exports = missionUI;
    cc._RF.pop();
  }, {
    AchieveType: "AchieveType",
    DataType: "DataType",
    MissionType: "MissionType",
    achieveItem: "achieveItem",
    missionItem: "missionItem",
    uiConfig: "uiConfig"
  } ],
  newRecordUI: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f89dbf0vuRC64h+Dsvg6XNr", "newRecordUI");
    "use strict";
    var newRecordUI = cc.Class({
      extends: cc.Component,
      properties: {
        recordLbl: cc.Label,
        titleLabel: cc.Label,
        newRecordLabel: cc.Label,
        content: cc.Node,
        blurBg: cc.Node,
        effect: dragonBones.ArmatureDisplay,
        btnLabel: cc.Label,
        timeLbl: cc.Label
      },
      onLoad: function onLoad() {
        this.limitClick = this.node.getComponent("LimitClick");
      },
      showUI: function showUI() {
        this.titleLabel.string = cc.Mgr.Utils.getTranslation("newRecord-title");
        this.newRecordLabel.string = cc.Mgr.Utils.getTranslation("newRecord-level");
        this.recordLbl.string = cc.Mgr.game.level;
        this.btnLabel.string = cc.Mgr.Utils.getTranslation("btn-ok");
        this.blurBg.opacity = 0;
        this.content.opacity = 0;
        this.content.setScale(.5);
        cc.tween(this.blurBg).to(.05, {
          opacity: 255
        }).call().start();
        cc.tween(this.content).to(.15, {
          opacity: 255,
          scale: 1
        }).start();
        cc.Mgr.admob.showBanner("newRecord");
        this.effect.playAnimation("newAnimation", 1);
        this.countDown();
      },
      countDown: function countDown() {
        this.count = 9;
        this.timeLbl.string = "00:0" + this.count;
        this.callback = function() {
          0 == this.count && this.closeUI();
          this.timeLbl.string = "00:0" + this.count;
          this.count--;
        };
        this.timeLbl.node.active = true;
        this.schedule(this.callback, 1);
      },
      closeUI: function closeUI() {
        if (false == this.limitClick.clickTime()) return;
        this.unschedule(this.callback);
        cc.Mgr.AudioMgr.playSFX("click");
        cc.Mgr.admob.hideBanner("newRecord");
        var self = this;
        cc.tween(this.blurBg).to(.15, {
          opacity: 0
        }).start();
        cc.tween(this.content).to(.15, {
          opacity: 0,
          scale: .5
        }).call(function() {
          self.node.active = false;
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount("record");
      }
    });
    module.exports = newRecordUI;
    cc._RF.pop();
  }, {} ],
  noticeUI: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "dbf37XZt7ZG6LLcPaPf6Go+", "noticeUI");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      start: function start() {},
      closeUI: function closeUI() {
        this.node.active = false;
      }
    });
    cc._RF.pop();
  }, {} ],
  offlineAssetUI: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "bc475RBPPtLk6FhQlrA7QDP", "offlineAssetUI");
    "use strict";
    var tweenTime = .15;
    var offlineAssetUI = cc.Class({
      extends: cc.Component,
      properties: {
        numLbl: cc.Label,
        closeNode: cc.Node,
        checkBox: cc.Toggle,
        descLabel: cc.Label,
        checkboxLabel: cc.Label,
        btnLabel: cc.Label,
        vipTip: cc.Label,
        doubleTip: cc.Label,
        content: cc.Node,
        blurBg: cc.Node,
        checkboxNode: cc.Node,
        vipNode: cc.Node,
        doubleNode: cc.Node,
        numEffect: cc.Node,
        getBtn: cc.Node,
        adsBtn: cc.Node,
        adsLabel: cc.Label,
        title: cc.Node,
        title_zh: cc.Node,
        title_ja: cc.Node,
        title_ru: cc.Node,
        noThanks: cc.Node,
        noThanksLabel: cc.Label,
        buyLabel: cc.Label,
        buyDescLabel: cc.Label,
        tripleNode: cc.Node
      },
      onLoad: function onLoad() {
        this.limitClick = this.node.getComponent("LimitClick");
        this.showCount = 0;
      },
      start: function start() {
        this.title.active = false;
        this.title_zh.active = false;
        this.title_ja.active = false;
        this.title_ru.active = false;
        "Japanese" === cc.Mgr.Config.language ? this.title_ja.active = true : "Simplified Chinese" === cc.Mgr.Config.language || "Traditional Chinese" === cc.Mgr.Config.language ? this.title_zh.active = true : "Russian" === cc.Mgr.Config.language ? this.title_ru.active = true : this.title.active = true;
      },
      updateReward: function updateReward() {
        var num = true === this.checkBox.isChecked && this.checkboxNode.active || cc.Mgr.game.isVIP ? this.num * BigInt(3) : this.num;
        this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr2(num));
        cc.Mgr.game.isManualSetting = cc.Mgr.game.isManualSetting_payingUser = this.checkBox.isChecked;
        this.getBtn.active = false;
        this.adsBtn.active = false;
        this.checkboxNode.active && this.checkBox.isChecked ? this.adsBtn.active = true : this.getBtn.active = true;
      },
      doTween: function doTween() {
        this.closeNode.opacity = 0;
        this.closeNode.scale = 0;
        cc.tween(this.closeNode).to(tweenTime, {
          opacity: 255,
          scale: 1
        }).start();
      },
      showUI: function showUI(data) {
        this.descLabel.string = cc.Mgr.Utils.getTranslation("offline-des");
        this.checkboxLabel.string = cc.Mgr.Utils.getTranslation("getReward-checkbox-treble");
        this.btnLabel.string = cc.Mgr.Utils.getTranslation("btn-claim");
        this.vipTip.string = cc.Mgr.Utils.getTranslation("vip-treble-tip");
        this.doubleTip.string = cc.Mgr.Utils.getTranslation("offline-treble-tip");
        this.adsLabel.string = cc.Mgr.Utils.getTranslation("btn-treble");
        this.noThanksLabel.string = cc.Mgr.Utils.getTranslation("btn-no-thanks");
        this.buyLabel.string = cc.Mgr.payment.priceList[10];
        this.buyDescLabel.string = cc.Mgr.Utils.getTranslation("buy-offline-desc");
        "Russian" === cc.Mgr.Config.language && (this.checkboxLabel.fontSize = 18);
        this.tripleNode.active = !cc.Mgr.game.offlineDouble;
        this.content.y = cc.Mgr.game.offlineDouble ? 0 : 50;
        this.node.width = cc.Mgr.Config.winSize.width;
        this.node.height = cc.Mgr.Config.winSize.height;
        this.num = data;
        this.doTween();
        this.blurBg.opacity = 0;
        this.content.opacity = 0;
        this.content.setScale(.5);
        cc.tween(this.blurBg).to(.05, {
          opacity: 255
        }).call().start();
        cc.tween(this.content).to(.15, {
          opacity: 255,
          scale: 1
        }).start();
        cc.Mgr.admob.showBanner("offline");
        this.noThanks.opacity = 0;
        this.noThanks.active = false;
        this.showBtnCounter && clearTimeout(this.showBtnCounter);
        var checkState;
        if (cc.Mgr.game.isPayingUser) {
          checkState = void 0 == cc.Mgr.game.isManualSetting_payingUser ? cc.Mgr.game.checkDoubleReward : cc.Mgr.game.isManualSetting_payingUser;
          this.checkBox.isChecked != checkState && (this.checkBox.isChecked = checkState);
        } else {
          checkState = void 0 == cc.Mgr.game.isManualSetting ? cc.Mgr.game.checkDoubleReward : cc.Mgr.game.isManualSetting;
          this.checkBox.isChecked != checkState && (this.checkBox.isChecked = checkState);
        }
        var currentRewardedAvailable = cc.Mgr.admob.checkAvailableRewardedAd();
        if (this.checkBox.isChecked && currentRewardedAvailable || cc.Mgr.game.isVIP || cc.Mgr.game.offlineDouble) {
          var currentNum = this.num * BigInt(3);
          this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr2(currentNum), true);
        } else this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr2(this.num), true);
        this.checkboxNode.opacity = 255;
        this.checkboxNode.active = !cc.Mgr.game.isVIP;
        false === currentRewardedAvailable && (this.checkboxNode.active = false);
        this.vipNode.active = cc.Mgr.game.isVIP;
        this.doubleNode.active = !cc.Mgr.game.isVIP && cc.Mgr.game.offlineDouble;
        this.doubleNode.active && (this.checkboxNode.active = false);
        this.getBtn.active = false;
        this.adsBtn.active = false;
        this.checkboxNode.active && this.checkBox.isChecked ? this.adsBtn.active = true : this.getBtn.active = true;
        this.adsBtn.y = -350;
        this.isDouble = false;
      },
      onClickGet: function onClickGet() {
        var _this = this;
        cc.Mgr.payment.purchaseByIndex(10, function() {
          cc.Mgr.game.offlineDouble = true;
          _this.closeUI();
        }, cc.Mgr.UIMgr.tipRoot);
      },
      onClickReceiveAds: function onClickReceiveAds() {
        if (false == this.limitClick.clickTime()) return;
        var self = this;
        cc.Mgr.admob.showRewardedVideoAd(function(_state) {
          if (_state) {
            self.num = BigInt(3) * self.num;
            self.isDouble = true;
          }
          self.closeUI();
        }, this.node, "offline", this);
      },
      onClickReceive: function onClickReceive() {
        if (false == this.limitClick.clickTime()) return;
        var self = this;
        if (cc.Mgr.game.isVIP) {
          self.num = BigInt(3) * self.num;
          self.isDouble = true;
          self.closeUI();
        } else this.closeUI();
      },
      updateAdsBtnState: function updateAdsBtnState() {
        var currentRewardedAvailable = cc.Mgr.admob.checkAvailableRewardedAd();
        if (this.checkBox.isChecked && currentRewardedAvailable || cc.Mgr.game.isVIP || cc.Mgr.game.offlineDouble) {
          var currentNum = this.num * BigInt(3);
          this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr2(currentNum), true);
        } else this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr2(this.num), true);
        this.checkboxNode.active = !cc.Mgr.game.isVIP;
        false === currentRewardedAvailable && (this.checkboxNode.active = false);
        this.vipNode.active = cc.Mgr.game.isVIP;
        this.doubleNode.active = !cc.Mgr.game.isVIP && cc.Mgr.game.offlineDouble;
        this.getBtn.active = false;
        this.adsBtn.active = false;
        this.checkboxNode.active && this.checkBox.isChecked ? this.adsBtn.active = true : this.getBtn.active = true;
      },
      adsDouble: function adsDouble() {
        cc.Mgr.AudioMgr.playSFX("click");
      },
      closeUI: function closeUI() {
        var _this2 = this;
        cc.Mgr.AudioMgr.playSFX("click");
        cc.Mgr.admob.hideBanner("offline");
        var self = this;
        cc.tween(this.blurBg).to(.15, {
          opacity: 0
        }).start();
        cc.tween(this.content).to(.15, {
          opacity: 0,
          scale: .5
        }).call(function() {
          cc.Mgr.game.money += self.num;
          cc.Mgr.game.coin_gained_total += self.num;
          cc.Mgr.UIMgr.showJibEffect();
          cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "money");
          self.node.active = false;
          cc.Mgr.game.level > 1 && _this2.showCount >= 3 ? _this2.showCount = 0 : _this2.showCount++;
          cc.Mgr.game.lastOfflineTime = cc.Mgr.Utils.GetSysTime();
          true !== self.isDouble;
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount("offlineAssets");
      }
    });
    module.exports = offlineAssetUI;
    cc._RF.pop();
  }, {} ],
  plantGetUI: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f1f332PHlJCAJmc1DliIYQt", "plantGetUI");
    "use strict";
    var DataType = require("DataType");
    var MyEnum = require("MyEnum");
    var Event = require("Event");
    var scaleConfig = 1.3;
    var tweenTime = .25;
    var plantName = require("DB_plantName");
    var plantGetUI = cc.Class({
      extends: cc.Component,
      properties: {
        titleLbl: cc.Label,
        lvLbl: cc.Label,
        powerLbl: cc.Label,
        cdLbl: cc.Label,
        dragonParentA: cc.Node,
        dragonParentB: cc.Node,
        dragonParentC: cc.Node,
        nextLvNode: cc.Label,
        previousLvNode: cc.Label,
        coinLbl: cc.Label,
        gemLbl: cc.Label,
        coinNumEffect: cc.Node,
        gemNumEffect: cc.Node,
        doubleGetBtn: cc.Node,
        getBtn: cc.Node,
        adsBtn: cc.Node,
        adsLabel: cc.Label,
        coinNode: cc.Node,
        gemNode: cc.Node,
        powerNode: cc.Node,
        cdNode: cc.Node,
        titleNode: cc.Node,
        toggle: cc.Toggle,
        btnLabel: cc.Label,
        checkboxLabel: cc.Label,
        content: cc.Node,
        blurBg: cc.Node,
        checkboxNode: cc.Node,
        vipNode: cc.Node,
        nameLabel: cc.Label,
        okBtnLabel: cc.Label,
        vipTip: cc.Label,
        coinGemNode: cc.Node,
        noThanks: cc.Node,
        noThanksLabel: cc.Label,
        getPlantCountLabel: cc.Label
      },
      doTween: function doTween(rtype) {
        var _this = this;
        this.titleNode.opacity = 0;
        this.titleNode.scale = 1;
        this.dragonParentA.opacity = 0;
        this.dragonParentB.opacity = 0;
        this.dragonParentC.opacity = 0;
        this.coinGemNode.opacity = 0;
        this.lvLbl.node.opacity = 0;
        this.nextLvNode.node.opacity = 0;
        this.cdNode.opacity = 0;
        this.powerNode.opacity = 0;
        "get" == rtype ? cc.tween(this.titleNode).to(tweenTime, {
          opacity: 255,
          scale: scaleConfig
        }).to(.1, {
          scale: 1
        }).call(function() {
          cc.tween(_this.dragonParentA).to(tweenTime, {
            opacity: 255,
            scale: 1
          }).call(function() {
            cc.tween(_this.cdNode).to(tweenTime, {
              opacity: 255
            }).start();
            cc.tween(_this.powerNode).to(tweenTime, {
              opacity: 255
            }).call(function() {
              cc.tween(_this.lvLbl.node).to(tweenTime, {
                opacity: 255
              }).start();
            }).start();
          }).start();
        }).call(function() {
          cc.Mgr.game.curGuideStep == MyEnum.GuideType.guide3 && cc.director.GlobalEvent.emit(Event.showSingleGuide, {
            step: MyEnum.GuideType.guide4
          });
        }).start() : cc.tween(this.titleNode).to(tweenTime, {
          opacity: 255,
          scale: scaleConfig
        }).to(.1, {
          scale: 1
        }).call(function() {
          cc.tween(_this.dragonParentA).to(tweenTime, {
            opacity: 255,
            scale: 1
          }).start();
          cc.tween(_this.dragonParentC).to(tweenTime, {
            opacity: 255,
            scale: 1
          }).start();
          cc.tween(_this.dragonParentB).to(tweenTime, {
            opacity: 255,
            scale: 1
          }).call(function() {
            cc.tween(_this.coinGemNode).to(tweenTime, {
              opacity: 255
            }).call(function() {
              cc.tween(_this.lvLbl.node).to(tweenTime, {
                opacity: 255
              }).start();
              cc.tween(_this.nextLvNode.node).to(tweenTime, {
                opacity: 255
              }).start();
            }).start();
          }).start();
        }).call(function() {
          cc.Mgr.game.curGuideStep == MyEnum.GuideType.guide3 && cc.director.GlobalEvent.emit(Event.showSingleGuide, {
            step: MyEnum.GuideType.guide4
          });
        }).start();
      },
      start: function start() {
        cc.Mgr.UIMgr.plantGetUI = this;
        this.showCount = 0;
        this.nextLvNode.string = cc.Mgr.Utils.getTranslation("getPlant-nextLevel");
        this.previousLvNode.string = cc.Mgr.Utils.getTranslation("getPlant-previousLevel");
        this.btnLabel.string = cc.Mgr.Utils.getTranslation("btn-claim");
        this.checkboxLabel.string = cc.Mgr.Utils.getTranslation("getReward-checkbox-treble");
        this.vipTip.string = cc.Mgr.Utils.getTranslation("vip-treble-tip");
        this.adsLabel.string = cc.Mgr.Utils.getTranslation("btn-treble");
        this.noThanksLabel.string = cc.Mgr.Utils.getTranslation("btn-no-thanks");
        this.limitClick = this.node.getComponent("LimitClick");
      },
      showUI: function showUI(from, lv, isDrone) {
        void 0 === isDrone && (isDrone = false);
        if ("unlock" === from) {
          cc.Mgr.game.needShowInterstitial = lv >= 6;
          cc.Mgr.game.needShowBanner = lv >= 6;
          cc.Mgr.Utils.reportScore(lv);
          cc.Mgr.inviteManager.sendInvitations("get new plant - auto");
        }
        this.node.width = cc.Mgr.Config.winSize.width;
        this.node.height = cc.Mgr.Config.winSize.height;
        this.plantNodeA = null;
        this.plantNodeB = null;
        this.plantNodeC = null;
        this.getCoin = 0;
        this.getGems = 0;
        this.nextLvNode.node.active = false;
        this.previousLvNode.node.active = false;
        this.powerNode.active = false;
        this.cdNode.active = false;
        this.coinNode.active = false;
        this.gemNode.active = false;
        this.doubleGetBtn.active = false;
        this.getBtn.active = false;
        this.adsBtn.active = false;
        this.checkboxNode.active = false;
        this.getPlantCountLabel.node.active = false;
        this.checkboxNode.opacity = 255;
        this.vipNode.active = false;
        var self = this;
        this.plantLevel = lv;
        var plantData = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData, lv);
        this.nameLabel.string = plantName.data[lv - 1][cc.Mgr.Config.language];
        this.nameLabel.node.setScale(0);
        cc.tween(this.nameLabel.node).to(1, {
          scale: 1
        }, {
          easing: "elasticInOut"
        }).start();
        this.lvLbl.string = cc.Mgr.Utils.getTranslation("plant-level") + " - " + lv;
        this.fromType = from;
        var currentRewardedAvailable = cc.Mgr.admob.checkAvailableRewardedAd();
        this.noThanks.opacity = 0;
        this.noThanks.active = false;
        this.showBtnCounter && clearTimeout(this.showBtnCounter);
        if ("get" == from || "look" == from) {
          this.okBtnLabel.string = "get" == from ? cc.Mgr.Utils.getTranslation("btn-claim") : cc.Mgr.Utils.getTranslation("btn-ok");
          this.getPlantCount = 1;
          this.titleLbl.string = "get" == from ? cc.Mgr.Utils.getTranslation("congratulation-get") : cc.Mgr.Utils.getTranslation("plantDetail-title");
          this.powerNode.active = false;
          this.cdNode.active = false;
          this.powerLbl.string = cc.Mgr.Utils.getNumStr2(plantData.power);
          this.cdLbl.string = plantData.cd;
          if ("get" === from) {
            this.getPlantCountLabel.node.active = true;
            this.doubleGetBtn.active = false;
            this.adsBtn.active = false;
            this.getBtn.active = false;
            if (cc.Mgr.game.needGuide) {
              this.getBtn.active = true;
              this.noThanks.opacity = 0;
              this.noThanks.active = false;
            } else {
              this.checkboxNode.active = currentRewardedAvailable;
              this.doubleGetBtn.active = false;
              this.adsBtn.active = false;
              this.checkboxNode.active && this.toggle.isChecked ? this.adsBtn.active = true : this.doubleGetBtn.active = true;
              this.toggle.isChecked && currentRewardedAvailable ? this.getPlantCountLabel.string = "x3" : this.getPlantCountLabel.string = "x1";
              var checkState;
              if (cc.Mgr.game.isPayingUser) {
                checkState = void 0 == cc.Mgr.game.isManualSetting_payingUser ? cc.Mgr.game.checkDoubleReward : cc.Mgr.game.isManualSetting_payingUser;
                this.toggle.isChecked != checkState && (this.toggle.isChecked = checkState);
              } else {
                checkState = void 0 == cc.Mgr.game.isManualSetting ? cc.Mgr.game.checkDoubleReward : cc.Mgr.game.isManualSetting;
                this.toggle.isChecked != checkState && (this.toggle.isChecked = checkState);
              }
              this.adsBtn.y = -405;
            }
          } else {
            this.getBtn.active = true;
            this.noThanks.opacity = 0;
            this.noThanks.active = false;
          }
          if (isDrone) {
            this.powerNode.active = false;
            this.cdNode.active = false;
            cc.loader.loadRes("prefab/flowerPot/HuaPen_v3", function(errmsg, prefab) {
              if (errmsg) {
                cc.error(errmsg.message || errmsg);
                return;
              }
              self.plantNodeA = cc.instantiate(prefab);
              self.plantNodeA.parent = self.dragonParentA;
              self.plantNodeA.group = MyEnum.NodeGroup.UI;
              self.plantNodeA.position = cc.v2(0, 0);
              self.plantNodeA.getComponent(cc.BoxCollider).enabled = false;
              self.plantNodeA.active = true;
              var scp = self.plantNodeA.getComponent("flowerPot");
              scp.setShowDetailsInUI(1.5, "#ffffff", true);
            });
          } else cc.loader.loadRes("prefab/plant/" + plantData.prefab, function(errmsg, prefab) {
            if (errmsg) {
              cc.error(errmsg.message || errmsg);
              return;
            }
            self.plantNodeA = cc.instantiate(prefab);
            self.plantNodeA.parent = self.dragonParentA;
            self.plantNodeA.group = MyEnum.NodeGroup.UI;
            self.plantNodeA.position = cc.v2(0, 0);
            self.plantNodeA.active = true;
            var scp = self.plantNodeA.getComponent("plant");
            scp.setShowDetailsInUI(1.5, "#ffffff", true);
          });
        } else if ("unlock" == from) {
          this.titleLbl.string = cc.Mgr.Utils.getTranslation("newPlant-title");
          this.checkboxNode.active = !cc.Mgr.game.needGuide;
          this.nextLvNode.node.active = true;
          this.previousLvNode.node.active = true;
          this.coinNode.active = true;
          var choose = lv - 2 > 0 ? lv - 2 : 1;
          var cData = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData, choose);
          var buyNum = cc.Mgr.game.plantBuyRecord[choose];
          buyNum = buyNum || 0;
          var price = cData.price * BigInt(Math.round(100 * Math.pow(1.2, buyNum))) / BigInt(100);
          1 == choose && (price = cData.price * BigInt(Math.round(100 * Math.pow(1.1, buyNum))) / BigInt(100));
          price = price * BigInt(64) / BigInt(100);
          this.price = price;
          if (this.toggle.isChecked && currentRewardedAvailable) {
            var currentNum = price * BigInt(3);
            this.coinNumEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr2(currentNum), true);
          } else this.coinNumEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr2(price), true);
          var dd = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.LevelGemData, lv);
          if (null != dd) {
            this.gems = dd.gem;
            this.gems = Math.ceil(4 * this.gems / 5);
            if (this.toggle.isChecked && currentRewardedAvailable) {
              var _currentNum = 3 * this.gems;
              this.gemNumEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr(_currentNum), true);
            } else this.gemNumEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr(this.gems), true);
            this.gemNode.active = true;
            this.getGems = this.gems;
          }
          this.getCoin = price;
          cc.loader.loadRes("prefab/plant/" + plantData.prefab, function(errmsg, prefab) {
            if (errmsg) {
              cc.error(errmsg.message || errmsg);
              return;
            }
            self.plantNodeA = cc.instantiate(prefab);
            self.plantNodeA.parent = self.dragonParentA;
            self.plantNodeA.group = MyEnum.NodeGroup.UI;
            self.plantNodeA.position = cc.v2(0, 0);
            self.plantNodeA.scale = 1;
            self.plantNodeA.active = true;
            var scp = self.plantNodeA.getComponent("plant");
            scp.setShowDetailsInUI(1.5, "#ffffff", true);
          });
          var previousPlant = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData, lv - 1);
          cc.loader.loadRes("prefab/plant/" + previousPlant.prefab, function(errmsg, prefab) {
            if (errmsg) {
              cc.error(errmsg.message || errmsg);
              return;
            }
            self.plantNodeC = cc.instantiate(prefab);
            self.plantNodeC.parent = self.dragonParentC;
            self.plantNodeC.position = cc.v2(0, 0);
            self.plantNodeC.scale = .85;
            self.plantNodeC.group = MyEnum.NodeGroup.UI;
            self.plantNodeC.active = true;
            var scp = self.plantNodeC.getComponent("plant");
            scp.setShowDetailsInUI(1, "#ffffff", true);
          });
          if (lv + 1 <= cc.Mgr.Config.allPlantCount) {
            var nextPlant = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData, lv + 1);
            cc.loader.loadRes("prefab/plant/" + nextPlant.prefab, function(errmsg, prefab) {
              if (errmsg) {
                cc.error(errmsg.message || errmsg);
                return;
              }
              self.plantNodeB = cc.instantiate(prefab);
              self.plantNodeB.parent = self.dragonParentB;
              self.plantNodeB.position = cc.v2(0, 0);
              self.plantNodeB.scale = .85;
              self.plantNodeB.group = MyEnum.NodeGroup.UI;
              self.plantNodeB.active = true;
              var scp = self.plantNodeB.getComponent("plant");
              scp.setShowDetailsInUI(1, "#000000", true);
            });
          }
          cc.Mgr.game.needGuide || (this.checkboxNode.active = true);
          cc.Mgr.game.needGuide || (this.vipNode.active = false);
          false === currentRewardedAvailable && (this.checkboxNode.active = false);
          this.doubleGetBtn.active = false;
          this.adsBtn.active = false;
          this.checkboxNode.active && this.toggle.isChecked ? this.adsBtn.active = true : this.doubleGetBtn.active = true;
          var _checkState;
          if (cc.Mgr.game.isPayingUser) {
            _checkState = void 0 == cc.Mgr.game.isManualSetting_payingUser ? cc.Mgr.game.checkDoubleReward : cc.Mgr.game.isManualSetting_payingUser;
            this.toggle.isChecked != _checkState && (this.toggle.isChecked = _checkState);
          } else {
            _checkState = void 0 == cc.Mgr.game.isManualSetting ? cc.Mgr.game.checkDoubleReward : cc.Mgr.game.isManualSetting;
            this.toggle.isChecked != _checkState && (this.toggle.isChecked = _checkState);
          }
          this.adsBtn.y = -405;
        }
        this.isDouble = false;
        this.doTween(from);
        this.blurBg.opacity = 0;
        this.content.opacity = 0;
        this.content.setScale(.5);
        cc.tween(this.blurBg).to(.05, {
          opacity: 255
        }).call().start();
        cc.tween(this.content).to(.15, {
          opacity: 255,
          scale: 1
        }).start();
      },
      updateReward: function updateReward() {
        if (cc.Mgr.game.needGuide) return;
        if ("unlock" === this.fromType) {
          var num = true === this.toggle.isChecked && this.checkboxNode.active ? this.price * BigInt(3) : this.price;
          this.coinNumEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr2(num));
          num = true === this.toggle.isChecked && this.checkboxNode.active ? 3 * this.gems : this.gems;
          this.gemNumEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr(num));
        } else "get" === this.fromType && (this.toggle.isChecked && this.checkboxNode.active ? this.getPlantCountLabel.string = "x3" : this.getPlantCountLabel.string = "x1");
        cc.Mgr.game.isManualSetting = cc.Mgr.game.isManualSetting_payingUser = this.toggle.isChecked;
        this.doubleGetBtn.active = false;
        this.adsBtn.active = false;
        this.checkboxNode.active && this.toggle.isChecked ? this.adsBtn.active = true : this.doubleGetBtn.active = true;
      },
      adsDoubleGet: function adsDoubleGet() {
        if (false == this.limitClick.clickTime()) return;
        var self = this;
        cc.Mgr.admob.showRewardedVideoAd(function(_state) {
          if (_state) {
            if ("get" === self.fromType) self.getPlantCount = 3; else {
              self.getCoin = self.getCoin * BigInt(3);
              self.getGems = 3 * self.getGems;
            }
            self.isDouble = true;
          } else self.isDouble = false;
          self.closeUI();
        }, this.node, this.fromType, this);
      },
      updateAdsBtnState: function updateAdsBtnState() {
        if ("unlock" == this.fromType) {
          var currentRewardedAvailable = cc.Mgr.admob.checkAvailableRewardedAd();
          if (this.toggle.isChecked && currentRewardedAvailable) {
            var currentNum = this.price * BigInt(3);
            this.coinNumEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr2(currentNum), true);
          } else this.coinNumEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr2(this.price), true);
          var dd = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.LevelGemData, this.plantLevel);
          if (null != dd) {
            if (this.toggle.isChecked && currentRewardedAvailable) {
              var _currentNum2 = 3 * this.gems;
              this.gemNumEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr(_currentNum2), true);
            } else this.gemNumEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr(this.gems), true);
            this.gemNode.active = true;
            this.getGems = this.gems;
          }
          false === currentRewardedAvailable && (this.checkboxNode.active = false);
          if ("unlock" == this.fromType) {
            this.doubleGetBtn.active = false;
            this.adsBtn.active = false;
            this.checkboxNode.active && this.toggle.isChecked ? this.adsBtn.active = true : this.doubleGetBtn.active = true;
          }
        }
      },
      closeUI: function closeUI() {
        var _this2 = this;
        cc.Mgr.AudioMgr.playSFX("click");
        var self = this;
        cc.tween(this.blurBg).to(.15, {
          opacity: 0
        }).start();
        cc.tween(this.content).to(.15, {
          opacity: 0,
          scale: .5
        }).call(function() {
          self.unscheduleAllCallbacks();
          if (cc.Mgr.game.needGuide && cc.Mgr.game.curGuideStep == MyEnum.GuideType.guide4) {
            cc.director.GlobalEvent.emit(Event.singleGuideComplete, {
              step: MyEnum.GuideType.guide4
            });
            cc.director.GlobalEvent.emit(Event.showSingleGuide, {
              step: MyEnum.GuideType.guide5
            });
          }
          self.plantNodeA && self.plantNodeA.destroy();
          self.plantNodeB && self.plantNodeB.destroy();
          self.plantNodeC && self.plantNodeC.destroy();
          if (self.getGems > 0) {
            cc.Mgr.game.gems += self.getGems;
            cc.Mgr.game.gem_gained_total += self.getGems;
            cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "gem");
            cc.Mgr.UIMgr.showGemsEffect();
          }
          if (self.getCoin > 0) {
            cc.Mgr.game.money += self.getCoin;
            cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "money");
            cc.Mgr.UIMgr.showJibEffect();
          }
          "get" === _this2.fromType && cc.Mgr.flowerPotMgr.addShopFlowerFot(self.plantLevel, self.getPlantCount);
          self.node.active = false;
          if ("unlock" === _this2.fromType) {
            var data = {};
            data.elapsed = cc.Mgr.Utils.getDate9(true);
            data.gem = self.getGems || 0;
            data.coin = self.getCoin.toString();
            data.level = self.plantLevel;
            data["double"] = self.toggle.isChecked && self.checkboxNode.active ? "True" : "False";
            cc.Mgr.analytics.logEvent("unlock_new_guardian", JSON.stringify(data));
            cc.Mgr.Utils.downloadRanking();
            cc.Mgr.game.level > 1 && _this2.showCount >= 3 ? _this2.showCount = 0 : _this2.showCount++;
          }
          if ("unlock" === _this2.fromType) {
            false === cc.Mgr.game.hasShowLevel8 && 6 === self.plantLevel && (cc.Mgr.game.hasShowLevel8 = true);
            false === cc.Mgr.game.hasShowLevel14 && 14 === self.plantLevel && (cc.Mgr.game.hasShowLevel14 = true);
            false === cc.Mgr.game.hasShowLevel28 && 19 === self.plantLevel && 2 !== cc.Mgr.game.rateState && (cc.Mgr.game.hasShowLevel28 = true);
            true !== self.isDouble && false === cc.Mgr.game.needGuide && self.plantLevel > 6;
          }
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount("plantGet");
        "unlock" === this.fromType && true !== cc.Mgr.game.isPayingUser && (cc.Mgr.game.checkDoubleReward = self.plantLevel >= 6);
      }
    });
    module.exports = plantGetUI;
    cc._RF.pop();
  }, {
    DB_plantName: "DB_plantName",
    DataType: "DataType",
    Event: "Event",
    MyEnum: "MyEnum"
  } ],
  plantManage: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "70f16QMLk9Pl4Q62fGQkS+6", "plantManage");
    "use strict";
    var _cc$Class;
    var EffectType = require("EffectType");
    var DataType = require("DataType");
    var MyEnum = require("MyEnum");
    var Event = require("Event");
    var MissionType = require("MissionType");
    var plantManage = cc.Class((_cc$Class = {
      extends: cc.Component,
      properties: {
        rubbishNode: cc.Node,
        frontNode: cc.Node,
        specialGridLock: cc.Node,
        specialGridUnlockEffect: dragonBones.ArmatureDisplay,
        specialGridUnlockEffect_2: cc.Node,
        specialGridUnlockEffect_3: dragonBones.ArmatureDisplay,
        unlockTipPrefab: cc.Prefab,
        vipTipNode: cc.Node,
        vipTipLabel: cc.Label,
        attackRange: cc.Node
      },
      statics: {
        instance: null
      },
      onLoad: function onLoad() {
        this.otherTipCount = 0;
        plantManage.instance = this;
        this.checkLvNumList = [ 5, 20, 50, 100 ];
      },
      resume: function resume() {
        for (var i = 0; i < this.grids.length; i++) this.grids[i].type == MyEnum.GridState.plant && this.grids[i].content.playIdleAnim();
      },
      init: function init(callback) {
        this.grids = [];
        this.initedPlantNum = 0;
        this.plantParent = this.node;
        this.plantPos = [];
        for (var i = 0; i < 12; i++) {
          var pos = {};
          pos.x = 63 * Math.floor(i / 3) - 3 - 83 * Math.floor(i % 3);
          pos.y = -1 * Math.floor(i % 3) * 43 + 112 - 39 * Math.floor(i / 3);
          this.plantPos.push(pos);
        }
        this.plantPos.push({
          x: -150,
          y: 170
        });
        this.loadedPrefabNum = 0;
        this.prefabsObjs = [];
        this.loadPrefabs(callback);
        this.setPreloadList();
        this.landBorders = [];
        this.loadLandBorder();
        this.plantMoveInfo = {
          isMove: false,
          index: -1
        };
        cc.director.GlobalEvent.on(Event.BuyPlant, this.BuyPlant, this);
        cc.director.GlobalEvent.on(Event.unlockGird, this.unlockGird, this);
        cc.director.GlobalEvent.on(Event.AllGuideComplete, this.AllGuideComplete, this);
        if (!cc.Mgr.game.needGuide) {
          this.node.on(cc.Node.EventType.TOUCH_START, function(event) {
            this.TouchStart(event);
          }, this);
          this.scheduleOnce(this.checkMerge, cc.Mgr.game.plantMergeGuideTime);
        }
        this.frontNode.zIndex = 120;
        this.rubbishNode.zIndex = 121;
        this.attackRange.parent = null;
      },
      TouchStart: function TouchStart(event) {
        this.hideMergeGuide();
        this.hideTipAttackNode(false);
      },
      showAttackRange: function showAttackRange(_parent) {
        var plant = _parent.getComponent("plant");
        if (true === this.checkHasMerge(plant.level, plant.index)) return;
        this.attackRange.parent = _parent;
        this.attackRange.setPosition(0, 30);
        this.attackRange.zIndex = -1;
        this.attackRange.setScale(12 === plant.index ? 3.5 : 1);
      },
      checkHasMerge: function checkHasMerge(_level, _index) {
        for (var i = 0; i < this.grids.length; i++) {
          var plant = this.grids[i].content;
          if (plant.level === _level && i !== _index) return true;
        }
        return false;
      },
      hideAttackRange: function hideAttackRange() {
        this.attackRange.parent = null;
      },
      loadLandBorder: function loadLandBorder() {
        var self = this;
        cc.loader.loadRes("prefab/effect/landBorder", function(errmsg, prefab) {
          if (errmsg) {
            cc.error(errmsg.message || errmsg);
            return;
          }
          var initCount = self.plantPos.length;
          for (var i = 0; i < initCount; i++) {
            var Obj = cc.instantiate(prefab);
            Obj.parent = self.plantParent;
            Obj.position = cc.v2(self.plantPos[i].x, self.plantPos[i].y + 30);
            Obj.width = 120;
            Obj.height = 80;
            Obj.active = false;
            self.landBorders.push(Obj);
          }
        });
      },
      showPickLandBorder: function showPickLandBorder(needShow, level, index) {
        void 0 === needShow && (needShow = false);
        void 0 === index && (index = -1);
        if (needShow && cc.Mgr.game.autoTimer <= 0) for (var i = 0; i < this.grids.length; i++) {
          var gird = this.grids[i];
          gird.type == MyEnum.GridState.plant && index != gird.content.index && gird.content.level == level && this.landBorders[gird.content.index] && !gird.content.isCompounded && (this.landBorders[gird.content.index].active = true);
        } else for (var i = this.landBorders.length - 1; i >= 0; i--) this.landBorders[i].active = false;
      },
      changePlantAngryState: function changePlantAngryState(enter) {
        void 0 === enter && (enter = false);
        if (this.allowRage === enter) return;
        this.allowRage = enter;
        for (var i = 0; i < this.grids.length; i++) this.grids[i].type == MyEnum.GridState.plant && this.grids[i].content.changeAngryState(enter);
        cc.Mgr.UIMgr.InGameUI.getComponent("InGameUI").updateBuffShow();
      },
      changePlantFireState: function changePlantFireState(enter) {
        void 0 === enter && (enter = false);
        if (this.allowFire === enter) return;
        this.allowFire = enter;
        for (var i = 0; i < this.grids.length; i++) this.grids[i].type == MyEnum.GridState.plant && this.grids[i].content.changeFireState(enter);
        cc.Mgr.UIMgr.InGameUI.getComponent("InGameUI").updateBuffShow();
      },
      changePlantIceState: function changePlantIceState(enter) {
        void 0 === enter && (enter = false);
        if (this.allowIce === enter) return;
        this.allowIce = enter;
        for (var i = 0; i < this.grids.length; i++) this.grids[i].type == MyEnum.GridState.plant && this.grids[i].content.changeIceState(enter);
        cc.Mgr.UIMgr.InGameUI.getComponent("InGameUI").updateBuffShow();
      },
      changePlantCritState: function changePlantCritState(enter) {
        void 0 === enter && (enter = false);
        if (this.allowCrit === enter) return;
        this.allowCrit = enter;
        for (var i = 0; i < this.grids.length; i++) this.grids[i].type == MyEnum.GridState.plant && this.grids[i].content.changeCritState(enter);
        cc.Mgr.UIMgr.InGameUI.getComponent("InGameUI").updateBuffShow();
      },
      changePlantAutoState: function changePlantAutoState(enter) {
        void 0 === enter && (enter = false);
        if (this.allowAutoMerge === enter) return;
        this.allowAutoMerge = enter;
        this.autoMerge();
        cc.Mgr.UIMgr.InGameUI.getComponent("InGameUI").updateBuffShow();
        true == this.allowAutoMerge && this.hideMergeGuide();
      },
      autoMerge: function autoMerge() {
        var _this = this;
        if (cc.Mgr.GameCenterCtrl.pauseFight) return;
        if (this.autoMergeData) {
          this.autoMergeData.startIndex = -1;
          this.autoMergeData.targetIndex = -1;
        }
        if (true !== this.allowAutoMerge) return;
        this.autoMergeResult = false;
        console.log("autoMerge");
        for (var i = 0; i < this.grids.length; i++) if (this.grids[i].type == MyEnum.GridState.plant) {
          var level = this.grids[i].content.level;
          for (var j = 0; j < this.grids.length; j++) if (this.grids[j].type == MyEnum.GridState.plant && this.grids[j].content.level == level && i != j && level !== cc.Mgr.Config.allPlantCount) {
            this.autoMergeData = {};
            this.autoMergeData.startIndex = i;
            this.autoMergeData.targetIndex = j;
            this.grids[i].content.node.zIndex = 999;
            this.grids[i].content.isMoving && this.grids[i].content.node.setPosition(this.plantPos[this.grids[i].content.index]);
            this.grids[j].content.isMoving && this.grids[j].content.node.setPosition(this.plantPos[this.grids[j].content.index]);
            this.grids[i].content.node.runAction(cc.sequence(cc.moveTo(.5, this.grids[j].content.node.getPosition()), cc.callFunc(function() {
              _this.grids[i].content.node.zIndex = _this.grids[i].content.lastZIndex;
              _this.TouchEndDone(_this.grids[i].content);
            })));
            this.autoMergeResult = true;
            return;
          }
        }
      },
      rubbishBtn: function rubbishBtn() {
        if (cc.Mgr.game.needGuide && cc.Mgr.game.curGuideStep == MyEnum.GuideType.guide8) {
          cc.director.GlobalEvent.emit(Event.singleGuideComplete, {
            step: MyEnum.GuideType.guide8
          });
          return;
        }
        cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("TrashTip"), "", cc.Mgr.UIMgr.uiRoot);
      },
      flowerPotOpen: function flowerPotOpen(data) {
        var index = data.index;
        var level = data.level;
        cc.Mgr.AudioMgr.playSFX(MyEnum.AudioType.flower_pot_tap);
        this.generateNewPlan(index, level);
        var pos = cc.v2(this.plantPos[index].x + this.grids[index].content._generateEffectPos.x, this.plantPos[index].y + this.grids[index].content._generateEffectPos.y);
        this.playMergeEffect(pos);
        var pos2 = cc.v2(this.plantPos[index].x, this.plantPos[index].y);
        var self = this;
        this.scheduleOnce(function() {
          self.playOpenFlowerEffect(pos2);
        }, 1);
      },
      AllGuideComplete: function AllGuideComplete(data) {
        this.node.on(cc.Node.EventType.TOUCH_START, function(event) {
          this.TouchStart(event);
        }, this);
        this.scheduleOnce(this.checkMerge, cc.Mgr.game.plantMergeGuideTime);
        this.checkSpaceGird();
        this.generateDropFlowerFot();
      },
      hasLockGrid: function hasLockGrid() {
        var hasLockGrid = false;
        for (var i = 0; i < 12; i++) if (cc.Mgr.plantMgr.grids[i].type == MyEnum.GridState.lock) {
          hasLockGrid = true;
          break;
        }
        return hasLockGrid;
      },
      unlockAllGrids: function unlockAllGrids() {
        for (var i = 0; i < 12; i++) if (cc.Mgr.plantMgr.grids[i].type == MyEnum.GridState.lock) {
          var param = {};
          param.index = i;
          cc.director.GlobalEvent.emit(Event.unlockGird, param);
        }
      },
      unlockSpecialGrid: function unlockSpecialGrid() {
        if (true === this.hasLockGrid() || this.grids[12].type !== MyEnum.GridState.vip) return;
        this.grids[12].type = MyEnum.GridState.vipLock;
        this.grids[12].content = {};
        this.specialGridLock.active = false;
        this.specialGridUnlockEffect.node.active = true;
        this.specialGridUnlockEffect.playAnimation("Unlock", 1);
        this.specialGridUnlockEffect.on(dragonBones.EventObject.COMPLETE, this.showSpecialGridUnlockEffect, this);
      },
      updateVipGrid: function updateVipGrid() {
        if (this.grids[12].type !== MyEnum.GridState.vip && this.grids[12].type !== MyEnum.GridState.vipLock) return;
        if (cc.Mgr.game.isVIP || cc.Mgr.game.unlockSpecialGrid) {
          this.grids[12].type = MyEnum.GridState.none;
          this.grids[12].content = {};
          this.specialGridLock.active = false;
          this.specialGridUnlockEffect.node.active = false;
          this.specialGridUnlockEffect_2.active = false;
          this.specialGridUnlockEffect_3.node.active = true;
          this.updateSpecialGridState();
        }
      },
      activateSpecialGrid: function activateSpecialGrid() {
        if (this.grids[12].type !== MyEnum.GridState.vip && this.grids[12].type !== MyEnum.GridState.vipLock) return;
        if (false === this.hasLockGrid() || this.grids[12].type === MyEnum.GridState.vipLock) {
          this.grids[12].type = MyEnum.GridState.none;
          this.grids[12].content = {};
          this.specialGridLock.active = false;
          this.specialGridUnlockEffect.node.active = false;
          this.specialGridUnlockEffect_2.active = false;
          this.specialGridUnlockEffect_3.node.active = true;
          this.updateSpecialGridState();
        } else {
          this.specialGridLock.active = false;
          this.specialGridUnlockEffect.node.active = true;
          this.specialGridUnlockEffect_3.node.active = false;
          this.specialGridUnlockEffect.playAnimation("Unlock", 1);
          this.specialGridUnlockEffect.on(dragonBones.EventObject.COMPLETE, this.showActiveSpecialGridEffect, this);
        }
      },
      updateSpecialGridState: function updateSpecialGridState() {
        this.specialGridUnlockEffect_3.node.active = true;
        this.grids[12].type === MyEnum.GridState.plant ? this.specialGridUnlockEffect_3.playAnimation("Unlock3_1", -1) : this.grids[12].type === MyEnum.GridState.none || this.grids[12].type === MyEnum.GridState.flowerPot ? this.specialGridUnlockEffect_3.playAnimation("Unlock3", -1) : this.specialGridUnlockEffect_3.node.active = false;
      },
      restoreVipGrid: function restoreVipGrid() {
        if (!cc.Mgr.game.isVIP && this.grids[12].type === MyEnum.GridState.none && !cc.Mgr.game.unlockSpecialGrid) {
          this.grids[12].type = MyEnum.GridState.vipLock;
          this.grids[12].content = {};
          this.specialGridUnlockEffect_3.node.active = false;
          this.specialGridUnlockEffect_2.active = true;
        }
      },
      showActiveSpecialGridEffect: function showActiveSpecialGridEffect() {
        this.specialGridUnlockEffect.active = false;
        this.grids[12].type = MyEnum.GridState.none;
        this.grids[12].content = {};
        this.updateSpecialGridState();
      },
      showSpecialGridUnlockEffect: function showSpecialGridUnlockEffect() {
        this.specialGridUnlockEffect.node.active = false;
        this.specialGridUnlockEffect_2.active = true;
      },
      onClickVip: function onClickVip() {
        cc.Mgr.UIMgr.openSpecialGridBundle();
      },
      unlockGird: function unlockGird(data) {
        var index = data.index;
        this.grids[index].content.plantDestroy();
        this.grids[index].type = MyEnum.GridState.none;
        this.grids[index].content = {};
        var obj = cc.Mgr.EffectMgr.getObFromPool(EffectType.DieSmoke);
        obj.active = true;
        obj.parent = this.node;
        obj.position = cc.v2(this.plantPos[index].x, this.plantPos[index].y + 50);
        obj.getComponent("dieSmoke").playAnimation(function() {});
        this.unlockSpecialGrid();
        if (this.unlockTip && this.unlockTip.active) {
          this.unlockTip.getComponent("UnlockTip").closeTip();
          cc.Mgr.plantMgr.otherTipCount--;
        }
        if (this.guideUnlockTip && this.guideUnlockTip.active) {
          this.guideUnlockTip.getComponent("UnlockTip").closeTip();
          cc.Mgr.plantMgr.otherTipCount--;
        }
      },
      checkHasAnySpaceGird: function checkHasAnySpaceGird(judeNumTwo) {
        void 0 === judeNumTwo && (judeNumTwo = false);
        var num = 0;
        for (var i = 0; i < this.grids.length; i++) this.grids[i].type == MyEnum.GridState.none && num++;
        var noneDropNun = cc.Mgr.flowerPotMgr.noneDropFlowerFotNun();
        return judeNumTwo ? num - noneDropNun >= 2 : num > noneDropNun;
      },
      addPlantAtGridByLv: function addPlantAtGridByLv(plantId) {
        for (var i = 0; i < this.grids.length; i++) {
          var gird = this.grids[i];
          if (gird.type == MyEnum.GridState.none) {
            this.generateNewPlan(i, plantId);
            return;
          }
        }
      },
      BuyPlant: function BuyPlant(data) {
        for (var i = 0; i < this.grids.length; i++) {
          var gird = this.grids[i];
          if (gird.type == MyEnum.GridState.none) {
            var plantId = cc.Mgr.game.canBuyPlantId;
            cc.Mgr.game.plantBuyRecord[plantId]++;
            this.generateNewPlan(i, plantId);
            cc.Mgr.game.money -= data.money;
            cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "money");
            return;
          }
        }
        i == this.grids.length && cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("NoSpaceForPlant"), "", cc.Mgr.UIMgr.uiRoot);
      },
      checkTrash: function checkTrash() {
        var result = true;
        var lastLevel = cc.Mgr.Config.allPlantCount;
        var levelList = [];
        this.targetIdx = -1;
        for (var i = 0; i < this.grids.length; i++) {
          var grid = this.grids[i];
          grid.type === MyEnum.GridState.none && (result = false);
          if (grid.type === MyEnum.GridState.plant) {
            if (grid.content.level < lastLevel) {
              lastLevel = grid.content.level;
              this.targetIdx = i;
            }
            levelList.push(grid.content.level);
          }
        }
        var tem = this.refrain(levelList);
        tem.indexOf(lastLevel) >= 0 && (result = false);
        true === this.checkHasMergeItem() && (result = false);
      },
      showTrashGuide: function showTrashGuide(startPos, endPos) {
        if (this.unlockTip && this.unlockTip.active) return;
        if (this.grids[6].type === MyEnum.GridState.lock) return;
        if (true == this.showGuideUnlockGrid()) return;
        if (null != this.trashGuideNode && this.trashGuideNode.active) return;
        cc.Mgr.UIMgr.showTipToTrash(true);
        if (null == this.trashGuideNode) {
          this.trashGuideNode = cc.instantiate(this.plantTrashGuidePrefab);
          this.trashGuideNode.parent = this.node.parent;
        }
        if (cc.Mgr.game.zoomIn) {
          startPos.x += 70;
          startPos.y += 20;
          endPos.x += 20;
          endPos.y -= 30;
        }
        this.trashGuideNode.getComponent("PlantMergeGuide").startMove(startPos, endPos);
        this.trashGuideNode.active = true;
      },
      hideTrashGuide: function hideTrashGuide() {
        if (null != this.trashGuideNode && this.trashGuideNode.active) {
          this.trashGuideNode.getComponent("PlantMergeGuide").stopMove();
          this.trashGuideNode.active = false;
        }
      },
      refrain: function refrain(arr) {
        var tmp = [];
        Array.isArray(arr) && arr.concat().sort().sort(function(a, b) {
          a == b && -1 === tmp.indexOf(a) && tmp.push(a);
        });
        return tmp;
      },
      generateNewPlan: function generateNewPlan(index, level) {
        var _this2 = this;
        var self = this;
        self.grids[index].type = MyEnum.GridState.plant;
        cc.Mgr.game.updatePlantOwnsByLv(level);
        var plantData = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData, level);
        var name = plantData.prefab;
        self.loadNewPlant(name, function(prefab) {
          var plant = cc.instantiate(prefab);
          plant.parent = self.plantParent;
          var plantItem = plant.getComponent("plant");
          plantItem.init(index, self.plantPos[index], plantData);
          plantItem.TouchEndCb = function(plant) {
            self.TouchEndDone(plant);
          };
          plantItem.TouchStartCb = function() {
            self.TouchStartDone();
          };
          self.grids[index].content = plantItem;
          self.grids[index].content.setIndex(index);
          if (cc.Mgr.game.needGuide) {
            cc.Mgr.AudioMgr.playSFX(MyEnum.AudioType.click);
            if (cc.Mgr.game.curGuideStep == MyEnum.GuideType.guide1) {
              cc.director.GlobalEvent.emit(Event.singleGuideComplete, {
                step: MyEnum.GuideType.guide1
              });
              cc.director.GlobalEvent.emit(Event.showSingleGuide, {
                step: MyEnum.GuideType.guide2
              });
            } else if (cc.Mgr.game.curGuideStep == MyEnum.GuideType.guide2) {
              cc.director.GlobalEvent.emit(Event.singleGuideComplete, {
                step: MyEnum.GuideType.guide2
              });
              cc.director.GlobalEvent.emit(Event.showSingleGuide, {
                step: MyEnum.GuideType.guide3
              });
            } else cc.Mgr.game.needGuide && cc.Mgr.game.curGuideStep == MyEnum.GuideType.guide6 ? cc.director.GlobalEvent.emit(Event.singleGuideComplete, {
              step: MyEnum.GuideType.guide6
            }) : cc.Mgr.game.needGuide && cc.Mgr.game.curGuideStep == MyEnum.GuideType.guide7;
          }
          _this2.showUnlockGridTip();
          _this2.updateSpecialGridState();
          _this2.checkTrash();
          false == _this2.autoMergeResult && cc.Mgr.UIMgr.currentShowUICount <= 0 && _this2.autoMerge();
        });
      },
      setPreloadList: function setPreloadList() {
        this.preloadList = [];
        for (var i = 0; i < cc.Mgr.Config.allPlantCount; i++) {
          var plantData = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData, i + 1);
          this.preloadList.push(plantData.prefab);
        }
      },
      loadNewPlant: function loadNewPlant(_plantName, _callback) {
        var self = this;
        self.prefabsObjs[_plantName] ? _callback && _callback(self.prefabsObjs[_plantName]) : cc.loader.loadRes("prefab/plant/" + _plantName, function(err, prefab) {
          if (err) {
            cc.error(err.message || err);
            return;
          }
          self.prefabsObjs[_plantName] = prefab;
          _callback && _callback(prefab);
        });
      },
      loadPlantsPrefab: function loadPlantsPrefab() {
        var self = this;
        if (this.preloadList.length > 0) {
          var item = this.preloadList.shift();
          var prefabName = item;
          if (self.prefabsObjs[prefabName]) {
            self.loadPlantsPrefab();
            return;
          }
          item = "prefab/plant/" + item;
          cc.loader.loadRes(item, function(err, prefab) {
            if (err) {
              cc.error(err.message || err);
              return;
            }
            if (!self.prefabsObjs) return;
            self.prefabsObjs[prefabName] = prefab;
            self.loadPlantsPrefab();
          });
        }
      },
      loadPrefabs: function loadPrefabs(callback) {
        var self = this;
        var filterList = [];
        for (var i = 0; i < cc.Mgr.game.plantsPK.length; i++) {
          var pk = cc.Mgr.game.plantsPK[i];
          if (pk.type == MyEnum.GridState.plant || pk.type == MyEnum.GridState.flowerPot) {
            var plantData = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData, pk.level);
            if (filterList.indexOf(plantData.prefab) >= 0) continue;
            filterList.push(plantData.prefab);
            self.loadedPrefabNum++;
            cc.loader.loadRes("prefab/plant/" + plantData.prefab, function(err, prefab) {
              if (err) {
                cc.error(err.message || err);
                return;
              }
              self.prefabsObjs[prefab.name] = prefab;
              self.loadedPrefabNum--;
              0 == self.loadedPrefabNum && callback();
            });
          }
        }
        self.loadedPrefabNum++;
        cc.loader.loadRes("prefab/effect/rage_ske", cc.Prefab, function(errmsg, prefab) {
          if (errmsg) {
            cc.error(errmsg.message || errmsg);
            return;
          }
          self.ragePrefab = cc.instantiate(prefab);
          self.loadedPrefabNum--;
          0 == self.loadedPrefabNum && callback();
        });
        self.loadedPrefabNum++;
        cc.loader.loadRes("prefab/effect/flame_ske", cc.Prefab, function(errmsg, prefab) {
          if (errmsg) {
            cc.error(errmsg.message || errmsg);
            return;
          }
          self.flamePrefab = cc.instantiate(prefab);
          self.loadedPrefabNum--;
          0 == self.loadedPrefabNum && callback();
        });
        self.loadedPrefabNum++;
        cc.loader.loadRes("prefab/effect/ice_ske", cc.Prefab, function(errmsg, prefab) {
          if (errmsg) {
            cc.error(errmsg.message || errmsg);
            return;
          }
          self.freezePrefab = cc.instantiate(prefab);
          self.loadedPrefabNum--;
          0 == self.loadedPrefabNum && callback();
        });
        self.loadedPrefabNum++;
        cc.loader.loadRes("prefab/effect/crit_ske", cc.Prefab, function(errmsg, prefab) {
          if (errmsg) {
            cc.error(errmsg.message || errmsg);
            return;
          }
          self.critPrefab = cc.instantiate(prefab);
          self.loadedPrefabNum--;
          0 == self.loadedPrefabNum && callback();
        });
        self.loadedPrefabNum++;
        cc.loader.loadRes("prefab/plant/lockGird", function(err, prefab) {
          if (err) {
            cc.error(err.message || err);
            return;
          }
          self.lockGirdPrefab = prefab;
          self.loadedPrefabNum--;
          0 == self.loadedPrefabNum && callback();
        });
        self.loadedPrefabNum++;
        cc.loader.loadRes("prefab/uiPrefab/PlantMergeGuide", function(err, prefab) {
          if (err) {
            cc.error(err.message || err);
            return;
          }
          self.plantMergeGuidePrefab = prefab;
          self.loadedPrefabNum--;
          0 == self.loadedPrefabNum && callback();
        });
        self.loadedPrefabNum++;
        cc.loader.loadRes("prefab/uiPrefab/PlantTrashGuide", function(err, prefab) {
          if (err) {
            cc.error(err.message || err);
            return;
          }
          self.plantTrashGuidePrefab = prefab;
          self.loadedPrefabNum--;
          0 == self.loadedPrefabNum && callback();
        });
      },
      showVipTip: function showVipTip() {
        if (this.vipTipNode.active || this.otherTipCount > 0) return;
        if (this.grids[12].type === MyEnum.GridState.none || this.grids[12].type === MyEnum.GridState.plant || this.grids[12].type === MyEnum.GridState.flowerPot || this.otherTipCount > 0 || this.hasLockGrid()) return;
        this.vipTipLabel.string = cc.Mgr.Utils.getTranslation("unlock-fort-tip");
        this.vipTipNode.active = true;
        this.otherTipCount++;
      }
    }, _cc$Class["hasLockGrid"] = function hasLockGrid() {
      var result = false;
      for (var i = 0; i < 12; i++) {
        var grid = this.grids[i];
        if (grid.type === MyEnum.GridState.lock) {
          result = true;
          break;
        }
      }
      return result;
    }, _cc$Class.hideVipTip = function hideVipTip() {
      this.vipTipNode.active && this.otherTipCount--;
      this.vipTipNode.active = false;
    }, _cc$Class.initPlants = function initPlants() {
      var self = this;
      var plantsConfig = [ 0, 0, 0, 0, 73, 0, 0, 0, 0, 0, 0, 0, 0 ];
      for (var i = 0; i < this.plantPos.length; i++) {
        var grid = {};
        var pk = cc.Mgr.game.plantsPK[i];
        if (12 == i && pk.type !== MyEnum.GridState.vip && pk.type !== MyEnum.GridState.vipLock) {
          this.specialGridLock.active = false;
          this.specialGridUnlockEffect.node.active = false;
          this.specialGridUnlockEffect_2.active = false;
        }
        if (pk.type == MyEnum.GridState.plant || pk.type == MyEnum.GridState.flowerPot) {
          var plantData = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData, pk.level);
          var name = plantData.prefab;
          var plant = cc.instantiate(self.prefabsObjs[name]);
          plant.parent = self.plantParent;
          var plantItem = plant.getComponent("plant");
          plantItem.init(i, self.plantPos[i], plantData);
          plantItem.TouchEndCb = function(plant) {
            self.TouchEndDone(plant);
          };
          plantItem.TouchStartCb = function() {
            self.TouchStartDone();
          };
          grid.type = MyEnum.GridState.plant;
          grid.content = plantItem;
          self.grids.push(grid);
        } else if (pk.type == MyEnum.GridState.lock) {
          var plant = cc.instantiate(self.lockGirdPrefab);
          plant.parent = self.plantParent;
          var plantItem = plant.getComponent("lockGird");
          plantItem.init(i, pk.level, self.plantPos[i]);
          plantItem.TouchEndCb = function(plant) {
            self.TouchEndDone(plant);
          };
          plantItem.TouchStartCb = function() {
            self.TouchStartDone();
          };
          grid.type = MyEnum.GridState.lock;
          grid.content = plantItem;
          self.grids.push(grid);
        } else if (pk.type == MyEnum.GridState.vip) {
          this.specialGridLock.active = true;
          this.specialGridUnlockEffect.node.active = false;
          this.specialGridUnlockEffect_2.active = false;
          this.specialGridUnlockEffect_3.node.active = false;
          grid.type = MyEnum.GridState.vip;
          grid.content = {};
          self.grids.push(grid);
        } else if (pk.type == MyEnum.GridState.vipLock) {
          this.specialGridLock.active = false;
          this.specialGridUnlockEffect.node.active = false;
          this.specialGridUnlockEffect_2.active = true;
          this.specialGridUnlockEffect_3.node.active = false;
          grid.type = MyEnum.GridState.vipLock;
          grid.content = {};
          self.grids.push(grid);
        } else {
          if (12 == i) {
            this.specialGridLock.active = false;
            this.specialGridUnlockEffect.node.active = false;
            this.specialGridUnlockEffect_2.active = false;
            this.specialGridUnlockEffect_3.node.active = true;
          }
          grid.type = MyEnum.GridState.none;
          grid.content = {};
          self.grids.push(grid);
        }
      }
      this.updateSpecialGridState();
      this.showUnlockGridTip();
      this.checkTrash();
      if (!cc.Mgr.game.needGuide) {
        this.checkSpaceGird();
        this.generateDropFlowerFot();
      }
      this.grids[12].type !== MyEnum.GridState.vip && this.grids[12].type !== MyEnum.GridState.vipLock || !cc.Mgr.game.isVIP && !cc.Mgr.game.unlockSpecialGrid || this.updateVipGrid();
    }, _cc$Class.guideStep3Run = function guideStep3Run() {
      var startIndex = 7;
      var endIndex = 8;
      var startPos = cc.v2(this.plantPos[startIndex].x, this.plantPos[startIndex].y);
      var endPos = cc.v2(this.plantPos[endIndex].x, this.plantPos[endIndex].y);
      this.showMergeGuide(startPos, endPos);
    }, _cc$Class.showMergeGuide = function showMergeGuide(startPos, endPos) {
      if (true == this.allowAutoMerge) return;
      if (null != this.MergeGuideNode && this.MergeGuideNode.active) return;
      if (null == this.MergeGuideNode) {
        this.MergeGuideNode = cc.instantiate(this.plantMergeGuidePrefab);
        this.MergeGuideNode.parent = this.node.parent;
      }
      if (cc.Mgr.game.zoomIn) {
        startPos.x += 60;
        startPos.y += 20;
        endPos.x += 60;
        endPos.y += 20;
      }
      this.MergeGuideNode.getComponent("PlantMergeGuide").startMove(startPos, endPos);
      this.MergeGuideNode.active = true;
      this.otherTipCount++;
    }, _cc$Class.hideMergeGuide = function hideMergeGuide() {
      if (!cc.Mgr.game.needGuide) {
        this.unschedule(this.checkMerge);
        this.unschedule(this.hideMergeGuide);
        this.scheduleOnce(this.checkMerge, cc.Mgr.game.plantMergeGuideTime);
      }
      if (null != this.MergeGuideNode) {
        this.MergeGuideNode.active && this.otherTipCount--;
        this.MergeGuideNode.getComponent("PlantMergeGuide").stopMove();
        this.MergeGuideNode.active = false;
      }
    }, _cc$Class.checkHasMergeItem = function checkHasMergeItem() {
      var plants = new Array();
      for (var i = 0; i < this.grids.length; i++) this.grids[i].type == MyEnum.GridState.plant && plants.push(this.grids[i].content);
      plants.sort(function(a, b) {
        return b.level - a.level;
      });
      for (i = 0; i < plants.length; i++) if (i != plants.length - 1 && plants[i].level == plants[i + 1].level) return true;
      return false;
    }, _cc$Class.checkMerge = function checkMerge() {
      if (cc.Mgr.game.level > 5) return;
      var plants = new Array();
      for (var i = 0; i < this.grids.length; i++) this.grids[i].type == MyEnum.GridState.plant && plants.push(this.grids[i].content);
      plants.sort(function(a, b) {
        return b.level - a.level;
      });
      for (i = 0; i < plants.length; i++) if (i != plants.length - 1 && plants[i].level == plants[i + 1].level && plants[i].level < cc.Mgr.Config.allPlantCount) {
        var startIndex = plants[i].index;
        var endIndex = plants[i + 1].index;
        var startPos = cc.v2(this.plantPos[startIndex].x, this.plantPos[startIndex].y);
        var endPos = cc.v2(this.plantPos[endIndex].x, this.plantPos[endIndex].y);
        this.showMergeGuide(startPos, endPos);
        break;
      }
      this.scheduleOnce(this.hideMergeGuide, cc.Mgr.game.plantMergeGuideHideTime);
    }, _cc$Class.generateDropFlowerFot = function generateDropFlowerFot() {
      var self = this;
      this.schedule(function() {
        var spaceGirdNun = 0;
        for (var gird in self.grids) gird.type == MyEnum.GridState.none && spaceGirdNun++;
        cc.Mgr.flowerPotMgr.addDropFlowerFot(spaceGirdNun);
      }, cc.Mgr.game.airDropTime);
    }, _cc$Class.checkSpaceGird = function checkSpaceGird() {
      var self = this;
      this.schedule(function() {
        if (!cc.Mgr.flowerPotMgr.haveFlowerFot()) return;
        var spaceGirds = new Array();
        for (var i = 0; i < self.grids.length; i++) {
          var gird = self.grids[i];
          gird.type == MyEnum.GridState.none && spaceGirds.push(i);
        }
        var spaceNum = spaceGirds.length;
        if (spaceNum > 0) {
          var flowerFot = cc.Mgr.flowerPotMgr.getFlowerFot();
          if (null != flowerFot) {
            var random = Math.floor(Math.random() * spaceNum);
            var index = cc.Mgr.game.needGuide ? spaceGirds[0] : spaceGirds[random];
            flowerFot.parent = self.plantParent;
            var flowerFotItem = flowerFot.getComponent("flowerPot");
            flowerFotItem.init(index, self.plantPos[index]);
            self.grids[index].type = MyEnum.GridState.flowerPot;
            self.grids[index].content = flowerFotItem;
          }
        }
      }, cc.Mgr.Config.CheckPotGrownInterval);
    }, _cc$Class.compoundNewPlant = function compoundNewPlant(index, level) {
      var _this3 = this;
      var self = this;
      self.grids[index].type = MyEnum.GridState.plant;
      cc.Mgr.game.updatePlantOwnsByLv(level);
      var ownsCount = cc.Mgr.game.getPlantOwnsDataByLv(level);
      var countId = 5 === ownsCount ? "" : "_" + ownsCount;
      this.checkLvNumList.indexOf(ownsCount) >= 0 && cc.Mgr.Utils.uploadAchievment("getGuardians_" + level + countId, level, ownsCount);
      var plantData = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData, level);
      var self = this;
      var name = plantData.prefab;
      cc.Mgr.game.updateMissionProgressById(MissionType.MergePlant);
      self.loadNewPlant(name, function(prefab) {
        var plant = cc.instantiate(prefab);
        plant.parent = self.plantParent;
        var plantItem = plant.getComponent("plant");
        plantItem.init(index, self.plantPos[index], plantData);
        plantItem.TouchEndCb = function(plant) {
          self.TouchEndDone(plant);
        };
        plantItem.TouchStartCb = function() {
          self.TouchStartDone();
        };
        self.grids[index].content = plantItem;
        self.grids[index].content.setIndex(index);
        cc.tween(plant).to(.2, {
          scale: 1.5
        }).to(.2, {
          scale: 1
        }).call(function() {}).start();
        cc.Mgr.AudioMgr.playSFX(MyEnum.AudioType.merge);
        cc.Mgr.game.plantMaxLv >= 6 && cc.Mgr.game.doubleBtnIntervalTime <= 0 && cc.Mgr.UIMgr.InGameUI.showDoubleCoinBtn(true);
        cc.Mgr.game.needGuide && cc.Mgr.game.curGuideStep == MyEnum.GuideType.guide3 && cc.director.GlobalEvent.emit(Event.singleGuideComplete, {
          step: MyEnum.GuideType.guide3
        });
        cc.Mgr.UIMgr.currentShowUICount <= 0 && _this3.autoMerge();
      });
    }, _cc$Class.plantCompound = function plantCompound(startIndex, endIndex, level) {
      var _this4 = this;
      cc.Mgr.game.needGuide && cc.Mgr.game.curGuideStep == MyEnum.GuideType.guide3 && this.hideMergeGuide();
      this.grids[startIndex].content.compounded();
      this.grids[endIndex].content.compounded();
      var targetPos = this.plantPos[endIndex];
      cc.tween(this.grids[startIndex].content.node).to(.3, {
        position: cc.v2(targetPos.x - 40, targetPos.y)
      }).to(.15, {
        position: cc.v2(targetPos.x, targetPos.y)
      }).start();
      cc.tween(this.grids[endIndex].content.node).to(.3, {
        position: cc.v2(targetPos.x + 40, targetPos.y)
      }).to(.15, {
        position: cc.v2(targetPos.x, targetPos.y)
      }).call(function() {
        _this4.grids[startIndex].type = MyEnum.GridState.none;
        _this4.grids[startIndex].content.plantDestroy();
        _this4.grids[endIndex].type = MyEnum.GridState.none;
        _this4.grids[endIndex].content.plantDestroy();
        if (cc.Mgr.game.plantMaxLv < level + 1) {
          cc.Mgr.game.plantMaxLv = level + 1;
          cc.Mgr.UIMgr.openPlantGetUI("unlock", cc.Mgr.game.plantMaxLv);
        }
        _this4.compoundNewPlant(endIndex, level + 1);
        var pos = cc.v2(targetPos.x + _this4.grids[endIndex].content._generateEffectPos.x, targetPos.y + _this4.grids[endIndex].content._generateEffectPos.y);
        _this4.playMergeEffect(pos);
        cc.Mgr.UIMgr.InGameUI.RefreshBuyButtonMergeAll();
        _this4.checkTrash();
        _this4.restoreVipGrid();
      }).start();
    }, _cc$Class.plantPutRubbish = function plantPutRubbish(index, showSmoke) {
      void 0 === showSmoke && (showSmoke = true);
      if (showSmoke) {
        var obj = cc.Mgr.EffectMgr.getObFromPool(EffectType.DieSmoke);
        obj.active = true;
        obj.parent = this.rubbishNode;
        obj.y = this.node.y;
        obj.x = this.node.x;
        var self = this;
        obj.getComponent("dieSmoke").playAnimation(function() {
          cc.Mgr.UIMgr.GameInUINode.getComponent("InGameUI").buyButtonNode.active = true;
          cc.Mgr.GameCenterCtrl.rubbishNode.active = false;
        });
      }
      var backMoney = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData, this.grids[index].content.level).price;
      var money = backMoney / BigInt(2);
      cc.Mgr.UIMgr.playCoinFlyForRecovery(money);
      cc.tween(this.rubbishNode).to(.2, {
        scale: cc.Mgr.game.zoomIn ? 1 : 1.2
      }).to(.2, {
        scale: cc.Mgr.game.zoomIn ? .83 : 1
      }).start();
      this.grids[index].type = MyEnum.GridState.none;
      this.grids[index].content.plantDestroy();
    }, _cc$Class.playMergeEffect = function playMergeEffect(targetPos) {
      var obj = cc.Mgr.EffectMgr.getObFromPool(EffectType.Merge);
      obj.active = true;
      if (null == obj) return;
      obj.parent = this.plantParent;
      obj.zIndex = 0;
      obj.scale = .5;
      obj.y = targetPos.y;
      obj.x = targetPos.x;
      obj.getComponent("plantMerge").playAnimation();
    }, _cc$Class.playOpenFlowerEffect = function playOpenFlowerEffect(targetPos) {
      var obj = cc.Mgr.EffectMgr.getObFromPool(EffectType.flowerPotOpen);
      obj.active = true;
      if (null == obj) return;
      obj.parent = this.plantParent;
      obj.zIndex = 13;
      obj.scale = .7;
      obj.y = targetPos.y;
      obj.x = targetPos.x;
      obj.getComponent("flowerPotOpen").playAnimation();
    }, _cc$Class.plantExchange = function plantExchange(startIndex, endIndex) {
      var plantContent = this.grids[startIndex].content;
      this.grids[startIndex].content = this.grids[endIndex].content;
      this.grids[startIndex].content.setPosition(this.plantPos[startIndex]);
      this.grids[startIndex].content.setIndex(startIndex);
      this.grids[endIndex].content = plantContent;
      this.grids[endIndex].content.setPosition(this.plantPos[endIndex]);
      this.grids[endIndex].content.setIndex(endIndex);
    }, _cc$Class.plantChangePos = function plantChangePos(startIndex, endIndex) {
      if (cc.Mgr.game.needGuide && cc.Mgr.game.curGuideStep == MyEnum.GuideType.guide5) {
        cc.director.GlobalEvent.emit(Event.singleGuideComplete, {
          step: MyEnum.GuideType.guide5
        });
        cc.director.GlobalEvent.emit(Event.showSingleGuide, {
          step: MyEnum.GuideType.guide6
        });
      }
      var plantContent = this.grids[startIndex].content;
      this.grids[startIndex].type = MyEnum.GridState.none;
      this.grids[startIndex].content = {};
      this.grids[endIndex].content = plantContent;
      this.grids[endIndex].type = MyEnum.GridState.plant;
      this.grids[endIndex].content.setPosition(this.plantPos[endIndex]);
      this.grids[endIndex].content.setIndex(endIndex);
    }, _cc$Class.TouchStartDone = function TouchStartDone() {
      cc.tween(this.rubbishNode).to(.2, {
        scale: cc.Mgr.game.zoomIn ? 1 : 1.2
      }).start();
    }, _cc$Class.TouchEndDone = function TouchEndDone(_plant) {
      var resultIndex = null;
      var lastDis = 999;
      for (var i = 0; i < this.plantPos.length; i++) {
        if (i == _plant.index) continue;
        if (this.grids[i].type == MyEnum.GridState.plant && this.grids[i].content.isCompounded) continue;
        if (cc.Mgr.game.needGuide && cc.Mgr.game.curGuideStep == MyEnum.GuideType.guide5 && 11 != i) continue;
        if (cc.Mgr.game.needGuide && cc.Mgr.game.curGuideStep == MyEnum.GuideType.guide3 && 8 != i) continue;
        if (cc.Mgr.game.needGuide && cc.Mgr.game.curGuideStep == MyEnum.GuideType.guide4) continue;
        var distance = cc.Mgr.Utils.pDistance(_plant.node.position, this.plantPos[i]);
        if (distance < 50 && distance < lastDis) {
          resultIndex = i;
          lastDis = distance;
        }
      }
      if (null == resultIndex && !cc.Mgr.game.needGuide) {
        var disX = Math.abs(_plant.node.position.x - this.rubbishNode.position.x);
        var disY = Math.abs(_plant.node.position.y - this.rubbishNode.position.y);
        disX < 100 && disY < 100 && (resultIndex = this.plantPos.length);
      }
      if (null != resultIndex) this.touchEndHandle(resultIndex, _plant); else {
        _plant.setPosition(this.plantPos[_plant.index]);
        cc.Mgr.UIMgr.GameInUINode.getComponent("InGameUI").buyButtonNode.active = true;
        cc.Mgr.GameCenterCtrl.rubbishNode.active = false;
      }
      cc.tween(this.rubbishNode).to(.2, {
        scale: cc.Mgr.game.zoomIn ? .83 : 1
      }).start();
      this.updateSpecialGridState();
    }, _cc$Class.touchEndHandle = function touchEndHandle(_index, _plant) {
      if (_index == this.plantPos.length) {
        if (_plant.level == cc.Mgr.game.plantMaxLv) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("max-level-cannt-recovery"), "", cc.Mgr.UIMgr.uiRoot);
          _plant.setPosition(this.plantPos[_plant.index]);
          cc.Mgr.UIMgr.GameInUINode.getComponent("InGameUI").buyButtonNode.active = true;
          cc.Mgr.GameCenterCtrl.rubbishNode.active = false;
        } else {
          this.plantPutRubbish(_plant.index);
          this.checkTrash();
          this.restoreVipGrid();
        }
        return;
      }
      cc.Mgr.UIMgr.GameInUINode.getComponent("InGameUI").buyButtonNode.active = true;
      cc.Mgr.GameCenterCtrl.rubbishNode.active = false;
      var currentGrid = this.grids[_index];
      if (this.autoMergeData && _plant.index != this.autoMergeData.startIndex && currentGrid.type == MyEnum.GridState.plant && (currentGrid.content.index == this.autoMergeData.startIndex || currentGrid.content.index == this.autoMergeData.targetIndex)) {
        _plant.setPosition(this.plantPos[_plant.index]);
        return;
      }
      if (currentGrid.type == MyEnum.GridState.plant && _plant.level == currentGrid.content.level) if (_plant.level != cc.Mgr.Config.allPlantCount) if (12 !== _index || cc.Mgr.game.isVIP || cc.Mgr.game.unlockSpecialGrid) this.plantCompound(_plant.index, _index, _plant.level); else {
        cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("vip-tip-01"), "", cc.Mgr.UIMgr.uiRoot);
        _plant.setPosition(this.plantPos[_plant.index]);
      } else {
        cc.Mgr.UIMgr.openMaxLevelUI();
        _plant.setPosition(this.plantPos[_plant.index]);
      } else if (currentGrid.type == MyEnum.GridState.plant && _plant.level != currentGrid.content.level) if (12 !== _index && 12 !== _plant.index || cc.Mgr.game.isVIP || cc.Mgr.game.unlockSpecialGrid) this.plantExchange(_plant.index, _index); else {
        cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("vip-tip-01"), "", cc.Mgr.UIMgr.uiRoot);
        _plant.setPosition(this.plantPos[_plant.index]);
      } else if (currentGrid.type == MyEnum.GridState.none) {
        this.plantChangePos(_plant.index, _index);
        this.restoreVipGrid();
      } else if (currentGrid.type == MyEnum.GridState.flowerPot || currentGrid.type == MyEnum.GridState.lock) _plant.setPosition(this.plantPos[_plant.index]); else if (currentGrid.type == MyEnum.GridState.vipLock) {
        this.onClickVip();
        _plant.setPosition(this.plantPos[_plant.index]);
      } else _plant.setPosition(this.plantPos[_plant.index]);
    }, _cc$Class.checkMaxLvPlantCanAttack = function checkMaxLvPlantCanAttack() {
      var param = {};
      param.needShow = false;
      var key = cc.Mgr.game.level > 60 ? cc.Mgr.game.level % 60 + "_" + cc.Mgr.game.curBoshu : cc.Mgr.game.level + "_" + cc.Mgr.game.curBoshu;
      var lvdt = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.LevelData, key);
      if (cc.Mgr.game.curBoshu != lvdt.waveCount) return param;
      for (var i = 0; i < this.grids.length; i++) if (this.grids[i].type == MyEnum.GridState.plant && this.grids[i].content.level == cc.Mgr.game.plantMaxLv && cc.Mgr.game.plantMaxLv >= 6 && !this.grids[i].content.hasAttackObj() && !this.grids[i].content.isCompounded && this.plantMoveInfo.index != this.grids[i].content.index) {
        param.needShow = true;
        param.index = this.grids[i].content.index;
        cc.Mgr.game.pickOutMaxLvPlant = param.index;
        return param;
      }
      return param;
    }, _cc$Class.showUnlockGridTip = function showUnlockGridTip() {
      if (this.unlockTip && this.unlockTip.active) return;
      var firstGridLock = this.grids[6].type === MyEnum.GridState.lock;
      if (!firstGridLock || this.checkHasAnySpaceGird()) return;
      this.unlockTip = cc.instantiate(this.unlockTipPrefab);
      this.unlockTip.parent = this.plantParent;
      this.unlockTip.zIndex = 999;
      this.unlockTip.scale = .75;
      this.unlockTip.setPosition(this.grids[6].content.node.x, this.grids[6].content.node.y + 80);
      cc.Mgr.plantMgr.otherTipCount++;
    }, _cc$Class.showGuideUnlockGrid = function showGuideUnlockGrid() {
      if (this.unlockTip && this.unlockTip.active) return false;
      if (this.guideUnlockTip && this.guideUnlockTip.active) return false;
      var index = this.getMinLockGrid();
      if (null == index) {
        this.hideGuideUnlockGrid();
        return false;
      }
      var lastLevel = cc.Mgr.Config.allPlantCount;
      var levelList = [];
      for (var i = 0; i < this.grids.length; i++) {
        var grid = this.grids[i];
        if (grid.type === MyEnum.GridState.none) {
          this.hideGuideUnlockGrid();
          return false;
        }
        if (grid.type === MyEnum.GridState.plant) {
          grid.content.level < lastLevel && (lastLevel = grid.content.level);
          levelList.push(grid.content.level);
        }
      }
      var tem = this.refrain(levelList);
      if (tem.indexOf(lastLevel) >= 0) {
        this.hideGuideUnlockGrid();
        return false;
      }
      if (true === this.checkHasMergeItem()) {
        this.hideGuideUnlockGrid();
        return false;
      }
      this.guideUnlockTip = cc.instantiate(this.unlockTipPrefab);
      this.guideUnlockTip.parent = this.plantParent;
      this.guideUnlockTip.zIndex = 999;
      this.guideUnlockTip.scale = .75;
      this.guideUnlockTip.setPosition(this.grids[index].content.node.x, this.grids[index].content.node.y + 80);
      cc.Mgr.plantMgr.otherTipCount++;
      return true;
    }, _cc$Class.hideGuideUnlockGrid = function hideGuideUnlockGrid() {
      this.guideUnlockTip && this.guideUnlockTip.active && this.guideUnlockTip.getComponent("UnlockTip").closeTip();
    }, _cc$Class.getMinLockGrid = function getMinLockGrid() {
      var result = null;
      for (var i = this.grids.length - 1; i >= 0; i--) {
        var grid = this.grids[i];
        if (grid.type === MyEnum.GridState.lock && cc.Mgr.game.money >= grid.content.money) {
          result = i;
          break;
        }
      }
      return result;
    }, _cc$Class.showLaterTipAttack = function showLaterTipAttack() {
      this.attckShowIndex = -1;
      var outData = this.checkMaxLvPlantCanAttack();
      if (false == outData.needShow) return;
      this.attckShowIndex = outData.index;
      this.showAttackTip();
    }, _cc$Class.showAttackTip = function showAttackTip() {
      if (this.tipMoveAttackNode && this.tipMoveAttackNode.active) return;
      if (this.otherTipCount > 0) return;
      var index = this.attckShowIndex;
      if (null == index || -1 == index) return;
      if (this.tipMoveAttackNode) {
        this.tipMoveAttackNode.parent = this.plantParent;
        this.tipMoveAttackNode.active = true;
        this.tipMoveAttackNode.zIndex = 999;
        this.tipMoveAttackNode.scale = .75;
        var pos = cc.v2(this.plantPos[index].x, this.plantPos[index].y + 100);
        this.tipMoveAttackNode.y = pos.y;
        this.tipMoveAttackNode.x = pos.x;
        this.tipMoveAttackNode.getComponent("tipMoveAttack").showtipMoveAttack();
      } else {
        var obj = cc.Mgr.EffectMgr.getObFromPool(EffectType.TipMoveAttack);
        if (null == obj) return;
        obj.parent = this.plantParent;
        obj.active = true;
        obj.zIndex = 999;
        obj.scale = .75;
        var pos = cc.v2(this.plantPos[index].x, this.plantPos[index].y + 100);
        obj.y = pos.y;
        obj.x = pos.x;
        obj.getComponent("tipMoveAttack").showtipMoveAttack();
        this.tipMoveAttackNode = obj;
      }
      this.otherTipCount++;
    }, _cc$Class.hideTipAttackNode = function hideTipAttackNode() {
      cc.Mgr.game.pickOutMaxLvPlant = -1;
      if (this.tipMoveAttackNode && true == this.tipMoveAttackNode.active) {
        this.tipMoveAttackNode.getComponent("tipMoveAttack").closeTip();
        this.otherTipCount--;
      }
    }, _cc$Class.showtipMoveAttackNext = function showtipMoveAttackNext() {
      if (this.tipMoveAttackNode && this.tipMoveAttackNode.active) return;
      if (this.otherTipCount > 0) return;
      if (this.tipMoveAttackNode) {
        var outData = this.checkMaxLvPlantCanAttack();
        if (false == outData.needShow) return;
        var index = outData.index;
        this.tipMoveAttackNode.active = true;
        var pos = cc.v2(this.plantPos[index].x, this.plantPos[index].y + 100);
        this.tipMoveAttackNode.y = pos.y;
        this.tipMoveAttackNode.x = pos.x;
        this.tipMoveAttackNode.getComponent("tipMoveAttack").showtipMoveAttack();
        this.otherTipCount++;
      }
    }, _cc$Class.start = function start() {
      this.startTimer = Date.now();
    }, _cc$Class.update = function update(dt) {
      if (cc.Mgr.GameCenterCtrl.pauseFight) return;
      if (Date.now() - this.startTimer >= 1e3) {
        this.startTimer = Date.now();
        if (cc.Mgr.game.rageTimer > 0) {
          cc.Mgr.game.rageTimer--;
          cc.Mgr.game.rageTimer <= 0 && this.changePlantAngryState(false);
        }
        if (cc.Mgr.game.fireTimer > 0) {
          cc.Mgr.game.fireTimer--;
          cc.Mgr.game.fireTimer <= 0 && this.changePlantFireState(false);
        }
        if (cc.Mgr.game.iceTimer > 0) {
          cc.Mgr.game.iceTimer--;
          cc.Mgr.game.iceTimer <= 0 && this.changePlantIceState(false);
        }
        if (cc.Mgr.game.critTimer > 0) {
          cc.Mgr.game.critTimer--;
          cc.Mgr.game.critTimer <= 0 && this.changePlantCritState(false);
        }
        if (cc.Mgr.game.autoTimer > 0 && cc.Mgr.UIMgr.currentShowUICount <= 0) {
          cc.Mgr.game.autoTimer--;
          cc.Mgr.game.autoTimer <= 0 && this.changePlantAutoState(false);
        }
        cc.Mgr.UIMgr.buffUINode && cc.Mgr.UIMgr.buffUINode.active && cc.Mgr.UIMgr.buffUINode.getComponent("BuffUI").refreshUI();
        cc.Mgr.UIMgr.InGameUI && cc.Mgr.UIMgr.InGameUI.updateBuffTimer();
      }
    }, _cc$Class));
    module.exports = plantManage;
    cc._RF.pop();
  }, {
    DataType: "DataType",
    EffectType: "EffectType",
    Event: "Event",
    MissionType: "MissionType",
    MyEnum: "MyEnum"
  } ],
  plantMerge: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c6a72o2O4lGHrLXJY7l5KkY", "plantMerge");
    "use strict";
    var EffectType = require("EffectType");
    var plantMerge = cc.Class({
      extends: cc.Component,
      properties: {
        dragon: dragonBones.ArmatureDisplay
      },
      start: function start() {
        this.dragon.on(dragonBones.EventObject.COMPLETE, this.onAnimComplete, this);
      },
      onAnimComplete: function onAnimComplete() {
        cc.Mgr.EffectMgr.ObBackToPool(this.node, EffectType.Merge);
      },
      playAnimation: function playAnimation() {
        this.dragon.playAnimation("newAnimation", 1);
      }
    });
    module.exports = plantMerge;
    cc._RF.pop();
  }, {
    EffectType: "EffectType"
  } ],
  plant: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "42c15Zz38ZM17B3iVconGSi", "plant");
    "use strict";
    var MyEnum = require("MyEnum");
    var DataType = require("DataType");
    var plant = cc.Class({
      extends: cc.Component,
      properties: {
        dragon: dragonBones.ArmatureDisplay,
        index: 0,
        level: 0,
        cd: 0,
        power: 0,
        offline: 0,
        price: 0,
        gem: 0,
        shootPos: [ cc.Vec2 ],
        steakColor: "",
        killType: 0,
        killProbability: 0,
        pos: cc.Vec2,
        bulletType: 1,
        dragonTimeScale: 1,
        _IdleAnimName: "idle",
        _AttackAnimName: "attack",
        _generateEffectPos: cc.Vec2,
        generateEffectPosNode: cc.Node,
        isNeedMask: true,
        isNeedTrail: true,
        levelLabel: cc.Label,
        levelLabel_ru: cc.Label
      },
      onLoad: function onLoad() {
        this.nomalRangeY = 150;
        this.specialRangeY = 500;
        this.nomalRangeX = 220;
        this.specialRangeX = 500;
      },
      init: function init(index, pos, plantData) {
        plantData.zoom = .75;
        19 == plantData.level && (plantData.zoom = .85);
        this.dragonTimeScale = 1;
        this.level = plantData.level;
        this.pos = pos;
        this.node.position = this.pos;
        this.dragon.node.scaleX = -1 * plantData.zoom;
        this.dragon.node.scaleY = plantData.zoom;
        this.levelLabel.string = "Lv." + this.level;
        this.plantData = plantData;
        this.currentAttackNode = null;
        this.currentSpeed = 1;
        this.setIndex(index);
        this.node.on(cc.Node.EventType.TOUCH_START, function(event) {
          if (cc.Mgr.plantMgr.autoMergeData && (cc.Mgr.plantMgr.autoMergeData.startIndex == this.index || cc.Mgr.plantMgr.autoMergeData.targetIndex == this.index)) return;
          cc.Mgr.plantMgr.hideTipAttackNode();
          cc.Mgr.plantMgr.showAttackRange(this.node);
          this.TouchStart(event);
          cc.Mgr.UIMgr.GameInUINode.getComponent("InGameUI").buyButtonNode.active = false;
          cc.Mgr.GameCenterCtrl.rubbishNode.active = true;
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function(event) {
          if (cc.Mgr.plantMgr.autoMergeData && (cc.Mgr.plantMgr.autoMergeData.startIndex == this.index || cc.Mgr.plantMgr.autoMergeData.targetIndex == this.index)) return;
          this.TouchMove(event);
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function(event) {
          if (cc.Mgr.plantMgr.autoMergeData && (cc.Mgr.plantMgr.autoMergeData.startIndex == this.index || cc.Mgr.plantMgr.autoMergeData.targetIndex == this.index)) return;
          cc.Mgr.plantMgr.hideTipAttackNode();
          cc.Mgr.plantMgr.hideAttackRange();
          this.TouchEnd(event);
          cc.Mgr.UIMgr.GameInUINode.getComponent("InGameUI").buyButtonNode.active = true;
          cc.Mgr.GameCenterCtrl.rubbishNode.active = false;
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_UP, function(event) {
          if (cc.Mgr.plantMgr.autoMergeData && (cc.Mgr.plantMgr.autoMergeData.startIndex == this.index || cc.Mgr.plantMgr.autoMergeData.targetIndex == this.index)) return;
          cc.Mgr.plantMgr.hideAttackRange();
          this.TouchEnd(event);
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_END, function(event) {
          if (cc.Mgr.plantMgr.autoMergeData && (cc.Mgr.plantMgr.autoMergeData.startIndex == this.index || cc.Mgr.plantMgr.autoMergeData.targetIndex == this.index)) return;
          cc.Mgr.plantMgr.hideTipAttackNode();
          cc.Mgr.plantMgr.hideAttackRange();
          this.TouchEnd(event);
        }, this);
        this.node.zIndex = 50 + index;
        this.isCompounded = false;
        this.setRageEffect();
        this.setFlameEffect();
        this.setFreezeEffect();
        this.setCritEffect();
        cc.Mgr.DragonMgr.create(1, this.dragon);
        this.playIdleAnim();
        this.state = MyEnum.PlantState.idle;
        this.dragon.on(dragonBones.EventObject.FRAME_EVENT, this.onFrameEvent, this);
        this.dragon.on(dragonBones.EventObject.COMPLETE, this.attackCompleteDone, this);
        this._generateEffectPos.x = this.generateEffectPosNode.position.x;
        this._generateEffectPos.y = this.generateEffectPosNode.position.y;
        this.curShootIndex = 0;
        this.currentTimer = Date.now();
        this.levelLabel.node.active = "Russian" != cc.Mgr.Config.language;
        this.levelLabel_ru.node.active = false;
      },
      setRageEffect: function setRageEffect() {
        if (this.rageEffectNode) return;
        if (!cc.Mgr.plantMgr.ragePrefab) return;
        this.rageEffectNode = cc.instantiate(cc.Mgr.plantMgr.ragePrefab);
        this.rageEffectNode.parent = this.node;
        this.rageEffectNode.position = cc.v2(0, 20);
        this.rageEffectNode.active = cc.Mgr.game.rageTimer > 0;
        12 === this.index ? this.rageEffectNode.setScale(1) : this.rageEffectNode.setScale(.7);
      },
      setFlameEffect: function setFlameEffect() {
        if (this.flameEffectNode) return;
        if (!cc.Mgr.plantMgr.flamePrefab) return;
        this.flameEffectNode = cc.instantiate(cc.Mgr.plantMgr.flamePrefab);
        this.flameEffectNode.parent = this.node;
        this.flameEffectNode.position = cc.v2(0, 20);
        this.flameEffectNode.active = cc.Mgr.game.fireTimer > 0;
        12 === this.index ? this.flameEffectNode.setScale(1.3) : this.flameEffectNode.setScale(1);
      },
      setFreezeEffect: function setFreezeEffect() {
        if (this.freezeEffectNode) return;
        if (!cc.Mgr.plantMgr.freezePrefab) return;
        this.freezeEffectNode = cc.instantiate(cc.Mgr.plantMgr.freezePrefab);
        this.freezeEffectNode.parent = this.node;
        this.freezeEffectNode.position = cc.v2(0, 20);
        this.freezeEffectNode.active = cc.Mgr.game.iceTimer > 0;
        this.freezeEffectNode.zIndex = -1;
        this.freezeEffectNode.setScale(.7);
      },
      setCritEffect: function setCritEffect() {
        if (this.critEffectNode) return;
        if (!cc.Mgr.plantMgr.critPrefab) return;
        this.critEffectNode = cc.instantiate(cc.Mgr.plantMgr.critPrefab);
        this.critEffectNode.parent = this.node;
        this.critEffectNode.position = cc.v2(0, 0);
        this.critEffectNode.active = cc.Mgr.game.critTimer > 0;
        this.critEffectNode.setScale(.7);
      },
      setShowDetailsInUI: function setShowDetailsInUI(scale, color, isBig) {
        void 0 === isBig && (isBig = true);
        this.levelLabel.node.active = this.levelLabel_ru.node.active = false;
        this.node.getChildByName("shadow").active = false;
        this.dragon.node.color = cc.Mgr.Utils.hexToColor(color);
        isBig && this.dragon.playAnimation(this._IdleAnimName, -1);
        this.dragon.node.setScale(scale);
        this.node.scaleX = -1;
        this.node.scaleY = 1;
      },
      changeAngryState: function changeAngryState(enter) {
        if (this.enter_rage == enter) return;
        this.setRageEffect();
        this.rageEffectNode.active = enter;
        this.enter_rage = enter;
        if (12 === this.index) {
          this.dragonTimeScale = cc.Mgr.game.rageTimer > 0 ? 1.5 * this.currentSpeed * 1.5 : 1.5 * this.currentSpeed;
          this.dragon.timeScale = this.dragonTimeScale;
        } else {
          this.dragonTimeScale = cc.Mgr.game.rageTimer > 0 ? 1.5 * this.currentSpeed : this.currentSpeed;
          this.dragon.timeScale = this.dragonTimeScale;
        }
      },
      changeFireState: function changeFireState(enter) {
        if (this.enter_fire == enter) return;
        this.setFlameEffect();
        this.flameEffectNode.active = enter;
        this.enter_fire = enter;
        12 === this.index ? this.currentPower = cc.Mgr.game.fireTimer > 0 ? this.plantData.power * BigInt(6) / BigInt(5) * BigInt(9) / BigInt(6) : this.plantData.power * BigInt(6) / BigInt(5) : this.currentPower = cc.Mgr.game.fireTimer > 0 ? this.plantData.power * BigInt(9) / BigInt(6) : this.plantData.power;
      },
      changeIceState: function changeIceState(enter) {
        this.enter_ice = enter;
        this.setFreezeEffect();
        this.freezeEffectNode.active = enter;
      },
      changeCritState: function changeCritState(enter) {
        this.enter_crit = enter;
        this.setCritEffect();
        this.critEffectNode.active = enter;
      },
      setPosition: function setPosition(pos) {
        this.node.position = pos;
      },
      setIndex: function setIndex(index) {
        this.index = index;
        this.node.zIndex = 50 + index;
        if (12 === this.index) {
          this.currentPower = cc.Mgr.game.fireTimer > 0 ? this.plantData.power * BigInt(6) / BigInt(5) * BigInt(9) / BigInt(6) : this.plantData.power * BigInt(6) / BigInt(5);
          this.dragonTimeScale = cc.Mgr.game.rageTimer > 0 ? 1.5 * this.currentSpeed * 1.5 : 1.5 * this.currentSpeed;
          this.dragon.timeScale = this.dragonTimeScale;
        } else {
          this.currentPower = cc.Mgr.game.fireTimer > 0 ? this.plantData.power * BigInt(9) / BigInt(6) : this.plantData.power;
          this.dragonTimeScale = cc.Mgr.game.rageTimer > 0 ? 1.5 * this.currentSpeed : this.currentSpeed;
          this.dragon.timeScale = this.dragonTimeScale;
        }
        this.enter_ice = cc.Mgr.game.iceTimer > 0;
        this.enter_crit = cc.Mgr.game.critTimer > 0;
        if (12 === index) {
          this.dragon.node.scaleX = -1 * this.plantData.zoom * 1.3;
          this.dragon.node.scaleY = 1.3 * this.plantData.zoom;
        } else {
          this.dragon.node.scaleX = -1 * this.plantData.zoom;
          this.dragon.node.scaleY = this.plantData.zoom;
        }
        this.flameEffectNode && (12 === this.index ? this.flameEffectNode.setScale(1.3) : this.flameEffectNode.setScale(1));
        this.rageEffectNode && (12 === this.index ? this.rageEffectNode.setScale(1) : this.rageEffectNode.setScale(.7));
      },
      TouchStart: function TouchStart(event) {
        if (cc.Mgr.plantMgr.plantMoveInfo.isMove) return;
        if (cc.Mgr.game.needGuide && cc.Mgr.game.curGuideStep == MyEnum.GuideType.guide3 && 7 != this.index) return;
        cc.Mgr.plantMgr.plantMoveInfo.isMove = true;
        cc.Mgr.plantMgr.plantMoveInfo.index = this.index;
        this.isCompounded || cc.Mgr.plantMgr.showPickLandBorder(true, this.level, this.index);
        this.unscheduleAllCallbacks();
        this.currentAttackNode = null;
        this.playIdleAnim();
        this.lastZIndex = this.node.zIndex;
        this.node.zIndex = 999;
        this.isMoving = true;
        this.TouchStartCb(this);
      },
      TouchMove: function TouchMove(event) {
        if (cc.Mgr.plantMgr.plantMoveInfo.isMove && cc.Mgr.plantMgr.plantMoveInfo.index == this.index) {
          var delta = event.touch.getDelta();
          this.node.x += delta.x;
          this.node.y += delta.y;
          cc.Mgr.plantMgr.attackRange.parent === this.node && (this.node.x > -190 && this.node.x < -120 && this.node.y > 120 && this.node.y < 190 && cc.Mgr.game.unlockSpecialGrid ? cc.Mgr.plantMgr.attackRange.setScale(3.5) : cc.Mgr.plantMgr.attackRange.setScale(1));
        }
      },
      TouchEnd: function TouchEnd(event) {
        cc.Mgr.plantMgr.plantMoveInfo.isMove = false;
        cc.Mgr.plantMgr.plantMoveInfo.index = -1;
        cc.Mgr.plantMgr.showPickLandBorder(false, this.level);
        this.isCompounded || this.updateAttackList();
        this.node.zIndex = this.lastZIndex;
        (void 0 == cc.Mgr.plantMgr.autoMergeData || cc.Mgr.plantMgr.autoMergeData.startIndex !== this.index && cc.Mgr.plantMgr.autoMergeData.targetIndex !== this.index) && this.TouchEndCb(this);
        this.isMoving = false;
      },
      hasAttackObj: function hasAttackObj() {
        return null != this.currentAttackNode;
      },
      playIdleAnim: function playIdleAnim() {
        cc.Mgr.DragonMgr.playAnimation(MyEnum.DragonType.plant, this.dragon, this._IdleAnimName, true, this.dragonTimeScale);
        this.state = MyEnum.PlantState.idle;
      },
      startAttack: function startAttack() {
        if (null === this.currentAttackNode || false == this.currentAttackNode.activeInHierarchy) return;
        if (true == cc.Mgr.GameCenterCtrl.pauseFight) return;
        this.node.scaleX = this.currentAttackNode.x > this.node.x ? -1 : 1;
        this.levelLabel.node.scaleX = this.levelLabel_ru.node.scaleX = 1 == this.node.scaleX ? 1 : -1;
        this.curShootIndex = this.curShootIndex >= this.plantData.shootPos.length ? 0 : this.curShootIndex;
        var curShootAnimationName = 1 === this.plantData.shootPos.length ? this._AttackAnimName : this._AttackAnimName + (this.curShootIndex + 1);
        cc.Mgr.DragonMgr.playAnimation(MyEnum.DragonType.plant, this.dragon, curShootAnimationName, false, this.dragonTimeScale);
        this.state = MyEnum.PlantState.attacking;
      },
      onFrameEvent: function onFrameEvent(e) {
        "A" == e.name && this.attackFrameDone();
      },
      compounded: function compounded() {
        this.isCompounded = true;
        this.unscheduleAllCallbacks();
        this.currentAttackNode = null;
        this.playIdleAnim();
      },
      attackCompleteDone: function attackCompleteDone(e) {
        this.updateAttackList();
        null != this.currentAttackNode && this.startAttack();
      },
      attackFrameDone: function attackFrameDone() {
        if (null == this.currentAttackNode || false == this.currentAttackNode.activeInHierarchy) return;
        var bulletObj = cc.Mgr.BulletPool.getObFromPool();
        bulletObj.parent = this.node.parent;
        bulletObj.zIndex = 200;
        var bullet = bulletObj.getComponent("bullet");
        var data = {};
        data.spd = cc.Mgr.game.bulletSpeed;
        data.power = this.currentPower;
        data.spName = this.plantData.head;
        data.skill = this.plantData.skill;
        data.level = this.plantData.level;
        data.enter_ice = this.enter_ice;
        data.enter_crit = this.enter_crit;
        data.isNeedMask = this.plantData.isNeedMask;
        data.isNeedTrail = this.plantData.isNeedTrail;
        data.bulletHeight = this.plantData.bulletHeight;
        data.bulletNearLeftDis = this.plantData.bulletNearLeftDis;
        data.bulletType = this.plantData.bulletType;
        var c = this.plantData.steakColor.replace("0x", "#");
        var color = cc.Color.BLACK;
        color = color.fromHEX(c);
        data.color = color;
        this.curShootIndex >= this.plantData.shootPos.length && (this.curShootIndex = 0);
        data.pos = cc.v2(this.node.x + this.plantData.shootPos[this.curShootIndex].x * this.node.scaleX * -1, this.node.y + this.plantData.shootPos[this.curShootIndex].y);
        bullet.initData(data, this.currentAttackNode, this);
        this.curShootIndex++;
      },
      plantDestroy: function plantDestroy() {
        this.isCompounded = false;
        cc.Mgr.DragonMgr.deleteDragon(MyEnum.DragonType.plant, this.dragon);
        this.node.destroy();
      },
      updateAttackList: function updateAttackList() {
        if (!cc.Mgr.ZombieMgr.zombieList) return;
        cc.Mgr.ZombieMgr.zombieList.indexOf(this.currentAttackNode) < 0 && (this.currentAttackNode = null);
        var currentRangeY = 12 === this.index ? this.specialRangeY : this.nomalRangeY;
        var currentRangeX = 12 === this.index ? this.specialRangeX : this.nomalRangeX;
        if (null != this.currentAttackNode) {
          var disX = Math.abs(this.node.position.x - this.currentAttackNode.position.x);
          var disY = Math.abs(this.node.position.y - this.currentAttackNode.position.y);
          (disX > currentRangeX || disY > currentRangeY) && (this.currentAttackNode = null);
        } else for (var i = 0; i < cc.Mgr.ZombieMgr.zombieList.length; i++) {
          var zombieNode = cc.Mgr.ZombieMgr.zombieList[i];
          var _disX = Math.abs(this.node.position.x - zombieNode.position.x);
          var _disY = Math.abs(this.node.position.y - zombieNode.position.y);
          if (_disX <= currentRangeX && _disY <= currentRangeY) {
            this.currentAttackNode = zombieNode;
            0 == this.index && console.log("disX: " + _disX + " - disY: " + _disY);
            break;
          }
        }
        null != this.currentAttackNode && this.state != MyEnum.PlantState.attacking ? this.startAttack() : null == this.currentAttackNode && this.state != MyEnum.PlantState.idle && this.playIdleAnim();
      },
      update: function update() {
        if (true == cc.Mgr.GameCenterCtrl.pauseFight) {
          this.currentAttackNode = null;
          return;
        }
        if (null != this.currentAttackNode || this.isMoving) return;
        if (Date.now() - this.currentTimer >= 500) {
          this.updateAttackList();
          this.currentTimer = Date.now();
        }
      }
    });
    module.exports = plant;
    cc._RF.pop();
  }, {
    DataType: "DataType",
    MyEnum: "MyEnum"
  } ],
  promptUI: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "397e3f5uUFJO5P8TyQdbRDB", "promptUI");
    "use strict";
    var promptUI = cc.Class({
      extends: cc.Component,
      properties: {
        desLbl: cc.Label,
        coinNode: cc.Node,
        gemNode: cc.Node
      },
      showDes: function showDes(des, _type) {
        this.desLbl.string = des;
        this.coinNode.active = false;
        this.gemNode.active = false;
        "coin" == _type ? this.coinNode.active = true : "gem" == _type && (this.gemNode.active = true);
      }
    });
    module.exports = promptUI;
    cc._RF.pop();
  }, {} ],
  rewardBox: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "14f9bkPpxpNjLkfnUy/Jycl", "rewardBox");
    "use strict";
    var rewardBox = cc.Class({
      extends: cc.Component,
      properties: {
        rType: "coin",
        num: 1,
        id: 1,
        weight: 1
      },
      setData: function setData(rType, num, id, weight) {
        void 0 === num && (num = 1);
        void 0 === id && (id = 1);
        void 0 === weight && (weight = 1);
        this.rType = rType;
        this.num = num;
        this.id = id;
        this.weight = weight;
      }
    });
    module.exports = rewardBox;
    cc._RF.pop();
  }, {} ],
  setPanel: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0fb57Mqd69M/7sd52BCIfkk", "setPanel");
    "use strict";
    var TOGGLE_OFF = 56;
    cc.Class({
      extends: cc.Component,
      properties: {
        bgmBtn: cc.Node,
        sfxBtn: cc.Node,
        notificationBtn: cc.Node,
        notificationNode: cc.Node,
        content: cc.Node,
        blurBg: cc.Node,
        versionLabel: cc.Label,
        debugLabel: cc.Label,
        debugNode: cc.Node,
        idLabel: cc.Label,
        id: cc.Label,
        recoveryBtnLabel: cc.Label,
        spriteCoin: cc.Sprite,
        nomarlM: cc.Material,
        grayM: cc.Material,
        recoveryBtn: cc.Node,
        bgmLabel: cc.Label,
        sfxLabel: cc.Label,
        languageLabel: cc.Label,
        bgmOffLabel: cc.Label,
        bgmOnLabel: cc.Label,
        sfxOffLabel: cc.Label,
        sfxOnLabel: cc.Label,
        versionStrLabel: cc.Label,
        copyLabel: cc.Label,
        languageSelector: cc.Node,
        title: cc.Node,
        title_zh: cc.Node,
        title_ja: cc.Node,
        title_ru: cc.Node,
        debugVersion: cc.Label,
        playerId: cc.Label,
        inviterId: cc.Label
      },
      start: function start() {
        this.bgmON = 1 === cc.Mgr.AudioMgr.bgmVolume;
        this.bgmBtn.x = this.bgmON ? -TOGGLE_OFF : TOGGLE_OFF;
        this.sfxON = 1 === cc.Mgr.AudioMgr.sfxVolume;
        this.sfxBtn.x = this.sfxON ? -TOGGLE_OFF : TOGGLE_OFF;
        this.notificationON = true;
        this.notificationBtn.x = this.notificationON ? -TOGGLE_OFF : TOGGLE_OFF;
        this.recoveryBtnLabel.string = cc.Mgr.Utils.getTranslation("btn-recovery");
        this.bgmLabel.string = cc.Mgr.Utils.getTranslation("bgm");
        this.sfxLabel.string = cc.Mgr.Utils.getTranslation("sfx");
        this.languageLabel.string = cc.Mgr.Utils.getTranslation("language");
        this.bgmOffLabel.string = cc.Mgr.Utils.getTranslation("set-off");
        this.bgmOnLabel.string = cc.Mgr.Utils.getTranslation("set-on");
        this.sfxOffLabel.string = cc.Mgr.Utils.getTranslation("set-off");
        this.sfxOnLabel.string = cc.Mgr.Utils.getTranslation("set-on");
        this.versionStrLabel.string = cc.Mgr.Utils.getTranslation("set-version");
        this.copyLabel.string = cc.Mgr.Utils.getTranslation("set-copy");
        this.node.on(cc.Node.EventType.TOUCH_END, function(event) {
          this.languageSelector.getComponent("LanguageSelector").hideContainer();
        }, this);
        this.title.active = false;
        this.title_zh.active = false;
        this.title_ja.active = false;
        this.title_ru.active = false;
        "Japanese" === cc.Mgr.Config.language ? this.title_ja.active = true : "Simplified Chinese" === cc.Mgr.Config.language || "Traditional Chinese" === cc.Mgr.Config.language ? this.title_zh.active = true : "Russian" === cc.Mgr.Config.language ? this.title_ru.active = true : this.title.active = true;
      },
      showUI: function showUI(_callback) {
        this.blurBg.opacity = 0;
        this.content.opacity = 0;
        this.content.setScale(.5);
        cc.tween(this.blurBg).to(.05, {
          opacity: 255
        }).call().start();
        cc.tween(this.content).to(.15, {
          opacity: 255,
          scale: 1
        }).start();
        cc.Mgr.admob.showBanner("setting");
        this.versionLabel.string = cc.Mgr.Config.version;
        this.notificationNode.active = false;
        this.debugLabel.string = "NoAds\nPayment";
        this.debugNode.active = cc.Mgr.Config.isDebug;
        this.debugVersion.node.active = cc.Mgr.Config.isDebug;
        this.debugVersion.string = cc.Mgr.Config.debug_version;
        this.idLabel.string = cc.Mgr.Config.isTelegram ? window.Telegram.WebApp.initDataUnsafe.user.id : "Local";
        this.spriteCoin.setMaterial(0, this.nomarlM);
        cc.Mgr.Config.isDebug ? this.recoveryBtn.y = -100 : this.recoveryBtn.y = -200;
        this.recoveryBtn.active = false;
        this.playerId.string = "PlayerID: " + (cc.Mgr.Config.isTelegram ? window.Telegram.WebApp.initDataUnsafe.user.id : "Local");
        this.inviterId.string = "InviterID: " + ("" == (null != window.startParam && window.startParam) ? "SOLO" : window.startParam);
      },
      copyID: function copyID() {
        cc.Mgr.Utils.copyID();
      },
      closeUI: function closeUI() {
        cc.Mgr.AudioMgr.playSFX("click");
        cc.Mgr.admob.hideBanner("setting");
        var self = this;
        cc.tween(this.blurBg).to(.15, {
          opacity: 0
        }).start();
        cc.tween(this.content).to(.15, {
          opacity: 0,
          scale: .5
        }).call(function() {
          self.node.active = false;
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount("setting");
      },
      toggleBGM: function toggleBGM() {
        this.bgmON = !this.bgmON;
        this.bgmBtn.x = this.bgmON ? -TOGGLE_OFF : TOGGLE_OFF;
        cc.Mgr.AudioMgr.setBGMVolume(this.bgmON ? 1 : 0);
      },
      toggleSFX: function toggleSFX() {
        this.sfxON = !this.sfxON;
        this.sfxBtn.x = this.sfxON ? -TOGGLE_OFF : TOGGLE_OFF;
        cc.Mgr.AudioMgr.setSFXVolume(this.sfxON ? 1 : 0);
      },
      toggleNotification: function toggleNotification() {
        this.notificationON = !this.notificationON;
        this.notificationBtn.x = this.notificationON ? -TOGGLE_OFF : TOGGLE_OFF;
      },
      addMoney: function addMoney() {
        cc.Mgr.game.money += BigInt(1e12);
        cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "money");
      },
      addGems: function addGems() {
        cc.Mgr.game.gems += 1e6;
        cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "gem");
      },
      onClickDebug: function onClickDebug() {
        this.debugLabel.string = "NoAds\nPayment";
        cc.Mgr.admob.hideBanner("all");
      },
      onClickRecovery: function onClickRecovery() {
        cc.Mgr.GameCenterCtrl.unscheduleSaveData();
        cc.Mgr.AudioMgr.stopAll();
        cc.Mgr.admob.hideBanner("all");
        cc.game.restart();
      },
      reset: function reset() {
        cc.sys.localStorage.clear();
        cc.Mgr.AudioMgr.stopAll();
        cc.Mgr.admob.hideBanner("all");
        cc.game.restart();
      }
    });
    cc._RF.pop();
  }, {} ],
  shareUI: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3e244oe5vxFCYhNuPZVqyYl", "shareUI");
    "use strict";
    var tweenTime = .15;
    var MissionType = require("MissionType");
    var AchieveType = require("AchieveType");
    var shareUI = cc.Class({
      extends: cc.Component,
      properties: {
        numEffect: cc.Node,
        closeNode: cc.Node,
        blurBg: cc.Node,
        content: cc.Node
      },
      onLoad: function onLoad() {
        this.limitClick = this.node.getComponent("LimitClick");
      },
      start: function start() {
        this.getReward = false;
      },
      onClickShare: function onClickShare() {
        if (false == this.limitClick.clickTime()) return;
        if (false == cc.Mgr.Config.isTelegram) return;
        var userId = window.Telegram.WebApp.initDataUnsafe.user.id;
        var messageText = encodeURIComponent("\ud83d\udcb0Catizen: Unleash, Play, Earn - Where Every Game Leads to an Airdrop Adventure! \n\ud83c\udf81Let's play-to-earn airdrop right now!");
        var gameUrl = encodeURIComponent("https://t.me/Vision_test_02_bot/paytest?startapp=" + userId);
        var telegramUrl = "https://t.me/share/url?url=" + gameUrl + "&text=" + messageText;
        window.open(telegramUrl, "_blank");
      },
      showUI: function showUI() {
        this.node.width = cc.Mgr.Config.winSize.width;
        this.node.height = cc.Mgr.Config.winSize.height;
        this.doTween();
        this.blurBg.opacity = 0;
        this.content.opacity = 0;
        this.content.setScale(.5);
        cc.tween(this.blurBg).to(.05, {
          opacity: 255
        }).call().start();
        cc.tween(this.content).to(.15, {
          opacity: 255,
          scale: 1
        }).start();
        var coins = cc.Mgr.game.caculatePlantPrice(cc.Mgr.game.plantMaxLv);
        this.coins = coins;
        this.numEffect.getComponent("NumEffect").setNumber(cc.Mgr.Utils.getNumStr2(this.coins));
      },
      doTween: function doTween() {
        this.closeNode.opacity = 0;
        this.closeNode.scale = 0;
        cc.tween(this.closeNode).to(tweenTime, {
          opacity: 255,
          scale: 1
        }).start();
      },
      closeUI: function closeUI() {
        cc.Mgr.AudioMgr.playSFX("click");
        cc.Mgr.admob.hideBanner("offline");
        var self = this;
        cc.tween(this.blurBg).to(.15, {
          opacity: 0
        }).start();
        cc.tween(this.content).to(.15, {
          opacity: 0,
          scale: .5
        }).call(function() {
          if (true == self.getReward) {
            cc.Mgr.game.money += BigInt(self.coins);
            cc.Mgr.game.coin_gained_total += BigInt(self.coins);
            cc.Mgr.UIMgr.showJibEffect();
            cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "money");
          }
          self.node.active = false;
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount("offlineAssets");
      }
    });
    module.exports = shareUI;
    cc._RF.pop();
  }, {
    AchieveType: "AchieveType",
    MissionType: "MissionType"
  } ],
  shopItem: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f9ebbffBnRKFrSpScNAXQRK", "shopItem");
    "use strict";
    var MySprite = require("MySprite");
    var DataType = require("DataType");
    var Event = require("Event");
    var AtlasType = require("AtlasType");
    var MyEnum = require("MyEnum");
    var IntervalTime = 60;
    var shopItem = cc.Class({
      extends: cc.Component,
      properties: {
        lvLbl: cc.Label,
        desLbl: cc.Label,
        btnDes: cc.Node,
        iconBgSp: cc.Sprite,
        iconSp: MySprite,
        btn_coin: cc.Node,
        btn_gem: cc.Node,
        btn_ad: cc.Node,
        powerLbl: cc.Label,
        cdLbl: cc.Label,
        unlockNode: cc.Node,
        unlockLbl: cc.Label,
        btnType: "U",
        moneyLabel: cc.Label,
        gemLabel: cc.Label,
        freeLabel: cc.Label,
        spriteCoin2: cc.Sprite,
        spriteCoin: cc.Sprite,
        nomarlM: cc.Material,
        grayM: cc.Material,
        iconBgSpList: [ cc.SpriteFrame ]
      },
      start: function start() {
        this.freeLabel.string = cc.Mgr.Utils.getTranslation("btn-get");
        this.limitClick = this.node.getComponent("LimitClick");
        this.allowShow = true;
        this.showCount = 0;
      },
      setParent: function setParent(parent) {
        this.Parent = parent;
      },
      countTime: function countTime() {
        if (cc.Mgr.Utils.GetSysTime() - cc.Mgr.game.lastAdsGetPlantTime >= IntervalTime) {
          this.setContent({
            lv: this.plantData.level
          });
          this.unschedule(this.countTime);
        }
      },
      setContent: function setContent(_data) {
        var lv = _data.lv;
        var curMaxLv = cc.Mgr.game.plantMaxLv;
        this.lvLbl.string = lv === cc.Mgr.Config.allPlantCount + 1 ? "??" : lv;
        if (lv !== cc.Mgr.Config.allPlantCount + 1) {
          var plantData = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData, lv.toString());
          this.plantData = null;
          this.plantData = plantData;
          this.powerLbl.string = cc.Mgr.Utils.getNumStr2(plantData.power);
          this.cdLbl.string = plantData.cd;
        } else this.plantData = {
          level: cc.Mgr.Config.allPlantCount + 1
        };
        lv !== cc.Mgr.Config.allPlantCount + 1 ? this.iconSp.setSprite(AtlasType.PlantHead, plantData.head) : this.iconSp.setSprite(AtlasType.PlantHead, "egg_1");
        this.iconBgSp.spriteFrame = this.iconBgSpList[lv % 3];
        if (lv > curMaxLv) {
          this.iconSp.node.color = cc.Mgr.Utils.hexToColor("#000000");
          this.powerLbl.string = "?";
          this.cdLbl.string = "?";
        } else this.iconSp.node.color = cc.Mgr.Utils.hexToColor("#ffffff");
        if (lv !== cc.Mgr.Config.allPlantCount + 1) {
          var skilldata = plantData.skill.split("|");
          var ratio = skilldata[1] + "%";
          var skillType = parseInt(skilldata[0]);
          var des = cc.Mgr.Utils.getTranslation("skill_des") + ": ";
          switch (skillType) {
           case MyEnum.BulletSkillType.Slow:
            des += cc.Mgr.Utils.getTranslation("skillDescs-slowdown", [ ratio ]);
            break;

           case MyEnum.BulletSkillType.DouKill:
            des += cc.Mgr.Utils.getTranslation("skillDescs-crit", [ ratio ]);
            break;

           case MyEnum.BulletSkillType.Vertigo:
            des += cc.Mgr.Utils.getTranslation("skillDescs-freeze", [ ratio ]);
          }
          this.desLbl.string = des;
        } else this.desLbl.string = cc.Mgr.Utils.getTranslation("shopItem-coming-soon");
        var shopSortDt = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.ShopData, curMaxLv);
        var cond = "";
        switch (curMaxLv - lv) {
         case 0:
          cond = shopSortDt.MAX;
          break;

         case 1:
          cond = shopSortDt.MAX_1;
          break;

         case 2:
          cond = shopSortDt.MAX_2;
          break;

         case 3:
          cond = shopSortDt.MAX_3;
          break;

         case 4:
          cond = shopSortDt.MAX_4;
          break;

         case 5:
          cond = shopSortDt.MAX_5;
          break;

         case 6:
          cond = shopSortDt.MAX_6;
          break;

         case 7:
          cond = shopSortDt.MAX_7;
          break;

         case 8:
         default:
          cond = shopSortDt.MAX_8;
        }
        lv > curMaxLv && (cond = MyEnum.ShopItemType.Lock);
        this.btnType = cond;
        this.setButton(cond, plantData, lv);
        this.updateAdsBtnState();
      },
      caculateMoneyPrice: function caculateMoneyPrice(lv, plantData) {
        var buyNum = cc.Mgr.game.plantBuyRecord[lv];
        buyNum = buyNum || 0;
        this.price = plantData.price;
        var price = plantData.price * BigInt(Math.floor(Math.pow(1.2, buyNum)));
        lv >= 1 && lv <= 20 && (price = plantData.price * BigInt(Math.floor(Math.pow(1.1, buyNum))));
        this.price = price;
        return price;
      },
      setButton: function setButton(cond, plantData, lv) {
        this.btn_coin.active = false;
        this.btn_gem.active = false;
        this.btn_ad.active = false;
        this.unlockNode.active = false;
        this.btnDes.active = true;
        this.unlockLbl.node.active = false;
        switch (cond) {
         case MyEnum.ShopItemType.Lock:
          this.unlockNode.active = true;
          this.unlockLbl.node.active = true;
          lv + 2 < cc.Mgr.Config.allPlantCount ? this.unlockLbl.string = (lv + 2).toString() : lv !== cc.Mgr.Config.allPlantCount ? this.unlockLbl.string = cc.Mgr.Config.allPlantCount : this.unlockLbl.string = "??";
          this.btnDes.active = false;
          break;

         case MyEnum.ShopItemType.Gem:
          this.btn_gem.active = true;
          this.gemLabel.string = plantData.gem;
          break;

         case MyEnum.ShopItemType.Ads:
          if (cc.Mgr.Utils.GetSysTime() - cc.Mgr.game.lastAdsGetPlantTime < IntervalTime && false == cc.Mgr.UIMgr.paymentUINode.getComponent("PaymentUI").checkAvailabelAds) {
            this.btn_coin.active = true;
            this.btnType = MyEnum.ShopItemType.Money;
            var money = this.caculateMoneyPrice(lv, plantData);
            cc.Mgr.game.money < money ? this.spriteCoin.setMaterial(0, this.grayM) : this.spriteCoin.setMaterial(0, this.nomarlM);
            this.moneyLabel.string = cc.Mgr.Utils.getNumStr2(money);
          } else {
            this.btnType = MyEnum.ShopItemType.Ads;
            this.btn_ad.active = true;
            cc.Mgr.UIMgr.paymentUINode.getComponent("PaymentUI").checkAvailabelAds ? this.spriteCoin2.setMaterial(0, this.nomarlM) : this.spriteCoin2.setMaterial(0, this.grayM);
          }
          break;

         case MyEnum.ShopItemType.Money:
          this.btnType = MyEnum.ShopItemType.Money;
          var money = this.caculateMoneyPrice(lv, plantData);
          cc.Mgr.game.money < money ? this.spriteCoin.setMaterial(0, this.grayM) : this.spriteCoin.setMaterial(0, this.nomarlM);
          this.moneyLabel.string = cc.Mgr.Utils.getNumStr2(money);
          this.btn_coin.active = true;
        }
      },
      btnClick: function btnClick() {
        cc.Mgr.AudioMgr.playSFX("click");
        switch (this.btnType) {
         case MyEnum.ShopItemType.Lock:
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("be-lock"), "", cc.Mgr.UIMgr.paymentUINode);
          break;

         case MyEnum.ShopItemType.Gem:
          this.buyPlantByGem();
          break;

         case MyEnum.ShopItemType.Ads:
          this.getPlantByAds();
          break;

         case MyEnum.ShopItemType.Money:
          this.buyPlantByMoney();
        }
        cc.Mgr.UIMgr.paymentUINode.getComponent("PaymentUI").updateItems();
      },
      buyPlantByGem: function buyPlantByGem() {
        var _this = this;
        if (!this.checkCanGrownPlantOrPot()) return;
        if (cc.Mgr.game.gems >= this.plantData.gem) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("buy-success"), "", cc.Mgr.UIMgr.paymentUINode);
          cc.Mgr.flowerPotMgr.addShopFlowerFot(this.plantData.level, 1);
          cc.Mgr.game.gems -= this.plantData.gem;
          cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "gem");
          this.setContent({
            lv: this.plantData.level
          });
          cc.director.GlobalEvent.emit(Event.BuyPlantInShop, {});
          var data = {};
          data.elapsed = cc.Mgr.Utils.getDate9(true);
          data.costGems = this.plantData.gem;
          data.plantID = this.plantData.level;
          cc.Mgr.analytics.logEvent("buy_plant_by_gems", JSON.stringify(data));
        } else {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("NoGems"), "gem", cc.Mgr.UIMgr.paymentUINode);
          if (true === this.allowShow) {
            this.allowShow = false;
            setTimeout(function() {
              cc.Mgr.UIMgr.openPaymentUI(true);
              _this.allowShow = true;
            }, 300);
          }
        }
      },
      buyPlantByMoney: function buyPlantByMoney() {
        cc.Mgr.game.money < this.price ? this.spriteCoin.setMaterial(0, this.grayM) : this.spriteCoin.setMaterial(0, this.nomarlM);
        if (!this.checkCanGrownPlantOrPot()) return;
        if (cc.Mgr.game.money >= this.price) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("buy-success"), "", cc.Mgr.UIMgr.paymentUINode);
          cc.Mgr.game.plantBuyRecord[this.plantData.level]++;
          cc.Mgr.flowerPotMgr.addShopFlowerFot(this.plantData.level, 1);
          cc.Mgr.game.money -= this.price;
          cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "money");
          this.setContent({
            lv: this.plantData.level
          });
          cc.director.GlobalEvent.emit(Event.BuyPlantInShop, {});
        } else {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("NoCoins"), "coin", cc.Mgr.UIMgr.paymentUINode);
          cc.Mgr.game.plantMaxLv >= cc.Mgr.game.exchangeCoinConfig.openLevel && cc.Mgr.game.needShowExchangeCoinCount++;
          if (cc.Mgr.game.needShowExchangeCoinCount >= 3 && cc.Mgr.game.plantMaxLv >= cc.Mgr.game.exchangeCoinConfig.openLevel) {
            var exchangeGemNum = cc.Mgr.UIMgr.gemNum();
            cc.Mgr.game.currentExchangeCount < cc.Mgr.game.exchangeCoinConfig.maxExchangeNum && cc.Mgr.game.gems >= exchangeGemNum ? cc.Mgr.UIMgr.openExchangeCoinUI(true) : cc.Mgr.game.level > 1 && this.showCount >= 3 ? this.showCount = 0 : this.showCount++;
            cc.Mgr.game.needShowExchangeCoinCount = 0;
          }
        }
      },
      onLookPlant: function onLookPlant() {
        if (false == this.limitClick.clickTime()) return;
        if (this.plantData.level > cc.Mgr.game.plantMaxLv) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("be-lock"), "", cc.Mgr.UIMgr.paymentUINode);
          return;
        }
        cc.Mgr.UIMgr.openPlantGetUI("look", this.plantData.level);
      },
      getPlantByAds: function getPlantByAds() {
        if (false == this.limitClick.clickTime()) return;
        if (false === cc.Mgr.UIMgr.paymentUINode.getComponent("PaymentUI").checkAvailabelAds) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("ad-tip-3"), "", cc.Mgr.UIMgr.paymentUINode);
          return;
        }
        var self = this;
        cc.Mgr.admob.showRewardedVideoAd(function(_state) {
          if (_state) {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("newItem-title"), "", cc.Mgr.UIMgr.paymentUINode);
            cc.Mgr.game.lastAdsGetPlantTime = cc.Mgr.Utils.GetSysTime();
            self.schedule(self.countTime, 1);
            cc.Mgr.UIMgr.closeShop();
            self.setContent({
              lv: self.plantData.level
            });
            cc.Mgr.UIMgr.openPlantGetUI("get", self.plantData.level);
          }
        }, cc.Mgr.UIMgr.paymentUINode, "shop", this);
      },
      updateAdsBtnState: function updateAdsBtnState() {
        cc.Mgr.UIMgr.paymentUINode.getComponent("PaymentUI").checkAvailabelAds = cc.Mgr.admob.checkAvailableRewardedAd();
        if (cc.Mgr.UIMgr.paymentUINode.getComponent("PaymentUI").checkAvailabelAds && false == this.unlockNode.active) {
          this.spriteCoin2.setMaterial(0, this.nomarlM);
          this.btn_ad.active = true;
        } else {
          this.spriteCoin2.setMaterial(0, this.grayM);
          this.btn_ad.active = false;
        }
      },
      checkCanGrownPlantOrPot: function checkCanGrownPlantOrPot() {
        if (!cc.Mgr.plantMgr.checkHasAnySpaceGird()) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("NoSpaceForPlant"), "", cc.Mgr.UIMgr.paymentUINode);
          return false;
        }
        return true;
      }
    });
    module.exports = shopItem;
    cc._RF.pop();
  }, {
    AtlasType: "AtlasType",
    DataType: "DataType",
    Event: "Event",
    MyEnum: "MyEnum",
    MySprite: "MySprite"
  } ],
  signItem: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5966e+5SSBDxauapqaV3Qvu", "signItem");
    "use strict";
    var signItem = cc.Class({
      extends: cc.Component,
      properties: {
        rewardLbl: cc.Label,
        maskNode: cc.Node,
        checkedNode: cc.Node,
        selectedNode: cc.Node
      },
      setData: function setData(index) {
        this.rewardLbl.string = "x" + cc.Mgr.Config.signDataListSub[index - 1].rewardNum;
        this.maskNode.active = this.checkedNode.active = false;
        this.selectedNode.active = false;
        cc.Mgr.game.hasSignDayNum >= index ? this.maskNode.active = this.checkedNode.active = true : cc.Mgr.game.hasSignDayNum + 1 === index && cc.Mgr.Utils.getDays(cc.Mgr.Utils.GetSysTime()) - cc.Mgr.Utils.getDays(cc.Mgr.game.lastSignDate) >= 1;
      }
    });
    module.exports = signItem;
    cc._RF.pop();
  }, {} ],
  signUI: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "af105oVOG9N+67jZ7+Mo6Qd", "signUI");
    "use strict";
    var signItem = require("signItem");
    var MissionType = require("MissionType");
    var AchieveType = require("AchieveType");
    var signUI = cc.Class({
      extends: cc.Component,
      properties: {
        dayList: [ signItem ],
        adsDoubleSignBtn: cc.Button,
        inviteBtn: cc.Button,
        hasSignTip: cc.Node,
        toggle: cc.Toggle,
        dayLabelList: [ cc.Label ],
        checkedLabel: cc.Label,
        tip: cc.Label,
        content: cc.Node,
        blurBg: cc.Node,
        btnLabel: cc.Label,
        title: cc.Node,
        title_zh: cc.Node,
        title_ja: cc.Node,
        title_ru: cc.Node,
        gemsLabel: cc.Label,
        doubleTip: cc.Label
      },
      onLoad: function onLoad() {
        this.limitClick = this.node.getComponent("LimitClick");
      },
      start: function start() {
        this.title.active = false;
        this.title_zh.active = false;
        this.title_ja.active = false;
        this.title_ru.active = false;
        "Japanese" === cc.Mgr.Config.language ? this.title_ja.active = true : "Simplified Chinese" === cc.Mgr.Config.language || "Traditional Chinese" === cc.Mgr.Config.language ? this.title_zh.active = true : "Russian" === cc.Mgr.Config.language ? this.title_ru.active = true : this.title.active = true;
      },
      showUI: function showUI() {
        for (var i = 0; i < 7; i++) this.dayLabelList[i].string = cc.Mgr.Utils.getTranslation("signIn-day", [ i + 1 ]);
        this.checkedLabel.string = cc.Mgr.Utils.getTranslation("signIn-checked");
        this.tip.string = cc.Mgr.Utils.getTranslation("signIn-tip");
        this.btnLabel.string = cc.Mgr.Utils.getTranslation("btn-claim");
        this.doubleTip.string = cc.Mgr.Utils.getTranslation("invite-double-tip");
        this.node.width = cc.Mgr.Config.winSize.width;
        this.node.height = cc.Mgr.Config.winSize.height;
        this.refreshUI();
        this.blurBg.opacity = 0;
        this.content.opacity = 0;
        this.content.setScale(.5);
        cc.tween(this.blurBg).to(.05, {
          opacity: 255
        }).call().start();
        cc.tween(this.content).to(.15, {
          opacity: 255,
          scale: 1
        }).start();
        var rewardNum = 2 * cc.Mgr.Config.signDataList[cc.Mgr.game.hasSignDayNum].rewardNum;
        this.gemsLabel.string = "X" + rewardNum;
        cc.Mgr.admob.showBanner("dailyBonus");
      },
      adsDoubleSign: function adsDoubleSign() {
        if (false == this.limitClick.clickTime()) return;
        cc.Mgr.AudioMgr.playSFX("click");
        var rewardNum = cc.Mgr.Config.signDataList[cc.Mgr.game.hasSignDayNum].rewardNum;
        this.getRewards(rewardNum);
        cc.Mgr.game.hasSignDayNum += 1;
        cc.Mgr.game.hasSignDayNum >= 7 && (cc.Mgr.game.hasSignDayNum = 0);
        cc.Mgr.game.lastSignDate = cc.Mgr.Utils.GetSysTime();
        this.refreshUI();
      },
      onClickInvite: function onClickInvite() {
        if (false == this.limitClick.clickTime()) return;
        cc.Mgr.AudioMgr.playSFX("click");
        var self = this;
        cc.Mgr.UIMgr.showLoading();
        cc.Mgr.Utils.getBase64Image("resources/tex/shareImage_7.png", function(_data) {
          cc.Mgr.UIMgr.hideLoading();
          cc.Mgr.game.updateMissionProgressById(MissionType.InviteCount);
          cc.Mgr.game.updateAchieveProgressByType(AchieveType.Invite);
          cc.Mgr.UIMgr.InGameUI.checkMissionAchieveTip();
          var rewardNum = 2 * cc.Mgr.Config.signDataList[cc.Mgr.game.hasSignDayNum].rewardNum;
          self.getRewards(rewardNum);
          cc.Mgr.game.hasSignDayNum += 1;
          cc.Mgr.game.hasSignDayNum >= 7 && (cc.Mgr.game.hasSignDayNum = 0);
          cc.Mgr.game.lastSignDate = cc.Mgr.Utils.GetSysTime();
          self.refreshUI();
          var data = {};
          data.elapsed = cc.Mgr.Utils.getDate9(true);
          data.stage = cc.Mgr.game.level;
          data.feature = "sign in";
          cc.Mgr.analytics.logEvent("share_message", JSON.stringify(data));
          cc.Mgr.UIMgr.showPrompt("Invitation Failed", "", self.node);
          cc.Mgr.UIMgr.hideLoading();
        });
      },
      refreshUI: function refreshUI() {
        this.hasSignTip.active = false;
        this.adsDoubleSignBtn.node.active = true;
        this.inviteBtn.node.active = false;
        this.doubleTip.node.active = false;
        if (cc.Mgr.Utils.getDays(cc.Mgr.Utils.GetSysTime()) - cc.Mgr.Utils.getDays(cc.Mgr.game.lastSignDate) < 1) {
          this.adsDoubleSignBtn.node.active = false;
          this.doubleTip.node.active = false;
          this.inviteBtn.node.active = false;
          this.hasSignTip.active = true;
        } else cc.Mgr.Utils.getDays(cc.Mgr.Utils.GetSysTime()) - cc.Mgr.Utils.getDays(cc.Mgr.game.lastSignDate) > 2 && (cc.Mgr.game.hasSignDayNum = 0);
        for (var i = 0; i < this.dayList.length; i++) this.dayList[i].setData(i + 1);
      },
      getRewards: function getRewards(num) {
        cc.Mgr.UIMgr.openAssetGetUI("gem", num, "sign");
      },
      closeUI: function closeUI() {
        cc.Mgr.AudioMgr.playSFX("click");
        cc.Mgr.admob.hideBanner("dailyBonus");
        var self = this;
        cc.tween(this.blurBg).to(.15, {
          opacity: 0
        }).start();
        cc.tween(this.content).to(.15, {
          opacity: 0,
          scale: .5
        }).call(function() {
          cc.Mgr.UIMgr.InGameUI.checkSignState();
          self.node.active = false;
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount("sign");
      }
    });
    module.exports = signUI;
    cc._RF.pop();
  }, {
    AchieveType: "AchieveType",
    MissionType: "MissionType",
    signItem: "signItem"
  } ],
  smallResult: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9f145ZGhENGPJ7xjNZ2pNC0", "smallResult");
    "use strict";
    var MyEnum = require("MyEnum");
    var smallResult = cc.Class({
      extends: cc.Component,
      properties: {
        successNode: cc.Node,
        failedNode: cc.Node,
        failedDb: dragonBones.ArmatureDisplay,
        winDb: dragonBones.ArmatureDisplay
      },
      show: function show(suc) {
        void 0 === suc && (suc = false);
        this.successNode.active = suc;
        this.failedNode.active = !suc;
        if (suc) {
          cc.Mgr.AudioMgr.playSFX(MyEnum.AudioType.success2);
          this.winDb.playAnimation("success", 1);
        } else {
          cc.Mgr.AudioMgr.playSFX(MyEnum.AudioType.fail);
          this.failedDb.playAnimation("defeat", 1);
        }
        this.scheduleOnce(function() {
          this.node.active = false;
        }, 2.14);
      }
    });
    module.exports = smallResult;
    cc._RF.pop();
  }, {
    MyEnum: "MyEnum"
  } ],
  tipMoveAttack: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4736fJykpdD56/1Jx6L5QxS", "tipMoveAttack");
    "use strict";
    var tipMoveAttack = cc.Class({
      extends: cc.Component,
      properties: {
        desLabel: cc.Label
      },
      closeNode: function closeNode() {
        cc.Mgr.plantMgr.hideTipAttackNode();
      },
      showtipMoveAttack: function showtipMoveAttack() {
        this.desLabel.string = cc.Mgr.Utils.getTranslation("guide-move-plant");
        this.unschedule(this.closeNode);
        this.scheduleOnce(this.closeNode, 5);
      },
      closeTip: function closeTip() {
        this.unschedule(this.closeNode);
        this.node.active = false;
      }
    });
    module.exports = tipMoveAttack;
    cc._RF.pop();
  }, {} ],
  turnArrow: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5052c+h+V9GfaCQaXgrRqSt", "turnArrow");
    "use strict";
    var aniName = [ "turn_table_arrow_in", "turn_table_arrow_dur", "turn_table_arrow_out" ];
    var turnArrow = cc.Class({
      extends: cc.Component,
      properties: {
        anima: cc.Animation
      },
      playIn: function playIn() {
        this.anima.play(aniName[0]);
      },
      InEnd: function InEnd() {
        this.anima.play(aniName[1]);
        this.scheduleOnce(function() {
          this.anima.play(aniName[2]);
        }, 2.67);
      }
    });
    module.exports = turnArrow;
    cc._RF.pop();
  }, {} ],
  turnTableUI: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f89ed89jt5HRYA9GcZTDisQ", "turnTableUI");
    "use strict";
    var MySprite = require("MySprite");
    var DataType = require("DataType");
    var TurnTableGetType = require("TurnTableGetType");
    var AtlasType = require("AtlasType");
    var rewardBox = require("rewardBox");
    var turnTableUI = cc.Class({
      extends: cc.Component,
      properties: {
        disc: cc.Node,
        spList: [ cc.Sprite ],
        mySpList: [ MySprite ],
        freeBtn: cc.Button,
        gemBtn: cc.Button,
        closeBtn: cc.Node,
        inviteBtn: cc.Button,
        lblList: [ cc.Label ],
        lblList_ru: [ cc.Label ],
        lblListNode: cc.Node,
        lblListNode_ru: cc.Node,
        gemLbl: cc.Label,
        freetimeLbl: cc.Label,
        timeNode: cc.Node,
        freetimeTipLbl: cc.Label,
        timeDesLbl: cc.Label,
        rotating: false,
        lastPlantMaxLv: 0,
        gemLabel: cc.Label,
        adsIconNode: cc.Node,
        freeLabelNode: cc.Label,
        spriteFrameList: [ cc.SpriteFrame ],
        startLabel: cc.Label,
        content: cc.Node,
        blurBg: cc.Node,
        dbListNode: cc.Node,
        titleLabel: cc.Label,
        okLabel: cc.Label,
        okBtn: cc.Node,
        spriteCoin: cc.Sprite,
        nomarlM: cc.Material,
        grayM: cc.Material
      },
      onLoad: function onLoad() {
        this.buffMap = [ "rage", "auto", "flame", "freeze", "crit" ];
        this.max_count = 6;
        this.ads_count = 5;
      },
      start: function start() {
        cc.Mgr.UIMgr.turnTableUI = this;
        this.freetimeTipLbl.string = cc.Mgr.Utils.getTranslation("roulette-timeTip");
        this.startLabel.string = cc.Mgr.Utils.getTranslation("roulette-start");
        this.freeLabelNode.string = cc.Mgr.Utils.getTranslation("btn-free");
        this.titleLabel.string = cc.Mgr.Utils.getTranslation("roulette-title");
        this.okLabel.string = cc.Mgr.Utils.getTranslation("btn-ok");
        this.limitClick = this.node.getComponent("LimitClick");
        this.allowShow = true;
      },
      showBtns: function showBtns() {
        this.refreshBtns();
        this.closeBtn.active = true;
      },
      hideBtns: function hideBtns() {
        this.freeBtn.node.active = false;
        this.gemBtn.node.active = false;
        this.closeBtn.active = false;
        this.okBtn.active = false;
        this.inviteBtn.node.active = false;
      },
      showUI: function showUI() {
        cc.Mgr.game.level <= 10 ? this.costGem = 5 : cc.Mgr.game.level <= 20 ? this.costGem = 5 : cc.Mgr.game.level <= 30 ? this.costGem = 10 : cc.Mgr.game.level <= 40 ? this.costGem = 15 : cc.Mgr.game.level <= 50 ? this.costGem = 30 : this.costGem = 60;
        this.showBtns();
        this.disc.angle = 0;
        this.startTimeCount();
        this.node.width = cc.Mgr.Config.winSize.width;
        this.node.height = cc.Mgr.Config.winSize.height;
        cc.Mgr.game.plantMaxLv > this.lastPlantMaxLv && this.refreshPanel();
        this.gemLabel.string = this.costGem;
        if (cc.Mgr.game.freeFlag.TurnTable || 0 === cc.Mgr.game.spinADResetTime) {
          cc.Mgr.game.freeFlag.TurnTable = true;
          this.adsIconNode.active = false;
          this.freeLabelNode.node.active = true;
          this.freetimeLbl.node.active = false;
        } else {
          this.adsIconNode.active = true;
          this.freeLabelNode.node.active = false;
          this.freetimeLbl.node.active = true;
        }
        this.blurBg.opacity = 0;
        this.content.opacity = 0;
        this.content.setScale(.5);
        cc.tween(this.blurBg).to(.05, {
          opacity: 255
        }).call().start();
        cc.tween(this.content).to(.15, {
          opacity: 255,
          scale: 1
        }).start();
        cc.Mgr.admob.showBanner("turnTable");
        this.updateAdsBtnState();
        this.lblListNode.active = "Russian" != cc.Mgr.Config.language;
        this.lblListNode_ru.active = false;
      },
      playOverAnimation: function playOverAnimation() {
        this.rotating = false;
        this.showBtns();
      },
      playTurnAnimation: function playTurnAnimation() {
        this.dbListNode.active = false;
        this.count = 0;
        this.callback = function() {
          if (30 == this.count) {
            this.playOverAnimation();
            this.unschedule(this.callback);
          }
          this.count++;
        };
        this.schedule(this.callback, .1);
        this.hideBtns();
      },
      refreshPanel: function refreshPanel() {
        this.dbListNode.active = true;
        this.lastPlantMaxLv = cc.Mgr.game.plantMaxLv;
        this.currentBuffList = [];
        this.freeBtn.node.active = cc.Mgr.game.freeFlag.TurnTable;
        var list = cc.Mgr.MapDataMgr.getDataListByDataType(DataType.TurnTableData);
        var chooseList = [];
        this.disc.rotate = 0;
        this.rewardList = [];
        var coinList = [];
        var plantList = [];
        var gemList = [];
        var buffList = [];
        var droneList = [];
        for (var key = 1; key < list.length; key++) {
          var key = key.toString();
          var dt = list[key];
          switch (dt.type) {
           case TurnTableGetType.coin:
            coinList.push(dt);
            break;

           case TurnTableGetType.gem:
            gemList.push(dt);
            break;

           case TurnTableGetType.plant:
            plantList.push(dt);
            break;

           case TurnTableGetType.buff:
            buffList.push(dt);
            break;

           case TurnTableGetType.drone:
            droneList.push(dt);
          }
        }
        var coinCount = 0, gemCount = 0, plantCount = 0, buffCount = 0, droneCount = 0;
        var i = 0;
        for (i = 0; i < 6; i++) {
          var seed = Math.random();
          if (seed < .2 && coinCount < 2 && coinList.length > 0) {
            coinCount += 1;
            var dt = cc.Mgr.Utils.getArrayItemsAndChangeArr(coinList, 1);
            chooseList.push(dt[0]);
          } else if (seed < .4 && gemCount < 2 && gemList.length > 0) {
            gemCount += 1;
            var dt = cc.Mgr.Utils.getArrayItemsAndChangeArr(gemList, 1);
            chooseList.push(dt[0]);
          } else if (seed < .6 && plantCount < 2 && plantList.length > 0) {
            plantCount += 1;
            var dt = cc.Mgr.Utils.getArrayItemsAndChangeArr(plantList, 1);
            chooseList.push(dt[0]);
          } else if (seed < .8 && buffCount < 2 && buffList.length > 0) {
            buffCount += 1;
            var dt = cc.Mgr.Utils.getArrayItemsAndChangeArr(buffList, 1);
            chooseList.push(dt[0]);
          } else if (droneCount < 2 && droneList.length > 0) {
            droneCount += 1;
            var dt = cc.Mgr.Utils.getArrayItemsAndChangeArr(droneList, 1);
            chooseList.push(dt[0]);
          } else {
            if (6 == chooseList.length) break;
            chooseList.length < 6 && i > 0 && i--;
          }
        }
        var curMaxLv = cc.Mgr.game.plantMaxLv;
        for (var index = 0; index < chooseList.length; index++) this.setBlockInfo(index, chooseList[index], curMaxLv);
      },
      setBlockInfo: function setBlockInfo(index, dt, curMaxLv) {
        this.spList[index].node.setScale(1);
        switch (dt.type) {
         case TurnTableGetType.coin:
          this.spList[index].node.active = true;
          this.mySpList[index].node.active = false;
          this.spList[index].spriteFrame = this.spriteFrameList[0];
          this.spList[index].scale = 1;
          var spinLv = this.pickOutSpinData(dt.rarity, cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.SpinLevelData, curMaxLv));
          var num = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData, spinLv).price;
          num = num * BigInt(8) / BigInt(10);
          this.lblList[index].string = "x" + cc.Mgr.Utils.getNumStr2(num);
          var rewardData = new rewardBox();
          rewardData.setData(dt.type, num, 1, dt.weight);
          this.rewardList[index] = rewardData;
          break;

         case TurnTableGetType.gem:
          this.spList[index].node.active = true;
          this.mySpList[index].node.active = false;
          this.spList[index].spriteFrame = this.spriteFrameList[1];
          this.spList[index].scale = 1;
          this.lblList[index].string = "x" + dt.rewards;
          var rewardData = new rewardBox();
          rewardData.setData(dt.type, dt.rewards, 1, dt.weight);
          this.rewardList[index] = rewardData;
          break;

         case TurnTableGetType.plant:
          this.spList[index].node.active = false;
          this.mySpList[index].node.active = true;
          var spinLv = this.pickOutSpinData(dt.rarity, cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.SpinLevelData, curMaxLv));
          var spName = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData, spinLv).head;
          this.mySpList[index].setSprite(AtlasType.PlantHead, spName);
          this.lblList[index].string = "Lv." + spinLv;
          var rewardData = new rewardBox();
          rewardData.setData(dt.type, 1, spinLv, dt.weight);
          this.rewardList[index] = rewardData;
          break;

         case TurnTableGetType.buff:
          var randomIndex = Math.floor(5 * Math.random());
          this.currentBuffList[index] = this.buffMap[randomIndex];
          this.spList[index].node.active = true;
          this.spList[index].node.setScale(.6);
          this.mySpList[index].node.active = false;
          this.spList[index].spriteFrame = this.spriteFrameList[randomIndex + 2];
          this.lblList[index].string = dt.rewards + "s";
          var rewardData = new rewardBox();
          rewardData.setData(dt.type, dt.rewards, 1, dt.weight);
          this.rewardList[index] = rewardData;
          break;

         case TurnTableGetType.drone:
          this.spList[index].node.active = false;
          this.mySpList[index].node.active = true;
          var spinLv = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.DroneData, curMaxLv).Drone;
          this.mySpList[index].setSprite(AtlasType.PlantHead, "egg_2");
          this.mySpList[index].scale = .6;
          this.lblList[index].string = "x6";
          var rewardData = new rewardBox();
          rewardData.setData(dt.type, 6, spinLv, dt.weight);
          this.rewardList[index] = rewardData;
        }
      },
      pickOutSpinData: function pickOutSpinData(spinType, dt) {
        var lv;
        switch (spinType) {
         case "S":
          return cc.Mgr.game.plantMaxLv - 1;

         case "A":
          lv = cc.Mgr.game.plantMaxLv - 2 < 1 ? 1 : cc.Mgr.game.plantMaxLv - 2;
          return lv;

         case "B":
          lv = cc.Mgr.game.plantMaxLv - 3 < 1 ? 1 : cc.Mgr.game.plantMaxLv - 3;
          return lv;

         case "C":
          lv = cc.Mgr.game.plantMaxLv - 4 < 1 ? 1 : cc.Mgr.game.plantMaxLv - 4;
          return lv;
        }
      },
      startTimeCount: function startTimeCount() {
        if (this.max_count - cc.Mgr.game.spinADResetTime > 0) return;
        cc.Mgr.game.spinADTimeCount = 0 === cc.Mgr.game.spinADTimeCount ? cc.Mgr.Utils.GetSysTime() + 7200 : cc.Mgr.game.spinADTimeCount;
        this.seconds = cc.Mgr.game.spinADTimeCount - cc.Mgr.Utils.GetSysTime();
        this.unschedule(this.countTime);
        this.seconds > 0 && this.schedule(this.countTime, 1);
      },
      countTime: function countTime() {
        this.seconds -= 1;
        if (this.seconds < 0) {
          this.unschedule(this.countTime);
          cc.Mgr.game.spinADResetTime = 0;
          this.timeNode.active = false;
          cc.Mgr.game.freeFlag.TurnTable = true;
          cc.Mgr.game.spinADTimeCount = 0;
          this.refreshBtns();
          return;
        }
        var timeStr = cc.Mgr.Utils.FormatNumToTime(this.seconds);
        this.timeNode.active = true;
        this.timeDesLbl.string = timeStr;
      },
      refreshBtns: function refreshBtns() {
        if (cc.Mgr.game.freeFlag.TurnTable) {
          this.adsIconNode.active = false;
          this.freeLabelNode.node.active = true;
          this.freetimeLbl.node.active = false;
          this.freeBtn.node.active = true;
        } else {
          this.adsIconNode.active = true;
          this.freeLabelNode.node.active = false;
          this.freetimeLbl.node.active = true;
          this.freeBtn.node.active = false;
        }
        this.gemBtn.node.active = true;
        this.updateAdsBtnState();
      },
      updateBtns: function updateBtns(_noFill) {
        true == _noFill && cc.Mgr.game.noFillCount++;
        if (cc.Mgr.game.noFillCount >= 3) {
          this.freeBtn.node.active = cc.Mgr.game.freeFlag.TurnTable || 0 === cc.Mgr.game.spinADResetTime;
          this.inviteBtn.node.active = !this.freeBtn.node.active;
          this.inviteBtn.node.active && (this.inviteBtn.node.active = false);
        } else this.inviteBtn.node.active = false;
      },
      onClickTurnTableByInvite: function onClickTurnTableByInvite() {
        var _this = this;
        if (false == this.limitClick.clickTime()) return;
        cc.Mgr.AudioMgr.playSFX("click");
        if (this.rotating) return;
        if (cc.Mgr.game.spinADResetTime >= this.max_count) return;
        var self = this;
        cc.Mgr.UIMgr.showLoading();
        cc.Mgr.Utils.getBase64Image("resources/tex/shareImage_2.png", function(_data) {
          cc.Mgr.UIMgr.hideLoading();
          cc.Mgr.game.updateMissionProgressById(MissionType.InviteCount);
          cc.Mgr.game.updateAchieveProgressByType(AchieveType.Invite);
          cc.Mgr.UIMgr.InGameUI.checkMissionAchieveTip();
          cc.Mgr.game.spinADResetTime++;
          _this.max_count - cc.Mgr.game.spinADResetTime <= 0 && self.startTimeCount();
          self.refreshBtns();
          self.startRotate();
          self.playTurnAnimation();
          var data = {};
          data.elapsed = cc.Mgr.Utils.getDate9(true);
          data.stage = cc.Mgr.game.level;
          data.feature = "roulette";
          cc.Mgr.analytics.logEvent("share_message", JSON.stringify(data));
          cc.Mgr.UIMgr.showPrompt("Invitation Failed", "", self.node);
          cc.Mgr.UIMgr.hideLoading();
        });
      },
      adsTurnTable: function adsTurnTable() {
        if (false == this.limitClick.clickTime()) return;
        cc.Mgr.AudioMgr.playSFX("click");
        if (this.rotating) return;
        if (cc.Mgr.game.spinADResetTime >= this.max_count) return;
        var self = this;
        if (cc.Mgr.game.freeFlag.TurnTable) {
          cc.Mgr.game.freeFlag.TurnTable = false;
          this.adsIconNode.active = true;
          this.freeLabelNode.node.active = false;
          this.freetimeLbl.node.active = true;
          cc.Mgr.game.spinADResetTime++;
          this.max_count - cc.Mgr.game.spinADResetTime <= 0 && self.startTimeCount();
          self.refreshBtns();
          self.startRotate();
          self.playTurnAnimation();
        } else {
          if (false === this.checkAvailabelAds) {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("ad-tip-3"), "", this.node);
            return;
          }
          cc.Mgr.admob.showRewardedVideoAd(function(_state, _noFill) {
            if (_state) {
              cc.Mgr.game.spinADResetTime++;
              this.max_count - cc.Mgr.game.spinADResetTime <= 0 && self.startTimeCount();
              self.refreshBtns();
              self.startRotate();
              self.playTurnAnimation();
              this.updateBtns(_noFill);
            }
          }.bind(this), this.node, "roulette", this);
        }
      },
      updateAdsBtnState: function updateAdsBtnState() {},
      gemTurnTable: function gemTurnTable() {
        var _this2 = this;
        if (false == this.limitClick.clickTime()) return;
        cc.Mgr.AudioMgr.playSFX("click");
        if (this.rotating) return;
        if (cc.Mgr.game.gems < this.costGem) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("NoGems"), "gem", this.node);
          if (true === this.allowShow) {
            this.allowShow = false;
            setTimeout(function() {
              cc.Mgr.UIMgr.openPaymentUI(true);
              _this2.allowShow = true;
            }, 300);
          }
          return;
        }
        cc.Mgr.game.gems -= this.costGem;
        cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "gem");
        cc.Mgr.game.spinUseGemTime++;
        cc.Mgr.game.spinUseGemTime > this.ads_count && (cc.Mgr.game.spinUseGemTime = this.ads_count);
        this.startRotate();
        this.playTurnAnimation();
      },
      playSFXRotation: function playSFXRotation() {
        cc.Mgr.AudioMgr.playSFX("spin");
      },
      startRotate: function startRotate(callback) {
        var _this3 = this;
        this.rotating = true;
        var angle = 0;
        var allWeight = 0;
        for (var i = 0; i < this.rewardList.length; i++) allWeight += this.rewardList[i].weight;
        var num = parseInt(allWeight * Math.random()) + 1;
        angle = num <= this.rewardList[0].weight ? 1 : num <= this.rewardList[1].weight + this.rewardList[0].weight ? 2 : num <= this.rewardList[2].weight + this.rewardList[1].weight + this.rewardList[0].weight ? 3 : num <= this.rewardList[3].weight + this.rewardList[2].weight + this.rewardList[1].weight + this.rewardList[0].weight ? 4 : num <= this.rewardList[4].weight + this.rewardList[3].weight + this.rewardList[2].weight + this.rewardList[1].weight + this.rewardList[0].weight ? 5 : 0;
        var action = cc.rotateTo(2.5, 2160 + 60 * angle);
        action.easing(cc.easeInOut(3));
        this.disc.runAction(cc.sequence(action, cc.callFunc(function() {
          "function" === typeof callback && callback();
          _this3.getRewards(angle);
          setTimeout(function() {
            _this3.refreshPanel();
            _this3.disc.rotate = 60 * angle;
          }, 500);
        })));
      },
      getRewards: function getRewards(angle) {
        this.hideBtns();
        var rewardData = this.rewardList[angle];
        switch (rewardData.rType) {
         case TurnTableGetType.coin:
          cc.Mgr.UIMgr.openAssetGetUI("money", rewardData.num, "turnTable");
          break;

         case TurnTableGetType.gem:
          cc.Mgr.UIMgr.openAssetGetUI("gem", rewardData.num, "turnTable");
          break;

         case TurnTableGetType.plant:
          cc.Mgr.UIMgr.openAssetGetUI("plant", rewardData.id, "turnTable");
          break;

         case TurnTableGetType.buff:
          cc.Mgr.UIMgr.openAssetGetUI(this.currentBuffList[angle], rewardData.num, "turnTable");
          break;

         case TurnTableGetType.drone:
          cc.Mgr.UIMgr.openAssetGetUI("drone", rewardData.id, "turnTable");
        }
      },
      closeUI: function closeUI() {
        cc.Mgr.AudioMgr.playSFX("click");
        if (this.rotating) return;
        cc.Mgr.admob.hideBanner("turnTable");
        var self = this;
        cc.tween(this.blurBg).to(.15, {
          opacity: 0
        }).start();
        cc.tween(this.content).to(.15, {
          opacity: 0,
          scale: .5
        }).call(function() {
          self.unschedule(self.countTime);
          self.node.active = false;
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount("turnTable");
      }
    });
    module.exports = turnTableUI;
    cc._RF.pop();
  }, {
    AtlasType: "AtlasType",
    DataType: "DataType",
    MySprite: "MySprite",
    TurnTableGetType: "TurnTableGetType",
    rewardBox: "rewardBox"
  } ],
  uavUI: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8e062Uc6hlOnp8CbRFRi8QX", "uavUI");
    "use strict";
    var DataType = require("DataType");
    var scaleConfig = 1.3;
    var tweenTime = .25;
    var MissionType = require("MissionType");
    var AchieveType = require("AchieveType");
    var uavUI = cc.Class({
      extends: cc.Component,
      properties: {
        numLbl: cc.Label,
        num: 1,
        lv: 5,
        dragonNode: cc.Node,
        playerPhoto: cc.Sprite,
        playerPhotoNode: cc.Node,
        closeNode: cc.Node,
        gemLabel: cc.Label,
        titleLabel: cc.Label,
        btnLabel: cc.Label,
        content: cc.Node,
        blurBg: cc.Node,
        tip: cc.Label,
        inviteLabel: cc.Label,
        inviteBtn: cc.Node,
        adBtn: cc.Node,
        btnNode: cc.Node,
        spriteCoin: cc.Sprite,
        nomarlM: cc.Material,
        grayM: cc.Material,
        timeNode: cc.Node,
        timeDesLbl: cc.Label,
        timeTipLabel: cc.Label,
        box: sp.Skeleton,
        boxBg: cc.Node,
        eggNode: cc.Node
      },
      onLoad: function onLoad() {
        this.limitClick = this.node.getComponent("LimitClick");
        this.allowShow = true;
      },
      doTween: function doTween() {
        var _this = this;
        this.box.node.position = this.playerPhotoNode.position = this.dragonNode.position = cc.v2(0, 920);
        this.closeNode.opacity = 0;
        this.closeNode.scale = 0;
        if (this.isInvite) {
          this.box.node.active = true;
          cc.tween(this.box.node).to(tweenTime, {
            position: cc.v2(0, 70)
          }).call(function() {
            _this.box.paused = false;
            cc.tween(_this.closeNode).to(.15, {
              opacity: 255,
              scale: 1
            }).start();
          }).start();
          setTimeout(function() {
            _this.numLbl.node.active = true;
          }, 1e3);
        } else {
          this.dragonNode.active = true;
          cc.tween(this.dragonNode).to(tweenTime, {
            position: cc.v2(0, 25)
          }).call(function() {
            cc.tween(_this.closeNode).to(.15, {
              opacity: 255,
              scale: 1
            }).start();
          }).start();
        }
      },
      changePlayerPhoto: function changePlayerPhoto(_tex) {
        var slot = this.box.findSlot("head3");
        var attach = slot.getAttachment();
        _tex.width = _tex.height = 50;
        var spineTexture = new sp.SkeletonTexture({
          width: _tex.width,
          height: _tex.height
        });
        spineTexture.setRealTexture(_tex);
        var region = attach.region;
        region.width = _tex.width;
        region.height = _tex.height;
        region.originalWidth = _tex.width;
        region.originalHeight = _tex.height;
        region.rotate = false;
        region.u = 0;
        region.v = 0;
        region.u2 = 1;
        region.v2 = 1;
        region.texture = spineTexture;
        region.renderObject = region;
        attach.width = _tex.width;
        attach.height = _tex.height;
        if (attach instanceof sp.spine.MeshAttachment) attach.updateUVs(); else {
          attach.setRegion(region);
          attach.updateOffset();
        }
        this.box.invalidAnimationCache();
      },
      showUI: function showUI(_isInvite, _photo, _playerId) {
        var _this2 = this;
        _isInvite && (_isInvite = false);
        this.titleLabel.string = true == _isInvite ? cc.Mgr.Utils.getTranslation("special-gift") : cc.Mgr.Utils.getTranslation("uav-title");
        this.boxBg.active = !_isInvite;
        this.eggNode.active = !_isInvite;
        this.btnLabel.string = cc.Mgr.Utils.getTranslation("btn-get") + "(" + cc.Mgr.game.uavAdsCount + "/5)";
        this.inviteLabel.string = cc.Mgr.Utils.getTranslation("btn-thanks");
        this.timeTipLabel.string = cc.Mgr.Utils.getTranslation("roulette-timeTip");
        this.costGem = 3;
        this.isInvite = _isInvite;
        this.inviteBtn.active = _isInvite;
        this.btnNode.active = !_isInvite;
        this.dragonNode.active = false;
        this.playerPhotoNode.active = false;
        this.box.node.active = false;
        this.box.setAnimation(0, "animation", false);
        this.box.paused = true;
        this.numLbl.node.active = false;
        if (this.isInvite) {
          this.playerId = _playerId;
          this.numLbl.node.position = cc.v2(-70, -370);
          this.numLbl.fontSize = 60;
          cc.assetManager.loadRemote(_photo, function(err, texture) {
            if (null == err) {
              var spriteFrame = new cc.SpriteFrame(texture);
              _this2.playerPhoto.spriteFrame = spriteFrame;
              _this2.playerPhoto.node.width = _this2.playerPhoto.node.height = 80;
              _this2.changePlayerPhoto(texture);
            }
          });
        } else {
          this.numLbl.node.active = true;
          this.numLbl.fontSize = 40;
          this.numLbl.node.position = cc.v2(15, -498);
        }
        var data = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.DroneData, cc.Mgr.game.plantMaxLv);
        if (cc.Mgr.game.level <= 10) {
          this.num = 6;
          this.costGem = 3;
        } else if (cc.Mgr.game.level <= 20) {
          this.num = 5;
          this.costGem = 3;
        } else if (cc.Mgr.game.level <= 30) {
          this.num = 4;
          this.costGem = 5;
        } else if (cc.Mgr.game.level <= 40) {
          this.num = 3;
          this.costGem = 15;
        } else if (cc.Mgr.game.level <= 50) {
          this.num = 2;
          this.costGem = 25;
        } else {
          this.num = 1;
          this.costGem = 35;
        }
        this.num = true == _isInvite ? 3 : this.num;
        this.gemLabel.string = this.costGem;
        this.lv = data.Drone;
        this.numLbl.string = "x" + this.num;
        this.tip.string = _isInvite ? cc.Mgr.Utils.getTranslation("special-gift-desc") : cc.Mgr.Utils.getTranslation("fairyGift-tip", [ this.num ]);
        this.doTween();
        this.blurBg.opacity = 0;
        this.content.opacity = 0;
        this.content.setScale(.5);
        cc.tween(this.blurBg).to(.05, {
          opacity: 255
        }).call().start();
        cc.tween(this.content).to(.15, {
          opacity: 255,
          scale: 1
        }).start();
        cc.Mgr.admob.showBanner("uav");
        this.checkAvailabelAds = cc.Mgr.admob.checkAvailableRewardedAd();
        this.adBtn.active = cc.Mgr.game.uavAdsCount > 0 && this.checkAvailabelAds;
        this.checkAvailabelAds ? this.spriteCoin.setMaterial(0, this.nomarlM) : this.spriteCoin.setMaterial(0, this.grayM);
        this.startTimeCount();
      },
      onClickInvite: function onClickInvite() {
        var self = this;
        cc.Mgr.UIMgr.showLoading();
        cc.Mgr.inviteManager.sendInvitation("resources/tex/shareImage_3.png", this.playerId, "playerName thanks you for the great gift!", "Learn more", "special gift", function(result) {
          cc.Mgr.UIMgr.hideLoading();
          if (result) {
            cc.Mgr.game.updateMissionProgressById(MissionType.InviteCount);
            cc.Mgr.game.updateAchieveProgressByType(AchieveType.Invite);
            cc.Mgr.UIMgr.InGameUI.checkMissionAchieveTip();
            cc.Mgr.flowerPotMgr.addDroneFlowerFot(self.lv, self.num);
            self.closeUI();
            cc.Mgr.UIMgr.showPrompt("Invitation Succeeded", "", self.node);
          } else cc.Mgr.UIMgr.showPrompt("Invitation Failed", "", self.node);
        });
      },
      gemGetDrone: function gemGetDrone() {
        var _this3 = this;
        if (false == this.limitClick.clickTime()) return;
        if (cc.Mgr.game.gems < this.costGem) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("NoGems"), "gem", this.node);
          if (true === this.allowShow) {
            this.allowShow = false;
            setTimeout(function() {
              cc.Mgr.UIMgr.openPaymentUI(true);
              _this3.allowShow = true;
            }, 300);
          }
          return;
        }
        cc.Mgr.game.gems -= this.costGem;
        cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "gem");
        cc.Mgr.flowerPotMgr.addDroneFlowerFot(this.lv, this.num);
        this.closeUI();
      },
      adsGetDrone: function adsGetDrone() {
        if (false == this.limitClick.clickTime()) return;
        if (false === this.checkAvailabelAds) {
          cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("ad-tip-3"), "", this.node);
          return;
        }
        var self = this;
        cc.Mgr.admob.showRewardedVideoAd(function(_state) {
          if (_state) {
            cc.Mgr.flowerPotMgr.addDroneFlowerFot(self.lv, self.num);
            cc.Mgr.game.uavAdsCount--;
            cc.Mgr.game.uavAdsCount <= 0 && (self.adBtn.active = false);
            self.closeUI();
          }
        }, this.node, "fairyGift", this);
      },
      startTimeCount: function startTimeCount() {
        if (cc.Mgr.game.uavAdsCount > 0 || this.isInvite) {
          this.timeNode.active = false;
          return;
        }
        cc.Mgr.game.uavAdsTimeCount = cc.Mgr.game.uavAdsTimeCount <= 0 ? cc.Mgr.Utils.GetSysTime() + 7200 : cc.Mgr.game.uavAdsTimeCount;
        this.seconds = cc.Mgr.game.uavAdsTimeCount - cc.Mgr.Utils.GetSysTime();
        this.unschedule(this.countTime);
        if (this.seconds > 0) {
          this.timeNode.active = true;
          var timeStr = cc.Mgr.Utils.FormatNumToTime(this.seconds);
          this.timeDesLbl.string = timeStr;
          this.schedule(this.countTime, 1);
        } else {
          cc.Mgr.game.uavAdsCount = 0;
          cc.Mgr.game.uavAdsTimeCount = 0;
          this.btnLabel.string = cc.Mgr.Utils.getTranslation("btn-get") + "(" + cc.Mgr.game.uavAdsCount + "/5)";
          this.timeNode.active = false;
          this.adBtn.active = cc.Mgr.game.uavAdsCount > 0;
        }
      },
      countTime: function countTime() {
        this.seconds -= 1;
        if (this.seconds < 0) {
          this.unschedule(this.countTime);
          cc.Mgr.game.uavAdsCount = 5;
          cc.Mgr.game.uavAdsTimeCount = 0;
          this.btnLabel.string = cc.Mgr.Utils.getTranslation("btn-get") + "(" + cc.Mgr.game.uavAdsCount + "/5)";
          this.timeNode.active = false;
          return;
        }
        var timeStr = cc.Mgr.Utils.FormatNumToTime(this.seconds);
        this.timeDesLbl.string = timeStr;
      },
      updateAdsBtnState: function updateAdsBtnState() {
        this.adBtn.active = false;
        this.checkAvailabelAds = cc.Mgr.admob.checkAvailableRewardedAd();
        if (this.checkAvailabelAds) {
          this.spriteCoin.setMaterial(0, this.nomarlM);
          cc.Mgr.game.uavAdsCount > 0 && (this.adBtn.active = true);
        } else this.spriteCoin.setMaterial(0, this.grayM);
      },
      closeUI: function closeUI() {
        cc.Mgr.AudioMgr.playSFX("click");
        cc.Mgr.admob.hideBanner("uav");
        var self = this;
        cc.tween(this.blurBg).to(.15, {
          opacity: 0
        }).start();
        cc.tween(this.content).to(.15, {
          opacity: 0,
          scale: .5
        }).call(function() {
          cc.Mgr.UIMgr.InGameUI.closeUav();
          self.node.active = false;
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount("uav");
      }
    });
    module.exports = uavUI;
    cc._RF.pop();
  }, {
    AchieveType: "AchieveType",
    DataType: "DataType",
    MissionType: "MissionType"
  } ],
  uav: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6ffde73ZFVLn7MKUof1xOlr", "uav");
    "use strict";
    var MyEnum = require("MyEnum");
    var uav = cc.Class({
      extends: cc.Component,
      properties: {
        dragonNode: cc.Node,
        beClicked: false,
        tip: cc.Node,
        playerPhoto: cc.Sprite,
        playerPhotoNode: cc.Node
      },
      onLoad: function onLoad() {},
      show: function show() {
        var _this = this;
        if (cc.Mgr.game.needShowUavTip && cc.Mgr.game.level <= 3) {
          this.tip.active = true;
          cc.Mgr.game.needShowUavTip = false;
        } else this.tip.active = false;
        var currentOffsetY = 380 + cc.Mgr.game.ratioOffsetY;
        this.movePos = [ cc.v2(200, currentOffsetY), cc.v2(-200, currentOffsetY), cc.v2(-400, currentOffsetY), cc.v2(400, currentOffsetY) ];
        this.beClicked = false;
        this.dragonNode.active = false;
        this.node.position = this.movePos[3];
        this.scheduleOnce(function() {
          this.dragonNode.active = true;
          this.moveLeftOrRight();
        }, .1);
        cc.Mgr.UIMgr.InGameUI.airDropShowTime++;
        this.isInvite = false;
        this.playerPhotoNode.active = false;
        if (cc.Mgr.UIMgr.InGameUI.airDropShowTime >= 3 && cc.Mgr.inviteManager.friendsList && cc.Mgr.inviteManager.friendsList.length > 0) {
          cc.Mgr.UIMgr.InGameUI.airDropShowTime = 0;
          this.isInvite = true;
          this.playerPhotoNode.active = true;
          var currentFriend = cc.Mgr.inviteManager.friendsList[cc.Mgr.UIMgr.InGameUI.airDropFriendIndex];
          this.friendPhoto = currentFriend.photo;
          this.friendId = currentFriend.id;
          cc.assetManager.loadRemote(currentFriend.photo, function(err, texture) {
            if (null == err) {
              var spriteFrame = new cc.SpriteFrame(texture);
              _this.playerPhoto.spriteFrame = spriteFrame;
              _this.playerPhoto.node.width = _this.playerPhoto.node.height = 65;
            }
          });
          cc.Mgr.UIMgr.InGameUI.airDropFriendIndex++;
          cc.Mgr.UIMgr.InGameUI.airDropFriendIndex >= cc.Mgr.inviteManager.friendsList.length && (cc.Mgr.UIMgr.InGameUI.airDropFriendIndex = 0);
        }
      },
      moveLeftOrRight: function moveLeftOrRight() {
        var _this2 = this;
        var self = this;
        self.node.scaleX = -1;
        cc.tween(this.node).to(.5, {
          position: this.movePos[0]
        }, {
          easing: "sineOut"
        }).call(function() {
          cc.Mgr.AudioMgr.playUavSFX(MyEnum.AudioType.plane);
          self.node.scaleX = -1;
        }).to(2, {
          position: this.movePos[0]
        }).call(function() {
          self.node.scaleX = -1;
        }).to(4, {
          position: this.movePos[1]
        }).call(function() {
          self.node.scaleX = 1;
        }).to(2, {
          position: this.movePos[1]
        }).call(function() {
          self.node.scaleX = 1;
        }).to(4, {
          position: this.movePos[0]
        }).call(function() {
          self.node.scaleX = -1;
        }).to(2, {
          position: this.movePos[0]
        }).call(function() {
          self.node.scaleX = -1;
        }).to(4, {
          position: this.movePos[1]
        }).call(function() {
          self.node.scaleX = 1;
        }).to(2, {
          position: this.movePos[1]
        }).call(function() {
          self.node.scaleX = 1;
        }).to(4, {
          position: this.movePos[0]
        }).call(function() {
          self.node.scaleX = -1;
        }).to(2, {
          position: this.movePos[0]
        }).call(function() {
          self.node.scaleX = -1;
        }).to(4, {
          position: this.movePos[1]
        }).call(function() {
          self.node.scaleX = -1;
        }).to(1, {
          position: this.movePos[2]
        }, {
          easing: "sineIn"
        }).call(function() {
          cc.Mgr.AudioMgr.stopUavSFX();
          cc.Mgr.UIMgr.InGameUI.unscheduleShowUav();
          _this2.node.stopAllActions();
          cc.Mgr.UIMgr.InGameUI.showUavNextTime(30);
          _this2.node.active = false;
        }).start();
      },
      click: function click() {
        cc.Mgr.UIMgr.InGameUI.unscheduleShowUav();
        this.node.stopAllActions();
        this.beClicked = true;
        cc.Mgr.UIMgr.openUavUI(this.isInvite, this.friendPhoto, this.friendId);
        this.tip.active = false;
      },
      uavOutScreen: function uavOutScreen() {
        var _this3 = this;
        this.node.scaleX = -1;
        cc.Mgr.AudioMgr.stopUavSFX();
        cc.tween(this.node).to(1, {
          position: this.movePos[2]
        }, {
          easing: "sineIn"
        }).call(function() {
          _this3.node.stopAllActions();
          cc.Mgr.UIMgr.InGameUI.showUavNextTime(30);
          _this3.node.active = false;
        }).start();
      }
    });
    module.exports = uav;
    cc._RF.pop();
  }, {
    MyEnum: "MyEnum"
  } ],
  uiConfig: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9a0fepKSdpOmKUpwM/qqTCo", "uiConfig");
    "use strict";
    var _statics;
    var uiConfig = cc.Class({
      extends: cc.Component,
      statics: (_statics = {
        setUI: {
          Name: "setUI",
          Layer: 2
        },
        turnTableUI: {
          Name: "turnTableUI",
          Layer: 2
        },
        uavUI: {
          Name: "uavUI",
          Layer: 2
        },
        buffUI: {
          Name: "buffUI",
          Layer: 2
        },
        missionUI: {
          Name: "missionUI",
          Layer: 2
        },
        promptUI: {
          Name: "promptUI",
          Layer: 1
        },
        smallResult: {
          Name: "smallResult",
          Layer: 1
        },
        bigResult: {
          Name: "bigResult",
          Layer: 3
        },
        bossComing: {
          Name: "bossComing",
          Layer: 1
        },
        plantGetUI: {
          Name: "plantGetUI",
          Layer: 5
        },
        assetGetUI: {
          Name: "assetGetUI",
          Layer: 5
        }
      }, _statics["uavUI"] = {
        Name: "uavUI",
        Layer: 2
      }, _statics.offlineAssetUI = {
        Name: "offlineAssetUI",
        Layer: 2
      }, _statics.paymentUI = {
        Name: "payment",
        Layer: 4
      }, _statics.shareUI = {
        Name: "shareUI",
        Layer: 2
      }, _statics.doubleCoinUI = {
        Name: "doubleCoinUI",
        Layer: 2
      }, _statics.signUI = {
        Name: "signUI",
        Layer: 2
      }, _statics.shopItem = {
        Name: "shopItem",
        Layer: 2
      }, _statics.missionItem = {
        Name: "missionItem",
        Layer: 2
      }, _statics.achieveItem = {
        Name: "achieveItem",
        Layer: 2
      }, _statics.gameInUI = {
        Name: "gameInUI",
        Layer: 0
      }, _statics.guide = {
        Name: "guide",
        Layer: 6
      }, _statics.jinbi = {
        Name: "jinbi",
        Layer: 9
      }, _statics.exchangeCoinUI = {
        Name: "exchangeCoinUI",
        Layer: 3
      }, _statics.newRecordUI = {
        Name: "newRecordUI",
        Layer: 1
      }, _statics.vipUI = {
        Name: "VIP",
        Layer: 2
      }, _statics.maxLevel = {
        Name: "maxLevel",
        Layer: 1
      }, _statics.starterBundleUI = {
        Name: "starterBundle",
        Layer: 2
      }, _statics.updateAvailable = {
        Name: "updateAvailable",
        Layer: 2
      }, _statics.enjoyNature = {
        Name: "enjoyNature",
        Layer: 2
      }, _statics.compensationUI = {
        Name: "compensationUI",
        Layer: 2
      }, _statics.coinBundle = {
        Name: "coinBundle",
        Layer: 4
      }, _statics.offlineBundle = {
        Name: "offlineBundle",
        Layer: 4
      }, _statics.removeAdBundle = {
        Name: "removeAdBundle",
        Layer: 4
      }, _statics.specialGridBundle = {
        Name: "specialGridBundle",
        Layer: 4
      }, _statics.unlockAllBundle = {
        Name: "unlockAllBundle",
        Layer: 4
      }, _statics.rankingUI = {
        Name: "rankingUI",
        Layer: 2
      }, _statics.adsBlocker = {
        Name: "adsBlocker",
        Layer: 5
      }, _statics.pauseUI = {
        Name: "pauseUI",
        Layer: 2
      }, _statics)
    });
    module.exports = uiConfig;
    cc._RF.pop();
  }, {} ],
  uiItemMgr: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "edfd0bTU9xD94G5wtyKbH9O", "uiItemMgr");
    "use strict";
    var uiConfig = require("uiConfig");
    var uiItemMgr = cc.Class({
      extends: cc.Component,
      statics: {
        shopItemPre: cc.Prefab,
        missionItemPre: cc.Prefab,
        achieveItemPre: cc.Prefab,
        loadItemsPre: function loadItemsPre() {
          var self = this;
          cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.shopItem.Name, function(errmsg, prefab) {
            if (errmsg) {
              cc.error(errmsg.message || errmsg);
              return;
            }
            self.shopItemPre = prefab;
          });
          cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.missionItem.Name, function(errmsg, prefab) {
            if (errmsg) {
              cc.error(errmsg.message || errmsg);
              return;
            }
            self.missionItemPre = prefab;
          });
          cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.achieveItem.Name, function(errmsg, prefab) {
            if (errmsg) {
              cc.error(errmsg.message || errmsg);
              return;
            }
            self.achieveItemPre = prefab;
          });
        },
        getShopItemPre: function getShopItemPre() {
          return this.shopItemPre;
        },
        getMissionItemPre: function getMissionItemPre() {
          return this.missionItemPre;
        },
        getAchieveItemPre: function getAchieveItemPre() {
          return this.achieveItemPre;
        }
      }
    });
    module.exports = uiItemMgr;
    cc._RF.pop();
  }, {
    uiConfig: "uiConfig"
  } ],
  "use_v2.1-2.2.1_cc.Toggle_event": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d57cfHciSNLo4y06If6HOJB", "use_v2.1-2.2.1_cc.Toggle_event");
    "use strict";
    cc.Toggle && (cc.Toggle._triggerEventInScript_isChecked = true);
    cc._RF.pop();
  }, {} ],
  vertigo: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2be2a0JaThNBok1imTmFb0u", "vertigo");
    "use strict";
    var EffectType = require("EffectType");
    var vertigo = cc.Class({
      extends: cc.Component,
      properties: {
        dragon: dragonBones.ArmatureDisplay
      },
      start: function start() {
        this.dragon.on(dragonBones.EventObject.COMPLETE, this.onAnimComplete, this);
      },
      onAnimComplete: function onAnimComplete() {
        this.node.active = false;
      },
      playAnimation: function playAnimation() {
        this.dragon.playAnimation("newAnimation", 1);
      },
      closeEffect: function closeEffect() {
        this.node.active = false;
      }
    });
    module.exports = vertigo;
    cc._RF.pop();
  }, {
    EffectType: "EffectType"
  } ],
  zombie_config: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d9802TA5BpH77oRgpCe7ZQS", "zombie_config");
    "use strict";
    var zombie_config = cc.Class({
      extends: cc.Component,
      statics: {
        posList: [ cc.v2(-447, 115), cc.v2(-320, 30), cc.v2(-61, -192), cc.v2(57, -198), cc.v2(270, -10), cc.v2(265, 78), cc.v2(30, 180), cc.v2(-113, 247) ]
      }
    });
    module.exports = zombie_config;
    cc._RF.pop();
  }, {} ],
  zombie_state: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7bc8fxfFpNFvrF4zW5bUG0Q", "zombie_state");
    "use strict";
    var zombie_state = cc.Enum({
      WALK: 0,
      SlOW: 1,
      DIE: 2
    });
    module.exports = zombie_state;
    cc._RF.pop();
  }, {} ],
  zombie: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "59dcdBP/AFIEL6J8Hqo3kch", "zombie");
    "use strict";
    var _cc$Class;
    var zState = require("zombie_state");
    var zConfig = require("zombie_config");
    var MyEnum = require("MyEnum");
    var bigDecimal = require("js-big-decimal");
    var EffectType = require("EffectType");
    var DragonType = require("DragonType");
    var attackEffect = require("attackEffect");
    var vertigoEffect = require("vertigo");
    var zombie = cc.Class((_cc$Class = {
      extends: cc.Component,
      properties: {
        id: 1,
        hp: 100,
        money: 100,
        spd: .5,
        prefab: "",
        gender: "",
        dragon: dragonBones.ArmatureDisplay,
        dragonParent: cc.Node,
        state: {
          default: zState.WALK,
          type: zState
        },
        posIndex: 0,
        hpBar: cc.ProgressBar,
        slowState: false,
        vertigoState: false,
        attackEffect: attackEffect,
        vertigoEffect: vertigoEffect,
        hasDie: false
      },
      start: function start() {},
      showComing: function showComing() {
        this.dragonParent.setScale(2);
        this.hpBar.node.active = false;
        this.vertigoEffect.node.active = false;
        this.attackEffect.node.active = false;
      },
      init: function init(data, scale, _shadow) {
        void 0 === scale && (scale = .9);
        this.hasDie = false;
        this.attackEffect.node.active = false;
        this.vertigoEffect.node.active = false;
        this.id = data.id;
        this.node.scaleX = 1;
        this.dragonParent.setScale(scale);
        this.hpBar.node.y = this.dragonParent.height * scale;
        this.vertigoEffect.node.y = this.dragonParent.height * scale - this.vertigoEffect.node.height / 2;
        this.totalHp = data.hp;
        this.hp = data.hp;
        this.spd = data.spd;
        if (!this.shadow && _shadow) {
          this.shadow = _shadow;
          _shadow.parent = this.node;
          _shadow.zIndex = -1;
          _shadow.y += _shadow.height / 2;
        }
        this.shadow.setScale(scale);
        this.isSetZIndex = false;
        this.isSetZIndex_2 = false;
        this.isInList = false;
        this.spd = cc.Mgr.Config.cgZombieData.spd;
        this.money = data.money * BigInt(4) / BigInt(5);
        this.prefab = data.prefab;
        this.posIndex = 0;
        this.node.position = zConfig.posList[this.posIndex];
        this.hpBar.progress = 1;
        this.dragon.timeScale = 1;
        this.slowState = false;
        this.vertigoState = false;
        this.hexToColor("#ffffff");
        this.hpBar.node.getChildByName("bar").height = 15;
        this.attackEffect.node.scaleX = 1;
        this.vertigoEffect.node.scaleX = 1;
        this.hpBar.node.scaleX = 1;
        this.spdStep_3_Ratio = 1;
      },
      getHitPosition: function getHitPosition() {
        return cc.v2(this.node.x, this.node.y + this.attackEffect.node.y);
      }
    }, _cc$Class["start"] = function start() {
      cc.Mgr.DragonMgr.create(DragonType.Zombie, this.dragon);
    }, _cc$Class.pause = function pause() {
      this.node.pauseAllActions();
    }, _cc$Class.resume = function resume() {
      this.node.resumeAllActions();
    }, _cc$Class.moveToNextPos = function moveToNextPos() {
      if (true == cc.Mgr.GameCenterCtrl.pauseFight) return;
      this.node.stopAllActions();
      if (!this.hasDie && this.posIndex == zConfig.posList.length - 1) {
        cc.Mgr.ZombieMgr.zombieEscape();
        this.node.stopAllActions();
        this.unschedule(this.vertigoCallBack);
        this.unschedule(this.slowMoveCallBack);
        cc.Mgr.ZombieMgr.backToPool(this.node, this.id);
        return;
      }
      if (this.posIndex > 0 && false == this.isInList) {
        cc.Mgr.ZombieMgr.zombieList.push(this.node);
        this.isInList = true;
      }
      if (this.posIndex > 1 && false === this.isSetZIndex) {
        this.node.zIndex = cc.Mgr.ZombieMgr.moveZIndex;
        cc.Mgr.ZombieMgr.moveZIndex++;
        this.isSetZIndex = true;
      }
      if (this.posIndex > 4 && false === this.isSetZIndex_2) {
        this.node.zIndex = cc.Mgr.ZombieMgr.moveZIndex_2;
        cc.Mgr.ZombieMgr.moveZIndex_2++;
        this.isSetZIndex_2 = true;
      }
      var spdRatio = 4 === this.posIndex ? .5 : 1;
      this.slowState && (spdRatio = 4 === this.posIndex ? .25 : .5);
      this.vertigoState ? spdRatio = .001 : spdRatio *= .6;
      var pDis = cc.Mgr.Utils.pDistance(this.node.position, zConfig.posList[this.posIndex + 1]);
      var durTime = pDis / (this.spd * cc.Mgr.game.zombieSpeedCoefficient * spdRatio * this.spdStep_3_Ratio);
      var action = cc.moveTo(durTime, zConfig.posList[this.posIndex + 1]);
      var seq = cc.sequence(action, cc.callFunc(function() {
        this.posIndex += 1;
        if (this.posIndex < zConfig.posList.length) {
          if (4 == this.posIndex) {
            this.node.scaleX = -1 * this.node.scaleX;
            this.attackEffect.node.scaleX = -1;
            this.vertigoEffect.node.scaleX = -1;
            this.hpBar.node.scaleX = -1;
            var pDis = cc.Mgr.Utils.pDistance(this.node.position, zConfig.posList[this.posIndex + 1]);
            var durTime = pDis / (this.spd * cc.Mgr.game.zombieSpeedCoefficient);
            var dt = 40 / (this.spd * cc.Mgr.game.zombieSpeedCoefficient);
            this.spdStep_3_Ratio = pDis / (durTime - dt) / (this.spd * cc.Mgr.game.zombieSpeedCoefficient);
          } else this.spdStep_3_Ratio = 1;
          this.moveToNextPos();
        } else if (!this.hasDie) {
          cc.Mgr.ZombieMgr.zombieEscape();
          this.node.stopAllActions();
          this.unschedule(this.vertigoCallBack);
          this.unschedule(this.slowMoveCallBack);
          cc.Mgr.ZombieMgr.backToPool(this.node, this.id);
        }
      }, this));
      this.node.runAction(seq);
      if (6 === this.posIndex) {
        var index = cc.Mgr.ZombieMgr.zombieList.indexOf(this.node);
        index >= 0 && cc.Mgr.ZombieMgr.zombieList.splice(index, 1);
      }
    }, _cc$Class.hexToColor = function hexToColor(hex) {
      this.dragon.node.color = cc.Mgr.Utils.hexToColor(hex);
    }, _cc$Class.slowMoveCallBack = function slowMoveCallBack() {
      this.slowState = false;
      this.dragon.timeScale = 1;
      this.moveToNextPos();
      this.hexToColor("#ffffff");
    }, _cc$Class.slowMove = function slowMove() {
      if (this.slowState || this.vertigoState) return;
      this.unschedule(this.vertigoCallBack);
      this.unschedule(this.slowMoveCallBack);
      this.slowState = true;
      this.dragon.timeScale = .5;
      this.moveToNextPos();
      this.hexToColor("#78C7CA");
      this.scheduleOnce(this.slowMoveCallBack, 1);
    }, _cc$Class.vertigoCallBack = function vertigoCallBack() {
      this.vertigoEffect.closeEffect();
      this.vertigoState = false;
      this.dragon.timeScale = 1;
      this.moveToNextPos();
      this.hexToColor("#ffffff");
    }, _cc$Class.vertigo = function vertigo() {
      if (this.slowState || this.vertigoState) return;
      this.unschedule(this.vertigoCallBack);
      this.unschedule(this.slowMoveCallBack);
      this.vertigoState = true;
      this.playVertigoEffect();
      this.dragon.timeScale = .001;
      this.moveToNextPos();
      this.hexToColor("#009EEC");
      this.scheduleOnce(this.vertigoCallBack, 1);
    }, _cc$Class.beAttack = function beAttack(sc) {
      this.hp -= sc.power;
      this.playAttackExploreEffect();
      cc.Mgr.AudioMgr.playSFX(MyEnum.AudioType.hit);
      if (this.hp > BigInt(0)) switch (sc.bulletSkill) {
       case MyEnum.BulletSkillType.Slow:
        cc.Mgr.AudioMgr.playSFX(MyEnum.AudioType.skill_slow);
        this.slowMove();
        break;

       case MyEnum.BulletSkillType.DouKill:
        cc.Mgr.AudioMgr.playSFX(MyEnum.AudioType.skill_crit);
        this.playCrickEffect();
        this.hp -= sc.power;
        break;

       case MyEnum.BulletSkillType.Vertigo:
        cc.Mgr.AudioMgr.playSFX(MyEnum.AudioType.skill_freeze);
        this.vertigo();
      }
      if (!this.hasDie) if (this.hp <= BigInt(0)) {
        this.hasDie = true;
        this.hpBar.progress = 0;
        this.node.stopAllActions();
        this.playDieSmokeEffect();
        this.unschedule(this.vertigoCallBack);
        this.unschedule(this.slowMoveCallBack);
        cc.Mgr.ZombieMgr.backToPool(this.node, this.id, this.hp);
        var index = cc.Mgr.ZombieMgr.zombieList.indexOf(this.node);
        index >= 0 && cc.Mgr.ZombieMgr.zombieList.splice(index, 1);
      } else this.hpBar.progress = bigDecimal.divide(this.hp.toString(), this.totalHp.toString(), 2);
    }, _cc$Class.playCoinFlyEffect = function playCoinFlyEffect() {
      var obj = cc.Mgr.EffectMgr.getObFromPool(EffectType.CoinFly);
      if (null == obj) return;
      obj.parent = cc.Mgr.ZombieMgr.zombiesParent;
      obj.active = true;
      obj.zIndex = 999;
      obj.y = this.node.y + this.node.height;
      obj.x = this.node.x;
      var money = this.money;
      if (true == cc.Mgr.game.doubleCoinState) {
        money *= BigInt(3);
        this.scheduleOnce(this.flyCoinEffect, .35);
      }
      this.flyMoney = money;
      var money2 = cc.Mgr.Utils.getNumStr2(this.flyMoney);
      obj.getComponent("coinFly").setData(money2);
      obj.scale = 1;
      cc.Mgr.game.money += money;
      cc.Mgr.game.coin_gained_total += money;
      cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "money");
      cc.tween(obj).to(.1, {
        position: cc.v2(this.node.x, this.node.y + this.node.height + 30),
        scale: .8
      }).to(.5, {
        position: cc.v2(this.node.x, this.node.y + this.node.height + 30 + 10)
      }).call(function() {
        cc.Mgr.EffectMgr.ObBackToPool(obj, EffectType.CoinFly);
      }).start();
    }, _cc$Class.flyCoinEffect = function flyCoinEffect() {
      var obj = cc.Mgr.EffectMgr.getObFromPool(EffectType.CoinFly);
      if (null == obj) return;
      obj.parent = cc.Mgr.ZombieMgr.zombiesParent;
      obj.active = true;
      obj.zIndex = 101;
      obj.y = this.node.y + this.node.height;
      obj.x = this.node.x;
      var money = this.flyMoney;
      var money2 = cc.Mgr.Utils.getNumStr2(money);
      obj.getComponent("coinFly").setData(money2);
      obj.scale = 1;
      cc.tween(obj).to(.1, {
        position: cc.v2(this.node.x, this.node.y + this.node.height + 30),
        scale: .8
      }).to(.5, {
        position: cc.v2(this.node.x, this.node.y + this.node.height + 30 + 10)
      }).call(function() {
        cc.Mgr.EffectMgr.ObBackToPool(obj, EffectType.CoinFly);
      }).start();
    }, _cc$Class.playCrickEffect = function playCrickEffect() {
      var obj = cc.Mgr.EffectMgr.getObFromPool(EffectType.Crick);
      obj.active = true;
      if (null == obj) return;
      obj.parent = cc.Mgr.ZombieMgr.zombiesParent;
      obj.zIndex = 101;
      obj.y = this.node.y + this.node.height / 2 - 10;
      obj.x = this.node.x;
      obj.scale = .7;
      obj.opacity = 255;
      cc.tween(obj).to(.6, {
        position: cc.v2(this.node.x, this.node.y + this.node.height)
      }).call(function() {
        cc.Mgr.EffectMgr.ObBackToPool(obj, EffectType.Crick);
      }).start();
    }, _cc$Class.playAttackExploreEffect = function playAttackExploreEffect() {
      this.attackEffect.node.active = true;
      this.attackEffect.playAnimation();
    }, _cc$Class.playDieSmokeEffect = function playDieSmokeEffect() {
      var obj = cc.Mgr.EffectMgr.getObFromPool(EffectType.DieSmoke);
      obj.active = true;
      if (null == obj) return;
      obj.parent = cc.Mgr.ZombieMgr.zombiesParent;
      obj.y = this.node.y + this.node.height / 2;
      obj.x = this.node.x;
      var self = this;
      obj.getComponent("dieSmoke").playAnimation(function() {
        self.playCoinFlyEffect();
      });
    }, _cc$Class.playVertigoEffect = function playVertigoEffect() {
      this.vertigoEffect.node.active = true;
      this.vertigoEffect.playAnimation();
    }, _cc$Class));
    module.exports = zombie;
    cc._RF.pop();
  }, {
    DragonType: "DragonType",
    EffectType: "EffectType",
    MyEnum: "MyEnum",
    attackEffect: "attackEffect",
    "js-big-decimal": "js-big-decimal",
    vertigo: "vertigo",
    zombie_config: "zombie_config",
    zombie_state: "zombie_state"
  } ]
}, {}, [ "use_v2.1-2.2.1_cc.Toggle_event", "Admob", "Analytics", "BlurMask", "Cloud", "FontManager", "LanguageItem", "LanguageSelector", "LimitClick", "MySprite", "SButton", "ScrollLabel", "SwitchFont", "WaterfallFlow", "js-big-decimal", "DB_achievementAwards", "DB_airdrop", "DB_buyButton", "DB_droneRewards", "DB_i18n", "DB_invite", "DB_level", "DB_levelupGem", "DB_plant", "DB_plantName", "DB_shopSort", "DB_spinLevel", "DB_turntable", "db_zombie", "AchieveType", "AudioMgr", "Config", "AchieveData", "AchieveMapMgr", "AirDropData", "AirDropMapMgr", "BuyButtonData", "BuyButtonMapMgr", "DroneData", "DroneMapMgr", "GoodMapDecoder", "GoodsData", "InviteData", "InviteMapMgr", "LevelData", "LevelMapMgr", "LvUpGemData", "LvUpGemMapMgr", "MapDataMgr", "PlantData", "PlantMapMgr", "ShopData", "ShopMapMgr", "SpinLvData", "SpinLvMapMgr", "TransData", "TransMapMgr", "TurnTableData", "TurnTableMapMgr", "ZombieData", "ZombieMapMgr", "DataType", "Event", "GlobalEvent", "HttpUtils", "MissionType", "MyEnum", "NoticeText", "SceneAdapter", "TurnTableGetType", "UserDataMgr", "Utils", "achieveMissonData", "AtlasMgr", "AtlasType", "DragonMgr", "DragonType", "GameCenterCtrl", "ParticleMgr", "BulletPool", "BulletType", "bullet", "EffectMgr", "EffectType", "UnlockTip", "angryEffect", "attackEffect", "coinFly", "dieSmoke", "flowerPotOpen", "plantMerge", "tipMoveAttack", "vertigo", "game", "Notification", "flowerPot", "flowerPotManage", "lockGird", "plant", "plantManage", "ZomBieMgr", "zombie", "zombie_config", "zombie_state", "InviteManager", "Payment", "AdsBlocker", "AppStart", "BuffUI", "CoinBundle", "Compensation", "EnjoyNature", "FirstUI", "Guides", "InGameUI", "MaxLevel", "NumEffect", "NumberCol", "OfflineBundle", "PauseUI", "PaymentUI", "PlantMergeGuide", "RankingItem", "RankingUI", "RemoveAdBundle", "SpecialGridBundle", "StarterBundle", "UIMgr", "UnlockAllBundle", "UpdateAvailable", "Vip", "achieveItem", "angryUI", "assetGetUI", "bigResult", "bossComing", "coinBonus", "jinbi", "jinbiCtrl", "doubleCoinUI", "exchangeCoinUI", "jinggai", "missionItem", "missionUI", "newRecordUI", "noticeUI", "offlineAssetUI", "plantGetUI", "promptUI", "rewardBox", "setPanel", "shareUI", "shopItem", "signItem", "signUI", "smallResult", "turnArrow", "turnTableUI", "uav", "uavUI", "uiConfig", "uiItemMgr" ]);