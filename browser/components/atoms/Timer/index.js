import React, { Component, PropTypes } from 'react'
import moment from 'moment'
import './index.sass'

export default class Timer extends Component {
  static proptTypes = {
    claimedPrrr: PropTypes.object.isRequired,
  }
  constructor(props) {
    super(props)
    this.state = { secondsElapsed: 0 }
  }
  tick() {
    this.setState((prevState) => ({
      secondsElapsed: prevState.secondsElapsed + 5
    }));
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 5000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render(){
    const { claimedPrrr } = this.props
    const claimed = moment(claimedPrrr.claimed_at)
    const deadline = claimed.clone().add(60, 'minutes')
    const timer = (claimed, deadline) => {
      const countdown = deadline.diff(moment(), 'seconds')
      const minutes = Math.ceil(countdown/60) === 60
        ? "00"
        : `0${Math.ceil(countdown/60)}`.slice(-2)
      const hour = countdown > 3541
        ? 1
        : 0
      const formattedTime = `${hour}:${minutes}`
       return countdown > 0
      ? <div>{formattedTime}</div>
      : <div className="Timer-OutOfTime">0:00</div>
    }
    return <div className="Timer" >
      <div>TIME</div>
      <div className="Timer-Clock">{timer(claimed, deadline)}</div>
      <div>LEFT</div>
    </div>
  }
}
