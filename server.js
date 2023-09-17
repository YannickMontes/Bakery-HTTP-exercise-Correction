const { makeApp } = require("./app");
const database = require("./database/database");
const auth = require("./auth");

const app = makeApp(database, auth);

app.listen(app.PORT, () => console.log(`Listening on http://localhost:${app.PORT} ...`));

module.exports = app;