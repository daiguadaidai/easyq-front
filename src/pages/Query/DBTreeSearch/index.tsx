import { Col, Input, Row } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import './index.less';
import React from 'react';
import PropTypes from 'prop-types';

class DBTreeSearch extends React.PureComponent<any, any> {
  static propTypes = {
    tabPaneKey: PropTypes.string,
    dbTreeSearchData: PropTypes.any,
    dbTreeSetSearchKey: PropTypes.func,
    dbTreeSearchDB: PropTypes.func,
  };

  constructor(props: any) {
    super(props);

    this.state = {
      searchKey: this.props.dbTreeSearchData?.searchkey
        ? this.props.dbTreeSearchData?.searchkey
        : '',
    };

    this.getWidth = this.getWidth.bind(this);
  }

  componentDidMount() {}

  getWidth = () => {
    const { width } = this.props.dimensions;
    if (typeof width !== 'number') {
      return 300;
    }

    return width - 10;
  };

  render() {
    return (
      <Row>
        <Col span={24}>
          <Input
            placeholder="数据库搜索"
            size="small"
            suffix={<SearchOutlined />}
            className="db-tree-search-input"
            style={{ width: this.getWidth() }}
            onChange={(e) => {
              this.props.dbTreeSearchDB(e.target.value);
            }}
          />
        </Col>
      </Row>
    );
  }
}

export default DBTreeSearch;
