// flow

import React from 'react'
import {shallow, configure} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Header from './header'

configure({adapter: new Adapter()})
describe('header renders without crashing', () => {
  it('renders without crashing', () => {
    shallow(<Header />)
  })
})
