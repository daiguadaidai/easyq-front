import { Tree } from 'rsuite';

import './index.less';
import React from 'react';
import PropTypes from 'prop-types';
import { FindPrivTreesByUsername } from '@/services/swagger/mysql_privs';
import { getUser } from '@/utils/storage';
import { MysqlPrivTreesToTreeNodes2 } from '@/components/ComUtil';
import { Col, Input, Row } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

class DBTree extends React.PureComponent<any, any> {
  static propTypes = {
    tabPaneKey: PropTypes.string,
    dbTreeData: PropTypes.any,
  };

  constructor(props: any) {
    super(props);

    this.state = {
      privs: [],
      privTrees: [],
      searchTrees: [],
      searchKey: '',
    };

    this.getHeight = this.getHeight.bind(this);
    this.getWidth = this.getWidth.bind(this);
    this.handleOnExpand = this.handleOnExpand.bind(this);
    this.searchDB = this.searchDB.bind(this);
  }

  componentDidMount = async () => {
    const user = getUser();

    const privs = await FindPrivTreesByUsername({ username: user.username });
    if (privs.success) {
      const privTrees = MysqlPrivTreesToTreeNodes2(privs.data.list);
      const searchTrees = [...privTrees];
      this.setState({ privs, privTrees, searchTrees });
    }
  };

  getWidth = () => {
    const { width } = this.props.dimensions;
    if (typeof width !== 'number') {
      return 0;
    }

    return width - 10;
  };

  getHeight = () => {
    const { height } = this.props.dimensions;

    if (typeof height !== 'number') {
      return 0;
    }

    return height - 35;
  };

  searchDB = (searchKey: string) => {
    let searchTrees: any[] = [];
    if (searchKey === '' && searchKey !== this.state.searchKey) {
      // 搜索key为空字符串, 并且原先key信息已经存在
      searchTrees = [...this.state.privTrees];
    } else if (searchKey === this.state.searchKey) {
      // key一样
      return;
    } else {
      const lowerCaseSearchKey = searchKey.toLowerCase();
      searchTrees = this.state.privTrees.filter((privTree: any) => {
        const label = `${privTree.data.db_name}(${privTree.data.vip_port})[${privTree.data.cluster_name}]`;
        return label.toLowerCase().indexOf(lowerCaseSearchKey) >= 0;
      });
    }

    this.setState({ searchKey, searchTrees });
  };

  handleOnExpand = (a: any, b: any, c: any) => {
    console.log('a: ', a);
    console.log('b: ', b);
    console.log('c: ', c);
  };

  render() {
    return (
      <>
        <Row>
          <Col span={24}>
            <Input
              placeholder="数据库搜索"
              size="small"
              suffix={<SearchOutlined />}
              className="db-tree-search-input"
              style={{ width: this.getWidth() }}
              onChange={(e) => {
                this.searchDB(e.target.value);
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Tree
              className="db-tree-data"
              data={this.state.searchTrees}
              height={this.getHeight()}
              onExpand={this.handleOnExpand}
              defaultExpandAll
            />
          </Col>
        </Row>
      </>
    );
  }
}

export default DBTree;
