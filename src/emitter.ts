import mitt from 'mitt'
import { EMITTER_EVENTS } from './constants/event'

const Emitter = mitt<Record<EMITTER_EVENTS, any>>()

export default Emitter