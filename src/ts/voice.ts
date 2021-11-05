/* Types */
import { AudioPlayer, VoiceConnection } from "@discordjs/voice";

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

    elapsed_ms: number;
    timeout_elapsed_ms: number;
};

export type VoiceRequestData = {
    item: VoiceRequestItemData;
    stream: any;

    request_message_ID: string;
    request_channel_ID: string;
    request_user_ID: string;
};

export type VoiceRequestItemData = {
    url: string;
    title: string;
    duration: number;
};
