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

        priceLabelList: [cc.Label],
        gemLabelList: [cc.Label],
        topNode: cc.Node,
        topNode2: cc.Node,
        middleNode: cc.Node,
        middleNode2: cc.Node,
        bottomNode: cc.Node,
        bottomNode2: cc.Node,

        adCountLabelList: [cc.Label],
        spriteCoinList: [cc.Sprite],
        adFreeLabellist: [cc.Label],

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

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._scrollViewComponent = this.shopItemListView.getComponent('WaterfallFlow')
        this.shopItemDataList = []
        for (let i = 1; i <= cc.Mgr.Config.allPlantCount; i++) {
            this.shopItemDataList.push({ lv: i })
        }
        this.shopItemDataList.push({ lv: cc.Mgr.Config.allPlantCount + 1 })
        this._scrollViewComponent.setBaseInfo(this.shopItemDataList.length, 4, 12, 140, this.setShopList.bind(this))

        this.limitClick = this.node.getComponent('LimitClick');

        this.adGetGemsList = [5, 5, 5, 4, 4, 4, 3, 3, 3];
    },

    start() {
        this.toggleShopLabel.string = this.toggleShopLabel_2.string = cc.Mgr.Utils.getTranslation("payment-shop");
        this.toggleGemLabel.string = this.toggleGemLabel_2.string = cc.Mgr.Utils.getTranslation("payment-gem");
        this.freeLabel.string = cc.Mgr.Utils.getTranslation("btn-free");
        this.getLabel.string = cc.Mgr.Utils.getTranslation("btn-claim");

        for (let i = 0; i < this.adFreeLabellist.length; i++) {
            this.adFreeLabellist[i].string = cc.Mgr.Utils.getTranslation("btn-free");
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
        } else {
            this.title.active = true;
        }
    },

    showShop() {
        this._scrollViewComponent.clear();
        this._scrollViewComponent.scrollTo(cc.Mgr.game.plantMaxLv - 2);

        if (this.toggleShop.isChecked === false) this.toggleShop.isChecked = true;
        else this.onClickShop();
    },

    setShopList(_index, _updateIdx, _curShowIdxListLen) {
        if (_updateIdx == undefined) _updateIdx = -1

        let result;
        if (this.shopItemDataList.length <= 4) {
            result = this.shopItemDataList
        } else {
            let idx = (_updateIdx == -1) ? _index * 4 : _updateIdx * 4
            let endIdx = (_updateIdx == -1) ? idx + 4 : idx + _curShowIdxListLen * 4
            result = this.shopItemDataList.slice(idx, endIdx)
        }

        this._scrollViewComponent.updateShowList(result, 'shopItem', this)
    },

    showPayment() {
        if (this.toggleGems.isChecked === false) this.toggleGems.isChecked = true;
        else this.onClickGems();
    },

    showUI(_isPayment) {
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

        let coinNumber = cc.Mgr.UIMgr.getCoinNumber() * BigInt(30);
        coinNumber = coinNumber < BigInt(1000000) ? BigInt(1000000) : coinNumber;
        this.getCoin = coinNumber = coinNumber * BigInt(2);
        let coinString = cc.Mgr.Utils.getNumStr2(coinNumber);
        this.bottom_coins.string = coinString;

        this.bottom_btn_coins.string = cc.Mgr.payment.priceList[11];
        this.bottom_btn_gems.string = cc.Mgr.payment.priceList[0];

        this.blurBg.opacity = 0
        this.content.opacity = 0;
        this.content.setScale(.5)
        cc.tween(this.blurBg).to(0.05, { opacity: 255 }).call().start();
        cc.tween(this.content).to(0.15, { opacity: 255, scale: 1 }).start();

        this.adCountLabel.string = cc.Mgr.game.paymentAdCount + "/5";

        // cc.Mgr.admob.showBanner("payment");

        if (cc.Mgr.game.isVIP && cc.Mgr.game.vipDailyBonus) {
            // this.vipDailyBonusBtn.interactable = true;
            this.spriteBtn.setMaterial(0, this.nomarlM);
            this.getLabel.string = cc.Mgr.Utils.getTranslation("btn-claim");
        } else if (cc.Mgr.game.isVIP && !cc.Mgr.game.vipDailyBonus) {
            this.getLabel.string = cc.Mgr.Utils.getTranslation("btn-claimed");
            this.spriteBtn.setMaterial(0, this.grayM);
            // this.vipDailyBonusBtn.interactable = false;
        } else {
            this.spriteBtn.setMaterial(0, this.nomarlM);
            // this.vipDailyBonusBtn.interactable = true;
            this.getLabel.string = cc.Mgr.Utils.getTranslation("btn-claim");
        }

        this.bottom_desc.string = cc.Mgr.Utils.getTranslation("buy-gems-desc", [100]);

        for (let i = 0; i < this.priceLabelList.length; i++) {
            this.priceLabelList[i].string = cc.Mgr.payment.priceList[i];
            this.gemLabelList[i].string = "X" + cc.Mgr.payment.getGems[i];
        }
        this.bottom_price.string = cc.Mgr.payment.priceList[0];

        this.checkAvailabelAds = cc.Mgr.admob.checkAvailableRewardedAd();
        if (this.checkAvailabelAds) {
            this.spriteCoin.setMaterial(0, this.nomarlM);
        } else {
            this.spriteCoin.setMaterial(0, this.grayM);
        }

        this.topNode.active = true;
        this.middleNode.active = true;
        this.topNode2.active = false;
        this.middleNode2.active = false;
        this.bottomNode.active = true;
        this.bottomNode2.active = false;
    },

    onClickGetCoins() {
        if (this.limitClick.clickTime() == false) {
            return
        }

        let currentProductID = this.isSale ? 11 : 7;
        currentProductID = 11;

        cc.Mgr.payment.purchaseByIndex(currentProductID, () => {
            cc.Mgr.UIMgr.openAssetGetUI("money", this.getCoin, "payment");
            this.onClickClose();

        }, cc.Mgr.UIMgr.tipRoot);
    },

    updateItems() {
        this._scrollViewComponent.refreshAtCurPosition();
    },

    onClickShop() {
        this.toggleShop.node.zIndex = 3;
        this.toggleGems.node.zIndex = 1;

        this.shopView.active = true;
        this.paymentView.active = false;

        this._scrollViewComponent.clear();
        this._scrollViewComponent.scrollTo(cc.Mgr.game.plantMaxLv - 2);
    },

    onClickGems() {
        this.toggleGems.node.zIndex = 3;
        this.toggleShop.node.zIndex = 1;

        this.shopView.active = false;
        this.paymentView.active = true;
    },

    onClickClose() {
        cc.Mgr.AudioMgr.playSFX("click");
        // cc.Mgr.admob.hideBanner("payment");
        let self = this
        cc.tween(this.blurBg).to(0.15, { opacity: 0 }).start();
        cc.tween(this.content).to(0.15, { opacity: 0, scale: .5 }).call(() => {
            self.node.active = false;

            this.showCount++;
            if (this.showCount >= 3) {
                this.showCount = 0;

                // cc.Mgr.UIMgr.openTurnTableUI();
            }
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount("payment");
    },

    onClickAd(_event, _index) {
        if (this.limitClick.clickTime() == false) {
            return
        }

        if (this.checkAvailabelAds === false) {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("ad-tip-3"), "", this.node);
            return;
        }

        if (cc.Mgr.game.paymentAdCountList[_index] > 0) {
            let self = this
            cc.Mgr.admob.showRewardedVideoAd((function (_state) {
                if (_state) {
                    cc.Mgr.game.paymentAdCountList[_index]--;
                    let maxCount;
                    if (_index <= 2) {
                        maxCount = "1";
                    } else if (_index <= 5) {
                        maxCount = "2";
                    } else {
                        maxCount = "3";
                    }
                    self.adCountLabelList[_index].string = cc.Mgr.game.paymentAdCountList[_index] + "/" + maxCount;
                    if (cc.Mgr.game.paymentAdCountList[_index] > 0) {
                        self.spriteCoinList[_index].setMaterial(0, self.nomarlM);
                    } else {
                        self.spriteCoinList[_index].setMaterial(0, self.grayM);
                    }

                    cc.Mgr.UIMgr.openAssetGetUI("gem", self.adGetGemsList[_index], "payment_ads");
                } else {
                    // let data = {};
                    // data.elapsed = cc.Mgr.Utils.getDate9(true);
                    // data.adsType = "rewarded";
                    // data.feature = "free_gems";
                    // cc.Mgr.analytics.logEvent("ad_present_failed", JSON.stringify(data));
                }
            }), this.node, "payment", this);
        } else {
            this.spriteCoinList[_index].setMaterial(0, this.grayM);
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("payment-max-ad-count-tip"), "", this.node);
        }
    },

    onClickBottom() {
        if (this.limitClick.clickTime() == false) {
            return
        }

        cc.Mgr.payment.purchaseByIndex(0, (_gems) => {
            // cc.Mgr.admob.hideBanner("payment");
            let self = this
            cc.tween(this.blurBg).to(0.15, { opacity: 0 }).start();
            cc.tween(this.content).to(0.15, { opacity: 0, scale: .5 }).call(() => {
                self.node.active = false;
                cc.Mgr.UIMgr.reduceShowUICount("payment");
                cc.Mgr.UIMgr.openAssetGetUI("gem", _gems, "payment");
            }).start();
        }, this.node);
    },

    onClickPurchase(_event, _index) {
        if (this.limitClick.clickTime() == false) {
            return
        }
        cc.Mgr.payment.purchaseByIndex(_index, (_gems) => {
            // cc.Mgr.admob.hideBanner("payment");
            let self = this
            cc.tween(this.blurBg).to(0.15, { opacity: 0 }).start();
            cc.tween(this.content).to(0.15, { opacity: 0, scale: .5 }).call(() => {
                self.node.active = false;
                cc.Mgr.UIMgr.reduceShowUICount("payment");
                cc.Mgr.UIMgr.openAssetGetUI("gem", _gems, "payment");
            }).start();
        }, this.node);
    },

    onClickWatchAd() {
        if (this.limitClick.clickTime() == false) {
            return
        }
        if (this.checkAvailabelAds === false) {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("ad-tip-3"), "", this.node);
            // let data = {};
            // data.elapsed = cc.Mgr.Utils.getDate9(true);
            // data.adsType = "rewarded";
            // data.feature = "free_gems";
            // cc.Mgr.analytics.logEvent("ad_present_failed", JSON.stringify(data));
            return;
        }
        if (cc.Mgr.game.paymentAdCount > 0) {
            let self = this
            cc.Mgr.admob.showRewardedVideoAd((function (_state) {
                if (_state) {
                    cc.Mgr.game.paymentAdCount--;
                    self.adCountLabel.string = cc.Mgr.game.paymentAdCount + "/5";

                    cc.Mgr.UIMgr.openAssetGetUI("gem", 3, "payment_ads");

                    self.checkAvailabelAds = cc.Mgr.admob.checkAvailableRewardedAd();
                    if (self.checkAvailabelAds) {
                        self.spriteCoin.setMaterial(0, self.nomarlM);
                    } else {
                        self.spriteCoin.setMaterial(0, self.grayM);
                    }
                } else {
                    // let data = {};
                    // data.elapsed = cc.Mgr.Utils.getDate9(true);
                    // data.adsType = "rewarded";
                    // data.feature = "free_gems";
                    // cc.Mgr.analytics.logEvent("ad_present_failed", JSON.stringify(data));
                }
            }), this.node, "payment", this);
        } else {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("payment-max-ad-count-tip"), "", this.node);
        }
    },

    updateAdsBtnState() {
        this.checkAvailabelAds = cc.Mgr.admob.checkAvailableRewardedAd();
        if (this.checkAvailabelAds) {
            this.spriteCoin.setMaterial(0, this.nomarlM);
        } else {
            this.spriteCoin.setMaterial(0, this.grayM);
        }
    },

    onClickVIP() {
        cc.Mgr.UIMgr.openSpecialGridBundle();
        return;
        if (!cc.Mgr.game.isVIP) {
            // cc.Mgr.admob.hideBanner("payment");
            cc.Mgr.UIMgr.openVipUI();
            let self = this
            cc.tween(this.blurBg).to(0.15, { opacity: 0 }).start();
            cc.tween(this.content).to(0.15, { opacity: 0, scale: .5 }).call(() => {
                self.node.active = false;
            }).start();

            return;
        }
        if (cc.Mgr.game.isVIP && !cc.Mgr.game.vipDailyBonus) {
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("vip-tip"), "", this.node);
            return;
        }

        this.spriteBtn.setMaterial(0, this.grayM);
        this.getLabel.string = cc.Mgr.Utils.getTranslation("btn-claimed");
        cc.Mgr.UIMgr.openAssetGetUI("gem", 30, "payment");
        cc.Mgr.game.vipDailyBonus = false
    }

    // update (dt) {},
});
