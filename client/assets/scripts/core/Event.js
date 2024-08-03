
var Event = cc.Class({
    extends: cc.Component,
    statics:{
        ParseFinish:"ParseFinish",//解析数据完毕

        BuyPlantInShop:"BuyPlantInShop",

        //防御状态，参数bool
        defense:"defense",
        //花盆打开，生成植物
        flowerPotOpen:"flowerPotOpen",
        //购买植物
        BuyPlant:"BuyPlant",
        //解锁空地
        unlockGird:"unlockGird",

        checkMissionAndAchieve:"checkMissionAndAchieve",


        //单步引导完成
        singleGuideComplete:"guideComplete",
        //所有引导完成
        AllGuideComplete:"AllGuideComplete",
        showSingleGuide:"showSingleGuide",
    },
});
module.exports = Event;
