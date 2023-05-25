import { Col, Input, Row, Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { SearchOutlined } from '@ant-design/icons';

import './index.less';
import React from 'react';

const dig = (path = '0', level = 1) => {
  const list = [];
  for (let i = 0; i < 10; i += 1) {
    const key = `${path}-${i}`;
    const treeNode: DataNode = {
      title: key,
      key,
    };

    if (level > 0) {
      treeNode.children = dig(key, level - 1);
    }

    list.push(treeNode);
  }
  return list;
};

const treeData = dig();

class DBTree extends React.PureComponent<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {};

    this.getDBTreeDataHeight = this.getDBTreeDataHeight.bind(this);
  }

  getDBTreeDataHeight = () => {
    const { height } = this.props.dimensions;
    return height - 32;
  };

  render() {
    return (
      <div className="db-tree-content">
        <Row>
          <Col span={24}>
            <Input size="small" suffix={<SearchOutlined />} className="db-tree-search-input" />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Tree
              treeData={treeData}
              className="db-tree-data"
              height={this.getDBTreeDataHeight()}
              defaultExpandAll
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default DBTree;
