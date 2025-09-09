const cookieOptions = {
  httpOnly: true, // JS can't access cookies
  secure: process.env.NODE_ENV === "production", // only HTTPS in prod
  sameSite: "strict", // protect CSRF
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

module.exports = cookieOptions;
