/* eslint-disable indent */
/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */


import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from '~/config/environment'

let examsystemDatabaseInstance = null

const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
    // serverAPI co tu phien ban MongoDB 5.0.0 tro nen
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
})

export const CONNECT_DB = async () => {
    //Goi kết nối tới MongoDB Atlas với URI đã khai báo trong thân của mongoClientInstance
    await mongoClientInstance.connect()

    //Kết nối thành công thì lấy Database theo tên và gắn ngược nó lại vào biến examsystemDatabaseInstance ở trên của chúng ta
    examsystemDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME)
}

//Đóng kết nối tới Database khi cần
export const CLOSE_DB = async () => {
    console.log('close')
    await mongoClientInstance.close()
}
export const GET_DB = () => {
    if (!examsystemDatabaseInstance) throw new Error ('Must connect  to Database first')
    return examsystemDatabaseInstance
}



