import { Schema } from 'req-valid-express'
import envConfig from '../../Configs/envConfig.js';

export const create:Schema = {
  title: {
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
  picture: {
    type: "string",
    sanitize: {
      trim:true
    },
    default: envConfig.BasePicture
  },
   imgShow: {
    type: "boolean",

  },
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
      trim: true
    }
  },
   imgShow: {
    type: "boolean",

  },
     saver: {
    type: "boolean",
  }
};

