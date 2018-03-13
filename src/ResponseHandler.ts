/***
 * 所有的response类继承该类. 并实现IResponse 接口.
 */
export abstract class BaseResponseHandler {
    private readonly protobufFunc:Function;
    private readonly _protocolId: number;

    protected constructor(protobufFunc:Function, protocolId: number) {
        this._protocolId = protocolId;
        this.protobufFunc = protobufFunc;
        console.log(typeof protobufFunc)
        ResponseMapping.putReponse(this.protocolId, this);
    }

    /***
     * 自己实现decode
     * @param {Uint8Array} data 二进制的数据
     * @returns {T} 返回的对象
     */
    abstract trigger(data: Uint8Array);

    /***
     * 协议id
     * @returns {number}
     */
    get protocolId(): number {
        return this._protocolId;
    }
}

/***
 * 存储所有的 BaseResponseHandler
 */
export  class ResponseMapping {
    private static mapping:Map = new Map();

    static getResponse(protocolId: number): BaseResponseHandler {
        return ResponseMapping.mapping.get(protocolId);
    }

    static putReponse(protocolId: number, response: BaseResponseHandler) {
        ResponseMapping.mapping.set(protocolId, response);
    }
}