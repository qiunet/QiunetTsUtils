
import {crc32} from 'js-crc';
import {ByteOutputBuffer} from "./ByteOutputBuffer";
import {ByteInputBuffer} from "./ByteInputBuffer";

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
        let crcnum:number = parseInt(crc32(data), 16);
        this._crc = crcnum & 0xffffffff;
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
        let crcnum:number = parseInt(crc32(data), 16);
        let crc: number = crcnum & 0xffffffff;
        return this.crc == crc;
    }

    get length(): number {
        return this._length;
    }

    get protocolId(): number {
        return this._protocolId;
    }

    get crc(): number {
        return this._crc;
    }

    public writeToBuffer(out: ByteOutputBuffer) {
        out.writeBytes(ProtocolHeader.MAGIC_CONTENTS)
        out.writeInt(this.length)
        out.writeInt(this.protocolId)
        out.writeInt(this.crc)
    }
}