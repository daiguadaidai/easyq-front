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
  set_name: string,
  category: string,
  cluster_id: string,
) => {
  let tmpName = '-';
  let tmpSetName = '-';
  let tmpCategory = '-';
  let tmpClusterId = '-';
  if (name && name !== '') {
    tmpName = name;
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

  return tmpClusterId + ' | ' + tmpName + ' | ' + tmpSetName + ' | ' + tmpCategory;
};

// 返回 key=value&key1=value1
export const getUrlQueryStr = (params) => {
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
export const setPropsLocationUrl = (params) => {
  const newUrl = `${window.location.origin}${window.location.pathname}?${getUrlQueryStr(params)}`;
  window.history.pushState(null, null, newUrl);
};

export const getSqlFormat = (sqlStr: string) => {
  if (!sqlStr) {
    return '';
  }

  return sqlFormat(sqlStr, {
    language: 'mysql', // Defaults to "sql" (see the above list of supported dialects)
    indent: '    ', // Defaults to two spaces
    uppercase: true, // Defaults to false (not safe to use when SQL dialect has case-sensitive identifiers)
    linesBetweenQueries: 2, // Defaults to 1
  });
};
