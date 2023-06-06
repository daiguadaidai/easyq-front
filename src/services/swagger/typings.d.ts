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
}
