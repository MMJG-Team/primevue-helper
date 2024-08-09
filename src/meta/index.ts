import Meta from "./core"
import { default as primevueInstall } from "./primevue"

export type { ComponentMeta } from './core'
export { default as Meta } from './core'

primevueInstall(Meta.register)