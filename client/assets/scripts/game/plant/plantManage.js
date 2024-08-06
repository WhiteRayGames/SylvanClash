var EffectType = require("EffectType");
var DataType = require("DataType");
var MyEnum = require("MyEnum");
var Event = require("Event");
var MissionType = require("MissionType");
var plantManage = cc.Class({
    extends: cc.Component,

    properties: {
        rubbishNode:cc.Node,
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

    statics:
    {
        instance:null,
    },
    
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.otherTipCount = 0;
        plantManage.instance = this;
        this.checkLvNumList = [5, 20, 50, 100];
    },

    resume () {
        for(var i = 0; i < this.grids.length; i++) {
            if(this.grids[i].type == MyEnum.GridState.plant)
            {
                this.grids[i].content.playIdleAnim();
            }
        }
    },

    init(callback)
    {
        // for (let i = 0; i < 70; i++) {
        //     let power = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData, i + 1).power
        //     power = cc.Mgr.Utils.getNumStr2(power);
        //     console.log(power);
        // }
        
        //格子列表，0，空格，1 植物，3，未解锁，。。。。结构为，{type:0,content:plant}
        this.grids=[];
        //被初始化了的植物
        this.initedPlantNum = 0;
        //植物存放位置
        this.plantParent = this.node

        this.plantPos = [];
        for (let i = 0; i < 12; i++) {
            let pos = {};
            pos.x = (Math.floor(i / 3) * 63 - 3 - Math.floor(i % 3) * 83);
            pos.y = (-1 * Math.floor(i % 3) * 43 + 112 - Math.floor(i / 3) * 39);
            this.plantPos.push(pos);
        }
        this.plantPos.push({x: -150, y: 170});

        //已经加载了资源个数
        this.loadedPrefabNum = 0;
        this.prefabsObjs=[];
        this.loadPrefabs(callback);
        this.setPreloadList();

        this.landBorders = [];
        this.loadLandBorder();

        //植物移动
        this.plantMoveInfo = {"isMove":false,"index":-1};

        cc.director.GlobalEvent.on(Event.BuyPlant,this.BuyPlant,this);
        cc.director.GlobalEvent.on(Event.unlockGird,this.unlockGird,this);

        cc.director.GlobalEvent.on(Event.AllGuideComplete,this.AllGuideComplete,this);

        if(!cc.Mgr.game.needGuide)
        {
            this.node.on(cc.Node.EventType.TOUCH_START, function (event) {

                this.TouchStart(event);
            }, this);       
            this.scheduleOnce(this.checkMerge,cc.Mgr.game.plantMergeGuideTime);
        }

        this.frontNode.zIndex = 120;
        this.rubbishNode.zIndex = 121;
        this.attackRange.parent = null;
    },

    TouchStart(event){
        this.hideMergeGuide();
        this.hideTipAttackNode(false);
    },

    showAttackRange (_parent) {
        let plant = _parent.getComponent("plant");
        if (this.checkHasMerge(plant.level, plant.index) === true) return;
        this.attackRange.parent = _parent;
        this.attackRange.setPosition(0, 30);
        this.attackRange.zIndex = -1;
        this.attackRange.setScale(plant.index === 12 ? 3.5 : 1);
        // this.attackRange.active = true;
    },

    checkHasMerge (_level, _index) {
        for (let i = 0; i < this.grids.length; i++) {
            let plant = this.grids[i].content;
            if (plant.level === _level && i !== _index) return true;
        }

        return false;
    },

    hideAttackRange () {
        this.attackRange.parent = null;
    },

    //初始化地块方框信息
    loadLandBorder:function(){
        var self = this;
        cc.loader.loadRes("prefab/effect/landBorder", function (errmsg, prefab) {
            if (errmsg) {
                cc.error(errmsg.message || errmsg);
                return;
            }
            let initCount = self.plantPos.length; //初始化个数
            for (let i = 0; i < initCount; i++) {
                let Obj = cc.instantiate(prefab);
                Obj.parent = self.plantParent;
                Obj.position = cc.v2(self.plantPos[i].x, self.plantPos[i].y + 30);
                // tempory code
                Obj.width = 120
                Obj.height = 80
                Obj.active = false;
                self.landBorders.push(Obj);
            }
        });
    },
    
    //展示地块呗选中方框信息
    showPickLandBorder:function(needShow = false, level , index = -1){
        if(needShow && cc.Mgr.game.autoTimer <= 0)
        {
            for(var i = 0;i<this.grids.length;i++)
            {
                var gird = this.grids[i];
                if(gird.type == MyEnum.GridState.plant)
                {
                    if(index != gird.content.index)
                        if(gird.content.level == level && this.landBorders[gird.content.index] && !gird.content.isCompounded)
                        {
                            this.landBorders[gird.content.index].active = true;
                        }
                }
            }
        } 
        else
        {
            for (var i = this.landBorders.length - 1; i >= 0; i--) {
                this.landBorders[i].active = false;
            }
        }
    },

    //植物狂暴状态切换
    changePlantAngryState:function(enter = false){
        if (this.allowRage === enter) return;
        this.allowRage = enter;
        for(var i = 0; i < this.grids.length; i++)
        {
            if(this.grids[i].type == MyEnum.GridState.plant)
            {
                this.grids[i].content.changeAngryState(enter);
            }
        }

        cc.Mgr.UIMgr.InGameUI.getComponent("InGameUI").updateBuffShow();
    },

    changePlantFireState:function(enter = false){
        if (this.allowFire === enter) return;
        this.allowFire = enter;
        for(var i = 0; i < this.grids.length; i++)
        {
            if(this.grids[i].type == MyEnum.GridState.plant)
            {
                this.grids[i].content.changeFireState(enter);
            }
        }

        cc.Mgr.UIMgr.InGameUI.getComponent("InGameUI").updateBuffShow();
    },

    changePlantIceState:function(enter = false){
        if (this.allowIce === enter) return;
        this.allowIce = enter;
        for(var i = 0; i < this.grids.length; i++)
        {
            if(this.grids[i].type == MyEnum.GridState.plant)
            {
                this.grids[i].content.changeIceState(enter);
            }
        }

        cc.Mgr.UIMgr.InGameUI.getComponent("InGameUI").updateBuffShow();
    },

    changePlantCritState:function(enter = false){
        if (this.allowCrit === enter) return;
        this.allowCrit = enter;
        for(var i = 0; i < this.grids.length; i++)
        {
            if(this.grids[i].type == MyEnum.GridState.plant)
            {
                this.grids[i].content.changeCritState(enter);
            }
        }

        cc.Mgr.UIMgr.InGameUI.getComponent("InGameUI").updateBuffShow();
    },

    changePlantAutoState: function(enter = false) {
        if (this.allowAutoMerge === enter) return;
        this.allowAutoMerge = enter;
        this.autoMerge();
        cc.Mgr.UIMgr.InGameUI.getComponent("InGameUI").updateBuffShow();
        if (this.allowAutoMerge == true) {
            this.hideMergeGuide();
        }
    },

    autoMerge () {
        if (cc.Mgr.GameCenterCtrl.pauseFight) return;
        if (this.autoMergeData) {
            this.autoMergeData.startIndex = -1;
            this.autoMergeData.targetIndex = -1;
        }
        if (this.allowAutoMerge !== true) return;
        this.autoMergeResult = false;

        console.log("autoMerge")
        for(var i = 0; i < this.grids.length; i++)
        {
            if(this.grids[i].type == MyEnum.GridState.plant)
            {
                let level = this.grids[i].content.level;
                for (let j = 0; j < this.grids.length; j++) {
                    if (this.grids[j].type == MyEnum.GridState.plant && this.grids[j].content.level == level && i != j && level !== cc.Mgr.Config.allPlantCount) {
                        this.autoMergeData = {};
                        this.autoMergeData.startIndex = i;
                        this.autoMergeData.targetIndex = j;
                        this.grids[i].content.node.zIndex = 999;
                        if (this.grids[i].content.isMoving) {
                            this.grids[i].content.node.setPosition(this.plantPos[this.grids[i].content.index]);
                        }
                        if (this.grids[j].content.isMoving) {
                            this.grids[j].content.node.setPosition(this.plantPos[this.grids[j].content.index]);
                        }
                        this.grids[i].content.node.runAction(cc.sequence(cc.moveTo(0.5, this.grids[j].content.node.getPosition()), cc.callFunc(() => {
                            this.grids[i].content.node.zIndex = this.grids[i].content.lastZIndex;
                            this.TouchEndDone(this.grids[i].content);
                        })));
                        this.autoMergeResult = true;
                        return;
                    }
                }
            }
        }
    },

    rubbishBtn()
    {
        if(cc.Mgr.game.needGuide && cc.Mgr.game.curGuideStep == MyEnum.GuideType.guide8)
        {
            cc.director.GlobalEvent.emit(Event.singleGuideComplete,{"step":MyEnum.GuideType.guide8});
            return;
        }
        cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("TrashTip"), "", cc.Mgr.UIMgr.uiRoot);
        
    },

    flowerPotOpen(data)
    {
        var index = data.index;
        var level = data.level;

        cc.Mgr.AudioMgr.playSFX(MyEnum.AudioType.flower_pot_tap);
        this.generateNewPlan(index,level);

        var pos = cc.v2(this.plantPos[index].x+this.grids[index].content._generateEffectPos.x,
            this.plantPos[index].y+this.grids[index].content._generateEffectPos.y);
        this.playMergeEffect(pos);

        var pos2 = cc.v2(this.plantPos[index].x,this.plantPos[index].y);
        let self = this;
        this.scheduleOnce(function(){
            self.playOpenFlowerEffect(pos2);
        },1);
       
    },

    AllGuideComplete(data)
    {
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {

            this.TouchStart(event);
        }, this);       
        this.scheduleOnce(this.checkMerge,cc.Mgr.game.plantMergeGuideTime);

        this.checkSpaceGird();
        this.generateDropFlowerFot();
    },

    hasLockGrid () {
        let hasLockGrid = false;
        for (let i = 0; i < 12; i++) {
            if (cc.Mgr.plantMgr.grids[i].type == MyEnum.GridState.lock) {
                hasLockGrid = true;
                break;
            }
        }
        return hasLockGrid;
    },

    unlockAllGrids () {
        for (let i = 0; i < 12; i++) {
            if (cc.Mgr.plantMgr.grids[i].type == MyEnum.GridState.lock) {
                var param = {};
                param.index = i;

                cc.director.GlobalEvent.emit(Event.unlockGird,param);
            }
        }
    },

    unlockSpecialGrid () {
        if (this.hasLockGrid() === true || this.grids[12].type !== MyEnum.GridState.vip) return;
        this.grids[12].type = MyEnum.GridState.vipLock;
        this.grids[12].content = {};
        this.specialGridLock.active = false;
        this.specialGridUnlockEffect.node.active = true;
        this.specialGridUnlockEffect.playAnimation("Unlock", 1);
        this.specialGridUnlockEffect.on(dragonBones.EventObject.COMPLETE, this.showSpecialGridUnlockEffect, this)
    },

    updateVipGrid () {
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

    activateSpecialGrid () {
        if (this.grids[12].type !== MyEnum.GridState.vip && this.grids[12].type !== MyEnum.GridState.vipLock) return;
        if (this.hasLockGrid() === false || this.grids[12].type === MyEnum.GridState.vipLock) {
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
            this.specialGridUnlockEffect.on(dragonBones.EventObject.COMPLETE, this.showActiveSpecialGridEffect, this)
        }
    },

    updateSpecialGridState () {
        this.specialGridUnlockEffect_3.node.active = true;
        if (this.grids[12].type === MyEnum.GridState.plant) {
            this.specialGridUnlockEffect_3.playAnimation("Unlock3_1", -1)
        } else if (this.grids[12].type === MyEnum.GridState.none || this.grids[12].type === MyEnum.GridState.flowerPot) {
            this.specialGridUnlockEffect_3.playAnimation("Unlock3", -1)
        } else {
            this.specialGridUnlockEffect_3.node.active = false;
        }
    },

    restoreVipGrid () {
        if (!cc.Mgr.game.isVIP && this.grids[12].type === MyEnum.GridState.none && !cc.Mgr.game.unlockSpecialGrid) {
            this.grids[12].type = MyEnum.GridState.vipLock;
            this.grids[12].content = {};
            this.specialGridUnlockEffect_3.node.active = false;
            this.specialGridUnlockEffect_2.active = true;
        }
    },

    showActiveSpecialGridEffect() {
        this.specialGridUnlockEffect.active = false;
        this.grids[12].type = MyEnum.GridState.none;
        this.grids[12].content = {};
        this.updateSpecialGridState();
    },

    showSpecialGridUnlockEffect() {
        this.specialGridUnlockEffect.node.active = false;
        this.specialGridUnlockEffect_2.active = true;
    },

    onClickVip () {
        cc.Mgr.UIMgr.openSpecialGridBundle();
    },

    //解锁空地
    unlockGird(data)
    {
        var index = data.index;
        this.grids[index].content.plantDestroy();
        this.grids[index].type = MyEnum.GridState.none;
        this.grids[index].content = {};

        var obj = cc.Mgr.EffectMgr.getObFromPool(EffectType.DieSmoke);
        obj.active = true;
        obj.parent = this.node;
        obj.position = cc.v2(this.plantPos[index].x,this.plantPos[index].y + 50);
       
        obj.getComponent("dieSmoke").playAnimation(function(){
            
        });
        // cc.Mgr.UIMgr.InGameUI.updateVIPIcon();
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

    checkHasAnySpaceGird:function(judeNumTwo = false){ //checkHasTwoOrMoreSpaceGird
        var num = 0;
        for(var i = 0;i<this.grids.length;i++)
        {
            if(this.grids[i].type == MyEnum.GridState.none)
            {
                num++;
            }
        }
        var noneDropNun = cc.Mgr.flowerPotMgr.noneDropFlowerFotNun();
        if(judeNumTwo)
            return (num-noneDropNun)>=2?true:false;
        else
            return num>noneDropNun?true:false;
    },

    addPlantAtGridByLv:function(plantId){
        for(var i = 0;i<this.grids.length;i++)
        {
            var gird = this.grids[i];
            if(gird.type == MyEnum.GridState.none)
            {
                this.generateNewPlan(i,plantId);
                return;
            }
        }
    },

    //主界面购买植物
    BuyPlant(data)
    {
        for(var i = 0;i<this.grids.length;i++)
        {
            var gird = this.grids[i];
            if(gird.type == MyEnum.GridState.none)
            {
                var plantId = cc.Mgr.game.canBuyPlantId;//buyData.button;
                cc.Mgr.game.plantBuyRecord[plantId]++;
                
                this.generateNewPlan(i,plantId);
                cc.Mgr.game.money -= data.money;
                cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "money");

                // let eventData = {}
                // eventData.elapsed = Date.now()
                // eventData.value = data.money;
                // eventData.feature = "buy_plant";
                // cc.Mgr.analytics.logEvent("spend_coin", JSON.stringify(eventData));

                return;
            }
        }
        if(i == this.grids.length)
        {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("NoSpaceForPlant"), "", cc.Mgr.UIMgr.uiRoot);
        }
    },

    checkTrash () {
        let result = true;
        let lastLevel = cc.Mgr.Config.allPlantCount;
        let levelList = [];
        this.targetIdx = -1;
        for (var i = 0; i < this.grids.length; i++) {
            let grid = this.grids[i];
            if (grid.type === MyEnum.GridState.none) {
                result = false;
            }
            if (grid.type === MyEnum.GridState.plant) {
                if (grid.content.level < lastLevel) {
                    lastLevel = grid.content.level;
                    this.targetIdx = i;
                }
                levelList.push(grid.content.level);
            }
        }

        let tem = this.refrain(levelList);
        if (tem.indexOf(lastLevel) >= 0) result = false;

        if (this.checkHasMergeItem() === true) result = false;

        // temp code 暂时隐藏垃圾桶提示
        // if (result === true) {
        //     let startPos = cc.v2(this.plantPos[this.targetIdx].x,this.plantPos[this.targetIdx].y)
        //     let endPos = cc.v2(this.rubbishNode.x,this.rubbishNode.y)
        //     this.showTrashGuide(startPos, endPos);
        // } else {
        //     cc.Mgr.UIMgr.showTipToTrash(false);
        //     this.hideTrashGuide();
        // }
    },

    showTrashGuide(startPos,endPos)
    {
        if (this.unlockTip && this.unlockTip.active) return;
        if (this.grids[6].type === MyEnum.GridState.lock) return;
        if (this.showGuideUnlockGrid() == true) return;
        if(this.trashGuideNode != null && this.trashGuideNode.active) return;

        cc.Mgr.UIMgr.showTipToTrash(true);
        if(this.trashGuideNode == null)
        {
            this.trashGuideNode = cc.instantiate(this.plantTrashGuidePrefab);
            this.trashGuideNode.parent = this.node.parent;
        }

        if (cc.Mgr.game.zoomIn) {
            startPos.x += 70;
            startPos.y += 20;
            endPos.x += 20;
            endPos.y -= 30;
        }
        
        this.trashGuideNode.getComponent("PlantMergeGuide").startMove(startPos,endPos);
        this.trashGuideNode.active = true;
    },

    hideTrashGuide()
    {
        if(this.trashGuideNode != null && this.trashGuideNode.active)
        {
            this.trashGuideNode.getComponent("PlantMergeGuide").stopMove();
            this.trashGuideNode.active = false;
        }  
    },

    refrain(arr) {
    　　var tmp = [];
    　　if(Array.isArray(arr)) {
    　　　　arr.concat().sort().sort(function(a,b) {
    　　　　　　if(a==b && tmp.indexOf(a) === -1) tmp.push(a);
    　　　　});
    　　}
    　　return tmp;
    },

    //产生新植物
    generateNewPlan(index,level)
    {
        var self = this;
        self.grids[index].type = MyEnum.GridState.plant;

        cc.Mgr.game.updatePlantOwnsByLv(level);
        
        var plantData = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData,level);
        
        var name = plantData.prefab;

        self.loadNewPlant(name, (prefab) => {
            var plant = cc.instantiate(prefab);

            plant.parent = self.plantParent;
            var plantItem = plant.getComponent("plant");
            plantItem.init(index,self.plantPos[index],plantData);
            plantItem.TouchEndCb = function(plant)
            {
                self.TouchEndDone(plant);
            }
            plantItem.TouchStartCb = function()
            {
                self.TouchStartDone();
            }
            
            // if(self.grids[index].content != null &&  self.grids[index].content.node !=null && self.grids[index].content.node.isValid)
            // {
            //     self.grids[index].content.plantDestroy();
            // }
            
            self.grids[index].content = plantItem;
            self.grids[index].content.setIndex(index);
    
            if(cc.Mgr.game.needGuide)
            {
                cc.Mgr.AudioMgr.playSFX(MyEnum.AudioType.click);
                if(cc.Mgr.game.curGuideStep == MyEnum.GuideType.guide1)
                {
                    cc.director.GlobalEvent.emit(Event.singleGuideComplete,{"step":MyEnum.GuideType.guide1});
                    cc.director.GlobalEvent.emit(Event.showSingleGuide,{"step":MyEnum.GuideType.guide2});
                }
                else if(cc.Mgr.game.curGuideStep == MyEnum.GuideType.guide2)
                {
                    cc.director.GlobalEvent.emit(Event.singleGuideComplete,{"step":MyEnum.GuideType.guide2});
                    cc.director.GlobalEvent.emit(Event.showSingleGuide,{"step":MyEnum.GuideType.guide3});
                }
                else if(cc.Mgr.game.needGuide && cc.Mgr.game.curGuideStep == MyEnum.GuideType.guide6)
                {
                    cc.director.GlobalEvent.emit(Event.singleGuideComplete,{"step":MyEnum.GuideType.guide6});
                    // cc.director.GlobalEvent.emit(Event.showSingleGuide,{"step":MyEnum.GuideType.guide7});
                }
                else if(cc.Mgr.game.needGuide && cc.Mgr.game.curGuideStep == MyEnum.GuideType.guide7)
                {
                    // cc.director.GlobalEvent.emit(Event.singleGuideComplete,{"step":MyEnum.GuideType.guide7});
                    // cc.director.GlobalEvent.emit(Event.showSingleGuide,{"step":MyEnum.GuideType.guide8});
                }
            }
            this.showUnlockGridTip();
            this.updateSpecialGridState();
            this.checkTrash();
            if (this.autoMergeResult == false && cc.Mgr.UIMgr.currentShowUICount <= 0) this.autoMerge();
        });
    },

    setPreloadList () {
        this.preloadList = [];
        for(var i = 0; i < cc.Mgr.Config.allPlantCount; i++)
        {
            var plantData = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData,i + 1);
            this.preloadList.push(plantData.prefab);
        }
    },

    loadNewPlant (_plantName, _callback) {
        var self = this;
        if (self.prefabsObjs[_plantName]) {
            _callback && _callback(self.prefabsObjs[_plantName]);
        } else {
            cc.loader.loadRes("prefab/plant/" + _plantName, function (err, prefab) {
                if (err) {
                    cc.error(err.message || err);
                    return;
                }
                self.prefabsObjs[_plantName] = prefab;

                _callback && _callback(prefab);
            });
        }
    },

    loadPlantsPrefab () {
        var self = this;
        
        if (this.preloadList.length > 0) {
            let item = this.preloadList.shift();
            let prefabName = item;
            if (self.prefabsObjs[prefabName]) {
                self.loadPlantsPrefab();
                return;
            }
            item = "prefab/plant/" + item;
            cc.loader.loadRes(item, function (err, prefab) {
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

    loadPrefabs(callback)
    {
        var self = this;

        var filterList = [];
        for(var i = 0; i < cc.Mgr.game.plantsPK.length; i++)
        {
            var pk = cc.Mgr.game.plantsPK[i];
        
            if((pk.type == MyEnum.GridState.plant || pk.type == MyEnum.GridState.flowerPot)/* && plantsConfig[i] !== 0*/) // tempory code
            {
                
                var plantData = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData, pk.level);// tempory code plantsConfig[i] pk.level

                if (filterList.indexOf(plantData.prefab) >= 0) continue;
                else filterList.push(plantData.prefab);

                self.loadedPrefabNum++;
                cc.loader.loadRes("prefab/plant/" + plantData.prefab, function (err, prefab) {
                    if (err) {
                        cc.error(err.message || err);
                        return;
                    }
                    // self.prefabsObjs.push(prefab);
                    self.prefabsObjs[prefab.name] = prefab;
                    self.loadedPrefabNum--;

                    if(self.loadedPrefabNum == 0)
                    {
                        callback();
                    }
                });
            }
        }

        self.loadedPrefabNum++;
        cc.loader.loadRes("prefab/effect/rage_ske", cc.Prefab, function (errmsg, prefab) {
            if (errmsg) {
                cc.error(errmsg.message || errmsg);
                return;
            }

            self.ragePrefab = cc.instantiate(prefab);
            self.loadedPrefabNum--;
            if(self.loadedPrefabNum == 0)
            {
                callback();
            }
        });

        self.loadedPrefabNum++;
        cc.loader.loadRes("prefab/effect/flame_ske", cc.Prefab, function (errmsg, prefab) {
            if (errmsg) {
                cc.error(errmsg.message || errmsg);
                return;
            }

            self.flamePrefab = cc.instantiate(prefab);
            self.loadedPrefabNum--;
            if(self.loadedPrefabNum == 0)
            {
                callback();
            }
        });

        self.loadedPrefabNum++;
        cc.loader.loadRes("prefab/effect/ice_ske", cc.Prefab, function (errmsg, prefab) {
            if (errmsg) {
                cc.error(errmsg.message || errmsg);
                return;
            }

            self.freezePrefab = cc.instantiate(prefab);
            self.loadedPrefabNum--;
            if(self.loadedPrefabNum == 0)
            {
                callback();
            }
        });

        self.loadedPrefabNum++;
        cc.loader.loadRes("prefab/effect/crit_ske", cc.Prefab, function (errmsg, prefab) {
            if (errmsg) {
                cc.error(errmsg.message || errmsg);
                return;
            }

            self.critPrefab = cc.instantiate(prefab);
            self.loadedPrefabNum--;
            if(self.loadedPrefabNum == 0)
            {
                callback();
            }
        });

        self.loadedPrefabNum++;
        cc.loader.loadRes("prefab/plant/lockGird", function (err, prefab) {
            if (err) {
                cc.error(err.message || err);
                return;
            }
            // self.prefabsObjs.push(prefab);
            self.lockGirdPrefab = prefab;
            self.loadedPrefabNum--;

            if(self.loadedPrefabNum == 0)
            {
                callback();
            }
        });


        self.loadedPrefabNum++;
        cc.loader.loadRes("prefab/uiPrefab/PlantMergeGuide", function (err, prefab) {
            if (err) {
                cc.error(err.message || err);
                return;
            }
            // self.prefabsObjs.push(prefab);
            self.plantMergeGuidePrefab = prefab;
            self.loadedPrefabNum--;

            if(self.loadedPrefabNum == 0)
            {
                callback();
            }
        });

        self.loadedPrefabNum++;
        cc.loader.loadRes("prefab/uiPrefab/PlantTrashGuide", function (err, prefab) {
            if (err) {
                cc.error(err.message || err);
                return;
            }
            // self.prefabsObjs.push(prefab);
            self.plantTrashGuidePrefab = prefab;
            self.loadedPrefabNum--;

            if(self.loadedPrefabNum == 0)
            {
                callback();
            }
        });
    },

    showVipTip () {
        if (this.vipTipNode.active || this.otherTipCount > 0) return;
        if (this.grids[12].type === MyEnum.GridState.none || this.grids[12].type === MyEnum.GridState.plant || this.grids[12].type === MyEnum.GridState.flowerPot || this.otherTipCount > 0 || this.hasLockGrid()) return;
        this.vipTipLabel.string = cc.Mgr.Utils.getTranslation("unlock-fort-tip");
        this.vipTipNode.active = true;
        this.otherTipCount++;
    },

    hasLockGrid () {
        let result = false;
        for (let i = 0; i < 12; i++) {
            let grid = this.grids[i];
            if (grid.type === MyEnum.GridState.lock) {
                result = true;
                break;
            }
        }

        return result;
    },

    hideVipTip () {
        if (this.vipTipNode.active)this.otherTipCount--;
        this.vipTipNode.active = false;
    },

    //正常游戏
    initPlants()
    {
        //此处测试，默认全部创建 1 等级植物
        var self = this;
        let plantsConfig = [0,0,0,0,73,0,0,0,0,0,0,0,0];
        for(var i = 0; i < this.plantPos.length; i++)
        {
            // if (plantsConfig[i] === 0) continue;
            var grid = {};
            var pk = cc.Mgr.game.plantsPK[i];

            if (i == 12 && pk.type !== MyEnum.GridState.vip && pk.type !== MyEnum.GridState.vipLock) { // vip grid
                this.specialGridLock.active = false;
                this.specialGridUnlockEffect.node.active = false;
                this.specialGridUnlockEffect_2.active = false;
            }
        
            if((pk.type == MyEnum.GridState.plant || pk.type == MyEnum.GridState.flowerPot)/* && plantsConfig[i] !== 0*/) // tempory code
            {
                var plantData = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData, pk.level);// tempory code plantsConfig[i] pk.level
                var name = plantData.prefab;
               
                var plant = cc.instantiate(self.prefabsObjs[name]);
               
                plant.parent = self.plantParent;
                var plantItem = plant.getComponent("plant");
                plantItem.init(i,self.plantPos[i],plantData);
                plantItem.TouchEndCb = function(plant)
                {
                    self.TouchEndDone(plant);
                }
                plantItem.TouchStartCb = function()
                {
                    self.TouchStartDone();
                }
                
                grid.type = MyEnum.GridState.plant;
                grid.content = plantItem;
                self.grids.push(grid);
            }
            else if(pk.type == MyEnum.GridState.lock)
            {
                var plant = cc.instantiate(self.lockGirdPrefab);
                plant.parent = self.plantParent;
                var plantItem = plant.getComponent("lockGird");
                plantItem.init(i,pk.level,self.plantPos[i]);
                plantItem.TouchEndCb = function(plant)
                {
                    self.TouchEndDone(plant);
                }
                plantItem.TouchStartCb = function()
                {
                    self.TouchStartDone();
                }
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
                if (i == 12) { // vip grid
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

        if(!cc.Mgr.game.needGuide)
        {
            this.checkSpaceGird();
            this.generateDropFlowerFot();
        }

        // cc.Mgr.UIMgr.InGameUI.updateVIPIcon();

        // 防错处理
        if ((this.grids[12].type === MyEnum.GridState.vip || this.grids[12].type === MyEnum.GridState.vipLock) && (cc.Mgr.game.isVIP || cc.Mgr.game.unlockSpecialGrid)) {
            this.updateVipGrid();
        }
    },

    guideStep3Run()
    {
        var startIndex = 7;
        var endIndex = 8;
        var startPos = cc.v2(this.plantPos[startIndex].x,this.plantPos[startIndex].y)
        var endPos = cc.v2(this.plantPos[endIndex].x,this.plantPos[endIndex].y)
        this.showMergeGuide(startPos,endPos)
    },

    showMergeGuide(startPos,endPos)
    {
        if (this.allowAutoMerge == true) return;
        if(this.MergeGuideNode != null && this.MergeGuideNode.active) return;

        if(this.MergeGuideNode == null)
        {
            this.MergeGuideNode = cc.instantiate(this.plantMergeGuidePrefab);
            this.MergeGuideNode.parent = this.node.parent;
        }

        if (cc.Mgr.game.zoomIn) {
            startPos.x += 60;
            startPos.y += 20;
            endPos.x += 60;
            endPos.y += 20;
        }
        
        this.MergeGuideNode.getComponent("PlantMergeGuide").startMove(startPos,endPos);
        this.MergeGuideNode.active = true;
        this.otherTipCount++;
    },

    hideMergeGuide()
    {
        if(!cc.Mgr.game.needGuide)
        {
            this.unschedule(this.checkMerge);
            this.unschedule(this.hideMergeGuide);
            this.scheduleOnce(this.checkMerge,cc.Mgr.game.plantMergeGuideTime);
        }

        if(this.MergeGuideNode != null)
        {
            if(this.MergeGuideNode.active) this.otherTipCount--;
            this.MergeGuideNode.getComponent("PlantMergeGuide").stopMove();
            this.MergeGuideNode.active = false;
        }
            
    },

    checkHasMergeItem () {
        let plants = new Array();
        for(var i = 0; i < this.grids.length; i++)
        {
            if(this.grids[i].type == MyEnum.GridState.plant)
            {
                plants.push(this.grids[i].content);
            }
        }
        plants.sort(function(a,b)
        {
            return b.level - a.level;
        });

        for(i = 0; i < plants.length; i++)
        {
            
            if(i != plants.length - 1 && plants[i].level == plants[i + 1].level)
            {
                return true;
            }
            
        }

        return false;
    },

    checkMerge()
    {
        if (cc.Mgr.game.level > 5) return;
        let plants = new Array();
        for(var i=0;i<this.grids.length;i++)
        {
            if(this.grids[i].type == MyEnum.GridState.plant)
            {
                plants.push(this.grids[i].content);
            }
        }
        plants.sort(function(a,b)
        {
            return b.level-a.level;
        });

        for(i=0;i<plants.length;i++)
        {
            
            if(i != plants.length-1 && plants[i].level == plants[i+1].level && plants[i].level < cc.Mgr.Config.allPlantCount)
            {
                var startIndex = plants[i].index;
                var endIndex = plants[i+1].index;
                var startPos = cc.v2(this.plantPos[startIndex].x,this.plantPos[startIndex].y)
                var endPos = cc.v2(this.plantPos[endIndex].x,this.plantPos[endIndex].y)
                this.showMergeGuide(startPos,endPos)
                break;
            }
            
        }

        this.scheduleOnce(this.hideMergeGuide,cc.Mgr.game.plantMergeGuideHideTime);

    },
    generateDropFlowerFot()
    {
        var self = this;
        
        this.schedule(function(){

            var spaceGirdNun = 0;
            for(var gird in self.grids)
            {
                if(gird.type == MyEnum.GridState.none)
                {
                    spaceGirdNun++;
                }
            }
            cc.Mgr.flowerPotMgr.addDropFlowerFot(spaceGirdNun);

        },cc.Mgr.game.airDropTime);
    },

    checkSpaceGird()
    {
        var self = this;
        this.schedule(function(){

            if(!cc.Mgr.flowerPotMgr.haveFlowerFot())
            {
                return;
            }

            let spaceGirds = new Array();
            for(var i = 0;i<self.grids.length;i++)
            {
                var gird = self.grids[i];
                if(gird.type == MyEnum.GridState.none)
                {
                    spaceGirds.push(i);
                }
            }

            var spaceNum = spaceGirds.length;
            
            if(spaceNum > 0)
            {
                var flowerFot = cc.Mgr.flowerPotMgr.getFlowerFot();
                if(flowerFot!=null)
                {
                    var random = Math.floor(Math.random()*spaceNum);
                    var index = cc.Mgr.game.needGuide ? spaceGirds[0] : spaceGirds[random];

                    flowerFot.parent = self.plantParent;
                    var flowerFotItem = flowerFot.getComponent("flowerPot");
                    flowerFotItem.init(index,self.plantPos[index]);
                    self.grids[index].type = MyEnum.GridState.flowerPot;
                    self.grids[index].content = flowerFotItem;
                }
            }
            

        },cc.Mgr.Config.CheckPotGrownInterval);
    },

    //合成新植物，格子下标，植物等级
    compoundNewPlant(index,level)
    {
        var self = this;
        self.grids[index].type = MyEnum.GridState.plant;
        cc.Mgr.game.updatePlantOwnsByLv(level);
        let ownsCount = cc.Mgr.game.getPlantOwnsDataByLv(level);
        let countId = ownsCount === 5 ? "" : "_" + ownsCount;
        if (this.checkLvNumList.indexOf(ownsCount) >= 0) cc.Mgr.Utils.uploadAchievment('getGuardians_' + level + countId , level, ownsCount);
        var plantData = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData,level);
        var self = this;
        var name=plantData.prefab;

        cc.Mgr.game.updateMissionProgressById(MissionType.MergePlant);

        self.loadNewPlant(name, (prefab) => {
            var plant = cc.instantiate(prefab);

            plant.parent = self.plantParent;
            // plant.scaleX = 1.5;
            // plant.scaleY = 1.5;
            var plantItem = plant.getComponent("plant");
            plantItem.init(index,self.plantPos[index],plantData);
            plantItem.TouchEndCb = function(plant)
            {
                self.TouchEndDone(plant);
            }
            plantItem.TouchStartCb = function()
            {
                self.TouchStartDone();
            }
            
            self.grids[index].content = plantItem;
            self.grids[index].content.setIndex(index);
            cc.tween(plant).to(0.2,{scale:1.5}).to(0.2,{scale:1}).call(() => { }).start();
            cc.Mgr.AudioMgr.playSFX(MyEnum.AudioType.merge);
    
            if(cc.Mgr.game.plantMaxLv >= 6 && cc.Mgr.game.doubleBtnIntervalTime <= 0)
            {
                cc.Mgr.UIMgr.InGameUI.showDoubleCoinBtn(true);
            }
    
            if(cc.Mgr.game.needGuide && cc.Mgr.game.curGuideStep == MyEnum.GuideType.guide3)
            {
                cc.director.GlobalEvent.emit(Event.singleGuideComplete,{"step":MyEnum.GuideType.guide3});
            }
            if (cc.Mgr.UIMgr.currentShowUICount <= 0)this.autoMerge();
        });        
    },

    //植物合成,开始提起的植物下标，落点的植物下标，等级
    plantCompound(startIndex,endIndex,level)
    {
        if(cc.Mgr.game.needGuide && cc.Mgr.game.curGuideStep == MyEnum.GuideType.guide3)
        {
            // cc.director.GlobalEvent.emit(Event.singleGuideComplete,{"step":MyEnum.GuideType.guide3});
            this.hideMergeGuide();
        }
        
        
        this.grids[startIndex].content.compounded();
        this.grids[endIndex].content.compounded();

        var targetPos = this.plantPos[endIndex];

        cc.tween(this.grids[startIndex].content.node).to(0.3,{position:cc.v2(targetPos.x-40,targetPos.y)}).
        to(0.15,{position:cc.v2(targetPos.x,targetPos.y)}).start();
        cc.tween(this.grids[endIndex].content.node).to(0.3,{position:cc.v2(targetPos.x+40,targetPos.y)}).
        to(0.15,{position:cc.v2(targetPos.x,targetPos.y)}).call(()=>{
            // 将格子状态，设置为空格子，将植物摧毁
            this.grids[startIndex].type = MyEnum.GridState.none;
            this.grids[startIndex].content.plantDestroy();

            this.grids[endIndex].type = MyEnum.GridState.none;
            this.grids[endIndex].content.plantDestroy();
            if(cc.Mgr.game.plantMaxLv < level+1)
            {
                cc.Mgr.game.plantMaxLv = level+1;
                //新的植物生成

                // if (cc.Mgr.game.plantMaxLv >= 25) {
                //     cc.Mgr.admob.showInterstitial("unlock", () => {
                //         cc.Mgr.UIMgr.openPlantGetUI("unlock", cc.Mgr.game.plantMaxLv);
                //     });
                // } else {
                //     cc.Mgr.UIMgr.openPlantGetUI("unlock", cc.Mgr.game.plantMaxLv);
                // }
                cc.Mgr.UIMgr.openPlantGetUI("unlock", cc.Mgr.game.plantMaxLv);
            }
            
            this.compoundNewPlant(endIndex,level+1);

            var pos = cc.v2(targetPos.x+this.grids[endIndex].content._generateEffectPos.x,
                targetPos.y+this.grids[endIndex].content._generateEffectPos.y)
            this.playMergeEffect(pos);

            cc.Mgr.UIMgr.InGameUI.RefreshBuyButtonMergeAll();
            this.checkTrash();
            this.restoreVipGrid();
        }).start();
    },

    //植物放入回收箱
    plantPutRubbish(index, showSmoke = true)
    {
        if(showSmoke)
        {
            var obj = cc.Mgr.EffectMgr.getObFromPool(EffectType.DieSmoke);
            obj.active = true;
            obj.parent = this.rubbishNode;
            obj.y = this.node.y;
            obj.x = this.node.x;
            var self = this;
            obj.getComponent("dieSmoke").playAnimation(function(){
                cc.Mgr.UIMgr.GameInUINode.getComponent("InGameUI").buyButtonNode.active = true;
                cc.Mgr.GameCenterCtrl.rubbishNode.active = false;
            });
        }

        var backMoney = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData, this.grids[index].content.level).price; 
        var money = backMoney / BigInt(2);
        cc.Mgr.UIMgr.playCoinFlyForRecovery(money);
        cc.tween(this.rubbishNode).to(0.2,{scale:(cc.Mgr.game.zoomIn ? 1 : 1.2)}).to(0.2,{scale:(cc.Mgr.game.zoomIn ? 0.83 : 1)}).start();

        this.grids[index].type = MyEnum.GridState.none;
        this.grids[index].content.plantDestroy();
    },

    playMergeEffect:function(targetPos){
        var obj = cc.Mgr.EffectMgr.getObFromPool(EffectType.Merge);
        obj.active = true;
        if(obj == null)
            return;
        obj.parent = this.plantParent;
        //层级在植物之下
        obj.zIndex = 0;
        obj.scale = 0.5;
        obj.y = targetPos.y;
        obj.x = targetPos.x;
        obj.getComponent("plantMerge").playAnimation();
    },

    playOpenFlowerEffect:function(targetPos){
        var obj = cc.Mgr.EffectMgr.getObFromPool(EffectType.flowerPotOpen);
        obj.active = true;
        if(obj == null)
            return;
        obj.parent = this.plantParent;
        //层级全部在植物智商
        obj.zIndex = 13;
        obj.scale = 0.7;
        obj.y = targetPos.y;
        obj.x = targetPos.x;
        obj.getComponent("flowerPotOpen").playAnimation();
    },


    //植物交互位置
    plantExchange(startIndex,endIndex)
    {
        var plantContent =  this.grids[startIndex].content;

        this.grids[startIndex].content = this.grids[endIndex].content;
        this.grids[startIndex].content.setPosition(this.plantPos[startIndex]);
        this.grids[startIndex].content.setIndex(startIndex);

        this.grids[endIndex].content = plantContent;
        this.grids[endIndex].content.setPosition(this.plantPos[endIndex]);
        this.grids[endIndex].content.setIndex(endIndex);
    },
    //植物改变位置
    plantChangePos(startIndex,endIndex)
    {
        if(cc.Mgr.game.needGuide && cc.Mgr.game.curGuideStep == MyEnum.GuideType.guide5)
        {
            cc.director.GlobalEvent.emit(Event.singleGuideComplete,{"step":MyEnum.GuideType.guide5});
            cc.director.GlobalEvent.emit(Event.showSingleGuide,{"step":MyEnum.GuideType.guide6});
        }

        var plantContent =  this.grids[startIndex].content;

        this.grids[startIndex].type = MyEnum.GridState.none;
        this.grids[startIndex].content = {};


        this.grids[endIndex].content = plantContent;
        this.grids[endIndex].type = MyEnum.GridState.plant;
        this.grids[endIndex].content.setPosition(this.plantPos[endIndex]);
        this.grids[endIndex].content.setIndex(endIndex);
    },

    //移动解接触开始
    TouchStartDone()
    {
        cc.tween(this.rubbishNode).to(0.2,{scale:(cc.Mgr.game.zoomIn ? 1 : 1.2)}).start();
    },

    //移动结束之后的处理
    TouchEndDone(_plant)
    {
        let resultIndex = null;
        let lastDis = 999;
        for(let i = 0 ; i < this.plantPos.length; i++){
            if (i == _plant.index) {
                continue;
            }

            if (this.grids[i].type == MyEnum.GridState.plant && this.grids[i].content.isCompounded) {
                continue;
            }

            if (cc.Mgr.game.needGuide && cc.Mgr.game.curGuideStep == MyEnum.GuideType.guide5 && i != 11) {
                continue;
            }

           if (cc.Mgr.game.needGuide && cc.Mgr.game.curGuideStep == MyEnum.GuideType.guide3 && i != 8) {
                continue;
            }

            if (cc.Mgr.game.needGuide && cc.Mgr.game.curGuideStep == MyEnum.GuideType.guide4) {
                continue;
            }
  
            let distance = cc.Mgr.Utils.pDistance(_plant.node.position, this.plantPos[i]);
            if (distance < 50 && distance < lastDis) {
                resultIndex = i;
                lastDis = distance;
            }
        }

        if (resultIndex == null && !cc.Mgr.game.needGuide) {
            let disX = Math.abs(_plant.node.position.x - this.rubbishNode.position.x)
            let disY = Math.abs(_plant.node.position.y - this.rubbishNode.position.y)
            if (disX < 100 && disY < 100) {
                resultIndex = this.plantPos.length;
            }
        }

         if (resultIndex != null) this.touchEndHandle(resultIndex, _plant);
         else {
             _plant.setPosition(this.plantPos[_plant.index]);

             cc.Mgr.UIMgr.GameInUINode.getComponent("InGameUI").buyButtonNode.active = true;
             cc.Mgr.GameCenterCtrl.rubbishNode.active = false;
         }

         cc.tween(this.rubbishNode).to(0.2,{scale:(cc.Mgr.game.zoomIn ? 0.83 : 1)}).start();

         this.updateSpecialGridState();
    },

    touchEndHandle : function(_index, _plant) {
        if (_index == this.plantPos.length) {
            if (_plant.level == cc.Mgr.game.plantMaxLv) {
                cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("max-level-cannt-recovery"), "", cc.Mgr.UIMgr.uiRoot);
                _plant.setPosition(this.plantPos[_plant.index]);

                cc.Mgr.UIMgr.GameInUINode.getComponent("InGameUI").buyButtonNode.active = true;
                cc.Mgr.GameCenterCtrl.rubbishNode.active = false;
            } else {
                this.plantPutRubbish(_plant.index);
                // if (_plant.index == this.targetIdx) {
                //     this.hideTrashGuide();
                // }
                this.checkTrash();
                this.restoreVipGrid();
            }

            return;
        }

        cc.Mgr.UIMgr.GameInUINode.getComponent("InGameUI").buyButtonNode.active = true;
        cc.Mgr.GameCenterCtrl.rubbishNode.active = false;

        let currentGrid = this.grids[_index]
        if (this.autoMergeData && _plant.index != this.autoMergeData.startIndex && currentGrid.type == MyEnum.GridState.plant && (currentGrid.content.index == this.autoMergeData.startIndex || currentGrid.content.index == this.autoMergeData.targetIndex)) {
            _plant.setPosition(this.plantPos[_plant.index]);
            return;
        }
        if (currentGrid.type == MyEnum.GridState.plant && _plant.level == currentGrid.content.level){
            if (_plant.level != cc.Mgr.Config.allPlantCount) {
                if (_index === 12 && !cc.Mgr.game.isVIP && !cc.Mgr.game.unlockSpecialGrid) {
                    cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("vip-tip-01"), "", cc.Mgr.UIMgr.uiRoot);
                    _plant.setPosition(this.plantPos[_plant.index]);
                } else {
                    this.plantCompound(_plant.index,_index,_plant.level);
                }
            } else {
                cc.Mgr.UIMgr.openMaxLevelUI();
                // cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("plant-Max"), "", cc.Mgr.UIMgr.uiRoot);
                _plant.setPosition(this.plantPos[_plant.index]);
            }
        } else if (currentGrid.type == MyEnum.GridState.plant && _plant.level != currentGrid.content.level) {
            if ((_index === 12 || _plant.index === 12) && !cc.Mgr.game.isVIP && !cc.Mgr.game.unlockSpecialGrid) {
                cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("vip-tip-01"), "", cc.Mgr.UIMgr.uiRoot);
                _plant.setPosition(this.plantPos[_plant.index]);
            } else {
                this.plantExchange(_plant.index,_index);
            }
        } else if (currentGrid.type == MyEnum.GridState.none) {
            this.plantChangePos(_plant.index,_index);
            this.restoreVipGrid();
        } else if (currentGrid.type == MyEnum.GridState.flowerPot || currentGrid.type == MyEnum.GridState.lock) {
            _plant.setPosition(this.plantPos[_plant.index]);
        } else if (currentGrid.type == MyEnum.GridState.vipLock){
            this.onClickVip();
            _plant.setPosition(this.plantPos[_plant.index]);
        } else {
            _plant.setPosition(this.plantPos[_plant.index]);
        }
    },

    //判断最高等级植物能否攻击
    checkMaxLvPlantCanAttack:function(){
        var param = {};
        param.needShow = false;
        var key = cc.Mgr.game.level > 60 ? (cc.Mgr.game.level % 60) + "_" + cc.Mgr.game.curBoshu : cc.Mgr.game.level + "_" + cc.Mgr.game.curBoshu;
        var lvdt = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.LevelData, key);
        if(cc.Mgr.game.curBoshu != lvdt.waveCount)
            return param;
        
        for(var i = 0;i<this.grids.length;i++)
        {
            if(this.grids[i].type == MyEnum.GridState.plant 
                && this.grids[i].content.level == cc.Mgr.game.plantMaxLv && cc.Mgr.game.plantMaxLv >= 6
                && !this.grids[i].content.hasAttackObj()&& !this.grids[i].content.isCompounded && this.plantMoveInfo.index != this.grids[i].content.index)
            {
                // if(this.grids[i].content.state != MyEnum.PlantState.attacking
                //     && !this.grids[i].content.isCompounded && this.plantMoveInfo.index != this.grids[i].content.index)

                // {
                    param.needShow = true;
                    param.index = this.grids[i].content.index;
                    cc.Mgr.game.pickOutMaxLvPlant = param.index;
                    return param;
                // }
            }
        }
        return param;
    },

    showUnlockGridTip () {
        if (this.unlockTip && this.unlockTip.active) return;
        let firstGridLock = this.grids[6].type === MyEnum.GridState.lock;
        if (!firstGridLock || this.checkHasAnySpaceGird()) return;
        this.unlockTip = cc.instantiate(this.unlockTipPrefab);
        this.unlockTip.parent = this.plantParent;
        this.unlockTip.zIndex = 999;
        this.unlockTip.scale = 0.75;
        this.unlockTip.setPosition(this.grids[6].content.node.x, this.grids[6].content.node.y + 80);
        cc.Mgr.plantMgr.otherTipCount++;
    },

    showGuideUnlockGrid () {
        if (this.unlockTip && this.unlockTip.active) return false;
        if (this.guideUnlockTip && this.guideUnlockTip.active) return false;
        let index = this.getMinLockGrid();
        if (index == null) {
            this.hideGuideUnlockGrid();
            return false;
        }

        let lastLevel = cc.Mgr.Config.allPlantCount;
        let levelList = [];
        for (var i = 0; i < this.grids.length; i++) {
            let grid = this.grids[i];
            if (grid.type === MyEnum.GridState.none) {
                this.hideGuideUnlockGrid();
                return false;
            }
            if (grid.type === MyEnum.GridState.plant) {
                if (grid.content.level < lastLevel) {
                    lastLevel = grid.content.level;
                }
                levelList.push(grid.content.level);
            }
        }

        let tem = this.refrain(levelList);
        if (tem.indexOf(lastLevel) >= 0) {
            this.hideGuideUnlockGrid();
            return false;
        }

        if (this.checkHasMergeItem() === true) {
            this.hideGuideUnlockGrid();
            return false;
        }
        
        this.guideUnlockTip = cc.instantiate(this.unlockTipPrefab);
        this.guideUnlockTip.parent = this.plantParent;
        this.guideUnlockTip.zIndex = 999;
        this.guideUnlockTip.scale = 0.75;
        this.guideUnlockTip.setPosition(this.grids[index].content.node.x, this.grids[index].content.node.y + 80);
        cc.Mgr.plantMgr.otherTipCount++;

        return true;
    },

    hideGuideUnlockGrid () {
        if (this.guideUnlockTip && this.guideUnlockTip.active)this.guideUnlockTip.getComponent("UnlockTip").closeTip();
    },

    getMinLockGrid () {
        let result = null;
        for (let i = this.grids.length - 1; i >= 0; i--) {
            let grid = this.grids[i];
            if (grid.type === MyEnum.GridState.lock && cc.Mgr.game.money >= grid.content.money) {
                result = i;
                break;
            }
        }

        return result;
    },

    showLaterTipAttack:function(){
        this.attckShowIndex = -1;
        var outData = this.checkMaxLvPlantCanAttack();
        if(outData.needShow == false)
            return;
        this.attckShowIndex = outData.index;
        this.showAttackTip();
    },

    showAttackTip:function(){
        if (this.tipMoveAttackNode && this.tipMoveAttackNode.active) return;
        if (this.otherTipCount > 0) return;
        var index = this.attckShowIndex;
        if(index == null || index == -1)
            return;
        if(this.tipMoveAttackNode)
        {
            this.tipMoveAttackNode.parent = this.plantParent;
            //层级全部在植物智商
            this.tipMoveAttackNode.active = true;
            this.tipMoveAttackNode.zIndex = 999;
            this.tipMoveAttackNode.scale = 0.75;
            var pos = cc.v2(this.plantPos[index].x, this.plantPos[index].y+100);
            this.tipMoveAttackNode.y = pos.y;
            this.tipMoveAttackNode.x = pos.x;
            this.tipMoveAttackNode.getComponent("tipMoveAttack").showtipMoveAttack();
        }
        else
        {
            var obj = cc.Mgr.EffectMgr.getObFromPool(EffectType.TipMoveAttack);
            if(obj == null)
                return;
            obj.parent = this.plantParent;
            //层级全部在植物智商
            obj.active = true;
            obj.zIndex = 999;
            obj.scale = 0.75;
            var pos = cc.v2(this.plantPos[index].x, this.plantPos[index].y+100);
            obj.y = pos.y;
            obj.x = pos.x;
            obj.getComponent("tipMoveAttack").showtipMoveAttack();
            this.tipMoveAttackNode = obj;
        }
        this.otherTipCount++;
    },

    hideTipAttackNode:function(){
        cc.Mgr.game.pickOutMaxLvPlant = -1;
        if(this.tipMoveAttackNode)
        {
            if(this.tipMoveAttackNode.active == true) {
                this.tipMoveAttackNode.getComponent("tipMoveAttack").closeTip();
                this.otherTipCount--;
            }
        }
    },

    showtipMoveAttackNext:function(){
        if (this.tipMoveAttackNode && this.tipMoveAttackNode.active) return;
        if (this.otherTipCount > 0) return;
        if(this.tipMoveAttackNode)
        {
            var outData = this.checkMaxLvPlantCanAttack();
            if(outData.needShow == false)
                return;
            var index = outData.index;

            this.tipMoveAttackNode.active = true;
            var pos = cc.v2(this.plantPos[index].x, this.plantPos[index].y+100);
            this.tipMoveAttackNode.y = pos.y;
            this.tipMoveAttackNode.x = pos.x;
            this.tipMoveAttackNode.getComponent("tipMoveAttack").showtipMoveAttack();
            this.otherTipCount++;
        }
    },

    start () {

        // this.init();
        // this.initPlants();
       this.startTimer = Date.now();
    },
    

    update (dt) {
        if (cc.Mgr.GameCenterCtrl.pauseFight) return;
        if (Date.now() - this.startTimer >= 1000) {
            this.startTimer = Date.now();
            // rage
            if (cc.Mgr.game.rageTimer > 0) {
                cc.Mgr.game.rageTimer--;
                if (cc.Mgr.game.rageTimer <= 0) {
                    this.changePlantAngryState(false);
                }
            }

            // flame
            if (cc.Mgr.game.fireTimer > 0) {
                cc.Mgr.game.fireTimer--;
                if (cc.Mgr.game.fireTimer <= 0) {
                    this.changePlantFireState(false);
                }
            }

            // freeze
            if (cc.Mgr.game.iceTimer > 0) {
                cc.Mgr.game.iceTimer--;
                if (cc.Mgr.game.iceTimer <= 0) {
                    this.changePlantIceState(false);
                }
            }

            // crit
            if (cc.Mgr.game.critTimer > 0) {
                cc.Mgr.game.critTimer--;
                if (cc.Mgr.game.critTimer <= 0) {
                    this.changePlantCritState(false);
                }
            }

            // auto
            if (cc.Mgr.game.autoTimer > 0 && cc.Mgr.UIMgr.currentShowUICount <= 0) {
                cc.Mgr.game.autoTimer--;
                if (cc.Mgr.game.autoTimer <= 0) {
                    this.changePlantAutoState(false);
                }
            }

            if (cc.Mgr.UIMgr.buffUINode && cc.Mgr.UIMgr.buffUINode.active) {
                cc.Mgr.UIMgr.buffUINode.getComponent("BuffUI").refreshUI();
            }

            if (cc.Mgr.UIMgr.InGameUI) cc.Mgr.UIMgr.InGameUI.updateBuffTimer();
        }
    },
});
module.exports = plantManage;
