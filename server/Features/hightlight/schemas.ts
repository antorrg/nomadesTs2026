import {type Schema} from 'req-valid-express'

export const create:Schema = {
  title: {
    type: "string",
    sanitize: {
      trim: true,
    }
  },
  picture: {
    type: "string",
    sanitize: {
      trim: true,
    }
  },
  text: {
    type: "string",
    sanitize: {
      trim: true,
    },
  },
};
export const update:Schema = {
  title: {
    type: "string",
    sanitize: {
      trim: true,
    }
  },
  picture: {
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
  showTitle:{
    type: "boolean"
  },
  order: {
    type: 'int',
    default: 0
  },
   enabled: {
    type: "boolean"
  },
   saver: {
    type: "boolean"
  }
};