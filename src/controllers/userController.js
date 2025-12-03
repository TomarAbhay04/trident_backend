// // src/controllers/userController.js
// import User from "../models/User.js";

// export const createUser = async (req, res, next) => {
//   try {
//     const { name, email, phone, password } = req.body;

//     const exists = await User.findOne({ email });
//     if (exists) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const user = await User.create({
//       name,
//       email,
//       phone,
//       password,
//       role: "user",
//     });

//     res.status(201).json(user);
//   } catch (err) {
//     next(err);
//   }
// };

// export const getUsers = async (req, res, next) => {
//   try {
//     const users = await User.find({ role: "user" }).select("-password");
//     res.json(users);
//   } catch (err) {
//     next(err);
//   }
// };





// src/controllers/userController.js
import User from "../models/User.js";

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: "policies",          // Policy collection ka naam (Policy model => "policies")
          localField: "_id",
          foreignField: "user",
          as: "policies",
        },
      },
      {
        $addFields: {
          policyCount: { $size: "$policies" },
        },
      },
      {
        $project: {
          password: 0,
          policies: 0,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    res.json(users);
  } catch (err) {
    next(err);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: "user",
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      policyCount: 0, // new user, no policies yet
    });
  } catch (err) {
    next(err);
  }
};
