/* Types */
import { AudioPlayer, VoiceConnection } from "@discordjs/voice";

export type VoiceConnectionData = {
    id: string;
    voice_channel_ID: string;
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
    id: string;
    item: VoiceRequestItemData;

    user_ID: string;
};

export type VoiceRequestItemData = {
    url: string;
    title: string;
    duration: number;
};
