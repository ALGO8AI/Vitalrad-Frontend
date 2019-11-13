//flow
import React from 'react'
import {shallow, configure, mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import configureStore from 'redux-mock-store'

import {HobbyList} from '../hobbylist'
import {API_URL} from '../../../../_config'

const buildStore = configureStore()
configure({adapter: new Adapter()})
describe('Hobby List Page', () => {
  let store
  let wrapper
  let hobbies = [
    {_id: '5d4918685404f46484ab7854', name: 'a snake and ladder'},
    {_id: '5d4918545404f46484ab7852', name: 'a test'},
  ]
  const initialState = {
    hobbyId: '',
    hobbiesList: [],
    wsEndPoint: API_URL,
  }
  beforeEach(() => {
    store = buildStore(initialState)
    wrapper = shallow(<HobbyList store={store} hobbies={hobbies} />)
  })

  it('renders without crashing', () => {
    shallow(<HobbyList store={store} />)
  })

  it('check div exists', () => {
    expect(wrapper.find('div.category-list').exists()).toBe(true)
  })

  it('check search box', () => {
    expect(wrapper.find('FormControl[type="text"]').exists()).toBe(true)
    wrapper.find('FormControl[type="text"]').simulate('change', {
      target: {name: 'list', value: 'L'},
    })
    expect(wrapper.state('hobbiesList').length).toEqual(1)
  })
})
