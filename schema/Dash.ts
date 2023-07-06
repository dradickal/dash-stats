import { list, group } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';

import {
  relationship,
  timestamp,
  decimal,
} from '@keystone-6/core/fields';

const zone = relationship({
  ref: 'Zone.dashes',
  many: false,
  ui: {
    displayMode: 'cards',
    cardFields: ['name'],
    inlineEdit: { fields: ['name'] },
    linkToItem: true,
    inlineConnect: true,
    inlineCreate: { fields: ['name'] },
  },
});

const startTime = timestamp({
  validation: { isRequired: true },
  graphql: {
    isNonNull: {
      read: true,
      create: true,
    },
  },
});

const endTime = timestamp({
  validation: { isRequired: true },
  graphql: {
    isNonNull: {
      read: true,
      create: true,
    },
  },
});

const dashTime = decimal({
  validation: { isRequired: true },
  precision: 4,
  scale: 2,
  label: "Dash Time (1.5 = 1h 30m)",
  graphql: {
    isNonNull: {
      read: true,
      create: true,
    },
  },
});

const activeTime = decimal({
  validation: { isRequired: true },
  precision: 4,
  scale: 2,
  label: "Active Time (1.5 = 1h 30m)",
  graphql: {
    isNonNull: {
      read: true,
      create: true,
    },
  },
});

const driveTime = decimal({
  validation: { isRequired: false },
  precision: 4,
  scale: 2,
  label: "Drive Time (1.5 = 1h 30m)"
});

const earningsTotal = decimal({
  label: 'Total Earnings',
  precision: 6,
  scale: 2,
  ui: {
    createView: { fieldMode: 'hidden' },
    itemView: {
      fieldPosition: 'sidebar',
      fieldMode: 'read'
    }
  },
});

const earningsTotalFromApp = decimal({
  label: 'Total App Earnings',
  precision: 6,
  scale: 2,
  ui: {
    createView: { fieldMode: 'hidden' },
    itemView: {
      fieldPosition: 'sidebar',
      fieldMode: 'read'
    }
  },
})

const earningsGroup = group({
  label: 'Earnings',
  description: 'Breakdown of Earnings from Dash',
  fields: {
    earningFromBasePay: decimal({
      validation: { isRequired: true },
      label: 'Base Pay',
      precision: 6,
      scale: 2,
    }),
    earningsFromAppTips: decimal({
      validation: { isRequired: true },
      label: 'Tips from App',
      precision: 6,
      scale: 2,
    }),
    earningsFromCashTips: decimal({
      defaultValue: '0',
      label: 'Cash Tips',
      precision: 6,
      scale: 2,
    }),
  },
});

export const Dash = list({
  access: allowAll,
  hooks: {
    resolveInput: async ({
      listKey,
      operation,
      inputData,
      item,
      resolvedData,
      context,
    }) => {
      const { earningFromBasePay, earningsFromAppTips, earningsFromCashTips } = resolvedData;
      
      return {
        ...resolvedData,
        earningsTotal: parseFloat(earningFromBasePay || item?.earningFromBasePay) + parseFloat(earningsFromAppTips || item?.earningsFromAppTips) + parseFloat(earningsFromCashTips || item?.earningsFromCashTips),
        earningsTotalFromApp: parseFloat(earningFromBasePay || item?.earningFromBasePay) + parseFloat(earningsFromAppTips || item?.earningsFromAppTips),
      }
    },
    validateInput: async ({
      listKey,
      operation,
      inputData,
      item,
      resolvedData,
      context,
      addValidationError,
    }) => {
      const { startTime, endTime } = resolvedData;

      if (endTime <= startTime ) {
        addValidationError('The Dash End Time must be later than the Start Time.');
      }

      return;
    },
  },
  fields: {
    startTime,
    endTime,
    zone,
    dashTime,
    activeTime,
    driveTime,
    earningsTotal,
    earningsTotalFromApp,
    ...earningsGroup,
  },
});
