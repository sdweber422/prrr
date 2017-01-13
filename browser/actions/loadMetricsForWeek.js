import request from '../request'
import state from '../state'

export default function loadMetricsForWeek(week) {
  return request('get', `/api/metrics/${week}`)
    .then(response => {
      const metrics = state.get().metrics || {}
      metrics[week] = response.json
      state.set({
        metrics,
        loadMetricsForWeekError: null,
      })
    })
    .catch(loadMetricsForWeekError => {
      state.set({loadMetricsForWeekError})
    })
}
