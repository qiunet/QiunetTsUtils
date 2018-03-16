import {DateUtil} from "../../src/utils/DateUtil";
import {Level, Logger} from "../../src/logger/Logger";

export class TestDateUtil {
    private static logger: Logger = Logger.getLogger();

    public static testDateUtilFunc(){
        let dt:number = DateUtil.currentTimeMillis();
        this.logger.info("13位时间戳是: ", dt);
    }
}