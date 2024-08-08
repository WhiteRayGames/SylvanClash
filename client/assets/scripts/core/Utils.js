var DataType = require("DataType");
var Utils = cc.Class({
    extends: cc.Component,

    statics: {
        getCurrentShareReward: function() {
            let turnTableGems = 0;
            let airDropGems = 0;
            if (cc.Mgr.game.level <= 10) {
                turnTableGems = 5;
                airDropGems = 3;
            } else if (cc.Mgr.game.level <= 20) {
                turnTableGems = 5;
                airDropGems = 3;
            } else if (cc.Mgr.game.level <= 30) {
                turnTableGems = 10;
                airDropGems = 5;
            } else if (cc.Mgr.game.level <= 40) {
                turnTableGems = 15;
                airDropGems = 15;
            } else if (cc.Mgr.game.level <= 50) {
                turnTableGems = 30;
                airDropGems = 25;
            } else {
                turnTableGems = 60;
                airDropGems = 35;
            }

            return turnTableGems + airDropGems;
        },

        getShareDataList: function () {
            if (cc.Mgr.Config.isTelegram == false) return;
            let startIndex = 0;
            let endIndex = 0;
            if (cc.Mgr.Utils.shareData == null) {
                startIndex = 0;
                endIndex = 29;
            } else {
                startIndex = cc.Mgr.Utils.shareData.invitees.length;
                endIndex = ((cc.Mgr.Utils.shareData.invitees.length + 29) >= cc.Mgr.Utils.shareData.total) ? cc.Mgr.Utils.shareData.total - 1 : (cc.Mgr.Utils.shareData.invitees.length + 29);
            }
            let range = "?skip=" + startIndex + "&limit=" + endIndex;
            let url = cc.Mgr.Config.isDebug ? "https://tg-api-service-test.lunamou.com/user/" + window.Telegram.WebApp.initDataUnsafe.user.id + "/invitees" + range :
                "https://tg-api-service.lunamou.com/user/" + window.Telegram.WebApp.initDataUnsafe.user.id + "/invitees" + range;
            cc.Mgr.http.httpGets(url, (error, response) => {
                if (error == true) {

                    return;
                }

                if (cc.Mgr.Utils.shareData == null) {
                    cc.Mgr.Utils.shareData = JSON.parse(response);
                } else {
                    cc.Mgr.Utils.shareData.invitees.concat(JSON.parse(response).invitees);
                }

                if (cc.Mgr.Utils.shareData.invitees.length < cc.Mgr.Utils.shareData.total) {
                    this.getShareDataList();
                }
            });
        },

        getInvitedByData: function () {
            let url = cc.Mgr.Config.isDebug ? "https://tg-api-service-test.lunamou.com/user/" + window.Telegram.WebApp.initDataUnsafe.user.id + "/with-inviter" :
                "https://tg-api-service.lunamou.com/user/" + window.Telegram.WebApp.initDataUnsafe.user.id + "/with-inviter";
            cc.Mgr.http.httpGets(url, (error, response) => {
                if (error == true) {

                    return;
                }

                cc.Mgr.Utils.invitedByData = JSON.parse(response);
            });
        },

        //起先确定下引擎中使用string  是否会引用 format 方法
        init:function(){
            if (!String.prototype.format) {
                String.prototype.format = function () {
                    var args = arguments;
                    return this.replace(/{(\d+)}/g, function (match, number) {
                        return typeof args[number] != 'undefined' ? args[number] : "";
                    });
                };
            }
        },
        //输入一个数值 将这个数值转换为 时间格式  
        FormatNumToTime:function (num, short = false) {
            var hour = Math.floor(num / 3600); //时
            var min = Math.floor((num - hour * 3600) / 60);//分
            var sec = Math.floor(num - hour * 3600 - min *60); //秒
            var str1 = hour;
            var str2 = min;
            var str3 = sec;
            if(hour < 10)
            {
                str1 = "0" + hour;
            }
            if(min < 10)
            {
                str2 = "0" + min;
            }
            if(sec < 10)
            {
                str3 = "0" + sec;
            }
            var out = str1 + ":" + str2 + ":" + str3;
            if(short)
                out = str2 + ":" + str3;

            if(hour < 1)
                out = str2 + ":" + str3;
            
            return out;
        },

        //获取系统时间 时间从 1970年1月1号 00:00 起算  按秒算的
        GetSysTime:function(){
            return Math.round(Date.now() / 1000);
        },

        //输入秒数 返回当前离 2019.01.01 的间隔天数
        getDays:function(timestamp){
            var date = Math.floor(timestamp / 3600 / 24);
            return date;
        },

        //格式化数值
        FormatNum:function(num){
            num = num +'';
            var str = "";
            for(var i=num.length- 1,j=1;i>=0;i--,j++){  
                if(j%3==0 && i!=0){//每隔三位加逗号，过滤正好在第一个数字的情况  
                    str+=num[i]+",";//加千分位逗号  
                    continue;  
                }  
                str+=num[i];//倒着累加数字
            }  
            var out = str.split('').reverse().join("");//字符串=>数组=>反转=>字符串
            if(out[0] == ',')
                return out.splice(0,1)
            return out;
        },
        //获取翻译字段
        getTranslationLocal:function(desId){
            for (var prop in cc.director.NoticeText) {
                if(prop.toString() == desId)
                {
                    return cc.director.NoticeText[prop];
                }
            }
            var des = "翻译字段null";
            return des;
        },

        //获取翻译字段  desId  翻译表中的 key 值   param 表示参数列表  尽量插入数据不要超过五个
        getTranslation:function(desId, param = []){
            var des = desId;
            var dt = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.Translation, desId);
            if(dt == "" || dt == null)
                return desId;
            
            switch(cc.Mgr.Config.language)
            { 
                case "English":
                    des = dt;
                    break;
                case "Japanese":
                    des = dt;
                    break;
                case "Simplified Chinese":
                    // des = this.decodeUnicode(dt);
                    des = dt;
                    break;
                case "Traditional Chinese":
                    des = dt;
                    break;
                case "Russian":
                    des = dt;
                    break;
            }
            switch(param.length)
            { 
                case 0:
                    des = des;
                    break;
                case 1:
                    des = des.format(param[0]);
                    break;
                case 2:
                    des = des.format(param[0], param[1]);
                    break;
                case 3:
                    des = des.format(param[0], param[1], param[2]);
                    break;
                case 4:
                    des = des.format(param[0], param[1], param[2], param[3]);
                    break;
                case 5:
                    des = des.format(param[0], param[1], param[2], param[3], param[4]);
                    break;
            }
            return des;
        },

        //unicode码 decode
        decodeUnicode:function(str) {
            str = str.replace(/\\/g, "%");
            return unescape(str);
        },


        hexToColor:function (hex) {
            hex = hex.replace(/^#?/, "0x");
            var c = parseInt(hex);
            var r = (c >> 16);
            var g = ((c & 0x00FF00) >> 8);
            var b = ((c & 0x0000FF));
            return cc.color(r, g, b);
        },

        pAdd:function (v1, v2) {
            return cc.v2(v1.x + v2.x, v1.y + v2.y);
        },

        pDistance:function(v1, v2){
            let dx = Math.abs(v2.x - v1.x);
            let dy = Math.abs(v2.y - v1.y);
            return Math.sqrt((Math.pow(dx,2) + Math.pow(dy,2)));
        },

        calculateAngle:function(startPos, endPos)
        {
            let len_y = endPos.y - startPos.y;
            let len_x = endPos.x - startPos.x;
            let tan_yx = Math.abs(len_y / len_x);
            let temp = Math.atan(tan_yx) * 180/Math.PI;
            let angle = 0;
            if(len_y > 0 && len_x < 0){
                angle = temp - 90;
            }
            else if(len_y > 0 && len_x > 0){
                angle = -temp + 90;
            }
            else if(len_y < 0 && len_x < 0){
                angle = -temp - 90;
            }
            else if(len_y < 0 && len_x > 0){
                angle = temp + 90;
            }
            else if(len_y == 0 && len_x != 0){
                angle = len_x < 0 ? -90 : 90;
            }
            else if(len_x == 0 && len_y != 0){
                angle = len_y < 0 ? 180 : 0;
            }
            return angle;
        },

        scientificNotationToString(param)
        {
            let strParam = String(param)
            let flag = /e/.test(strParam)
            if (!flag) return strParam
        
            // 指数符号 true: 正，false: 负
            let sysbol = true
            if (/e-/.test(strParam)) {
            sysbol = false
            }
            // 指数
            let index = Number(strParam.match(/\d+$/)[0])
            // 基数
            let basis = strParam.match(/^[\d\.]+/)[0].replace(/\./, '')
        
            if (sysbol) {
            return basis.padEnd(index + 1, 0)
            } else {
            return basis.padStart(index + basis.length, 0).replace(/^0/, '0.')
            }
        },

        formatLoclPrice (_price) {
            _price = _price.split(",").join("");
            let symbol = _price.charAt(0);
            _price = _price.split(symbol).join("");
            let price = parseFloat(_price);
            return symbol + this.getNumStr(price);
        },

        numberFormat2: function (value) {
            var param = {};
            var k = 1000, sizes = ["", "K", "M", "G", "T", "P", "E", "Z", "Y", "aa", "bb", "cc", "dd", "ee", "ff", "gg", "hh", "ii", "jj", "kk", "ll", "mm", "nn", "oo", "pp", "qq", "rr", "ss", "tt", "uu", "vv", "ww", "xx", "yy", "zz"], i;
                if(value.toString().length <= 6){
                    // param.value = value.toString();
                    // param.unit = ''
                    param = this.numberFormat(value.toString());
                }else{
                    i = Math.floor((value.toString().length - 1) / 3); 
                    param.value = (Number(((value * BigInt(100) / BigInt(Math.pow(k, i)))).toString()) / 100).toFixed(2);
                    param.unit = sizes[i];
                }
            return param;
        },
        
         //获取数字的显示
        getNumStr2:function(num)
        {
            let numValue = this.numberFormat2(num);
            if (numValue.unit === '') {
                return "" + numValue.value;
            }
            let numStr = "" + numValue.value;
            let dotIndex = numStr.indexOf(".");
            if (dotIndex >= 0 && dotIndex !== 3) {
                numStr = numStr.substring(0, 4);
                while (numStr.length > 0) {
                    let char = numStr[numStr.length - 1];
                    if (char != "0" && char != ".") {
                        break;
                    }
                    numStr = numStr.substring(0, numStr.length - 1);
                    if (char === ".") break;
                }
            } else {
                numStr = numStr.substring(0, 3);
            }
            
            return numStr + numValue.unit;
        },

        numberFormat: function (value) {
            var param = {};
            var k = 1000, sizes = ["", "K", "M", "G", "T", "P", "E", "Z", "Y", "aa", "bb", "cc", "dd", "ee", "ff", "gg", "hh", "ii", "jj", "kk", "ll", "mm", "nn", "oo", "pp", "qq", "rr", "ss", "tt", "uu", "vv", "ww", "xx", "yy", "zz"], i;
                if(value < k){
                    param.value = value
                    param.unit = ''
                }else{
                    i = Math.floor(Math.log(value) / Math.log(k)); 
                    param.value = ((value / Math.pow(k, i))).toFixed(2);
                    param.unit = sizes[i];
                }
            return param;
        },
        
         //获取数字的显示
        getNumStr:function(num)
        {
            let numValue = this.numberFormat(num);
            let numStr = "" + numValue.value;
            let dotIndex = numStr.indexOf(".");
            if (dotIndex >= 0 && dotIndex !== 3) {
                numStr = numStr.substring(0, 4);
                while (numStr.length > 0) {
                    let char = numStr[numStr.length - 1];
                    if (char != "0" && char != ".") {
                        break;
                    }
                    numStr = numStr.substring(0, numStr.length - 1);
                    if (char === ".") break;
                }
            } else {
                numStr = numStr.substring(0, 3);
            }
            
            return numStr + numValue.unit;
        },

        //从数组arr中随机选取 num 个数
        getArrayItems:function(arr, num){
            //新建一个数组,将传入的数组复制过来,用于运算,而不要直接操作传入的数组;
            var temp_array = new Array();
            for (var index =0; index < arr.length ; index++) {
                temp_array.push(arr[index]);
            }
            //取出的数值项,保存在此数组
            var return_array = new Array();
            for (var i = 0; i<num; i++) {
                //判断如果数组还有可以取出的元素,以防下标越界
                if (temp_array.length > 0) {
                    //在数组中产生一个随机索引
                    var arrIndex = Math.floor(Math.random()*temp_array.length);
                    //将此随机索引的对应的数组元素值复制出来
                    return_array[i] = temp_array[arrIndex];
                    //然后删掉此索引的数组元素,这时候temp_array变为新的数组
                    temp_array.splice(arrIndex, 1);
                } else {
                    //数组中数据项取完后,退出循环,比如数组本来只有10项,但要求取出20项.
                    break;
                }
            }
            return return_array;
        },

        //从数组arr中随机选取 num 个数  并且改变原数组
        getArrayItemsAndChangeArr:function(temp_array, num){
            //取出的数值项,保存在此数组
            var return_array = new Array();
            for (var i = 0; i<num; i++) {
                //判断如果数组还有可以取出的元素,以防下标越界
                if (temp_array.length > 0) {
                    //在数组中产生一个随机索引
                    var arrIndex = Math.floor(Math.random()*temp_array.length);
                    //将此随机索引的对应的数组元素值复制出来
                    return_array[i] = temp_array[arrIndex];
                    //然后删掉此索引的数组元素,这时候temp_array变为新的数组
                    temp_array.splice(arrIndex, 1);
                } else {
                    //数组中数据项取完后,退出循环,比如数组本来只有10项,但要求取出20项.
                    break;
                }
            }
            return return_array;
        },

        dateFormat:function(fmt, _date) {
            let ret;
            let date = new Date(_date * 1000)
            const opt = {
                "Y+": date.getFullYear().toString(),        // 年
                "m+": (date.getMonth() + 1).toString(),     // 月
                "d+": date.getDate().toString(),            // 日
                "H+": date.getHours().toString(),           // 时
                "M+": date.getMinutes().toString(),         // 分
                "S+": date.getSeconds().toString()          // 秒
                // 有其他格式化字符需求可以继续添加，必须转化成字符串
            };
            for (let k in opt) {
                ret = new RegExp("(" + k + ")").exec(fmt);
                if (ret) {
                    fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
                };
            };
            return fmt;
        },
        
        generateUUID: function () {
            var s = []
            let result = "";
            let seed = '0123456789abcdef';
            if (this.deviceId !== "") {
                if (this.deviceId.length > 16) result = this.deviceId.substring(0, 16);
                else result = this.deviceId + seed.substring(0, ((16 - this.deviceId.length) + 1))
            } else {
                result = seed;
            }
            var hexDigits = result;
            for (var i = 0; i < 36; i++) {
              s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
            }
            s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23] = '-'
        
            var uuid = s.join('')
            return uuid
        },

        copyID: function () {

        },

        openRating: function () {

        },

        getDate9 (_needTime) {
            // 目标时区，东9区
            let targetTimezone = -9
            // 当前时区与中时区时差，以min为维度
            let _dif = new Date().getTimezoneOffset()
            // 本地时区时间 + 时差  = 中时区时间
            // 目标时区时间 + 时差 = 中时区时间
            // 目标时区时间 = 本地时区时间 + 本地时区时差 - 目标时区时差
            // 东9区时间
            let east9time = new Date().getTime() + _dif * 60 * 1000 - (targetTimezone * 60 * 60 * 1000)
            let date = new Date(east9time);
            if (_needTime) {
                return date.toDateString() + " " + date.getHours() + ":" + date.getMinutes() +":" + date.getSeconds(); 
            } else {
                return date.toDateString();
            }
        },

        uploadAchievment: function (_id, _level, _count) {

        },

        reportScore: function (_level) {

        },

        downloadRanking: function () {

        },

        getBase64Image: function (_url, _callback) {
            let canvas = document.createElement("CANVAS");
            let ctx = canvas.getContext('2d');
            let img = new Image;
            img.crossOrigin = "Anonymous";
            let url = cc.url.raw(_url);
            img.src = url;
            img.onload = function () {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                // player photo
                let photo = new Image;
                photo.crossOrigin = "Anonymous";
                photo.src = Wortal.player.getPhoto();
                photo.onload = function () {
                    ctx.drawImage(photo, 64, 185, 620, 620);

                    let dataURL = canvas.toDataURL("image/png");
                    // console.log(dataURL)
                    canvas = null;
                    if (_callback) _callback(dataURL);
                }
            }
        }
    }
});
module.exports = Utils;
