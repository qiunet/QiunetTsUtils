import { NumberKeyMap } from "../collection/NumberKeyMap";

/***
 * 所有的response类继承该类. 并实现IResponse 接口.
 */
export abstract class BaseWsResponseHandler {
    private readonly _protocolId: number;

    protected constructor(protocolId: number) {
        this._protocolId = protocolId;
        ResponseMapping.putReponse(this.getProtocolId(), this);
    }

    /***
     * 自己实现decode
     * @param {Uint8Array} data 二进制的数据
     * @returns {T} 返回的对象
     */
    abstract response(data: Uint8Array):void;

    /***
     * 协议id
     * @returns {number}
     */
    public getProtocolId(): number {
        return this._protocolId;
    }
}

/***
 * 存储所有的 BaseResponseHandler
 */
export  class ResponseMapping {
    private static mapping: NumberKeyMap<BaseWsResponseHandler> = new NumberKeyMap();

    static getResponse(protocolId: number): BaseWsResponseHandler {
        return this.mapping.get(protocolId);
    }

    static putReponse(protocolId: number, response: BaseWsResponseHandler) {
        this.mapping.put(protocolId, response);
    }
}