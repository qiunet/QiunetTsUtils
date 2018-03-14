"use strict";
exports.__esModule = true;
/**
 * Created by qiunet on 18/3/5.
 */
var ProtocolHeader_1 = require("./ProtocolHeader");
var ByteOutputBuffer_1 = require("./ByteOutputBuffer");
var ResponseHandler_1 = require("./ResponseHandler");
var ByteInputBuffer_1 = require("./ByteInputBuffer");
var BaseWebSocketClient = /** @class */ (function () {
    function BaseWebSocketClient(url) {
        this._sock = null;
        this._sock = new WebSocket(url);
        this._sock.onopen = this._onOpen.bind(this);
        this._sock.onclose = this._onClose.bind(this);
        this._sock.onmessage = this._onMessage.bind(this);
    }
    BaseWebSocketClient.prototype._onOpen = function () {
        this._sock.binaryType = 'arraybuffer';
        console.log("[WebSocket]: ", this._sock.url, " Connected");
    };
    BaseWebSocketClient.prototype._onClose = function (err) {
        console.log("[WebSocket]: ", this._sock.url, " Closed, cause: ", err);
    };
    BaseWebSocketClient.prototype._onMessage = function (event) {
        var inBuffer = new ByteInputBuffer_1.ByteInputBuffer(event.data);
        var header = new ProtocolHeader_1.ProtocolHeader();
        header.initByInData(inBuffer);
        /**标头是否有效*/
        if (!header.magicValid()) {
            console.error("response message magic error: ");
            this.close(500, "response message magic error");
            return;
        }
        /**消息长度判断*/
        if (header.getLength() < 1 || header.getLength() > BaseWebSocketClient.MAX_RESPONSE_DATA_LENGTH) {
            console.error("response message length error: ", header.getLength());
            this.close(501, "response message length error");
            return;
        }
        var protoData = inBuffer.readBytes(header.getLength());
        if (!header.crcValid(protoData)) {
            console.error("response message crc error ");
            this.close(502, "response message crc error");
            return;
        }
        ResponseHandler_1.ResponseMapping.getResponse(header.getProtocolId()).trigger(protoData);
    };
    /***
     * 关闭当前链接
     * @param {number} code
     * @param {string} reason
     */
    BaseWebSocketClient.prototype.close = function (code, reason) {
        this._sock.close(code, reason);
    };
    /***
     * 发送消息
     * @param {number} cmdId
     * @param {Uint8Array} data
     */
    BaseWebSocketClient.prototype.sendData = function (cmdId, data) {
        var self = this;
        this.waitForConnection(function () {
            self.handlerRequestData(cmdId, data);
        }, 50);
    };
    /***
     *
     * @param {number} protocolId 请求的命令
     * @param {Uint8Array} data 字节流数据
     */
    BaseWebSocketClient.prototype.handlerRequestData = function (protocolId, data) {
        var out = new ByteOutputBuffer_1.ByteOutputBuffer(ProtocolHeader_1.ProtocolHeader.PROTOCOL_HEADER_LENGTH + data.byteLength);
        var header = new ProtocolHeader_1.ProtocolHeader();
        header.initByOutData(protocolId, data);
        header.writeToBuffer(out);
        out.writeBytes(data);
        this._sock.send(out.toByteArray());
    };
    BaseWebSocketClient.prototype.waitForConnection = function (sendFunc, interval) {
        if (this._sock.readyState === 1) {
            sendFunc();
            return;
        }
        else if (this._sock.readyState == 2 || this._sock.readyState == 3) {
            console.error("[WebSocket]: ", this._sock.url, " is Closing or Closed !");
            return;
        }
        var self = this;
        setTimeout(function () {
            self.waitForConnection(sendFunc, interval);
        }, interval);
    };
    /***最大下行的数据量大小. 5M**/
    BaseWebSocketClient.MAX_RESPONSE_DATA_LENGTH = 5 * 1024 * 1024;
    return BaseWebSocketClient;
}());
exports.BaseWebSocketClient = BaseWebSocketClient;
