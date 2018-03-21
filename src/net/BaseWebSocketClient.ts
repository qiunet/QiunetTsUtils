/**
 * Created by qiunet on 18/3/5.
 */
import {ProtocolHeader} from "./ProtocolHeader";
import {ByteOutputBuffer} from "./ByteOutputBuffer";
import {ResponseMapping} from "./ResponseHandler";
import {ByteInputBuffer} from "./ByteInputBuffer";

export abstract class BaseWebSocketClient {
    /***最大下行的数据量大小. 5M**/
    private static MAX_RESPONSE_DATA_LENGTH = 5 * 1024 *1024;

    private _sock:WebSocket;

    protected constructor (url: string) {
        this._sock = new WebSocket(url)
        this._sock.onopen = this._onOpen.bind(this);
        this._sock.onclose = this._onClose.bind(this);
        this._sock.onmessage = this._onMessage.bind(this);
        this._sock.onerror = this._onError.bind(this);
    }

    private _onError(err: MessageEvent) {
        console.log( "[WebSocket]: ",this._sock.url," Error: ", err);
    }

    private _onOpen(){
        this._sock.binaryType = 'arraybuffer'
        console.log( "[WebSocket]: ",this._sock.url," Connected");
    }

    private _onClose(err: MessageEvent){
        console.log( "[WebSocket]: ",this._sock.url," Closed, cause: ", err);
    }

    private _onMessage(event: MessageEvent){
        let inBuffer:ByteInputBuffer = new ByteInputBuffer(event.data);
        let header: ProtocolHeader = new ProtocolHeader();
        header.initByInData(inBuffer);
        /**标头是否有效*/
        if (! header.magicValid()) {
            console.error("response message magic error: ")
            this.close(500, "response message magic error");
            return;
        }

        /**消息长度判断*/
        if (header.getLength() < 1 || header.getLength() > BaseWebSocketClient.MAX_RESPONSE_DATA_LENGTH){
            console.error("response message length error: ", header.getLength())
            this.close(501, "response message length error");
            return;
        }

        let protoData:Uint8Array = inBuffer.readBytes(header.getLength());
        if (! header.crcValid(protoData)) {
            console.error("response message crc error ")
            this.close(502, "response message crc error");
            return;
        }

        ResponseMapping.getResponse(header.getProtocolId()).trigger(protoData);
    }

    /***
     * 关闭当前链接
     * @param {number} code
     * @param {string} reason
     */
    public close(code:number, reason: string) {
        this._sock.close(code, reason);
    }

    /***
     * 发送消息
     * @param {number} cmdId
     * @param {Uint8Array} data
     */
    public sendData(cmdId: number, data:Uint8Array) {
        let self = this;
        this.waitForConnection(function () {
            self.handlerRequestData(cmdId, data)
        }, 50)
    }

    /***
     *
     * @param {number} protocolId 请求的命令
     * @param {Uint8Array} data 字节流数据
     */
    private handlerRequestData(protocolId: number, data:Uint8Array) {
        let out:ByteOutputBuffer = new ByteOutputBuffer(ProtocolHeader.PROTOCOL_HEADER_LENGTH + data.byteLength);
        
        let header: ProtocolHeader = new ProtocolHeader();
        header.initByOutData(protocolId, data);
        header.writeToBuffer(out);
        out.writeBytes(data);
        this._sock.send(out.toByteArray())
    }
    /**
     * 发送数据的一个方法. 没有ready的情况. 延迟发送数据
     * @param sendFunc 发送数据的function
     * @param interval 如果没有准备好. 延迟多少毫秒继续发送
     */
    private waitForConnection(sendFunc: Function, interval: number) {
        if(this._sock.readyState === WebSocket.OPEN) {
            sendFunc()
            return;
        }else if (this._sock.readyState == WebSocket.CLOSING || this._sock.readyState == WebSocket.CLOSED){
            console.error( "[WebSocket]: ",this._sock.url," is Closing or Closed !");
            return;
        }

        var self = this;
        setTimeout(function () {
            self.waitForConnection(sendFunc, interval)
        }, interval)
    }
}