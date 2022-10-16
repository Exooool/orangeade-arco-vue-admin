import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const BLOG: AppRouteRecordRaw = {
  path: '/blog',
  name: 'blog',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.blog',
    requiresAuth: true,
    icon: 'icon-common',
    order: 1,
  },
  children: [
    {
      path: 'list',
      name: 'list',
      component: () => import('@/views/blog/index.vue'),
      meta: {
        locale: 'menu.blog.list',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'edit/:id',
      name: 'edit',
      component: () => import('@/views/blog/edit.vue'),
      meta: {
        locale: 'menu.blog.edit',
        requiresAuth: true,
        roles: ['*'],
        hideInMenu: true,
      },
    },
  ],
};

export default BLOG;
