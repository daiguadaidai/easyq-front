export enum Env {
  Prod = 'prod',
  Dev = 'dev',
  Sit = 'sit',
}

export enum UserRole {
  DBA = 'dba',
  Dev = 'dev',
  Guest = 'guest',
}

export enum IsDeleted {
  No = 0,
  Yes = 1,
}

export enum IsShard {
  No = 0,
  Yes = 1,
}

export enum IsShardStr {
  No = '否',
  Yes = '是',
}

export const isShardMap = new Map([
  [IsShard.No, IsShardStr.No],
  [IsShard.Yes, IsShardStr.Yes],
]);

export enum ClusterCategory {
  Unknow = 0, // 未知
  TceSelfMySQL = 1, // TCE自建MySQL
  PublicSelfMySQL = 2, // 公有云自建MySQL
  TceTDSQL = 3, // TEC-TDSQL
  PublicTDSQLC = 4, // 公有云TDSQL-C
  PublicMySQL = 5, // 公有云MySQL
  FuZhouMySQL = 6, // 福州-MySQL(自建)
}

export enum ClusterCategoryStr {
  Unknow = '未知',
  TceSelfMySQL = 'TCE-MySQL(自建)',
  PublicSelfMySQL = '公有云-MySQL(自建)',
  TceTDSQL = 'TCE-TDSQL',
  PublicTDSQLC = '公有云-TDSQL-C',
  PublicMySQL = '公有云-MySQL',
  FuZhouMySQL = '福州-MySQL(自建)',
}

export const clusterCategoryMap = new Map([
  [ClusterCategory.Unknow, ClusterCategoryStr.Unknow],
  [ClusterCategory.TceSelfMySQL, ClusterCategoryStr.TceSelfMySQL],
  [ClusterCategory.PublicSelfMySQL, ClusterCategoryStr.PublicSelfMySQL],
  [ClusterCategory.TceTDSQL, ClusterCategoryStr.TceTDSQL],
  [ClusterCategory.PublicTDSQLC, ClusterCategoryStr.PublicTDSQLC],
  [ClusterCategory.PublicMySQL, ClusterCategoryStr.PublicMySQL],
  [ClusterCategory.FuZhouMySQL, ClusterCategoryStr.FuZhouMySQL],
]);

export enum instanceRole {
  Unkonw = '',
  Master = 'master',
  Slave = 'slave',
  Backup = 'backup',
}

export const instanceRoleMap = new Map([
  [instanceRole.Unkonw, instanceRole.Unkonw],
  [instanceRole.Master, instanceRole.Master],
  [instanceRole.Slave, instanceRole.Slave],
  [instanceRole.Backup, instanceRole.Backup],
]);

export enum isMaintenance {
  No = 0,
  Yes = 1,
}

export enum isMaintenanceStr {
  No = '否',
  Yes = '是',
}

export const isMaintenanceMap = new Map([
  [isMaintenance.No, isMaintenanceStr.No],
  [isMaintenance.Yes, isMaintenanceStr.Yes],
]);

export enum shardType {
  ShardTypeNone = '',
  ShardTypeMycat = 'mycat',
  ShardTypeTDSQL = 'tdsql',
  ShardTypeZebra = 'zebra',
  ShardTypeShardingJdbc = 'sharding-jdbc',
  ShardTypeShardingJdbcOnlyDB = 'sharding-jdbc-only-db',
}

export const shardTypes = [
  shardType.ShardTypeNone,
  shardType.ShardTypeMycat,
  shardType.ShardTypeTDSQL,
  shardType.ShardTypeZebra,
  shardType.ShardTypeShardingJdbc,
  shardType.ShardTypeShardingJdbcOnlyDB,
];

export enum storageType {
  Single = 'single',
  Shard = 'shard',
  TIDB = 'tidb',
}

export enum applyStatus {
  Unknow, // 未知
  Applying, // 申请中
  Success, // 申请成功
  Fail, // 申请失败
}

export enum applyStatusStr {
  Unknow = '未知',
  Applying = '申请中',
  Success = '申请成功',
  Fail = '申请失败',
}

export const applyStatusMap = new Map([
  [applyStatus.Unknow, applyStatusStr.Unknow],
  [applyStatus.Applying, applyStatusStr.Applying],
  [applyStatus.Success, applyStatusStr.Success],
  [applyStatus.Fail, applyStatusStr.Fail],
]);
