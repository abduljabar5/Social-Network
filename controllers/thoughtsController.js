const { users, thoughts } = require("../models");



module.exports = {
    // Get all students
    getAllThoughts(req, res) {
        thoughts.find({})
          .select("-__v")
          .sort({ _id: -1 })
          .then((UserData) => res.json(UserData))
          .catch((err) => {
            console.log(err);
            res.sendStatus(400);
          });
        },

        // get thought by id

        getThoughtById(req, res) {
            thoughts.findOne({ _id: req.params.id })
              .select('-__v')
              .then(async (thought) =>
                !thought
                  ? res.status(404).json({ message: 'No thought with that ID' })
                  : res.json({thought})
              )
              .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
              });
          },

        createThoughts(req, res) {
            console.log(req.body.userId);
            thoughts.create(req.body)
             .then((thought) => {
                return users.findOneAndUpdate(
                  { _id: req.body.userId },
                  { $push: { thoughts: thought } },
                  { new: true }
                );
              })
            .then((thought) => res.json(thought))
             
              .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
              });
          },
          // update thought

          updateThought(req, res) {
            thoughts.findOneAndUpdate(
                { _id: req.params.id },
                { $set: req.body },
                { runValidators: true, new: true })
              .then((thought) => {
                if (!thought) {
                  res.status(404).json({ message: "No thought found with this id!" });
                  return;
                }
                res.json(thought);
              })
              .catch((err) => res.json(err));
          },
          deleteThought(req, res) {
            thoughts.findOneAndDelete({ _id: req.params.id })
              .then((thought) => {
                if (!thought) {
                  return res.status(404).json({ message: "No thought with this id!" });
                }
        
                return users.findOneAndUpdate(
                  { thoughts: req.params.id },
                  { $pull: { thoughts: req.params.id } }, 
                  { new: true }
                );
              })
              .then((thought) => {
                if (!thought) {
                  return res
                    .status(404)
                    .json({ message: "Thought deleted, no user with this id!" });
                }
                res.json({ message: "Thought deleted!" });
              })
              .catch((err) => res.json(err));
          },
         // add reactions
  addReaction(req, res) {
    console.log(req.body);
    thoughts.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { new: true, runValidators: false }
    )
      .then((thought) => {
        if (!thought) {
          res.status(404).json({ message: "No thought with this id" });
          return;
        }
        res.json(thought);
      })
      .catch((err) => res.json(err));
  },
   // remove reactions
   removeReaction(req, res) {
    thoughts.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { new: true, runValidators: true }
    )
      .then((thought) => {
        if (!thought) {
          res.status(404).json({ message: "No thought with this id" });
          return;
        }
        res.json(thought);
      })
      .catch((err) => res.json(err));
  },
}