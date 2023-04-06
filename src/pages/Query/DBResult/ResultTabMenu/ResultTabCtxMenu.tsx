import { PureComponent } from 'react';
import { Menu } from 'antd';
import PropTypes from 'prop-types';

const menuHeight = 38 * 5;

class ResultTabCtxMenu extends PureComponent<any, any> {
  static propTypes = {
    onRef: PropTypes.func,
  };

  constructor(props: any) {
    super(props);
    props.onRef(this);

    this.state = {
      ctxStyle: {
        display: 'none',
      },
      paneKey: '',
    };

    this.showCtx = this.showCtx.bind(this);
  }

  showCtx = (ctxStyle: any, paneKey: any) => {
    const { top } = ctxStyle;
    if (window.innerHeight - top < menuHeight) {
      ctxStyle.top -= menuHeight;
    }

    this.setState(
      {
        ctxStyle,
        paneKey,
      },
      () => {
        const onclick = (e: any) => {
          if (e && e.path && e.path.length) {
            this.setState({ ctxStyle: { display: 'none' } }, () => {
              // 关闭菜单后需要接触点击事件监听
              document.removeEventListener('click', onclick);
            });
          }
        };
        // 右键菜单打开，监听点击事件，判断是否点击到了右键菜单外来关闭菜单
        document.addEventListener('click', onclick);
      },
    );
  };

  render() {
    return (
      <div
        className={`easydb-ctxmenu`}
        style={{
          zIndex: '999',
          position: 'fixed',
          backgroundColor: 'white',
          boxShadow: '3px 3px 6px #999999',
          ...this.state.ctxStyle,
        }}
      >
        <Menu>
          <Menu.Item
            key="1"
            onClick={() => {
              this.props.removeTab(this.state.paneKey);
            }}
          >
            关闭当前窗口
          </Menu.Item>
          <Menu.Item
            key="2"
            onClick={() => {
              this.props.removeOtherTab(this.state.paneKey);
            }}
          >
            关闭其他
          </Menu.Item>
          <Menu.Item
            key="3"
            onClick={() => {
              this.props.removeAllTab();
            }}
          >
            关闭所有
          </Menu.Item>
          <Menu.Item
            key="4"
            onClick={() => {
              this.props.removeLeftTab(this.state.paneKey);
            }}
          >
            关闭左侧
          </Menu.Item>
          <Menu.Item
            key="5"
            onClick={() => {
              this.props.removeRightTab(this.state.paneKey);
            }}
          >
            关闭右侧
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}

export default ResultTabCtxMenu;
