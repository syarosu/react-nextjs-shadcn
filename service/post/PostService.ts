import { http } from '@/service/Service';
import type { Post, PostDetail, Comment } from '@/model/post';

const getPosts = (): Promise<Post[]> => {
    return http.get<Post[]>('/api/posts');
};

const getPost = (postId: string): Promise<Post> => {
    return http.get<Post>(`/api/posts/${postId}`);
};

const getComments = (): Promise<Comment[]> => {
    return http.get<Comment[]>('/api/comments');
};

const getPostComments = async (postId: string): Promise<Comment[]> => {
    
    return http.get<Comment[]>(`/api/comments?postId=${postId}`);
};

const createPost = (post: Post): Promise<Post> => {
    return http.post<Post>('/api/posts', post);
};

const updatePost = (post: Post): Promise<Post> => {
    return http.put<Post>(`/api/posts/${post.id}`, post);
};

const deletePost = (postId: string): Promise<Post> => {
    return http.delete<Post>(`/api/posts/${postId}`);
};

const createComment = (comment: Comment): Promise<Comment> => {
    return http.post<Comment>('/api/comments', comment);
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    getPosts,
    getPost,
    getComments,
    getPostComments,
    createPost,
    updatePost,
    deletePost,
    createComment
};