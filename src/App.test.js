import React from 'react'
import {shallow, configure, mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import configureStore from 'redux-mock-store'

import App from './App'

const buildStore = configureStore()
configure({adapter: new Adapter()})
describe('App renders without crashing', () => {
  let store
  let wrapper
  const initialState = {}
  beforeEach(() => {
    store = buildStore(initialState)
    wrapper = shallow(<App store={store} />)
  })

  it('renders without crashing', () => {
    shallow(<App store={store} />)
  })
})
