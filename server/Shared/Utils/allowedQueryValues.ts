import { type Request, type Response, type NextFunction } from 'express'
import { middError } from '../../Configs/errorHandlers.js'

export const allowedQueryValues = (
  rules: Record<string, string[]>
) => {
  const compiledRules: Record<string, Set<string>> = {};
  for (const field in rules) {
    compiledRules[field] = new Set(rules[field]);
  }

  return (req:Request, res: Response, next: NextFunction) => {
    const query = req.context?.query ?? {};

    for (const field in compiledRules) {
      const allowed = compiledRules[field];
      const value = query[field];

      if (value !== undefined && !allowed.has(String(value))) {
        return next(middError(`Invalid value for '${field}'`, 400));
      }
    }

    next();
  };
};
/* Uso:
router.get('/items',
  allowedQueryValues({
    sort: ['asc', 'desc'],
    search: ['title', 'name', 'category']
  }),
  controller.getAll
);
*/
