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

export class Logger {
    private _logLevel:Level;

    private constructor(level: Level) {
        this._logLevel = level;
    }

    public static getLogger(): Logger{
        return this.getLoggerByLevel(Level.INFO);
    }

    public static getLoggerByLevel(level: Level): Logger{
        return new Logger(level);
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
        let desc: string = "[INFO] ";
        switch (level) {
            case Level.DEBUG:
                desc = "[DEBUG] ";
                break;
            case Level.ERROR:
                desc = "[ERROR] ";
                break;
        }
        return desc + msg + " " + arg;
    }
    /***
     * 打印 debug 消息
     * @param {string} msg
     * @param arg
     */
    public debug(msg: string, ...arg:any[] ) : void{
        if (this.isDebugEnable()) {
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
        if (this.isErrorEnable()) {
            console.log(this.logMsg(Level.ERROR, msg, arg));
        }
    }
}