/**
 * End-of-stream is a special token that signifies no more tokens
 * are in the stream.
 * @const
 */
import {MathUtil} from "./MathUtil";

export class EncodingUtil {
    static end_of_stream: number = -1;
    static finished:number = -1;

    private static stringToCodePoints(content:string): number[] {
        let ret: number[] = [];
        // 1. Let S be the DOMString value.
        let s:String = String(content);
        // 2. Let n be the length of S.
        let n = s.length;
        // 3. Initialize i to 0.
        let i = 0;
        // 4. Initialize U to be an empty sequence of Unicode characters.
        let u:number[] = [];
        // 5. While i < n:
        while (i < n) {
        // 1. Let c be the code unit in S at index i.
        let c = s.charCodeAt(i);
        // 2. Depending on the value of c:
        // c < 0xD800 or c > 0xDFFF
        if (c < 0xD800 || c > 0xDFFF) {
            // Append to U the Unicode characterwith code point c. 
            u.push(c);
        }
        // 0xDC00 ≤ c ≤ 0xDFFF
        else if (0xDC00 <= c && c <= 0xDFFF) {
            // Append to U a U+FFFD REPLACEMENT CHARACTER.
            u.push(0xFFFD);
        }
        // 0xD800 ≤ c ≤ 0xDBFF
        else if (0xD800 <= c && c <= 0xDBFF) {
            // 1. If i = n−1, then append to U a U+FFFD REPLACEMENT
            // CHARACTER.
            if (i === n - 1) {
            u.push(0xFFFD);
            }
            // 2. Otherwise, i < n−1:
            else {
                // 1. Let d be the code unit in S at index i+1.
                let d = s.charCodeAt(i + 1);
                // 2. If 0xDC00 ≤ d ≤ 0xDFFF, then:
                if (0xDC00 <= d && d <= 0xDFFF) {
                    // 1. Let a be c & 0x3FF.
                    var a = c & 0x3FF;
                    // 2. Let b be d & 0x3FF.
                    var b = d & 0x3FF;
                    // 3. Append to U the Unicode character with code point
                    // 2^16+2^10*a+b.
                    u.push(0x10000 + (a << 10) + b);
                    // 4. Set i to i+1.
                    i += 1;
                }
                // 3. Otherwise, d < 0xDC00 or d > 0xDFFF. Append to U a
                // U+FFFD REPLACEMENT CHARACTER.
                else  {
                    u.push(0xFFFD);
                }
            }
        }
        // 3. Set i to i+1.
        i += 1;
        }
        // 6. Return U.
        return u;
    }
    /**
     * 默认使用utf8编码
     * @param content 内容
     */
    public static encode(content: string):Uint8Array {
        var input:Stream = new Stream(EncodingUtil.stringToCodePoints(content)); // 1284

        // 2. Let output be a new stream
        var output:number[] = [];

        /** @type {?(number|!Array.<number>)} */
        var result;
        // 3. While true, run these substeps:
        while (true) {
        // 1. Let token be the result of reading from input.
        var token = input.read();
        if (token === EncodingUtil.end_of_stream)
            break;
        // 2. Let result be the result of processing token for encoder,
        // input, output.
        result = new UTF8Encoder().handler(input, token);
        if (result === EncodingUtil.finished)
            break;
        if (Array.isArray(result))
            output.push.apply(output, /**@type {!Array.<number>}*/(result));
        else
            output.push(result);
        }
        // 3. If result is finished, convert output into a byte sequence,
        // and then return a Uint8Array object wrapping an ArrayBuffer
        // containing output.
        return new Uint8Array(output);
    }
}

class UTF8Encoder {

    /**
     * @param {Stream} stream Input stream.
     * @param {number} code_point Next code point read from the stream.
     * @return {(number|!Array.<number>)} Byte(s) to emit.
     */
    handler(stream: Stream, code_point: number) : number | number[]{
        // 1. If code point is end-of-stream, return finished.
        if (code_point === EncodingUtil.end_of_stream)
            return EncodingUtil.finished;

        // 2. If code point is an ASCII code point, return a byte whose
        // value is code point.
        if (MathUtil.isASCIIByte(code_point))
            return code_point;

        // 3. Set count and offset based on the range code point is in:
        var count, offset;
        // U+0080 to U+07FF, inclusive:
        if (MathUtil.inRange(code_point, 0x0080, 0x07FF)) {
            // 1 and 0xC0
            count = 1;
            offset = 0xC0;
        }
        // U+0800 to U+FFFF, inclusive:
        else if (MathUtil.inRange(code_point, 0x0800, 0xFFFF)) {
            // 2 and 0xE0
            count = 2;
            offset = 0xE0;
        }
        // U+10000 to U+10FFFF, inclusive:
        else if (MathUtil.inRange(code_point, 0x10000, 0x10FFFF)) {
            // 3 and 0xF0
            count = 3;
            offset = 0xF0;
        }

        // 4. Let bytes be a byte sequence whose first byte is (code
        // point >> (6 × count)) + offset.
        var bytes = [(code_point >> (6 * count)) + offset];

        // 5. Run these substeps while count is greater than 0:
        while (count > 0) {

            // 1. Set temp to code point >> (6 × (count − 1)).
            var temp = code_point >> (6 * (count - 1));

            // 2. Append to bytes 0x80 | (temp & 0x3F).
            bytes.push(0x80 | (temp & 0x3F));

            // 3. Decrease count by one.
            count -= 1;
        }

        // 6. Return bytes bytes, in order.
        return bytes;
    }
}

class Stream {
    tokens: Array<number>| number[] = null;

    constructor(tokens: Array<number> | number[]) {
        this.tokens = [].slice.call(tokens);
        this.tokens.reverse();
    }

    /**
     * @return {boolean} True if end-of-stream has been hit.
     */
     endOfStream():boolean {
        return !this.tokens.length;
    }
  
    /**
     * When a token is read from a stream, the first token in the
     * stream must be returned and subsequently removed, and
     * end-of-stream must be returned otherwise.
     *
     * @return {number} Get the next token from the stream, or
     * end_of_stream.
     */
    read(): number{
        if (this.endOfStream())
            return EncodingUtil.end_of_stream;
        return this.tokens.pop();
    }
  
      /**
       * When one or more tokens are prepended to a stream, those tokens
       * must be inserted, in given order, before the first token in the
       * stream.
       *
       * @param {(number|!Array.<number>)} token The token(s) to prepend to the
       * stream.
       */
      prepend(token: any):void {
        if (Array.isArray(token)) {
          var tokens = /**@type {!Array.<number>}*/(token);
          while (tokens.length)
            this.tokens.push(tokens.pop());
        } else {
          this.tokens.push(token);
        }
      }
  
      /**
       * When one or more tokens are pushed to a stream, those tokens
       * must be inserted, in given order, after the last token in the
       * stream.
       *
       * @param {(number|!Array.<number>)} token The tokens(s) to push to the
       * stream.
       */
      push(token: number | Array<number>):void {
        if (Array.isArray(token)) {
          var tokens = /**@type {!Array.<number>}*/(token);
          while (tokens.length)
            this.tokens.unshift(tokens.shift());
        } else {
          this.tokens.unshift(token);
        }
      }
}