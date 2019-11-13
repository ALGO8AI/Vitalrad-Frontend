// @flow
import React from 'react'
import {Navbar, Nav, Button, NavItem} from 'react-bootstrap'
// import logo from '../../img/logo.png'
import './header.css'
import Icon from 'react-icons-kit'
import {bars} from 'react-icons-kit/fa'
import {NavLink} from 'react-router-dom'

type Props = {
  toggleShow: Function,
}

type State = {}

class Header extends React.Component<Props, State> {
  menuClicked = (e: any) => {
    this.props.toggleShow()
  }

  render() {
    const _radioauth = localStorage.getItem('_radioauth')
    return (
      <div className="header">
        <Navbar expand="lg">
          <Button className="toggle-btn" onClick={e => this.menuClicked(e)}>
            <Icon size={24} icon={bars} />
          </Button>
          <Navbar.Brand href="/">
            <h2>Radio Tracker</h2>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          {_radioauth && _radioauth !== '' ? (
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <NavItem>
                  <NavLink /*exact*/ to="/dashboard" className="nav-link">
                    Dashboard
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink /*exact*/ to="/users" className="nav-link">
                    Users
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    exact
                    to="/logout"
                    className="nav-link"
                    activeClassName="active">
                    Logout
                  </NavLink>
                </NavItem>
              </Nav>
            </Navbar.Collapse>
          ) : null}
        </Navbar>
      </div>
    )
  }
}
export default Header
