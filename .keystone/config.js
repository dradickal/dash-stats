"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// keystone.ts
var keystone_exports = {};
__export(keystone_exports, {
  default: () => keystone_default
});
module.exports = __toCommonJS(keystone_exports);
var import_core4 = require("@keystone-6/core");

// schema/Dash.ts
var import_core = require("@keystone-6/core");
var import_access = require("@keystone-6/core/access");
var import_fields = require("@keystone-6/core/fields");
var zone = (0, import_fields.relationship)({
  ref: "Zone.dashes",
  many: false,
  ui: {
    displayMode: "cards",
    cardFields: ["name"],
    inlineEdit: { fields: ["name"] },
    linkToItem: true,
    inlineConnect: true,
    inlineCreate: { fields: ["name"] }
  }
});
var startTime = (0, import_fields.timestamp)({
  validation: { isRequired: true },
  graphql: {
    isNonNull: {
      read: true,
      create: true
    }
  }
});
var endTime = (0, import_fields.timestamp)({
  validation: { isRequired: true },
  graphql: {
    isNonNull: {
      read: true,
      create: true
    }
  }
});
var earningsTotal = (0, import_fields.decimal)({
  label: "Total Earnings",
  precision: 6,
  scale: 2,
  ui: {
    createView: { fieldMode: "hidden" },
    itemView: {
      fieldPosition: "sidebar",
      fieldMode: "read"
    }
  }
});
var earningsTotalFromApp = (0, import_fields.decimal)({
  label: "Total App Earnings",
  precision: 6,
  scale: 2,
  ui: {
    createView: { fieldMode: "hidden" },
    itemView: {
      fieldPosition: "sidebar",
      fieldMode: "read"
    }
  }
});
var earningsGroup = (0, import_core.group)({
  label: "Earnings",
  description: "Breakdown of Earnings from Dash",
  fields: {
    earningFromBasePay: (0, import_fields.decimal)({
      validation: { isRequired: true },
      label: "Base Pay",
      precision: 6,
      scale: 2
    }),
    earningsFromAppTips: (0, import_fields.decimal)({
      validation: { isRequired: true },
      label: "Tips from App",
      precision: 6,
      scale: 2
    }),
    earningsFromCashTips: (0, import_fields.decimal)({
      defaultValue: "0",
      label: "Cash Tips",
      precision: 6,
      scale: 2
    })
  }
});
var Dash = (0, import_core.list)({
  access: import_access.allowAll,
  hooks: {
    resolveInput: async ({
      listKey,
      operation,
      inputData,
      item,
      resolvedData,
      context
    }) => {
      const { earningFromBasePay, earningsFromAppTips, earningsFromCashTips } = resolvedData;
      return {
        ...resolvedData,
        earningsTotal: parseFloat(earningFromBasePay || item.earningFromBasePay) + parseFloat(earningsFromAppTips || item.earningsFromAppTips) + parseFloat(earningsFromCashTips || item.earningsFromCashTips),
        earningsTotalFromApp: parseFloat(earningFromBasePay || item.earningFromBasePay) + parseFloat(earningsFromAppTips || item.earningsFromAppTips)
      };
    }
  },
  fields: {
    startTime,
    endTime,
    zone,
    earningsTotal,
    earningsTotalFromApp,
    ...earningsGroup
  }
});

// schema/User.ts
var import_core2 = require("@keystone-6/core");
var import_access2 = require("@keystone-6/core/access");
var import_fields2 = require("@keystone-6/core/fields");
var User = (0, import_core2.list)({
  access: import_access2.allowAll,
  fields: {
    name: (0, import_fields2.text)({ validation: { isRequired: true } }),
    email: (0, import_fields2.text)({
      validation: { isRequired: true },
      isIndexed: "unique"
    }),
    password: (0, import_fields2.password)({ validation: { isRequired: true } }),
    createdAt: (0, import_fields2.timestamp)({
      defaultValue: { kind: "now" }
    })
  }
});

// schema/Zone.ts
var import_core3 = require("@keystone-6/core");
var import_access3 = require("@keystone-6/core/access");
var import_fields3 = require("@keystone-6/core/fields");
var Zone = (0, import_core3.list)({
  access: import_access3.allowAll,
  ui: { isHidden: true },
  fields: {
    name: (0, import_fields3.text)(),
    dashes: (0, import_fields3.relationship)({ ref: "Dash.zone", many: true })
  }
});

// schema.ts
var lists = {
  User,
  Dash,
  Zone
};

// auth.ts
var import_crypto = require("crypto");
var import_auth = require("@keystone-6/auth");
var import_session = require("@keystone-6/core/session");
var sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret && process.env.NODE_ENV !== "production") {
  sessionSecret = (0, import_crypto.randomBytes)(32).toString("hex");
}
var { withAuth } = (0, import_auth.createAuth)({
  listKey: "User",
  identityField: "email",
  // this is a GraphQL query fragment for fetching what data will be attached to a context.session
  //   this can be helpful for when you are writing your access control functions
  //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
  sessionData: "name createdAt",
  secretField: "password",
  // WARNING: remove initFirstItem functionality in production
  //   see https://keystonejs.com/docs/config/auth#init-first-item for more
  initFirstItem: {
    // if there are no items in the database, by configuring this field
    //   you are asking the Keystone AdminUI to create a new user
    //   providing inputs for these fields
    fields: ["name", "email", "password"]
    // it uses context.sudo() to do this, which bypasses any access control you might have
    //   you shouldn't use this in production
  }
});
var sessionMaxAge = 60 * 60 * 24 * 30;
var session = (0, import_session.statelessSessions)({
  maxAge: sessionMaxAge,
  secret: sessionSecret
});

// logger.ts
var import_pino = require("pino");
var logger_default = (0, import_pino.pino)({});

// keystone.ts
var import_pino_http = __toESM(require("pino-http"));
var keystone_default = withAuth(
  (0, import_core4.config)({
    db: {
      provider: "mysql",
      url: "mysql://dashStatsAdmin:letmein@localhost:3306/dash_stats"
    },
    server: {
      extendExpressApp(app, context) {
        app.use((0, import_pino_http.default)({
          logger: logger_default
        }));
      }
    },
    lists,
    session
  })
);
