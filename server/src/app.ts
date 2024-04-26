import express, { Request, Response } from 'express';
import config from 'config';
import log from './utils/logger';
import routes from './routes';
import deserializeUser from './middleware/deserializeUser';
import { connectDB } from './utils/helper';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { restResponseTimeHistogram, startMetricsServer } from './utils/metrics';
import responseTime from 'response-time';

const port = config.get<string>('port');
const app = express();

app.use(cors({
  origin: config.get('origin'),
  credentials: true
}))
app.use(cookieParser());
app.use(express.json());
app.use(deserializeUser);

app.use(responseTime((req: Request, res: Response, time: number) => {
  if(req?.route?.path){
    restResponseTimeHistogram.observe({
        method: req.method,
        route: req.route.path,
        status_code: res.statusCode
      },
      time * 1000
    );
  }
}))

app.listen(port, () => {
  log.info(`App listening on port ${port}`);
  connectDB();
  routes(app);
  startMetricsServer();
});

