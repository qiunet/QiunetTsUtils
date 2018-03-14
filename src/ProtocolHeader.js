"use strict";
exports.__esModule = true;
var js_crc_1 = require("js-crc");
var ProtocolHeader = /** @class */ (function () {
    function ProtocolHeader() {
        this.magic = new Uint8Array(4);
        this._length = 0;
        this._protocolId = 0;
        this._crc = 0;
    }
    /***
     * 由服务器下行的数据创建.
     * @param {ByteInputBuffer} inBuffer
     */
    ProtocolHeader.prototype.initByInData = function (inBuffer) {
        for (var i = 0; i < ProtocolHeader.MAGIC_CONTENTS.byteLength; i++) {
            this.magic[i] = inBuffer.readByte();
        }
        this._length = inBuffer.readInt();
        this._protocolId = inBuffer.readInt();
        this._crc = inBuffer.readInt();
    };
    /***
     * 实现protocolHeader 的写入类.
     * @param {number} protocolId 命令id
     * @param {Uint8Array} data 所有的数据.
     */
    ProtocolHeader.prototype.initByOutData = function (protocolId, data) {
        var crcnum = parseInt(js_crc_1.crc32(data), 16);
        this._crc = crcnum & 0xffffffff;
        this._length = data.byteLength;
        this._protocolId = protocolId;
        ProtocolHeader;
    };
    /***
     * 魔数是否有效
     * @returns {boolean}
     */
    ProtocolHeader.prototype.magicValid = function () {
        if (this.magic.byteLength != ProtocolHeader.MAGIC_CONTENTS.byteLength) {
            return false;
        }
        var ret = true;
        for (var i = 0; i < ProtocolHeader.MAGIC_CONTENTS.byteLength; i++) {
            if (this.magic[i] != ProtocolHeader.MAGIC_CONTENTS[i]) {
                ret = false;
                break;
            }
        }
        return ret;
    };
    /***
     * crc 是否有效
     * @param {Uint8Array} data
     * @returns {boolean}
     */
    ProtocolHeader.prototype.crcValid = function (data) {
        var crcnum = parseInt(js_crc_1.crc32(data), 16);
        var crc = crcnum & 0xffffffff;
        return this._crc == crc;
    };
    ProtocolHeader.prototype.getLength = function () {
        return this._length;
    };
    ProtocolHeader.prototype.getProtocolId = function () {
        return this._protocolId;
    };
    ProtocolHeader.prototype.getCrc = function () {
        return this._crc;
    };
    ProtocolHeader.prototype.writeToBuffer = function (out) {
        out.writeBytes(ProtocolHeader.MAGIC_CONTENTS);
        out.writeInt(this.getLength());
        out.writeInt(this.getProtocolId());
        out.writeInt(this.getCrc());
    };
    ProtocolHeader.MAGIC_CONTENTS = new Uint8Array(['f'.charCodeAt(0), 'a'.charCodeAt(0), 's'.charCodeAt(0), 't'.charCodeAt(0)]);
    ProtocolHeader.PROTOCOL_HEADER_LENGTH = 16;
    return ProtocolHeader;
}());
exports.ProtocolHeader = ProtocolHeader;
