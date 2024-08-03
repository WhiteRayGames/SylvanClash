// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

var MySprite = require("MySprite");
var DataType = require("DataType");
var AtlasType = require("AtlasType");
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

        rankingLabel: cc.Label,
        rankingImg_1: cc.Node,
        rankingImg_2: cc.Node,
        rankingImg_3: cc.Node,

        playerName: cc.Node,
        plantLevel: cc.Label,
        plantPhoto: MySprite,
        playerPhoto: cc.Sprite,
        isSelfNode: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    setParent: function (parent) {
        this.Parent = parent
    },

    setContent:function(_data){
        switch (_data.rank) {
            case 1:
                this.rankingLabel.node.active = false;
                this.rankingImg_1.active = true;
                this.rankingImg_2.active = false;
                this.rankingImg_3.active = false;
            break;
            case 2:
                this.rankingLabel.node.active = false;
                this.rankingImg_1.active = false;
                this.rankingImg_2.active = true;
                this.rankingImg_3.active = false;
            break;
            case 3:
                this.rankingLabel.node.active = false;
                this.rankingImg_1.active = false;
                this.rankingImg_2.active = false;
                this.rankingImg_3.active = true;
            break;
            default:
                this.rankingLabel.node.active = true;
                this.rankingImg_1.active = false;
                this.rankingImg_2.active = false;
                this.rankingImg_3.active = false;
                this.rankingLabel.string = _data.rank;
            break;
        }
        this.playerName.getComponent('ScrollLabel').setLabel(_data.player.name);
        this.plantLevel.string = "lv." + _data.formattedScore;
        let plantData = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.PlantData, _data.formattedScore);
        this.plantPhoto.setSprite(AtlasType.PlantHead, plantData.head);
        cc.assetManager.loadRemote(_data.player.photo, (err, texture) => {
            if (err == null) {
                var spriteFrame = new cc.SpriteFrame(texture);
                this.playerPhoto.spriteFrame = spriteFrame;
                this.playerPhoto.node.width = this.playerPhoto.node.height = 50;
            }
        });
        this.isSelfNode.active = _data.player.id == Wortal.player.getID();
    }

    // update (dt) {},
});
