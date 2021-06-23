class VoiceData {
    constructor() {
        this.id = -1;
        this.connection = -1;
        this.queueManagerID = -1;
        this.current = -1;
        this.persistentQueue = [];
        this.mode = 0;
        this.queue = [];
        this.timeoutDelay = 30000;
        this.timeouting = false;
        this.joinedMessageChannelID = -1;
        this.elapsedMilis = 0;
    }
}

module.exports = VoiceData;