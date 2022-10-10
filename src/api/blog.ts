import axios from 'axios';

// 获取文章
export function getArticles(params: { pageIndex: number; pageSize: number }) {
  return axios.get('/api/article/getPageList', {
    params,
  });
}

// 获取指定id文章
export function getArticleById(id: number) {
  return axios.get('/api/article/getArticleById', {
    params: {
      id,
    },
  });
}
// 获取分类
export function getCatalogs() {
  return axios.get('/api/article/getCatalogList');
}
// 获取标签
export function getTags() {
  return axios.get('/api/article/getTagList');
}
