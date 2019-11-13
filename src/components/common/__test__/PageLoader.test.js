//flow
import React from 'react'
import {shallow, configure, mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import configureStore from 'redux-mock-store'

import {PageLoader} from '../PageLoader'

const buildStore = configureStore()
configure({adapter: new Adapter()})
describe('PageLoader View Page', () => {
  let store
  let wrapper
  const initialState = {}

  beforeEach(() => {
    store = buildStore(initialState)
    wrapper = shallow(<PageLoader store={store} />)
  })

  it('renders without crashing', () => {
    shallow(<PageLoader store={store} />)
  })

  it('check div exists', () => {
    expect(wrapper.find('div.preloader').exists()).toBe(true)
  })
})
