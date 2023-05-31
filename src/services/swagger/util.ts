// @ts-ignore
/* eslint-disable */
import request, { ResponseData } from '@/utils/request';

/** Add a new pet to the store POST /pet */
export async function getDBResult(body?: any, options?: { [key: string]: any }) {
  return request<ResponseData<CAPI.ResponseList<CAPI.DBResult>>>('/api/v1/util/db-result', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
