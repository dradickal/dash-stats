import { config } from '@keystone-6/core';
import { lists } from './schema';
import { withAuth, session } from './auth';
import logger from './logger';
import PinoHttp from 'pino-http';

export default withAuth(
  config({
    db: {
      provider: 'mysql',
      url: 'mysql://dashStatsAdmin:letmein@localhost:3306/dash_stats',
    },
    server: {
      extendExpressApp(app, context) {
        app.use(PinoHttp({
          logger,
        }));
      },
    },
    lists,
    session,
  })
);
