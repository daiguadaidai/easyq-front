import { Card, Tabs } from 'antd';
import { PureComponent } from 'react';
import './index.less';
import SplitPanel from '@/pages/Query/SplitPanel';
import QueryPanalTab from '@/pages/Query/components/QueryPanalTab';

const { TabPane } = Tabs;

const defaultState = {
  queryTabPaneActiveKey: '1',
  queryTabPaneMaxKey: 2,
  queryTabPanes: [
    {
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
    },
  ],
};

class Index extends PureComponent<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      ...defaultState,
    };
  }

  render() {
    return (
      <Card className="query-card">
        <Tabs
          type="editable-card"
          defaultActiveKey={this.state.queryTabPaneActiveKey}
          className="query-tabs"
        >
          {this.state.queryTabPanes.map((pane: any, i: any) => {
            return (
              <TabPane
                tab={
                  <QueryPanalTab
                    iconName="icon-yunshujukuRDSMySQL"
                    iconStyle={{ width: 24, height: 24 }}
                    iconTitle={`查询面板 ${i}`}
                  />
                }
                key={pane.key}
              >
                <SplitPanel
                  tabPaneKey={pane.key}
                  dbQueryData={pane.dbQueryData}
                  dbTreeData={pane.dbTreeData}
                  dbResultData={pane.dbResultData}
                />
              </TabPane>
            );
          })}
        </Tabs>
      </Card>
    );
  }
}

export default Index;
