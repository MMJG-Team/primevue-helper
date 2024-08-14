import ApiDoc, { ApiDocMockData } from './components/api-doc';

import './style.less'

const TEST_CLASS = ApiDoc
const MOCK_DATA = ApiDocMockData

const doc = new TEST_CLASS('#app', {
    data: MOCK_DATA
})

doc.init()
doc.render()