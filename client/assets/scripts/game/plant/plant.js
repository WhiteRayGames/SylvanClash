var MyEnum = require('MyEnum')
var DataType = require('DataType')
//植物类
var plant = cc.Class({
  extends: cc.Component,

  properties: {
    //龙骨
    dragon: dragonBones.ArmatureDisplay,
    //所在格子的下标
    index: 0,
    //等级
    level: 0,
    //待机，攻击的cd
    cd: 0,
    //攻击力
    power: 0,
    //离线收益
    offline: 0,
    //价格
    price: 0,
    //钻石价格
    gem: 0,
    //发射点位置，可能存在多个攻击动作，多个发射点
    shootPos: [cc.Vec2],
    //子弹颜色
    steakColor: '',
    //只能类型，1 减速目标1秒,2 双倍攻击, 3 眩晕目标1秒
    killType: 0,
    //发生技能的概率
    killProbability: 0,
    //位置
    pos: cc.Vec2,

    bulletType: 1,

    //龙骨动画的时间缩放率
    dragonTimeScale: 1,

    _IdleAnimName: 'idle',
    _AttackAnimName: 'attack',
    _generateEffectPos: cc.Vec2,

    generateEffectPosNode: cc.Node,
    //是否需要遮罩
    isNeedMask: true,
    //是否需要拖尾
    isNeedTrail: true,

    levelLabel: cc.Label,
    levelLabel_ru: cc.Label
  },

  onLoad () {
    this.nomalRangeY = 150;
    this.specialRangeY = 500;
    this.nomalRangeX = 220;
    this.specialRangeX = 500;
  },

  init (index, pos, plantData) {
    plantData.zoom = 0.75;
    if (plantData.level == 19) {
      plantData.zoom = 0.85;
    }
    this.dragonTimeScale = 1
    this.level = plantData.level
    this.pos = pos
    this.node.position = this.pos
    this.dragon.node.scaleX = plantData.zoom * -1
    this.dragon.node.scaleY = plantData.zoom
    this.levelLabel.string = 'Lv.' + this.level;
    // this.levelLabel_ru.string = 'Ур.' + this.level;
    this.plantData = plantData

    this.currentAttackNode = null;

    this.currentSpeed = 1;

    this.setIndex(index);

    this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
      if (cc.Mgr.plantMgr.autoMergeData && (cc.Mgr.plantMgr.autoMergeData.startIndex == this.index || cc.Mgr.plantMgr.autoMergeData.targetIndex == this.index)) return;
      cc.Mgr.plantMgr.hideTipAttackNode()
      cc.Mgr.plantMgr.showAttackRange(this.node);
      this.TouchStart(event)

      cc.Mgr.UIMgr.GameInUINode.getComponent("InGameUI").buyButtonNode.active = false;
      cc.Mgr.GameCenterCtrl.rubbishNode.active = true;
    }, this)

    this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
      if (cc.Mgr.plantMgr.autoMergeData && (cc.Mgr.plantMgr.autoMergeData.startIndex == this.index || cc.Mgr.plantMgr.autoMergeData.targetIndex == this.index)) return;
      this.TouchMove(event)
    }, this)

    this.node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
      if (cc.Mgr.plantMgr.autoMergeData && (cc.Mgr.plantMgr.autoMergeData.startIndex == this.index || cc.Mgr.plantMgr.autoMergeData.targetIndex == this.index)) return;
      cc.Mgr.plantMgr.hideTipAttackNode()
      cc.Mgr.plantMgr.hideAttackRange();
      this.TouchEnd(event)

      cc.Mgr.UIMgr.GameInUINode.getComponent("InGameUI").buyButtonNode.active = true;
      cc.Mgr.GameCenterCtrl.rubbishNode.active = false;
    }, this)

    this.node.on(cc.Node.EventType.TOUCH_UP, function (event) {
      if (cc.Mgr.plantMgr.autoMergeData && (cc.Mgr.plantMgr.autoMergeData.startIndex == this.index || cc.Mgr.plantMgr.autoMergeData.targetIndex == this.index)) return;
      cc.Mgr.plantMgr.hideAttackRange();
      this.TouchEnd(event)
    }, this)

    this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
      if (cc.Mgr.plantMgr.autoMergeData && (cc.Mgr.plantMgr.autoMergeData.startIndex == this.index || cc.Mgr.plantMgr.autoMergeData.targetIndex == this.index)) return;
      cc.Mgr.plantMgr.hideTipAttackNode()
      cc.Mgr.plantMgr.hideAttackRange();
      this.TouchEnd(event)
    }, this)

    this.node.zIndex = 50 + index

    this.isCompounded = false

    this.setRageEffect();
    this.setFlameEffect();
    this.setFreezeEffect();
    this.setCritEffect();

    cc.Mgr.DragonMgr.create(1, this.dragon)
    this.playIdleAnim()
    this.state = MyEnum.PlantState.idle
    this.dragon.on(dragonBones.EventObject.FRAME_EVENT, this.onFrameEvent, this)
    this.dragon.on(dragonBones.EventObject.COMPLETE, this.attackCompleteDone, this)

    this._generateEffectPos.x = this.generateEffectPosNode.position.x
    this._generateEffectPos.y = this.generateEffectPosNode.position.y

    this.curShootIndex = 0

    this.currentTimer = Date.now();

    this.levelLabel.node.active = cc.Mgr.Config.language != "Russian";
    // this.levelLabel_ru.node.active = cc.Mgr.Config.language === "Russian";
    this.levelLabel_ru.node.active = false;
  },

  setRageEffect: function () {
    if (this.rageEffectNode) return
    if (!cc.Mgr.plantMgr.ragePrefab) return;
    this.rageEffectNode = cc.instantiate(cc.Mgr.plantMgr.ragePrefab)
    this.rageEffectNode.parent = this.node
    this.rageEffectNode.position = cc.v2(0, 20)
    this.rageEffectNode.active = cc.Mgr.game.rageTimer > 0;
    
    if (this.index === 12) {
      this.rageEffectNode.setScale(1);
    } else {
      this.rageEffectNode.setScale(.7);
    }
  },

  setFlameEffect: function () {
    if (this.flameEffectNode) return
    if (!cc.Mgr.plantMgr.flamePrefab) return;
    this.flameEffectNode = cc.instantiate(cc.Mgr.plantMgr.flamePrefab)
    this.flameEffectNode.parent = this.node
    this.flameEffectNode.position = cc.v2(0, 20)
    this.flameEffectNode.active = cc.Mgr.game.fireTimer > 0;
    if (this.index === 12) {
      this.flameEffectNode.setScale(1.3);
    } else {
      this.flameEffectNode.setScale(1);
    }
  },

  setFreezeEffect: function () {
    if (this.freezeEffectNode) return
    if (!cc.Mgr.plantMgr.freezePrefab) return;
    this.freezeEffectNode = cc.instantiate(cc.Mgr.plantMgr.freezePrefab)
    this.freezeEffectNode.parent = this.node
    this.freezeEffectNode.position = cc.v2(0, 20)
    this.freezeEffectNode.active = cc.Mgr.game.iceTimer > 0;
    this.freezeEffectNode.zIndex = -1;
    this.freezeEffectNode.setScale(0.7);
  },

  setCritEffect: function () {
    if (this.critEffectNode) return
    if (!cc.Mgr.plantMgr.critPrefab) return;
    this.critEffectNode = cc.instantiate(cc.Mgr.plantMgr.critPrefab)
    this.critEffectNode.parent = this.node
    this.critEffectNode.position = cc.v2(0, 0)
    this.critEffectNode.active = cc.Mgr.game.critTimer > 0;
    this.critEffectNode.setScale(0.7);
  },

  setShowDetailsInUI: function (scale, color, isBig = true) {
    // this.node.getChildByName('Level').active = false
    this.levelLabel.node.active = this.levelLabel_ru.node.active = false;
    this.node.getChildByName('shadow').active = false
    this.dragon.node.color = cc.Mgr.Utils.hexToColor(color)
    if (isBig)
      this.dragon.playAnimation(this._IdleAnimName, -1)
      this.dragon.node.setScale(scale);
    this.node.scaleX = -1
    this.node.scaleY = 1
  },

  changeAngryState: function (enter) {
    if (this.enter_rage == enter) return;

    this.setRageEffect();

    this.rageEffectNode.active = enter;
    this.enter_rage = enter;
    if (this.index === 12) { // vip
      this.dragonTimeScale = cc.Mgr.game.rageTimer > 0 ? 1.5 * this.currentSpeed * 1.5 : 1.5 * this.currentSpeed;
      this.dragon.timeScale = this.dragonTimeScale;
    } else {
      this.dragonTimeScale = cc.Mgr.game.rageTimer > 0 ? 1.5 * this.currentSpeed : this.currentSpeed;
      this.dragon.timeScale = this.dragonTimeScale;
    }
  },

  changeFireState: function (enter) {
    if (this.enter_fire == enter) return;

    this.setFlameEffect();

    this.flameEffectNode.active = enter;

    this.enter_fire = enter;
    if (this.index === 12) { // vip
      this.currentPower = cc.Mgr.game.fireTimer > 0 ? this.plantData.power * BigInt(6) / BigInt(5) * BigInt(9) / BigInt(6) : this.plantData.power * BigInt(6) / BigInt(5);
    } else {
      this.currentPower = cc.Mgr.game.fireTimer > 0 ? this.plantData.power * BigInt(9) / BigInt(6) : this.plantData.power;
    }
  },

  changeIceState: function (enter) {
    this.enter_ice = enter;

    this.setFreezeEffect();

    this.freezeEffectNode.active = enter;
  },

  changeCritState: function (enter) {
    this.enter_crit = enter;

    this.setCritEffect();

    this.critEffectNode.active = enter;
  },

  setPosition (pos) {
    this.node.position = pos
  },

  setIndex (index) {
    this.index = index
    this.node.zIndex = 50 + index
    if (this.index === 12) { // vip
      this.currentPower = cc.Mgr.game.fireTimer > 0 ? this.plantData.power * BigInt(6) / BigInt(5) * BigInt(9) / BigInt(6) : this.plantData.power * BigInt(6) / BigInt(5);
      this.dragonTimeScale = cc.Mgr.game.rageTimer > 0 ? 1.5 * this.currentSpeed * 1.5 : 1.5 * this.currentSpeed;
      this.dragon.timeScale = this.dragonTimeScale;
    } else {
      this.currentPower = cc.Mgr.game.fireTimer > 0 ? this.plantData.power * BigInt(9) / BigInt(6) : this.plantData.power;
      this.dragonTimeScale = cc.Mgr.game.rageTimer > 0 ? 1.5 * this.currentSpeed : this.currentSpeed;
      this.dragon.timeScale = this.dragonTimeScale;
    }

    this.enter_ice = cc.Mgr.game.iceTimer > 0;
    this.enter_crit = cc.Mgr.game.critTimer > 0;

    if (index === 12) {
      this.dragon.node.scaleX = this.plantData.zoom * -1 * 1.3
      this.dragon.node.scaleY = this.plantData.zoom * 1.3
    } else {
      this.dragon.node.scaleX = this.plantData.zoom * -1
      this.dragon.node.scaleY = this.plantData.zoom
    }

    if (this.flameEffectNode) {
      if (this.index === 12) {
        this.flameEffectNode.setScale(1.3);
      } else {
        this.flameEffectNode.setScale(1);
      }
    }
    
    if (this.rageEffectNode) {
      if (this.index === 12) {
        this.rageEffectNode.setScale(1);
      } else {
        this.rageEffectNode.setScale(.7);
      }
    }
  },

  TouchStart (event) {
    if (cc.Mgr.plantMgr.plantMoveInfo.isMove) {
      return
    }

    if (cc.Mgr.game.needGuide && cc.Mgr.game.curGuideStep == MyEnum.GuideType.guide3
      && this.index != 7) {
      return
    }

    cc.Mgr.plantMgr.plantMoveInfo.isMove = true
    cc.Mgr.plantMgr.plantMoveInfo.index = this.index

    if (!this.isCompounded) {
      cc.Mgr.plantMgr.showPickLandBorder(true, this.level, this.index)
    }

    this.unscheduleAllCallbacks()
    this.currentAttackNode = null;
    this.playIdleAnim()

    this.lastZIndex = this.node.zIndex

    this.node.zIndex = 999
    this.isMoving = true;
    this.TouchStartCb(this)
  },

  TouchMove (event) {
    if (cc.Mgr.plantMgr.plantMoveInfo.isMove && cc.Mgr.plantMgr.plantMoveInfo.index == this.index) {
      let delta = event.touch.getDelta()
      this.node.x += delta.x
      this.node.y += delta.y
      if (cc.Mgr.plantMgr.attackRange.parent === this.node) {
        if (this.node.x > -190 && this.node.x < -120 && this.node.y > 120 && this.node.y < 190 && cc.Mgr.game.unlockSpecialGrid) {
          cc.Mgr.plantMgr.attackRange.setScale(3.5);
        } else {
          cc.Mgr.plantMgr.attackRange.setScale(1);
        }
      }
    }
  },

  TouchEnd (event) {
    cc.Mgr.plantMgr.plantMoveInfo.isMove = false
    cc.Mgr.plantMgr.plantMoveInfo.index = -1

    cc.Mgr.plantMgr.showPickLandBorder(false, this.level)
    if (!this.isCompounded) this.updateAttackList();
    this.node.zIndex = this.lastZIndex
    if (cc.Mgr.plantMgr.autoMergeData == undefined || cc.Mgr.plantMgr.autoMergeData.startIndex !== this.index && cc.Mgr.plantMgr.autoMergeData.targetIndex !== this.index)this.TouchEndCb(this)
    this.isMoving = false;
  },

  hasAttackObj () {
    return this.currentAttackNode != null
  },

  //播放待机动作
  playIdleAnim () {
    cc.Mgr.DragonMgr.playAnimation(MyEnum.DragonType.plant, this.dragon, this._IdleAnimName, true, this.dragonTimeScale)
    this.state = MyEnum.PlantState.idle
  },

  //播放攻击动作
  startAttack () {
    if (this.currentAttackNode === null  || this.currentAttackNode.activeInHierarchy == false) return

    if (cc.Mgr.GameCenterCtrl.pauseFight == true) return;

    this.node.scaleX = this.currentAttackNode.x > this.node.x ? -1 : 1
    this.levelLabel.node.scaleX = this.levelLabel_ru.node.scaleX = this.node.scaleX == 1 ? 1 : -1
    this.curShootIndex = this.curShootIndex >= this.plantData.shootPos.length ? 0 : this.curShootIndex
    let curShootAnimationName = this.plantData.shootPos.length === 1 ? this._AttackAnimName : this._AttackAnimName + (this.curShootIndex + 1)
    cc.Mgr.DragonMgr.playAnimation(MyEnum.DragonType.plant, this.dragon, curShootAnimationName, false, this.dragonTimeScale)
    this.state = MyEnum.PlantState.attacking
  },

  // 处理帧事件
  onFrameEvent: function (e) {
    if (e.name == 'A') {
      this.attackFrameDone()
    }
  },

  //正在被合成中
  compounded () {
    this.isCompounded = true
    this.unscheduleAllCallbacks()
    this.currentAttackNode = null;
    this.playIdleAnim()
  },

  //攻击动作播放完了之后行为
  attackCompleteDone: function (e) {
    this.updateAttackList();
    if (this.currentAttackNode != null) this.startAttack()
  },

  //攻击帧到了之后行为
  attackFrameDone: function () {
    if (this.currentAttackNode == null || this.currentAttackNode.activeInHierarchy == false) return

    var bulletObj = cc.Mgr.BulletPool.getObFromPool()
    bulletObj.parent = this.node.parent
    bulletObj.zIndex = 200
    var bullet = bulletObj.getComponent('bullet')
    var data = {}
    data.spd = cc.Mgr.game.bulletSpeed
    data.power = this.currentPower
    data.spName = this.plantData.head
    data.skill = this.plantData.skill
    data.level = this.plantData.level;
    data.enter_ice = this.enter_ice;
    data.enter_crit = this.enter_crit;

    data.isNeedMask = this.plantData.isNeedMask
    data.isNeedTrail = this.plantData.isNeedTrail
    data.bulletHeight = this.plantData.bulletHeight
    data.bulletNearLeftDis = this.plantData.bulletNearLeftDis
    data.bulletType = this.plantData.bulletType // MyEnum.BulletType.Straight//MyEnum.BulletType.Curve;

    var c = this.plantData.steakColor.replace('0x', '#')
    var color = cc.Color.BLACK
    color = color.fromHEX(c)
    data.color = color

    if (this.curShootIndex >= this.plantData.shootPos.length) {
      this.curShootIndex = 0
    }

    data.pos = cc.v2(this.node.x + this.plantData.shootPos[this.curShootIndex].x * this.node.scaleX * -1, this.node.y + this.plantData.shootPos[this.curShootIndex].y)
    bullet.initData(data, this.currentAttackNode, this)

    this.curShootIndex++
  },

  plantDestroy () {
    this.isCompounded = false
    cc.Mgr.DragonMgr.deleteDragon(MyEnum.DragonType.plant, this.dragon)
    this.node.destroy()
  },

  updateAttackList () {
    if (!cc.Mgr.ZombieMgr.zombieList) return;
    if (cc.Mgr.ZombieMgr.zombieList.indexOf(this.currentAttackNode) < 0) {
      this.currentAttackNode = null;
    }
    let currentRangeY = this.index === 12 ? this.specialRangeY : this.nomalRangeY;
    let currentRangeX = this.index === 12 ? this.specialRangeX : this.nomalRangeX;
    if (this.currentAttackNode != null) {
      // let dis = cc.Mgr.Utils.pDistance(this.node.position, this.currentAttackNode.position);
      let disX = Math.abs(this.node.position.x - this.currentAttackNode.position.x)
      let disY = Math.abs(this.node.position.y - this.currentAttackNode.position.y)
      if (disX > currentRangeX || disY > currentRangeY) this.currentAttackNode = null;
    } else {
      for (let i = 0; i < cc.Mgr.ZombieMgr.zombieList.length; i++) {
        let zombieNode = cc.Mgr.ZombieMgr.zombieList[i]
        // let dis = cc.Mgr.Utils.pDistance(this.node.position, zombieNode.position);
        let disX = Math.abs(this.node.position.x - zombieNode.position.x)
        let disY = Math.abs(this.node.position.y - zombieNode.position.y)

        if (disX <= currentRangeX && disY <= currentRangeY) {
          this.currentAttackNode = zombieNode;

          if (this.index == 0) {
            console.log("disX: " + disX + " - " + "disY: " + disY)
          }
          break;
        }
      }
    }
    
    if (this.currentAttackNode != null && this.state != MyEnum.PlantState.attacking) {
      this.startAttack();
    } else if (this.currentAttackNode == null && this.state != MyEnum.PlantState.idle) {
      this.playIdleAnim();
    }
  },

  update () {
    if (cc.Mgr.GameCenterCtrl.pauseFight == true)  {
      this.currentAttackNode = null;
      return;
    }
    if (this.currentAttackNode != null || this.isMoving) return;
    if (Date.now() - this.currentTimer >= 500) {
      this.updateAttackList();
      this.currentTimer = Date.now();
    }
  }
})
module.exports = plant
