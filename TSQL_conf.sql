--docker run -d --name sql_server_logadmin -h mslogadmin -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=reallyStrongPwd113' -p 1433:1433 microsoft/mssql-server-linux
CREATE DATABASE TSQL_LOG;
CREATE LOGIN LOGADMIN WITH PASSWORD='LABC123'
,DEFAULT_DATABASE = TSQL_LOG
,CHECK_EXPIRATION = OFF
,CHECK_POLICY = OFF;
exec sp_addsrvrolemember 'LOGADMIN', 'sysadmin';

--1) performance
SELECT
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
) as cpu_usage

--2) active session
SELECT SPID, STATUS, DB_NAME(S.DBID) DB_NAME, LOGINAME, HOSTNAME, BLOCKED, Q.TEXT, CMD, CPU, PHYSICAL_IO, LAST_BATCH, PROGRAM_NAME
FROM MASTER.DBO.SYSPROCESSES S OUTER APPLY SYS.DM_EXEC_SQL_TEXT(S.SQL_HANDLE) Q
WHERE 1=1
and status not in ('background','sleeping')


select count(*) from sys.sysprocesses where status not in ('background','sleeping')

select * from sys.dm_os_performance_counters where counter_name like 'T%Wait%'

select sum(wait_duration_ms)/1000 from sys.dm_os_waiting_tasks
select * from sys.dm_os_waiting_tasks

--Listing 1: Investigating blocking using the sys.dm_os_waiting_tasks DMV
SELECT blocking.session_id AS blocking_session_id ,
 blocked.session_id AS blocked_session_id ,
 waitstats.wait_type AS blocking_resource ,
 waitstats.wait_duration_ms ,
 waitstats.resource_description ,
 blocked_cache.text AS blocked_text ,
 blocking_cache.text AS blocking_text
FROM sys.dm_exec_connections AS blocking
 INNER JOIN sys.dm_exec_requests blocked
 ON blocking.session_id = blocked.blocking_session_id
 CROSS APPLY sys.dm_exec_sql_text(blocked.sql_handle)
 blocked_cache
 CROSS APPLY sys.dm_exec_sql_text(blocking.most_recent_sql_handle)
 blocking_cache
 INNER JOIN sys.dm_os_waiting_tasks waitstats
 ON waitstats.session_id = blocked.session_id


select * from sys.dm_os_sys_info

select * from sys.dm_os_performance_counters where counter_name like '%CPU usage%' and instance_name = 'internal'

WITH DB_CPU AS
(SELECT	DatabaseID, 
		DB_Name(DatabaseID)AS [DatabaseName], 
		SUM(total_worker_time)AS [CPU_Time(Ms)] 
FROM	sys.dm_exec_query_stats AS qs 
CROSS APPLY(SELECT	CONVERT(int, value)AS [DatabaseID]  
			FROM	sys.dm_exec_plan_attributes(qs.plan_handle)  
			WHERE	attribute =N'dbid')AS epa GROUP BY DatabaseID) 
SELECT	ROW_NUMBER()OVER(ORDER BY [CPU_Time(Ms)] DESC)AS [SNO], 
	DatabaseName AS [DBName], [CPU_Time(Ms)], 
	CAST([CPU_Time(Ms)] * 1.0 /SUM([CPU_Time(Ms)]) OVER()* 100.0 AS DECIMAL(5, 2))AS [CPUPercent] 
FROM	DB_CPU 
WHERE	DatabaseID > 4 -- system databases 
	AND DatabaseID <> 32767 -- ResourceDB 
ORDER BY SNO OPTION(RECOMPILE); 


--WAITFOR DELAY '00:10:01'

