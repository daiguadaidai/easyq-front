import { Card } from 'antd';
import React from 'react';

import { Table } from 'rsuite';
import { mockUsers } from './mock';
import 'rsuite/dist/rsuite.css';

const { Column, HeaderCell, Cell } = Table;
const data = mockUsers(1000);

class Index extends React.PureComponent {
  render() {
    return (
      <Card style={{ height: 400, width: 600 }}>
        <Table virtualized data={data}>
          <Column width={70} align="center" fixed resizable>
            <HeaderCell>Id</HeaderCell>
            <Cell dataKey="id" />
          </Column>

          <Column width={130}>
            <HeaderCell>First Name</HeaderCell>
            <Cell dataKey="firstName" />
          </Column>

          <Column width={130}>
            <HeaderCell>Last Name</HeaderCell>
            <Cell dataKey="lastName" />
          </Column>

          <Column width={100}>
            <HeaderCell>Gender</HeaderCell>
            <Cell dataKey="gender" />
          </Column>

          <Column width={100}>
            <HeaderCell>Age</HeaderCell>
            <Cell dataKey="age" />
          </Column>

          <Column width={200}>
            <HeaderCell>City</HeaderCell>
            <Cell dataKey="city" />
          </Column>

          <Column width={200}>
            <HeaderCell>Email</HeaderCell>
            <Cell dataKey="email" />
          </Column>
        </Table>
      </Card>
    );
  }
}

export default Index;
