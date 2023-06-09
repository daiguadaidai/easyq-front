import { createFromIconfontCN, PlusCircleOutlined } from '@ant-design/icons';
import { Card, Col, Collapse, Drawer, Row } from 'antd';
import React from 'react';
import './index.less';
import { DB_TYPE_MYSQL } from '@/utils/dbTypeSelectModel';
import AddMySQLPrivForm from '@/pages/Priv/PrivApply/AddMySQLPrivForm';

const { Panel } = Collapse;

const IconFont = createFromIconfontCN({
  scriptUrl: '/icons/db/iconfont.js',
  extraCommonProps: {},
});

const Index = () => {
  const [dbType, setDBType] = React.useState<string | undefined>();
  const [visible, setVisible] = React.useState(false);

  const openDrawer = (paramDBType?: string | undefined) => {
    setDBType(paramDBType);
    setVisible(!visible);
  };

  const getMySQLCard = () => {
    return (
      <Card
        hoverable
        style={{ width: '222px', height: '80px' }}
        onClick={() => openDrawer(DB_TYPE_MYSQL)}
      >
        <Row style={{ lineHeight: '50px' }}>
          <Col span={6}>
            <IconFont style={{ fontSize: '50px' }} type="icon-yunshujukuRDSMySQL" />
          </Col>
          <Col span={16} style={{ height: '100%' }}>
            <span style={{ padding: '10px', fontSize: '14px' }}>MySQL</span>
          </Col>
          <Col span={2}>
            <PlusCircleOutlined />
          </Col>
        </Row>
      </Card>
    );
  };

  return (
    <>
      <Drawer
        title={`${dbType} 权限(申请/添加)`}
        placement="right"
        closable
        mask={false}
        width={1000}
        visible={visible}
        onClose={() => openDrawer()}
      >
        <AddMySQLPrivForm />
      </Drawer>
      <div>
        <Collapse defaultActiveKey={['1']} style={{ margin: '10px' }}>
          <Panel header="关系型数据库" key="1">
            <Row>
              <Col span={4}>{getMySQLCard()}</Col>
            </Row>
          </Panel>
        </Collapse>
      </div>
    </>
  );
};

export default Index;
