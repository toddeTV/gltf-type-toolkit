import { createEsbuildPlugin } from 'unplugin'
import { unpluginFactory } from './index.js'

export default createEsbuildPlugin(unpluginFactory)
