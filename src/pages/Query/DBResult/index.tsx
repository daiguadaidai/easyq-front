import { Tabs } from 'antd';
import { useEffect, useState } from 'react';
import ResultTabMenu from './ResultTabMenu';
import ResultTable from './ResultTable';

import './index.less';

const { TabPane } = Tabs;
const tabTitleHeight = 32;

const rows = [
  { id: 1, name: 'HH', age: 1, emp_no: 1, 姓名: '陈浩1' },
  { id: 2, name: 'HH', age: 2, emp_no: 2, 姓名: '陈浩2' },
  { id: 3, name: 'HH', age: 3, emp_no: 3, 姓名: '陈浩3' },
  { id: 4, name: 'HH', age: 4, emp_no: 4, 姓名: '陈浩4' },
  { id: 5, name: 'HH', age: 5, emp_no: 5, 姓名: '陈浩5' },
  { id: 6, name: 'HH', age: 6, emp_no: 6, 姓名: '陈浩6' },
  { id: 7, name: 'HH', age: 7, emp_no: 7, 姓名: '陈浩7' },
  { id: 8, name: 'HH', age: 8, emp_no: 8, 姓名: '陈浩8' },
  { id: 9, name: 'HH', age: 9, emp_no: 9, 姓名: '陈浩9' },
  { id: 10, name: 'HH', age: 10, emp_no: 10, 姓名: '陈浩10' },
  { id: 11, name: 'HH', age: 11, emp_no: 11, 姓名: '陈浩11' },
  { id: 12, name: 'HH', age: 12, emp_no: 12, 姓名: '陈浩12' },
  { id: 13, name: 'HH', age: 13, emp_no: 13, 姓名: '陈浩13' },
  { id: 14, name: 'HH', age: 14, emp_no: 14, 姓名: '陈浩14' },
  { id: 15, name: 'HH', age: 15, emp_no: 15, 姓名: '陈浩15' },
  { id: 16, name: 'HH', age: 16, emp_no: 16, 姓名: '陈浩16' },
];

const columnNames = ['id', 'name', 'age', 'emp_no', '姓名'];

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
        <ResultTable
          rows={rows}
          columnNames={columnNames}
          rowNumColumnWidth={50}
          columnWidth={175}
          overscanColumnCount={5}
          overscanRowCount={5}
          rowHeight={26}
          width={props.dimensions.width}
          height={props.dimensions.height - tabTitleHeight}
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
