// @flow
import React from 'react'
import face8 from '../../img/faces/face8.jpg'
import {Link} from 'react-router-dom'
type Props = {
  pageType: string,
};

const Asides = (props: Props) => {
  return (<nav className="sidebar sidebar-offcanvas" id="sidebar">
      <ul className="nav">
        <li className="nav-item nav-profile">
          <Link
            exact="true" 
            to="/profile"
            className="nav-link"
            >
            <div className="profile-image">
              <img className="img-xs rounded-circle" src={face8} alt="profile face" />
              <div className="dot-indicator bg-success"></div>
            </div>
            <div className="text-wrapper">
              <p className="profile-name">Allen Moreno</p>
              <p className="designation">Administrator</p>
            </div>
            <div className="icon-container">
              <i className="icon-bubbles"></i>
              <div className="dot-indicator bg-danger"></div>
            </div>
          </Link>
        </li>
        <li className="nav-item">
          <Link /*exact*/ to="/dashboard" className="nav-link">
            <span className="menu-title">Dashboard</span>
            <i className="icon-screen-desktop menu-icon"></i>
          </Link>
        </li>
        <li className="nav-item">
          <Link /*exact*/ to="/discrepancy" className="nav-link">
            <span className="menu-title">Discrepancy</span>
            <i className="icon-layers menu-icon"></i>
          </Link>
        </li>
        <li className="nav-item">
          <Link /*exact*/ to="/discrepancy" className="nav-link">
            <span className="menu-title">Batch Info</span>
            <i className="icon-grid menu-icon"></i>
          </Link>
        </li>
        <li className="nav-item">
          <Link /*exact*/ to="/discrepancy" className="nav-link">
            <span className="menu-title">Audit</span>
            <i className="icon-book-open menu-icon"></i>
          </Link>
        </li>
        <li className="nav-item">
          <Link /*exact*/ to="/discrepancy" className="nav-link">
            <span className="menu-title">Notes</span>
            <i className="icon-doc menu-icon"></i>
          </Link>
        </li>
      </ul>
    </nav>)
}

export default Asides
