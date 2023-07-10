import { PureComponent } from 'react';
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex';
const ReflexContainer1: any = ReflexContainer;
const ReflexSplitter1: any = ReflexSplitter;
const ReflexElement1: any = ReflexElement;
import DBTree from '@/pages/Query/DBTree';
import DBQuery from '@/pages/Query/DBQuery';
import DBResult from '@/pages/Query/DBResult';

import 'react-reflex/styles.css';
import './split-panel.less';
import PropTypes from 'prop-types';

class SplitPanel extends PureComponent<any, any> {
  private dbResultRef: any;
  private dbTreeRef: any;

  static propTypes = {
    tabPaneKey: PropTypes.string,
    dbQueryData: PropTypes.any,
    dbTreeData: PropTypes.any,
    dbResultData: PropTypes.any,
    cleanDataAndLocalStore: PropTypes.func,
    setPaneData: PropTypes.func,
  };

  constructor(props: any) {
    super(props);

    this.state = {};

    this.onRefDBResult = this.onRefDBResult.bind(this);
    this.dbResultQueryGetResult = this.dbResultQueryGetResult.bind(this);
    this.onRefDBTree = this.onRefDBTree.bind(this);
    this.getChildState = this.getChildState.bind(this);
  }

  componentDidMount = () => {
    this.props.onRef(this);
  };

  componentWillUnmount() {
    const paneData = this.getChildState();
    if (paneData) {
      this.props.setPaneData(this.props.tabPaneKey, paneData);
    }
  }

  onRefDBResult = (ref: any) => {
    this.dbResultRef = ref;
  };

  dbResultQueryGetResult = () => {
    this.dbResultRef.queryGetResult();
  };

  onRefDBTree = (ref: any) => {
    this.dbTreeRef = ref;
  };

  getChildState = () => {
    if (!this.dbResultRef || !this.dbTreeRef) {
      return;
    }

    const dbTreeData = {
      privs: this.dbTreeRef.state.privs,
      searchKey: this.dbTreeRef.state.searchKey,
    };

    const dbResultData = {
      ...this.dbResultRef.state,
    };

    return {
      dbTreeData,
      dbResultData,
    };
  };

  render() {
    return (
      <>
        <ReflexContainer1 orientation="vertical" className="split-panel-content">
          <ReflexElement1 flex={0.18} className="left-pane">
            <ReflexContainer1 orientation="horizontal">
              <ReflexElement1 propagateDimensionsRate={10} propagateDimensions>
                <DBTree
                  onRef={this.onRefDBTree}
                  tabPaneKey={this.props.tabPaneKey}
                  dbTreeData={this.props.dbTreeData}
                />
              </ReflexElement1>
            </ReflexContainer1>
          </ReflexElement1>

          <ReflexSplitter1 />

          <ReflexElement1>
            <ReflexContainer1 orientation="horizontal">
              <ReflexElement1 propagateDimensionsRate={20} propagateDimensions flex={0.55}>
                <DBQuery
                  dimensions={{}}
                  dbResultQueryGetResult={this.dbResultQueryGetResult}
                  tabPaneKey={this.props.tabPaneKey}
                  dbQueryData={this.props.dbQueryData}
                  cleanDataAndLocalStore={this.props.cleanDataAndLocalStore}
                />
              </ReflexElement1>

              <ReflexSplitter1 />

              <ReflexElement1 propagateDimensionsRate={10} propagateDimensions>
                <DBResult
                  onRef={this.onRefDBResult}
                  tabPaneKey={this.props.tabPaneKey}
                  dbResultData={this.props.dbResultData}
                />
              </ReflexElement1>
            </ReflexContainer1>
          </ReflexElement1>
        </ReflexContainer1>
      </>
    );
  }
}

export default SplitPanel;
