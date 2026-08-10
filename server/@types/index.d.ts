import "express-session"

declare module "express-session" {
  interface SessionData {
    user?: import("../Shared/Auth/authMiddlewares.js").SessionUser
  }
}

declare global {
  namespace Express {
    interface Request {
      csrfToken?: () => string
    }
  }
}

export { }


