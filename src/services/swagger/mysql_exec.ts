// @ts-ignore
/* eslint-disable */
import request, { ResponseData } from '@/utils/request';
// @ts-ignore
import { CAPI } from '@/services/swagger/typings';

// 获取数据库结果的结果
export async function execMysqlSql(body?: any, options?: { [key: string]: any }) {
  return request<ResponseData<CAPI.DBResult>>('/api/v1/mysql-exec/exec-sql', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
