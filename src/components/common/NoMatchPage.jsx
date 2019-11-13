// @flow week
import React from 'react'
import {Link} from 'react-router-dom'
import '../../views/LoginPage/login.css'
import Icon from 'react-icons-kit'
import {arrowLeft} from 'react-icons-kit/fa'

export const NoMatchPage = () => (
  <div className="no-found">
    <h2>No Match Found</h2>
    <Link className="create" exact="true" to="/" replace>
      <Icon icon={arrowLeft} />
      Back To Home
    </Link>
  </div>
)
export default NoMatchPage
