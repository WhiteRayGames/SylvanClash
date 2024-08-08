// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

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
        playerHead: cc.Sprite,
        userName: cc.Label,
        claimBtn: cc.Node,
        claimedNode: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.limitClick = this.node.getComponent('LimitClick');
    },

    setContent(_data) {
        this.data = _data;
        cc.assetManager.loadRemote(_data.avatar_url, (err, texture) => {
            if (err == null) {
                var spriteFrame = new cc.SpriteFrame(texture);
                this.playerHead.spriteFrame = spriteFrame;
                this.playerHead.node.width = this.playerHead.node.height = 60;
            }
        });

        this.userName.string = _data.username;

        this.claimBtn.active = !_data.invitation_reward_claimed;
        this.claimedNode.active = _data.invitation_reward_claimed;
    },

    onClickClaim () {
        if (this.limitClick.clickTime() == false) {
            return;
        }

        const requestBody = JSON.stringify({
            reward_id: this.data.id
        });

        let url = cc.Mgr.Config.isDebug ? "https://tg-api-service-test.lunamou.com/invitation-reward/claim" :
            "https://tg-api-service.lunamou.com/invitation-reward/claim";
        cc.Mgr.http.httpPost(url, requestBody, (error, response) => {
            if (error == true) {

                return;
            }

            let gems = cc.Utils.getCurrentShareReward();
            cc.Mgr.game.gems += gems;
            cc.Mgr.game.gem_gained_total += gems;
            cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "gem");
            cc.Mgr.UIMgr.showGemsEffect();

            this.data.invitation_reward_claimed = true;

            this.setContent(this.data);
        });
    }

    // update (dt) {},
});
