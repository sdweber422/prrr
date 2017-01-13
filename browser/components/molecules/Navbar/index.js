import React, { Component, PropTypes } from 'react'
import Button from '../../atoms/Button'
import Link from '../../atoms/Link'
import Avatar from '../../atoms/Avatar'
import './index.sass'
import favicon from '../../../images/favicon.ico'
import logout from '../../../actions/logout'

export default class Navbar extends Component {

  static propTypes = {
    session: PropTypes.object.isRequired,
  }

  render(){
    const { user } = this.props.session
    return <div className="Navbar">
      <div>
        <Button type={false} href="/">
          <img src={favicon} className="Navbar-favicon" />
        </Button>
        &nbsp;
        <Button className="Navbar-button-add-prrr" href="/request"> Add a Prrr </Button>
        <Link href="/metrics">Metrics</Link>
      </div>
      <div>
        <p className="Navbar-title"> Prrr </p>
      </div>
      <div>
        <span>{user.name}</span>
        <Avatar user={user} />
        <Button className="Navbar-button-logout" onClick={logout}>Logout</Button>
      </div>
    </div>
  }
}
