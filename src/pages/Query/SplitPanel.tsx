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
  private dbQueryRef: any;

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
    this.onRefDBQuery = this.onRefDBQuery.bind(this);
    this.dbQuerySetState = this.dbQuerySetState.bind(this);
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

  dbResultQueryGetResult = (priv_id: number, query: string) => {
    this.dbResultRef.queryGetResult(priv_id, query);
  };

  onRefDBTree = (ref: any) => {
    this.dbTreeRef = ref;
  };

  onRefDBQuery = (ref: any) => {
    this.dbQueryRef = ref;
  };

  dbQuerySetState = (state: any) => {
    this.dbQueryRef.setStateWithOther(state);
  };

  getChildState = () => {
    if (!this.dbResultRef || !this.dbTreeRef || !this.dbQueryRef) {
      return;
    }

    const dbTreeData = {
      privs: this.dbTreeRef.state.privs,
      searchKey: this.dbTreeRef.state.searchKey,
      selectedNodeData: this.dbTreeRef.state.selectedNodeData,
    };

    const dbResultData = {
      ...this.dbResultRef.state,
    };

    const dbQueryData = {
      ...this.dbQueryRef.state.codeMirrorText,
    };

    return {
      dbTreeData,
      dbResultData,
      dbQueryData,
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
                  dbQuerySetState={this.dbQuerySetState}
                />
              </ReflexElement1>
            </ReflexContainer1>
          </ReflexElement1>

          <ReflexSplitter1 />

          <ReflexElement1>
            <ReflexContainer1 orientation="horizontal">
              <ReflexElement1 propagateDimensionsRate={20} propagateDimensions flex={0.55}>
                <DBQuery
                  onRef={this.onRefDBQuery}
                  dimensions={{}}
                  dbResultQueryGetResult={this.dbResultQueryGetResult}
                  tabPaneKey={this.props.tabPaneKey}
                  dbQueryData={this.props.dbQueryData}
                  selectedTreeData={this.props.dbTreeData?.selectedNodeData}
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
