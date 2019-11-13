//flow
import React from 'react'
import {shallow, configure, mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import configureStore from 'redux-mock-store'

import {OrgList} from '../organizationlist'

const buildStore = configureStore()
configure({adapter: new Adapter()})
describe('Organization Side List', () => {
  let store
  let wrapper
  let orgs = [
    {
      _id: '5d64ef4a8f3d4f1e76073a91',
      name: '111122222',
      location: 'California',
      primaryPoc: 'demo ajita1111',
      email: 'nitin@mailinator.com',
    },
    {
      _id: '5d64d2af23a2fb17054e9d57',
      name: '1122 lisp',
      location: 'California',
      primaryPoc: '1122 poc lis demo 11111',
      email: '11lsp2@mailinator.com',
    },
  ]
  const initialState = {
    orgId: '',
    orgsList: [],
  }
  beforeEach(() => {
    store = buildStore(initialState)
    wrapper = shallow(<OrgList store={store} orgs={orgs} />)
  })

  it('renders without crashing', () => {
    shallow(<OrgList store={store} orgs={orgs} />)
  })

  it('check div exists', () => {
    expect(wrapper.find('div.category-list').exists()).toBe(true)
  })

  it('check search box', () => {
    expect(wrapper.find('FormControl[type="text"]').exists()).toBe(true)
    wrapper.find('FormControl[type="text"]').simulate('change', {
      target: {name: 'list', value: '1122'},
    })
    expect(wrapper.state('orgsList').length).toEqual(2)

    wrapper.find('FormControl[type="text"]').simulate('change', {
      target: {name: 'list', value: 'lisp'},
    })
    expect(wrapper.state('orgsList').length).toEqual(1)
  })
})
