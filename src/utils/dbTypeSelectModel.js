// 定义有几种数据库组件
export const DB_TYPE_MYSQL = 'MySQL';
export const DB_TYPE_MYSQL_SHARD = 'MySQL(Shard)';
export const DB_TYPE_REDIS = 'Redis';
export const DB_TYPE_REDIS_CLUSTER = 'RedisCluster(Bat)';
export const DB_TYPE_CODIS = 'Codis';
export const DB_TYPE_TIDB = 'TiDB';
export const DB_TYPE_HBASE = 'HBase';
export const DB_TYPE_CASSANDRA = 'Cassandra';
export const DB_TYPE_PGRAPH = 'PGraph';
export const DB_TYPE_PHBASE = 'PHBase';
export const DB_TYPE_ES = 'ES';
export const DB_TYPE_CLICKHOUSE = 'Clickhouse';

// 设置默认显示的是什么组件
export const DB_TYPE_DEFAULT = DB_TYPE_MYSQL;

export const defaultState = {
  currDBType: DB_TYPE_DEFAULT,
  list: [
    DB_TYPE_MYSQL,
    DB_TYPE_REDIS,
    DB_TYPE_REDIS_CLUSTER,
    DB_TYPE_CODIS,
    DB_TYPE_TIDB,
    DB_TYPE_HBASE,
    DB_TYPE_CASSANDRA,
    DB_TYPE_PGRAPH,
    DB_TYPE_PHBASE,
    DB_TYPE_ES,
    DB_TYPE_CLICKHOUSE,
  ],
};
