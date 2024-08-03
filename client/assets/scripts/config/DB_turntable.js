var DB_turntable = cc.Class({
    name: "DB_turntable",
    statics: {
    	dataLen:11,
		dataHead:'["id", "type", "rarity", "weight", "rewards"]', 
		data:'{"1":[1,"coin","C",8,-7.0],"2":[2,"coin","B",4,-6.0],"3":[3,"coin","A",2,-5.0],"4":[4,"coin","S",1,-4.0],"5":[5,"plant","C",8,-7.0],"6":[6,"plant","B",4,-6.0],"7":[7,"plant","A",2,-5.0],"8":[8,"plant","S",1,-4.0],"9":[9,"gem","S",2,10.0],"10":[10,"buff","A",2,300.0],"11":[11,"drone","C",8,1.0]}'
	},
});
module.exports = DB_turntable;