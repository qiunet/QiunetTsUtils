import {BaseWebSocketClient} from "../../src/net/BaseWebSocketClient";

class LogicClient extends BaseWebSocketClient {
    private static client: LogicClient;

    private constructor (){
        super(require("./NetConfig").logicServer)
    }

    public static getInstance(): LogicClient {
        if (LogicClient.client == null) {
            LogicClient.client = new LogicClient();
        }
        return LogicClient.client;
    }
}
/// 这个只能浏览器支持. ts-node 不支持
// LogicClient.getInstance();