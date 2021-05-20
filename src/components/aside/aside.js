// @flow
import React from 'react'
import {Link} from 'react-router-dom'
import './aside.css'
import {isAdmin, isAdminHospital} from '../../_helpers'

type Props = {
  pageType: string,
};


const Asides = (props: Props) => {
  return (<nav className="sidebar sidebar-offcanvas" id="sidebar">
      <ul className="nav">
        {/*<li className="nav-item">
          <Link
            exact="true" 
            to="/dashboard"
            className="nav-link"
            >
            <div className="text-wrapper">
              <p className="profile-name">{(authData && authData.detail && authData.detail.username) ? capitalizeString(authData.detail.username) : 'Admin'}</p>
              <p className="designation">Administrator</p>
            </div>
          </Link>
        </li>*/}
        <li className="nav-item">
          <Link to="/dashboard" className="nav-link">
            <span className="menu-title">Home Screen</span>
            <i className="icon-screen-desktop menu-icon"></i>
          </Link>
        </li>
        <li className="nav-item">
          <Link /*exact*/ to="/activity" className="nav-link">
            <span className="menu-title">Activity Information</span>
            <i className="icon-chart menu-icon"></i>
          </Link>
        </li>
        <li className="nav-item">
          <Link /*exact*/ to="/audit" className="nav-link">
            <span className="menu-title">Audit Information</span>
            <i className="icon-book-open menu-icon"></i>
          </Link>
        </li>
        <li className="nav-item">
          <Link /*exact*/ to="/discrepancy" className="nav-link">
            <span className="menu-title">Discrepancy</span>
            <i className="icon-user-follow menu-icon"></i>
          </Link>
        </li>
        <li className="nav-item">
          <Link /*exact*/ to="/notice" className="nav-link">
            <span className="menu-title">Notices</span>
            <i className="icon-note menu-icon"></i>
          </Link>
        </li>
        {isAdmin() && (<li className="nav-item">
          <Link /*exact*/ to="/hospital" className="nav-link">
            <span className="menu-title">Hospital</span>
            <i className="icon-doc menu-icon"></i>
          </Link>
        </li>)}
        {isAdminHospital() && (<li className="nav-item">
          <Link /*exact*/ to="/doctor" className="nav-link">
            <span className="menu-title">Doctor</span>
            <i className="icon-doc menu-icon"></i>
          </Link>
        </li>)}
        {isAdmin() && (<li className="nav-item">
          <Link /*exact*/ to="/radiologist" className="nav-link">
            <span className="menu-title">Radiologist</span>
            <i className="icon-doc menu-icon"></i>
          </Link>
        </li>)}
        {isAdmin() && (<li className="nav-item">
          <Link /*exact*/ to="/sales" className="nav-link">
            <span className="menu-title">Sales Invoice</span>
            <i className="icon-calculator menu-icon"></i>
          </Link>
        </li>)}
        {isAdmin() && (<li className="nav-item">
          <Link /*exact*/ to="/billing" className="nav-link">
            <span className="menu-title">Billing Invoice</span>
            <i className="icon-calculator menu-icon"></i>
          </Link>
        </li>)}
      </ul>
    </nav>)
}

export default Asides
