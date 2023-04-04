import { PureComponent } from 'react';
import { Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import './index.less';

class ResultTabMenu extends PureComponent {
  constructor(props: {} | Readonly<{}>) {
    super(props);
    this.state = {};
  }

  close = (e: { preventDefault: () => void; stopPropagation: () => void }) => {
    e.preventDefault();
    e.stopPropagation();
  };

  render() {
    return (
      <div className="my-result-tab-menu">
        <Button className="my-result-tab-menu-btn" ghost size="small">
          查询结果
        </Button>
        <CloseOutlined className="my-result-tab-menu-icon" onClick={this.close} />
      </div>
    );
  }
}

export default ResultTabMenu;
