import {ArrayList} from "../../src/collection/ArrayList";
import * as assert from "assert";
export class TestArrayList{
    public static testFunc(){
        let list:ArrayList<String> = new ArrayList();
        list.add("0");
        list.add("1");
        list.addAll("2", "3");
        
        assert.equal(4, list.size());
        
        assert.equal(2, list.lastIndexOf("2"));
        assert.equal(false, list.contains("5"));
        assert.equal(true, list.contains("1"));
        
        assert.equal("2", list.remove(2));
        assert.equal(3, list.size());
    }
}
