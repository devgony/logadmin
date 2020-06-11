const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const sql = require("mssql");
var config = {
  user: "LOGADMIN",
  password: "LABC123",
  server: "localhost",
};
sql.connect(config, (err) => {
  if (err) {
    throw err;
  }
  console.log("Connection Successful !");
});

app.use(express.static(path.join(__dirname, "build")));

app.get("/ping", function (req, res) {
  return res.send("pong");
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

app.get("/test", (req, res, next) => {
  let currentTime = new Date().toString().split(" ")[4];
  new sql.Request().query(
    `select cntr_value as pagelookup from sys.dm_os_performance_counters s where counter_name like 'Page lookups/sec%'`,
    (err, result) => {
      let pagelookup = result.recordset[0].pagelookup;
      pagelookup = pagelookup.slice(pagelookup.length - 3);
      res.json({ name: currentTime, value: pagelookup });
    }
  );
});

app.get("/active-sessions", (req, res, next) => {
  new sql.Request().query(
    `SELECT SPID, STATUS, DB_NAME(S.DBID) DB_NAME, LOGINAME, HOSTNAME, BLOCKED, Q.TEXT, CMD, CPU, PHYSICAL_IO, LAST_BATCH, PROGRAM_NAME
    FROM MASTER.DBO.SYSPROCESSES S OUTER APPLY SYS.DM_EXEC_SQL_TEXT(S.SQL_HANDLE) Q
    WHERE 1=1
    and status not in ('background','sleeping')`,
    (err, result) => {
      res.json(result.recordset);
    }
  );
});

app.listen(process.env.PORT || 8080);
