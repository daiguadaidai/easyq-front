import { Settings as LayoutSettings } from '@ant-design/pro-components';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'dark',
  // 拂晓蓝
  primaryColor: '#1890ff',
  layout: 'top',
  contentWidth: 'Fluid',
  fixedHeader: true,
  fixSiderbar: true,
  colorWeak: false,
  title: 'EasyQ',
  pwa: false,
  logo: '/logo.svg',
  iconfontUrl: '',
};

export default Settings;