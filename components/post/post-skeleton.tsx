import { Fragment } from "react"
import { Skeleton } from "../ui/skeleton"

const PostSkeleton = () => {
    return (
        [1, 2, 3].map((i) => {
            return (
                <Fragment key={i}>
                    <Skeleton className="w-[500px] h-[150px] rounded-lg border bg-card text-card-foreground shadow-sm p-3">
                        <div className="font-semibold tracking-tight text-lg">
                            <Skeleton className="w-[380px] h-[30px]" />
                        </div>
                        <br />
                        <div className="font-semibold tracking-tight text-lg">
                            <Skeleton className="w-[380px] h-[70px]" />
                        </div>
                    </Skeleton>
                    <br />
                </Fragment>
            )
        })
    )
}

export default PostSkeleton;