// @ts-ignore
/* eslint-disable */
import request, { ResponseData } from '@/utils/request';
// @ts-ignore
import { CAPI } from '@/services/swagger/typings';

// 添加申请权限
export async function ApplyMySQLPrivs(body: any, options?: { [key: string]: any }) {
  return request<ResponseData<any>>('/api/v1/mysql-privs/apply-mysql-priv', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

// 添加申请权限
export async function FindMySQLPrivOrders(body: any, options?: { [key: string]: any }) {
  return request<ResponseData<any>>('/api/v1/mysql-privs/apply-mysql-priv-order', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}