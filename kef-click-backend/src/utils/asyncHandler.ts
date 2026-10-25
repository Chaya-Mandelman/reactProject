import type { NextFunction, Request, RequestHandler, Response } from 'express';

/** עוטף פונקציה אסינכרונית כך ששגיאות יגיעו ל-errorHandler של Express */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}
