import type { Schema } from 'req-valid-express'

export const update: Schema = {
  email: {
    type: 'string',
    sanitize: {
      trim: true
    }
  },

  nickname: {
    type: 'string',
    sanitize: {
      trim: true
    }
  },
  name: {
    type: 'string',
    sanitize: {
      trim: true
    }
  },
  picture: {
    type: 'string',
    sanitize: {
      trim: true
    }
  },

}
export const changePassword: Schema= {
    password: {
    type: 'string',
    sanitize: {
      trim: true
    }
  },
    newPassword: {
    type: 'string',
    sanitize: {
      trim: true
    }
  },
}
export const upgrade: Schema = {
   role: {
    type: 'string',
    sanitize: {
      trim: true,
      uppercase: true
    }
   },
}
export const banner: Schema = {
    enabled: {
    type: 'boolean',
    default: true
  }
}

export const create: Schema = {
  email: {
    type: 'string',
    sanitize: {
      trim: true
    }
  },
  password: {
    type: 'string',
    sanitize: {
      trim: true
    }
  }
}
