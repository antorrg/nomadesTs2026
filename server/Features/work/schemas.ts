import {type Schema} from 'req-valid-express'

export const create:Schema = {
  title: {
    type: "string",
    sanitize: {
      trim: true,
      escape: true,
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
      escape: true,
    }
  },
  useImg: {
    type: "boolean"
  }
};
export const update:Schema = {
  title: {
    type: "string",
    sanitize: {
      trim: true,
      escape: true,
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
      escape: true,
    }
  },
  useImg: {
    type: "boolean"
  },
   enabled: {
    type: "boolean"
  },
   saver: {
    type: "boolean"
  }
};