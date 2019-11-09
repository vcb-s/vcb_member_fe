namespace Type {
  export interface env {
    mode?: 'development'|'production'
    devServerHost?: string
    devServerPort?: number
    dumpConfigOnly?: 1|0
  }
}

export default Type
