import { Tree } from 'rsuite';

import './index.less';
import React from 'react';
import PropTypes from 'prop-types';
import { FindPrivTreesByUsername, FindTableNamesByUser } from '@/services/swagger/mysql_privs';
import { getUser } from '@/utils/storage';
import { GetTableNodes, MysqlPrivTreesToTreeNodes2 } from '@/components/ComUtil';
import { Col, Input, message, Row } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

class DBTree extends React.PureComponent<any, any> {
  static propTypes = {
    tabPaneKey: PropTypes.string,
    dbTreeData: PropTypes.any,
  };

  constructor(props: any) {
    super(props);

    /*
    this.state = {
      privs: [],
      privTrees: [],
      searchTrees: [],
      searchKey: '',
    }
     */
    this.state = {
      ...props.dbTreeData,
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

  handleOnExpand = async (expandItemValues: any[], item: any) => {
    if (item.expand) {
      // 关闭树
      return;
    }

    // 展开树操作
    // 获取展开节点树
    const expandValue = expandItemValues[expandItemValues.length - 1];
    let expandPrivTree: any = {};
    const privTreesLeng = this.state.privTrees.length;
    let privIndex = -1;
    for (let i = 0; i < privTreesLeng; i++) {
      if (this.state.privTrees[i].value === expandValue) {
        privIndex = i;
        expandPrivTree = {
          ...this.state.privTrees[i],
        };
        break;
      }
    }
    if (privIndex === -1) {
      message.error('没有获取到展开库相关信息, 展开库 index = -1');
    }

    // 判断子节点是否为空, 已经有表信息则直接返回
    if (expandPrivTree.children.length > 0) {
      return;
    }

    // 没有表信息则创建, 获取表信息
    const rs = await FindTableNamesByUser({
      meta_cluster_id: expandPrivTree.data.meta_cluster_id,
      db_name: expandPrivTree.data.db_name,
    });
    if (!rs.success) {
      // 查询失败
      return;
    }
    if (rs.data.total === 0) {
      message.error(`${expandPrivTree.data.db_name} 该库中没有表`);
    }

    // 查询成功
    const tableNames = rs.data.list;
    const tableNodes = GetTableNodes(expandPrivTree, tableNames);
    expandPrivTree.children = [...tableNodes];
    const privTrees = [...this.state.privTrees];
    privTrees[privIndex] = expandPrivTree;

    // 生成新的 searchTrees
    const searchTrees = [...this.state.searchTrees];
    const searchTreesLeng = searchTrees.length;
    for (let i = 0; i < searchTreesLeng; i++) {
      if (this.state.searchTrees[i].value === expandValue) {
        searchTrees[i].children = [...tableNodes];
        break;
      }
    }

    this.setState({ privTrees, searchTrees });
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
              onExpand={(expandItemValues, item) => this.handleOnExpand(expandItemValues, item)}
              defaultExpandAll
            />
          </Col>
        </Row>
      </>
    );
  }
}

export default DBTree;
