export default class VoiceRequest {
    info: any;
    url: string;
    stream: any;

    request_message_ID: string;
    request_channel_ID: string;
    request_user_ID: string;

    constructor() {
        this.info = -1;
        this.url = "";
        this.stream = -1;

        this.request_message_ID = "";
        this.request_channel_ID = "";
        this.request_user_ID = "";
    }
}
