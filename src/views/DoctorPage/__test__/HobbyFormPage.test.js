//flow
import React from 'react'
import {shallow, configure} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import configureStore from 'redux-mock-store'

import {HobbyFormPage} from '../HobbyFormPage'
configure({adapter: new Adapter()})
const buildStore = configureStore()
const mockHobbyfn = jest.fn()
describe('Hobby Form Page', () => {
  let store
  let wrapper
  const initialState = {
    name: '',
    description: '',
    submitted: false,
    categoryId: '',
    hobbyId: '',
    categoriesList: [],
  }

  beforeEach(() => {
    store = buildStore(initialState)
    wrapper = shallow(
      <HobbyFormPage
        store={store}
        detail={mockHobbyfn}
        create={mockHobbyfn}
        updateDetail={mockHobbyfn}
        listing={mockHobbyfn}
      />
    )
  })

  it('renders without crashing', () => {
    shallow(
      <HobbyFormPage
        store={store}
        detail={mockHobbyfn}
        create={mockHobbyfn}
        updateDetail={mockHobbyfn}
        listing={mockHobbyfn}
      />
    )
  })

  it('check div exists', () => {
    expect(wrapper.find('div.create-container').exists()).toBe(true)
  })

  it('name value check', () => {
    wrapper.find('FormControl[name="name"]').simulate('change', {
      target: {name: 'name', value: 'Cricket'},
    })
    expect(wrapper.state('name')).toEqual('Cricket')
  })

  it('description value check', () => {
    wrapper.find('FormControl[name="description"]').simulate('change', {
      target: {name: 'description', value: 'Love Cricket'},
    })
    expect(wrapper.state('description')).toEqual('Love Cricket')
  })

  it('Category value check', () => {
    wrapper.find('FormControl[name="categoryId"]').simulate('change', {
      target: {name: 'categoryId', value: '5d3c1419a1776d08a1a42d32'},
    })
    expect(wrapper.state('categoryId')).toEqual('5d3c1419a1776d08a1a42d32')
  })

  it('Check Form submission', () => {
    expect(wrapper.state('submitted')).toEqual(false)
    wrapper.find('FormControl[name="name"]').simulate('change', {
      target: {name: 'name', value: 'Cricket'},
    })

    wrapper.find('FormControl[name="categoryId"]').simulate('change', {
      target: {name: 'categoryId', value: '5d3c1419a1776d08a1a42d32'},
    })

    wrapper.find('FormControl[name="description"]').simulate('change', {
      target: {
        name: 'description',
        value: 'Love Cricket Love Cricket Love Cricket',
      },
    })
    wrapper.find('Form[name="form"]').simulate('submit', {preventDefault() {}})
    expect(wrapper.state('submitted')).toEqual(true)
  })
})
