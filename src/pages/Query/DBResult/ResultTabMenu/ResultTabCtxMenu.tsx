import { PureComponent } from 'react';
import { Menu, MenuProps } from 'antd';
import PropTypes from 'prop-types';

const menuHeight = 38 * 5;

const items: MenuProps['items'] = [
  {
    label: '关闭当前窗口',
    key: '关闭当前窗口',
  },
  {
    label: '关闭其他',
    key: '关闭其他',
  },
  {
    label: '关闭所有',
    key: '关闭所有',
  },
  {
    label: '关闭左侧',
    key: '关闭左侧',
  },
  {
    label: '关闭右侧',
    key: '关闭右侧',
  },
];

class ResultTabCtxMenu extends PureComponent<any, any> {
  static propTypes = {
    onRef: PropTypes.func,
    handleOnClose: PropTypes.func,
    handleOnCloseAll: PropTypes.func,
    handleOnCloseOther: PropTypes.func,
    handleOnCloseLeft: PropTypes.func,
    handleOnCloseRight: PropTypes.func,
  };

  constructor(props: any) {
    super(props);
    props.onRef(this);

    this.state = {
      ctxStyle: {
        display: 'none',
      },
      currKey: '',
    };

    this.showCtx = this.showCtx.bind(this);
  }

  showCtx = (ctxStyle: any, currKey: string) => {
    const { top } = ctxStyle;
    if (window.innerHeight - top < menuHeight) {
      ctxStyle.top -= menuHeight;
    }

    this.setState(
      {
        ctxStyle,
        currKey,
      },
      () => {
        const onclick = () => {
          this.setState({ ctxStyle: { display: 'none' } }, () => {
            // 关闭菜单后需要接触点击事件监听
            document.removeEventListener('click', onclick);
          });
          // 如果是自己在元素中添加 onRightClick 事件, 需要做路径判断
          // if (e && e.path && e.path.length) {
          //   this.setState({ ctxStyle: { display: 'none' } }, () => {
          //     // 关闭菜单后需要接触点击事件监听
          //     document.removeEventListener('click', onclick);
          //   });
          // }
        };
        // 右键菜单打开，监听点击事件，判断是否点击到了右键菜单外来关闭菜单
        document.addEventListener('click', onclick);
      },
    );
  };

  onMenuClick: MenuProps['onClick'] = (info) => {
    if (info.key === '关闭当前窗口') {
      this.props.handleOnClose(this.state.currKey);
    } else if (info.key === '关闭其他') {
      this.props.handleOnCloseOther(this.state.currKey);
    } else if (info.key === '关闭所有') {
      this.props.handleOnCloseAll();
    } else if (info.key === '关闭左侧') {
      this.props.handleOnCloseLeft(this.state.currKey);
    } else if (info.key === '关闭右侧') {
      this.props.handleOnCloseRight(this.state.currKey);
    }
  };

  render() {
    return (
      <div
        className={`easydb-dbtree-ctxmenu`}
        style={{
          zIndex: '999',
          position: 'fixed',
          backgroundColor: 'white',
          boxShadow: '3px 3px 6px #999999',
          ...this.state.ctxStyle,
        }}
      >
        <Menu items={items} onClick={this.onMenuClick} />
      </div>
    );
  }
}

export default ResultTabCtxMenu;
