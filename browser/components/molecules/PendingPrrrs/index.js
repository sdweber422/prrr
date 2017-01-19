import React, { Component, PropTypes } from 'react'
import moment from 'moment'
import Icon from '../../atoms/Icon'
import Link from '../../atoms/Link'
import Button from '../../atoms/Button'
import PrrrsTable from '../PrrrsTable'
import ErrorMessage from '../../atoms/ErrorMessage'
import claimPrrr from '../../../actions/claimPrrr'
import './index.sass'

export default class PendingPrrrs extends Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    prrrs: PropTypes.array.isRequired,
  }

  constructor(props){
    super(props)
    this.state = {
      error: null,
      errorTimeoutId: null
    }
  }

  claimPrrr(prrr){
    claimPrrr(prrr.id)
      .then(_ => {
        const url = `https://github.com/${prrr.owner}/${prrr.repo}/pull/${prrr.number}`
        const popup = window.open(url, '_blank')
        if (popup) popup.focus()
      })
      .catch(error => {
        console.warn('Claim Error')
        console.error(error)
        this.setState({error})
        this.scheduleErrorRemoval()
      })
  }

  scheduleErrorRemoval() {
    if (this.state.errorTimeoutId) {
      clearTimeout(this.state.errorTimeoutId)
    }

    const errorTimeoutId = setTimeout(() => {
      this.setState({error: null})
    }, 5000)

    this.setState({errorTimeoutId})
  }

  renderAdditionalHeaders(){
    return [
      <th key="actions">Actions</th>,
    ]
  }

  renderAdditionalCells = (prrr) => {
    const { currentUser } = this.props
    const disabled = prrr.requested_by === currentUser.github_username
    const requestByCurrentUser = prrr.requested_by === currentUser.github_username
    return [
      <td key="claim">
        <Button onClick={_ => this.claimPrrr(prrr)} disabled={disabled}>
          Claim
        </Button>
      </td>,
      <td key="archive" className="PendingPrrrs-archive">
        <Button onClick={_ => confirmArchivePrrr(href, prrr)} disabled={!requestByCurrentUser}>
          <Icon type="times" />
        </Button>
      </td>,
    ]
  }

  render(){
    const prrrs = this.props.prrrs
      .filter(prrr => !prrr.claimed_by)
      .sort((a, b) =>
        moment(a.created_at).valueOf() -
        moment(b.created_at).valueOf()
      )

    return <div>
      {this.state.error ? <ErrorMessage error={this.state.error} /> : null}
      <PrrrsTable
        className="PendingPrrrs"
        currentUser={this.props.currentUser}
        prrrs={prrrs}
        renderAdditionalHeaders={this.renderAdditionalHeaders}
        renderAdditionalCells={this.renderAdditionalCells}
      />
    </div>
  }
}




function confirmArchivePrrr(href, prrr){
  const message = `Are you sure you want to archive your\n\nPull Request Review Request for\n\n${href}`
  if (confirm(message)) archivePrrr(prrr.id)
}
