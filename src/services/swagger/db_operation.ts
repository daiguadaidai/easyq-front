// @ts-ignore
/* eslint-disable */
import request, { ResponseData } from '@/utils/request';
// @ts-ignore
import { CAPI } from '@/services/swagger/typings';

// 获取集群数据库名
export async function findDBNames(body: any, options?: { [key: string]: any }) {
  return request<ResponseData<CAPI.ResponseList<string[]>>>('/api/v1/db-operation/db-names', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
