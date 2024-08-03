var MyEnum = require('MyEnum')
var bullet = cc.Class({
  extends: cc.Component,

  properties: {
    speed: 0.2,
    power: 100,
    Sp: cc.Sprite,
    Atlas: cc.SpriteAtlas,
    tuowei: cc.Sprite,
    mask: cc.Node,
    bulletSkill: 0,
  },

  initData: function (plantData, zombieNode, plantNode) {
    this.node.setScale(0.8)
    this.plantNode = plantNode
    this.zombieNode = zombieNode
    this.power = plantData.power
    this.Sp.spriteFrame = this.Atlas.getSpriteFrame(plantData.spName)
    this.tuowei.node.color = plantData.color

    this.node.position = plantData.pos
    this.bulletType = plantData.bulletType
    var skilldata = plantData.skill.split('|')
    this.bulletSkill = 0

    var seed = Math.random()
    let skillRatio;
    if (skilldata[0] === "3") { // freeze
      skillRatio = plantData.enter_ice ? parseInt(skilldata[1]) * 2 : parseInt(skilldata[1]);
    } else if (skilldata[0] === "2"){ // double damage
      skillRatio = plantData.enter_crit ? parseInt(skilldata[1]) * 2 : parseInt(skilldata[1]);
    } else {
      skillRatio = parseInt(skilldata[1]);
    }
    var ratio = skillRatio / 100
    if (seed <= ratio) this.bulletSkill = parseInt(skilldata[0])

    this.isNeedMask = plantData.isNeedMask == 1 ? true : false
    this.isNeedTrail = this.bulletType == MyEnum.BulletType.Straight; // tempory code plantData.isNeedTrail == 1 ? true : false     false
    this.tuowei.node.width = 25
    this.mask.position = cc.v2(-5, 0)

    this.node.active = true;
    this.tuowei.node.active = this.isNeedTrail;
    this.zombieComponent = this.zombieNode.getComponent('zombie')

    this.plantLevel = plantData.level;

    this.startPos = this.node.position
    this.plantNodePos = this.plantNode.node.position
    if (this.bulletType == MyEnum.BulletType.Straight) {
      // duration timer
      this.durationTimer = 500
      let endPos = this.zombieComponent.getHitPosition()
      this.node.angle = -1 * (cc.Mgr.Utils.calculateAngle(endPos, this.startPos) + 90)
      if (this.isNeedTrail) {
        this.tuowei.node.position = cc.v2(90, 0)
        cc.tween(this.tuowei.node).to(0.3, {position: cc.v2(0, 0)}).start()
      }
    } else {
      this.durationTimer = 1000
      this.node.angle = 0;
      this.lastPos = this.startPos;
      this.t = 0;
    }
    this.currentTimer = Date.now()
    this.currentSpeedTimer = Date.now();

    this.Sp.node.angle = 30;
  },

  ObBackToPool: function (_flyOut) {
    if (_flyOut) { // tempory code
      let self = this;
      setTimeout(function() {
        cc.Mgr.BulletPool.ObBackToPool(self.node)
      }, 1)
    } else {
      cc.Mgr.BulletPool.ObBackToPool(this.node)
    }
  },

  twoBezier(t, p1, cp, p2) {
    let x = (1 - t) * (1 - t) * p1.x + 2 * t * (1 - t) * cp.x + t * t * p2.x;
    let y = (1 - t) * (1 - t) * p1.y + 2 * t * (1 - t) * cp.y + t * t * p2.y;
    return [x, y];
  },

  update () {
    // return; // tempory code
      if (this.zombieNode == null || this.zombieNode.activeInHierarchy === false) {
        this.ObBackToPool()
        return;
      }
      // tempory code
      if (this.plantLevel !== 55 && this.plantLevel !== 56 && this.plantLevel !== 57)this.Sp.node.angle += 20;
      let endPos = this.zombieComponent.getHitPosition()
      if (this.bulletType === MyEnum.BulletType.Straight) {
        this.node.x += (endPos.x - this.startPos.x) * 0.03;
        this.node.y += (endPos.y - this.startPos.y) * 0.03;
        this.node.angle = -1 * (cc.Mgr.Utils.calculateAngle(endPos, this.startPos) + 90);
      } else {
        if (this.plantNodePos.y > this.zombieNode.position.y) {
          this.middlePos = cc.v2(this.plantNodePos.x, this.plantNodePos.y + 400);
        } else {
          this.middlePos = cc.v2(this.plantNodePos.x, this.zombieNode.position.y + 400);
        }
        let pos = this.twoBezier(this.t, this.startPos, this.middlePos, endPos)
        this.node.x = pos[0]
        this.node.y = pos[1]
        // tempory code
        // var angle = cc.Mgr.Utils.calculateAngle(this.node.position, this.lastPos) + 90
        // this.node.angle = angle
        this.t += 0.017;

        this.lastPos = this.node.position;
      }

      if (Date.now() - this.currentSpeedTimer >= this.durationTimer) {
        this.zombieNode.getComponent('zombie').beAttack(this)
        this.ObBackToPool()
      }

      // let dis = cc.Mgr.Utils.pDistance(this.node.position, endPos)
      // if (dis <= 40 && this.zombieNode.activeInHierarchy) {
      //   this.zombieNode.getComponent('zombie').beAttack(this)
      //   this.ObBackToPool()
      // }
    if (!this.zombieNode.activeInHierarchy) {
      this.ObBackToPool()
      // this.plantNode.startAttack(); // tempory code
    }
      
  },
})
module.exports = bullet
