export class DateUtil {
    /**
     * 当前时间戳
     * @returns {number}
     */
    public static currentTimeMillis(): number {
        return new Date().getTime();
    }

    /***
     * 当前的秒数
     * @returns {number}
     */
    public static currentTimeSeconds(): number {
        return this.currentTimeMillis()/ 1000;
    }
}
