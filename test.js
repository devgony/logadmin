let activeSessions =
 [{"SPID":55,"STATUS":"runnable ","DB_NAME":"TSQL_LOG","LOGINAME":"LOGADMIN ","HOSTNAME":"henryui-Macmini.local ","BLOCKED":0,"TEXT":"SELECT SPID, STATUS, DB_NAME(S.DBID) DB_NAME, LOGINAME, HOSTNAME, BLOCKED, Q.TEXT, CMD, CPU, PHYSICAL_IO, LAST_BATCH, PROGRAM_NAME\n FROM MASTER.DBO.SYSPROCESSES S OUTER APPLY SYS.DM_EXEC_SQL_TEXT(S.SQL_HANDLE) Q\n WHERE 1=1\n and status not in ('background','sleeping')","CMD":"SELECT ","CPU":0,"PHYSICAL_IO":"0","LAST_BATCH":"2020-06-11T08:50:26.797Z","PROGRAM_NAME":"node-mssql "}]


this.state.activeSessions.


columns: [
						{
							Header: "PROGRAM_NAME"
							,accessor: "PROGRAM_NAME"
						},
						{
							Header: "STATUS"
							,accessor: "STATUS"
						}
                    ]
                    


 {Header: "SPID", accessor: "SPID"}
,{Header: "STATUS", accessor: "STATUS"}
,{Header: "DB_NAME", accessor: "DB_NAME"}
,{Header: "LOGINAME", accessor: "LOGINAME"}
,{Header: "HOSTNAME", accessor: "HOSTNAME"}
,{Header: "BLOCKED", accessor: "BLOCKED"}
,{Header: "Q.TEXT", accessor: "Q.TEXT"}
,{Header: "CMD", accessor: "CMD"}
,{Header: "CPU", accessor: "CPU"}
,{Header: "PHYSICAL_IO", accessor: "PHYSICAL_IO"}
,{Header: "LAST_BATCH", accessor: "LAST_BATCH"}
,{Header: "PROGRAM_NAME", accessor: "PROGRAM_NAME"}