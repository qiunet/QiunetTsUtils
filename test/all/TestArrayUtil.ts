import * as assert from 'assert';
import {ArrayUtil} from "../../src/utils/ArrayUtil";

export class TestArrayUtil {
    static testArrayFunc(){
        let arr:Array<string> = new Array();
        assert.ok(ArrayUtil.isEmpty(arr), "array not empty!");

        arr.push("13");
        arr.push("12");

        assert.ok(!ArrayUtil.isEmpty(arr), "array is empty!");
        assert.ok(ArrayUtil.container(arr, "13"));
        assert.ok(arr.length == 2);

        ArrayUtil.removeValue(arr, "13");
        assert.ok(arr.length == 1);
        assert.ok(!ArrayUtil.container(arr, "13"));

        ArrayUtil.clear(arr);
        assert.ok(ArrayUtil.isEmpty(arr), "array not empty!");
    }
}