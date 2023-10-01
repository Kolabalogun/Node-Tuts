const jwt = require("jsonwebtoken");

const User = require("../model/User");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;

  console.log(cookies);

  if (!cookies?.jwt) return res.sendStatus(401); // Unauthorized

  console.log(cookies.jwt);

  const refreshToken = cookies.jwt;

  //   is refresh token  in db ?
  const userIsPresent = await User.findOne({ refreshToken }).exec();

  if (!userIsPresent) return res.sendStatus(403); // Forbidden

  // Evaluate JWT

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || userIsPresent.username !== decoded.username)
      return res.sendStatus(403); // Forbidden

    const roles = Object.values(userIsPresent.roles);
    const accessToken = jwt.sign(
      {
        userInfo: {
          username: decoded.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "300s" }
    );

    res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };

// const jwt = require("jsonwebtoken");

// const usersDB = {
//   users: require("../model/users.json"),
//   setUsers: function (data) {
//     this.users = data;
//   },
// };

// const handleRefreshToken = (req, res) => {
//   const cookies = req.cookies;

//   if (!cookies?.jwt) return res.sendStatus(401); // Unauthorized

// //   console.log(cookies.jwt);

//   const refreshToken = cookies.jwt;

//   //   is refresh token  in db ?
//   const userIsPresent = usersDB.users.find(
//     (user) => user.refreshToken === refreshToken
//   );

//   if (!userIsPresent) return res.sendStatus(403); // Forbidden

//   // Evaluate JWT

//   jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
//     if (err || userIsPresent.username !== decoded.username)
//       return res.sendStatus(403); // Forbidden

//     const roles = Object.values(userIsPresent.roles);
//     const accessToken = jwt.sign(
//       {
//         userInfo: {
//           username: decoded.username,
//           roles: roles,
//         },
//       },
//       process.env.ACCESS_TOKEN_SECRET,
//       { expiresIn: "300s" }
//     );

//     res.json({ accessToken });
//   });
// };

// module.exports = { handleRefreshToken };
