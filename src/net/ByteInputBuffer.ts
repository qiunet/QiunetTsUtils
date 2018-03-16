import {TextDecoder} from 'text-encoding';

export class ByteInputBuffer {
    // 低位编码. java  网络等都使用高位编码. 默认false
    private littleEndian: boolean = false;

    private view:DataView;
    private readIndex: number = 0;

    constructor(data: ArrayBuffer) {
        this.view = new DataView(data);
    }
    public readByte(): number{
        return this.view.getInt8(this.readIndexAdd(1))
    }
    public readShort(): number{
        return this.view.getInt16(this.readIndexAdd(2), this.littleEndian)
    }
    public readInt(): number{
        return this.view.getInt32(this.readIndexAdd(4), this.littleEndian)
    }
    public readFloat():number {
        return this.view.getFloat32(this.readIndexAdd(4), this.littleEndian);
    }
    
    public readDouble():number {
        return this.view.getFloat64(this.readIndexAdd(8), this.littleEndian);
    }

    public readBytes(length: number): Uint8Array{
        let array: ArrayBuffer = new ArrayBuffer(length);
        let data: Uint8Array = new Uint8Array(array);
        for (var i = 0 ; i < length; i++) {
            data[i] = this.readByte()
        }
        return data;
    }

    public readString(): string{
        let length:number = this.readShort();
        let data: Uint8Array = this.readBytes(length);
        return new TextDecoder('UTF-8').decode(data);
    }

    private readIndexAdd(val:number):number {
        let currIndex = this.readIndex;
        this.readIndex += val;
        if (this.readIndex > this.view.buffer.byteLength) {
            throw new Error("readIndex is out range")
        }
        return currIndex;
    }

    public reset(): void{
        this.readIndex = 0;
    }
}