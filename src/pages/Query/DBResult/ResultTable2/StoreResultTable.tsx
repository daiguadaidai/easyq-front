import { PureComponent } from 'react';
import PropTypes from 'prop-types';

class StoreResultTable extends PureComponent<any, any> {
  static propTypes = {
    currKey: PropTypes.string,
    scrollTop: PropTypes.number,
    setResultTabValues: PropTypes.func,
    columns: PropTypes.array,
    version: PropTypes.number,
  };

  constructor(props: any) {
    super(props);
    props.onRef(this);

    this.state = {
      scrollTop: props.scrollTop,
      columns: props.columns,
      unmountSetResultTabValues: false,
    };

    this.virStoreState = this.virStoreState.bind(this);
    this.virStoreColumnWidth = this.virStoreColumnWidth.bind(this);
  }

  componentDidUpdate = (prevProps: any) => {
    // 结果有变更则更新
    if (this.props.version !== prevProps.version) {
      this.setState({ columns: this.props.columns });
    }
  };

  componentWillUnmount() {
    // 有值被改变最终才需要进行保存
    if (this.state.unmountSetResultTabValues) {
      this.props.setResultTabValues(this.props.currKey, {
        scrollTop: this.state.scrollTop,
        columns: this.state.columns,
      });
    }
  }

  // 设置值
  virStoreState = (values: any) => {
    this.setState({ ...values, unmountSetResultTabValues: true });
  };

  // 设置字段宽度
  virStoreColumnWidth = (key: string, width: number) => {
    const newColumns = [...this.state.columns];
    const len = newColumns.length;
    for (let i = 0; i < len; i++) {
      if (newColumns[i].label === key) {
        newColumns[i].width = width;
      }
    }
    this.setState({ columns: newColumns, unmountSetResultTabValues: true });
  };

  render() {
    return <></>;
  }
}

export default StoreResultTable;
