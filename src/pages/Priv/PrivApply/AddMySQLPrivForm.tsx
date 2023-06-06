import { Col, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { getClusterNameSelectOption } from '@/utils/stringUtils';
import { clusterCategoryMap } from '@/services/swagger/enum';
import { allCluster } from '@/services/swagger/meta_cluster';
import StandardFormRow from '@/components/StandardFormRow';

const AddMySQLPrivForm = () => {
  const [metaClusters, setMetaClusters] = useState<CAPI.MetaCluster[]>();

  useEffect(() => {
    // 获取所有集群信息
    (async function getAllCluster() {
      const rs = await allCluster();
      if (rs && rs.success) {
        setMetaClusters(rs.data?.list);
      }
    })();
  }, []);

  const onChangeCluster = async (value: any) => {
    console.log(value);
    // 重置数据库列表
    // 获取集群对应的所有数据库
  };

  return (
    <>
      <Row>
        <Col span={24}>
          <StandardFormRow title="集群" block style={{ paddingBottom: 11 }}>
            <Select
              placeholder="请选择所属集群: 集群名 | 地址 | 集群id | set | 类别"
              showSearch
              filterOption={(input: string, option: any) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              filterSort={(optionA: any, optionB: any) =>
                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
              }
              onChange={onChangeCluster}
              style={{ width: '100%', fontSize: 11 }}
            >
              {metaClusters?.map((cluster) => (
                <Select.Option key={cluster.id} value={cluster.id} style={{ fontSize: 11 }}>
                  {getClusterNameSelectOption(
                    cluster.name,
                    cluster.vip_port,
                    cluster.cluster_id,
                    cluster.set_name,
                    clusterCategoryMap.get(cluster.category),
                  )}
                </Select.Option>
              ))}
            </Select>
          </StandardFormRow>
        </Col>
      </Row>
    </>
  );
};

export default AddMySQLPrivForm;
