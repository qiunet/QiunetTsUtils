import { JsonUtil } from './../../src/utils/JsonUtil';
import * as assert from 'assert';

export class TestJsonFunc{
    public static testJson(){
        let jsonStr: string = "{\"qiunet\": \"qiuyang\", \"obj\": {\"num\": 1}}";

        let json:JSON = JsonUtil.stringToJson(jsonStr);

        assert.equal("qiuyang", json['qiunet']);
    }
}

TestJsonFunc.testJson();