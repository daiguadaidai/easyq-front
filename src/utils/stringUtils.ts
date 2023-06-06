import { format as sqlFormat } from 'sql-formatter';

export const getAddr = (host: string, port: number) => {
  if (host === '') {
    return '';
  } else {
    return host + ':' + port;
  }
};

export const getClusterNameSelectOption = (
  name: string,
  vip_port: string,
  cluster_id: string,
  set_name: string,
  category?: string | undefined,
) => {
  let tmpName = '-';
  let tmpVipPort = '-';
  let tmpSetName = '-';
  let tmpCategory: string | undefined = '-';
  let tmpClusterId = '-';
  if (name && name !== '') {
    tmpName = name;
  }

  if (vip_port && vip_port !== '') {
    tmpVipPort = vip_port;
  }

  if (set_name && set_name !== '') {
    tmpSetName = set_name;
  }

  if (category || category !== '') {
    tmpCategory = category;
  }

  if (cluster_id || cluster_id !== '') {
    tmpClusterId = cluster_id;
  }

  return `${tmpName} | ${tmpVipPort} | ${tmpClusterId} | ${tmpSetName} | ${tmpCategory}`;
};

// 返回 key=value&key1=value1
export const getUrlQueryStr = (params: any) => {
  // 键值对字符串, [key=value, key1=value1]

  const pairStrs = [];
  for (const key in params) {
    const value = params[key];
    if (value || value == 0) {
      pairStrs.push(`${key}=${value}`);
    }
  }
  return pairStrs.join('&');
};

// 设置地址栏
export const setPropsLocationUrl = (params: any) => {
  const newUrl = `${window.location.origin}${window.location.pathname}?${getUrlQueryStr(params)}`;
  window.history.pushState(null, '', newUrl);
};

export const getSqlFormat = (sqlStr: string) => {
  if (!sqlStr) {
    return '';
  }

  return sqlFormat(sqlStr, {
    language: 'mysql', // Defaults to "sql" (see the above list of supported dialects)
    tabWidth: 2,
    linesBetweenQueries: 2, // Defaults to 1
  });
};
