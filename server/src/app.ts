import express from 'express';
import config from 'config';
import log from './utils/logger';
import routes from './routes';
import deserializeUser from './middleware/deserializeUser';
import { connectDB } from './utils/helper';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const port = config.get<string>('port');
const app = express();

app.use(cors({
  origin: config.get('origin'),
  credentials: true
}))
app.use(cookieParser());
app.use(express.json());
app.use(deserializeUser);

app.listen(port, () => {
  log.info(`App listening on port ${port}`);
  connectDB();
  routes(app);
});

