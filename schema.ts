// Welcome to your schema
//   Schema driven development is Keystone's modus operandi
//
// This file is where we define the lists, fields and hooks for our data.
// If you want to learn more about how lists are configured, please read
// - https://keystonejs.com/docs/config/lists

import { list, group } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';

// see https://keystonejs.com/docs/fields/overview for the full list of fields
//   this is a few common fields for an example
import {
  text,
  relationship,
  password,
  timestamp,
  decimal,
} from '@keystone-6/core/fields';

// the document field is a more complicated field, so it has it's own package
import { document } from '@keystone-6/fields-document';
// if you want to make your own fields, see https://keystonejs.com/docs/guides/custom-fields

// when using Typescript, you can refine your types to a stricter subset by importing
// the generated types from '.keystone/types'
import type { Lists } from '.keystone/types';

const earningsGroup = group({
  label: 'Earnings',
  description: 'Breakdown of Earnings from Dash',
  fields: {
    earningFromBasePay: decimal({
      validation: {
        isRequired: true,
      },
      label: 'Base Pay',
      precision: 5,
      scale: 2,
    }),
    earningsFromAppTips: decimal({
      validation: {
        isRequired: true,
      },
      label: 'Tips from App',
      precision: 5,
      scale: 2,
    }),
    earningsFromCashTips: decimal({
      defaultValue: '0',
      label: 'Cash Tips',
      precision: 5,
      scale: 2,
    }),
  },
});

export const lists: Lists = {
  User: list({
    // WARNING
    //   for this starter project, anyone can create, query, update and delete anything
    //   if you want to prevent random people on the internet from accessing your data,
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      email: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
      }),
      password: password({ validation: { isRequired: true } }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
  }),

  Dash: list({
    access: allowAll,
    fields: {
      startTime: timestamp({
        validation: { isRequired: true },
        graphql: { 
          isNonNull: {
            read: true,
            create: true,
          },
        },
      }),
      endTime: timestamp({
        validation: { isRequired: true },
        graphql: {
          isNonNull: {
            read: true,
            create: true,
          },
        },
      }),
      zone: relationship({
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
      }),
      earningsTotal: decimal({
        label: 'Total Earnings',
        precision: 5,
        scale: 2,
        ui: {
          createView: { fieldMode: 'hidden' },
          itemView: { 
            fieldPosition: 'sidebar',
            fieldMode: 'read'
          }
        },
      }),
      earningsFromApp: decimal({
        label: 'Total Earnings',
        precision: 5,
        scale: 2,
        ui: {
          createView: { fieldMode: 'hidden' },
          itemView: { 
            fieldPosition: 'sidebar',
            fieldMode: 'read'
          }
        },
      }),
      ...earningsGroup,
    }
  }),

  Zone: list({
    access: allowAll,
    ui: { isHidden: true },
    fields: {
      name: text(),
      dashes: relationship({ ref: 'Dash.zone', many: true }),
    }
  }),
};
