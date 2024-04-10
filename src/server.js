/* eslint-disable no-trailing-spaces */
/* eslint-disable no-console */

import exitHook from 'async-exit-hook'
import cors from 'cors'
import express from 'express'
import { env } from '~/config/environment'
import { CLOSE_DB, CONNECT_DB } from '~/config/mongodb'
import { APIs_V1 } from '~/routes/v1'
import { corsOptions } from './config/cors'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'


const START_SERVER = () => {
  const app = express()
  
  app.use(cors(corsOptions))

  app.use(express.urlencoded({extended: true}))
  //Enable req.body json data
  app.use(express.json())

  //Use APIs V1
  app.use('/v1', APIs_V1)

  // Middleware xử lý lỗi tập trung
  app.use(errorHandlingMiddleware)

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`3. Hello ${env.AUTHOR}, Back-end Server is running successfully at Host http://${env.APP_HOST}:${env.APP_PORT}/`);
  })
  
  //Thực hiện các tác vụ cleanup trước khi dừng server
  exitHook(() => {
    console.log('4. Server is shutting down... ')
    CLOSE_DB()
    console.log('5. Disconnected from MongoDB Cloud Atlas')
  })
}

(async () => {
  try {
    console.log('1. Connecting to MongoDB Cloud Atlas...')
    await CONNECT_DB()
    console.log('2. Connected to MongoDB Cloud Atlas!')

    //Khởi động Server Backend sau khi Connect Database thành công
    START_SERVER()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})()
