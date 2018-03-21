import { ILoopFunction, ArrayUtil, IEqualsFunction, defaultEquals } from "../utils/ArrayUtil";

class LinkedListNode<T> {
    element: T;
    next: LinkedListNode<T>;
    pre: LinkedListNode<T>;

    constructor(element:T, pre: LinkedListNode<T>, next: LinkedListNode<T>) {
        this.element = element;
        this.pre = pre;
        this.next = next;

        if (this.pre != null) {
            this.pre.next = this;
        }

        if (this.next != null) {
            this.next.pre = this;
        }
    }
}
/**
 * 链表结构的一个数据结构
 */
export class LinkedList<T> {
    private _size: number = 0;
    private head: LinkedListNode<T> = null;
    private tail: LinkedListNode<T> = null;
    
    constructor(){}
    /**
     * 添加元素到首部
     * @param element 
     */
    public addFirst(element: T) {
        let node = new LinkedListNode(element, null, this.head);
        this.head = node;

        if(this.isEmpty()) {
            this.tail = node;
        }
        this._size++;
    }
    /**
     * 添加元素到尾部
     * @param element 
     */
    public addLast(element: T) {
        let node = new LinkedListNode(element, this.tail, null);
        this.tail = node;
        if(this.isEmpty()) {
            this.head = node;
        }
        this._size++;
    }
    /**
     * 列表长度
     */
    public size(): number {
        return this._size;
    }
    /**
     */
    public isEmpty():boolean {
        return this.size() === 0;
    }
    /**
     * 返回第一个元素. 不删除
     */
    public first():T {
        if (this.head != null) {
            return this.head.element;
        }
        return null;
    }
    /**
     * 返回最后一个元素. 不删除
     */
    public last(): T {
        if (this.tail != null) {
            return this.tail.element;
        }
        return null;
    }

    /**
     * 清除列表
     */
    public clear(): void {
        this._size = 0;
        this.head = null;
        this.tail = null;
    }
    /**
     *  迭代linkedlist
     * @param func 选择的方法
     * @param reverse 是否反向迭代.true 反向
     */
    public foreach(func: ILoopFunction<T>, reverse?:boolean) {
        if (reverse) {
            let currNode: LinkedListNode<T> = this.tail;
            while (currNode != null) {
                if (func(currNode.element) == true) {
                    break;
                }
                currNode = currNode.pre;
            }
        }else {
            let currNode: LinkedListNode<T> = this.head;
            while (currNode != null) {
                if (func(currNode.element) == true) {
                    break;
                }
                currNode = currNode.next;
            }
        }
    }
    /**
     * 转为数组
     */
    public toArray(reverse?: boolean):T[] {
        let arr:T[] = [];
        this.foreach(function(t : T): void {
            arr.push(t);
        }, reverse);
        return arr;
    }
    /**
     * 得到位置index 的元素
     * @param index 索引
     */
    public get(index: number):T {
        let node: LinkedListNode<T> = this._nodeAtIndex(index);
        if (node != null) {
            return node.element;
        }
        return null;
    }
    /**
     * 判断是否包含某个元素
     * @param element 
     * @param equalsFunction 对比方法. 没有默认使用 === 比较 
     */
    public contains(element: T, equalsFunction?:IEqualsFunction<T>): boolean {
        let func: IEqualsFunction<T> = (equalsFunction == null ? defaultEquals : equalsFunction);
        let ret: boolean = false;
        this.foreach(function(ele:T) {
            if (func(element, ele)) {
                // 这里返回ture 是break foreach用的.
                return true;
            }
        });
        return ret;
    }

    /**
     * 删除某个元素
     * @param element 元素 
     * @param equalsFunction 对比方法. 没有默认使用 === 比较 
     */
    public remove(element: T, equalsFunction?: IEqualsFunction<T>): boolean {
        let func: IEqualsFunction<T> = (equalsFunction == null ? defaultEquals : equalsFunction);
        let self = this;
        let index:number = 0;
        let ret: boolean = false;
        this.foreach(function(ele: T){
            if (func(ele, element)) {
                self.removeEleAtIndex(self._size - 1 - index);
                ret = true;
            }else {
                index ++;
            }
        }, true);
        return ret;
    }
    /**
     * 删除位于index 的数据
     * @param index 
     */
    public removeEleAtIndex(index: number):T {
        let node: LinkedListNode<T> = this._nodeAtIndex(index);
        if (node == null) {
            return null;
        }
        if (this._size == 1) {
            this.clear();
            return node.element;
        }

        if (node.pre != null && node.next != null) {
            node.pre.next = node.next;
            node.next.pre = node.pre;            
        }else {
            if (node.pre == null) {
                // head
                node.next.pre = node.pre;
                this.head = node.next;
            } 
            if (node.next == null) {
                // tail
                node.pre.next = null;
                this.tail = node.pre;
            }
        }

        this._size--;
        return node.element;
    }
    /**
     * 得到index位置的node
     * @param index 
     */
    private _nodeAtIndex(index: number) :LinkedListNode<T>{
        if (index < 0 || index >= this.size()) {
            return null;
        }
        if (index === (this.size() - 1)) {
            return this.tail;
        }

        let node: LinkedListNode<T> = this.head;
        for (var i = 0 ; i < index; i++) {
            node = node.next;
        }
        return node;
    }
    /**
     * 弹出头部的对象. 如果队列为空. 返回null
     */
    public poll(): T {
        return this.removeEleAtIndex(0);
    }
}