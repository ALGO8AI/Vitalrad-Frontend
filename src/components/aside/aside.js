// @flow
import React from 'react'
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
            <div className="text-wrapper">
              <p className="profile-name">Admin</p>
              <p className="designation">Administrator</p>
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
            <span className="menu-title">Activity Info</span>
            <i className="icon-grid menu-icon"></i>
          </Link>
        </li>
        <li className="nav-item">
          <Link /*exact*/ to="/audit" className="nav-link">
            <span className="menu-title">Audit Info</span>
            <i className="icon-book-open menu-icon"></i>
          </Link>
        </li>
        <li className="nav-item">
          <Link /*exact*/ to="/discrepancy" className="nav-link">
            <span className="menu-title">Notices</span>
            <i className="icon-doc menu-icon"></i>
          </Link>
        </li>
      </ul>
    </nav>)
}

export default Asides
