import { Tabs } from 'antd';
import React from 'react';
import ResultTabMenu from './ResultTabMenu';
import ResultTable2 from './ResultTable2';

import './index.less';
import { mockUsers } from '@/pages/Test/mock';

const { TabPane } = Tabs;
const tabTitleHeight = 32;
const rows = mockUsers(1000);
const columnNames = ['id', 'firstName', 'lastName', 'gender', 'age', 'city', 'email'];
const sql = 'SELECT * FROM t;';

class DBResult extends React.PureComponent<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      resultActiveKey: '1',
      resultMaxKey: 5,
      resultTabs: [
        {
          key: '1',
          sql,
          columnNames,
          rows,
        },
        {
          key: '2',
          sql: 'aaabbbccc SELECT aaa',
          columnNames,
          rows,
        },
        {
          key: '4',
          sql: '',
          columnNames: [],
          rows: [],
        },
      ],
    };

    this.onChangeTabs = this.onChangeTabs.bind(this);
    this.getTableResultCom = this.getTableResultCom.bind(this);
  }

  onChangeTabs = (value: any) => {
    this.setState({ resultActiveKey: value });
  };

  getTableResultCom = (result: any) => {
    if (
      typeof this.props.dimensions.width == 'number' &&
      typeof this.props.dimensions.height == 'number'
    ) {
      return (
        <ResultTable2
          width={this.props.dimensions.width}
          height={this.props.dimensions.height - tabTitleHeight}
          columnNames={result.columnNames}
          rows={result.rows}
          sql={result.sql}
        />
      );
    }
    return <></>;
  };

  render() {
    console.log(this.state.resultTabs);
    return (
      <>
        <div className="db-result-content">
          <Tabs
            hideAdd
            activeKey={this.state.resultActiveKey}
            onChange={this.onChangeTabs}
            type="card"
            className="db-result-tabs"
          >
            {this.state.resultTabs.map((result: any) => {
              return (
                <TabPane tab={<ResultTabMenu />} key={`${result.key}`}>
                  {this.getTableResultCom(result)}
                </TabPane>
              );
            })}
          </Tabs>
        </div>
      </>
    );
  }
}

export default DBResult;
