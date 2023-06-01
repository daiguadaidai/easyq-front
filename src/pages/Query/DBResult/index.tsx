import { message, Tabs } from 'antd';
import React from 'react';
import ResultTabMenu from './ResultTabMenu';
import ResultTable2 from './ResultTable2';

import './index.less';
import { getDBResultUtil } from '@/services/swagger/util';
import ResultTabCtxMenu from '@/pages/Query/DBResult/ResultTabMenu/ResultTabCtxMenu';

const { TabPane } = Tabs;
const tabTitleHeight = 32;

const defaultState = {
  resultActiveKey: '1',
  resultMaxKey: 1,
  resultTabs: [],
};

class DBResult extends React.PureComponent<any, any> {
  private colseTabCtxMenuRef: any;

  constructor(props: any) {
    super(props);

    this.state = {
      ...defaultState,
    };

    this.onChangeTabs = this.onChangeTabs.bind(this);
    this.getTableResultCom = this.getTableResultCom.bind(this);
    this.queryGetResult = this.queryGetResult.bind(this);
    this.setResultTabValues = this.setResultTabValues.bind(this);
    this.colseTabCtxMenu = this.colseTabCtxMenu.bind(this);
    this.handleOnClose = this.handleOnClose.bind(this);
    this.handleOnCloseAll = this.handleOnCloseAll.bind(this);
    this.handleOnCloseOther = this.handleOnCloseOther.bind(this);
    this.handleOnCloseLeft = this.handleOnCloseLeft.bind(this);
    this.handleOnCloseRight = this.handleOnCloseRight.bind(this);
  }

  componentDidMount = () => {
    this.props.onRef(this);
  };

  onChangeTabs = (value: any) => {
    this.setState({ resultActiveKey: value });
  };

  colseTabCtxMenu = (ref: any) => {
    this.colseTabCtxMenuRef = ref;
  };

  onCloseTabContextMenu = (event: React.MouseEvent<HTMLElement>, currKey: string) => {
    event.preventDefault();

    // 点击事件发生时打开右键菜单
    const { pageX, pageY } = event;

    const ctxStyle = {
      top: pageY,
      left: pageX,
      display: undefined,
    };

    this.colseTabCtxMenuRef.showCtx(ctxStyle, currKey);
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
      message.error(`设置结果值出错: key: ${key}, values: ${JSON.stringify(values)}`);
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

  // 关闭所有tab结果
  handleOnCloseAll = () => {
    this.setState({
      ...defaultState,
    });
  };

  // 关闭其他tab
  handleOnCloseOther = (key: string) => {
    const len = this.state.resultTabs.length;
    let resultTab = {};
    for (let i = 0; i < len; i++) {
      if (key === this.state.resultTabs[i].key) {
        resultTab = {
          ...this.state.resultTabs[i],
        };
        break;
      }
    }

    this.setState({ resultActiveKey: key, resultTabs: [resultTab] });
  };

  // 关闭左边
  handleOnCloseLeft = (key: string) => {
    const len = this.state.resultTabs.length;
    const newResultTabs = [];
    let canPush = false;
    for (let i = 0; i < len; i++) {
      if (canPush) {
        newResultTabs.push({ ...this.state.resultTabs[i] });
        continue;
      }

      if (key === this.state.resultTabs[i].key) {
        newResultTabs.push({ ...this.state.resultTabs[i] });
        canPush = true;
      }
    }

    this.setState({ resultActiveKey: key, resultTabs: newResultTabs });
  };

  // 关闭右边
  handleOnCloseRight = (key: string) => {
    const len = this.state.resultTabs.length;
    const newResultTabs = [];
    for (let i = 0; i < len; i++) {
      newResultTabs.push({ ...this.state.resultTabs[i] });

      if (key === this.state.resultTabs[i].key) {
        break;
      }
    }

    this.setState({ resultActiveKey: key, resultTabs: newResultTabs });
  };

  // 查询sql并且获取结果
  queryGetResult = (metaClusterId: number, dbName: string, sql: string) => {
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
      errorMessage: '',
    };
    // 设置一个空的resultTab
    this.setState(
      {
        resultActiveKey,
        resultMaxKey,
        resultTabs: [...this.state.resultTabs, resultTab],
      },
      async () => {
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
          message.error('新增Tab在获取结果集阶段, 没有获取到当前需要修改到Result Tab');
          return;
        }

        const rs = await getDBResultUtil({ sql, meta_cluster_id: metaClusterId, db_name: dbName });
        let newResultTab = {};
        if (rs.success) {
          // 查询后获取新的数据
          newResultTab = {
            ...tmpResultTab,
            sql: rs.data?.sql,
            column_names: rs.data?.column_names,
            rows: rs.data?.rows,
            loading: false,
          };
        } else {
          // 查询后获取新的数据
          newResultTab = {
            ...tmpResultTab,
            sql: rs.data?.sql,
            loading: false,
            errorMessage: rs.message,
          };
        }

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
                  tab={
                    <ResultTabMenu
                      currKey={result.key}
                      handleOnClose={this.handleOnClose}
                      onCloseTabContextMenu={this.onCloseTabContextMenu}
                    />
                  }
                  key={`${result.key}`}
                >
                  {this.getTableResultCom(result)}
                </TabPane>
              );
            })}
          </Tabs>
          <ResultTabCtxMenu
            onRef={this.colseTabCtxMenu}
            handleOnClose={this.handleOnClose}
            handleOnCloseAll={this.handleOnCloseAll}
            handleOnCloseOther={this.handleOnCloseOther}
            handleOnCloseLeft={this.handleOnCloseLeft}
            handleOnCloseRight={this.handleOnCloseRight}
          />
        </div>
      </>
    );
  }
}

export default DBResult;
