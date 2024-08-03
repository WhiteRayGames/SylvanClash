// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

var Base64 = require('js-base64').Base64
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
        cc.Mgr.payment = this;
    },

    start () {
        this.priceList = ["50 Stars", "150 Stars", "250 Stars", "600 Stars", "1500 Stars", "2500 Stars", "400 Stars", "100 Stars", "250 Stars", "100 Stars", "50 Stars", "50 Stars", "150 Stars", "50 Stars", "200 Stars", "50 Stars"];
        this.priceValueList = [50, 150, 250, 600, 1500, 2500, 400, 100, 250, 100, 50, 50, 150, 50, 200, 50];
        this.getGems = [100, 360, 700, 2000, 5400, 10000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.productsIDList = ["gem_01", "gem_02", "gem_03", "gem_04", "gem_05", "gem_06", "vip_subscription_01", "purchase.coin_01", "special_grid", "remove_ad", "triple_offline",
            "purchase.coin_02", "special_grid_02", "remove_ad_02", "vip_subscription_02", "unlock_all_grids"]
        this.productsNameList = ["100 Gems", "360 Gems", "700 Gems", "2000 Gems", "5400 Gems", "10000 Gems", "VIP", "Coin Bundle", "Unlock Fort", "Remove Ads", "Triple Offline", "Coin Bundle", "Unlock Fort", "Remove Ads", "VIP", "Unlock All Plots"];

        this.purchaseTimer = 0;
    },

    // google play test android.test.purchased
    purchaseByIndex (_index, _callback, _tipParent) {
        this.tipParent = _tipParent;
        this.index = _index;
        let curProductID = this.productsIDList[_index];
        this.callback = _callback

        if (cc.Mgr.Config.isTelegram) {
            this.purchase(curProductID);
        } else {
            this.callback(this.getGems[_index])
        }
    },

    purchase (_productId) {
        this.purchaseProductID = _productId;

        const requestBody = JSON.stringify({
            user_id: window.Telegram.WebApp.initDataUnsafe.user.id,
            product_name: this.productsNameList[this.index],
            amount: this.priceValueList[this.index]
        });

        let data = {}
        data.elapsed = cc.Mgr.Utils.getDate9(true)
        data.productName = this.purchaseProductID
        cc.Mgr.analytics.logEvent("purchase_start", JSON.stringify(data));

        cc.Mgr.UIMgr.showLoading(true);
        cc.Mgr.game.pauseGame();

        cc.Mgr.http.httpPost("https://tg-api-service.lunamou.com/orders/create", requestBody, (error, response) => {
            if (error == true) {
                // failed
                cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("payment-failed"), "", this.tipParent);

                // data = {}
                // data.elapsed = cc.Mgr.Utils.getDate9(true)
                // data.productName = this.purchaseProductID
                // data.reason = error.message;
                // cc.Mgr.analytics.logEvent("purchase_failed", JSON.stringify(data));

                cc.Mgr.UIMgr.hideLoading();
                this.callback = null;
                return;
            }

            data = JSON.parse(response);
            if (data && data.invoice_url) {
                window.Telegram.WebApp.openInvoice(data.invoice_url, (status) => {
                    if (status === 'paid') {
                        this.checkOrderStatus(data.id);
                    } else if (status === 'failed') {
                        window.Telegram.WebApp.showAlert('Payment failed. Please try again.');
                        cc.Mgr.game.resumeGame();
                        cc.Mgr.UIMgr.hideLoading();
                        this.callback = null;
                    } else if (status === 'cancelled') {
                        window.Telegram.WebApp.showAlert('Payment was cancelled.');
                        cc.Mgr.game.resumeGame();
                        cc.Mgr.UIMgr.hideLoading();
                        this.callback = null;
                    } else {
                        window.Telegram.WebApp.showAlert('Unexpected payment status: ' + status);
                        cc.Mgr.game.resumeGame();
                        cc.Mgr.UIMgr.hideLoading();
                        this.callback = null;
                    }
                });
            } else {
                // failed
                cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("payment-failed"), "", this.tipParent);
                cc.Mgr.UIMgr.hideLoading();
                this.callback = null;
            }
        })
    },

    checkOrderStatus(orderId) {
        cc.Mgr.http.httpGets("https://tg-api-service.lunamou.com//orders/" + orderId + "/status", (error, response) => {
            if (error == true) {
                window.Telegram.WebApp.showAlert('Error checking order status. Please try again later.');
                return;
            }
            let data = JSON.parse(response);
            if (data.status === 'paid') {
                webapp.showAlert('Payment successful! Thank you for your purchase.');

                // success
                cc.Mgr.game.resumeGame();
                cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("payment-successful"), "", this.tipParent);
                this.callback(this.getGems[this.index]);
                cc.Mgr.game.isPayingUser = true;
                cc.Mgr.game.ltv += this.priceList[this.index];

                // let data = {}
                // data.elapsed = cc.Mgr.Utils.getDate9(true)
                // data.productName = this.purchaseProductID
                // cc.Mgr.analytics.logEvent("purchase_success", JSON.stringify(data));

                cc.Mgr.UIMgr.hideLoading();
                this.callback = null;
            } else if (data.status === 'pending') {
                setTimeout(() => this.checkOrderStatus(orderId), 5000);  // 5秒后再次检查
            } else {
                window.Telegram.WebApp.showAlert('Order status: ' + data.status + '. Please contact support if you have any questions.');
                cc.Mgr.game.resumeGame();
                cc.Mgr.UIMgr.hideLoading();
                this.callback = null;
            }
        })
    },

    updateVIPState(_date) {
        cc.Mgr.game.vipExpire = parseInt(_date);

        cc.Mgr.game.isVIP = cc.Mgr.game.vipExpire > Date.now();
        cc.Mgr.game.vip = cc.Mgr.game.isVIP ? "active" : "inactive";
    
        if (cc.Mgr.game.isVIP === true && cc.Mgr.game.vipStartTimer > 0 && Date.now() - cc.Mgr.game.vipStartTimer > 7 * 24 * 3600 * 1000) {
            let data = {}
            data.elapsed = cc.Mgr.Utils.getDate9(true)
            data.state = "convert"
            cc.Mgr.analytics.logEvent("vip_subscription", JSON.stringify(data));
            cc.Mgr.game.openSpecialGridCount = 0;
        } else if (cc.Mgr.game.isVIP === false && cc.Mgr.game.vipStartTimer > 0){
            let data = {}
            data.elapsed = cc.Mgr.Utils.getDate9(true)
            data.state = "unsubscribed"
            cc.Mgr.analytics.logEvent("vip_subscription", JSON.stringify(data));
            cc.Mgr.game.vipExpire = 0;
        } else if (cc.Mgr.game.isVip === true && cc.Mgr.game.vipStartTimer > 0 && Date.now() - cc.Mgr.game.vipStartTimer <= 7 * 24 * 3600 * 1000) {
            let data = {}
            data.elapsed = cc.Mgr.Utils.getDate9(true)
            data.state = "subscribed"
            cc.Mgr.analytics.logEvent("vip_subscription", JSON.stringify(data));
        }
    },

    update (dt) {
        if (this.purchaseTimer <= 0) return;

        if (this.canPurchase == true) {
            this.purchaseTimer = 0;
            this.purchase(this.purchaseProductID);
        }

        if (this.purchaseTimer > 0 && ((Date.now() - this.purchaseTimer) > 5000)) {
            this.purchaseTimer = 0;
            this.canPurchase = false;
            cc.Mgr.UIMgr.hideLoading();
            cc.Mgr.UIMgr.showPrompt(cc.Mgr.Utils.getTranslation("bad-connection"), "", this.tipParent);

            let data = {}
            data.elapsed = cc.Mgr.Utils.getDate9(true)
            data.productName = this.purchaseProductID
            data.reason = "network_connection_unstable";
            cc.Mgr.analytics.logEvent("purchase_failed", JSON.stringify(data));
        }
    }
});
