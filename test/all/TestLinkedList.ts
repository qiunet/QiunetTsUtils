import {LinkedList} from "../../src/collection/LinkedList";
import * as assert from 'assert';

export class TestLinkedList {
    public static testFunc(){
        let list: LinkedList<String> = new LinkedList();
        list.addLast("1");
        list.addLast("2");
        list.addLast("3");
        list.addLast("2");
        
        list.addFirst("0");
        
        assert.equal(5, list.size());
        assert.equal("1", list.get(1));
        assert.equal("2", list.get(4));
        
        assert.ok(list.remove("2"));
        assert.equal(3, list.size());
        
        assert.ok(!list.contains("2"));

        assert.equal("0", list.poll());
        assert.equal(2, list.size());

        list.clear();
        assert.equal(0, list.size());
        assert.ok(! list.contains("1"));
    }
}
