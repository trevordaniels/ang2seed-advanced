// declare var webkitAudioContext: {
//     new (): AudioContext;
// }

// declare var webkitOfflineAudioContext: {
//     new (numberOfChannels: number, length: number, sampleRate: number): OfflineAudioContext;
// }
declare enum RecordingState {
    "inactive",
    "recording",
    "paused"
}

interface MediaRecorderConstructor {
    new (stream: MediaStream): MediaRecorder;
}

interface Window {
    MediaRecorder: MediaRecorderConstructor;
}

interface MediaRecorder {
    stream: MediaStream;
    mimeType: string;
    state: RecordingState;

    videoBitsPerSecond: number;
    audioBitsPerSecond: number;

    start(): void;
    stop(): void;
    pause(): void;
    resume(): void;
    requestData(): void;
}
// static isTypeSupported(type: string) : boolean;
//  readonly attribute MediaStream    stream;
//     readonly attribute DOMString      mimeType;
//     readonly attribute RecordingState state;
//              attribute EventHandler   onstart;
//              attribute EventHandler   onstop;
//              attribute EventHandler   ondataavailable;
//              attribute EventHandler   onpause;
//              attribute EventHandler   onresume;
//              attribute EventHandler   onerror;
//              attribute boolean        ignoreMutedMedia;
//     readonly attribute unsigned long  videoBitsPerSecond;
//     readonly attribute unsigned long  audioBitsPerSecond;

//     void    start(optional long timeslice);
//     void    stop();
//     void    pause();
//     void    resume();
//     void    requestData();
//     static boolean isTypeSupported(DOMString type);

// interface MediaStreamAudioSourceNode extends AudioNode {

// }

// interface MediaStreamAudioDestinationNode extends AudioNode {
//     stream: MediaStream;
// }

// interface AudioBuffer {
//     copyFromChannel(destination: Float32Array, channelNumber: number, startInChannel?: number): void;

//     copyToChannel(source: Float32Array, channelNumber: number, startInChannel?: number): void;
// }

// interface AudioNode {
//     disconnect(destination: AudioNode): void;
// }

// interface AudioContext {
//     suspend(): Promise<void>;
//     resume(): Promise<void>;
//     close(): Promise<void>;
//     createMediaStreamDestination(): MediaStreamAudioDestinationNode; 
// }