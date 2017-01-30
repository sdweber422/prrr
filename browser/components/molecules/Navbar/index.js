import React, { Component, PropTypes } from 'react'
import Button from '../../atoms/Button'
import Link from '../../atoms/Link'
import Avatar from '../../atoms/Avatar'
import './index.sass'
import favicon from '../../../images/favicon.ico'

export default class Navbar extends Component {

  static propTypes = {
    session: PropTypes.object.isRequired,
  }

  render(){
    const { user } = this.props.session
    return <div className="Navbar">
      <div className="Navbar-inline-links">
        <Link href="/">Home</Link>
        <Link href="/request">Add a Prrr</Link>
        <Link href="/metrics">Metrics</Link>
        <Link href="/all">All Prrrs</Link>
      </div>
      <div>
        <Link className="Navbar-logo" href="/">
          <img src={favicon} />
          <span>Prrr</span>
        </Link>
      </div>
      <div>
        <span>{user.name}</span>
        <Avatar user={user} />
        <Link href="/logout" externalLink className="Navbar-button-logout">Logout</Link>
      </div>
    </div>
  }
}
