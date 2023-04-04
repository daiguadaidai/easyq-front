import { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';

import './iconfont';

class IconSymbol extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
    className: PropTypes.object,
    style: PropTypes.object,
  };

  static defaultProps = {
    name: '',
    className: {
      // width: '1em',
      // height: '1em',
      verticalAlign: '-0.15em',
      fill: 'currentColor',
      overflow: 'hidden',
    },
  };

  render() {
    // @ts-ignore
    const { name, className, style } = this.props;

    return (
      <Fragment>
        <svg className={className} aria-hidden="true" style={style}>
          <use xlinkHref={`#${name}`} />
        </svg>
      </Fragment>
    );
  }
}

export default IconSymbol;
