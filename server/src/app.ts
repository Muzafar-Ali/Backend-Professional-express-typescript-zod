import express from 'express';
import config from 'config';
import log from './utils/logger';
import routes from './routes';
import deserializeUser from './middleware/deserializeUser';
import { connectDB } from './utils/helper';

const app = express();
const port = config.get<string>('port');

app.use(express.json());
app.use(deserializeUser);

app.listen(port, () => {
  log.info(`App listening on port ${port}`);
  connectDB();
  routes(app);
});