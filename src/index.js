// @flow

import express from 'express'
import fileUploadMiddleware from './utils/fileUploadMiddleware'
import authentication from './routes/authentication'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import expressSession from 'express-session'
import compression from 'compression'
import config from 'config'
import routes from './routes'
import {graphiqlExpress } from 'apollo-server-express'
import {graphqlExpressMiddleware, createGraphqlSubscriptionsServer} from './data/graphql'
import {devMiddleware, hotMiddleware} from './routes/webpack.js'
import loginRoute from './routes/login'

const app = express()
const PORT = config.port || 9031

app.use(compression())
app.use(cookieParser())
// app.use(bodyParser.json({ type: 'application/*+json' }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(expressSession({ secret: 'admin', resave: true, saveUninitialized: true }))

if (config.NODE_ENV==='development'){
  app.use(devMiddleware())
  app.use(hotMiddleware())
}

app.use(authentication.initialize())
app.use(authentication.addUserToRequest)

app.use('/graphql',
  bodyParser.json(),
  fileUploadMiddleware({
    uploadDir: '../client/static/images',
    keepExtensions: true,
    maxFieldsSize: 5 * 1024 * 1024, // 5MB
  }),
  graphqlExpressMiddleware
)

if (config.NODE_ENV==='development'){
  app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
    subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`,
  }))
}
routes.apiRoutes.then(apiRoutes=>{
  app.use('/login', loginRoute)

  apiRoutes.forEach((route)=>{
    app.use('/api', route)
  })
  app.use('/', routes.staticRoutes)

})

const wrappedServer = createGraphqlSubscriptionsServer(app, PORT)

wrappedServer.listen(PORT, () =>
  console.log(
    `Websocket Server is now running on http://localhost:${PORT}`,
    `Pokerface server listening on port ${PORT}`
  )
)
