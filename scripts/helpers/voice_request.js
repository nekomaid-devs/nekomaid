class VoiceRequest {
    constructor() {
        this.info = -1;
        this.url = -1;
        
        this.stream = -1;

        this.request_message_ID = -1;
        this.request_channel_ID = -1;
        this.request_user_ID = -1;
    }
}

module.exports = VoiceRequest;