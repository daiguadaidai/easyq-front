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
    key?: string;
    column_names?: string[];
    sql?: string;
    rows?: Map<string, object>[];
  };
}
