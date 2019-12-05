//flow
import React from 'react'
import {shallow, configure} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import {HobbyPage} from '../HobbyPage'

configure({adapter: new Adapter()})
const mockHobbyfn = jest.fn()
describe('Hobby Page', () => {
  it('renders without crashing', () => {
    shallow(<HobbyPage hobbyListing={mockHobbyfn} />)
  })

  it('check div exists', () => {
    expect(
      shallow(<HobbyPage hobbyListing={mockHobbyfn} />)
        .find('div.heading')
        .exists()
    ).toBe(true)
  })

  it('check content', () => {
    expect(
      shallow(<HobbyPage hobbyListing={mockHobbyfn} />)
        .find('div.heading h2')
        .text()
    ).toBe('Hobbies')
  })
})
