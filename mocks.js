const faker = require("faker");
const models = require("./models");
const TurndownService = require("turndown");
const owner = "5cd6a1881cda346644283a19";

module.exports = () => {
  models.Post.deleteMany()
    .then(() => {
      Array.from({ length: 20 }).forEach(() => {
        const turndownService = new TurndownService();
        models.Post.create({
          title: faker.random.words(5),
          body: turndownService.turndown(faker.lorem.words(100)),
          owner
        })
          .then(console.log)
          .catch(console.log);
      });
    })
    .catch(console.log);
};
