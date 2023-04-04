import { Card } from 'antd';
import React from 'react';

import 'react-virtualized/styles.css';
import './index.less';
import VirTable from '@/pages/Test/VirTable/VirTable';

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

class Index extends React.PureComponent {
  render() {
    return (
      <Card style={{ height: '400px' }}>
        <VirTable
          rows={rows}
          columnNames={columnNames}
          rowNumColumnWidth={50}
          columnWidth={175}
          overscanColumnCount={5}
          overscanRowCount={5}
          rowHeight={26}
          width={250}
          height={250}
        />
      </Card>
    );
  }
}

export default Index;
