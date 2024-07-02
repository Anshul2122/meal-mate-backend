import { auth } from "express-oauth2-jwt-bearer";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user"
//adding custom properties to the request object 
declare global { 
  namespace Express {
    interface Request {
      auth0Id: string;
      userId: string;
    }
  }
}

export const jwtCheck = auth({
    //this fucntion checks the authorization header for the bearer token
  // and check for the token for the logged in user,
  //basically assign the token when user logged in, 
  //and allowes user to logged in, after refreshing the page.
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: 'RS256'
});

export const jwtParse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) { 
    return res.sendStatus(401);
  }
  const token = authorization.split(" ")[1];
  // decoding of bearer token in json and payload holds the decoded value token
  //payload hold information such as user details, permissions, etc.
  try {
    const decoded = jwt.decode(token) as jwt.JwtPayload;
    const auth0Id = decoded.sub;

    const user = await User.findOne({ auth0Id });
    if (!user) {
      return res.sendStatus(401);
    }
    //getting the custom properties from the request object
    req.auth0Id = auth0Id as string;
    req.userId = user._id!.toString();
    next();

  } catch (error) {
    console.log(error);
    return res.sendStatus(401);
  }
};