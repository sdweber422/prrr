import React, { Component } from 'react'
import Layout from '../molecules/Layout'
import MyRequestedPrrrs from '../molecules/MyRequestedPrrrs'
import MyReviewedPrrrs from '../molecules/MyReviewedPrrrs'
import ClaimAPrrr from '../molecules/ClaimAPrrr'
import ToggleableSection from '../utils/ToggleableSection'

export default class LoggedInHomePage extends Component {
  render(){
    const { session, prrrs=[] } = this.props

    return <Layout className="HomePage" session={session}>
      <ClaimAPrrr
        currentUser={session.user}
        prrrs={prrrs}
      />
      
      <ToggleableSection title="My Requested Prrrs">
        <MyRequestedPrrrs
          currentUser={session.user}
          prrrs={prrrs}
        />
      </ToggleableSection>

      <ToggleableSection title="My Reviewed Prrrs">
        <MyReviewedPrrrs
          currentUser={session.user}
          prrrs={prrrs}
        />
      </ToggleableSection>
    </Layout>
  }
}
