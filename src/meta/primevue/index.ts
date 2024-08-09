import Meta from '../core'
import { COMPONENT_TREE_DATA } from './component-tree-data'

export default function use(register: typeof Meta.register) {
    register('primevue', COMPONENT_TREE_DATA)
}