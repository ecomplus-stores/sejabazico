const { initializeApp } = require('firebase-admin/app')
const { getFirestore, Timestamp } = require('firebase-admin/firestore')
const { onRequest } = require('firebase-functions/v2/https')
const { warn } = require('firebase-functions/logger')

const { ssr } = require('@ecomplus/storefront-renderer/functions/')

process.env.STOREFRONT_LONG_CACHE = 'false'

initializeApp()

exports.ssr2 = onRequest({
  concurrency: 80,
  minInstances: 0,
  memory: '1GiB',
}, async (req, res) => {
  if (req.path.startsWith('/~partytown')) {
    res.sendStatus(404)
    return null
  }
  let cacheRef
  try {
    const db = getFirestore()
    cacheRef = db.doc(`ssrCache/${req.path.slice(1).replace(/\//g, '_')}`)
    const cacheDoc = await cacheRef.get()
    if (cacheDoc.exists) {
      const { headers, status, body, __timestamp } = cacheDoc.data()
      Object.keys(headers).forEach((headerName) => {
        res.set(headerName, headers[headerName])
      })
      const isFresh = (Timestamp.now().toMillis() - __timestamp.toMillis()) < 1000 * 60 * 5
      res.set('x-swr-date', (isFresh ? 'fresh ' : '') + __timestamp.toDate().toISOString())
      res.status(status || 200).send(body)
      if (isFresh) {
        return true
      }
    }
  } catch (err) {
    cacheRef = null
    warn(err)
  }

  const headers = {}
  const _set = res.set
  res.set = function (field, value) {
    headers[field] = value
    if (!res.headersSent) {
      _set.apply(res, arguments)
    }
    return res
  }

  let statusCode
  const _status = res.status
  res.status = function (_statusCode) {
    statusCode = _statusCode
    if (!res.headersSent) {
      _status.apply(res, arguments)
    }
    return res
  }
  const _sendStatus = res.sendStatus
  res.sendStatus = function (_statusCode) {
    statusCode = _statusCode
    if (!res.headersSent) {
      _sendStatus.apply(res, arguments)
    }
    return res
  }

  const _send = res.send
  res.send = function (body) {
    if (!res.headersSent) {
      _send.apply(res, arguments)
    }
    if (!statusCode) {
      statusCode = res.statusCode
    }
    if (cacheRef && statusCode === 200) {
      cacheRef.set({
        headers,
        status: statusCode,
        body,
        __timestamp: Timestamp.now()
      }).catch(warn)
    }
  }
  const _end = res.end
  res.end = function () {
    if (!res.headersSent) {
      _end.apply(res, arguments)
    }
  }
  return ssr(req, res)
})
