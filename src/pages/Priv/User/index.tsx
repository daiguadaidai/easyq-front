import { useEffect, useRef, useState } from 'react';
import { ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, message, Modal, Row, Select, Tag } from 'antd';
import { deleteUserById, editUserById, findUser } from '@/services/swagger/user';
import { modalFormLayout, modalFormTailLayout } from '@/utils/style';
import '@/pages/index.less';
import { useAccess } from '@@/plugin-access/access';
import { UserRole } from '@/services/swagger/enum';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { PageContainer } from '@ant-design/pro-components';
import { setPropsLocationUrl } from '@/utils/stringUtils';

const Index = (props: any) => {
  const access = useAccess();
  const [isShowEditModal, setIsShowEditModal] = useState(false);
  const [editUser, setEditUser] = useState<CAPI.User>();
  const [keyWord, setKeyWord] = useState<string | undefined>();
  const [users, setUsers] = useState<CAPI.User[]>();
  const [total, setTotal] = useState();
  const [current, setCurrent] = useState<number | undefined>(1);
  const [pageSize, setPageSize] = useState<number | undefined>(50);

  const tableRef = useRef<ActionType>();
  const [editForm] = Form.useForm();

  const searchUser = async (filter: any) => {
    const rs = await findUser(filter);
    if (rs.success) {
      setUsers(rs.data.list);
      setTotal(rs.data.total);
    }
  };

  const getParams = (newCurrent?: number, newPageSize?: number) => {
    return {
      keyword: keyWord,
      current: newCurrent ? newCurrent : current,
      pageSize: newPageSize ? newPageSize : pageSize,
    };
  };

  useEffect(() => {
    const orderBody = {};
    if (props.location?.query?.username) {
      orderBody['keyword'] = props.location?.query?.keyword;
      setKeyWord(orderBody['keyword']);
    }
    if (props.location?.query?.current) {
      orderBody['current'] = parseInt(props.location?.query?.current);
      setCurrent(orderBody['current']);
    }
    if (props.location?.query?.pageSize) {
      orderBody['pageSize'] = parseInt(props.location?.query?.pageSize);
      setPageSize(orderBody['pageSize']);
    }

    // 获取所有用户信息
    (async function getAllUser() {
      await searchUser(orderBody);
    })();
  }, []);

  const handleSearchUsers = async (newCurrent?: number, newPageSize?: number) => {
    const params = getParams(newCurrent, newPageSize);

    // 设置地址栏
    setPropsLocationUrl(params);

    // 后端查询DDL数据
    await searchUser(params);
  };

  // 显示修改弹窗
  const showEditModal = (user: CAPI.User) => {
    setEditUser(user);
    setIsShowEditModal(true);
    editForm.setFieldsValue({ ...user });
  };

  // 显示delete modal
  const showDeleteModal = (user: CAPI.User) => {
    Modal.confirm({
      title: '确定需要删除用户吗?',
      icon: <ExclamationCircleOutlined />,
      content: (
        <>
          <Row className="delete-confirm-row">
            <Col span={6} className="delete-confirm-label">
              用户名:
            </Col>
            <Col span={18}>
              <Input disabled={true} value={user?.username} />
            </Col>
          </Row>
          <Row className="delete-confirm-row">
            <Col span={6} className="delete-confirm-label">
              姓名:
            </Col>
            <Col span={18}>
              <Input disabled={true} value={user?.name_zh} />
            </Col>
          </Row>
          <Row className="delete-confirm-row">
            <Col span={6} className="delete-confirm-label">
              角色:
            </Col>
            <Col span={18}>
              <Input disabled={true} value={user?.role} />
            </Col>
          </Row>
        </>
      ),
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        const rs = await deleteUserById(user.id);
        if (rs?.success) {
          message.success(`删除成功 ${user.username}, ${user.name_zh}`);
          if (tableRef.current) {
            tableRef.current.reload();
          }
        }
      },
    });
  };

  // 执行编辑 Form
  const handleEditOnFinish = async (user: any) => {
    if (user.id <= 0) {
      message.error('用户id不能小于0');
    }
    const rs = await editUserById({ ...user, id: editUser?.id });
    if (rs?.success) {
      message.success('修改成功');
      setIsShowEditModal(false);
      if (tableRef.current) {
        await handleSearchUsers();
      }
    }
  };

  // 关闭Edit Modal
  const closeEditModal = () => {
    setIsShowEditModal(false);
    setEditUser(undefined);
  };

  // 字段信息
  const columns: ProColumns<CAPI.User>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 80,
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '中文名',
      dataIndex: 'name_zh',
    },
    {
      title: '英文名',
      dataIndex: 'name_en',
    },
    {
      title: '角色',
      dataIndex: 'role',
      width: 80,
      render: (_, record) => {
        return <Tag color="processing">{record.role}</Tag>;
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: '更新时间',
      dataIndex: 'updated_at',
      width: 250,
    },
    {
      title: '操作',
      width: 200,
      valueType: 'option',
      render: (_, record) => {
        if (access.canDBA) {
          return [
            <a key="link" className="a-option" onClick={() => showEditModal(record)}>
              修改
            </a>,
            <a key="link2" className="a-option a-danger" onClick={() => showDeleteModal(record)}>
              删除
            </a>,
          ];
        }
        return [];
      },
    },
  ];

  return (
    <PageContainer>
      <Card>
        <Row>
          <Col span={2} className="col-label">
            关键字:
          </Col>
          <Col span={4} className="col-value">
            <Input
              placeholder="请输入库名"
              value={keyWord}
              onChange={(e: any) => setKeyWord(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={6} className="col-left">
            <Button
              type="primary"
              icon={<SearchOutlined />}
              className="gap-left"
              onClick={() => {
                handleSearchUsers();
              }}
            >
              搜索
            </Button>
          </Col>
        </Row>
      </Card>
      <br />
      <ProTable<CAPI.User, { keyWord?: string }>
        actionRef={tableRef}
        columns={columns}
        dataSource={users}
        headerTitle={false}
        options={false}
        search={false}
        cardProps={false}
        rowKey="id"
        dateFormatter="string"
        size="small"
        pagination={{
          defaultPageSize: 50,
          current,
          pageSize,
          total,
        }}
      />
      <Modal
        title={`编辑用户(${editUser?.username})`}
        visible={isShowEditModal}
        footer={false}
        onCancel={closeEditModal}
      >
        <Form {...modalFormLayout} form={editForm} onFinish={handleEditOnFinish}>
          <Form.Item
            label="用户名"
            name="username"
            initialValue={editUser?.username}
            rules={[{ required: true, message: '用户名不能为空' }]}
          >
            <Input disabled={true} />
          </Form.Item>
          <Form.Item
            label="中文名"
            name="name_zh"
            initialValue={editUser?.name_zh}
            rules={[{ required: true, message: '用户中文名不能为空' }]}
          >
            <Input placeholder="请输入用户中文名. 如: 张三" />
          </Form.Item>
          <Form.Item
            label="英文名"
            name="name_en"
            initialValue={editUser?.name_en}
            rules={[{ required: true, message: '用户英文名不能为空' }]}
          >
            <Input placeholder="请输入用户英文名. 如: zhangsan" />
          </Form.Item>
          <Form.Item
            label="角色"
            name="role"
            initialValue={editUser?.role}
            rules={[{ required: true, message: '角色不能为空' }]}
          >
            <Select>
              {[UserRole.DBA, UserRole.Dev, UserRole.Guest].map((role) => (
                <Select.Option key={role} value={role}>
                  {role}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            initialValue={editUser?.email}
            rules={[{ required: true, message: 'Email不能为空' }]}
          >
            <Input placeholder="请输入Email. 如: zhangsan@yonghui.com" />
          </Form.Item>
          <Form.Item {...modalFormTailLayout} style={{ textAlign: 'right' }}>
            <Button htmlType="button" onClick={closeEditModal}>
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
