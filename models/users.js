const {Schema, model} = require('mongoose');
const Thoughts = require('./thoughts');

const userSchema = new Schema(
    {
    
      username: {
        type: String,
        unique: true,
        trim: true,
        required: true,
      },
  
      email: {
        type: String,
        unique: true,
        required: true,
        match: [/.+@.+\..+/],
      },
  
      thoughts: [
        {
          type: Schema.Types.ObjectId,
          ref: "Thought",
        },
      ],
  
      friends: [
        {
          type: Schema.Types.ObjectId,
          ref: "Users",
        },
      ],
        },
        {
          toJSON: {
            virtuals: true,
          },
          id: false,
        }
    
)
userSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});
const Users = model('Users', userSchema)

module.exports = Users;