import { Button, Col, message, Row } from 'antd';
import { ClearOutlined, DatabaseOutlined, PlayCircleOutlined } from '@ant-design/icons';
import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { keymap } from '@codemirror/view';
import { oneDarkTheme } from '@codemirror/theme-one-dark';
import { MySQL, sql } from '@codemirror/lang-sql';

import './index.less';
import React from 'react';
import PropTypes from 'prop-types';
import { textToSqls } from '@/services/swagger/util';

const defaultDBQueryData = {
  codeMirrorText: '',
};

class DBQuery extends React.PureComponent<any, any> {
  private codeMirrorRef = React.createRef<ReactCodeMirrorRef>();

  static propTypes = {
    tabPaneKey: PropTypes.string,
    dbQueryData: PropTypes.any,
    cleanDataAndLocalStore: PropTypes.func,
    selectedTreeData: PropTypes.any,
  };

  constructor(props: any) {
    super(props);

    const dbQueryData = props?.dbQueryDatade ? props?.dbQueryDatade : defaultDBQueryData;
    /*
    this.state = {
      selectedTreeData: {
          db_name: '',
          meta_cluster_id: -1,
          cluster_name: '',
          vip_port: ''
      },
      codeMirrorText: '',
      tables: [],
    };
     */
    this.state = {
      selectedTreeData: { ...props.selectedTreeData },
      tables: [],
      ...dbQueryData,
      editorView: {},
      editorState: {},
    };

    this.getDBQueryDataHeight = this.getDBQueryDataHeight.bind(this);
    this.handleRun = this.handleRun.bind(this);
    this.handleCleanCache = this.handleCleanCache.bind(this);
    this.handleOnchange = this.handleOnchange.bind(this);
    this.getContext = this.getContext.bind(this);
    this.getCustomKeymapExtensions = this.getCustomKeymapExtensions.bind(this);
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

  getContext = () => {
    const content = this.codeMirrorRef.current?.view?.state.doc.toString();
    const range = this.codeMirrorRef.current?.view?.state.selection.ranges.at(0);

    if (!range) {
      return { content };
    }

    const selectedContent = content?.substring(range.from, range.to);

    return {
      content,
      selectedContent,
    };
  };

  handleRun = async () => {
    const { content, selectedContent } = this.getContext();
    let execContent = '';
    if (selectedContent && selectedContent.trim().length !== 0) {
      execContent = selectedContent;
    } else if (content && content.trim().length !== 0) {
      execContent = content;
    } else {
      message.error('没有获取到可执行的sql内容, 可执行sql内容为空.');
      return;
    }

    const result = await textToSqls({ text: execContent });
    if (!result.success) {
      return;
    } else if (result.data.list.length === 0) {
      message.error('解析后没有可执行sql');
      return;
    }

    const sqlStrs = result.data.list;
    console.log(sqlStrs);
  };

  handleCleanCache = () => {
    this.props.cleanDataAndLocalStore();
  };

  handleOnchange = (value: any) => {
    // 设置 code mirror 文本
    this.setState({ codeMirrorText: value });
  };

  getCustomKeymapExtensions = () => {
    return [
      keymap.of([
        {
          key: 'Ctrl-r',
          run: () => {
            this.handleRun();
            return true;
          },
        },
      ]),
    ];
  };

  render() {
    return (
      <div className="db-query-content">
        <Row>
          <Col span={24} className="db-query-title-col">
            <span className="db-query-title-col-method">MySQL 查询</span>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <DatabaseOutlined />
            <span className="db-query-title-col-db">
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
              运行(Ctrl-r)
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
              ref={this.codeMirrorRef}
              className="db-query-codemiror"
              value={this.state.codeMirrorText}
              height={this.getDBQueryDataHeight()}
              editable={true}
              autoFocus={true}
              basicSetup={{
                foldGutter: false,
                indentOnInput: false,
                autocompletion: true,
                defaultKeymap: false,
              }}
              extensions={[
                sql({
                  dialect: MySQL,
                  schema: {},
                  upperCaseKeywords: true,
                  tables: this.state.tables,
                }),
                ...this.getCustomKeymapExtensions(),
              ]}
              theme={oneDarkTheme}
              onChange={(value) => this.handleOnchange(value)}
              onCreateEditor={(view, state) =>
                this.setState({ editorView: view, editorState: state })
              }
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default DBQuery;
