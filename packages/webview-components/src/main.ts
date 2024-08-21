import ApiDoc, { ApiDocMockData } from './modules/api-doc';
import ComponentTree, { ComponentTreeMockData } from './modules/component-tree';

import './style.less'

const TEST_CLASS = ComponentTree
const MOCK_DATA = ComponentTreeMockData

const doc = new TEST_CLASS('#app', {
    data: MOCK_DATA
})

doc.init()
doc.render()