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
                    let a = c & 0x3FF;
                    // 2. Let b be d & 0x3FF.
                    let b = d & 0x3FF;
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

    /***
     * decode 默认使用utf-8 编码
     * @param {Uint8Array} data
     * @returns {string}
     */
    public static decode(data: Uint8Array): string {
        // 3. If input is given, push a copy of input to stream.
        // TODO: Align with spec algorithm - maintain stream on instance.
        let input_stream:Stream = new Stream(data);

        // 4. Let output be a new stream.
        let output: Array<number> = [];

        /** @type {?(number|!Array.<number>)} */
        let result: number | Array<number>;

        let decode: UTF8Decoder = new UTF8Decoder();
        // 5. While true:
        while (true) {
            // 1. Let token be the result of reading from stream.
            let token = input_stream.read();

            // 2. If token is end-of-stream and the do not flush flag is
            // set, return output, serialized.
            // TODO: Align with spec algorithm.
            if (token === EncodingUtil.end_of_stream)
                break;

            // 3. Otherwise, run these subsubsteps:
            // 1. Let result be the result of processing token for decoder,
            // stream, output, and error mode.
            result = decode.handler(input_stream, token);
            // 2. If result is finished, return output, serialized.
            if (result === EncodingUtil.finished)
                break;

            if (result !== null) {
                if (Array.isArray(result))
                    output.push.apply(output, /**@type {!Array.<number>}*/(result));
                else
                    output.push(result);
            }

            // 3. Otherwise, if result is error, throw a TypeError.
            // (Thrown in handler)

            // 4. Otherwise, do nothing.
        }
        do {
            result = decode.handler(input_stream, input_stream.read());
            if (result === EncodingUtil.finished)
                break;
            if (result === null)
                continue;
            if (Array.isArray(result))
                output.push.apply(output, /**@type {!Array.<number>}*/(result));
            else
                output.push(result);
        } while (!input_stream.endOfStream());

        if (output.length > 0 && output[0] === 0xFEFF) {
            // 1. If token is U+FEFF, set BOM seen flag.
            output.shift();
        }

        return this.codePointsToString(output)
    }
    /**
     * @param {!Array.<number>} code_points Array of code points.
     * @return {string} string String of UTF-16 code units.
     */
    private static codePointsToString(code_points: Array<number>): string {
        let s = '';
        for (let i = 0; i < code_points.length; ++i) {
            let cp = code_points[i];
            if (cp <= 0xFFFF) {
                s += String.fromCharCode(cp);
            } else {
                cp -= 0x10000;
                s += String.fromCharCode((cp >> 10) + 0xD800,
                    (cp & 0x3FF) + 0xDC00);
            }
        }
        return s;
    }
    /**
     * 默认使用utf8编码
     * @param content 内容
     */
    public static encode(content: string):Uint8Array {
        let input:Stream = new Stream(EncodingUtil.stringToCodePoints(content)); // 1284

        // 2. Let output be a new stream
        let output:number[] = [];

        /** @type {?(number|!Array.<number>)} */
        let result: number|Array<number>;
        let encode: UTF8Encoder = new UTF8Encoder();
        // 3. While true, run these substeps:
        while (true) {
            // 1. Let token be the result of reading from input.
            let token = input.read();
            if (token === EncodingUtil.end_of_stream)
                break;
            // 2. Let result be the result of processing token for encoder,
            // input, output.
            result = encode.handler(input, token);
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

/**
 * @constructor
 * @implements {Decoder}
 * @param {{fatal: boolean}} options
 */
class UTF8Decoder{

    // utf-8's decoder's has an associated utf-8 code point, utf-8
    // bytes seen, and utf-8 bytes needed (all initially 0), a utf-8
    // lower boundary (initially 0x80), and a utf-8 upper boundary
    // (initially 0xBF).
    private utf8_code_point: number = 0;
    private utf8_bytes_seen: number = 0;
    private utf8_bytes_needed: number = 0;
    private utf8_lower_boundary: number = 0x80;
    private utf8_upper_boundary: number = 0xBF;
    /**
     * @param {boolean} fatal If true, decoding errors raise an exception.
     * @param {number=} opt_code_point Override the standard fallback code point.
     * @return {number} The code point to insert on a decoding error.
     */
    decoderError(fatal: boolean, opt_code_point?: number): number {
        if (fatal)
            throw TypeError('Decoder error');
        return opt_code_point || 0xFFFD;
    }
    /**
     * @param {Stream} stream The stream of bytes being decoded.
     * @param {number} bite The next byte read from the stream.
     * @return {?(number|!Array.<number>)} The next code point(s)
     *     decoded, or null if not enough data exists in the input
     *     stream to decode a complete code point.
     */
    handler(stream: Stream, bite: number) : number | number[]{
        // 1. If byte is end-of-stream and utf-8 bytes needed is not 0,
        // set utf-8 bytes needed to 0 and return error.
        if (bite === EncodingUtil.end_of_stream && this.utf8_bytes_needed !== 0) {
            this.utf8_bytes_needed = 0;
            return this.decoderError(false);
        }

        // 2. If byte is end-of-stream, return finished.
        if (bite === EncodingUtil.end_of_stream)
            return EncodingUtil.finished;

        // 3. If utf-8 bytes needed is 0, based on byte:
        if (this.utf8_bytes_needed === 0) {
            // 0x00 to 0x7F
            if (MathUtil.inRange(bite, 0x00, 0x7F)) {
                // Return a code point whose value is byte.
                return bite;
            }

            // 0xC2 to 0xDF
            else if (MathUtil.inRange(bite, 0xC2, 0xDF)) {
                // 1. Set utf-8 bytes needed to 1.
                this.utf8_bytes_needed = 1;

                // 2. Set UTF-8 code point to byte & 0x1F.
                this.utf8_code_point = bite & 0x1F;
            }

            // 0xE0 to 0xEF
            else if (MathUtil.inRange(bite, 0xE0, 0xEF)) {
                // 1. If byte is 0xE0, set utf-8 lower boundary to 0xA0.
                if (bite === 0xE0)
                    this.utf8_lower_boundary = 0xA0;
                // 2. If byte is 0xED, set utf-8 upper boundary to 0x9F.
                if (bite === 0xED)
                    this.utf8_upper_boundary = 0x9F;
                // 3. Set utf-8 bytes needed to 2.
                this.utf8_bytes_needed = 2;
                // 4. Set UTF-8 code point to byte & 0xF.
                this.utf8_code_point = bite & 0xF;
            }

            // 0xF0 to 0xF4
            else if (MathUtil.inRange(bite, 0xF0, 0xF4)) {
                // 1. If byte is 0xF0, set utf-8 lower boundary to 0x90.
                if (bite === 0xF0)
                    this.utf8_lower_boundary = 0x90;
                // 2. If byte is 0xF4, set utf-8 upper boundary to 0x8F.
                if (bite === 0xF4)
                    this.utf8_upper_boundary = 0x8F;
                // 3. Set utf-8 bytes needed to 3.
                this.utf8_bytes_needed = 3;
                // 4. Set UTF-8 code point to byte & 0x7.
                this.utf8_code_point = bite & 0x7;
            }

            // Otherwise
            else {
                // Return error.
                return this.decoderError(false);
            }

            // Return continue.
            return null;
        }

        // 4. If byte is not in the range utf-8 lower boundary to utf-8
        // upper boundary, inclusive, run these substeps:
        if (!MathUtil.inRange(bite, this.utf8_lower_boundary, this.utf8_upper_boundary)) {

            // 1. Set utf-8 code point, utf-8 bytes needed, and utf-8
            // bytes seen to 0, set utf-8 lower boundary to 0x80, and set
            // utf-8 upper boundary to 0xBF.
            this.utf8_code_point = this.utf8_bytes_needed = this.utf8_bytes_seen = 0;
            this.utf8_lower_boundary = 0x80;
            this.utf8_upper_boundary = 0xBF;

            // 2. Prepend byte to stream.
            stream.prepend(bite);

            // 3. Return error.
            return this.decoderError(false);
        }

        // 5. Set utf-8 lower boundary to 0x80 and utf-8 upper boundary
        // to 0xBF.
        this.utf8_lower_boundary = 0x80;
        this.utf8_upper_boundary = 0xBF;

        // 6. Set UTF-8 code point to (UTF-8 code point << 6) | (byte &
        // 0x3F)
        this.utf8_code_point = (this.utf8_code_point << 6) | (bite & 0x3F);

        // 7. Increase utf-8 bytes seen by one.
        this.utf8_bytes_seen += 1;

        // 8. If utf-8 bytes seen is not equal to utf-8 bytes needed,
        // continue.
        if (this.utf8_bytes_seen !== this.utf8_bytes_needed)
            return null;

        // 9. Let code point be utf-8 code point.
        let code_point = this.utf8_code_point;

        // 10. Set utf-8 code point, utf-8 bytes needed, and utf-8 bytes
        // seen to 0.
        this.utf8_code_point = this.utf8_bytes_needed = this.utf8_bytes_seen = 0;

        // 11. Return a code point whose value is code point.
        return code_point;
    };
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
        let count, offset;
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
        let bytes = [(code_point >> (6 * count)) + offset];

        // 5. Run these substeps while count is greater than 0:
        while (count > 0) {

            // 1. Set temp to code point >> (6 × (count − 1)).
            let temp = code_point >> (6 * (count - 1));

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

    constructor(tokens: Array<number> | Uint8Array) {
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
          let tokens = /**@type {!Array.<number>}*/(token);
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
          let tokens = /**@type {!Array.<number>}*/(token);
          while (tokens.length)
            this.tokens.unshift(tokens.shift());
        } else {
          this.tokens.unshift(token);
        }
      }
}