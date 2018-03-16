/***
 * 日志级别
 */
export enum Level {
    ALL = 0,
    DEBUG = 1,
    INFO = 2,
    ERROR = 3,
    OFF = 4,
}

export abstract class Logger {
    private _logLevel:Level;

    protected constructor(level: Level) {
        this._logLevel = level;
    }
    public isDebugEnable(): boolean {
        return this._logLevel <= Level.DEBUG;
    }

    public isInfoEnable(): boolean {
        return this._logLevel <= Level.INFO;
    }

    public isErrorEnable(): boolean {
        return this._logLevel <= Level.ERROR;
    }

    /**
     * 拼接字符串
     * @param {Level} level
     * @param {string} msg
     * @param arg
     * @returns {string}
     */
    private logMsg(level: Level, msg: string, ...arg:any[] ): string {
        return level.toString() + ": "+ msg + " " + arg;
    }
    /***
     * 打印 debug 消息
     * @param {string} msg
     * @param arg
     */
    public debug(msg: string, ...arg:any[] ) : void{
        if (this.isInfoEnable()) {
            console.log(this.logMsg(Level.DEBUG, msg, arg));
        }
    }
    /***
     * 打印info 消息
     * @param {string} msg
     * @param arg
     */
    public info(msg: string, ...arg:any[] ) : void{
        if (this.isInfoEnable()) {
            console.log(this.logMsg(Level.INFO, msg, arg));
        }
    }
    /***
     * 打印 error 消息
     * @param {string} msg
     * @param arg
     */
    public error(msg: string, ...arg:any[] ) : void{
        if (this.isInfoEnable()) {
            console.log(this.logMsg(Level.ERROR, msg, arg));
        }
    }
}