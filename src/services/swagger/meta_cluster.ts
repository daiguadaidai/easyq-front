// @ts-ignore
/* eslint-disable */
import request, { ResponseData } from '@/utils/request';
// @ts-ignore
import { CAPI } from '@/services/swagger/typings';

// 获取所有集群
export async function allCluster(options?: { [key: string]: any }) {
  return request<ResponseData<CAPI.ResponseList<CAPI.MetaCluster>>>('/api/v1/cluster/all', {
    method: 'GET',
    ...(options || {}),
  });
}
