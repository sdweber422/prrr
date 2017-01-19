import React, { Component, PropTypes } from 'react'
import moment from 'moment'
import Link from '../../atoms/Link'
import Date from '../../atoms/Date'
import Button from '../../atoms/Button'
import GithubUsername from '../../atoms/GithubUsername'
import PrrrsTable from '../PrrrsTable'
import unclaimPrrr from '../../../actions/unclaimPrrr'
import completePrrr from '../../../actions/completePrrr'


export default class ClaimedPrrrs extends Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    prrrs: PropTypes.array.isRequired,
  }

  completePrrr(prrr){
    completePrrr(prrr.id)
  }

  renderAdditionalHeaders(){
    return [
      <th key="claimed">Claimed</th>,
      <th key="actions">Actions</th>,
      <th key="completed">Completed</th>
    ]
  }

  renderAdditionalCells = (prrr) => {
    const { currentUser } = this.props
    const claimedByCurrentUser = prrr.claimed_by === currentUser.github_username

    return [
      <td key="claimed">
        <span>by&nbsp;</span>
        <GithubUsername username={prrr.claimed_by} currentUser={currentUser} />
        <span>&nbsp;</span>
        <Date fromNow date={prrr.claimed_at} />
      </td>,
      <td key="actions">
        <Button onClick={_ => unclaimPrrr(prrr.id)} disabled={!claimedByCurrentUser}>
          Unclaim
        </Button>
      </td>,
      <td key="completed">
        <Button
          onClick={_=> this.completePrrr(prrr)}
          disabled={!claimedByCurrentUser}
        >
          Complete
        </Button>
      </td>,
    ]
  }

  render(){
    const prrrs = this.props.prrrs
      .filter(prrr =>
        prrr.claimed_at &&
        !prrr.completed_at
      )
      .sort((a, b) =>
        moment(b.claimed_at).valueOf() -
        moment(a.claimed_at).valueOf()
      )

    return <PrrrsTable
      className="ClaimedPrrrs"
      currentUser={this.props.currentUser}
      prrrs={prrrs}
      renderAdditionalHeaders={this.renderAdditionalHeaders}
      renderAdditionalCells={this.renderAdditionalCells}
    />
  }
}
