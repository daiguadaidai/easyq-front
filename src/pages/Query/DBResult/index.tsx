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
      resultMaxKey: 1,
      resultTabs: [],
    };

    this.onChangeTabs = this.onChangeTabs.bind(this);
    this.getTableResultCom = this.getTableResultCom.bind(this);
    this.queryGetResult = this.queryGetResult.bind(this);
    this.setResultTabValues = this.setResultTabValues.bind(this);
    this.handleOnClose = this.handleOnClose.bind(this);
  }

  componentDidMount = () => {
    this.props.onRef(this);
  };

  onChangeTabs = (value: any) => {
    this.setState({ resultActiveKey: value });
  };

  setResultTabValues = (key: string, values: any) => {
    const len = this.state.resultTabs.length;
    let resultTabIndex = -1;
    let newResultTab = {};
    for (let i = 0; i < len; i++) {
      if (this.state.resultTabs[i].key === key) {
        resultTabIndex = i;
        newResultTab = {
          ...this.state.resultTabs[i],
          ...values,
        };
        break;
      }
    }

    if (resultTabIndex === -1) {
      // @TODO
      // 没有key的数据报错
      return;
    }

    const newResultTabs = [...this.state.resultTabs];
    newResultTabs[resultTabIndex] = newResultTab;
    this.setState({ resultTabs: newResultTabs });
  };

  getTableResultCom = (result: any) => {
    if (
      typeof this.props.dimensions.width == 'number' &&
      typeof this.props.dimensions.height == 'number'
    ) {
      if (this.state.resultActiveKey === result.key) {
        return (
          <ResultTable2
            width={this.props.dimensions.width}
            height={this.props.dimensions.height - tabTitleHeight}
            currKey={result.key}
            columnNames={result.column_names}
            rows={result.rows}
            sql={result.sql}
            loading={result.loading}
            version={result.version}
            scrollTop={result.scrollTop}
            setResultTabValues={this.setResultTabValues}
          />
        );
      }
    }
    return <></>;
  };

  handleOnClose = (key: string) => {
    // 获取result 长度
    const len = this.state.resultTabs.length;
    let keyIndex = -1; // 关闭tab key所在到index
    for (let i = 0; i < len; i++) {
      if (key === this.state.resultTabs[i].key) {
        keyIndex = i;
        break;
      }
    }

    // 获取beforeIndex
    if (keyIndex == -1) {
      return;
    }

    // 计算新的展示key
    let newShowIndex = keyIndex;
    // 关闭的是最后一个tab, 当前展示的tab index需要前移一个
    if (keyIndex === len - 1) {
      newShowIndex = newShowIndex - 1;
    }

    // 删除 key index 数据
    const resultTabs = [...this.state.resultTabs];
    resultTabs.splice(keyIndex, 1);

    // 获取新的active key
    let resultActiveKey = '-1';
    if (newShowIndex !== -1) {
      resultActiveKey = resultTabs[newShowIndex].key;
    }

    this.setState({ resultActiveKey, resultTabs });
  };

  // 查询sql并且获取结果
  queryGetResult = () => {
    // 计算需要新增的result tab
    const resultMaxKey = this.state.resultMaxKey + 1;
    const resultActiveKey = `${this.state.resultMaxKey}`;
    // 新生成tab数据
    const resultTab = {
      key: resultActiveKey,
      sql: sql,
      column_names: [],
      rows: [],
      loading: true,
      version: 0,
      scrollTop: 0,
    };
    // 设置一个空的resultTab
    this.setState(
      {
        resultActiveKey,
        resultMaxKey,
        resultTabs: [...this.state.resultTabs, resultTab],
      },
      () => {
        // 获取tab数
        const len = this.state.resultTabs.length;
        let resultTabIndex = -1;
        let tmpResultTab = {};
        for (let i = 0; i < len; i++) {
          if (this.state.resultTabs[i].key === resultActiveKey) {
            resultTabIndex = i;
            tmpResultTab = {
              ...this.state.resultTabs[i],
              version: this.state.resultTabs[i].version + 1, // 查询结果版本 +1
            };
            break;
          }
        }

        if (resultTabIndex === -1) {
          // @TODO
          // 没有key的数据报错
          return;
        }

        // 查询后获取新的数据
        const newResultTab = {
          ...tmpResultTab,
          sql: 'aaabbbccc SELECT aaa',
          column_names: columnNames,
          rows,
          loading: false,
        };

        // 获取新数据
        const newResultTabs = [...this.state.resultTabs];
        newResultTabs[resultTabIndex] = newResultTab;
        this.setState({ resultTabs: newResultTabs });
      },
    );
  };

  render() {
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
                <TabPane
                  tab={<ResultTabMenu currKey={result.key} handleOnClose={this.handleOnClose} />}
                  key={`${result.key}`}
                >
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
