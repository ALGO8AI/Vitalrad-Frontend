//flow
import React from 'react'
import {shallow, configure, mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import configureStore from 'redux-mock-store'

import {SeniorList} from '../seniorlist'

const buildStore = configureStore()
configure({adapter: new Adapter()})
describe('User Side List', () => {
  let store
  let wrapper
  let users = [
    {
      _id: '5d6643234e734a34404bec43',
      firstName: '11 vin 1122',
      lastName: 'kumar',
      cellPhone: '(457)-457-7445',
      isActive: true,
    },
    {
      _id: '5d664d7cce4cef451d433908',
      firstName: 'anshu',
      lastName: 'shukla',
      cellPhone: '(534)-653-5353',
      isActive: true,
    },
  ]
  const initialState = {
    userId: '',
    usersList: [],
  }
  beforeEach(() => {
    store = buildStore(initialState)
    wrapper = shallow(<SeniorList store={store} users={users} />)
  })

  it('renders without crashing', () => {
    shallow(<SeniorList store={store} users={users} />)
  })

  it('check div exists', () => {
    expect(wrapper.find('div.category-list').exists()).toBe(true)
  })

  it('check search box', () => {
    expect(wrapper.find('FormControl[type="text"]').exists()).toBe(true)
    wrapper.find('FormControl[type="text"]').simulate('change', {
      target: {name: 'list', value: 'anshu'},
    })
    expect(wrapper.state('usersList').length).toEqual(1)

    wrapper.find('FormControl[type="text"]').simulate('change', {
      target: {name: 'list', value: 'kumar'},
    })
    expect(wrapper.state('usersList').length).toEqual(1)
  })
})
