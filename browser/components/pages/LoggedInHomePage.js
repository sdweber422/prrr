import React, { Component } from 'react'
import Layout from '../molecules/Layout'
import InspectObject from '../utils/InspectObject'
import PendingPrrrs from '../molecules/PendingPrrrs'
import MyRequestedPrrrs from '../molecules/MyRequestedPrrrs'
import MyReviewedPrrrs from '../molecules/MyReviewedPrrrs'
import ClaimedPrrrs from '../molecules/ClaimedPrrrs'
import ClaimAPrrr from '../molecules/ClaimAPrrr'

export default class LoggedInHomePage extends Component {
  render(){
    const { session, prrrs=[] } = this.props

    const unclaimedPrrrs = prrrs.filter(prrr => !prrr.claimed_by)

    const claimedPrrr = prrrs.find(prrr =>
      prrr.claimed_by === session.user.github_username
    )

    return <Layout className="HomePage" session={session}>

      <ClaimAPrrr
        currentUser={session.user}
        prrrs={prrrs}
        claimedPrrr={claimedPrrr}
        unclaimedPrrrs={unclaimedPrrrs}
      />
      <h1>Pull Requests Waiting For Review:</h1>
      <PendingPrrrs
        currentUser={session.user}
        prrrs={prrrs}
      />

      <h1>Claimed Pull Requests:</h1>
      <ClaimedPrrrs
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
