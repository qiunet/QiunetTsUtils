import {ByteOutputBuffer} from "../src/ByteOutputBuffer";
import {ByteInputBuffer} from "../src/ByteInputBuffer";
class Test{
    static testByteBuffer(){
        let outBuffer: ByteOutputBuffer = new ByteOutputBuffer(10);
        outBuffer.writeByte(12);
        outBuffer.writeShort(12345);
        outBuffer.writeString("1234");

        let buffer:Uint8Array = outBuffer.toByteArray();
        let inBuffer:ByteInputBuffer = new ByteInputBuffer(buffer.buffer);

        console.log(inBuffer.readByte());
        console.log(inBuffer.readShort());
        console.log(inBuffer.readString());
    }
}

Test.testByteBuffer();