//flow
import React from 'react'
import {shallow, configure, mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import configureStore from 'redux-mock-store'

import {EventList} from '../eventlist'

const buildStore = configureStore()
configure({adapter: new Adapter()})
describe('Event View Page', () => {
  let store
  let wrapper
  let events = [
    {
      _id: '5d734bacd3b1636c3ad3844e',
      title: 'aj Diwal',
      description: 'aj Diwal aj Diwalaj Diwalaj Diwalaj Diwal',
      location: 'California',
    },
    {
      _id: '5d70f599edca2253d69f124a',
      title: 'demoAJ',
      description: 'description',
      location: 'test location',
    },
  ]
  const initialState = {
    eventId: '',
    eventList: [],
  }
  beforeEach(() => {
    store = buildStore(initialState)
    wrapper = shallow(<EventList store={store} events={events} />)
  })

  it('renders without crashing', () => {
    shallow(<EventList store={store} events={events} />)
  })

  it('check div exists', () => {
    expect(wrapper.find('div.category-list').exists()).toBe(true)
  })

  it('check search box', () => {
    expect(wrapper.find('FormControl[type="text"]').exists()).toBe(true)
    wrapper.find('FormControl[type="text"]').simulate('change', {
      target: {name: 'list', value: 'Di'},
    })
    expect(wrapper.state('eventList').length).toEqual(1)
  })
})
