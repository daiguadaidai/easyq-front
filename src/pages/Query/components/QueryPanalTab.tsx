import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import IconSymbol from '@/components/IconSymbol/IconSymbol';

class QueryPanalTab extends PureComponent {
  static propTypes = {
    iconName: PropTypes.string,
    iconTitle: PropTypes.string,
    iconClassName: PropTypes.object,
    iconStyle: PropTypes.object,
  };

  render() {
    // @ts-ignore
    const { iconName, iconTitle, iconClassName, iconStyle } = this.props;

    return (
      <div>
        <span style={{ float: 'left' }}>
          <IconSymbol name={iconName} className={iconClassName} style={iconStyle} />
        </span>
        &nbsp;&nbsp;
        <span style={{ lineHeight: '28px', fontSize: '12px' }}>{iconTitle}</span>
      </div>
    );
  }
}

export default QueryPanalTab;
