const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const URLSlugs = require("mongoose-url-slugs");
const tr = require("transliter");
const schema = new Schema(
  {
    title: {
      type: String,
      require: true
    },
    body: {
      type: String
    },
    url: {
      type: String
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    status: {
      type: String,
      enum: ["published", "draft"],
      required: true,
      default: "published"
    }
  },
  {
    timestamps: true
  }
);

// schema.plugin(
//   URLSlugs("title", {
//     field: "url",
//     update: true,
//     generator: text => tr.slugify(text)
//   })
// );

schema.pre("save", function(next) {
  this.url = `${tr.slugify(this.title)}-${Date.now().toString(36)}`;
  next();
});

schema.set("toJSON", {
  virtuals: true
});

module.exports = mongoose.model("Post", schema);
