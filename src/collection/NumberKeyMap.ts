import { BaseMap } from "./BaseMap";
/**
 * 只允许number 作为key的map
 */
export class NumberKeyMap<Val> extends BaseMap<number, Val> {
    private _table:{[key: number]: Val;} = {};
    
    protected getTable() {
        return this._table;
    } 
}