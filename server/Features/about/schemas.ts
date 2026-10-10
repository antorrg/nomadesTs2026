import { Schema } from 'req-valid-express'
import envConfig from '../../Configs/envConfig.js';

export const create:Schema = {
  title: {
    tipe: "string",
    sanitize: {
      trim: true,
      escape: true,
    }
  },
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
      trim:true
    },
    default: envConfig.BasePicture
  },
   imgShow: {
    type: "boolean",

  }
};

export const update:Schema = {
  title: {
    title: "string",
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
   imgShow: {
    type: "boolean",

  },
     saver: {
    type: "boolean",
  },
     useImg: {
    type: "boolean",
  }
};

