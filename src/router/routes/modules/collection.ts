import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const COLLECTION: AppRouteRecordRaw = {
  path: '/collection',
  name: 'collection',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.collection',
    requiresAuth: true,
    icon: 'icon-archive',
    order: 1,
  },
  children: [
    {
      path: 'index',
      name: 'index',
      component: () => import('@/views/collection/index.vue'),
      meta: {
        locale: 'menu.collection.index',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default COLLECTION;
