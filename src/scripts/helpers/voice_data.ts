export default class VoiceData {

    id: string;
    connection: any;
    init_message_channel_ID: string;
    
    mode: number;
    current: any;
    queue: any[];
    persistent_queue: any[];

    should_timeout: boolean;
    timeout_delay: number;
    elapsed_ms: number;

    constructor() {
        this.id = "";
        this.connection = -1;
        this.init_message_channel_ID = "";

        this.mode = 0;
        this.current = -1;
        this.queue = [];
        this.persistent_queue = [];
        
        this.should_timeout = false;
        this.timeout_delay = 30000;
        this.elapsed_ms = 0;
    }
}