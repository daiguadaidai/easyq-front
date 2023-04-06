import React from 'react';

import { Col, Row } from 'antd';
import { Table } from 'rsuite';
import 'rsuite/dist/rsuite.css';
import ResultTableCtxMenu from '@/pages/Query/DBResult/ResultTable2/resultTableCtxMenu';
import PropTypes from 'prop-types';

const { Column, HeaderCell, Cell } = Table;

class ResultTable2 extends React.PureComponent<any, any> {
  static propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    columnNames: PropTypes.array,
    rows: PropTypes.array,
    sql: PropTypes.string,
  };

  private ctxMenuRef: any;

  constructor(props: any) {
    super(props);

    this.state = {
      columns: this.calcColumns(props.columnNames, props.width),
    };

    this.onCellContextMenu = this.onCellContextMenu.bind(this);
  }

  ctxMenu = (ref: any) => {
    this.ctxMenuRef = ref;
  };

  calcColumns = (columnNames: any, tableWidth: number) => {
    const columns = [];
    let width = 150;

    if (columnNames && columnNames.length > 0) {
      if (width * columnNames.length < tableWidth) {
        width = tableWidth / columnNames.length;
      }

      for (let i = 0; i < columnNames.length; i++) {
        columns.push({ key: i, label: columnNames[i], width });
      }
    }

    return columns;
  };

  onCellContextMenu = (event: React.MouseEvent<HTMLElement>, cellInfo: any) => {
    event.preventDefault();

    // 点击事件发生时打开右键菜单
    const { pageX, pageY } = event;
    const { key, label, cellData } = cellInfo;

    console.log(`onContextMenu: rowIndex: ${key}, label: ${label}, data: ${cellData}`);

    const ctxStyle = {
      top: pageY,
      left: pageX,
      display: undefined,
    };

    this.ctxMenuRef.showCtx(ctxStyle);
  };

  onFooterDoubleClick = (event: React.MouseEvent<HTMLElement>) => {
    console.log(event);
  };

  render() {
    return (
      <>
        <Table
          data={this.props.rows}
          virtualized
          height={this.props.height - 24}
          width={this.props.width}
          headerHeight={26}
          rowHeight={26}
          bordered={true}
          cellBordered={true}
        >
          {this.state.columns.map((column: any) => {
            const { key, label, width } = column;

            return (
              <Column key={key} width={width} resizable>
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
                <Cell
                  onContextMenu={(e) => {
                    this.onCellContextMenu(e, {
                      key,
                      label,
                      cellData: this.props.data[key][label],
                    });
                  }}
                  dataKey={label}
                  style={{ padding: 4, fontSize: 10 }}
                />
              </Column>
            );
          })}
        </Table>
        <Row>
          <Col span={12} className="result-table-footer-col-left">
            <span onDoubleClick={this.onFooterDoubleClick}>{this.props.sql}</span>
          </Col>
          <Col span={12} className="result-table-footer-col-right">
            总行数: {this.props.rows.length}
          </Col>
        </Row>
        <ResultTableCtxMenu onRef={this.ctxMenu} />
      </>
    );
  }
}

export default ResultTable2;
