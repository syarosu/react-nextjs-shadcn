import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Comment } from "@/model/post";

type PostCommentsProps = {
    postComment: Comment
}

const PostComments = ({ postComment }: PostCommentsProps) => {
    return (
        <>
            <Card className="w-[500px]">
                <CardHeader className="flex p-3">
                    <CardTitle className="text-lg">{postComment?.name}</CardTitle>
                    <CardDescription className="text-right">{postComment?.email}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div>{postComment.body}</div>
                </CardContent>
            </Card >
            <br />
        </>
    );
}

export default PostComments;