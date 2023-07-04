import './index.less';
import '@/pages/index.less';
import { useAccess } from 'umi';
import { applyStatus } from '@/services/swagger/enum';
import { getApplyStatusOptions, getApplyStatusTag } from '@/components/ComUtil';
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  TablePaginationConfig,
  Tooltip,
} from 'antd';
import { useEffect, useRef, useState } from 'react';
import {
  ApplyMysqlPrivEditByUUID,
  ApplyMysqlPrivSuccess,
  FindMySQLPrivApplysByUUID,
  FindMySQLPrivOrders,
} from '@/services/swagger/mysql_privs';
import { setPropsLocationUrl } from '@/utils/stringUtils';
import { allUser } from '@/services/swagger/user';
import { ClearOutlined, SearchOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { modalFormLayout, modalFormTailLayout } from '@/utils/style';

const Index = (props: any) => {
  const tableRef = useRef<ActionType>();
  const [editStatusForm] = Form.useForm();
  const access = useAccess();

  const [orders, setOrders] = useState<CAPI.MysqlDBPrivApplyOrder[]>();
  const [searchUsername, setSearchUsername] = useState<string>();
  const [searchOrderUUID, setSearchOrderUUID] = useState<string>();
  const [searchApplyStatus, setSearchApplyStatus] = useState<number>();
  const [current, setCurrent] = useState<number | undefined>(1);
  const [pageSize, setPageSize] = useState<number | undefined>(50);
  const [total, setTotal] = useState<number>();
  const [applyPrivMap, setApplyPrivMap] = useState<any>();
  const [editOrder, setEditOrder] = useState<CAPI.MysqlDBPrivApplyOrder>();
  const [visibleEditOrderModal, setVisibleEditOrderModal] = useState<boolean>(false);

  const [users, setUsers] = useState<CAPI.User[]>();

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

  const confirmApply = async (order_uuid: string) => {
    const rs = await ApplyMysqlPrivSuccess({ order_uuid });
    if (rs.success) {
      message.success('审批成功!');
      await handleSearchOrders();
    }
  };

  // 执行编辑 Form
  const handleEditOrderOnFinish = async (order: any) => {
    const rs = await ApplyMysqlPrivEditByUUID({
      ...order,
      order_uuid: editOrder?.order_uuid,
    });
    if (rs?.success) {
      message.success('修改成功');
      setVisibleEditOrderModal(false);
      if (tableRef.current) {
        await handleSearchOrders();
      }
    }
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
                  console.log(record);
                  setEditOrder(record);
                  setVisibleEditOrderModal(true);
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
          if (
            record.apply_status === applyStatus.Applying ||
            record.apply_status === applyStatus.Fail
          ) {
            ops.push(
              <Popconfirm
                title="确定同意权限申请?"
                onConfirm={() => {
                  confirmApply(record.order_uuid);
                }}
                okText="确定"
                cancelText="取消"
                key="1"
              >
                <a key="link" className="a-option">
                  同意
                </a>
              </Popconfirm>,
            );
          }
        }
        return ops;
      },
    },
  ];

  return (
    <PageContainer>
      <Card>
        <Row>
          <Col span={2} className="col-label">
            申请人:
          </Col>
          <Col span={4} className="col-value">
            <Select
              placeholder="请选择申请人"
              filterOption={(input: string, option: any) =>
                // @ts-ignore
                option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              value={searchUsername}
              onChange={(value: any) => setSearchUsername(value)}
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
              onChange={(e: any) => setSearchOrderUUID(e.target.value)}
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
              filterOption={(input: string, option: any) =>
                // @ts-ignore
                option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={(value: any) => setSearchApplyStatus(value)}
              onClear={() => {
                setSearchApplyStatus(undefined);
              }}
              showSearch
              allowClear
            >
              {getApplyStatusOptions()}
            </Select>
          </Col>
          <Col span={6} className="col-left">
            <Button
              type="primary"
              icon={<SearchOutlined />}
              className="gap-left"
              onClick={() => {
                handleSearchOrders();
              }}
            >
              搜索
            </Button>
            <Button
              type="default"
              icon={<ClearOutlined />}
              className="gap-left"
              onClick={handleOnClickClearSearch}
            >
              清空
            </Button>
          </Col>
        </Row>
      </Card>
      <br />
      <ProTable<CAPI.MysqlDBPrivApplyOrder, { keyWord?: string }>
        actionRef={tableRef}
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
      <Modal
        title={`编辑申请单(${editOrder?.order_uuid})`}
        visible={visibleEditOrderModal}
        footer={false}
        onCancel={() => {
          setEditOrder(undefined);
          setVisibleEditOrderModal(false);
        }}
      >
        <Form {...modalFormLayout} form={editStatusForm} onFinish={handleEditOrderOnFinish}>
          <Form.Item
            label="状态"
            name="apply_status"
            initialValue={editOrder?.apply_status}
            rules={[{ required: true, message: '工单状态' }]}
          >
            <Select placeholder="请选择需要修改单状态" allowClear>
              {getApplyStatusOptions()}
            </Select>
          </Form.Item>
          <Form.Item {...modalFormTailLayout} style={{ textAlign: 'right' }}>
            <Button
              htmlType="button"
              onClick={() => {
                setEditOrder(undefined);
                setVisibleEditOrderModal(false);
              }}
            >
              取消
            </Button>
            <Button type="primary" htmlType="submit" style={{ margin: '0 0 0 8px' }}>
              更改
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default Index;
