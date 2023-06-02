import { Card, message, Tabs } from 'antd';
import React, { PureComponent } from 'react';
import './index.less';
import SplitPanel from '@/pages/Query/SplitPanel';
import QueryPanalTab from '@/pages/Query/components/QueryPanalTab';
import { storeQueryData, getQueryDataFromLocalStore } from '@/utils/storage';

const { TabPane } = Tabs;

const defaultqueryTabPane = {
  key: '1',
  dbQueryData: {},
  dbTreeData: {},
  dbResultData: {
    resultActiveKey: '1',
    resultMaxKey: 1,
    resultTabs: [
      /*
        {
          key: '1',
          sql: 'SELECT * FROM t',
          column_names: ['col_name_1'],
          columns: [{ key: 0, label: 'col_name_1', width: 150 }],
          rows: [{ col_name_1: 'aacaca' }],
          loading: true,
          version: 0,
          scrollTop: 0,
          errorMessage: '',
        },
        */
    ],
  },
};

const defaultState = {
  queryTabPaneActiveKey: '1',
  queryTabPaneMaxKey: 2,
  queryTabPanes: [
    {
      ...defaultqueryTabPane,
    },
  ],
};

class Index extends PureComponent<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      ...defaultState,
    };

    this.onEditTabPane = this.onEditTabPane.bind(this);
    this.onChangeTabPane = this.onChangeTabPane.bind(this);
    this.addTabPane = this.addTabPane.bind(this);
    this.removeTabPane = this.removeTabPane.bind(this);
    this.getSplitPanelCom = this.getSplitPanelCom.bind(this);
    this.setDBResultData = this.setDBResultData.bind(this);
    this.getStateFromLocalStore = this.getStateFromLocalStore.bind(this);
    this.getStateRemoveResultData = this.getStateRemoveResultData.bind(this);
  }

  componentDidMount() {
    // 从本地存储中获取数据
    this.getStateFromLocalStore();
  }

  componentWillUnmount() {
    // 获取没有结果集的 sate
    const state = this.getStateRemoveResultData();
    storeQueryData(state);
  }

  getStateRemoveResultData = () => {
    const state = {
      ...this.state,
    };

    const len = state.queryTabPanes.length;
    for (let i = 0; i < len; i++) {
      state.queryTabPanes[i].dbResultData = {
        resultActiveKey: '1',
        resultMaxKey: 1,
        resultTabs: [],
      };
    }

    return state;
  };

  getStateFromLocalStore = () => {
    const newState = getQueryDataFromLocalStore();
    console.log('1', newState);
    // 没有数据
    if (typeof newState === 'undefined' || newState === null || !newState) {
      return;
    }
    console.log('2', newState);

    // 没有state的数据对应的相关key则不使用 local store 数据
    if (
      !Reflect.has(newState, 'queryTabPaneActiveKey') ||
      !Reflect.has(newState, 'queryTabPaneMaxKey') ||
      !Reflect.has(newState, 'queryTabPanes') ||
      newState.queryTabPanes?.length === 0
    ) {
      return;
    }
    console.log('3', newState);

    this.setState(newState);
  };

  addTabPane = () => {
    const newQueryTabPaneActiveKey = `${this.state.queryTabPaneMaxKey}`;
    const newQueryTabPaneMaxKey = this.state.queryTabPaneMaxKey + 1;

    const newState = {
      queryTabPaneActiveKey: newQueryTabPaneActiveKey,
      queryTabPaneMaxKey: newQueryTabPaneMaxKey,
      queryTabPanes: [
        ...this.state.queryTabPanes,
        {
          ...defaultqueryTabPane,
          key: newQueryTabPaneActiveKey,
        },
      ],
    };
    this.setState(newState);
  };

  removeTabPane = (key: any) => {
    const len = this.state.queryTabPanes.length;
    let removeIndex = -1;
    for (let i = 0; i < len; i++) {
      if (this.state.queryTabPanes[i].key === key) {
        removeIndex = i;
        break;
      }
    }

    if (removeIndex === -1) {
      message.error(`移除查询面板失败. key: ${key}`);
      return;
    }

    // 计算新的展示key
    let newShowIndex = removeIndex;
    // 关闭的是最后一个tab, 当前展示的tab index需要前移一个
    if (removeIndex === len - 1) {
      newShowIndex = newShowIndex - 1;
    }

    const newQueryTabPanes = [...this.state.queryTabPanes];
    newQueryTabPanes.splice(removeIndex, 1);

    // 获取新的active key
    let queryTabPaneActiveKey = '-1';
    if (newShowIndex !== -1) {
      queryTabPaneActiveKey = newQueryTabPanes[newShowIndex].key;
    }

    this.setState({ queryTabPaneActiveKey, queryTabPanes: newQueryTabPanes });
  };

  onEditTabPane = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: 'add' | 'remove',
  ) => {
    if (action === 'add') {
      this.addTabPane();
    } else {
      this.removeTabPane(targetKey);
    }
  };

  onChangeTabPane = (targetKey: any) => {
    this.setState({ queryTabPaneActiveKey: targetKey });
  };

  getSplitPanelCom = (pane: any) => {
    if (pane.key !== this.state.queryTabPaneActiveKey) {
      return <></>;
    }

    return (
      <SplitPanel
        tabPaneKey={pane.key}
        dbQueryData={pane.dbQueryData}
        dbTreeData={pane.dbTreeData}
        dbResultData={pane.dbResultData}
        setDBResultData={this.setDBResultData}
      />
    );
  };

  setDBResultData = (key: string, values: any) => {
    const len = this.state.queryTabPanes.length;
    let tabPaneIndex = -1;
    let newTabPane = {};
    for (let i = 0; i < len; i++) {
      if (this.state.queryTabPanes[i].key === key) {
        tabPaneIndex = i;
        newTabPane = {
          ...this.state.queryTabPanes[i],
          dbResultData: { ...values },
        };
        break;
      }
    }

    if (tabPaneIndex === -1) {
      message.error(`设置查询面板结果值出错: key: ${key}, values: ${JSON.stringify(values)}`);
      return;
    }

    const newQueryTabPanes = [...this.state.queryTabPanes];
    newQueryTabPanes[tabPaneIndex] = newTabPane;

    this.setState({ queryTabPanes: newQueryTabPanes });
  };

  render() {
    return (
      <Card className="query-card">
        <Tabs
          type="editable-card"
          activeKey={this.state.queryTabPaneActiveKey}
          className="query-tabs"
          onEdit={this.onEditTabPane}
          onChange={this.onChangeTabPane}
        >
          {this.state.queryTabPanes.map((pane: any) => {
            return (
              <TabPane
                tab={
                  <QueryPanalTab
                    iconName="icon-yunshujukuRDSMySQL"
                    iconStyle={{ width: 24, height: 24 }}
                    iconTitle={`查询面板 ${pane.key}`}
                  />
                }
                key={pane.key}
              >
                {this.getSplitPanelCom(pane)}
              </TabPane>
            );
          })}
        </Tabs>
      </Card>
    );
  }
}

export default Index;
