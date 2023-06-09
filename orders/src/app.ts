import express from 'express'
import { json } from 'body-parser'
import 'express-async-errors'
import cookieSession from 'cookie-session'
import {
    NotFoundError,
    errorHandler,
    currentUser,
} from '@ordamaritickets/common'
import { deleteOrderRouter } from './routes/delete.route'
import { newOrderRouter } from './routes/new.route'
import { indexOrderRouter } from './routes/index.route'
import { showOrderRouter } from './routes/show.route'

const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test',
    })
)
app.use(currentUser)

app.use(deleteOrderRouter)
app.use(newOrderRouter)
app.use(indexOrderRouter)
app.use(showOrderRouter)

app.all('*', () => {
    throw new NotFoundError()
})
app.use(errorHandler)

export { app }
