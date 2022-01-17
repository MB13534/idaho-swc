const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

/**
 * Middleware used to check if the requester has an access token
 * If credentialsRequired is set to true (the default), an error will
 * be returned from the middleware function indicating that the request
 * could not be completed because it was not authorized
 * If credentialsRequired is set to false, the request will not fail
 * if the requester does not have a valid access token
 * This setting is particularly useful for instances where we want to return
 * at least some data for unauthorized users, just not all of it.
 * @see https://github.com/auth0/express-jwt#error-handling
 * @param {string} issuer Value representing the token issuer (auth0_domain)
 * @param {string} audience Value representing the token audience (auth0_audience)
 * @param {boolean?} credentialsRequired Value representing whether the middleware should
 * return an error if a valid token does not exist
 * @returns {function} returns an express middleware function
 */
function checkAccessToken(issuer, audience, credentialsRequired = true) {
  return jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${issuer}/.well-known/jwks.json`,
    }),

    // Validate the audience and the issuer.
    audience: audience,
    issuer: `https://${issuer}/`,
    algorithms: ['RS256'],
    credentialsRequired,
  });
}

/**
 * Express middleware used to check if the requester has the appropriate
 * permissions
 * The function expects an array of permissions that the requester should have
 * If they do not have all the required permissions, we throw an authorization error
 * @param {string[]} providedPermissions Array of required permissions (i.e. ['read:users'])
 */
function checkPermission(providedPermissions) {
  return (req, res, next) => {
    const {permissions} = req.user;
    const permissionsArray = providedPermissions.map((permission) => {
      return permissions.includes(permission);
    });
    if (!permissionsArray.includes(false)) return next();
    res.status(403).send();
  };
}

function checkRoles(user, providedRoles) {
  if (!user || !providedRoles) return false;
  const userRoles = user[`${process.env.AUTH0_AUDIENCE}/roles`];
  const rolesArray = providedRoles.map((providedRole) => {
    return userRoles.includes(providedRole);
  });
  return rolesArray.includes(true);
}

module.exports = {
  checkAccessToken,
  checkPermission,
  checkRoles,
};
