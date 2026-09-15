import firebaseAdmin from "../config/firebaseAdmin.js";
import { getAuth } from "firebase-admin/auth";
import User from "../models/user.js";

const verifyFirebaseToken = async (idToken) => {
  const decodedToken = await getAuth(firebaseAdmin).verifyIdToken(idToken);

  return decodedToken;
};

const findOrCreateGoogleUser = async (decodedToken) => {
  const {
    uid,
    email,
    name,
    picture
  } = decodedToken;

  if (!email) {
    throw new Error("Google account email is required");
  }

  if (!decodedToken.email_verified) {
    throw new Error("Google account email must be verified");
  }

  let user = await User.findOne({
    googleId: uid
  });

  if (user) {
    return user;
  }

  // Check whether this email already exists
  user = await User.findOne({
    email: email.toLowerCase()
  });

  if (user) {
    user.googleId = uid;
    user.authProvider = "google";
    user.avatar = picture || user.avatar;

    await user.save();

    return user;
  }

  // Create new Google user
  user = await User.create({
    fullname: name || "Google User",
    email: email.toLowerCase(),
    googleId: uid,
    authProvider: "google",
    avatar: picture || ""
  });

  return user;
};

const findOrCreateGithubUser = async (decodedToken) => {
  const {
    uid,
    email,
    name,
    picture
  } = decodedToken;

  if (!email) {
    throw new Error("GitHub account email is required");
  }

  let user = await User.findOne({
    githubId: uid
  });

  if (user) {
    return user;
  }

  user = await User.findOne({
    email: email.toLowerCase()
  });

  if (user) {
    user.githubId = uid;
    user.authProvider = "GITHUB";
    user.avatar = picture || user.avatar;

    await user.save();

    return user;
  }

  user = await User.create({
    fullname: name || "GitHub User",
    email: email.toLowerCase(),
    githubId: uid,
    authProvider: "github",
    avatar: picture || ""
  });

  return user;
};

export {
  verifyFirebaseToken,
  findOrCreateGoogleUser,
  findOrCreateGithubUser
};
