import React, { createRef } from 'react';

import { Col, Row } from 'antd';
import { Table } from 'rsuite';
import 'rsuite/dist/rsuite.css';
import ResultTableCtxMenu from '@/pages/Query/DBResult/ResultTable2/resultTableCtxMenu';
import PropTypes from 'prop-types';
import StoreResultTable from '@/pages/Query/DBResult/ResultTable2/StoreResultTable';
import { DownloadExcelRows, DownLoadInsertSqlRows } from '@/components/ComUtil';

const { Column, HeaderCell, Cell } = Table;
const CustomCell = ({ rowData, dataKey, onContextMenu, ...props }: any) => (
  <Cell
    {...props}
    dataKey={dataKey}
    onContextMenu={(e) =>
      onContextMenu(e, {
        columnName: dataKey,
        row: rowData,
      })
    }
  >
    {rowData[dataKey]}
  </Cell>
);

class ResultTable2 extends React.PureComponent<any, any> {
  private tableRef: any;
  private ctxMenuRef: any;
  private storeResultTableRef: any;

  static propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    currKey: PropTypes.string,
    columnNames: PropTypes.array,
    columns: PropTypes.array,
    rows: PropTypes.array,
    query: PropTypes.string,
    execSql: PropTypes.string,
    isErr: PropTypes.bool,
    errMsg: PropTypes.string,
    loading: PropTypes.bool,
    scrollTop: PropTypes.number,
    version: PropTypes.number,
    setResultTabValues: PropTypes.func,
  };

  constructor(props: any) {
    super(props);

    this.state = {};

    this.tableRef = createRef();
    this.onCellContextMenu = this.onCellContextMenu.bind(this);
    this.handleOnScroll = this.handleOnScroll.bind(this);
    this.handleColumnResize = this.handleColumnResize.bind(this);
    this.getTableCom = this.getTableCom.bind(this);
    this.downloadExcelRows = this.downloadExcelRows.bind(this);
    this.downloadExcelCurrRow = this.downloadExcelCurrRow.bind(this);
    this.downLoadInsertSqlRows = this.downLoadInsertSqlRows.bind(this);
    this.downLoadInsertSqlCurrRow = this.downLoadInsertSqlCurrRow.bind(this);
  }

  componentDidMount = () => {
    if (this.props.scrollTop !== 0) {
      this.tableRef.current.scrollTop(this.props.scrollTop);
    }
  };

  ctxMenu = (ref: any) => {
    this.ctxMenuRef = ref;
  };

  onStoreResultTableRef = (ref: any) => {
    this.storeResultTableRef = ref;
  };

  onCellContextMenu = (event: React.MouseEvent<HTMLElement>, cellInfo: any) => {
    event.preventDefault();

    // 点击事件发生时打开右键菜单
    const { pageX, pageY } = event;
    const { row } = cellInfo;

    const ctxStyle = {
      top: pageY,
      left: pageX,
      display: undefined,
    };

    const data = {
      row,
    };

    this.ctxMenuRef.showCtx(ctxStyle, { data });
  };

  onFooterDoubleClick = (event: React.MouseEvent<HTMLElement>) => {
    console.log(event);
  };

  handleOnScroll = (scrollX: number, scrollY: number) => {
    this.storeResultTableRef.virStoreState({ scrollTop: scrollY });
  };

  handleColumnResize = (columnWidth?: any, dataKey?: string) => {
    this.storeResultTableRef.virStoreColumnWidth(dataKey, columnWidth);
  };

  // 下载excel所有数据
  downloadExcelRows = () => {
    DownloadExcelRows(this.props.rows, this.props.columnNames);
  };

  // 下载 excel 当前行
  downloadExcelCurrRow = (row: any) => {
    DownloadExcelRows([row], this.props.columnNames);
  };

  downLoadInsertSqlRows = (table_name: string) => {
    DownLoadInsertSqlRows(table_name, this.props.columnNames, this.props.rows);
  };

  downLoadInsertSqlCurrRow = (table_name: string, row: any) => {
    DownLoadInsertSqlRows(table_name, this.props.columnNames, [row]);
  };

  getTableCom = () => {
    if (this.props.isErr) {
      return (
        <pre
          className="err-pre"
          style={{ height: this.props.height - 34, width: this.props.width }}
        >
          {this.props.errMsg}
        </pre>
      );
    } else {
      // 没有错误返回表格
      return (
        <Table
          ref={this.tableRef}
          loading={this.props.loading}
          data={this.props.rows}
          virtualized
          height={this.props.height - 24}
          width={this.props.width}
          headerHeight={26}
          rowHeight={26}
          bordered={true}
          cellBordered={true}
          onScroll={this.handleOnScroll}
        >
          {this.props.columns.map((column: any) => {
            const { key, label, width } = column;

            return (
              <Column key={key} width={width} onResize={this.handleColumnResize} resizable>
                <HeaderCell
                  style={{
                    padding: 4,
                    fontSize: 10,
                    fontWeight: 'bold',
                    backgroundColor: '#E7E6E6',
                  }}
                >
                  {label}
                </HeaderCell>
                <CustomCell dataKey={label} onContextMenu={this.onCellContextMenu} />
              </Column>
            );
          })}
        </Table>
      );
    }
  };

  render() {
    return (
      <>
        {this.getTableCom()}
        <Row>
          <Col span={12} className="result-table-footer-col-left">
            <span onDoubleClick={this.onFooterDoubleClick}>{this.props.query}</span>
          </Col>
          <Col span={12} className="result-table-footer-col-right">
            总行数: {this.props.rows.length}
          </Col>
        </Row>
        <ResultTableCtxMenu
          onRef={this.ctxMenu}
          downloadExcelRows={this.downloadExcelRows}
          downloadExcelCurrRow={this.downloadExcelCurrRow}
          downLoadInsertSqlRows={this.downLoadInsertSqlRows}
          downLoadInsertSqlCurrRow={this.downLoadInsertSqlCurrRow}
          columns={this.props.columns}
          rows={this.props.rows}
        />
        <StoreResultTable
          columns={this.props.columns}
          onRef={this.onStoreResultTableRef}
          currKey={this.props.currKey}
          scrollTop={this.props.scrollTop}
          setResultTabValues={this.props.setResultTabValues}
          version={this.props.version}
        />
      </>
    );
  }
}

export default ResultTable2;
