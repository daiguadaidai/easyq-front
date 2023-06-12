/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
import { UserRole, Env } from '@/services/swagger/enum';

export default function access(initialState: { currentUser?: API.User | undefined }) {
  const { currentUser } = initialState || {};

  return {
    canDBA: currentUser && currentUser.role === UserRole.DBA,
    canDev: REACT_APP_ENV && REACT_APP_ENV === Env.Dev,
    canDBAOrDev:
      (currentUser && currentUser.role === UserRole.DBA) ||
      (REACT_APP_ENV && REACT_APP_ENV === Env.Dev),
  };
}
