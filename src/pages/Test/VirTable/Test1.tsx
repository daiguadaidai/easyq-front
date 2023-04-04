import { Card } from 'antd';
// @ts-ignore
import { Grid, ScrollSync, AutoSizer } from 'react-virtualized';
import { useState } from 'react';
import Draggable from 'react-draggable';

import 'react-virtualized/styles.css';
import './index.less';

type Column = {
  name: string;
  width: number;
};

type VirTableState = {
  rowNumColumnWidth: 75; // 序号行列大小
  columnWidth: number; // 每个字段初始宽度
  columnCount: number;
  overscanColumnCount: number;
  overscanRowCount: number;
  rowHeight: number;
  rowCount: number;
  tabPanalHeaderHeight: number;
  headerColumnWidthChangeCnt: number; // 列宽度改变次数
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

function Test1() {
  const [rsState, setRsState] = useState<VirTableState>({
    rowNumColumnWidth: 75,
    columnWidth: 75,
    columnCount: 50,
    overscanColumnCount: 0,
    overscanRowCount: 5,
    rowHeight: 40,
    rowCount: 100,
    tabPanalHeaderHeight: 32,
    headerColumnWidthChangeCnt: 0,
  });

  const [columns, setColumns] = useState<Column[]>([
    { name: 'id', width: 75 },
    { name: 'name', width: 100 },
    { name: 'age', width: 125 },
    { name: 'emp_no', width: 150 },
    { name: '姓名', width: 175 },
  ]);

  // @ts-ignore
  const _renderLeftHeaderCell = ({ key, style }) => {
    return (
      <div className="virtualized-headerCell" key={key} style={style}>
        #
      </div>
    );
  };

  // @ts-ignore
  const _renderLeftSideCell = ({ rowIndex, key, style }) => {
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
  const _renderHeaderCell = ({ columnIndex, key, style }) => {
    const column = columns[columnIndex];

    return (
      <div className="virtualized-headerCell" key={key} style={style}>
        {`${column.name}`}
      </div>
    );
  };

  // @ts-ignore
  const resizeRow = ({ columnIndex, deltaX }) => {
    const { name, width } = columns[columnIndex];

    if (deltaX === 0) {
      return;
    }

    let newWidth = width + deltaX;
    if (newWidth < 5) {
      newWidth = 5;
    }
    const newColumns = [...columns];
    newColumns[columnIndex].width = newWidth;

    console.log(
      'columnName: ',
      name,
      'width: ',
      width,
      'newWidth:',
      newWidth,
      'deltaX: ',
      deltaX,
      'changeCnt:',
      rsState.headerColumnWidthChangeCnt,
    );
    setColumns(newColumns);
    setRsState({
      ...rsState,
      headerColumnWidthChangeCnt: rsState.headerColumnWidthChangeCnt + 1,
    });
  };

  // @ts-ignore
  const _renderHeaderCell_V2 = ({ columnIndex, key, style }) => {
    const { name, width } = columns[columnIndex];
    console.log('_renderHeaderCell_V2: ', width);
    return (
      <div className="virtualized-headerCell" key={key} style={{ ...style, width }}>
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
            resizeRow({
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

  // @ts-ignore
  const _renderBodyCell = ({ columnIndex, key, rowIndex, style }) => {
    let backgroundColorClassName;
    if (rowIndex % 2 === 0) {
      backgroundColorClassName = 'virtualized-evenRow';
    } else {
      backgroundColorClassName = 'virtualized-oddRow';
    }

    const { name, width } = columns[columnIndex];

    return (
      <div
        className={`virtualized-cell ${backgroundColorClassName}`}
        key={key}
        style={{ ...style, width }}
        easydb-result-cell-div={key}
      >
        <span className="virtualized-span-cell" title={rows[rowIndex][name]}>
          {rows[rowIndex][name]}
        </span>
      </div>
    );
  };

  // @ts-ignore
  const getHeaderColumnWidth = ({ index }) => {
    const { name, width } = columns[index];
    console.log('getHeaderColumnWidth: ', name, width);
    return width;
  };

  const getBodyWidth = () => {
    if (rsState.headerColumnWidthChangeCnt % 2 == 0) {
      return 200;
    } else {
      return 199;
    }
  };

  return (
    <Card style={{ height: '400px' }}>
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
                  cellRenderer={_renderLeftHeaderCell}
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
                  cellRenderer={_renderLeftSideCell}
                  columnWidth={rsState.rowNumColumnWidth}
                  columnCount={1}
                  width={rsState.rowNumColumnWidth}
                  height={200}
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
                            columnWidth={getHeaderColumnWidth}
                            columnCount={columns.length}
                            height={rsState.rowHeight}
                            overscanColumnCount={rsState.overscanColumnCount}
                            cellRenderer={_renderHeaderCell_V2}
                            rowHeight={rsState.rowHeight}
                            rowCount={1}
                            scrollLeft={scrollLeft}
                            width={getBodyWidth()}
                          />
                        </div>
                        <div
                          style={{
                            position: 'absolute',
                            left: rsState.rowNumColumnWidth,
                            top: rsState.rowHeight,
                            height: 200,
                            width: 200,
                          }}
                        >
                          <Grid
                            className="virtualized-BodyGrid"
                            scrollToRow={undefined}
                            columnWidth={getHeaderColumnWidth}
                            columnCount={columns.length}
                            height={200}
                            onScroll={onScroll}
                            overscanColumnCount={rsState.overscanColumnCount}
                            overscanRowCount={rsState.overscanRowCount}
                            cellRenderer={_renderBodyCell}
                            rowHeight={rsState.rowHeight}
                            rowCount={rows.length}
                            width={getBodyWidth()}
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
    </Card>
  );
}

export default Test1;
