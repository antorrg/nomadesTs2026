import { Schema } from 'req-valid-express'

export const create:Schema = {
  title: {
    type: "string",
  },
  type: {
    type: "string",
  },
  text: {
    type: "string",

  },
  url: {
    type: "string",

  },
   enabled: {
    type: "boolean"
  }
};
export const update: Schema = {
  title: {
    type: "string",
    sanitize: {
      trim: true,

    }
  },
  type: {
    type: "string",
    sanitize: {
      trim: true,

    }
  },
  text: {
    type: "string",
    sanitize: {
      trim: true,
 
    }
  },
  url: {
    type: "string",
    sanitize: {
      trim: true,
    }
  },
  enabled: {
    type: "boolean"
  }
};
