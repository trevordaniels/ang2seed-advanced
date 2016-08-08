
export class SmartArray {

    buffer: any[] = [];

    appendString(str: string) {
        for (var i = 0; i < str.length; ++i) {
            this.buffer.push(str.charCodeAt(i));
        }
    }

    appendUint32(num: number) {
        this.appendUint16(num);
        this.appendUint16(num >> 16);
    };

    appendUint16(num: number) {
        this.buffer.push((num & 0x00ff) >> 0);
        this.buffer.push((num & 0xff00) >> 8);
    }

    toInt8Array(): Int8Array {
        return new Int8Array(this.buffer);
    }

    appendArray(arr: number[]) {
        this.buffer = this.buffer.concat(arr);
    }

    resample(samples: Float32Array, sourceSampleRate: number, destinationSampleRate: number) : number[] {
        let increments = sourceSampleRate / destinationSampleRate;
        let newSamples : number[] = [];
        //adjust sampling rate
        for (var i = 0; i < samples.length; i += increments) {
            newSamples.push(Math.floor((samples[Math.floor(i)] - .5) * 128));
        }
        return newSamples;
    }
}