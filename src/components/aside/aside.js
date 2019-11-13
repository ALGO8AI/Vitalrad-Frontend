// @flow
import React from 'react'
import Asideleft from './aside-left/aside-left'
import './aside.css'

type Props = {
  pageType: string,
}

const Asides = (props: Props) => {
  return <Asideleft {...props} />
}

export default Asides
