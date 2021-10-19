class VoiceData {
    constructor() {
        this.id = -1;
        this.connection = -1;

        this.current = -1;
        this.queue = [];
        this.persistent_queue = [];
        this.elapsed_ms = 0;

        this.mode = 0;

        this.should_timeout = false;
        this.timeout_delay = 30000;

        this.init_message_channel_ID = -1;
    }
}

module.exports = VoiceData;
