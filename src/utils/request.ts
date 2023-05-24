/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { message } from 'antd';
import { cleanUser, getToken } from '@/utils/storage';
import { history } from '@@/core/history';
import { stringify } from 'querystring';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '请求页面不存在',
  405: '服务器禁止了使用当前 HTTP 方法的请求',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response }): Response => {
  const { response } = error;
  if (response && response.status) {
    const { status, statusText, url } = response;
    const codeMsg = status ? codeMessage[status] : '';
    message.error(`http 请求错误 ${status}: ${statusText}. ${url}. ${codeMsg}`);
  } else if (!response) {
    message.error(`未知错误, 服务器没有响应`);
  }
  return response;
};

export type ResponseData<D> = {
  code?: number;
  message?: string;
  success?: boolean;
  data?: D;
};

/**
 * 配置request请求时的默认参数
 * 先执行 interceptors, 在执行 errorHandler
 */
const request = extend({
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
});

request.interceptors.request.use((url, options) => {
  // 获取当前token
  const token = getToken();
  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
    'X-Token': token,
  };

  return {
    url,
    options: { ...options, headers },
  };
});

// response interceptor, chagne response
request.interceptors.response.use(
  async (response) => {
    if (response.status !== 200) {
    } else {
      const respData: ResponseData<Object> = await response.clone().json();
      const { code, message: msg, success } = respData;
      if (!success) {
        message.error(`code: ${code}, ${msg}, ${response.url}`);
        // token 问题直接退出到 登录页面
        if (code === 300000) {
          cleanUser();
          const { query = {}, pathname } = history.location;
          const { redirect } = query;
          // Note: There may be security issues, please note
          if (window.location.pathname !== '/user/login' && !redirect) {
            history.replace({
              pathname: '/user/login',
              search: stringify({
                redirect: pathname,
              }),
            });
          }
        }
      }
    }

    return response;
  },
  { global: false },
);

export default request;
