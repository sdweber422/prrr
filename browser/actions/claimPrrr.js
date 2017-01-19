import request from '../request'
import state from '../state'
import loadPrrrs from './loadPrrrs'

export default function claimPrrr() {
  return request('post', `/api/pull-request-review-requests/claim`)
    .then(loadPrrrs)
}
