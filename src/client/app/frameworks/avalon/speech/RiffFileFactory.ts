import {Injectable} from '@angular/core';
import {SmartArray} from './SmartArray';


@Injectable()
export class RiffFileFactory {

    static WAVE_FORMAT_PCM: number = 1;
    static WAVE_FORMAT_IEEE_FLOAT: number = 3;
    static DEFAULT_SAMPLE_RATE: number = 16000;
    static DEFAULT_BIT_DEPTH: number = 8;
    
    channels: number = 1;
    // sampleRate: number = 8000;
    // bitDepth: number = 8;

    createFile(audio: number[], sampleRate: number = RiffFileFactory.DEFAULT_SAMPLE_RATE, bitDepth: number = RiffFileFactory.DEFAULT_BIT_DEPTH) : Int8Array {

        let buffer = new SmartArray(); 
        buffer.appendString("RIFF");
        buffer.appendUint32(0);
        buffer.appendString("WAVEfmt ");
        buffer.appendUint32(2 + 2 + 4 + 4 + 2 + 2);
        buffer.appendUint16(RiffFileFactory.WAVE_FORMAT_PCM);
        buffer.appendUint16(this.channels);
        buffer.appendUint32(sampleRate);
        buffer.appendUint32(sampleRate * (bitDepth >> 3) * this.channels);
        buffer.appendUint16(bitDepth >> 3);
        buffer.appendUint16(bitDepth);
        buffer.appendString("data");
        buffer.appendUint32(0);

        buffer.appendArray(audio);
        return buffer.toInt8Array();
    }
}


