import axios from 'axios';

// 获取文章
export function getArticles(params: { pageIndex: number; pageSize: number }) {
  return axios.get('/api/article/getArticleList', {
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

// 上传文章
export function pushArticle(data: {
  title: string;
  user_id: number;
  catalog: number | string;
  tag: string;
  content: string;
}) {
  return axios.post('/api/article/pushArticle', data);
}

// 更新文章
export function updateArticle(data: {
  title: string;
  article_id: number;
  catalog: number | string;
  tag: string;
  content: string;
}) {
  return axios.post('/api/article/updateArticleById', data);
}

// 批量删除删除文章
export function delArticle(ids: number[]) {
  return axios.get('/api/article/delArticleByIds', {
    params: {
      ids: JSON.stringify(ids),
    },
  });
}
