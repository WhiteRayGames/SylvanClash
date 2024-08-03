
//枚举类
var MyEnum = cc.Class({
    extends: cc.Component,

    statics:
    {
        //植物状态
        PlantState:
        {
            "idle":0,
            "cd":1,
            "attacking":2
        },
        //格子状态 0，空，1 植物，2，花盆 ，3，未解锁
        GridState:
        {
            "none":0,
            "plant":1,
            "flowerPot":2,
            "lock":3,
            "vip": 4,
            "vipLock": 5
        },
        //龙骨类型
        DragonType:
        {
            "plant":1,
            "zombie":2,
            "jinggai":3,
        },
        //子弹类型
        BulletType:
        {
            Straight:1,
            Curve:2
        },

        NodeGroup:{
            Zombie:"zombie",
            Bullet:"bullet",
            UI:"ui",
        },

        BulletSkillType:{
            Null:0,
            Slow:1,
            DouKill:2,
            Vertigo:3,
        },

        FlowerPotType:{
            //自然掉落
            Drop:0,
            //无人机
            Drone:1,
            //转盘
            Buy:2,
            //转盘
            Shop:3,
        },

        AudioType:
        {
            //背景音乐
            bgm:"bgm",
            //按钮点击
            click:"click",
            //金币奖励
            coin:"coin",
            //狗叫
            dog:"dog",
            //游戏失败
            fail:"fail",
            //花盆落下
            flower_pot_land:"flower-pot-land",
            //花盆打开
            flower_pot_tap:"flower-pot-tap",
            //获得钻石
            gem:"gem",
            //子弹打击到僵尸
            hit:"hit",
            //合成
            merge:"merge",
            //出场僵尸为猪
            pig:"pig",
            //飞机原地飞行
            plane:"plane",
            //技能暴击
            skill_crit:"skill-crit",
            //技能冰冻
            skill_freeze:"skill-freeze",
            //技能减数
            skill_slow:"skill-slow",
            //转盘指针转动
            spin:"spin",
            //防守Boss成功
            success1:"success1",
            //防守小波成功
            success2:"success2",
            //男僵尸
            zombie_lady:"zombie-lady",
            //女僵尸
            zombie_man:"zombie-man",
        },

        ShopItemType:{
            Lock:"U",
            Gem:"G",
            Ads:"AD",
            Money:"M",
            Null:"",
        },

        GuideType:
        {
            none:-1,
            guide1:0,
            guide2:1,
            guide3:2,
            guide4:3,
            guide5:4,
            guide6:5,
            guide7:6,
            guide8:7,

            // none:-1,
            // guide3:0,
            // guide4:1,
            // guide5:2,
        },
    },
});
module.exports = MyEnum;
