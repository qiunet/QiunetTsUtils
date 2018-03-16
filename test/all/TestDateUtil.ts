import {DateUtil} from "../../src/utils/DateUtil";

export class TestDateUtil {
    public static testDateUtilFunc(){
        let dt:number = DateUtil.currentTimeMillis();
        console.log(dt)
    }
}