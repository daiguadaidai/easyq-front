import { Button, Col, Row } from 'antd';
import { ClearOutlined, DatabaseOutlined, PlayCircleOutlined } from '@ant-design/icons';
import CodeMirror from '@uiw/react-codemirror';
import { oneDarkTheme } from '@codemirror/theme-one-dark';
import { MySQL, sql } from '@codemirror/lang-sql';

import './index.less';
import React from 'react';
import PropTypes from 'prop-types';

class DBQuery extends React.PureComponent<any, any> {
  static propTypes = {
    tabPaneKey: PropTypes.string,
    dbQueryData: PropTypes.any,
    cleanDataAndLocalStore: PropTypes.func,
    selectedTreeData: PropTypes.any,
  };

  constructor(props: any) {
    super(props);

    this.state = {
      selectedTreeData: { ...props.selectedTreeData },
    };

    this.getDBQueryDataHeight = this.getDBQueryDataHeight.bind(this);
    this.handleRun = this.handleRun.bind(this);
    this.handleCleanCache = this.handleCleanCache.bind(this);
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  setStateWithOther = (state: any) => {
    this.setState({ ...state });
  };

  getDBQueryDataHeight = () => {
    const { height } = this.props.dimensions;
    return `${height - 56}px`;
  };

  handleRun = () => {
    this.props.dbResultQueryGetResult();
  };

  handleCleanCache = () => {
    this.props.cleanDataAndLocalStore();
  };

  render() {
    return (
      <div className="db-query-content">
        <Row>
          <Col span={24} className="db-query-title-col">
            <span className="db-query-title-col-method">MySQL 查询</span>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <DatabaseOutlined />
            <span className="db-query-title-col-method">
              &nbsp;&nbsp;
              {`${this.state?.selectedTreeData?.db_name}`}
            </span>
            <span>
              {` - (${this.state?.selectedTreeData?.vip_port}) - [${this.state?.selectedTreeData?.cluster_name}]`}
            </span>
          </Col>
        </Row>
        <Row>
          <Col span={12} className="db-query-tool-col">
            <Button
              size="small"
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={this.handleRun}
            >
              运行
            </Button>
          </Col>
          <Col span={12} className="db-query-tool-col text-right">
            <Button
              size="small"
              type="dashed"
              icon={<ClearOutlined />}
              onClick={this.handleCleanCache}
              ghost
            >
              清空缓存
            </Button>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <CodeMirror
              className="db-query-codemiror"
              value={''}
              height={this.getDBQueryDataHeight()}
              editable={true}
              extensions={[sql({ dialect: MySQL, upperCaseKeywords: true })]}
              theme={oneDarkTheme}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default DBQuery;
