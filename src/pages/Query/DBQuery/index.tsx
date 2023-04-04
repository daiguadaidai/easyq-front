import { Button, Col, Row } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import CodeMirror from '@uiw/react-codemirror';
import { oneDarkTheme } from '@codemirror/theme-one-dark';
import { MySQL, sql } from '@codemirror/lang-sql';

import './index.less';

function DBQuery(props: any) {
  const getDBQueryDataHeight = () => {
    const { height } = props.dimensions;
    return `${height - 56}px`;
  };

  return (
    <div className="db-query-content">
      <Row>
        <Col span={24} className="db-query-title-col">
          <span className="db-query-title-col-method">MySQL 查询</span>
        </Col>
      </Row>
      <Row>
        <Col span={24} className="db-query-tool-col">
          <Button size="small" type="primary" icon={<PlayCircleOutlined />}>
            运行
          </Button>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <CodeMirror
            className="db-query-codemiror"
            value={''}
            height={getDBQueryDataHeight()}
            editable={true}
            extensions={[sql({ dialect: MySQL, upperCaseKeywords: true })]}
            theme={oneDarkTheme}
          />
        </Col>
      </Row>
    </div>
  );
}

export default DBQuery;
