import express,{Application} from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet'
import { configKeys } from '../../config';
// @ts-ignore
import proxyProtocol from 'proxy-protocol';

const expressConfig = (app:Application)=>{

    // Enabling CORS
    const enableCors = {
        origin: [configKeys.CLIENT_URL],
        // origin: '*',
        exposeHeaders: ['Cross-Origin-Opener-Policy', 'Cross-Origin-Resource-Policy']
    }

    // Express middlewares configuration
    app.use(cors(enableCors))
    app.use(morgan('dev'))
    app.use(express.json())
    app.use(express.urlencoded({extended:true}))
    app.use(cookieParser())
    app.use(helmet())
    // checking header for ip address of client
    app.use(proxyProtocol());
}
export default expressConfig