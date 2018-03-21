## QiunetTsUtils

    自己的ts工具类. 
    和服务端交换的部分以及读取设定的部分都可以从这找到解决方案.
    

## Install
> `npm install qiunet_ts_utils`

## API

###  net
在 test/all 有个 `LogicClient` 模板. 是用来发送数据和服务器交互的.     
response的处理: 

    import {BaseResponseHandler} from "qiunet_ts_utils";
    import {LoginResponse} from "../resources/protos/login";

    export class LoginResponseHandler extends BaseResponseHandler {
        constructor (){super(LoginResponse, 1001)}
        trigger(data: Uint8Array) {
            let response:LoginResponse = LoginResponse.decode(data);
        }
    }
    new LoginResponseHandler();

### logger
> 使用<br /> 
 `let logger:Logger = new Logger(Level.INFO)`<br />
  然后就可以打印日志了.<br />
 `logger.info("日志内容")`
 
### collection
> 使用的类似Java的`ArrayList` 和 `LinkedList`  <br />
> `let array:ArrayList<string> = new ArrayList();` <br />
> `let array:LinkedList<string> = new LinkedList();`<br />
> map 的使用有些不一样<br />
> 因为ts只支持 number 和 string 作为key.<br />
> 所以分别定义了 `NumberKeyMap` 和 `StringKeyMap`


 
### utils
> 各种工具类 自行查看.
   