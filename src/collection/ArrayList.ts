import { ILoopFunction, ArrayUtil } from "../utils/ArrayUtil";
import { CommonUtil } from "../..";
/**
 * 模仿java的ArrayList
 */
export class ArrayList<T> {
    private array:Array<T> = new Array();

    constructor(){}
    /**
     * 添加元素
     * @param ele 
     */
    public add(ele: T){
        this.array.push(ele);
    }
    /**
     * 合并一个list
     */
    public merge(list: ArrayList<T>) {
        let self = this;
        ArrayUtil.foreach(list.array, function(element:T){
             self.add(element);
        })
    }
    /**
     * 添加多个
     */
    public addAll(...elements: T[]) {
        let self = this;
       ArrayUtil.foreach(elements, function(element:T){
            self.add(element);
       })
    }
    /****
     * 删除指定索引的元素
     * 没有的话. 返回null
     */
    public remove(index: number):T {
        let ret:T[] = this.array.splice(index, 1);
        if (! CommonUtil.isNullOrUndefined(ret) && ret.length > 0){
            return ret[0];
        }
        return null;
    }
    /**
     * 没有返回 -1
     * @param ele 
     */
    public indexOf(ele:T): number {
        return this.array.indexOf(ele);
    }
    /**
     * 没有返回 -1
     * @param ele 
     */
    public lastIndexOf(ele:T): number {
        return this.array.lastIndexOf(ele);
    }
    /**
     * 是否包含指定元素
     * @param ele 
     */
    public contains(ele: T):boolean {
        return this.indexOf(ele) != -1;
    }
    /**
     * 
     * @param index 获得索引
     */
    public get(index: number): T {
        return this.array[index];
    }
    /**
     * 长度
     */
    public size(): number {
        return this.array.length;
    }
    /**
     * 是否是空数组
     */
    public isEmpty(): boolean {
        return this.size() === 0;
    }
    /**
     * 清除
     */
    public clear(){
        this.array = new Array();
    }
    /**
     * 
     * @param func 循环arrayLIst
     * @param reverse 
     */
    public forEach(func: ILoopFunction<T>, reverse?:boolean){
        ArrayUtil.foreach(this.array, func);
    }
    /**
     * 转换为数组. 就是本身
     */
    public toArray():T [] {
        return this.array;
    }
    /**
     * 克隆
     */
    public clone(): ArrayList<T> {
        let arr: ArrayList<T> = new ArrayList();
        this.forEach(function(ele:T){
            arr.add(ele);
        });
        return arr;
    }
}