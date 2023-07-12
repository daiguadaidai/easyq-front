import { applyStatus, applyStatusMap } from '@/services/swagger/enum';
import { Select, Tag } from 'antd';
import { DatabaseOutlined, TableOutlined } from '@ant-design/icons';

export function getApplyStatusTag(status: number) {
  let color = '';

  if (status == applyStatus.Unknow) {
    color = '#faad14';
  } else if (status == applyStatus.Applying) {
    color = '#1677FF';
  } else if (status == applyStatus.Success) {
    color = '#87d068';
  } else if (status == applyStatus.Fail) {
    color = '#ff4d4f';
  } else {
    return <></>;
  }

  return <Tag color={color}>{applyStatusMap.get(status)}</Tag>;
}

export function getApplyStatusOptions() {
  const eles: any[] = [];
  applyStatusMap.forEach((value, key) =>
    eles.push(
      <Select.Option value={key} key={key}>
        {value}
      </Select.Option>,
    ),
  );
  return eles;
}

export function MysqlPrivTreesToTreeNodes2(privs: CAPI.MysqlPrivTree[]) {
  const trees = [];
  const len = privs.length;
  for (let i = 0; i < len; i++) {
    const dataNode = {
      label: (
        <>
          <DatabaseOutlined />
          &nbsp;&nbsp;
          {`${privs[i].db_name}(${privs[i].vip_port})[${privs[i].cluster_name}]`}
        </>
      ),
      data: { type: 'db', ...privs[i] },
      value: `${privs[i].id}`,
      children: [],
    };
    trees.push(dataNode);
  }

  return trees;
}

export function GetTableNode(privData: any, tableName: string) {
  return {
    label: (
      <>
        <TableOutlined />
        &nbsp;&nbsp;
        {tableName}
      </>
    ),
    data: {
      ...privData.data,
      type: 'table',
      table_name: tableName,
    },
    value: tableName,
  };
}

export function GetTableNodes(privData: any, tableNames: string[]) {
  return tableNames.map((value) => GetTableNode(privData, value));
}

export function ConvertToQueryTable(tableNodes: any[]) {
  const tables = tableNodes.map((tableNode) => {
    return { label: tableNode.data.table_name };
  });

  return tables;
}
