// @ts-ignore
/* eslint-disable */
import request, { ResponseData } from '@/utils/request';

// 获取数据库结果的结果
export async function getDBResultUtil(body?: any, options?: { [key: string]: any }) {
  return request<ResponseData<CAPI.DBResult>>('/api/v1/utils/db-result', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
