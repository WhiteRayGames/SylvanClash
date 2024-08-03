/*
*****Created By Alex 2018 08 24
*/

var AudioMgr = cc.Class({
    extends: cc.Component,

    properties: {
        bgmVolume:1.0,
        sfxVolume:1.0,
        bgmAudioID:-1,
        soundAudioID:-1,
        musicState:1, //1 表示开启 0 表示关闭
        uavAudioId:-1,

        blockBGM: 0,
        blockSFX: 0
    },

    start () {
        cc.Mgr.AudioMgr = this;

        cc.Mgr.admob.muteAds();

        this.cacheDict = {};
    },

    //获取需要播放某个音效用  根据名字来
    getUrl:function(url){
        return cc.url.raw("resources/sound/" + url + ".mp3");
    },

    //播放背景音乐
    playBGM:function(url){
        if(this.bgmAudioID >= 0){
            cc.audioEngine.stop(this.bgmAudioID);
        }
        let self = this;

        if (this.cacheDict[url]) {
            self.bgmAudioID = cc.audioEngine.play(this.cacheDict[url], true, this.bgmVolume);
        } else {
            cc.loader.loadRes("sound/"+url, cc.AudioClip, function (err, audioClip) {
                if (err) {
                    cc.error(err.message || err);
                    return;
                }
                self.bgmAudioID = cc.audioEngine.play(audioClip, true, self.bgmVolume);
                self.cacheDict[url] = audioClip;
            });
        }
    },

    //播放音效
    playSFX:function(url){
        if (this.sfxVolume === 0 || this.isPause) return;

        let self = this;

        if (this.cacheDict[url]) {
            cc.audioEngine.play(this.cacheDict[url], false, this.sfxVolume);
        } else {
            cc.loader.loadRes("sound/" + url, cc.AudioClip, function (err, audioClip) {
                if (err) {
                    cc.error(err.message || err);
                    return;
                }
                cc.audioEngine.play(audioClip, false, self.sfxVolume);
                self.cacheDict[url] = audioClip;
            });
        }
    },

    //播放无人机
    playUavSFX:function(url){
        if (this.sfxVolume === 0 || this.isPause) return;

        let self = this;

        if (this.cacheDict[url]) {
            this.uavAudioId = cc.audioEngine.play(this.cacheDict[url], true, this.sfxVolume * 0.5);
        } else {
            cc.loader.loadRes("sound/"+url, cc.AudioClip, function (err, audioClip) {
                if (err) {
                    cc.error(err.message || err);
                    return;
                }
                self.uavAudioId = cc.audioEngine.play(audioClip, true, self.sfxVolume * 0.5);
                self.cacheDict[url] = audioClip;
            });
        } 
    },
    //停止无人机音效
    stopUavSFX()
    {
        if(this.uavAudioId == -1) return;
        cc.audioEngine.stop(this.uavAudioId);
        this.uavAudioId = -1;
    },

    //设置音效大小
    setSFXVolume:function(v){
        this.sfxVolume = v;
        cc.audioEngine.setVolume(this.uavAudioId,v);

        var VolumeData = {};
        VolumeData.bgmVolume = this.bgmVolume;
        VolumeData.sfxVolume = v;
        // cc.sys.localStorage.setItem("VolumeData",JSON.stringify(VolumeData));


        cc.Mgr.admob.muteAds();
    },

    //设置背景音大小
    setBGMVolume:function(v){
        cc.audioEngine.setVolume(this.bgmAudioID,v);
        this.bgmVolume = v

        var VolumeData = {};
        VolumeData.bgmVolume = v;
        VolumeData.sfxVolume = this.sfxVolume;
        // cc.sys.localStorage.setItem("VolumeData",JSON.stringify(VolumeData));

        cc.Mgr.admob.muteAds();
    },

    stopAll () {
        cc.audioEngine.stopAll();
    },

    //暂停
    pauseAll:function(){
        this.isPause = true;
        cc.audioEngine.pauseAll();

    },

    //恢复
    resumeAll:function(){
        this.isPause = false;
        cc.audioEngine.resumeAll();
        // if(this.bgmAudioID > 0 )cc.audioEngine.setVolume(this.bgmAudioID,this.bgmVolume);
    },
});
