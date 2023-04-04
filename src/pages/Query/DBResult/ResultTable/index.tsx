// @ts-ignore
import { Grid, ScrollSync, AutoSizer } from 'react-virtualized';
import React from 'react';
import Draggable from 'react-draggable';

import 'react-virtualized/styles.css';
import './index.less';
import { Empty } from 'antd';

type StateType = {
  rsState: VirTableState;
  columns: Column[];
};

type PropType = {
  columnNames: string[];
  rows: object[];
  rowNumColumnWidth: number;
  columnWidth: number;
  overscanColumnCount: number;
  overscanRowCount: number;
  rowHeight: number;
  width: number;
  height: number;
};

type Column = {
  name: string;
  width: number;
  left: number;
};

type VirTableState = {
  rowNumColumnWidth: number; // 序号行列大小
  columnWidth: number; // 每个字段初始宽度
  overscanColumnCount?: number;
  overscanRowCount?: number;
  rowHeight: number;
  width: number;
  height: number;
};

interface ResultTable {
  state: StateType;
  props: PropType;
}

class ResultTable extends React.PureComponent {
  constructor(props: PropType) {
    super(props);

    const { columns } = this.createColumns();

    this.state = {
      rsState: { ...this.props },
      columns,
    };

    this.getAvgColumnWidth = this.getAvgColumnWidth.bind(this);
    this.createColumns = this.createColumns.bind(this);
    this.getBodyWidthAndHeight = this.getBodyWidthAndHeight.bind(this);
    this._renderHeaderCell_V2 = this._renderHeaderCell_V2.bind(this);
    this._renderBodyCell = this._renderBodyCell.bind(this);
    this.getEmptyContent = this.getEmptyContent.bind(this);
    this.getTableComponent = this.getTableComponent.bind(this);
    this.getResultComponent = this.getResultComponent.bind(this);
  }

  componentDidMount() {
    // 计算列平均宽度
    const { rsState } = this.state;
    const { columns, columnWidth } = this.createColumns();
    this.setState({ rsState: { ...rsState, columnWidth }, columns });
  }

  getBodyWidthAndHeight = () => {
    return {
      width: this.props.width - this.props.rowNumColumnWidth,
      height: this.props.height - this.props.rowHeight,
    };
  };

  // 计算列平均宽度
  getAvgColumnWidth = () => {
    let totalWidth = 0;
    const { columns } = this.state;
    columns.map((column) => {
      const { width } = column;
      totalWidth += width;
    });
    return totalWidth / columns.length;
  };

  createColumns = () => {
    // 获取数据内容 content
    const { width: bodyWidth } = this.getBodyWidthAndHeight();
    const newColumns: Column[] = [];

    // 如果每个字段加起来的总宽度 小于 设置的总宽度(body宽度), 将字段原来指定的宽度设置成 body宽度/字段数 平均值
    const oriTotalWidth = this.props.columnNames.length * this.props.columnWidth;
    let columnWidth = this.props.columnWidth;
    if (this.props.columnNames.length > 0) {
      if (oriTotalWidth < bodyWidth) {
        columnWidth = bodyWidth / this.props.columnNames.length;
      }
    }

    let totalLeft = 0;
    this.props.columnNames.map((columnName) => {
      newColumns.push({ width: columnWidth, left: totalLeft, name: columnName });
      totalLeft += columnWidth;
    });

    return { columns: newColumns, columnWidth };
  };

  // @ts-ignore
  _renderLeftHeaderCell = ({ key, style }) => {
    return (
      <div className="virtualized-headerCell" key={key} style={style}>
        #
      </div>
    );
  };

  // @ts-ignore
  _renderLeftSideCell = ({ rowIndex, key, style }) => {
    let backgroundColorClassName;
    if (rowIndex % 2 === 0) {
      backgroundColorClassName = 'virtualized-evenRow';
    } else {
      backgroundColorClassName = 'virtualized-oddRow';
    }

    return (
      <div className={`virtualized-cell ${backgroundColorClassName}`} key={key} style={style}>
        {rowIndex + 1}
      </div>
    );
  };

  // @ts-ignore
  resizeRow = ({ columnIndex, deltaX }) => {
    if (deltaX === 0) {
      return;
    }

    const { rsState, columns } = this.state;

    const newColumns: Column[] = [];
    let totalLeft = 0;

    // @ts-ignore
    columns.map((column, i) => {
      const { name, width } = column;
      let newColumnWidth = width;

      if (columnIndex === i) {
        // 遇到改变大小的列
        newColumnWidth += deltaX;
      }

      if (newColumnWidth < 25) {
        newColumnWidth = 25;
      }

      newColumns.push({ width: newColumnWidth, left: totalLeft, name });

      totalLeft += newColumnWidth;
    });

    const columnWidth = totalLeft / columns.length;

    this.setState({
      rsState: { ...rsState, columnWidth },
      columns: newColumns,
    });
  };

  // @ts-ignore
  _renderHeaderCell_V2 = ({ columnIndex, key, style }) => {
    const { columns } = this.state;
    const { name, width, left } = columns[columnIndex];
    return (
      <div className="virtualized-headerCell" key={key} style={{ ...style, width, left }}>
        <span className="virtualized-span-cell" style={{ width: width - 12 }} title={name}>
          {name}
        </span>
        <Draggable
          /**
           * 从当前selection对象中移除所有的range对象,取消所有的选择只 留下anchorNode 和focusNode属性并将其设置为null。
           * 会引发codemirror如果使用快捷键执行代码后无法继续输入
           */
          enableUserSelectHack={false}
          axis="x"
          grid={[25, 0]}
          defaultClassName="virtualized-DragHandle"
          defaultClassNameDragging="virtualized-DragHandleActive"
          onDrag={(event, { deltaX }) =>
            this.resizeRow({
              columnIndex,
              deltaX,
            })
          }
          position={{ x: 0, y: 0 }}
        >
          <span className="virtualized-DragHandleIcon">⋮</span>
        </Draggable>
      </div>
    );
  };

  // @ts-ignore
  _renderBodyCell = ({ columnIndex, key, rowIndex, style }) => {
    let backgroundColorClassName;
    if (rowIndex % 2 === 0) {
      backgroundColorClassName = 'virtualized-evenRow';
    } else {
      backgroundColorClassName = 'virtualized-oddRow';
    }

    // @ts-ignore
    const { columns } = this.state;
    const column = columns[columnIndex];
    const { name, width, left } = column;

    return (
      <div
        className={`virtualized-cell ${backgroundColorClassName}`}
        key={key}
        style={{ ...style, width, left }}
        easydb-result-cell-div={key}
      >
        <span className="virtualized-span-cell" title={this.props.rows[rowIndex][name]}>
          {this.props.rows[rowIndex][name]}
        </span>
      </div>
    );
  };

  getEmptyContent = () => {
    return <Empty />;
  };

  getTableComponent = () => {
    const { rsState, columns } = this.state;
    const { width, height } = this.getBodyWidthAndHeight();

    return (
      <>
        <ScrollSync>
          {({ onScroll, scrollLeft, scrollTop }) => {
            return (
              <div className="virtualized-GridRow">
                <div
                  className="virtualized-LeftSideGridContainer"
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                  }}
                >
                  <Grid
                    className="virtualized-HeaderGrid"
                    cellRenderer={this._renderLeftHeaderCell}
                    width={rsState.rowNumColumnWidth}
                    height={rsState.rowHeight}
                    rowHeight={rsState.rowHeight}
                    columnWidth={rsState.rowNumColumnWidth}
                    rowCount={1}
                    columnCount={1}
                  />
                </div>
                <div
                  className="virtualized-LeftSideGridContainer"
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: rsState.rowHeight,
                  }}
                >
                  <Grid
                    className="virtualized-LeftSideGrid"
                    scrollToRow={undefined}
                    overscanColumnCount={rsState.overscanColumnCount}
                    overscanRowCount={rsState.overscanRowCount}
                    cellRenderer={this._renderLeftSideCell}
                    columnWidth={rsState.rowNumColumnWidth}
                    columnCount={1}
                    width={rsState.rowNumColumnWidth}
                    height={height}
                    rowHeight={rsState.rowHeight}
                    rowCount={this.props.rows.length}
                    scrollTop={scrollTop}
                  />
                </div>
                <div className="virtualized-GridColumn">
                  <AutoSizer disableHeight>
                    {() => {
                      return (
                        <div>
                          <div
                            style={{
                              position: 'absolute',
                              left: rsState.rowNumColumnWidth,
                              top: 0,
                              height: rsState.rowHeight,
                              width,
                            }}
                          >
                            <Grid
                              className="virtualized-HeaderGrid"
                              columnWidth={rsState.columnWidth}
                              columnCount={columns.length}
                              height={rsState.rowHeight}
                              overscanColumnCount={rsState.overscanColumnCount}
                              cellRenderer={this._renderHeaderCell_V2}
                              rowHeight={rsState.rowHeight}
                              rowCount={1}
                              scrollLeft={scrollLeft}
                              width={width}
                            />
                          </div>
                          <div
                            style={{
                              position: 'absolute',
                              left: rsState.rowNumColumnWidth,
                              top: rsState.rowHeight,
                              height: rsState.height - rsState.rowHeight,
                              width,
                            }}
                          >
                            <Grid
                              className="virtualized-BodyGrid"
                              scrollToRow={undefined}
                              columnWidth={rsState.columnWidth}
                              columnCount={columns.length}
                              height={height}
                              onScroll={onScroll}
                              overscanColumnCount={rsState.overscanColumnCount}
                              overscanRowCount={rsState.overscanRowCount}
                              cellRenderer={this._renderBodyCell}
                              rowHeight={rsState.rowHeight}
                              rowCount={this.props.rows.length}
                              width={width}
                            />
                          </div>
                        </div>
                      );
                    }}
                  </AutoSizer>
                </div>
              </div>
            );
          }}
        </ScrollSync>
      </>
    );
  };

  getResultComponent = () => {
    if (
      this.state.columns.length <= 0 ||
      this.props.rows.length <= 0 ||
      isNaN(this.props.height) ||
      isNaN(this.props.width)
    ) {
      return this.getEmptyContent();
    }

    return this.getTableComponent();
  };

  render() {
    return this.getResultComponent();
  }
}

export default ResultTable;
