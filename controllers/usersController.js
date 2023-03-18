const { users, thoughts } = require("../models");
const Users = require("../models/users");


module.exports = {
    // Get all users
    getAllUser(req, res) {
        users.find({})
        .populate({
            path: "thoughts",
            select: "-__v",
          })
          .populate({
            path: "friends",
            select: "-__v",
          })
          
          .select("-__v")
          .sort({ _id: -1 })
          .then((user) => res.json(user))
          .catch((err) => {
            console.log(err);
            res.sendStatus(400);
          });
        },
// creates users
        createUser(req, res) {
            users.create(req.body)
              .then((user) => res.json(user))
              .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
              });
          },

// Get a user
getSingleUser(req, res) {
    Users.findOne({ _id: req.params.id })
      .select('-__v')
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No course with that ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

// deletes users

deleteUser(req, res) {
    users.findOneAndDelete({ _id: req.params.id })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No course with that ID' })
          : thoughts.deleteMany({ _id: { $in: user.thoughts } })
      )
      .then(() => res.json({ message: 'Course and students deleted!' }))
      .catch((err) => res.status(500).json(err));
  },

// update users

updateUser(req, res) {
    Users.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with this id!' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
// add friends to user

addFriend(req, res) {
    console.log('You are adding a friend');
    // console.log(req.body);
    Users.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId}},
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res
              .status(404)
              .json({ message: 'No user found with that ID :(' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

   // Remove friend from user
   removeFriend(req, res) {
    console.log(req.params);
    Users.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId  } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res
              .status(404)
              .json({ message: 'No user found with that ID :(' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
}