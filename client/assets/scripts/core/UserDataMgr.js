//游戏数据操作类
//数据操作结构
var Config = require("Config");
var MyEnum = require("MyEnum");

var UserDataMgr = cc.Class({
    extends: cc.Component,

    properties:{
		
		jsName:"userdata",
	},

	// 压缩字符串
	compressString: function (str) {
		let compressedStr = window.LZString.compressToBase64(str);
		return compressedStr;
	},

	// 解压缩字符串
	decompressString: function (compressedStr) {
		let decompressedStr = window.LZString.decompressFromBase64(compressedStr);
		return decompressedStr;
	},
	
	initData:function (_callback) {
		cc.Mgr.initData = false;

		this.callback = _callback;
		if (cc.Mgr.Config.isTelegram) {
			window.Telegram.WebApp.CloudStorage.getItem(this.jsName, function (err, data) {
				if (err == null) {
					let jsonData = data == null || data == "" ? {} : JSON.parse(this.decompressString(data));
					this.initDataCallback(jsonData);
					this.callback && this.callback();
				} else {
					var storageData = cc.sys.localStorage.getItem(this.jsName);
					storageData = storageData == null || storageData == "" ? {} : JSON.parse(storageData);
					this.initDataCallback(storageData)
					this.callback && this.callback();
				}
			}.bind(this))
		} else {
			var storageData = cc.sys.localStorage.getItem(this.jsName);
			storageData = storageData == null || storageData == "" ? {} : JSON.parse(storageData);
			this.initDataCallback(storageData)
			this.callback && this.callback();
		}
	},

	initDataCallback: function (storageData) {
		cc.Mgr.AudioMgr.sfxVolume = storageData.sfxVolume == undefined ? 1 : storageData.sfxVolume;
        cc.Mgr.AudioMgr.bgmVolume = storageData.bgmVolume == undefined ? 1 : storageData.bgmVolume;
		
		cc.Mgr.game.needGuide = storageData.needGuide = storageData.needGuide == undefined ? true : storageData.needGuide;
		cc.Mgr.game.curGuide = storageData.curGuide = storageData.curGuide == undefined ? 0 : storageData.curGuide;
		if (cc.Mgr.game.curGuide <= 1) {
			if (cc.Mgr.Config.isTelegram) {
				window.Telegram.WebApp.CloudStorage.removeItem(this.jsName, function (err, data) {
					if (err == null) {
						console.log("removed!")
					}
				}.bind(this));
			} else {
				cc.sys.localStorage.clear();
			}
			
			cc.Mgr.game.needGuide = storageData.needGuide = storageData.needGuide == undefined ? true : storageData.needGuide; 
			cc.Mgr.game.curGuide = storageData.curGuide = storageData.curGuide == undefined ? 0 : storageData.curGuide;
		} else if (cc.Mgr.game.curGuide == 3) {
			cc.Mgr.game.needGuide = false;
		}

		cc.Mgr.game.btnTipList = storageData.btnTipList = storageData.btnTipList == undefined ? [0, 0, 0] : storageData.btnTipList;

		cc.Mgr.game.isFirstEnter = storageData.isFirstEnter = storageData.isFirstEnter == undefined ? true : storageData.isFirstEnter;
		cc.Mgr.game.firstTime = storageData.firstTime = storageData.firstTime == undefined ? cc.Mgr.Utils.GetSysTime() : storageData.firstTime;
		cc.Mgr.game.isPayingUser = storageData.isPayingUser = storageData.isPayingUser == undefined ? false : storageData.isPayingUser;

		cc.Mgr.game.isZoomIn = storageData.isZoomIn = storageData.isZoomIn == undefined ? true : storageData.isZoomIn;

		cc.Mgr.game.analytics_isFirst = false;
		if (cc.Mgr.game.isFirstEnter) {
			cc.Mgr.game.analytics_isFirst = true;
            cc.Mgr.game.checkDoubleReward = false;
			cc.Mgr.game.isFirstEnter = false;
			cc.Mgr.game.sendFirstInstall = true;
        } else {
            cc.Mgr.game.checkDoubleReward = !cc.Mgr.game.isPayingUser;
		}

		if (storageData.paymentAdCountList == undefined || (storageData.paymentAdCountList && storageData.paymentAdCountList.length < 9)) {
			cc.Mgr.game.paymentAdCountList = [1, 1, 1, 2, 2, 2, 3, 3, 3];
		} else {
			cc.Mgr.game.paymentAdCountList = storageData.paymentAdCountList;
		}

		cc.Mgr.game.lastNotificationTimer = storageData.lastNotificationTimer = storageData.lastNotificationTimer == undefined ? 0 : storageData.lastNotificationTimer;
		cc.Mgr.game.notificationIndex = storageData.notificationIndex = storageData.notificationIndex == undefined ? 0 : storageData.notificationIndex;

		cc.Mgr.game.first_version = storageData.first_version = storageData.first_version == undefined ? cc.Mgr.Config.version : storageData.first_version;
		cc.Mgr.game.first_internal_version = cc.Mgr.game.first_version;

		cc.Mgr.game.rewarded_ct = storageData.rewarded_ct = storageData.rewarded_ct == undefined ? 0 : storageData.rewarded_ct;
		cc.Mgr.game.Interstitial_ct = storageData.Interstitial_ct = storageData.Interstitial_ct == undefined ? 0 : storageData.Interstitial_ct;
		cc.Mgr.game.banner_ct = storageData.banner_ct = storageData.banner_ct == undefined ? 0 : storageData.banner_ct;

		cc.Mgr.game.gem_gained_total = storageData.gem_gained_total = storageData.gem_gained_total == undefined ? 0 : storageData.gem_gained_total;

		cc.Mgr.game.isManualSetting_payingUser = storageData.isManualSetting_payingUser = storageData.isManualSetting_payingUser == undefined ? false : storageData.isManualSetting_payingUser;
		cc.Mgr.game.isVIP = storageData.isVIP = storageData.isVIP == undefined ? false : storageData.isVIP;
		cc.Mgr.game.vipExpire = storageData.vipExpire = storageData.vipExpire == undefined ? 0 : storageData.vipExpire;
		cc.Mgr.game.vipStartTimer = storageData.vipStartTimer = storageData.vipStartTimer == undefined ? 0 : storageData.vipStartTimer;
		cc.Mgr.game.vipDailyBonus = storageData.vipDailyBonus = storageData.vipDailyBonus == undefined ? true : storageData.vipDailyBonus;
		cc.Mgr.game.paymentAdCount = storageData.paymentAdCount = storageData.paymentAdCount || 5;
		cc.Mgr.game.level = storageData.level = storageData.level || 1;
		cc.Mgr.game.lastShareOpen = storageData.lastShareOpen = storageData.lastShareOpen || 0;
		// cc.Mgr.game.level = 60; // tempory code
		cc.Mgr.game.compensation = storageData.compensation = storageData.compensation == undefined ? {} : storageData.compensation;

		if (storageData.uavAdsCount == undefined) {
			if (cc.Mgr.game.level <= 10) {
				cc.Mgr.game.uavAdsCount = 5;
			} else if (cc.Mgr.game.level <= 20) {
				cc.Mgr.game.uavAdsCount = 5;
			} else if (cc.Mgr.game.level <= 30) {
				cc.Mgr.game.uavAdsCount = 5;
			} else if (cc.Mgr.game.level <= 40) {
				cc.Mgr.game.uavAdsCount = 5;
			} else if (cc.Mgr.game.level <= 50) {
				cc.Mgr.game.uavAdsCount = 5;
			} else {
				cc.Mgr.game.uavAdsCount = 5;
			}
		} else {
			cc.Mgr.game.uavAdsCount = storageData.uavAdsCount;
		}

		cc.Mgr.game.uavAdsTimeCount = storageData.uavAdsTimeCount = storageData.uavAdsTimeCount == undefined ? 0 : storageData.uavAdsTimeCount;

		cc.Mgr.game.needShowUavTip = cc.Mgr.game.level <= 10;

		cc.Mgr.game.needUpdateMoneyInGame = storageData.needUpdateMoneyInGame = storageData.needUpdateMoneyInGame == undefined ? true : storageData.needUpdateMoneyInGame;
		if (storageData.coin_gained_total) {
			if (cc.Mgr.game.needUpdateMoneyInGame === true) {
				storageData.coin_gained_total = Math.round(storageData.coin_gained_total);
				let moneyString = (storageData.coin_gained_total).toLocaleString();
				moneyString = moneyString.replace(/[,]/g, '');
				if (moneyString.length > 30) {
					storageData.coin_gained_total = moneyString.substring(0, 30);
				}
			}
			cc.Mgr.game.coin_gained_total =  BigInt(storageData.coin_gained_total);
		} else {
			cc.Mgr.game.coin_gained_total = BigInt(0);
			storageData.coin_gained_total = cc.Mgr.game.coin_gained_total.toString();
		}

		if (storageData.onlineCoinNum) {
			if (cc.Mgr.game.needUpdateMoneyInGame === true) {
				storageData.onlineCoinNum = Math.round(storageData.onlineCoinNum);
				let moneyString = (storageData.onlineCoinNum).toLocaleString();
				moneyString = moneyString.replace(/[,]/g, '');
				if (moneyString.length > 30) {
					storageData.onlineCoinNum = moneyString.substring(0, 30);
				}
			}
			cc.Mgr.game.onlineCoinNum =  BigInt(storageData.onlineCoinNum);
		} else {
			cc.Mgr.game.onlineCoinNum = BigInt(0);
			storageData.onlineCoinNum = cc.Mgr.game.onlineCoinNum.toString();
		}

		if (storageData.money) {
			if (cc.Mgr.game.needUpdateMoneyInGame === true) {
				storageData.money = Math.round(storageData.money);
				let moneyString = (storageData.money).toLocaleString();
				moneyString = moneyString.replace(/[,]/g, '');
				if (moneyString.length > 30) {
					storageData.money = moneyString.substring(0, 30);
				}
				cc.Mgr.game.needUpdateMoneyInGame = false;
			}
			
			cc.Mgr.game.money =  BigInt(storageData.money);
		} else {
			cc.Mgr.game.money = Config.initMoney;
			storageData.money = cc.Mgr.game.money.toString();
		}
		// cc.Mgr.game.money = storageData.money = storageData.money || Config.initMoney;
		cc.Mgr.game.gems = storageData.gems = storageData.gems || 0;
		// cc.Mgr.game.gems = 100000;
		cc.Mgr.game.spinADResetTime = storageData.spinADResetTime = storageData.spinADResetTime || 0;
		cc.Mgr.game.spinADTimeCount = storageData.spinADTimeCount = storageData.spinADTimeCount || 0;
		cc.Mgr.game.plantMaxLv = storageData.plantMaxLv = storageData.plantMaxLv || 1; // tempory code 1
		
		// cc.Mgr.game.plantMaxLv = 75;
		cc.Mgr.game.lastAdsGetPlantTime = storageData.lastAdsGetPlantTime = storageData.lastAdsGetPlantTime || 0;
		cc.Mgr.game.tipBuyTimes = storageData.tipBuyTimes = storageData.tipBuyTimes || 0;
		cc.Mgr.game.needShowExchangeCoinCount = storageData.needShowExchangeCoinCount = storageData.needShowExchangeCoinCount || 0;
		cc.Mgr.game.currentExchangeCount = storageData.currentExchangeCount = storageData.currentExchangeCount || 0;

		cc.Mgr.game.unlockSpecialGrid = storageData.unlockSpecialGrid = storageData.unlockSpecialGrid == undefined ? false : storageData.unlockSpecialGrid;
		cc.Mgr.game.removeAd = storageData.removeAd = storageData.removeAd == undefined ? false : storageData.removeAd;
		cc.Mgr.game.offlineDouble = storageData.offlineDouble = storageData.offlineDouble == undefined ? false : storageData.offlineDouble;

		cc.Mgr.game.session_ct = storageData.session_ct = storageData.session_ct == undefined ? 0 : storageData.session_ct;
		cc.Mgr.game.session_ct++;
		cc.Mgr.game.ltv = storageData.ltv = storageData.ltv == undefined ? 0 : storageData.ltv;
		
		cc.Mgr.game.showStarterBundleEffectFlag = storageData.showStarterBundleEffectFlag = storageData.showStarterBundleEffectFlag == undefined ? false : true;

		cc.Mgr.game.first_daily = storageData.first_daily = storageData.first_daily == undefined ? true : storageData.first_daily;

		cc.Mgr.game.hasShowLevel8 = storageData.hasShowLevel8 = storageData.hasShowLevel8 == undefined ? false : storageData.hasShowLevel8;
		cc.Mgr.game.hasShowLevel14 = storageData.hasShowLevel14 = storageData.hasShowLevel14 == undefined ? false : storageData.hasShowLevel14;
		cc.Mgr.game.hasShowLevel28 = storageData.hasShowLevel28 = storageData.hasShowLevel28 == undefined ? false : storageData.hasShowLevel28;

		cc.Mgr.game.rateState = storageData.rateState = storageData.rateState == undefined ? 0 : storageData.rateState;
		cc.Mgr.game.hasShowRate = storageData.hasShowRate = storageData.hasShowRate == undefined ? false : storageData.rateState;
		
		if (!storageData.plantBuyRecord) {
			cc.Mgr.game.resetplantBuyRecord();
		}
		cc.Mgr.game.plantBuyRecord = storageData.plantBuyRecord = storageData.plantBuyRecord || cc.Mgr.game.plantBuyRecord;
		if (!storageData.dailyMissions) {
			storageData.dailyMissions = [];
			for (let i = 0; i < Config.missionDataList.length; i++) {
				let missionData = Config.missionDataList[i];
				let dt = {};
				dt.id = missionData.id;
				dt.checkType = missionData.checkType;
				dt.misType = missionData.misType;
				dt.checkNum = missionData.checkNum;
				dt.progress = missionData.progress;
				dt.checklv = missionData.checklv == null || missionData.checklv == "" ? 0 : missionData.checklv;
				dt.rewardType = missionData.rewardType;
				dt.claimed = 0;
				storageData.dailyMissions.push(dt);
			}
		} else {
			let offset = Config.missionDataList.length - storageData.dailyMissions.length;
			let startIndex = storageData.dailyMissions.length;
			if (offset > 0) {
				for (let i = 0; i < offset; i++) {
					let missionData = Config.missionDataList[startIndex];
					let dt = {};
					dt.id = missionData.id;
					dt.checkType = missionData.checkType;
					dt.misType = missionData.misType;
					dt.checkNum = missionData.checkNum;
					dt.progress = missionData.progress;
					dt.checklv = missionData.checklv == null || missionData.checklv == "" ? 0 : missionData.checklv;
					dt.rewardType = missionData.rewardType;
					dt.claimed = 0;
					storageData.dailyMissions.push(dt);
					startIndex++;
				} 
			}
		}
		cc.Mgr.game.dailyMissions = storageData.dailyMissions;
		// if(cc.Mgr.game.dailyMissions[4] == null || cc.Mgr.game.dailyMissions[4] == "")
		// {
		// 	let missionData = Config.missionDataList[4];
		// 	let dt = {};
		// 	dt.id = missionData.id;
		// 	dt.checklv = missionData.checklv;
		// 	dt.checkType = missionData.checkType;
		// 	dt.misType = missionData.misType;
		// 	dt.checkNum = missionData.checkNum;
		// 	dt.progress = missionData.progress;
		// 	dt.rewardType = missionData.rewardType;
		// 	dt.claimed = 0;
		// 	cc.Mgr.game.dailyMissions[4] = storageData.dailyMissions[4] = dt;
		// }
		if (!storageData.achievementProgress) {
			storageData.achievementProgress = [];
			for (let i = 0; i < Config.achieveDataList.length; i++) {
				let achieveData = Config.achieveDataList[i];
				let dt = {};
				dt.id = achieveData.id;
				dt.checkType = achieveData.checkType;
				dt.level = achieveData.level;
				dt.checklv = achieveData.checklv;
				dt.achType = achieveData.achType;
				dt.progress = achieveData.progress;
				dt.finished = 0;
				storageData.achievementProgress.push(dt);
			}
		} else {
			let offset = Config.achieveDataList.length - storageData.achievementProgress.length;
			let startIndex = storageData.achievementProgress.length;
			if (offset > 0) {
				for (let i = 0; i < offset; i++) {
					let achieveData = Config.achieveDataList[startIndex];
					let dt = {};
					dt.id = achieveData.id;
					dt.checkType = achieveData.checkType;
					dt.level = achieveData.level;
					dt.checklv = achieveData.checklv;
					dt.achType = achieveData.achType;
					dt.progress = achieveData.progress;
					dt.finished = 0;
					storageData.achievementProgress.push(dt);
					startIndex++;
				} 
			}
		}
		cc.Mgr.game.achievementProgress = storageData.achievementProgress;
		this.claimedColumn = storageData.claimedColumn = storageData.claimedColumn || [];
		cc.Mgr.game.dronePot = storageData.dronePot = storageData.dronePot || [];
		cc.Mgr.game.turntablePot = storageData.turntablePot = storageData.turntablePot || [];
		cc.Mgr.game.shopBuyPot = storageData.shopBuyPot = storageData.shopBuyPot || [];

		if (!storageData.plantsOwn) {
			storageData.plantsOwn = [];
			for (let i = 0; i < cc.Mgr.Config.allPlantCount; i++) {
				let dt = {};
				dt.lv = i+1;
				dt.ownNum = 0;
				storageData.plantsOwn.push(dt);
			}
		}
		cc.Mgr.game.plantsOwn = storageData.plantsOwn;
		let plantLevelList = [3069000, 1767000, 344163, 73785, 10560, 1500, 100, 1, 1, 0, 0, 0, -1];

		cc.Mgr.game.hasLockGrid = false;
		if (storageData.plantsPK == undefined) {
			storageData.plantsPK = [];
			for (let i = 0; i < plantLevelList.length; i++) {
				let pk = {};
				let level = plantLevelList[i];
				if (level > 1) {
					pk.type = MyEnum.GridState.lock;
					pk.level = level;
				} else if (level ===  1) {
					pk.type = MyEnum.GridState.plant;
					pk.level = level;
				} else if (level === -1) { // vip
					pk.type = MyEnum.GridState.vip;
				} else {
					pk.type = MyEnum.GridState.none;
				}
				pk.index = i;
				storageData.plantsPK.push(pk);
			}

		} else { //get lockCount
			let result = 0;
			for (let i = 0; i < storageData.plantsPK.length; i++) {
				let pk = storageData.plantsPK[i];
				if (pk.type === MyEnum.GridState.lock) {
					cc.Mgr.game.hasLockGrid = true;
					break;
				}
			}
		}

		cc.Mgr.game.needShowBanner = cc.Mgr.game.plantMaxLv >= 6;
		// tempory code
		// cc.Mgr.game.needShowBanner = true;

		cc.Mgr.game.needShowInterstitial = cc.Mgr.game.plantMaxLv >= 6;
		// tempory code
		// cc.Mgr.game.needShowInterstitial = true;

		cc.Mgr.game.openSpecialGridCount = storageData.openSpecialGridCount = storageData.openSpecialGridCount == undefined ? 0 : storageData.openSpecialGridCount;
		cc.Mgr.game.openRemoveAdCount = storageData.openRemoveAdCount = storageData.openRemoveAdCount == undefined ? 0 : storageData.openRemoveAdCount;
		cc.Mgr.game.openRemoveAdCount_interstitial = storageData.openRemoveAdCount_interstitial = storageData.openRemoveAdCount_interstitial == undefined ? 0 : storageData.openRemoveAdCount_interstitial;

		cc.Mgr.game.specialGridStartTimer = storageData.specialGridStartTimer = storageData.specialGridStartTimer == undefined ? 0 : storageData.specialGridStartTimer;
		cc.Mgr.game.removeAdStartTimer = storageData.removeAdStartTimer = storageData.removeAdStartTimer == undefined ? 0 : storageData.removeAdStartTimer;
		cc.Mgr.game.coinBundleStartTimer = storageData.coinBundleStartTimer = storageData.coinBundleStartTimer == undefined ? 0 : storageData.coinBundleStartTimer;
		cc.Mgr.game.coinBundleFlag = storageData.coinBundleFlag = storageData.coinBundleFlag == undefined ? true : storageData.coinBundleFlag;
		cc.Mgr.game.coinBundleFlag = true;

		cc.Mgr.game.setLanguageManually = storageData.setLanguageManually = storageData.setLanguageManually == undefined ? "" : storageData.setLanguageManually;

		cc.Mgr.game.vipSaleTimer = storageData.vipSaleTimer = storageData.vipSaleTimer == undefined ? 0 : storageData.vipSaleTimer;
		if (cc.Mgr.game.vipSaleTimer < Date.now()) cc.Mgr.game.vipSaleTimer = 0;

		if(cc.Mgr.game.vipSaleTimer > 0 || cc.Mgr.game.isVIP) {
			cc.Mgr.game.vipCloseCount = 0;
			cc.Mgr.game.vipEnterGameCount = 0;
		} else {
			cc.Mgr.game.vipCloseCount = storageData.vipCloseCount = storageData.vipCloseCount == undefined ? 0 : storageData.vipCloseCount;
			cc.Mgr.game.vipEnterGameCount = storageData.vipEnterGameCount = storageData.vipEnterGameCount == undefined ? 0 : storageData.vipEnterGameCount;
		}

		// tempory code
		// storageData.plantsPK = [];
		// for(let i  = 0; i < 13; i++)
		// {
		// 	var pk = {};
		// 	pk.type = MyEnum.GridState.plant;
		// 	pk.index = i;
		// 	pk.level = i + 1;
		// 	storageData.plantsPK.push(pk);
		// }

		cc.Mgr.game.plantsPK = storageData.plantsPK;
		if (!storageData.freeFlag) {
			storageData.freeFlag = {};
			storageData.freeFlag.TurnTable = true;
		}
		cc.Mgr.game.freeFlag = storageData.freeFlag;
		if (storageData.lastPlayTime) {
			cc.Mgr.game.days_inactive = cc.Mgr.Utils.getDays(cc.Mgr.Utils.GetSysTime()) - cc.Mgr.Utils.getDays(storageData.lastPlayTime);
		} else {
			cc.Mgr.game.days_inactive = 1;
		}
		cc.Mgr.game.days_installed = cc.Mgr.Utils.getDays(cc.Mgr.Utils.GetSysTime()) - cc.Mgr.Utils.getDays(storageData.firstTime);
		this.lastPlayTime = storageData.lastPlayTime = storageData.lastPlayTime || cc.Mgr.Utils.GetSysTime();
		cc.Mgr.game.lastOfflineTime = storageData.lastOfflineTime = storageData.lastOfflineTime == undefined ? this.lastPlayTime : storageData.lastOfflineTime;
		cc.Mgr.game.days_engaged = storageData.days_engaged = storageData.days_engaged == undefined ? 1 : storageData.days_engaged;
		if (cc.Mgr.Utils.getDays(cc.Mgr.Utils.GetSysTime()) - cc.Mgr.Utils.getDays(cc.Mgr.UserDataMgr.lastPlayTime) >= 1) {
			cc.Mgr.game.days_engaged++;
		}

		cc.Mgr.game.spinUseGemTime = storageData.spinUseGemTime = storageData.spinUseGemTime || 0;
		cc.Mgr.game.lastSignDate = storageData.lastSignDate = storageData.lastSignDate || 0;
		cc.Mgr.game.hasSignDayNum = storageData.hasSignDayNum = storageData.hasSignDayNum || 0;

		cc.Mgr.game.lastInviteDate = storageData.lastInviteDate = storageData.lastInviteDate || 0;
		
		cc.Mgr.game.doubleBtnIntervalTime = storageData.doubleBtnIntervalTime = storageData.doubleBtnIntervalTime || 0;

		cc.Mgr.game.vipdiscount = storageData.vipdiscount = storageData.vipdiscount == undefined ? null : storageData.vipdiscount;

		cc.Mgr.game.vipdiscount = true;

		cc.Mgr.game.unlockGridFirst = storageData.unlockGridFirst = storageData.unlockGridFirst == undefined ? false : storageData.unlockGridFirst;
		cc.Mgr.game.openEggCount = 0

		if(cc.Mgr.Config.isTelegram) {
			window.Telegram.WebApp.CloudStorage.setItem(this.jsName, this.compressString(JSON.stringify(storageData)), function(err, data) {
				if (err == null) {
					console.log("saved!")
				}
			}.bind(this));
		}
		cc.sys.localStorage.setItem(this.jsName,JSON.stringify(storageData));

		cc.Mgr.initData = true;
	},

	//保存本地数据
	SaveUserData:function(_recoveryData){
		if (_recoveryData) {
			if(cc.Mgr.Config.isTelegram) {
				window.Telegram.WebApp.CloudStorage.setItem(this.jsName, this.compressString(JSON.stringify(_recoveryData)), function(err, data) {
					if (err == null) {
						console.log("saved!")
					}
				}.bind(this));
			}
			cc.sys.localStorage.setItem(this.jsName,JSON.stringify(_recoveryData));
			return;
		}
		var userdata = {};
		userdata.sfxVolume = cc.Mgr.AudioMgr.sfxVolume;
		userdata.bgmVolume = cc.Mgr.AudioMgr.bgmVolume;
		userdata.btnTipList = cc.Mgr.game.btnTipList;
		userdata.curGuide = cc.Mgr.game.curGuide;
		userdata.needGuide = cc.Mgr.game.needGuide;
		userdata.level = cc.Mgr.game.level;
		// userdata.needShowUavTip = cc.Mgr.game.needShowUavTip;
		userdata.isManualSetting_payingUser = cc.Mgr.game.isManualSetting_payingUser;
		userdata.isVIP = cc.Mgr.game.isVIP;
		userdata.vipExpire = cc.Mgr.game.vipExpire;
		userdata.vipStartTimer = cc.Mgr.game.vipStartTimer;
		userdata.vipDailyBonus = cc.Mgr.game.vipDailyBonus;
		userdata.isPayingUser = cc.Mgr.game.isPayingUser;
		userdata.isZoomIn = cc.Mgr.game.isZoomIn;
		userdata.isFirstEnter = cc.Mgr.game.isFirstEnter;
		userdata.paymentAdCount = cc.Mgr.game.paymentAdCount;
		userdata.lastShareOpen = cc.Mgr.game.lastShareOpen;
		// userdata.wave = this.wave;
		userdata.money = cc.Mgr.game.money.toString();;
		userdata.gems = cc.Mgr.game.gems;
		userdata.spinADResetTime = cc.Mgr.game.spinADResetTime,
		userdata.spinADTimeCount = cc.Mgr.game.spinADTimeCount;
		userdata.plantMaxLv = cc.Mgr.game.plantMaxLv;
		userdata.plantBuyRecord = cc.Mgr.game.plantBuyRecord;
		userdata.dailyMissions = cc.Mgr.game.dailyMissions;
		userdata.achievementProgress = cc.Mgr.game.achievementProgress;
		userdata.claimedColumn = this.claimedColumn;
		userdata.needShowExchangeCoinCount = cc.Mgr.game.needShowExchangeCoinCount;
		userdata.currentExchangeCount = cc.Mgr.game.currentExchangeCount;
		userdata.lastOfflineTime = cc.Mgr.game.lastOfflineTime;

		userdata.lastNotificationTimer = cc.Mgr.game.lastNotificationTimer;
		userdata.notificationIndex = cc.Mgr.game.notificationIndex;

		userdata.unlockSpecialGrid = cc.Mgr.game.unlockSpecialGrid;
		userdata.removeAd = cc.Mgr.game.removeAd;
		userdata.offlineDouble = cc.Mgr.game.offlineDouble;

		userdata.uavAdsCount = cc.Mgr.game.uavAdsCount;
		userdata.uavAdsTimeCount = cc.Mgr.game.uavAdsTimeCount;

		userdata.rateState = cc.Mgr.game.rateState;
		userdata.hasShowRate = cc.Mgr.game.hasShowRate;

		userdata.session_ct = cc.Mgr.game.session_ct;
		userdata.ltv = cc.Mgr.game.ltv;
		userdata.days_engaged = cc.Mgr.game.days_engaged;
		userdata.rewarded_ct = cc.Mgr.game.rewarded_ct;
		userdata.Interstitial_ct = cc.Mgr.game.Interstitial_ct;
		userdata.banner_ct = cc.Mgr.game.banner_ct;

		userdata.first_daily = cc.Mgr.game.first_daily;

		userdata.coin_gained_total = cc.Mgr.game.coin_gained_total.toString();
		userdata.gem_gained_total = cc.Mgr.game.gem_gained_total;

		userdata.showStarterBundleEffectFlag = cc.Mgr.game.showStarterBundleEffectFlag;

		userdata.spinUseGemTime = cc.Mgr.game.spinUseGemTime;

		userdata.dronePot = cc.Mgr.game.getDronePot();
		//转盘花盆
		userdata.turntablePot = cc.Mgr.game.getTurntablePot();
		//商店购买
		userdata.shopBuyPot = cc.Mgr.game.getShopBuyPot();

		userdata.plantsOwn = cc.Mgr.game.plantsOwn;
		userdata.plantsPK = cc.Mgr.game.getPlantsPK();
	  	userdata.freeFlag = cc.Mgr.game.freeFlag;
				
		userdata.lastPlayTime = cc.Mgr.Utils.GetSysTime();

		userdata.lastAdsGetPlantTime = cc.Mgr.game.lastAdsGetPlantTime;

		userdata.tipBuyTimes = cc.Mgr.game.tipBuyTimes;

		userdata.onlineCoinNum = cc.Mgr.game.onlineCoinNum.toString();

		userdata.lastSignDate = cc.Mgr.game.lastSignDate;

		userdata.lastInviteDate = cc.Mgr.game.lastInviteDate;

		userdata.hasSignDayNum = cc.Mgr.game.hasSignDayNum;

		userdata.hasShowLevel8 = cc.Mgr.game.hasShowLevel8;
		userdata.hasShowLevel14 = cc.Mgr.game.hasShowLevel14;
		userdata.hasShowLevel28 = cc.Mgr.game.hasShowLevel28;

		userdata.first_version = cc.Mgr.game.first_version;
		userdata.firstTime = cc.Mgr.game.firstTime;

		userdata.compensation = cc.Mgr.game.compensation;

		// userdata.openRemoveAdCount = cc.Mgr.game.openRemoveAdCount;
		// userdata.openRemoveAdCount_interstitial = cc.Mgr.game.openRemoveAdCount_interstitial;
		userdata.openSpecialGridCount = cc.Mgr.game.openSpecialGridCount;

		userdata.specialGridStartTimer = cc.Mgr.game.specialGridStartTimer;
		userdata.removeAdStartTimer = cc.Mgr.game.removeAdStartTimer;
		userdata.coinBundleStartTimer = cc.Mgr.game.coinBundleStartTimer;
		userdata.coinBundleFlag = cc.Mgr.game.coinBundleFlag;

		userdata.paymentAdCountList = cc.Mgr.game.paymentAdCountList;

		userdata.doubleBtnIntervalTime = cc.Mgr.game.doubleBtnIntervalTime;

		userdata.setLanguageManually = cc.Mgr.game.setLanguageManually;

		userdata.vipSaleTimer = cc.Mgr.game.vipSaleTimer;
		userdata.vipCloseCount = cc.Mgr.game.vipCloseCount;
		userdata.vipEnterGameCount = cc.Mgr.game.vipEnterGameCount;

		userdata.needUpdateMoneyInGame = cc.Mgr.game.needUpdateMoneyInGame;

		userdata.vipdiscount = cc.Mgr.game.vipdiscount;

		userdata.unlockGridFirst = cc.Mgr.game.unlockGridFirst;

		if(cc.Mgr.Config.isTelegram) {
			window.Telegram.WebApp.CloudStorage.setItem(this.jsName, this.compressString(JSON.stringify(userdata)), function(err, data) {
				if (err == null) {
					console.log("saved!")
				}
			}.bind(this));
		}
		cc.sys.localStorage.setItem(this.jsName,JSON.stringify(userdata));
	},
});

module.exports = UserDataMgr
