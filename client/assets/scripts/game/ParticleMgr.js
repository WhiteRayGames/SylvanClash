
var ParticleMgr = cc.Class({
    extends: cc.Component,

    statics:{
        handles_:[],

        create:function(particle){
            var index = this.handles_.indexOf(particle);
            if(index > -1)
                return;
            this.handles_.push(particle);
        },

        playParticle:function(particle){
            var index = this.handles_.indexOf(particle);
            if(index > -1)
            {
                this.handles_[index].active = true;
                this.handles_[index].resetSystem();
            }
        },

        stopParticle:function(){
            var index = this.handles_.indexOf(particle);
            if(index > -1)
            {
                this.handles_[index].active = false;
                this.handles_[index].stopSystem();
            }
        },

        deleteParticle:function(particle){
            var index = this.handles_.indexOf(particle);
            if (index > -1) { 
                this.handles_.splice(index, 1);
            }
        },
    }
});
module.exports = ParticleMgr;
