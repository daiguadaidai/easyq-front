import { PureComponent } from 'react';
import PropTypes from 'prop-types';

class StoreResultTable extends PureComponent<any, any> {
  static propTypes = {
    currKey: PropTypes.string,
    scrollTop: PropTypes.number,
    setResultTabValues: PropTypes.func,
  };

  constructor(props: any) {
    super(props);
    props.onRef(this);

    this.state = {
      scrollTop: props.scrollTop,
    };
  }

  componentDidMount = () => {
    console.log('StoreResultTable: componentDidMount');
  };

  componentWillUnmount() {
    if (this.state.scrollTop !== this.props.scrollTop) {
      this.props.setResultTabValues(this.props.currKey, { scrollTop: this.state.scrollTop });
    }
  }

  resetState = (values: any) => {
    this.setState({ ...values });
  };

  render() {
    return <></>;
  }
}

export default StoreResultTable;
