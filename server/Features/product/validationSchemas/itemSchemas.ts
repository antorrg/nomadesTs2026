import {Schema } from 'req-valid-express'

export const itemCreate:Schema = {
  text: {
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
  ProductId: {
    type: "int"
  },
  useImg: {
    type: "boolean"
  }
};
export const itemUpdate:Schema = {
  text: {
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
  enabled: {
    type: "boolean"
  },
  saver: {
    type: "boolean"
  },
  useImg: {
    type: "boolean"
  }
};
