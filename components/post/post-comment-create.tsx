import { ChangeEvent, useEffect, useState } from "react";

import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useCreatePostComment } from "@/service/post/usePostService"
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/service/post/queries"


const PostCommentCreate = ({ postId }: { postId: number }) => {
    const queryClient = useQueryClient();
    const [commentValue, setCommentValue] = useState<string>("");

    const { mutate: registComment } = useCreatePostComment();

    const handleComment = async () => {
        const value = commentValue.trim();
        if ("" === value) {
            return;
        }
        
        const postBody = {
            postId: postId,
            body: value
        }

        registComment(postBody, {
            onError: (err) => {
                console.debug(err);
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: queryKeys.detailComments(String(postId)) });
                queryClient.invalidateQueries({ queryKey: queryKeys.all });
                setCommentValue("");
            },
        });
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === ' ') {
            event.preventDefault();
        }
    };

    return (
        <>
            <div className="w-[700px] flex">
                <Input
                    className="w-[400px]"
                    type="text"
                    placeholder="Comment"
                    value={commentValue}
                    onChange={(e) => setCommentValue(e.target.value)}
                />
                <Button onClick={handleComment}>Comment</Button>
            </div>

        </>
    )
}

export default PostCommentCreate;