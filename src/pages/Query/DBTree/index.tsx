import { Col, Input, Row, Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { SearchOutlined } from '@ant-design/icons';

import './index.less';

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

function DBTree(props: any) {
  const getDBTreeDataHeight = () => {
    const { height } = props.dimensions;
    return height - 32;
  };

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
            height={getDBTreeDataHeight()}
            defaultExpandAll
          />
        </Col>
      </Row>
    </div>
  );
}

export default DBTree;
