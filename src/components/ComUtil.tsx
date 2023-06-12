import { applyStatus, applyStatusMap } from '@/services/swagger/enum';
import { Select, Tag } from 'antd';

export function getApplyStatusTag(status: number) {
  let color = '';

  if (status == applyStatus.Unknow) {
    color = '#faad14';
  } else if (status == applyStatus.Applying) {
    color = '#1677FF';
  } else if (status == applyStatus.Success) {
    color = '#87d068';
  } else if (status == applyStatus.Fail) {
    color = '#ff4d4f';
  } else {
    return <></>;
  }

  return <Tag color={color}>{applyStatusMap.get(status)}</Tag>;
}

export function getApplyStatusOptions() {
  const eles: any[] = [];
  applyStatusMap.forEach((value, key) =>
    eles.push(
      <Select.Option value={key} key={key}>
        {value}
      </Select.Option>,
    ),
  );
  return eles;
}
