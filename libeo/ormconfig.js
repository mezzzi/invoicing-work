const { SnakeNamingStrategy } = require("./src/naming-strategy");

// console.log(SnakeNamingStrategy);

module.exports = {
  type: "postgres",
  host: "db",
  port: 5432,
  username: "libeo",
  password: "root",
  database: "libeo",
  entities: ["./src/**/*.entity.ts"],
  namingStrategy: new SnakeNamingStrategy()
};
