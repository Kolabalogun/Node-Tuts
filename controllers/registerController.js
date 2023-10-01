// const path = require("path");
// const bcrypt = require("bcrypt");

// const fsPromise = require("fs").promises;

// const userDB = {
//   users: require("../model/users.json"),
//   setUsers: function (data) {
//     this.users = data;
//   },
// };

// const handleNewUser = async (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password)
//     return res.status(400).json({
//       message: "Username and password are required",
//     });

//   // Check if username already exists
//   const duplicate = userDB.users.find((user) => user.username === username);

//   if (duplicate) return res.sendStatus(409); //conflict

//   try {
//     //encrpt the password

//     const hashedPassword = await bcrypt.hash(password, 10);

//     // store the new user

//     const newUser = {
//       username,
//       roles: {
//         user: 2023,
//       },
//       password: hashedPassword,
//     };

//     userDB.setUsers([...userDB.users, newUser]);

//     await fsPromise.writeFile(
//       path.join(__dirname, "..", "model", "users.json"),
//       JSON.stringify(userDB.users)
//     );
//     console.log(userDB.users);
//     res.status(201).json({ success: "New user added successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = { handleNewUser };

// Using MongoDB

const User = require("../model/User");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res
      .sendStatus(400)
      .json({ message: "Invalid username or password" });

  // check for duplicate username in db]

  const duplicate = await User.findOne({ username: username }).exec();

  if (duplicate) return res.sendStatus(409); // conflict with existing username

  try {
    // encrypt password

    const encryptedPassword = await bcrypt.hash(password, 10);

    // create and store new user

    const result = await User.create({
      username,

      password: encryptedPassword,
    });

    console.log(result);

    res.status(201).json({ success: "New user added successfully" }); // success
  } catch (err) {
    res.status(500).json({ message: error.message }); // Server error
  }
};
module.exports = { handleNewUser };
