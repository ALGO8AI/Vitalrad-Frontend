//flow
import React from 'react'
import {shallow, configure, mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import configureStore from 'redux-mock-store'

import {CategoryList} from '../categorylist'

const buildStore = configureStore()
configure({adapter: new Adapter()})
describe('Category View Page', () => {
  let store
  let wrapper
  let categories = [
    {_id: '5d42871f0c9bd27be043aaf0', name: 'ES5 basic syntaxs'},
    {_id: '5d3c1419a1776d08a1a42d32', name: 'Fifth Category Name'},
  ]
  const initialState = {
    categoryId: '',
    categoriesList: [],
  }
  beforeEach(() => {
    store = buildStore(initialState)
    wrapper = shallow(<CategoryList store={store} categories={categories} />)
  })

  it('renders without crashing', () => {
    shallow(<CategoryList store={store} categories={categories} />)
  })

  it('check div exists', () => {
    expect(wrapper.find('div.category-list').exists()).toBe(true)
  })

  it('check search box', () => {
    expect(wrapper.find('FormControl[type="text"]').exists()).toBe(true)
    wrapper.find('FormControl[type="text"]').simulate('change', {
      target: {name: 'list', value: 'b'},
    })
    expect(wrapper.state('categoriesList').length).toEqual(1)
  })
})
