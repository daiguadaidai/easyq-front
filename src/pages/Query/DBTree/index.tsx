import { Tree } from 'rsuite';

import './index.less';
import React from 'react';
import PropTypes from 'prop-types';
import { FindPrivTreesByUsername } from '@/services/swagger/mysql_privs';
import { getUser } from '@/utils/storage';
import { MysqlPrivTreesToTreeNodes2 } from '@/components/ComUtil';

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

    this.getDBTreeDataHeight = this.getDBTreeDataHeight.bind(this);
  }

  componentDidMount = async () => {
    this.props.onRef(this);

    const user = getUser();

    const privs = await FindPrivTreesByUsername({ username: user.username });
    if (privs.success) {
      const privTrees = MysqlPrivTreesToTreeNodes2(privs.data.list);
      const searchTrees = [...privTrees];
      this.setState({ privs, privTrees, searchTrees });
    }
  };

  getDBTreeDataHeight = () => {
    const { height } = this.props.dimensions;

    if (typeof height !== 'number') {
      return 300;
    }

    return height;
  };

  setSearchKey = (searchKey: string) => {
    if (this.state.searchKey === searchKey) {
      return;
    }

    this.setState({ searchKey });
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

  render() {
    return (
      <Tree
        className="db-tree-data"
        data={this.state.searchTrees}
        height={this.getDBTreeDataHeight()}
        defaultExpandAll
      />
    );
  }
}

export default DBTree;
