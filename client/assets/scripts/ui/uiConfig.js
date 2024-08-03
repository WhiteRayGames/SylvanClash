
var uiConfig = cc.Class({
    extends: cc.Component,
    //后期再去配个层级 标注吧
    statics: {
        setUI:{Name:"setUI", Layer:2},
        turnTableUI:{Name:"turnTableUI", Layer:2},
        uavUI:{Name:"uavUI", Layer:2},
        buffUI:{Name:"buffUI", Layer:2},
        missionUI:{Name:"missionUI", Layer:2},
        promptUI:{Name:"promptUI", Layer:1},
        smallResult:{Name:"smallResult", Layer:1},
        bigResult:{Name:"bigResult", Layer:3},
        bossComing:{Name:"bossComing", Layer:1},
        plantGetUI:{Name:"plantGetUI", Layer:5},
        assetGetUI:{Name:"assetGetUI", Layer:5},
        uavUI:{Name:"uavUI",Layer:2},
        offlineAssetUI:{Name:"offlineAssetUI", Layer:2},
        paymentUI: {Name: "payment", Layer: 4},

        shareUI: {Name: "shareUI", Layer: 2},

        doubleCoinUI:{Name:"doubleCoinUI",Layer:2},

        signUI:{Name:"signUI", Layer:2},

        shopItem:{Name:"shopItem", Layer:2},
        missionItem:{Name:"missionItem", Layer:2},
        achieveItem:{Name:"achieveItem", Layer:2},

        gameInUI:{Name:"gameInUI", Layer:0},

        guide:{Name:"guide", Layer:6},

        jinbi:{Name:"jinbi", Layer:9},

        exchangeCoinUI: {Name: "exchangeCoinUI", Layer: 3},

        newRecordUI: {Name: "newRecordUI", Layer: 1},

        vipUI: {Name: "VIP", Layer: 2},

        maxLevel: {Name: "maxLevel", Layer: 1},

        starterBundleUI: {Name: "starterBundle", Layer: 2},

        updateAvailable: {Name: "updateAvailable", Layer: 2},

        enjoyNature: {Name: "enjoyNature", Layer: 2},

        compensationUI: {Name: "compensationUI", Layer: 2},

        coinBundle: {Name: "coinBundle", Layer: 4},
        offlineBundle: {Name: "offlineBundle", Layer: 4},
        removeAdBundle: {Name: "removeAdBundle", Layer: 4},
        specialGridBundle: {Name: "specialGridBundle", Layer: 4},
        unlockAllBundle: {Name: "unlockAllBundle", Layer: 4},
        rankingUI: {Name: "rankingUI", Layer: 2},

        adsBlocker: {Name: "adsBlocker", Layer: 5},

        pauseUI: {Name: "pauseUI", Layer: 2}
    },
});
module.exports = uiConfig;
