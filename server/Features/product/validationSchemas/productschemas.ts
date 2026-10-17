import { Schema } from 'req-valid-express'

export const create: Schema = {
  title: {
    type: "string",
    sanitize: {
      trim: true,
      escape: true
    }
  },
  picture: {
    type: "string",
    sanitize: {
      trim: true
    }
  },
  info_header: {
    type: "string",
    sanitize: {
      trim: true,
      escape: true
    }
  },
  info_body: {
    type: "string",
    sanitize: {
      trim: true,
      escape: true
    }
  },
  items: [{
    picture: { type: "string" },
    text: { type: "string" }
  }]
};

export const update: Schema = {
  title: {
    type: "string",
    sanitize: {
      trim: true,
      escape: true
    }
  },
  picture: {
    type: "string",
    sanitize: {
      trim: true
    }
  },
  info_header: {
    type: "string",
    sanitize: {
      trim: true,
      escape: true
    }
  },
  info_body: {
    type: "string",
    sanitize: {
      trim: true,
      escape: true
    }
  },
  enabled: {
    type: "boolean",
  },
  saver: {
    type: "boolean"
  }
};
