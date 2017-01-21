import React, { Component, PropTypes } from 'react'
import moment from 'moment'
import Prrrs from '../../../Prrrs'
import Link from '../../atoms/Link'
import Button from '../../atoms/Button'
import GithubUsername from '../../atoms/GithubUsername'
import Countdown from '../../atoms/Countdown'
import { claimPrrr, completePrrr, unclaimPrrr } from '../../../actions'
import './index.sass'

export default class ClaimAPrrr extends Component {
  static propTypes = {
    claimedPrrr: PropTypes.object,
    prrrs: PropTypes.instanceOf(Prrrs).isRequired,
    currentUser: PropTypes.object.isRequired,
  }

  render(){
    const { prrrs, currentUser } = this.props

    const claimedPrrr = prrrs.claimed()

    const ClaimPrrrBanner = claimedPrrr
      ? <UserClaimedAPrrr
        claimedPrrr={claimedPrrr}
        currentUser={currentUser}
      />
      : <UserNeedsToClaimAPrrr
        currentUser={currentUser}
        prrrs={prrrs}
      />

    return <div className="ClaimAPrrr">
      {ClaimPrrrBanner}
    </div>
  }
}

class UserClaimedAPrrr extends Component {
  render(){
    const { claimedPrrr, currentUser } = this.props
    const href = `https://github.com/${claimedPrrr.owner}/${claimedPrrr.repo}/pull/${claimedPrrr.number}`
    const deadline = moment(claimedPrrr.claimed_at).add(1, 'hour')
    return <div className="ClaimAPrrr-UserClaimedAPrrr">
      <div>
        <h3>Reviewing: </h3>
        <Link href={href} target="_blank">
          {claimedPrrr.owner}/{claimedPrrr.repo}/pull/{claimedPrrr.number}
        </Link>
        <br/>
        <span> for </span>
        <GithubUsername username={claimedPrrr.requested_by} currentUser={currentUser} />
      </div>
      <div>
        <Countdown deadline={deadline} />
      </div>
      <div className="ClaimAPrrr-UserClaimedAPrrr-Buttons">
        <Button
          onClick={_ => unclaimPrrr(claimedPrrr.id)}
        >
          Unclaim
        </Button>
        <Button
          onClick={_=> completePrrr(claimedPrrr.id)}
        >
          Complete
        </Button>
      </div>
    </div>
  }
}

class UserNeedsToClaimAPrrr extends Component {
  render(){
    const { prrrs, currentUser } = this.props
    const pendingPrrrs = prrrs.pending()

    const claimButton = pendingPrrrs.length === 0
      ? <div className="ClaimAPrrr-UserNeedsToClaimAPrrr-Unavailable">
          <h2>There are currently no Pending Pull Request Review Requests from other Learners at this time. Check back later.</h2>
        </div>
      : <div className="ClaimAPrrr-UserNeedsToClaimAPrrr-Available">
          <h1>
            Pending Prrrs: {pendingPrrrs.length}
          </h1>
          <Button className="ReviewButton"
            onClick={claimPrrr}
          >Review<br/> a PR</Button>
        </div>

    return <div className="ClaimAPrrr-UserNeedsToClaimAPrrr">
      {claimButton}
    </div>
  }
}
