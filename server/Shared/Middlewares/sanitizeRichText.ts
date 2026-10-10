import sanitizeHtml from 'sanitize-html'
import type {Request, Response, NextFunction } from 'express'

export const sanitizeRichText = (fieldNames = ['text']) => {
  return (req:Request, res: Response, next: NextFunction) => {
    fieldNames.forEach((field) => {
      if (req.body && typeof req.body[field] === 'string') {
        req.body[field] = sanitizeHtml(req.body[field], {
          allowedTags: ['p', 'br', 'b', 'i', 'em', 'strong', 'u', 'ul', 'ol', 'li', 'a', 'span'],
          allowedAttributes: {
            'a': ['href', 'target']
          },
          allowedSchemes: ['http', 'https', 'mailto']
        });
      }
    });
    next();
  };
};

// Uso en la ruta:
//router.post('/admin/about', sanitizeRichTextMiddleware(['text']), aboutController.create);
