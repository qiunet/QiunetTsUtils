
import {ByteOutputBuffer} from "./ByteOutputBuffer";
import {ByteInputBuffer} from "./ByteInputBuffer";
import {MathUtil} from "../utils/MathUtil";
import { Crc32Util } from "../utils/Crc32Util";

export class ProtocolHeader {
    private static MAGIC_CONTENTS:Uint8Array = new Uint8Array(['f'.charCodeAt(0), 'a'.charCodeAt(0), 's'.charCodeAt(0), 't'.charCodeAt(0)]);
    public static PROTOCOL_HEADER_LENGTH: number = 16;

    private magic:Uint8Array = new Uint8Array(4);

    private _length: number = 0;

    private _protocolId: number = 0;

    private _crc: number = 0;
    constructor(){}

    /***
     * 由服务器下行的数据创建.
     * @param {ByteInputBuffer} inBuffer
     */
    initByInData(inBuffer:ByteInputBuffer){
        for (var i = 0 ; i < ProtocolHeader.MAGIC_CONTENTS.byteLength; i++) {
            this.magic[i] = inBuffer.readByte();
        }
        this._length = inBuffer.readInt();
        this._protocolId = inBuffer.readInt();
        this._crc = inBuffer.readInt();
    }
    /***
     * 实现protocolHeader 的写入类.
     * @param {number} protocolId 命令id
     * @param {Uint8Array} data 所有的数据.
     */
    initByOutData(protocolId: number, data: Uint8Array) {
        let crcnum:number = Crc32Util.crc32WithUint8Array(data);
        this._crc = MathUtil.numberToInt(crcnum);
        this._length = data.byteLength;
        this._protocolId = protocolId;ProtocolHeader
    }

    /***
     * 魔数是否有效
     * @returns {boolean}
     */
    magicValid():boolean {
        if (this.magic.byteLength != ProtocolHeader.MAGIC_CONTENTS.byteLength) {
            return false;
        }

        let ret:boolean = true;
        for (var i = 0 ; i < ProtocolHeader.MAGIC_CONTENTS.byteLength; i++) {
            if (this.magic[i] != ProtocolHeader.MAGIC_CONTENTS[i]) {
                ret = false;
                break;
            }
        }
        return ret;
    }

    /***
     * crc 是否有效
     * @param {Uint8Array} data
     * @returns {boolean}
     */
    crcValid(data: Uint8Array): boolean {
        let crcnum:number = Crc32Util.crc32WithUint8Array(data);
        let crc: number = MathUtil.numberToInt(crcnum);
        return this._crc == crc;
    }

    getLength(): number {
        return this._length;
    }

    getProtocolId(): number {
        return this._protocolId;
    }

    getCrc(): number {
        return this._crc;
    }

    public writeToBuffer(out: ByteOutputBuffer) {
        out.writeBytes(ProtocolHeader.MAGIC_CONTENTS)
        out.writeInt(this.getLength())
        out.writeInt(this.getProtocolId())
        out.writeInt(this.getCrc())
    }
}