"use strict";
exports.__esModule = true;
var text_encoding_1 = require("text-encoding");
var ByteOutputBuffer = /** @class */ (function () {
    function ByteOutputBuffer(capacity) {
        // 低位编码. java  网络等都使用高位编码. 默认false
        this.littleEndian = false;
        this.writeIndex = 0;
        this.capacity = capacity;
        this.array = new ArrayBuffer(capacity);
        this.view = new DataView(this.array);
    }
    ByteOutputBuffer.prototype.writeInt = function (intNum) {
        this.view.setInt32(this.writeIndexAdd(4), intNum & 0xffffffff, this.littleEndian);
    };
    ByteOutputBuffer.prototype.writeShort = function (shortNum) {
        this.view.setInt16(this.writeIndexAdd(2), shortNum & 0xffff, this.littleEndian);
    };
    ByteOutputBuffer.prototype.writeByte = function (byteNum) {
        this.view.setInt8(this.writeIndexAdd(1), byteNum & 0xff);
    };
    ByteOutputBuffer.prototype.writeString = function (str) {
        this.writeShort(str.length);
        this.writeBytes(new text_encoding_1.TextEncoder('UTF-8', {}).encode(str));
    };
    ByteOutputBuffer.prototype.writeBytes = function (arr) {
        for (var i = 0; i < arr.byteLength; i++) {
            this.writeByte(arr[i]);
        }
    };
    ByteOutputBuffer.prototype.writeIndexAdd = function (val) {
        var currIndex = this.writeIndex;
        this.writeIndex += val;
        if (this.writeIndex > this.capacity) {
            throw new Error("ByteOutputBuffer capacity is not enough!");
        }
        return currIndex;
    };
    ByteOutputBuffer.prototype.reset = function () {
        this.writeIndex = 0;
    };
    /***
     * 转换成可以直接发送的Int8Array
     * @returns {Int8Array}
     */
    ByteOutputBuffer.prototype.toByteArray = function () {
        return new Uint8Array(this.array);
    };
    return ByteOutputBuffer;
}());
exports.ByteOutputBuffer = ByteOutputBuffer;
