"use strict";
exports.__esModule = true;
var text_encoding_1 = require("text-encoding");
var ByteInputBuffer = /** @class */ (function () {
    function ByteInputBuffer(data) {
        // 低位编码. java  网络等都使用高位编码. 默认false
        this.littleEndian = false;
        this.readIndex = 0;
        this.view = new DataView(data);
    }
    ByteInputBuffer.prototype.readByte = function () {
        return this.view.getInt8(this.readIndexAdd(1));
    };
    ByteInputBuffer.prototype.readShort = function () {
        return this.view.getInt16(this.readIndexAdd(2), this.littleEndian);
    };
    ByteInputBuffer.prototype.readInt = function () {
        return this.view.getInt32(this.readIndexAdd(4), this.littleEndian);
    };
    ByteInputBuffer.prototype.readBytes = function (length) {
        var array = new ArrayBuffer(length);
        var data = new Uint8Array(array);
        for (var i = 0; i < length; i++) {
            data[i] = this.readByte();
        }
        return data;
    };
    ByteInputBuffer.prototype.readString = function () {
        var length = this.readShort();
        var data = this.readBytes(length);
        return new text_encoding_1.TextDecoder('UTF-8').decode(data);
    };
    ByteInputBuffer.prototype.readIndexAdd = function (val) {
        var currIndex = this.readIndex;
        this.readIndex += val;
        if (this.readIndex > this.view.buffer.byteLength) {
            throw new Error("readIndex is out range");
        }
        return currIndex;
    };
    ByteInputBuffer.prototype.reset = function () {
        this.readIndex = 0;
    };
    return ByteInputBuffer;
}());
exports.ByteInputBuffer = ByteInputBuffer;
