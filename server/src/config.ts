import dotENV from 'dotenv';

dotENV.config()

export const configKeys = {
    MONGODB_URL:process.env.MONGODB_URL as string,
    PORT:process.env.PORT as string,
    JWT_SECRET_KEY:process.env.JWT_SECRET_KEY as string,
    CLIENT_URL:process.env.JWT_SECRET_KEY as string,
    SOCKET_SERVER:process.env.SOCKET_SERVER as string
}