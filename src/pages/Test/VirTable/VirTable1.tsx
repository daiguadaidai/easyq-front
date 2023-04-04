// @ts-ignore
import { Grid, ScrollSync, AutoSizer } from 'react-virtualized';
import React from 'react';
import Draggable from 'react-draggable';

import 'react-virtualized/styles.css';
import './index.less';

type Column = {
  name: string;
  width: number;
};

type VirTableState = {
  rowNumColumnWidth: number; // 序号行列大小
  columnWidth: number; // 每个字段初始宽度
  overscanColumnCount: number;
  overscanRowCount: number;
  rowHeight: number;
  rowCount: number;
  tabPanalHeaderHeight: number;
  width: number;
  height: number;
};

const rows = [
  { id: 1, name: 'HH', age: 1, emp_no: 1, 姓名: '陈浩1' },
  { id: 2, name: 'HH', age: 2, emp_no: 2, 姓名: '陈浩2' },
  { id: 3, name: 'HH', age: 3, emp_no: 3, 姓名: '陈浩3' },
  { id: 4, name: 'HH', age: 4, emp_no: 4, 姓名: '陈浩4' },
  { id: 5, name: 'HH', age: 5, emp_no: 5, 姓名: '陈浩5' },
  { id: 6, name: 'HH', age: 6, emp_no: 6, 姓名: '陈浩6' },
  { id: 7, name: 'HH', age: 7, emp_no: 7, 姓名: '陈浩7' },
  { id: 8, name: 'HH', age: 8, emp_no: 8, 姓名: '陈浩8' },
  { id: 9, name: 'HH', age: 9, emp_no: 9, 姓名: '陈浩9' },
  { id: 10, name: 'HH', age: 10, emp_no: 10, 姓名: '陈浩10' },
];

class VirTable1 extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      rsState: {
        rowNumColumnWidth: 50,
        columnWidth: 150,
        overscanColumnCount: 5,
        overscanRowCount: 5,
        rowHeight: 28,
        width: 200,
        height: 200,
      },
      columns: [
        { name: 'id', width: 75, left: 0 },
        { name: 'name', width: 100, left: 75 },
        { name: 'age', width: 125, left: 175 },
        { name: 'emp_no', width: 150, left: 300 },
        { name: '姓名', width: 175, left: 450 },
      ],
    };

    this._renderHeaderCell_V2 = this._renderHeaderCell_V2.bind(this);
    this._renderBodyCell = this._renderBodyCell.bind(this);
    this.getColumnWidth = this.getColumnWidth.bind(this);
  }

  componentDidMount() {
    // 计算列平均宽度
    let totalWidth = 0;
    const { rsState, columns } = this.state;
    columns.map((column) => {
      const { width } = column;
      totalWidth += width;
    });
    const avgLength = totalWidth / columns.length;
    this.setState({ rsState: { ...rsState, columnWidth: avgLength } });
  }

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

    let newColumns = [];
    let totalLeft = 0;

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
          grid={[25]}
          defaultClassName="virtualized-DragHandle"
          defaultClassNameDragging="virtualized-DragHandleActive"
          onDrag={(event, { deltaX }) =>
            this.resizeRow({
              columnIndex,
              deltaX,
            })
          }
          position={{ x: 0 }}
          zIndex={999}
        >
          <span className="virtualized-DragHandleIcon">⋮</span>
        </Draggable>
      </div>
    );
  };

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
        <span className="virtualized-span-cell" title={rows[rowIndex][name]}>
          {rows[rowIndex][name]}
        </span>
      </div>
    );
  };

  getColumnWidth = ({ index }) => {
    const { columns } = this.state;
    const { width } = columns[index];

    return width;
  };

  render() {
    const { rsState, columns } = this.state;

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
                    height={rsState.height}
                    rowHeight={rsState.rowHeight}
                    rowCount={rows.length}
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
                              width: 200,
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
                              width={rsState.width}
                            />
                          </div>
                          <div
                            style={{
                              position: 'absolute',
                              left: rsState.rowNumColumnWidth,
                              top: rsState.rowHeight,
                              height: rsState.height,
                              width: rsState.width,
                            }}
                          >
                            <Grid
                              className="virtualized-BodyGrid"
                              scrollToRow={undefined}
                              columnWidth={rsState.columnWidth}
                              columnCount={columns.length}
                              height={rsState.height}
                              onScroll={onScroll}
                              overscanColumnCount={rsState.overscanColumnCount}
                              overscanRowCount={rsState.overscanRowCount}
                              cellRenderer={this._renderBodyCell}
                              rowHeight={rsState.rowHeight}
                              rowCount={rows.length}
                              width={rsState.width}
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
  }
}

export default VirTable1;
