import React, { Component } from 'react'
import Layout from '../molecules/Layout'
import MyRequestedPrrrs from '../molecules/MyRequestedPrrrs'
import MyReviewedPrrrs from '../molecules/MyReviewedPrrrs'
import ClaimAPrrr from '../molecules/ClaimAPrrr'

export default class LoggedInHomePage extends Component {
  render(){
    const { session, prrrs=[] } = this.props

    return <Layout className="HomePage" session={session}>
      <ClaimAPrrr
        currentUser={session.user}
        prrrs={prrrs}
      />

      <h1>My Requested Prrrs</h1>
      <MyRequestedPrrrs
        currentUser={session.user}
        prrrs={prrrs}
      />
      <h1>My Reviewed Prrrs</h1>
        <MyReviewedPrrrs
          currentUser={session.user}
          prrrs={prrrs}
      />
    </Layout>
  }
}
