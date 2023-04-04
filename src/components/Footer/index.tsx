import { GitlabOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import { useIntl } from 'umi';

const Footer: React.FC = () => {
  const intl = useIntl();
  const defaultMessage = intl.formatMessage({
    id: 'app.copyright.produced',
    defaultMessage: '永辉超市DBA团队出品',
  });

  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'EasyQ',
          title: 'EasyQ',
          href: 'http://easyq.yonghuivip.com',
          blankTarget: true,
        },
        {
          key: 'gitlab',
          title: <GitlabOutlined />,
          href: 'http://gitlab.yonghui.cn/operation-cp-dba/easyq-front',
          blankTarget: true,
        },
        {
          key: 'Yong Hui',
          title: 'Yong Hui',
          href: 'http://easyq.yonghuivip.com',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
