import {EncodingUtil} from "../utils/EncodingUtil";

export class ByteOutputBuffer {
    private capacity:number;
    // 低位编码. java  网络等都使用高位编码. 默认false
    private littleEndian: boolean = false;

    private array:ArrayBuffer;
    private view:DataView;
    private writeIndex: number = 0;

    constructor(capacity: number) {
        this.capacity = capacity;
        this.array = new ArrayBuffer(capacity);
        this.view = new DataView(this.array);
    }

    public writeInt(intNum : number){
        this.view.setInt32(this.writeIndexAdd(4), intNum & 0xffffffff, this.littleEndian)
    }

    public writeShort(shortNum : number){
        this.view.setInt16(this.writeIndexAdd(2), shortNum & 0xffff, this.littleEndian)
    }

    public writeByte(byteNum: number) {
        this.view.setInt8(this.writeIndexAdd(1), byteNum & 0xff)
    }

    public writeDouble(doubleNum: number): void {
        this.view.setFloat64(this.writeIndexAdd(8), doubleNum);
    }
    public writeFloat(floatNum:number): void {
        this.view.setFloat32(this.writeIndexAdd(4), floatNum);
    }
    
    public writeString(str: string){
        this.writeShort(str.length)
        this.writeBytes(EncodingUtil.encode(str))
    }

    public writeBytes(arr: Uint8Array) {
        for (var i = 0 ; i < arr.byteLength; i++) {
            this.writeByte(arr[i]);
        }
    }


    private writeIndexAdd(val:number):number {
        let currIndex = this.writeIndex;
        this.writeIndex += val;
        if (this.writeIndex > this.capacity) {
            throw new Error("ByteOutputBuffer capacity is not enough!");
        }
        return currIndex;
    }
    public reset(): void{
        this.writeIndex = 0;
    }

    /***
     * 转换成可以直接发送的Int8Array
     * @returns {Int8Array}
     */
    public toByteArray():Uint8Array{
        return new Uint8Array(this.array);
    }
}