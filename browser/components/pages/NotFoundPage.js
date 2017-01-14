import React, { Component } from 'react'
import sadCat1 from '../../images/sadcat1.gif'
import sadCat2 from '../../images/sadcat2.gif'
import sadCat3 from '../../images/sadcat3.gif'
import sadCat4 from '../../images/sadcat4.gif'
import Link from '../atoms/Link'
import './NotFoundPage.sass'

export default class NotFoundPage extends Component {

  whichSadCat() {
    let num = Math.floor( Math.random() * 4 )
    if ( num === 0 ) {
      return sadCat1
    }
    else if ( num === 1 ) {
      return sadCat2
    }
    else if ( num === 2 ) {
      return sadCat3
    }
    else {
      return sadCat4
    }
  }

  render(){
    // console.log("hmmmm", this.whichSadCat())
    return <div className="NotFoundPage">
      <div className="header">
        <Link className="hompageLink" href="/"><h2>Home</h2></Link>
      </div>

      <div className="PageMain">
        <h1 className="NotFound">Page Not Found</h1>
        <h2>{this.props.location.pathname}</h2>
        <img src={ this.whichSadCat() } className='SadCat'/>
      </div>
      <div className="links">
        <div className="SendIssue">
          <h4 className="SomethingWrong">Think you got this error by mistake?</h4>
          <Link className="hompageLink" href="https://github.com/GuildCrafts/prrr/issues/new">Let us know!</Link>
        </div>
      </div>
    </div>
  }
}
