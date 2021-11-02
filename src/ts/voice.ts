/* Types */
import { AudioPlayer, VoiceConnection } from "@discordjs/voice"

export type VoiceConnectionData = {
    id: string;
    init_message_channel_ID: string;
    channel_ID: string;
    
    connection: VoiceConnection;
    player: AudioPlayer;

    mode: number;
    current: VoiceRequestData | null;
    queue: VoiceRequestData[];
    persistent_queue: VoiceRequestData[];

    should_timeout: boolean;
    timeout_delay: number;
    elapsed_ms: number;
}

export type VoiceRequestData = {
    info: any;
    url: string;
    stream: any;

    request_message_ID: string;
    request_channel_ID: string;
    request_user_ID: string;
}