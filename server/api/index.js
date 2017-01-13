import express from 'express'
import Commands from '../commands'
import Queries from '../queries'

const router = new express.Router()

router.use((req, res, next) => {
  req.queries = new Queries(req.user)
  req.commands = new Commands(req.user)
  next()
})

router.get('/session', (req, res, next) => {
  res.json({
    user: req.user
  })
});

router.post('/logout', (req, res, next) => {
  req.logout();
  res.json(null)
});


router.get('/metrics/:week', (req, res, next) => {
  req.queries.metricsForWeek(req.params.week)
    .then(metrics => {
      res.json(metrics)
    })
    .catch(next)
});

router.get('/pull-request-review-requests', (req, res, next) => {
  req.queries.getPrrrs()
    .then(prrrs => {
      res.json(prrrs)
    })
    .catch(next)
});

router.post('/pull-request-review-requests', (req, res, next) => {
  req.commands.createPrrr({
    owner: req.body.owner,
    repo: req.body.repo,
    number: Number(req.body.number),
  })
    .then(prrr => {
      res.json(prrr)
    })
    .catch(next)
});

router.post('/pull-request-review-requests/:prrrId/claim', (req, res, next) => {
  const { prrrId } = req.params
  req.commands.claimPrrr(prrrId)
    .then(_ => {
      res.json({claimed: true, id: prrrId})
    })
    .catch(next)
});

router.post('/pull-request-review-requests/:prrrId/unclaim', (req, res, next) => {
  const { prrrId } = req.params
  req.commands.unclaimPrrr(prrrId)
    .then(prrr => {
      res.json(prrr)
    })
    .catch(next)
});


router.post('/pull-request-review-requests/:prrrId/archive', (req, res, next) => {
  const { prrrId } = req.params
  req.commands.archivePrrr(prrrId)
    .then(_ => {
      res.json({id: prrrId, archived: true})
    })
    .catch(next)
});

router.post('/pull-request-review-requests/:prrrId/complete', (req, res, next) => {
  const { prrrId } = req.params
  req.commands.completePrrr(prrrId)
    .then(_ => {
      res.json({id: prrrId, complete:true})
    })
    .catch(next)
});

// error handlers

router.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

router.use((error, req, res, next) => {
  let status = error.code || error.status
  if (typeof status !== 'number') status = 500
  const stack = process.env.NODE_ENV === 'development'
    ? error.stack
    : null
  const json = {
    error: {},
  }
  Object.assign(json.error, error)
  json.error.message = error.message
  json.error.stack = stack
  res.status(status).json(json);
});

module.exports = router
