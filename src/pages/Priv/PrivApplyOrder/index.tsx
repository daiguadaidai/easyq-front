import './index.less';
import '@/pages/index.less';
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-components';
import { useAccess } from 'umi';
import { applyStatus } from '@/services/swagger/enum';
import { getApplyStatusOptions, getApplyStatusTag } from '@/components/ComUtil';
import {
  Button,
  Card,
  Col,
  Divider,
  Input,
  Row,
  Select,
  TablePaginationConfig,
  Tooltip,
} from 'antd';
import { useEffect, useState } from 'react';
import { FindMySQLPrivApplysByUUID, FindMySQLPrivOrders } from '@/services/swagger/mysql_privs';
import { setPropsLocationUrl } from '@/utils/stringUtils';
import { allUser } from '@/services/swagger/user';
import { ClearOutlined, SearchOutlined } from '@ant-design/icons';

const Index = (props: any) => {
  const [orders, setOrders] = useState<CAPI.MysqlDBPrivApplyOrder[]>();
  const [searchUsername, setSearchUsername] = useState<string>();
  const [searchOrderUUID, setSearchOrderUUID] = useState<string>();
  const [searchApplyStatus, setSearchApplyStatus] = useState<number>();
  const [current, setCurrent] = useState<number | undefined>(1);
  const [pageSize, setPageSize] = useState<number | undefined>(50);
  const [total, setTotal] = useState<number>();
  const [applyPrivMap, setApplyPrivMap] = useState<any>();

  const [users, setUsers] = useState<CAPI.User[]>();

  const access = useAccess();

  const getParams = (newCurrent?: number, newPageSize?: number) => {
    return {
      username: searchUsername,
      order_uuid: searchOrderUUID,
      apply_status: searchApplyStatus,
      current: newCurrent ? newCurrent : current,
      pageSize: newPageSize ? newPageSize : pageSize,
    };
  };

  useEffect(() => {
    const orderBody = {};
    if (props.location?.query?.username) {
      orderBody['username'] = props.location?.query?.username;
      setSearchUsername(orderBody['username']);
    }
    if (props.location?.query?.order_uuid) {
      orderBody['order_uuid'] = props.location?.query?.order_uuid;
      setSearchOrderUUID(orderBody['order_uuid']);
    }
    if (props.location?.query?.apply_status) {
      orderBody['apply_status'] = parseInt(props.location?.query?.apply_status);
      setSearchApplyStatus(orderBody['apply_status']);
    }
    if (props.location?.query?.current) {
      orderBody['current'] = parseInt(props.location?.query?.current);
      setCurrent(orderBody['current']);
    }
    if (props.location?.query?.pageSize) {
      orderBody['pageSize'] = parseInt(props.location?.query?.pageSize);
      setPageSize(orderBody['pageSize']);
    }

    // 获取申请DDL数据
    (async function searchMySQLPrivOrders() {
      const rs = await FindMySQLPrivOrders(orderBody);
      if (rs && rs.success) {
        setOrders(rs.data.list);
        setTotal(rs.data?.total);
      }
    })();

    // 获取所有用户信息
    (async function getAllUser() {
      const rs = await allUser();
      if (rs && rs.success) {
        setUsers(rs.data?.list);
      }
    })();
  }, []);

  const handleSearchOrders = async (newCurrent?: number, newPageSize?: number) => {
    const params = getParams(newCurrent, newPageSize);

    // 设置地址栏
    setPropsLocationUrl(params);

    // 后端查询DDL数据
    const rs = await FindMySQLPrivOrders(params);
    if (rs && rs.success) {
      setOrders(rs.data.list);
      setTotal(rs.data?.total);
    }
  };

  const handleOnChangeTablePager = async (pageConfig: TablePaginationConfig) => {
    setCurrent(pageConfig.current);
    setPageSize(pageConfig.pageSize);

    await handleSearchOrders(pageConfig.current, pageConfig.pageSize);
  };

  const handleOnClickClearSearch = () => {
    setSearchUsername(undefined);
    setSearchOrderUUID(undefined);
    setSearchApplyStatus(undefined);
  };

  // 实例字段信息
  const applyPrivColumns: ProColumns<CAPI.MysqlPrivApply>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 50,
    },
    {
      title: '集群',
      dataIndex: 'cluster_name',
    },
    {
      title: '数据库',
      dataIndex: 'db_name',
    },
    {
      title: '地址',
      dataIndex: 'vip_port',
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
    },
    {
      title: '更新时间',
      dataIndex: 'updated_at',
    },
  ];

  const expandedRowRender = (record: CAPI.MysqlDBPrivApplyOrder) => {
    const applyPrivs = applyPrivMap ? applyPrivMap[record.id] : [];
    return (
      <>
        <Divider plain>申请权限信息</Divider>
        <Row>
          <Col span={1}>&nbsp;</Col>
          <Col span={22}>
            <ProTable<CAPI.MysqlPrivApply, { keyWord?: string }>
              columns={applyPrivColumns}
              dataSource={applyPrivs}
              options={false}
              headerTitle={false}
              search={false}
              pagination={false}
              scroll={{ x: 1300 }}
              bordered
              toolBarRender={false}
              rowKey="id"
              dateFormatter="string"
              size="small"
            />
          </Col>
          <Col span={1}>&nbsp;</Col>
        </Row>
      </>
    );
  };

  const onExpand = async (expanded: boolean, record: CAPI.MysqlDBPrivApplyOrder) => {
    // 如果是打开动作, 或已经有数据不需要再获取了
    if (expanded && applyPrivMap && applyPrivMap[record.id]) {
      return;
    }
    // 收缩不查询
    if (!expanded) {
      return;
    }
    const rs = await FindMySQLPrivApplysByUUID({ order_uuid: record.order_uuid });
    if (!rs || !rs.success) {
      // 没有获取成功
      return;
    }
    setApplyPrivMap({
      ...applyPrivMap,
      [record.id]: rs.data.list,
    });
  };

  const columns: ProColumns<CAPI.MysqlDBPrivApplyOrder>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 50,
    },
    {
      title: '工单号',
      dataIndex: 'order_uuid',
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '申请人',
      dataIndex: 'name_zh',
    },
    {
      title: '申请状态',
      dataIndex: 'apply_status',
      render: (_, record) => {
        const ele = getApplyStatusTag(record.apply_status);
        if (access.canDBAOrDev) {
          return (
            <Tooltip placement="topLeft" title="双击可以修改申请状态">
              <div
                className="can-click"
                onDoubleClick={() => {
                  console.log('双击修改状态');
                }}
              >
                {ele}
              </div>
            </Tooltip>
          );
        } else {
          return ele;
        }
      },
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
    },
    {
      title: '更新时间',
      dataIndex: 'updated_at',
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => {
        const ops = [];
        if (access.canDBA) {
          if (record.apply_status === applyStatus.Applying) {
            ops.push(
              <a key="link" className="a-option">
                同意
              </a>,
            );
          }
        }
        return ops;
      },
    },
  ];

  return (
    <>
      <Card>
        <Row>
          <Col span={2} className="col-label">
            申请人:
          </Col>
          <Col span={4} className="col-value">
            <Select
              placeholder="请选择申请人"
              filterOption={(input, option) =>
                // @ts-ignore
                option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              value={searchUsername}
              onChange={(value) => setSearchUsername(value)}
              onClear={() => setSearchUsername(undefined)}
              showSearch
              allowClear
            >
              {users &&
                users.map((user) => (
                  <Select.Option value={user.username} key={user.username}>
                    {`${user.name_zh} - ${user.username}`}
                  </Select.Option>
                ))}
            </Select>
          </Col>
          <Col span={2} className="col-label">
            工单号:
          </Col>
          <Col span={4} className="col-value">
            <Input
              placeholder="请输入库名"
              value={searchOrderUUID}
              onChange={(e) => setSearchOrderUUID(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={2} className="col-label">
            申请状态:
          </Col>
          <Col span={4} className="col-value">
            <Select
              style={{ width: '100%' }}
              placeholder="请选申请状态"
              value={searchApplyStatus}
              filterOption={(input, option) =>
                // @ts-ignore
                option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={(value) => setSearchApplyStatus(value)}
              onClear={() => {
                setSearchApplyStatus(undefined);
              }}
              showSearch
              allowClear
            >
              {getApplyStatusOptions()}
            </Select>
          </Col>
        </Row>
        <br />
        <Row>
          <Col span={24} className="col-right">
            <Button
              type="default"
              icon={<ClearOutlined />}
              className="gap-right"
              onClick={handleOnClickClearSearch}
            >
              清空
            </Button>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => {
                handleSearchOrders();
              }}
            >
              搜索
            </Button>
          </Col>
        </Row>
      </Card>
      <br />
      <ProTable<CAPI.MysqlDBPrivApplyOrder, { keyWord?: string }>
        columns={columns}
        dataSource={orders}
        headerTitle={false}
        options={false}
        search={false}
        cardProps={false}
        rowKey="id"
        dateFormatter="string"
        size="small"
        scroll={{ x: '100%' }}
        onChange={handleOnChangeTablePager}
        expandable={{ expandedRowRender, onExpand }}
        pagination={{
          defaultPageSize: 50,
          current,
          pageSize,
          total,
        }}
      />
    </>
  );
};

export default Index;
