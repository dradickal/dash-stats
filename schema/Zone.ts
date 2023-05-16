import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';

import {
  text,
  relationship,
} from '@keystone-6/core/fields';

export const Zone = list({
  access: allowAll,
  ui: { isHidden: true },
  fields: {
    name: text(),
    dashes: relationship({ ref: 'Dash.zone', many: true }),
  }
});
