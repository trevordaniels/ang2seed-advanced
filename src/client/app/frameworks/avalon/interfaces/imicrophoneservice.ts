
export interface IMicrophoneService {
  getMicrophoneAudioStream(): Promise<MediaStream>;
}