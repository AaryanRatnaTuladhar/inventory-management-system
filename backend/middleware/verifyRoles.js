const jwt = require('jsonwebtoken');

const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {

    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res
      .sendStatus(401)
      .json({ 
        message: "Bearer missing in authorization header." 
      }); // Unauthorized
    }

    const token = authHeader.split(" ")[1];

    // Verify and decode the JWT token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.sendStatus(401); // Unauthorized
      }

      
      const roles = [...allowedRoles];
      // Check if roles are present in the decoded token
      // const roles = Object.keys(decoded?.roles || {});

      // Check if roles are not present or not an array
      if (!roles || !Array.isArray(roles)) {
        return res.sendStatus(401); // Unauthorized
      }
      
      // Check if roles match the allowed roles
      const result = roles.some(role => allowedRoles.includes(role));

      // If no matching roles are found, send a 403 status (Forbidden)
      if (!result) {
        return res.sendStatus(403); // Forbidden
      }
 
      // If roles are valid, proceed to the next middleware
      next();
    });
    // const roles = req.headers['roles'] || req.headers['x-roles'];

    // if (!req?.roles) return res.sendStatus(401);
    // const rolesArray = [...allowedRoles];
    // console.log(rolesArray);
    // console.log(req.roles);
    // const result = req.roles
    //   .map((role) => rolesArray.includes(role))
    //   .find((val) => val == true);
    // console.log("result", result);
    // if (!result) return res.sendStatus(403); //Forbidden
    // next();
  };
};

module.exports = verifyRoles;
