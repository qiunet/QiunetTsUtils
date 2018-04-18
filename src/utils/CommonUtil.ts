import {Map} from "../collection/Map";
import {StringKeyMap} from "../collection/StringKeyMap";
import {NumberKeyMap} from "../collection/NumberKeyMap";

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
        return typeof(obj) === "undefined";
    }

    /**
     * 是否是null
     * @param obj
     * @returns {boolean}
     */
    public static isNull(obj: any): boolean {
        return null === obj;
    }

    /**
     * 是否是nunber
     * @param obj
     * @returns {boolean}
     */
    public static isNumber(obj: any): boolean {
        return typeof(obj) === "number";
    }

    /***
     * 是否是string
     * @param obj
     * @returns {boolean}
     */
    public static isString(obj: any): boolean {
        return typeof(obj) === "string";
    }

    /***
     * 是否是boolean
     * @param obj
     * @returns {boolean}
     */
    public static isBoolean(obj: any): boolean {
        return typeof(obj) === "boolean";
    }

    /**
     * 是否是function
     * @param obj
     * @returns {boolean}
     */
    public static isFunction(obj: any): boolean {
        return typeof(obj) === "function";
    }
    /**
     * 根据类型. 生成对应的map
     * @param keyType
     */
    public static createMap<key extends number|string, Val>(numberMap:boolean):Map<key, Val> {
        if (numberMap){
            return <Map<key, Val>>new NumberKeyMap<Val>();
        }else {
            return <Map<key, Val>>new StringKeyMap<Val>();
        }
    }
}
