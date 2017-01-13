iimport React, { Component } from 'react'
import sadCat from '../../images/SadCat.gif'
import Link from '../atoms/Link'
import './NotFoundPage.sass'

export default class NotFoundPage extends Component {

  render(){
    return <div className="NotFoundPage">
      <div className="PageMain">
        <h1 className="NotFound">Page Not Found</h1>
        <h2>{this.props.location.pathname}</h2>
        <img src={sadCat} className='SadCat'/>
      </div>
      <div className="links">
        <Link className="hompageLink" href="/">Get me out of here!</Link>
        <div className="SendIssue">
          <h4 className="SomethingWrong">Is there something wrong?</h4>
          <Link className="hompageLink" href="https://github.com/GuildCrafts/prrr/issues/new">Let us know!</Link>
        </div>
      </div>
    </div>
  }
}
