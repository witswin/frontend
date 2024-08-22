export class Logger {
  isDevelopment: boolean
  constructor() {
    this.isDevelopment = process.env.NODE_ENV === "development"
  }

  public log(...args: any[]) {
    if (this.isDevelopment) console.log(...args)
  }

  public error(...args: any[]) {
    if (this.isDevelopment) console.error(...args)
  }

  public warn(...args: any[]) {
    if (this.isDevelopment) console.warn(...args)
  }
}

export default new Logger()
