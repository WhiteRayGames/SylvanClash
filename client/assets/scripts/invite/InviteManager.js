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
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        cc.Mgr.inviteManager = this;
    },

    getFriendsList () {
        this.friendsList = [];
        return;
    },

    shuffle(arr) {
        if (arr == null) return null;
        var length = arr.length,
        randomIndex,
        temp;
        while (length) {
            randomIndex = Math.floor(Math.random() * (length--));
            temp = arr[randomIndex];
            arr[randomIndex] = arr[length];
            arr[length] = temp
        }
        return arr;
    },

    sendInvitations (_feature) {
        if (this.friendsList == null) return;
        if (this.friendsList.length <= 0) return;

        returnl

        if (this.startIndex >= this.friendsList.length) {
            this.startIndex = 0;
            return;
        }

        let friend = this.friendsList[this.startIndex];
        this.sendInvitation("resources/tex/shareImage_4.png", friend.id, "Guess what " + "PlayerName" + " just got！", 'Check', _feature);
    },

    sendInvitation (_image, _playerId, _content, _btnText, _feature, _callback) {
        cc.Mgr.Utils.getBase64Image(_image, (_data) => {
            Wortal.context.updateAsync({
                image: _data,
                text: _content,
                caption: _btnText,
                data: {
                    entryPoint: "invitation",
                    feature: _feature
                }
            }).then(() => {
                // cc.Mgr.game.updateMissionProgressById(MissionType.InviteCount);
                // cc.Mgr.game.updateAchieveProgressByType(AchieveType.Invite);
                // cc.Mgr.UIMgr.InGameUI.checkMissionAchieveTip();

                this.startIndex++;
                _callback && _callback(true);

                let data = {}
                data.elapsed = cc.Mgr.Utils.getDate9(true)
                data.stage = cc.Mgr.game.level
                data.feature = _feature || "none"
                cc.Mgr.analytics.logEvent("share_message", JSON.stringify(data));
            }).catch((error) => {
                console.log(error);

                _callback && _callback(false);
            });
        });
    }
  

    // update (dt) {},
});
