import { PureComponent } from 'react';
import { Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import './index.less';
import PropTypes from 'prop-types';

class ResultTabMenu extends PureComponent<any, any> {
  static propTypes = {
    currKey: PropTypes.string,
    handleOnClose: PropTypes.func,
    onCloseTabContextMenu: PropTypes.func,
  };

  constructor(props: any) {
    super(props);
    this.state = {};

    this.close = this.close.bind(this);
  }

  close = (e: { preventDefault: () => void; stopPropagation: () => void }) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.handleOnClose(this.props.currKey);
  };

  render() {
    return (
      <div
        className="my-result-tab-menu"
        onContextMenu={(e) => this.props.onCloseTabContextMenu(e, this.props.currKey)}
      >
        <Button className="my-result-tab-menu-btn" ghost size="small">
          查询结果 {this.props.currKey}
        </Button>
        <CloseOutlined className="my-result-tab-menu-icon" onClick={this.close} />
      </div>
    );
  }
}

export default ResultTabMenu;
