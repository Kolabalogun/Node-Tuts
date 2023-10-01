const User = require("../model/User");

const handleLogout = async (req, res) => {
  // on client, also delete the access token

  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(204); // Successfully - No content

  const refreshToken = cookies.jwt;

  //   is refresh token  in db ?
  const userIsPresent = await User.findOne({ refreshToken }).exec();

  if (!userIsPresent) {
    res.clearCookie("jwt-token", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      //   secure: true,
    });
    return res.sendStatus(204); // Successfully - No content
  }

  // Delete refresh token in db

  userIsPresent.refreshToken = "";

  const result = await userIsPresent.save();

  console.log(result, "fdfd");

  res.clearCookie("jwt-token", refreshToken, {
    httpOnly: true,
    sameSite: "None",
    // secure: true,
  });
  res.sendStatus(204);
};

module.exports = { handleLogout };

// const path = require("path");

// const usersDB = {
//   users: require("../model/users.json"),
//   setUsers: function (data) {
//     this.users = data;
//   },
// };

// const fsPromise = require("fs").promises;

// const handleLogout = async (req, res) => {
//   // on client, also delete the access token

//   const cookies = req.cookies;

//   if (!cookies?.jwt) return res.sendStatus(204); // Successfully - No content

//   const refreshToken = cookies.jwt;

//   //   is refresh token  in db ?
//   const userIsPresent = usersDB.users.find(
//     (user) => user.refreshToken === refreshToken
//   );

//   if (!userIsPresent) {
//     res.clearCookie("jwt-token", refreshToken, {
//       httpOnly: true,
//       sameSite: "None",
//       secure: true,
//     });
//     return res.sendStatus(204);
//   }

//   // Delete refresh token in db

//   const otherUsers = usersDB.users.filter(
//     (user) => user.refreshToken !== userIsPresent.refreshToken
//   );

//   const currentUser = { ...userIsPresent, refreshToken: "" };

//   usersDB.setUsers([...otherUsers, currentUser]);

//   await fsPromise.writeFile(
//     path.join(__dirname, "..", "model", "users.json"),
//     JSON.stringify(usersDB.users)
//   );

//   res.clearCookie("jwt-token", refreshToken, {
//     httpOnly: true,
//     sameSite: "None",
//     secure: true,
//   });
//   res.sendStatus(204);
// };

// module.exports = { handleLogout };
