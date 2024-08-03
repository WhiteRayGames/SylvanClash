//是否完成过管理工具的初始化
cc.director.initMgr = false;
//初始化管理类
function initMgr(){
    var isDevelop = true;
    if (!isDevelop) {
        console.log = function () { };
        console.error = function () { };
        cc.log = function () { };
        cc.error = function () { }
    }

    // console.log("模块初始化开始");
    
    cc.Mgr.Parse = false;
    cc.Mgr.preLoadingScene = false;
    cc.Mgr.initData = false;
    
    cc.Mgr.Event = require("Event");
    cc.Mgr.Utils = require("Utils");
    cc.Mgr.Utils.init();
    cc.Mgr.Config = require("Config");
    cc.Mgr.Config.init();

    let HttpUtils = require("HttpUtils");
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
        container:cc.Node
    },

    onLoad:function () {
        // tempory code
        // cc.sys.localStorage.clear();

        cc.director.GlobalEvent.clear();
        
        cc.Mgr = {};

        window.onChangeScreen = this.onChangeScreenCallback.bind(this);

        window.onResizeScreen = this.onResizeScreenCallback.bind(this);

        cc.game.setFrameRate(55);
    },

    onChangeScreenCallback () {

    },

    onResizeScreenCallback () {
        cc.Mgr.AudioMgr.stopAll();
        cc.game.restart();
        window.onResizeScreen = null;
    },

    start () {
        cc.Mgr.app = this;

        initMgr();

        this.canvas = this.node.getComponent(cc.Canvas);

        let size = cc.view.getVisibleSizeInPixel();
        let ratio = size.width / size.height;
        cc.log("ratio: " + ratio);
        cc.Mgr.game.ratioOffsetY = 0;
        if (ratio > 0.6) {
            cc.Mgr.game.isPad = true;
            cc.Mgr.game.ratioOffsetX = (ratio - 0.6) * 640;
            // this.canvas.fitHeight = true;
            // this.canvas.fitWidth = true;
        } else {
            if (ratio < 0.56) {
                cc.Mgr.game.ratioOffsetY = (0.56 - ratio) * 1136;
            }
            cc.Mgr.game.isPad = false;
            // this.canvas.fitHeight = false;
            // this.canvas.fitWidth = true;
        }  
    }

    /*
    update(dt)
    {
        
    },
    */
});
