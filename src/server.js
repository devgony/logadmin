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
    `SELECT
    --cpu_idle = record.value('(./Record/SchedulerMonitorEvent/SystemHealth/SystemIdle)[1]', 'int')
    cpu_sql = record.value('(./Record/SchedulerMonitorEvent/SystemHealth/ProcessUtilization)[1]', 'int')
    ,page_lookups = (select cntr_value from sys.dm_os_performance_counters where counter_name like 'Page lookups/sec%')
    ,batch_requests = (select cntr_value from sys.dm_os_performance_counters where counter_name like 'Batch Requests/sec%')
    ,page_reads = (select cntr_value from sys.dm_os_performance_counters where counter_name like 'Page reads/sec%')
    ,active_sessions = (select count(*) from sys.sysprocesses where status not in ('background','sleeping'))
    ,locks = (select count(*) FROM sys.dm_exec_connections AS blocking INNER JOIN sys.dm_exec_requests blocked ON blocking.session_id = blocked.blocking_session_id CROSS APPLY sys.dm_exec_sql_text(blocked.sql_handle) blocked_cache CROSS APPLY sys.dm_exec_sql_text(blocking.most_recent_sql_handle) blocking_cache INNER JOIN sys.dm_os_waiting_tasks waitstats ON waitstats.session_id = blocked.session_id)
FROM (
    SELECT TOP 1 CONVERT(XML, record) AS record
    FROM sys.dm_os_ring_buffers
    WHERE ring_buffer_type = N'RING_BUFFER_SCHEDULER_MONITOR'
    AND record LIKE '% %'
ORDER BY TIMESTAMP DESC
) as cpu_usage`,
    (err, result) => {
      let resData = {};
      for (var key in result.recordset[0]) {
        resData[key] = {
          time: currentTime,
          value: result.recordset[0][key],
        };
      }
      res.json(resData);
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
