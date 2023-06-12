import { Button, Col, Divider, message, Row, Select, Table } from 'antd';
import { useEffect, useState } from 'react';
import { getClusterNameSelectOption } from '@/utils/stringUtils';
import { clusterCategoryMap } from '@/services/swagger/enum';
import { allCluster } from '@/services/swagger/meta_cluster';
import StandardFormRow from '@/components/StandardFormRow';
import { findDBNames } from '@/services/swagger/db_operation';

import '@/pages/index.less';
import { ClearOutlined, PlusOutlined } from '@ant-design/icons';
import { ApplyMySQLPrivs } from '@/services/swagger/mysql_privs';

const AddMySQLPrivForm = () => {
  const [metaClusters, setMetaClusters] = useState<CAPI.MetaCluster[]>();
  const [selectMetaClusterId, setSelectMetaClusterId] = useState<number>();
  const [dbNames, setDBNames] = useState<string[]>();
  const [selectDBNames, setSelectDBNames] = useState<string[]>();
  const [privs, setPrivs] = useState<any>();
  const [applyLoading, setApplyLoading] = useState<boolean>(false);

  useEffect(() => {
    // 获取所有集群信息
    (async function getAllCluster() {
      const rs = await allCluster();
      if (rs && rs.success) {
        setMetaClusters(rs.data?.list);
      }
    })();
  }, []);

  const onChangeCluster = async (value: any) => {
    setSelectMetaClusterId(value);
    // 重置数据库列表
    setDBNames(undefined);
    // 获取集群对应的所有数据库
    const rs = await findDBNames({ meta_cluster_id: value });
    if (rs.success) {
      setDBNames(rs.data.list);
    }
  };

  // 权限添加到列表
  const privToList = () => {
    if (!metaClusters) {
      message.error('没有集群信息, 无法将权限信息添加到列表');
      return;
    }
    if (!selectDBNames) {
      message.error('还没有选择好数据库, 请先选择需要申请的数据库');
      return;
    }

    // 获取集群信息
    let metaCluster: CAPI.MetaCluster | undefined = undefined;
    const len = metaClusters.length;
    for (let i = 0; i < len; i++) {
      if (metaClusters[i].id === selectMetaClusterId) {
        metaCluster = metaClusters[i];
        break;
      }
    }

    if (!metaCluster) {
      message.error(`从集群列表中无法找到选择中到集群. meta cluster id: ${selectMetaClusterId}`);
      return;
    }

    // 添加申请权限信息
    let newPrivs: any[] = [];
    if (privs) {
      newPrivs = [...privs];
    }

    let timestampKey = new Date().getTime();
    const tmpPrivs = [];
    for (let i = 0; i < selectDBNames.length; i++) {
      tmpPrivs.push({
        key: timestampKey,
        meta_cluster_id: metaCluster?.id,
        cluster_name: metaCluster?.name,
        vip_port: metaCluster?.vip_port,
        db_name: selectDBNames[i],
      });
      timestampKey++;
    }
    newPrivs.unshift(...tmpPrivs);

    setPrivs(newPrivs);
  };

  const deletePrivs = (index: any) => {
    const newPrivs = [...privs];
    newPrivs.splice(index, 1);
    setPrivs(newPrivs);
  };

  const handleClear = () => {
    setPrivs([]);
  };

  const handleApplyPrivs = async () => {
    if (!privs || privs.length === 0) {
      message.error('申请到权限列表没有权限, 不允许提交');
      return;
    }
    setApplyLoading(true);
    const rs = await ApplyMySQLPrivs({ apply_reason: '', privs });
    if (rs.success) {
      message.success('申请成功');
      setPrivs([]);
      setApplyLoading(false);
      return;
    }

    setApplyLoading(false);
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      render: (text: any, record: any, index: any) => `${index + 1}`,
    },
    {
      title: '集群',
      dataIndex: 'cluster_name',
      key: 'cluster_name',
    },
    {
      title: '地址',
      dataIndex: 'vip_port',
      key: 'vip_port',
    },
    {
      title: '数据库名',
      dataIndex: 'db_name',
      key: 'db_name',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, __: any, index: any) => (
        <Button
          type="link"
          size="small"
          danger
          onClick={() => {
            deletePrivs(index);
          }}
        >
          删除
        </Button>
      ),
    },
  ];

  return (
    <>
      <Row>
        <Col span={24}>
          <StandardFormRow title="集群" block style={{ paddingBottom: 11 }}>
            <Select
              placeholder="请选择所属集群: 集群名 | 地址 | 集群id | set | 类别"
              showSearch
              filterOption={(input: string, option: any) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              filterSort={(optionA: any, optionB: any) =>
                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
              }
              onChange={onChangeCluster}
            >
              {metaClusters?.map((cluster) => (
                <Select.Option key={cluster.id} value={cluster.id}>
                  {getClusterNameSelectOption(
                    cluster.name,
                    cluster.vip_port,
                    cluster.cluster_id,
                    cluster.set_name,
                    clusterCategoryMap.get(cluster.category),
                  )}
                </Select.Option>
              ))}
            </Select>
          </StandardFormRow>

          <StandardFormRow title="数据库名" block style={{ paddingBottom: 11 }}>
            <Select
              allowClear
              mode="multiple"
              placeholder="请选择需要申请的数据库"
              showSearch
              filterOption={(input: string, option: any) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              filterSort={(optionA: any, optionB: any) =>
                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
              }
              onChange={(value) => setSelectDBNames(value)}
            >
              {dbNames?.map((dbName) => (
                <Select.Option key={dbName} value={dbName}>
                  {dbName}
                </Select.Option>
              ))}
            </Select>
          </StandardFormRow>
          <StandardFormRow block style={{ paddingBottom: 11 }}>
            <Button type="primary" onClick={privToList}>
              添加到申请列表
            </Button>
          </StandardFormRow>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Divider orientation="left">申请权限列表</Divider>
          <Table
            size="small"
            columns={columns}
            dataSource={privs}
            className="custom-table"
            title={() => (
              <>
                <Button
                  type="primary"
                  loading={applyLoading}
                  icon={<PlusOutlined />}
                  onClick={handleApplyPrivs}
                >
                  提交申请
                </Button>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Button type="dashed" icon={<ClearOutlined />} onClick={handleClear} danger ghost>
                  清除
                </Button>
              </>
            )}
            bordered
          />
        </Col>
      </Row>
    </>
  );
};

export default AddMySQLPrivForm;
