import React, { Component, PropTypes } from 'react'
import Link from '../../atoms/Link'
import Button from '../../atoms/Button'
import claimPrrr from '../../../actions/claimPrrr'
import completePrrr from '../../../actions/completePrrr'
import unclaimPrrr from '../../../actions/unclaimPrrr'
import './index.sass'


export default class ClaimAPrrr extends Component {
  static propTypes = {
    claimedPrrr: PropTypes.object,
    prrrs: PropTypes.array.isRequired,
    currentUser: PropTypes.object.isRequired,
  }
  constructor(props) {
    super(props)
  }

  render(){
    const { unclaimedPrrrs, claimedPrrr, prrrs, currentUser } = this.props
    const ClaimPrrrBanner = claimedPrrr
    ? <UserClaimedAPrrr claimedPrrr={claimedPrrr} />
    : <UserNeedsToClaimAPrrr prrrs={prrrs} currentUser={currentUser}/>

    return <div className="ClaimAPrrr">
        {ClaimPrrrBanner}
    </div>
  }
}


class UserClaimedAPrrr extends Component {
  render(){
    const { claimedPrrr } = this.props
    const href = `https://github.com/${claimedPrrr.owner}/${claimedPrrr.repo}/pull/${claimedPrrr.number}`
    return <div className="ClaimAPrrr-UserClaimedAPrrr">
      <div className="ClaimAPrrr-UserClaimedAPrrr-Reviewing">
        <h3>Reviewing: </h3>
        <Link href={href} target="_blank">
          {claimedPrrr.owner}/{claimedPrrr.repo}
        </Link>
      </div>
      <div>
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
    const unclaimedPrrrs = prrrs.filter(prrr => !prrr.claimed_by)
    const noPrrrsForYou = unclaimedPrrrs.filter(prrr => prrr.requested_by !== currentUser.github_username)
    const claimButton = (noPrrrsForYou.length === 0)
      ? <div className="ClaimAPrrr-UserNeedsToClaimAPrrr">
          <div className="ClaimAPrrr-UserNeedsToClaimAPrrr-Unavailable">
            <h2>There are currently no Pending Pull Request Review Requests from other Learners at this time. Check back later.</h2>
          </div>
        </div>
      : <div className="ClaimAPrrr-UserNeedsToClaimAPrrr">
          <div className="ClaimAPrrr-UserNeedsToClaimAPrrr-Available">
            <h1>
              Pending Prrrs: {unclaimedPrrrs.length}
            </h1>
            <Button className="ReviewButton"
              onClick={claimPrrr}
            >Review<br/> a PR</Button>
          </div>
        </div>

    return <div className="ClaimAPrrr-UserNeedsToClaimAPrrr">
      {claimButton}
    </div>
  }
}
