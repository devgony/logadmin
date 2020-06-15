const sql = require("mssql");
const config = {
  user: "LOGADMIN",
  password: "LABC123",
  server: "localhost",
};
sql.connect(config);
function runQuery(query) {
  return sql.connect().then((pool) => {
    return pool.query(query);
  });
}
runQuery(`select 1`).then((result) => {
  console.log(result);
});
