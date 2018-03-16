import {ByteOutputBuffer} from "../../src/net/ByteOutputBuffer";
import {ByteInputBuffer} from "../../src/net/ByteInputBuffer";
import {ProtocolHeader} from "../../src/net/ProtocolHeader";

import * as assert from 'assert';
import { MathUtil } from "../../src/utils/MathUtil";

export class TestProtocolHeader{
    static testProtocolHeader(){
        let contentData: ByteOutputBuffer = new ByteOutputBuffer(22);
        contentData.writeByte(12);
        contentData.writeShort(12345);
        contentData.writeString("1234");
        contentData.writeFloat(2.11);
        contentData.writeDouble(3.22);

        let content: Uint8Array = contentData.toByteArray();

        let header : ProtocolHeader = new ProtocolHeader();
        header.initByOutData(1000, content);

        let totalBuffer: ByteOutputBuffer = new ByteOutputBuffer(content.byteLength + ProtocolHeader.PROTOCOL_HEADER_LENGTH);
        header.writeToBuffer(totalBuffer);
        totalBuffer.writeBytes(content);

        // ---------------------------//


        let decodeBuffer: ByteInputBuffer = new ByteInputBuffer(totalBuffer.toByteArray().buffer);
        let inHeader:ProtocolHeader = new ProtocolHeader();
        inHeader.initByInData(decodeBuffer);
        let decodeContent:Uint8Array = decodeBuffer.readBytes(inHeader.getLength());
        assert.ok(inHeader.magicValid() && inHeader.crcValid(decodeContent));

        let decodeContentData: ByteInputBuffer = new ByteInputBuffer(decodeContent.buffer);
        assert.equal(decodeContentData.readByte(), 12, "not equals");
        assert.equal(decodeContentData.readShort(), 12345, "not equals");
        assert.equal(decodeContentData.readString(), "1234", "not equals");

        let value: number = decodeContentData.readFloat();
        console.log("readFloat value: ", value);
        assert.ok(value >= 2.10 && value <= 2.12)

        value = decodeContentData.readDouble();
        console.log("readDouble value: ", value);
        assert.ok(value >= 3.21 && value <= 3.23);
    }
}