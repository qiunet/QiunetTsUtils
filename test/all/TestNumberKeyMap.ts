import * as assert from 'assert';
import {Map} from "../../src/collection/Map";
import {CommonUtil} from "../../src/utils/CommonUtil";
import {ArrayList} from "../../src/collection/ArrayList";
import {NumberKeyMap} from "../../src/collection/NumberKeyMap";

export class TestMap {
    public static testFunc(){
        let map:NumberKeyMap<string> = new NumberKeyMap<string>();
        map.put(11, "11");
        map.put(11, "21");
        map.put(21, "11");
        map.put(31, "11");

        let list:ArrayList<string> = map.toArray();
        assert.equal(3, list.size());

        assert.equal(3, map.size());
        //
        assert.equal("21", map.get(11))
        assert.equal("21",map.remove(11));
        assert.equal(2 ,map.size());
        assert.ok(! map.containsKey(11))
        assert.ok(map.containsKey(21))
        map.clear();
        assert.ok(! map.containsKey(21))
    }
}

TestMap.testFunc();
