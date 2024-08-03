var aniName = ["turn_table_arrow_in", "turn_table_arrow_dur", "turn_table_arrow_out"];
var turnArrow = cc.Class({
    extends: cc.Component,

    properties: {
        anima:cc.Animation,
    },

    playIn:function(){
        this.anima.play(aniName[0]);
    },

    InEnd:function(){
        this.anima.play(aniName[1]);
        this.scheduleOnce(function(){
            this.anima.play(aniName[2]);
        }, 2.67);
    },
});
module.exports = turnArrow;
