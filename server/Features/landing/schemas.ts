import { Schema } from 'req-valid-express'

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
  info_header: {
    type: "string",
    sanitize: {
      trim: true,
      escape: true,
    }
  },
   description: {
    type: "string",
    sanitize: {
      trim: true,
      escape: true,
    }
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
  info_header: {
    type: "string",
    sanitize: {
      trim: true,
      escape: true,
    }
  },
   description: {
    type: "string",
    sanitize: {
      trim: true,
      escape: true,
    }
  },
     saver: {
    type: "boolean",
  },
     useImg: {
    type: "boolean",
  }
};

