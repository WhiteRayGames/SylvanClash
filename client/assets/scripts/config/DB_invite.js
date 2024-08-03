var DB_invite = cc.Class({
    name: "DB_invite",
    statics: {
    	dataLen:6,
		dataHead:'["id", "invitePeople", "gem"]', 
		data: '{"1":[1,1,5],"2":[2,2,8],"3":[3,3,10],"4":[4,5,25],"5":[5,8,45],"6":[6,12,60]}',
	},
});
module.exports = DB_invite;
