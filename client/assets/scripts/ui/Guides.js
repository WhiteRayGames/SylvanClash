
var MyEnum = require("MyEnum");
var Event = require("Event");
var uiConfig = require("uiConfig");
cc.Class({
    extends: cc.Component,

    properties: {
        guideNodes:[cc.Node],
        guideLbls:[cc.Label],
    },

    start () {
        this.guideList = [MyEnum.GuideType.guide3, MyEnum.GuideType.guide4, MyEnum.GuideType.guide5, MyEnum.GuideType.guide6];
        cc.director.GlobalEvent.on(Event.singleGuideComplete,this.singleGuideComplete,this);
        cc.director.GlobalEvent.on(Event.showSingleGuide,this.showSingleGuide,this);

        this.guideStepList = ["", "", "", "tutorial_merge_guardian", "tutorial_claim_coins", "tutorial_move_guardian", "tutorial_open_pot"]

        if (cc.Mgr.game.curGuide === 0) {
            let data = {}
            data.elapsed = cc.Mgr.Utils.getDate9(true)
            cc.Mgr.analytics.logEvent("tutorial_begin", JSON.stringify(data));
        }

        this.curStep = this.guideList[cc.Mgr.game.curGuide];
        this.guideNodes[this.curStep].active = true;
        cc.Mgr.game.curGuideStep = this.curStep;
        
        this.node.zIndex = uiConfig.guide.Layer;

        for (var i = 2; i < 6; i++) {
            var des = "guide-"+(i+1);
            this.guideLbls[i].string = cc.Mgr.Utils.getTranslation(des);
        }

        this.showSingleGuide({"step": this.curStep});
    },

    singleGuideComplete(_data)
    {
        let data = {}
        data.elapsed = cc.Mgr.Utils.getDate9(true)
        data.step = this.guideStepList[_data.step + 1]
        cc.Mgr.analytics.logEvent("tutorial_step", JSON.stringify(data));

        var step = _data.step;

        this.guideNodes[step].active = false;

        cc.Mgr.game.curGuide ++;

        if(cc.Mgr.game.curGuide == 3)
        {
            //引导结束，增加一个自然掉落的花盆
            cc.Mgr.flowerPotMgr.addDropFlowerFot(1);
            cc.Mgr.plantMgr.checkSpaceGird();
        }

        if (cc.Mgr.game.curGuide === 4) {
            cc.director.GlobalEvent.emit(Event.AllGuideComplete,{});
            // cc.Mgr.UIMgr.InGameUI.showBtnTip();
            cc.Mgr.game.needGuide = false;

            data = {}
            data.elapsed = cc.Mgr.Utils.getDate9(true)
            cc.Mgr.analytics.logEvent("tutorial_complete", JSON.stringify(data));

            cc.Mgr.UIMgr.openShareUI();
        }

    },

    showSingleGuide(data)
    {
        for (let i = 0; i < this.guideNodes.length; i++) {
            if (this.guideNodes[i] != null) {
                this.guideNodes[i].active = false;
            }
        }

        var step = data.step;
        if (cc.Mgr.game.curGuide === 3) {
            setTimeout(() => {
                this.guideNodes[step].active = true;
            }, 600)
        } else {
            this.guideNodes[step].active = true;
        }
        if(step == MyEnum.GuideType.guide3)
        {
            cc.Mgr.plantMgr.guideStep3Run();
        }
        cc.Mgr.game.curGuideStep = step;
    }

    // update (dt) {},
});
