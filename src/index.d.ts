declare module "*.js.text" {
  const content: string
  export default content
}

declare interface Window {
  __esbuildLiveReloadPort?: number
}
