// @ts-ignore
/* eslint-disable */

declare namespace CAPI {
  type ResponseList<T> = {
    list: T[];
    total: number;
  };

  type User = {
    id?: number;
    username?: string;
    email?: string;
    mobile?: string;
    name_en?: string;
    name_zh?: string;
    role?: string;
    is_deleted?: number;
    updated_at?: string;
    created_at?: string;
    token?: string;
  };

  type DBResult = {
    column_names?: string[];
    sql?: string;
    rows?: Map<string, object>[];
  };

  type MetaCluster = {
    id: number;
    name: string;
    cluster_id: string;
    is_deleted: number;
    updated_at: string;
    created_at: string;
    business_line: string;
    owner: string;
    domain_name: string;
    vip_port: string;
    vpcgw_vip_port: string;
    read_host_port: string;
    is_shard: number;
    shard_type: string;
    category: number;
    set_name: string;
  };

  type MysqlDBPrivApplyOrder = {
    id: number;
    order_uuid: string;
    user_id: number;
    username: string;
    name_zh: string;
    apply_status: number;
    apply_reason: string;
    error_message: string;
    updated_at: string;
    created_at: string;
  };

  type MysqlPrivApply = {
    id: number;
    order_uuid: string;
    user_id: number;
    username: string;
    name_zh: string;
    meta_cluster_id: number;
    cluster_name: string;
    db_name: string;
    vip_port: string;
    updated_at: string;
    created_at: string;
  };

  type MysqlPrivTree = {
    id: number;
    meta_cluster_id: number;
    cluster_name: string;
    db_name: string;
    vip_port: string;
  };
}
