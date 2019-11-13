//flow
import React from 'react'
import {shallow, configure, mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import configureStore from 'redux-mock-store'

import {NoMatchPage} from '../NoMatchPage'

const buildStore = configureStore()
configure({adapter: new Adapter()})
describe('NoMatchPage View Page', () => {
  let store
  let wrapper
  const initialState = {}

  beforeEach(() => {
    store = buildStore(initialState)
    wrapper = shallow(<NoMatchPage />)
  })

  it('renders without crashing', () => {
    shallow(<NoMatchPage />)
  })

  it('check h2 exists', () => {
    expect(wrapper.find('h2').exists()).toBe(true)
  })
})
