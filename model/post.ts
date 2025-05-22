export interface Post {
    title: string,
    body: string,
    userId: number
    id?: number,
}

export interface PostDetail {
    title: string,
    body: string,
    id: number,
}

export interface Comment extends PostCommon {
    name?: string,
    body: Post['body'],
    email?: string
}

interface PostCommon {
    id?: number,
    postId: number,
}