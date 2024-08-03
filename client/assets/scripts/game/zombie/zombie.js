var zState = require('zombie_state')
var zConfig = require('zombie_config')
var MyEnum = require('MyEnum')
var bigDecimal = require('js-big-decimal');
var EffectType = require('EffectType')
var DragonType = require('DragonType')
var attackEffect = require('attackEffect')
var vertigoEffect = require('vertigo')
var zombie = cc.Class({
  extends: cc.Component,

  properties: {
    id: 1,
    hp: 100,
    money: 100,
    spd: 0.5,
    prefab: '',
    gender: '',
    dragon: dragonBones.ArmatureDisplay,
    dragonParent: cc.Node,

    state: {
      default: zState.WALK,
      type: zState,
    },
    //当前所处的路径节点位置
    posIndex: 0,

    hpBar: cc.ProgressBar,

    slowState: false,
    vertigoState: false,

    attackEffect: attackEffect,
    vertigoEffect: vertigoEffect,

    hasDie: false,
  },

  start () {

  },

  showComing() {
    this.dragonParent.setScale(2)
    this.hpBar.node.active = false;
    this.vertigoEffect.node.active = false;
    this.attackEffect.node.active = false
  },

  init: function (data, scale = 0.9, _shadow) {
    this.hasDie = false
    this.attackEffect.node.active = false
    this.vertigoEffect.node.active = false
    this.id = data.id
    this.node.scaleX = 1
    this.dragonParent.setScale(scale)
    this.hpBar.node.y = this.dragonParent.height * scale;
    this.vertigoEffect.node.y = this.dragonParent.height * scale - this.vertigoEffect.node.height / 2;
    this.totalHp = data.hp;
    this.hp = data.hp
    this.spd = data.spd

    if (!this.shadow && _shadow) {
      this.shadow = _shadow
      _shadow.parent = this.node
      _shadow.zIndex = -1
      _shadow.y += _shadow.height / 2;
    }
    this.shadow.setScale(scale)

    this.isSetZIndex = false
    this.isSetZIndex_2 = false
    this.isInList = false;

    this.spd = cc.Mgr.Config.cgZombieData.spd // tempory code
    this.money = data.money * BigInt(4) / BigInt(5);

    this.prefab = data.prefab
    this.posIndex = 0
    this.node.position = zConfig.posList[this.posIndex]

    this.hpBar.progress = 1.0

    this.dragon.timeScale = 1

    this.slowState = false
    this.vertigoState = false
    this.hexToColor('#ffffff')

    //设置血条高度
    // this.hpBar.node.position = cc.v2(0,this.node.height+20);
    this.hpBar.node.getChildByName('bar').height = 15
    //设置被攻击特效位置
    // this.attackEffect.node.position = cc.v2(0,this.node.height/2);
    // //设置眩晕特效位置
    // this.vertigoEffect.node.position = cc.v2(0,this.node.height);

    this.attackEffect.node.scaleX = 1
    this.vertigoEffect.node.scaleX = 1
    this.hpBar.node.scaleX = 1

    this.spdStep_3_Ratio = 1
  },

  getHitPosition () {
    return cc.v2(this.node.x, this.node.y + this.attackEffect.node.y)
  },

  start () {
    cc.Mgr.DragonMgr.create(DragonType.Zombie, this.dragon)
    //this.moveToNextPos();
  },

  pause () {
    this.node.pauseAllActions();
  },

  resume () {
    this.node.resumeAllActions();
  },

  moveToNextPos: function () {
    if (cc.Mgr.GameCenterCtrl.pauseFight == true) return;

    this.node.stopAllActions()
    if (!this.hasDie && this.posIndex == zConfig.posList.length - 1) {
      cc.Mgr.ZombieMgr.zombieEscape()
      this.node.stopAllActions()
      this.unschedule(this.vertigoCallBack)
      this.unschedule(this.slowMoveCallBack)
      cc.Mgr.ZombieMgr.backToPool(this.node, this.id)
      return
    }

    if (this.posIndex > 0 && this.isInList == false) {
      cc.Mgr.ZombieMgr.zombieList.push(this.node);
      this.isInList = true;
    }

    if (this.posIndex > 1 && this.isSetZIndex === false) {
      this.node.zIndex = cc.Mgr.ZombieMgr.moveZIndex
      cc.Mgr.ZombieMgr.moveZIndex++
      this.isSetZIndex = true
    }

    if (this.posIndex > 4 && this.isSetZIndex_2 === false) {
      this.node.zIndex = cc.Mgr.ZombieMgr.moveZIndex_2
      cc.Mgr.ZombieMgr.moveZIndex_2++
      this.isSetZIndex_2 = true
    }

    var spdRatio = this.posIndex === 4 ? 0.5 : 1
    if (this.slowState)
      spdRatio = this.posIndex === 4 ? 0.25 : 0.5
    if (this.vertigoState) spdRatio = 0.001
    else {
      spdRatio *= 0.6
    }

    var pDis = cc.Mgr.Utils.pDistance(this.node.position, zConfig.posList[this.posIndex + 1])
    var durTime = pDis / (this.spd * cc.Mgr.game.zombieSpeedCoefficient * spdRatio * this.spdStep_3_Ratio)

    var action = cc.moveTo(durTime, zConfig.posList[this.posIndex + 1])
    var seq = cc.sequence(action,
      cc.callFunc(function () {

        this.posIndex += 1
        if (this.posIndex < zConfig.posList.length) {
          if (this.posIndex == 4) {
            this.node.scaleX = this.node.scaleX * -1
            this.attackEffect.node.scaleX = -1
            this.vertigoEffect.node.scaleX = -1
            this.hpBar.node.scaleX = -1

            //到3位置，需要加速40个像素距离，达到和花花一样效果
            var pDis = cc.Mgr.Utils.pDistance(this.node.position, zConfig.posList[this.posIndex + 1])
            var durTime = pDis / (this.spd * cc.Mgr.game.zombieSpeedCoefficient)
            var dt = 40 / (this.spd * cc.Mgr.game.zombieSpeedCoefficient)
            this.spdStep_3_Ratio = (pDis / (durTime - dt)) / (this.spd * cc.Mgr.game.zombieSpeedCoefficient)
          } else {
            this.spdStep_3_Ratio = 1
          }
          this.moveToNextPos()
        } else {
          if (!this.hasDie) {
            cc.Mgr.ZombieMgr.zombieEscape()
            this.node.stopAllActions()
            this.unschedule(this.vertigoCallBack)
            this.unschedule(this.slowMoveCallBack)
            cc.Mgr.ZombieMgr.backToPool(this.node, this.id)
          }
        }
      }, this)
    )
    this.node.runAction(seq)

    if (this.posIndex === 6) {
      let index = cc.Mgr.ZombieMgr.zombieList.indexOf(this.node)
      if (index >= 0)cc.Mgr.ZombieMgr.zombieList.splice(index,1);
    }
  },

  //子弹效果
  hexToColor: function (hex) {
    //"#009EEC"
    this.dragon.node.color = cc.Mgr.Utils.hexToColor(hex)
  },

  slowMoveCallBack: function () {
    this.slowState = false
    this.dragon.timeScale = 1
    this.moveToNextPos()
    this.hexToColor('#ffffff')
  },

  //减速
  slowMove: function () {
    if (this.slowState || this.vertigoState)
      return

    this.unschedule(this.vertigoCallBack)
    this.unschedule(this.slowMoveCallBack)

    this.slowState = true
    this.dragon.timeScale = 0.5
    this.moveToNextPos()
    this.hexToColor('#78C7CA')
    //this.schedule(this.slowMoveCallBack, 1, 1, 1);
    this.scheduleOnce(this.slowMoveCallBack, 1)
  },

  vertigoCallBack: function () {
    this.vertigoEffect.closeEffect()
    this.vertigoState = false
    this.dragon.timeScale = 1
    this.moveToNextPos()
    this.hexToColor('#ffffff')
  },

  //眩晕
  vertigo: function () {
    if (this.slowState || this.vertigoState)
      return

    this.unschedule(this.vertigoCallBack)
    this.unschedule(this.slowMoveCallBack)

    this.vertigoState = true
    this.playVertigoEffect()
    this.dragon.timeScale = 0.001
    this.moveToNextPos()
    this.hexToColor('#009EEC')
    //this.schedule(this.vertigoCallBack, 1, 1, 1);
    this.scheduleOnce(this.vertigoCallBack, 1)
  },

  //被子弹攻击
  beAttack (sc) {
    // var sc = other.getComponent("bullet");

    this.hp -= sc.power

    this.playAttackExploreEffect()

    cc.Mgr.AudioMgr.playSFX(MyEnum.AudioType.hit)
    if (this.hp > BigInt(0)) {
      switch (sc.bulletSkill) {
        case MyEnum.BulletSkillType.Slow:
          cc.Mgr.AudioMgr.playSFX(MyEnum.AudioType.skill_slow)
          this.slowMove()
          break
        case MyEnum.BulletSkillType.DouKill:
          cc.Mgr.AudioMgr.playSFX(MyEnum.AudioType.skill_crit)
          this.playCrickEffect()
          this.hp -= sc.power
          break
        case MyEnum.BulletSkillType.Vertigo:
          cc.Mgr.AudioMgr.playSFX(MyEnum.AudioType.skill_freeze)
          this.vertigo()
          break
      }

    }
    if (!this.hasDie)
    {
      if (this.hp <= BigInt(0)) {
        this.hasDie = true
        this.hpBar.progress = 0
        this.node.stopAllActions()
        this.playDieSmokeEffect()
        this.unschedule(this.vertigoCallBack)
        this.unschedule(this.slowMoveCallBack)
        cc.Mgr.ZombieMgr.backToPool(this.node, this.id, this.hp)
        let index = cc.Mgr.ZombieMgr.zombieList.indexOf(this.node)
        if (index >= 0)cc.Mgr.ZombieMgr.zombieList.splice(index,1);
      } else {
        this.hpBar.progress = bigDecimal.divide(this.hp.toString(), this.totalHp.toString(), 2);
      }
    }
  },

  //死亡金币飘动效果
  playCoinFlyEffect: function () {
    var obj = cc.Mgr.EffectMgr.getObFromPool(EffectType.CoinFly)
    if (obj == null)
      return
    obj.parent = cc.Mgr.ZombieMgr.zombiesParent
    obj.active = true
    obj.zIndex = 999
    obj.y = this.node.y + this.node.height
    obj.x = this.node.x

    var money = this.money;
    if (cc.Mgr.game.doubleCoinState == true) {
      money = money * BigInt(3);
      this.scheduleOnce(this.flyCoinEffect, 0.35)
    }
    this.flyMoney = money
    var money2 = cc.Mgr.Utils.getNumStr2(this.flyMoney)
    obj.getComponent('coinFly').setData(money2)
    obj.scale = 1
    cc.Mgr.game.money += money;
    cc.Mgr.game.coin_gained_total += money;

    // let data = {}
    // data.elapsed = Date.now()
    // data.value = money;
    // data.feature = "monster";
    // data.double = "False";
    // cc.Mgr.analytics.logEvent("earn_coin", JSON.stringify(data));

    cc.Mgr.UIMgr.InGameUI.RefreshAssetData(false, "money");
    cc.tween(obj).to(0.1, {position: cc.v2(this.node.x, this.node.y + this.node.height + 30), scale: 0.8})
      .to(0.5, {position: cc.v2(this.node.x, this.node.y + this.node.height + 30 + 10)}).call(() => {
      cc.Mgr.EffectMgr.ObBackToPool(obj, EffectType.CoinFly)
    }).start()
  },

  flyCoinEffect: function () {
    var obj = cc.Mgr.EffectMgr.getObFromPool(EffectType.CoinFly)
    if (obj == null)
      return
    obj.parent = cc.Mgr.ZombieMgr.zombiesParent
    obj.active = true
    obj.zIndex = 101
    obj.y = this.node.y + this.node.height
    obj.x = this.node.x

    var money = this.flyMoney;
    var money2 = cc.Mgr.Utils.getNumStr2(money)
    obj.getComponent('coinFly').setData(money2)
    obj.scale = 1
    cc.tween(obj).to(0.1, {position: cc.v2(this.node.x, this.node.y + this.node.height + 30), scale: 0.8})
      .to(0.5, {position: cc.v2(this.node.x, this.node.y + this.node.height + 30 + 10)}).call(() => {
      cc.Mgr.EffectMgr.ObBackToPool(obj, EffectType.CoinFly)
    }).start()
  },

  //双倍攻击的 Crick
  playCrickEffect: function () {
    var obj = cc.Mgr.EffectMgr.getObFromPool(EffectType.Crick)
    obj.active = true
    if (obj == null)
      return
    obj.parent = cc.Mgr.ZombieMgr.zombiesParent
    obj.zIndex = 101
    obj.y = this.node.y + this.node.height / 2 - 10
    obj.x = this.node.x
    obj.scale = 0.7
    obj.opacity = 255

    cc.tween(obj).to(0.6, {position: cc.v2(this.node.x, this.node.y + this.node.height)})
      .call(() => {
        cc.Mgr.EffectMgr.ObBackToPool(obj, EffectType.Crick)
      }).start()
  },

  //播放被攻击时的效果
  playAttackExploreEffect: function () {
    this.attackEffect.node.active = true
    this.attackEffect.playAnimation()
  },

  //死亡飘烟
  playDieSmokeEffect: function () {
    var obj = cc.Mgr.EffectMgr.getObFromPool(EffectType.DieSmoke)
    obj.active = true
    if (obj == null)
      return
    obj.parent = cc.Mgr.ZombieMgr.zombiesParent
    obj.y = this.node.y + this.node.height / 2
    obj.x = this.node.x
    var self = this
    obj.getComponent('dieSmoke').playAnimation(function () {
      self.playCoinFlyEffect()
    })
  },

  //晕眩效果
  playVertigoEffect: function () {
    this.vertigoEffect.node.active = true
    this.vertigoEffect.playAnimation()
  },
})
module.exports = zombie
