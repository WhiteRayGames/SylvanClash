var BulletPool = cc.Class({
    extends: cc.Component,

    properties: {
        obPrefab:cc.Prefab,
    },

    InitPool:function () {
        var self = this;
        this.pool = new cc.NodePool();
        cc.loader.loadRes("prefab/bullet/bullet", function (errmsg, prefab) {
            if (errmsg) {
                cc.error(errmsg.message || errmsg);
                return;
            }
            self.obPrefab = prefab;
            let initCount = 16; //初始化个数
            for (let i = 0; i < initCount; i++) {
                let bulletObj = cc.instantiate(prefab);
                self.pool.put(bulletObj);
            }
        });
        
    },

    clearList:function(){
        this.pool.clear();
    },

    getObFromPool:function(){
        let bullet = null;
        if (this.pool.size() > 0)
        {
            bullet = this.pool.get();
            bullet.active = false;
        } 
        else //不够再实例化新的
        { 
            bullet = cc.instantiate(this.obPrefab);
        } 
        return bullet;
    },

    ObBackToPool:function(bullet){
        this.pool.put(bullet);
    },
});
module.exports = BulletPool;
