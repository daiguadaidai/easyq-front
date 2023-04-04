import { Card, Tabs } from 'antd';
import { PureComponent } from 'react';
import './index.less';
import SplitPanel from '@/pages/Query/SplitPanel';
import QueryPanalTab from '@/pages/Query/components/QueryPanalTab';

const { TabPane } = Tabs;
class Index extends PureComponent {
  render() {
    return (
      <Card className="query-card">
        <Tabs type="editable-card" defaultActiveKey="1" className="query-tabs">
          <TabPane
            tab={
              <QueryPanalTab
                iconName="icon-yunshujukuRDSMySQL"
                iconStyle={{ width: 24, height: 24 }}
                iconTitle="Tab 1"
              />
            }
            key="1"
          >
            <SplitPanel />
          </TabPane>
          <TabPane
            tab={
              <QueryPanalTab
                iconName="icon-yunshujukuRDSMySQL"
                iconStyle={{ width: 24, height: 24 }}
                iconTitle="Tab 2"
              />
            }
            key="2"
          >
            <SplitPanel />
          </TabPane>
          <TabPane
            tab={
              <QueryPanalTab
                iconName="icon-yunshujukuRDSMySQL"
                iconStyle={{ width: 24, height: 24 }}
                iconTitle="Tab 3"
              />
            }
            key="3"
          >
            <SplitPanel />
          </TabPane>
        </Tabs>
      </Card>
    );
  }
}

export default Index;
