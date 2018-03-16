import {ByteOutputBuffer} from "../src/net/ByteOutputBuffer";
import {ByteInputBuffer} from "../src/net/ByteInputBuffer";
import {ProtocolHeader} from "../src/net/ProtocolHeader";

export class TestProtocolHeader{
    static testProtocolHeader(){
        let contentData: ByteOutputBuffer = new ByteOutputBuffer(10);
        contentData.writeByte(12);
        contentData.writeShort(12345);
        contentData.writeString("1234");
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
        if (inHeader.magicValid() && inHeader.crcValid(decodeContent)){
            let decodeContentData: ByteInputBuffer = new ByteInputBuffer(decodeContent.buffer);
            console.log(decodeContentData.readByte());
            console.log(decodeContentData.readShort());
            console.log(decodeContentData.readString());
        }
    }
}