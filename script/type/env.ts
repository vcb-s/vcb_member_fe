namespace Type {
  export interface envLoaderParam {
    focus?: boolean
  }
  export interface env {
    mode?: 'development'|'production'
    HOST?: string
  }
}

export default Type
