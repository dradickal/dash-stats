import { config } from '@keystone-6/core';
import { lists } from './schema';
import { withAuth, session } from './auth';

export default withAuth(
  config({
    db: {
      provider: 'mysql',
      url: 'mysql://dashStatsAdmin:letmein@localhost:3306/dash_stats',
    },
    lists,
    session,
  })
);
