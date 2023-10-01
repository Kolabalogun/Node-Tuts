const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const User = require("../model/User");

const handleLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: "Invalid username or password" });

  const userIsPresent = await User.findOne({ username }).exec();

  if (!userIsPresent) return res.sendStatus(401); // Unauthorized

  // Evaluate Password

  const match = await bcrypt.compare(password, userIsPresent.password);

  if (match) {
    const roles = Object.values(userIsPresent.roles);

    // create JWTs

    const accessToken = jwt.sign(
      {
        userInfo: {
          username: userIsPresent.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "300s" }
    );

    const refreshToken = jwt.sign(
      { username: userIsPresent.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // Saving refresh token with current user

    userIsPresent.refreshToken = refreshToken;

    const result = await userIsPresent.save();

    console.log(result);

    // res.json({ success: "User is logged in successfully" });
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      //   secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } else {
    res.sendStatus(401); // Unauthorized
  }
};

module.exports = { handleLogin };

// const bcrypt = require("bcrypt");

// const jwt = require("jsonwebtoken");
// const path = require("path");

// const fsPromise = require("fs").promises;

// const usersDB = {
//   users: require("../model/users.json"),
//   setUsers: function (data) {
//     this.users = data;
//   },
// };

// const handleLogin = async (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password)
//     return res.status(400).json({ message: "Invalid username or password" });

//   const userIsPresent = usersDB.users.find(
//     (user) => user.username === username
//   );

//   if (!userIsPresent) return res.sendStatus(401); // Unauthorized

//   // Evaluate Password

//   const match = await bcrypt.compare(password, userIsPresent.password);

//   if (match) {
//     const roles = Object.values(userIsPresent.roles);

//     // create JWTs

//     const accessToken = jwt.sign(
//       {
//         userInfo: {
//           username: userIsPresent.username,
//           roles: roles,
//         },
//       },
//       process.env.ACCESS_TOKEN_SECRET,
//       { expiresIn: "300s" }
//     );

//     const refreshToken = jwt.sign(
//       { username: userIsPresent.username },
//       process.env.REFRESH_TOKEN_SECRET,
//       { expiresIn: "1d" }
//     );

//     // Saving refresh token with current user

//     const otherUsers = usersDB.users.filter(
//       (user) => user.username !== userIsPresent.username
//     );

//     const currentUser = { ...userIsPresent, refreshToken };

//     usersDB.setUsers([...otherUsers, currentUser]);

//     await fsPromise.writeFile(
//       path.join(__dirname, "..", "model", "users.json"),
//       JSON.stringify(usersDB.users)
//     );

//     // res.json({ success: "User is logged in successfully" });
//     res.cookie("jwt", refreshToken, {
//       httpOnly: true,
//       sameSite: "None",
//       secure: true,
//       maxAge: 24 * 60 * 60 * 1000,
//     });
//     res.json({ accessToken });
//   } else {
//     res.sendStatus(401); // Unauthorized
//   }
// };

// module.exports = { handleLogin };
