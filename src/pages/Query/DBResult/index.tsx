import { Tabs } from 'antd';
import { useEffect, useState } from 'react';
import ResultTabMenu from './ResultTabMenu';
import ResultTable2 from './ResultTable2';

import './index.less';
import { mockUsers } from '@/pages/Test/mock';

const { TabPane } = Tabs;
const tabTitleHeight = 32;
const rows = mockUsers(1000);
const columnNames = ['id', 'firstName', 'lastName', 'gender', 'age', 'city', 'email'];
const sql = 'SELECT * FROM t;';

function DBResult(props: any) {
  const [resultActiveKey, setResultActiveKey] = useState();

  console.log(props.dimensions);

  useEffect(() => {}, []);

  const onChangeTabs = (value: any) => {
    setResultActiveKey(value);
  };

  const getTableResultCom = () => {
    if (typeof props.dimensions.width == 'number' && typeof props.dimensions.height == 'number') {
      return (
        <ResultTable2
          width={props.dimensions.width}
          height={props.dimensions.height - tabTitleHeight}
          columnNames={columnNames}
          rows={rows}
          sql={sql}
        />
      );
    }
    return <></>;
  };

  return (
    <div className="db-result-content">
      <Tabs
        hideAdd
        activeKey={resultActiveKey}
        onChange={onChangeTabs}
        type="card"
        className="db-result-tabs"
      >
        <TabPane tab={<ResultTabMenu />} key="1">
          {getTableResultCom()}
        </TabPane>
        <TabPane tab={<ResultTabMenu />} key="2">
          Content of Tab Pane 2
        </TabPane>
        <TabPane tab={<ResultTabMenu />} key="3">
          Content of Tab Pane 3
        </TabPane>
      </Tabs>
    </div>
  );
}

export default DBResult;
