const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    body: {
      type: String,
      require: true
    },
    password: {
      type: String,
      require: true
    }
  },
  {
    timestamps: true
  }
);

schema.set("toJSON", {
  virtuals: true
});

module.exports = mongoose.model("Proposal", schema);
