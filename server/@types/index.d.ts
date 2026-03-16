import "express-session"

declare module "express-session" {
  interface SessionData {
    user?: import("../Shared/Auth/authMiddlewares.js").SessionUser
  }
}

export { }

