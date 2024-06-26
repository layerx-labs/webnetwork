import {NextApiHandler} from "next";

import {LogAccess} from "middleware/log-access";
import {NetworkRoute} from "middleware/network-route";
import {withAdmin} from "middleware/with-admin";
import {withGovernor} from "middleware/with-governor";
import {withIssue} from "middleware/with-issue";
import {withSignature} from "middleware/with-signature";
import {withUser} from "middleware/with-user";
import {WithValidChainId} from "middleware/with-valid-chain-id";
import withCors from "middleware/withCors";
import {withJWT} from "middleware/withJwt";

const withCORS = (handler: NextApiHandler, requestSize?: number) => LogAccess(withCors(handler));
const withProtected = (handler: NextApiHandler, requestSize?: number, allowedMethods?: string[]) => 
  withCORS(withJWT(withSignature(handler), allowedMethods), requestSize);
const RouteMiddleware = (handler: NextApiHandler) => withCORS(withJWT(handler));
const AdminRoute = (handler: NextApiHandler, allowedMethods = []) => 
  withProtected(withAdmin(handler, allowedMethods), undefined, allowedMethods);
const IssueRoute = (handler: NextApiHandler) => withProtected(withIssue(handler));
const UserRoute = 
  (handler: NextApiHandler, allowedMethods = ["GET"]) => withProtected(withUser(handler, allowedMethods));
const GovernorRoute = (handler: NextApiHandler) => withProtected(WithValidChainId(withGovernor(handler)));

export {
  withCORS,
  withJWT,
  withProtected,
  RouteMiddleware,
  AdminRoute,
  IssueRoute,
  withGovernor,
  UserRoute,
  WithValidChainId,
  NetworkRoute,
  GovernorRoute
};