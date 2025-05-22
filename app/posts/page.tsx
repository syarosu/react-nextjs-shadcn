import PostList from "@/components/post/post-list";
import queryOptions from "@/service/post/queries";
import { getDehydratedQuery, Hydrate } from "@/utils/react-query";

const Posts = async () => {
    const { queryKey, queryFn } = queryOptions.all();
    const query = await getDehydratedQuery({ queryKey, queryFn });
    
    return (        
        <>
            <Hydrate state={{ queries: [query] }}>
                <PostList />
            </Hydrate>
        </>
    )
}

export default Posts;