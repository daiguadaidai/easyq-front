import { Card } from 'antd';
import React from 'react';

import { Table } from 'rsuite';
import { mockUsers } from '@/pages/Test/mock';
import 'rsuite/dist/rsuite.css';
import CtxMenu from '@/pages/Test/VirTable3/ctxMenu';

const { Column, HeaderCell, Cell } = Table;
const data = mockUsers(1000);

const calcColumns = (columnNames: any, tableWidth: number) => {
  const columns = [];
  let width = 150;

  if (columnNames && columnNames.length > 0) {
    if (columnNames.length <= 4) {
      width = tableWidth / columnNames.length;
    }

    for (let i = 0; i < columnNames.length; i++) {
      columns.push({ key: i, label: columnNames[i], width });
    }
  }

  return columns;
};

const columnNames = ['id', 'firstName', 'lastName', 'gender', 'age', 'city', 'email'];
const columns = calcColumns(columnNames, 600);

class Index extends React.PureComponent<any, any> {
  private ctxMenuRef: any;

  constructor(props: any) {
    super(props);

    this.onCellContextMenu = this.onCellContextMenu.bind(this);
  }

  ctxMenu = (ref: any) => {
    this.ctxMenuRef = ref;
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

  render() {
    return (
      <Card style={{ height: 400, width: 600 }}>
        <Table
          data={data}
          virtualized
          height={360}
          headerHeight={26}
          rowHeight={26}
          bordered={true}
          cellBordered={true}
        >
          {columns.map((column) => {
            const { key, label, width } = column;

            return (
              <Column key={key} width={width} resizable>
                <HeaderCell style={{ padding: 4, fontSize: 10, fontWeight: 'bold' }}>
                  {label}
                </HeaderCell>
                <Cell
                  onContextMenu={(e) => {
                    this.onCellContextMenu(e, { key, label, cellData: data[key][label] });
                  }}
                  dataKey={label}
                  style={{ padding: 4, fontSize: 10 }}
                />
              </Column>
            );
          })}
        </Table>
        <CtxMenu onRef={this.ctxMenu} />
      </Card>
    );
  }
}

export default Index;
