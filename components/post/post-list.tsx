"use client";

import DataTable from "@/components/ui/data-table";
import DataTablePagination from "@/components/ui/data-table-pagination";
import type { Post, Comment } from "@/model/post";

import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { usePosts, usePostComments } from '@/service/post/usePostService';
import { RankingInfo, rankItem } from '@tanstack/match-sorter-utils';

import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    getFacetedUniqueValues,
    getFacetedRowModel,
    FilterFn,
    createColumnHelper
} from "@tanstack/react-table";
import PostDetail from "./post-detail";
import { ScrollArea } from "../ui/scroll-area";
import PostComments from "./post-comments";
import PostSkeleton from "./post-skeleton";

import PostCommentCreate from "./post-comment-create";
import DataTableSearch from "../ui/data-table-search";
import PostCreate from "./post-create";

const columnHelper = createColumnHelper<Post>();

declare module '@tanstack/react-table' {
    //add fuzzy filter to the filterFns
    interface FilterFns {
        fuzzy: FilterFn<unknown>
    }
    interface FilterMeta {
        itemRank: RankingInfo
    }
}

const getTitleValue = (post: Post): string => {

    if (!post) return "";

    if (!post.hasOwnProperty("commentCount")) {
        return post.title ?? "";
    }


    return post.title ?? "";
}

const PostList = () => {

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [postDetail, setPostDetail] = useState<Post>();

    const { data: posts } = usePosts({ staleTime: 0 });
    const { data: postComments, isFetching } = usePostComments(String(postDetail?.id), { enabled: !!postDetail?.id, staleTime: 0 });
    const [tests, setTests] = useState<Post[]>([]);


    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [globalFilter, setGlobalFilter] = useState("");

    let copiedPostComments = postComments ?? [];

    // solution: https://github.com/TanStack/table/issues/4241
    const columns: ColumnDef<Post, any>[] = [
        columnHelper.accessor<"id", number>("id", {
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    No.
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => <div>{row.getValue("id")}</div>,
            filterFn: "arrIncludesSome"
        }),
        columnHelper.accessor<"title", string>("title", {
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Title
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>

            ),
            cell: ({ row }) => <div>{row.getValue("title")}</div>,
            filterFn: "arrIncludesSome"
        })
    ];

    const fuzzyFilter: FilterFn<unknown> = (row, columnId, value, addMeta) => {
        // Rank the item    
        const itemRank = rankItem(row.getValue(columnId), value)

        // Store the itemRank info
        addMeta({
            itemRank,
        });

        // Return if the item should be filtered in/out
        return itemRank.passed;
    }

    const table = useReactTable({
        data: tests ?? [],
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        filterFns: {
            fuzzy: fuzzyFilter, //define as a filter function that can be used in column definitions
        },
        globalFilterFn: 'fuzzy',
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter
        },

        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    });

    useEffect(() => {
        if (!posts) return;
        setTests(posts?.map((post, index) => {
            return {
                ...post,
                title: `${getTitleValue(post)}`,
                index: index + 1
            }
        }));
    }, [posts])

    return (
        <>

            <div className="w-[1280px] h-[700px] px-8 pb-8 flex-col justify-start items-start gap-2.5 flex">
                <div className="flex">
                    <DataTableSearch table={table} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
                    <PostCreate />
                </div>
                <DataTable table={table} columns={columns} setPostDetail={setPostDetail} setIsOpen={setIsOpen} />
                <DataTablePagination table={table} />
            </div>
            {
                isOpen && <PostDetail isOpen={isOpen} postDetail={postDetail} setIsOpen={setIsOpen}>
                    <PostCommentCreate postId={postDetail?.id ?? 0} />
                    <ScrollArea className="h-[700px]">
                        <div className="p-4">
                            {
                                copiedPostComments && copiedPostComments.map((comment: Comment) => {
                                    return (
                                        <PostComments
                                            key={`${comment?.id}-${comment.postId}`}
                                            postComment={comment}
                                        />
                                    )
                                })
                            }
                        </div>
                        {isFetching && <PostSkeleton />}
                    </ScrollArea>
                </PostDetail>
            }
        </>
    )
}

export default PostList;