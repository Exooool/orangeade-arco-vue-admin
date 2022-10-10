import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const TOOLS: AppRouteRecordRaw = {
  path: '/tools',
  name: 'tools',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.tools',
    requiresAuth: true,
    icon: 'icon-tool',
    order: 1,
  },
  children: [
    {
      path: 'excel',
      name: 'excel',
      component: () => import('@/views/tools/excel/index.vue'),
      meta: {
        locale: 'menu.tools.excel',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'accountBook',
      name: 'accountBook',
      component: () => import('@/views/tools/accountBook/index.vue'),
      meta: {
        locale: 'menu.tools.accountBook',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default TOOLS;
