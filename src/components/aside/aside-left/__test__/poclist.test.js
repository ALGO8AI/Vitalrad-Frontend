//flow
import React from 'react'
import {shallow, configure, mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import configureStore from 'redux-mock-store'

import {PocList} from '../poclist'

const buildStore = configureStore()
configure({adapter: new Adapter()})
describe('POC Side List', () => {
  let store
  let wrapper
  let pocs = [
    {
      _id: '5d638ab9fd6f5a169cadb48b',
      name: '1111222',
      cellPhone: '(985)-685-4755',
      email: 'nitin@mailinator.com',
      alternativePhone: '(225)-423-5523',
    },
    {
      _id: '5d662d91e7dad814821cde45',
      name: '1111demo demo',
      cellPhone: '(985)-674-5874',
      email: 'nitin@mailinator.com',
      alternativePhone: '(352)-525-5252',
    },
  ]
  const initialState = {
    pocId: '',
    pocsList: [],
    wsEndPoint: '',
  }
  beforeEach(() => {
    store = buildStore(initialState)
    wrapper = shallow(<PocList store={store} pocs={pocs} />)
  })

  it('renders without crashing', () => {
    shallow(<PocList store={store} pocs={pocs} />)
  })

  it('check div exists', () => {
    expect(wrapper.find('div.category-list').exists()).toBe(true)
  })

  it('check search box', () => {
    expect(wrapper.find('FormControl[type="text"]').exists()).toBe(true)
    wrapper.find('FormControl[type="text"]').simulate('change', {
      target: {name: 'list', value: '11'},
    })
    expect(wrapper.state('pocsList').length).toEqual(2)

    wrapper.find('FormControl[type="text"]').simulate('change', {
      target: {name: 'list', value: 'demo'},
    })
    expect(wrapper.state('pocsList').length).toEqual(1)
  })
})
