"use strict";
exports.__esModule = true;
/***
 * 所有的response类继承该类. 并实现IResponse 接口.
 */
var BaseResponseHandler = /** @class */ (function () {
    function BaseResponseHandler(protobufFunc, protocolId) {
        this._protocolId = protocolId;
        this.protobufFunc = protobufFunc;
        console.log(typeof protobufFunc);
        ResponseMapping.putReponse(this.getProtocolId(), this);
    }
    /***
     * 协议id
     * @returns {number}
     */
    BaseResponseHandler.prototype.getProtocolId = function () {
        return this._protocolId;
    };
    return BaseResponseHandler;
}());
exports.BaseResponseHandler = BaseResponseHandler;
/***
 * 存储所有的 BaseResponseHandler
 */
var ResponseMapping = /** @class */ (function () {
    function ResponseMapping() {
    }
    ResponseMapping.getResponse = function (protocolId) {
        return ResponseMapping.mapping.get(protocolId);
    };
    ResponseMapping.putReponse = function (protocolId, response) {
        ResponseMapping.mapping.set(protocolId, response);
    };
    ResponseMapping.mapping = new Map();
    return ResponseMapping;
}());
exports.ResponseMapping = ResponseMapping;
