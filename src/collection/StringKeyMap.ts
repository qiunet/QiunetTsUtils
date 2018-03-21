import { BaseMap } from "./BaseMap";

export class StringKeyMap<Val> extends BaseMap<string, Val> {
    private _table:{[key: string]: Val;} = {};
    
    protected getTable() {
        return this._table;
    }
}