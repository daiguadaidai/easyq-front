import { PureComponent } from 'react';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import './index.less';
import PropTypes from 'prop-types';

const menuHeight = 38 * 3;

const items: MenuProps['items'] = [
  {
    label: '导出 Excel (所有)',
    key: '导出 Excel (所有)',
  },
  {
    label: '导出 Excel (本行)',
    key: '导出 Excel (本行)',
  },
];

class ResultTableCtxMenu extends PureComponent<any, any> {
  static propTypes = {
    onRef: PropTypes.func,
    downloadExcelRows: PropTypes.func,
    downloadExcelCurrRow: PropTypes.func,
  };

  constructor(props: any) {
    super(props);
    props.onRef(this);

    this.state = {
      ctxStyle: {
        display: 'none',
      },
      data: {
        row: {},
      },
    };

    this.showCtx = this.showCtx.bind(this);
  }

  showCtx = (ctxStyle: any, otherData: any) => {
    const { top } = ctxStyle;
    if (window.innerHeight - top < menuHeight) {
      ctxStyle.top -= menuHeight;
    }

    this.setState(
      {
        ctxStyle,
        ...otherData,
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
    if (info.key === '导出 Excel (所有)') {
      this.props.downloadExcelRows();
    } else if (info.key === '导出 Excel (本行)') {
      this.props.downloadExcelCurrRow(this.state.data.row);
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

export default ResultTableCtxMenu;
