var DataType = require("DataType");
var Event = require("Event");
var AtlasType = require("AtlasType");
var MySprite = require("MySprite");
var MyEnum = require("MyEnum");
var uav = require("uav");
var InGameUI = cc.Class({
    extends: cc.Component,

    properties: {
        curLvLbl:cc.Label,
        waveCountLbl:cc.Label,

        coinNumLbl:cc.Label,
        diamondNumLbl:cc.Label,

        coinNumEffect: cc.Node,
        gemNumEffect: cc.Node,

        coinSpriteNode:cc.Node,
        gemSpriteNode:cc.Node,

        topNode:cc.Node,

        buyCostLbl:cc.Label,

        plantHead:MySprite,

        buffTip:cc.Node,

        doubleCoinTimeLbl:cc.Label,
        doubleCoinNode:cc.Node,
        doubleCoinLabel: cc.Node,

        uav:uav,

        buyButtonNode:cc.Node,

        missionTip:cc.Node,

        turntableTip:cc.Node,

        signTip:cc.Node,

        tipBuyTimesNode:cc.Node,

        shopTip:cc.Node,

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

        showTipList: [cc.Node],
        showTipLabelList: [cc.Label],

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

    showBtnTip () {
        let index = cc.Mgr.game.btnTipList.indexOf(0);
        if (index < 0) return;
        for (let i = 0; i < cc.Mgr.game.btnTipList.length; i++) {
            if (cc.Mgr.game.btnTipList[i] == 0) {
                this.showTipList[i].active = true;
                break;
            }
        }
    },

    zoomIn () {
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
            
            setTimeout (() => {
                this.showBtnTip();
            }, 500);
            let index = cc.Mgr.game.btnTipList.indexOf(0);
            if (index < 0) this.unschedule(this.loopBtnTip);
        }
    },

    zoomOut () {
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

    start(){
        this.showCount = 0;
        this.zoomInBtn.active = !cc.Mgr.game.isZoomIn;
        this.zoomOutBtn.active = cc.Mgr.game.isZoomIn;

        this.limitClick = this.node.getComponent('LimitClick')

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

        cc.director.GlobalEvent.on(Event.checkMissionAndAchieve, function(data){
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

         if (cc.Mgr.game.isPad === true) {
            this.leftNode.removeComponent(cc.Widget);
            this.rightNode.removeComponent(cc.Widget);
            this.doubleCoinNode.removeComponent(cc.Widget);
            this.coinBonusNode.removeComponent(cc.Widget);
            this.pauseBtnNode.removeComponent(cc.Widget);
            this.leftNode.x = -40 - cc.Mgr.game.ratioOffsetX;
            if (this.leftNode.x < -150) this.leftNode.x = -150;
            this.rightNode.x = 240 + cc.Mgr.game.ratioOffsetX;
            if (this.rightNode.x > 350) this.rightNode.x = 350;
            this.doubleCoinNode.x = -245 - cc.Mgr.game.ratioOffsetX;
            if (this.doubleCoinNode.x < -350) this.doubleCoinNode.x = -350;
            this.coinBonusNode.x = 370 + cc.Mgr.game.ratioOffsetX;
            if (this.coinBonusNode.x > 500) this.coinBonusNode.x = 500;
            this.coinsNGemsNode.x = 350 + cc.Mgr.game.ratioOffsetX;
            if (this.coinsNGemsNode.x > 500) this.coinsNGemsNode.x = 500;
            this.pauseBtnNode.x = 370 + cc.Mgr.game.ratioOffsetX;
            if (this.pauseBtnNode.x > 500) this.pauseBtnNode.x = 500;
            this.shopBtn.removeComponent(cc.Widget);
            this.shopBtn.x = cc.view.getVisibleSizeInPixel().width;
            if (this.shopBtn.x >= 425) this.shopBtn.x = 425;

            // this.buffBtn.x = -223 - cc.Mgr.game.ratioOffsetX;
            // if (this.buffBtn.x < -350) this.buffBtn.x = -350;
         }

         if (cc.Mgr.GameCenterCtrl.isIphoneX === true) {
             this.topNode.getComponent(cc.Widget).top -= 30;
         }

         this.whiteColor = new cc.Color(255, 255, 255);
         this.greenColor = new cc.Color(59, 218, 52);

        this.gemBtn.active = true;
        this.gemBtn_2.active = false;
    },

    onClickVIP () {
        cc.Mgr.UIMgr.openSpecialGridBundle();
        return;

        if (this.showVipIconEffect && cc.Mgr.game.showStarterBundleEffectFlag) {
            this.showVipIconEffect = false;
            this.vipIcon.active = true;
            this.vipNode.getComponent(cc.Button).target = this.vipIcon;
            this.vipEffect.active = false;
        }
        cc.Mgr.UIMgr.openVipUI();
    },

    showTipBuyTimesNode:function(needShow = false){
        if (this.tipBuyTimesNode.active == needShow) return;
        this.tipBuyTimesNode.active = needShow;
        if(!needShow) cc.Mgr.game.tipBuyTimes = 5;
        if (!needShow) {
            if (cc.Mgr.plantMgr.otherTipCount > 0) {
                this.schedule(this.loopBtnTip, 30);
            } else {
                setTimeout(() => {
                    this.showBtnTip();
                }, 60000)
            }
        }
    },

    loopBtnTip () {
        if (cc.Mgr.plantMgr.otherTipCount <= 0) {
            this.showBtnTip();
        }
    },

    caculateShopHasAds:function(){
        if(cc.Mgr.game.plantMaxLv <= 4)
        {
            return false;
        }
        
        var shopSortDt = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.ShopData, cc.Mgr.game.plantMaxLv);
        for (var i = 0; i < 9; i++) {
            var cond = "";
            switch(i)
            { 
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
                    break;
            }
            if(cond == MyEnum.ShopItemType.Ads && (cc.Mgr.Utils.GetSysTime() - cc.Mgr.game.lastAdsGetPlantTime) >= 60)
            {
                return true;
            }
        }
        return false;
    },

    checkShopTipState:function(){
        if(this.caculateShopHasAds())
            this.shopTip.opacity = 255;
        else
            this.shopTip.opacity = 0;
    },

    checkTurnTableLeftTime:function(){
        if (cc.Mgr.game.spinADTimeCount === 0) return;
        
        if(cc.Mgr.game.spinADTimeCount <= cc.Mgr.Utils.GetSysTime()) {
            cc.Mgr.game.freeFlag.TurnTable = true;
            cc.Mgr.game.spinADTimeCount = 0;
            cc.Mgr.game.spinADResetTime = 0;
        }
    },

    showUav:function(){
        this.uav.node.active = true;
        this.uav.show();
    },

    closeUav:function(){
        if(this.uav.node.active == true)
            this.uav.uavOutScreen();
    },

    unscheduleShowUav:function(){
        this.unschedule(this.showUav);
    },

    showUavNextTime:function(dt){
        // tempory code
        if(cc.Mgr.game.plantMaxLv < 5)
            return;

        this.scheduleOnce(this.showUav, dt);
    },

    subDoubleCoin:function(){
        if(cc.Mgr.game.doubleCoinLeftTime <= 0)
        {
            cc.Mgr.game.doubleCoinState = false;
            this.unschedule(this.subDoubleCoin);
            return;
        }
        cc.Mgr.game.doubleCoinLeftTime -= 1;
        this.doubleCoinTimeLbl.string = cc.Mgr.Utils.FormatNumToTime(cc.Mgr.game.doubleCoinLeftTime,true);
        this.doubleCoinTimeLbl.node.active = true;
        this.doubleCoinLabel.active = false;
        if(cc.Mgr.game.doubleCoinLeftTime <= 0)
        {
            this.doubleCoinTimeLbl.node.active = false;
            this.doubleCoinLabel.active = true;
            cc.Mgr.game.doubleCoinState = false;
            this.showDoubleCoinBtn(false);
            this.unschedule(this.subDoubleCoin);
            cc.Mgr.game.doubleBtnIntervalTime = 300;
            this.startCaculateIntervalDou();
        }
    },

    startDoubleCoinState:function(){
        // this.doubleCoinDragon.playAnimation("jihuo", -1);
        cc.Mgr.game.doubleCoinLeftTime = 100;
        cc.Mgr.game.doubleCoinState = true;
        this.schedule(this.subDoubleCoin, 1, 100, 0.1);
    },

    adsDoubleCoin:function(){
        if(cc.Mgr.game.doubleCoinLeftTime > 0)
        {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("is-treble-now"), "", this.node);
            return;
        }
        cc.Mgr.UIMgr.openDoubleCoinUI();
    },

    subIntervalDoubleCoin:function(){
        cc.Mgr.game.doubleBtnIntervalTime -= 1;

        if(cc.Mgr.game.doubleBtnIntervalTime <= 0)
        {
            this.unschedule(this.subIntervalDoubleCoin);
            this.showDoubleCoinBtn(true);
        }
    },

    startCaculateIntervalDou:function(){
        var intervarl = cc.Mgr.game.doubleBtnIntervalTime;
        this.schedule(this.subIntervalDoubleCoin, 1, intervarl, 0.1);
    },

    updateDoubleCoinBtn () {
        this.checkAvailabelAds = cc.Mgr.admob.checkAvailableRewardedAd();
        if (this.checkAvailabelAds == false) this.showDoubleCoinBtn(false);
    },

    showDoubleCoinBtn:function(toShow)
    {
        toShow = cc.Mgr.admob.checkAvailableRewardedAd() && toShow;
        // tempory code
        if(cc.Mgr.game.doubleCoinLeftTime <= 0) {
            this.doubleCoinTimeLbl.node.active = false;
            this.doubleCoinLabel.active = true;
        } else {
            this.doubleCoinTimeLbl.node.active = true;
            this.doubleCoinLabel.active = false;
        }
        this.doubleCoinNode.active = toShow;

        if (this.hasSetPos === false) {
            let worldPoint_doubleCoinNode = this.doubleCoinNode.convertToWorldSpaceAR(cc.Mgr.plantMgr.rubbishNode.position);
            cc.Mgr.game.localPoint_doubleCoinNode = cc.Mgr.plantMgr.rubbishNode.convertToNodeSpaceAR(worldPoint_doubleCoinNode);
            this.hasSetPos = true;
        }

        // temp code 垃圾桶位置改变
        // if (toShow) {
        //     if (cc.Mgr.game.zoomIn === true) {
        //         cc.Mgr.plantMgr.rubbishNode.y = -150;
        //     } else {
        //         cc.Mgr.plantMgr.rubbishNode.y = -185
        //     }
        // } else {
        //     if (cc.Mgr.game.zoomIn === true) {
        //         cc.Mgr.plantMgr.rubbishNode.y = -280;
        //     } else {
        //         cc.Mgr.plantMgr.rubbishNode.y = -335;
        //     }
        // }

        // let currentX;
        // if (cc.Mgr.game.zoomIn === true) {
        //     currentX = cc.Mgr.game.isPad ? (-238 - (cc.Mgr.game.ratioOffsetX * 0.83)) : -253;
        //     if (currentX < -340) currentX = -340;
        //     cc.Mgr.plantMgr.rubbishNode.x = currentX;
        // } else {
        //     currentX = cc.Mgr.game.isPad ? (-268 - (cc.Mgr.game.ratioOffsetX * 0.83)) : -253;
        //     if (currentX < -360) currentX = -360;
        //     cc.Mgr.plantMgr.rubbishNode.x = currentX;
        // }
        //
        // if (currentX < -360) currentX = -160;
        // cc.Mgr.plantMgr.rubbishNode.x = currentX;
    },

    onClickPause () {
        cc.Mgr.UIMgr.openPauseUI();
    },

    showTopNode:function(isShow = true)
    {
        this.topNode.active = isShow;
    },

    showPayment: function() {
        cc.Mgr.UIMgr.openPaymentUI(true);
    },

    showCoinExchange: function() {
        cc.Mgr.UIMgr.openExchangeCoinUI();
    },

    init()
    {
        cc.Mgr.UIMgr.InGameUI = this;

        cc.Mgr.UIMgr.topCoinNode = this.coinNumLbl.node;
        cc.Mgr.UIMgr.topGemNode = this.diamondNumLbl.node;

        this.hasSetPos = false;

         this.scheduleOnce(function(){
            this.RefreshLvData();

            this.checkMissionAchieveTip();

            this.checkShopTipState();
        }, 0.5);

        //具体作用，参照Event注释
        cc.director.GlobalEvent.on(Event.defense,function(){
            this.RefreshLvData();
        },this);

        this.RefreshAssetData(true, "money");
        this.RefreshAssetData(true, "gem");

        this.RefreshBuyButtonAll();

        cc.Mgr.game.resetKeepInGameTime();

        if (cc.Mgr.game.spinADTimeCount !== 0 && cc.Mgr.game.spinADTimeCount < cc.Mgr.Utils.GetSysTime()) {
            cc.Mgr.game.freeFlag.TurnTable = true;
            cc.Mgr.game.spinADTimeCount = 0;
            cc.Mgr.game.spinADResetTime = 0;
        }
        
        this.checkShopTipState();
        this.schedule(function(){
            this.checkTurnTableLeftTime();
            this.checkShopTipState();
            this.checkKeepInGameTime();
            this.checkSignState();
        },1);

        this.airDropShowTime = 0;
        this.airDropFriendIndex = 0;
        this.showUavNextTime(30); // tempory code 30

        if(cc.Mgr.game.doubleBtnIntervalTime > 0)
        {
            this.showDoubleCoinBtn(false);
            this.startCaculateIntervalDou();
        }
        else
        {
            if(cc.Mgr.game.plantMaxLv >= 6) //tempory code 1
                this.showDoubleCoinBtn(true);
            else
                this.showDoubleCoinBtn(false);
        }

        if (!cc.Mgr.game.needGuide) {
            this.schedule(this.loopBtnTip, 30);
        }
    },

    checkKeepInGameTime:function () {
        cc.Mgr.game.keepInGameTime += 1;
        cc.Mgr.game.dailyMissions[4].progress = cc.Mgr.game.keepInGameTime;
        if((cc.Mgr.game.keepInGameTime == 300 && cc.Mgr.game.dailyMissions[4].checklv == 0)|| 
            (cc.Mgr.game.keepInGameTime == 600 && cc.Mgr.game.dailyMissions[4].checklv <= 1) || 
            (cc.Mgr.game.keepInGameTime == 1200 && cc.Mgr.game.dailyMissions[4].claimed == 0))
            this.missionTip.active = true
    },

    checkMissionAchieveTip:function(){
        if(cc.Mgr.game.checkOutAchieveDataIsFinished() || cc.Mgr.game.checkOutMissionIsFinished())
            this.missionTip.active = true;
        else
            this.missionTip.active = false;
    },

    setTopNodeLayer(downNode)
    {
        
        // this.topNode.zIndex = downNode.zIndex+1;
    },

    //刷新资产
    RefreshAssetData:function(_isInit, _type){
        if (_type === "money") {
            var money = cc.Mgr.Utils.getNumStr2(cc.Mgr.game.money);
            this.coinNumEffect.getComponent("NumEffect").setNumber(money, _isInit)
            this.RefreshBuyButtonMergeAll();
        } else {
            var gems = cc.Mgr.Utils.getNumStr(cc.Mgr.game.gems);
            this.gemNumEffect.getComponent("NumEffect").setNumber(gems, _isInit)
        }
    },

    //刷新 等级 波数
    RefreshLvData:function(){
        this.curLvLbl.string = cc.Mgr.game.level;
        var key = cc.Mgr.game.level > 60 ? (cc.Mgr.game.level % 60) + "_" + cc.Mgr.game.curBoshu : cc.Mgr.game.level + "_" + cc.Mgr.game.curBoshu;
        var lvData = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.LevelData, key);
        this.waveCountLbl.string = cc.Mgr.game.curBoshu +"/"+lvData.waveCount;
    },

    RefreshBuyButtonAll:function(){
        var param = this.caculateBuyPlantPrice();
        if(param.needRefresh)
            this.RefreshBuyButton(param.interactable);
    },

    RefreshBuyButtonMergeAll:function(){
        var param = this.caculateBuyPlantPrice(true);
        if(param.needRefresh)
            this.RefreshBuyButton(param.interactable);
    },

    buyButton()
    {
        // if (this.limitClick.clickTime() == false) {
        //     return
        // }
        if(cc.Mgr.game.needGuide)
        {
            //防止引导时候连续点击做控制
            cc.Mgr.AudioMgr.playSFX(MyEnum.AudioType.click);
            return;
        }

        this.showTipBuyTimesNode(false);

        if(!cc.Mgr.plantMgr.checkHasAnySpaceGird())
        {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("NoSpaceForPlant"), "", this.node);
            return;
        }
        
        /*var buyData = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.BuyButtonData,cc.Mgr.game.plantMaxLv);
        var plantId = buyData.button;*/

        var plantData = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData, cc.Mgr.game.canBuyPlantId);

        var buyNum = cc.Mgr.game.plantBuyRecord[cc.Mgr.game.canBuyPlantId];
        buyNum = buyNum ? buyNum : 0;
       
        var price = 0;
        if(cc.Mgr.game.canBuyPlantId >=1 &&  cc.Mgr.game.canBuyPlantId <=20)
        {
            price = plantData.price * BigInt(Math.floor(Math.pow(1 + 0.1, buyNum)));
        }
        else
        {
            price = plantData.price * BigInt(Math.floor(Math.pow(1 + 0.2, buyNum)));
        }
        
        if(cc.Mgr.game.money >= price)
        {
            cc.director.GlobalEvent.emit(Event.BuyPlant,{"money":price});
            this.RefreshBuyButtonAll();
        }
        else
        {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("NoCoins"), "coin", this.node);
            if (cc.Mgr.game.plantMaxLv >= cc.Mgr.game.exchangeCoinConfig.openLevel) cc.Mgr.game.needShowExchangeCoinCount++;
            if (cc.Mgr.game.needShowExchangeCoinCount >= 3 && cc.Mgr.game.plantMaxLv >= cc.Mgr.game.exchangeCoinConfig.openLevel) {
                let exchangeGemNum = cc.Mgr.UIMgr.gemNum();
                if (cc.Mgr.game.currentExchangeCount < cc.Mgr.game.exchangeCoinConfig.maxExchangeNum && cc.Mgr.game.gems >= exchangeGemNum) {
                    cc.Mgr.UIMgr.openExchangeCoinUI(true);
                } else {
                    if (cc.Mgr.game.level > 1 && this.showCount >= 3) {
                        // let coinNumber = cc.Mgr.UIMgr.getCoinNumber() * BigInt(30);
                        // coinNumber = coinNumber < BigInt(1000000) ? BigInt(1000000) : coinNumber;
                        // coinNumber = coinNumber * BigInt(2);
                        // cc.Mgr.UIMgr.openCoinBundle(coinNumber, true, true);
                        this.showCount = 0;
                    } else {
                        this.showCount++;
                    }
                }
                
                cc.Mgr.game.needShowExchangeCoinCount = 0;
            }
            this.buyBtnInteractable = false;
            this.spriteBtn.setMaterial(0, this.grayM);
        }
    },

    //刷新 底部按钮信息
    RefreshBuyButton:function(interactable = false) {
        this.buyBtnInteractable = interactable;
        if (interactable) {
            this.spriteBtn.setMaterial(0, this.nomarlM);
        } else {
            this.spriteBtn.setMaterial(0, this.grayM);
        }
    },

    caculateCanBuyPlant:function(){
        if(cc.Mgr.game.plantMaxLv <= 5)
            return (cc.Mgr.game.plantMaxLv-2)>=1?(cc.Mgr.game.plantMaxLv-2):1;
        var shopSortDt = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.ShopData, cc.Mgr.game.plantMaxLv);
        var index = 0;
        for(var key in shopSortDt) {
            var dt = shopSortDt[key];
            if(dt == MyEnum.ShopItemType.Money || dt == MyEnum.ShopItemType.Ads)
            {
                return (cc.Mgr.game.plantMaxLv-index + 1);
            }
            index += 1;
        }
        return (cc.Mgr.game.plantMaxLv-2);
    },

    pickCanBuyPlantData:function(forSub = false){
        var maxPlantId = this.caculateCanBuyPlant();
        var outList = [];
        if(cc.Mgr.game.plantMaxLv <= 5)
        {
            for (var i = 1; i <= maxPlantId; i++) {
                outList.push(i);
            }
        }
        else
        {
            var limit = 3;
            for (var i = 0; i <= 3; i++) {
                if(maxPlantId-i == 1)
                {
                    limit = i;
                    break;
                }
            }
            for (var i = maxPlantId-limit; i <= maxPlantId; i++) {
                outList.push(i);
            }
        }
        var param = {};
        param.plantId = outList[0];
        var data = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData,outList[0]);
        param.plantData = data;
        param.price = data.price;
        param.hasOne = true;
        if(forSub)
        {
            for (var i = outList.length - 1; i >= 0; i--) {
                if(cc.Mgr.game.canBuyPlantId == outList[i])
                {
                    var plantData = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData,outList[i]);
                    var buyNum = cc.Mgr.game.plantBuyRecord[outList[i]];
                    var price = cc.Mgr.game.caculatePlantPrice(outList[i], buyNum);
                    param.plantId = cc.Mgr.game.canBuyPlantId;
                    param.price = price;
                    if(cc.Mgr.game.money < price)
                        param.hasOne = false;
                    param.plantData = plantData;
                    return param;
                }
            }

            for (var i = outList.length - 1; i >= 0; i--) {
                var plantData = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData,outList[i]);
                var buyNum = cc.Mgr.game.plantBuyRecord[outList[i]];
                var price = cc.Mgr.game.caculatePlantPrice(outList[i], buyNum);
                if(outList[i] == 1 || i == 0)
                {
                    if(cc.Mgr.game.money > price)
                    {
                        param.plantId = outList[i];
                        param.price = price;
                        param.hasOne = true;
                        param.plantData = plantData;
                        return param;
                    }
                    else
                    {
                        param.plantId = outList[i];
                        param.price = price;
                        param.hasOne = false;
                        param.plantData = plantData;
                        return param;
                    }
                }
                else
                {
                    if(cc.Mgr.game.money > price)
                    {
                        param.plantId = outList[i];
                        param.price = price;
                        param.hasOne = true;
                        param.plantData = plantData;
                        return param;
                    }
                }
            }
        }
        else
        {
            for (var i = outList.length - 1; i >= 0; i--) {
                var plantData = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData,outList[i]);
                var buyNum = cc.Mgr.game.plantBuyRecord[outList[i]];
                var price = cc.Mgr.game.caculatePlantPrice(outList[i], buyNum);
                if(outList[i] == 1 || i == 0)
                {
                    if(cc.Mgr.game.money > price)
                    {
                        param.plantId = outList[i];
                        param.price = price;
                        param.hasOne = true;
                        param.plantData = plantData;
                        return param;
                    }
                    else
                    {
                        param.plantId = outList[i];
                        param.price = price;
                        param.hasOne = false;
                        param.plantData = plantData;
                        return param;
                    }
                }
                else
                {
                    if(cc.Mgr.game.money > price)
                    {
                        param.plantId = outList[i];
                        param.price = price;
                        param.hasOne = true;
                        param.plantData = plantData;
                        return param;
                    }
                }
            }
        }
        return param;
    },

    caculateBuyPlantPrice:function(forSub = false){
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
        if(this.buyBtnInteractable && !outdata.hasOne)
        {
            param.needRefresh = true;
            param.interactable = false;
        }
        else if(!this.buyBtnInteractable && outdata.hasOne)
        {
            param.needRefresh = true;
            param.interactable = true;
        }
        return param;
    },

    openMissionUI:function(){
        cc.Mgr.UIMgr.openMissionUI();
        if (!cc.Mgr.game.needGuide) {
            cc.Mgr.game.btnTipList[1] = 1;
            this.showTipList[1].active = false;
            
            setTimeout (() => {
                this.showBtnTip();
            }, 500);
            let index = cc.Mgr.game.btnTipList.indexOf(0);
            if (index < 0) this.unschedule(this.loopBtnTip);
        }
    },

    openStarterBundle: function () {
        if (this.showStarterBundleEffect && cc.Mgr.game.showStarterBundleEffectFlag) {
            this.showStarterBundleEffect = false;
            this.starterBundleEffect.active = false;
            this.starterBundleBg.active = true;
            this.starterBundleNode.getComponent(cc.Button).target = this.starterBundleBg;
        }
        cc.Mgr.UIMgr.openStarterBundle();
    },

    openSignUI:function(){
        // if (cc.Mgr.game.plantMaxLv >= 25) {
        //     cc.Mgr.admob.showInterstitial("sign", () => {
        //         cc.Mgr.UIMgr.openSignUI();
        //     });
        // } else {
        //     cc.Mgr.UIMgr.openSignUI();
        // }
        cc.Mgr.UIMgr.openSignUI();
        
        if (!cc.Mgr.game.needGuide) {
            cc.Mgr.game.btnTipList[0] = 1;
            this.showTipList[0].active = false;
            
            setTimeout (() => {
                this.showBtnTip();
            }, 500);       
            let index = cc.Mgr.game.btnTipList.indexOf(0);
            if (index < 0) this.unschedule(this.loopBtnTip);     
        }
    },

    openBuffUI() {
        cc.Mgr.UIMgr.openBuffUI();
    },

    openSetUI:function(){
        // jsb.reflection.callStaticMethod("AdmobManager", "preloadInterstitial_mopub");
        // cc.Mgr.admob.preloadInterstitial_mopub();
        cc.Mgr.UIMgr.openSetting();

        // if (cc.sys.os === cc.sys.OS_ANDROID) {
        //     jsb.reflection.callStaticMethod('org/cocos2dx/javascript/utils/Utils', 'showAchieve', '()V');
        // } 

        // cc.Mgr.Utils.downloadRanking();

        // cc.Mgr.Utils.uploadAchievment('getGuardians_7');

        // cc.Mgr.admob.showInterstitial();

        // if (this.fitBoth == true) {
        //     cc.Mgr.app.canvas.fitHeight = true;
        //     cc.Mgr.app.canvas.fitWidth = true;
        // } else {
        //     cc.Mgr.app.canvas.fitHeight = false;
        //     cc.Mgr.app.canvas.fitWidth = true;
        // }
        // this.fitBoth = !this.fitBoth;

        // cc.Mgr.UIMgr.showBossComing(1);

        // cc.Mgr.plantMgr.autoMerge();

        // cc.Mgr.UIMgr.showSmallResult(true);

        // cc.Mgr.Utils.openRating();

        // cc.Mgr.UIMgr.showBigResult(false,20)

        // cc.Mgr.UIMgr.openRecordUI();

        // cc.Mgr.UIMgr.openEnjoyNature();
        
        // tempory code
        // cc.Mgr.UIMgr.openMaxLevelUI();
    },

    onClickRank () {
        // cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("rankUnavailable"), "", this.node);
        // cc.Mgr.admob.showInterstitial();
        // if (cc.sys.os === cc.sys.OS_ANDROID) {
        //     jsb.reflection.callStaticMethod('org/cocos2dx/javascript/utils/Utils', 'downloadRanking', '()V');
        // } else {
        //     cc.Mgr.UIMgr.openRankingUI();
        // }
        // cc.Mgr.UIMgr.openRankingUI();
        cc.Mgr.UIMgr.openShareUI();
    },

    openTurnTableUI:function(){
        cc.Mgr.UIMgr.openTurnTableUI();
    },

    openShopUI:function(){
        cc.Mgr.UIMgr.openPaymentUI(false)
    },

    updateBuffShow () {
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

    updateBuffTimer () {
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

    checkAnyBuff() {
        if (cc.Mgr.game.rageTimer > 0) return true;
        if (cc.Mgr.game.autoTimer > 0) return true;
        if (cc.Mgr.game.fireTimer > 0) return true;
        if (cc.Mgr.game.iceTimer > 0) return true;
        if (cc.Mgr.game.critTimer > 0) return true;

        return false;
    },

    showBuffTip () {
        if(cc.Mgr.game.level > 3 || this.checkAnyBuff() || cc.Mgr.plantMgr.otherTipCount > 0) return;

        if (this.buffTip.active === true) return;
        cc.Mgr.plantMgr.otherTipCount++;
        this.buffTip.active = true;
        this.buffTipTimeout = setTimeout(() => {
            this.buffTip.active = false;
            cc.Mgr.plantMgr.otherTipCount--;
        }, 5000);
    },

    openBuff () {
        cc.Mgr.UIMgr.openBuffUI();
        clearTimeout(this.buffTipTimeout);
        this.buffTip.active = false;
        cc.Mgr.plantMgr.otherTipCount--;
    },

    checkSignState:function(){
        if(cc.Mgr.Utils.getDays(cc.Mgr.Utils.GetSysTime())-cc.Mgr.Utils.getDays(cc.Mgr.game.lastSignDate) < 1) {
            this.signTip.active = false;
        } else {
            this.signTip.active = true;
        }

        // if(cc.Mgr.Utils.getDays(cc.Mgr.Utils.GetSysTime())-cc.Mgr.Utils.getDays(cc.Mgr.game.lastInviteDate) >= 1) {
        //     this.signTip.active = true;
        // }

        // tempory code
        // if(cc.Mgr.Utils.GetSysTime() - cc.Mgr.game.lastSignDate < 20) {
        //     this.signTip.active = false;
        // } else {
        //     this.signTip.active = true;
        // }
    },

    updateVIPIcon () {
        let hasLockGrid = false;
        for (let i = 0; i < 12; i++) {
            if (cc.Mgr.plantMgr.grids[i].type == MyEnum.GridState.lock) {
                hasLockGrid = true;
                break;
            }
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
