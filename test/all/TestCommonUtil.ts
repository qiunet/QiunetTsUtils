import * as assert from 'assert';
import {CommonUtil} from "../../src/utils/CommonUtil";

export class TestCommonUtil {

    public static testCommonUtilFunc(){
        var t;
        assert.ok(CommonUtil.isNullOrUndefined(t));

        t = 12;
        assert.ok(! CommonUtil.isNullOrUndefined(t));

        assert.ok(CommonUtil.isNull(null));
        assert.ok(CommonUtil.isBoolean(true));
        assert.ok(! CommonUtil.isBoolean(null));
        assert.ok(CommonUtil.isString(""));
        assert.ok(! CommonUtil.isString(null));
        assert.ok(CommonUtil.isNumber(123));
        assert.ok(! CommonUtil.isNumber(null));
        assert.ok(CommonUtil.isFunction(function () {
            
        }))
    }
}