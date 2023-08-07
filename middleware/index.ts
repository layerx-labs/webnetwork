import { NextApiHandler } from "next";

import { LogAccess } from "middleware/log-access";
import { withAdmin } from "middleware/with-admin";
import { withSignature } from "middleware/with-signature";
import withCors from "middleware/withCors";
import { withJWT } from "middleware/withJwt";

const withProtected = (handler: NextApiHandler) => LogAccess(withCors(withJWT(withSignature(handler))));
const RouteMiddleware = (handler: NextApiHandler) => LogAccess(withCors(withJWT(handler)));
const AdminRoute = (handler: NextApiHandler) => withProtected(withAdmin(handler));

export {
  withCors,
  withJWT,
  withProtected,
  RouteMiddleware,
  AdminRoute
};