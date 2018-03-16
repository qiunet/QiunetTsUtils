
export class CommonUtil {
    /****
     * 是否是null 或者未定义
     * @param obj
     * @returns {boolean}
     */
    public static isNullOrUndefined(obj: any): boolean {
        return this.isUndefined(obj) || this.isNull(obj);
    }

    /**
     * 是否是undefined
     * @param obj
     * @returns {boolean}
     */
    public static isUndefined(obj: any): boolean {
        return typeof(obj) == "undefined";
    }

    /**
     * 是否是null
     * @param obj
     * @returns {boolean}
     */
    public static isNull(obj: any): boolean {
        return null == obj;
    }

    /**
     * 是否是nunber
     * @param obj
     * @returns {boolean}
     */
    public static isNumber(obj: any): boolean {
        return typeof(obj) == "number";
    }

    /***
     * 是否是string
     * @param obj
     * @returns {boolean}
     */
    public static isString(obj: any): boolean {
        return typeof(obj) == "string";
    }

    /***
     * 是否是boolean
     * @param obj
     * @returns {boolean}
     */
    public static isBoolean(obj: any): boolean {
        return typeof(obj) == "boolean";
    }

    /**
     * 是否是function
     * @param obj
     * @returns {boolean}
     */
    public static isFunction(obj: any): boolean {
        return typeof(obj) == "function";
    }
}