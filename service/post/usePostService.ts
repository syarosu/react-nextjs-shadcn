import { useQuery, useMutation } from '@tanstack/react-query';
import queryOptions from '@/service/post/queries';
import { Post, Comment } from '@/model/post';
import PostService from './PostService';

export function usePosts(options: {} = {}) {
    return useQuery(queryOptions.all(options));
}

export function usePostDetail(postId: string, options: {} = {}) {
    return useQuery(queryOptions.detail(postId, options));
}

export function usePostComments(postId: string, options: {} = {}) {
    return useQuery(queryOptions.detailComments(postId, options));
}

export function useCreatePost() {
    return useMutation({ mutationFn: (post: Post) => PostService.createPost(post) });
}

export function useUpdatePost() {
    return useMutation({ mutationFn: (post: Post) => PostService.updatePost(post) });
}

export function useDeletePost() {
    return useMutation({ mutationFn: (postId: string) => PostService.deletePost(postId) });
}

export function useCreatePostComment() {
    return useMutation({ mutationFn: (comment: Comment) => PostService.createComment(comment) });
}

