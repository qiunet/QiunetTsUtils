import {DateUtil} from "../../src/utils/DateUtil";

export class TestDateUtil {

    public static testDateUtilFunc(){
        let dt:number = DateUtil.currentTimeMillis();
        console.info("13位时间戳是: ", dt);
    }
}