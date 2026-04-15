// src/utils/asyncHandler.ts   ← or middleware/asyncHandler.ts — create this file

import type { Request, Response, NextFunction, RequestHandler } from 'express';
import type { ParamsDictionary } from 'express-serve-static-core';
import type { ParsedQs } from 'qs';

export function asyncHandler<
  Req extends Request = Request,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs,
  Locals extends Record<string, any> = Record<string, any>
>(
  handler: (
    req: Req,
    res: Response<ResBody, Locals>,
    next: NextFunction
  ) => Promise<void> | void
): RequestHandler<
  Req extends Request<infer P, any, any, any, any> ? P : ParamsDictionary,
  ResBody,
  ReqBody,
  ReqQuery,
  Locals
> {
  return (req, res, next) => {
    const result = handler(req as unknown as Req, res, next);
    Promise.resolve(result).catch(next);
  };
}