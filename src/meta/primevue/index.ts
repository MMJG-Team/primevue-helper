import { TYPES_FOR_UI } from 'src/constants/event'
import Meta from '../core'
import { COMPONENT_TREE_DATA } from './component-tree-data'

export default function use(register: typeof Meta.register) {
    register(TYPES_FOR_UI.PRIMEVUE, COMPONENT_TREE_DATA)
}