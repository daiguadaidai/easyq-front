// @ts-ignore
/* eslint-disable */
import request, { ResponseData } from '@/utils/request';
// @ts-ignore
import { CAPI } from '@/services/swagger/typings';

/** Add a new pet to the store POST /pet */
export async function findUser(body: any, options?: { [key: string]: any }) {
  return request<ResponseData<CAPI.ResponseList<CAPI.User>>>('/api/v1/user/find', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function allUser(options?: { [key: string]: any }) {
  return request<ResponseData<CAPI.ResponseList<CAPI.User>>>('/api/v1/user/all', {
    method: 'GET',
    ...(options || {}),
  });
}

// 编辑用户
export async function editUserById(body: any, options?: { [key: string]: any }) {
  return request<ResponseData<Object>>('/api/v1/user/edit-by-id', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

// 删除集群信息
export async function deleteUserById(id: number) {
  return request<ResponseData<Object>>('/api/v1/user/delete-by-id', {
    method: 'POST',
    data: { id: id, is_deleted: 1 },
  });
}
