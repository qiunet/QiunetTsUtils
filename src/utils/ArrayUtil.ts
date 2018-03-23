import { CommonUtil} from "./CommonUtil";

export interface ILoopFunction<T> {
    /**
     * 数组迭代使用的. 返回 true 表示 break. 
     */
    (a:T, index?: number):  boolean | void;
}
/**
* Function signature for comparing
* <0 means a is smaller
* = 0 means they are equal
* >0 means a is larger
*/
export interface ICompareFunction<T> {
    (a: T, b: T): number;
}
/**
* 比较是否相等 相等返回true
*/
export interface IEqualsFunction<T> {
    (a: T, b: T): boolean;
}

/**
 * Default function to compare element order.
 * @function
 */
export function defaultCompare<T>(a: T, b: T): number {
    if (a < b) {
        return -1;
    } else if (a === b) {
        return 0;
    } else {
        return 1;
    }
}

/**
 * Default function to test equality.
 * @function
 */
export function defaultEquals<T>(a: T, b: T): boolean {
    return a === b;
}

export enum ArraySortType {
    /**升序*/
    UPPER = 1,
    /**降序*/
    LOWER = 2,
}

export class ArrayUtil {
    /***
     * copy 一个数组
     * @param {Array<T>} arr 数组
     * @param {number} start 开始索引 可选
     * @param {number} end 结束索引 可选
     * @returns {Array<T>}
     */
    public static copy<T> (arr: Array<T>, start?: number, end?: number): Array<T> {
        return arr.slice(start, end);
    }

    /***
     * 是否包含该元素
     * @param {Array<T>} arr
     * @param {T} value
     * @returns {boolean}
     */
    public static container<T>(arr: Array<T>, value: T): boolean {
        return arr.length > 0 && arr.indexOf(value) != -1;
    }

    /***
     * 是否包含符合func条件的对象
     * @param {Array<T>} arr
     * @param {T} value
     * @param {Function} func
     * @returns {boolean}
     */
    public static containerByFunc<T>(arr: Array<T>, value: T, func:Function): boolean {
        if (arr.length == 0) return false;

        for (var i = 0 ; i < arr.length; i++) {
            if (func(arr[i])) {
                return true;
            }
        }
        return false;
    }

    /***
     * 得到符合func条件的数组
     * @param {Array<T>} arr
     * @param {Function} func
     * @returns {T[]}
     */
    public static getByFunc<T>(arr: Array<T>, func:Function): T[] {
        let ret:T[] = [];
        if (arr.length == 0) return ret;

        for (var i = 0 ; i < arr.length; i++) {
            if (func(arr[i])) {
                ret.push(arr[i]);
            }
        }
        return ret;
    }
    /**
     * 从数组移除元素
     * @param arr
     * @param value
     * @param mackCopy    创建副本
     * @return
     */
    public static removeValue<T>(arr: Array<T>, value: T): boolean {
        var i: number = arr.indexOf(value);
        if (i >= 0) {
            arr.splice(i, 1);
            return true;
        }
        return false;
    }

    /**
     * 从数组移除元素
     * @param arr
     * @param at
     * @return
     */
    public static removeValueAt<T>(arr: Array<T>, at: number): T {
        if (arr.length > at && at >= 0) {
            return arr.splice(at)[0];
        }
        return null;
    }
    /***
     * 是否是空数组
     * @param {Array<T>} array
     * @returns {boolean}
     */
    public static isEmpty<T>(array: Array<T>) : boolean {
        return array == null || array.length == 0;
    }
    /****
     * 清空数组
     * @param {Array<T>} array
     */
    public static clear<T>(array: Array<T>): void {
        for (var i = 0 ; i < array.length; i++) {
            array[i] = null;
        }
        array.length = 0;
    }

    /***
     * 打乱顺序
     * @param {Array<T>} array
     * @param {boolean} copy
     * @returns {Array<T>}
     */
    public static shuffle<T>(array: Array<T> , copy: boolean = false): Array<T> {
        if (copy) {
            array = ArrayUtil.copy(array);
        }
        array.sort(function () {
            return Math.random() - 0.5 < 0 ? -1 : 1;
        });
        return array;
    }
    /**
     * 
     * @param array 
     */
    public static toString<T>(array: T[]): string {
        return '[' + array.toString() + ']';
    }
    /**
     * 迭代一个数组. 如果返回的是false 就break
     * @param array 
     * @param func 
     */
    public static foreach<T>(array: Array<T>, func: ILoopFunction<T>): void {
        if (CommonUtil.isNullOrUndefined(array)) {
            console.error("array is null or undefined");
            return;
        }
        for(var index = 0 ; index < array.length; index++) {
            if (func(array[index], index) == true) {
                break;
            }
        }
    }
}