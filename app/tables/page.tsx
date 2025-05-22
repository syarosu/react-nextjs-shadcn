"use client";

import React, { useState, useRef } from "react"

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";

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
    createColumnHelper,
    Table
} from "@tanstack/react-table";

import {
    RankingInfo,
    rankItem,
} from '@tanstack/match-sorter-utils';

import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

declare module '@tanstack/react-table' {
    //add fuzzy filter to the filterFns
    interface FilterFns {
        fuzzy: FilterFn<unknown>
    }
    interface FilterMeta {
        itemRank: RankingInfo
    }
}

const fuzzyFilter: FilterFn<unknown> = (row, columnId, value, addMeta) => {
    // Rank the item    
    const itemRank = rankItem(row.getValue(columnId), value)

    // Store the itemRank info
    addMeta({
        itemRank,
    })

    // Return if the item should be filtered in/out
    return itemRank.passed
}

import { ArrowUpDown } from "lucide-react"
import { badgeVariants } from "@/components/ui/badge";

import { Delivery, Status, Type, data } from "@/components/data/tables";

import DataTableFacetedFilter from "@/components/ui/data-table-faceted-filter";
import DataTable from "@/components/ui/data-table";
import DataTablePagination from "@/components/ui/data-table-pagination";
import DataTableSearch from "@/components/ui/data-table-search";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const statuses = [
    {
        value: "partial compleated",
        label: "Partial Compleated",
    },
    {
        value: "cancelled",
        label: "Cancelled",
    },
    {
        value: "pending review",
        label: "Pending Review",
    },
    {
        value: "booked",
        label: "Booked",
    },
    {
        value: "failed",
        label: "Failed",
    },
]

const types = [
    {
        value: "mobile",
        label: "Mobile",
    },
    {
        value: "stationary",
        label: "Stationary",
    },
]


const columnHelper = createColumnHelper<Delivery>();


// solution: https://github.com/TanStack/table/issues/4241
const columns: ColumnDef<Delivery, any>[] = [
    columnHelper.accessor<"id", string>("id", {
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Order Id
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div>{row.getValue("id")}</div>,
        filterFn: "arrIncludesSome"
    }),
    columnHelper.accessor<"status", Status>("status", {
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Status
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div>{row.getValue("status")}</div>,
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
    }),
    columnHelper.accessor<"type", Type>("type", {
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Type
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div>{row.getValue("type")}</div>,
        filterFn: "arrIncludesSome"
    })
];

type DetailType = {
    title: string;
    status: string;
    id: string;
    type: string;
    isOpen: boolean;
}

const Tables = () => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [globalFilter, setGlobalFilter] = useState("");
    const [openDetail, setOpenDetail] = useState<DetailType>({ title: "", status: "", id: "", type: "", isOpen: false });
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(format(new Date(), 'yyyy-MM-dd')),
        to: addDays(format(new Date(), 'yyyy-MM-dd'), 7),
    })
    const [maxWidth, setMaxWidth] = useState(1500);
    const isDragging = useRef(false);

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        isDragging.current = true;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (event: MouseEvent) => {

        if (isDragging.current) {
            const newWidth = event.clientX;
            setMaxWidth(newWidth);
        }
    };

    const handleMouseUp = () => {
        isDragging.current = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };
    const table: Table<Delivery> = useReactTable({
        data: data,
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

    const containerWidth = typeof window !== "undefined" ? window.innerWidth : 1;
    const leftRatio = (maxWidth / containerWidth) * 100;
    const rightRatio = ((containerWidth - maxWidth) / containerWidth) * 100;

    return (
        <>
            <ResizablePanelGroup className="h-[700px]" direction="horizontal">
                <ResizablePanel minSize={50} >
                    <div>
                        <div className="self-stretch h-20 px-8 py-6 flex-col justify-start items-start gap-1.5 flex">
                            <div className="justify-center items-center inline-flex">
                                <div className="text-zinc-950 text-2xl font-semibold font-['Inter'] leading-loose">File Delivery (Express) Orders</div>
                            </div>
                        </div>
                        <div className="h-[700px] px-8 pb-8 flex-col justify-start items-start gap-2.5 flex">

                            <div className="self-stretch justify-between items-center inline-flex">
                                <DataTableSearch table={table} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
                            </div>
                            <div className="self-stretch justify-between items-center inline-flex">
                                <div className="justify-start items-start gap-1.5 inline-flex">
                                    <DataTableFacetedFilter
                                        column={table.getColumn("status")}
                                        title="Status"
                                        options={statuses}
                                    />
                                    <DataTableFacetedFilter
                                        column={table.getColumn("type")}
                                        title="Type"
                                        options={types}
                                    />
                                </div>

                                <div className={cn("grid gap-2")}>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                id="date"
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[300px] justify-start text-left font-normal",
                                                    !date && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {date?.from ? (
                                                    date.to ? (
                                                        <>
                                                            {format(date.from, "LLL dd, y")} -{" "}
                                                            {format(date.to, "LLL dd, y")}
                                                        </>
                                                    ) : (
                                                        format(date.from, "LLL dd, y")
                                                    )
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>

                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                initialFocus
                                                mode="range"
                                                defaultMonth={date?.from}
                                                selected={date}
                                                onSelect={setDate}
                                                numberOfMonths={1}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="justify-start items-center gap-2 flex">
                                    <div className="text-zinc-500 text-xs font-normal font-['Inter'] leading-none">Order Count {table?.getPrePaginationRowModel().rows.length ?? 0}</div>
                                    <Sheet >
                                        <SheetTrigger>Open</SheetTrigger>
                                        <SheetContent
                                            className={`w-full flex`}
                                            style={{ maxWidth: `${rightRatio}%`, minWidth: "5%" }}
                                        >
                                            <div
                                                className="w-[15px] h-full bg-gray-200 flex flex-col"
                                                style={{ cursor: "ew-resize" }}
                                                onMouseDown={handleMouseDown}
                                            />

                                            <SheetHeader className="flex flex-col space-y-2 text-center sm:text-left w-3/4">
                                                <SheetTitle>Are you absolutely sure?</SheetTitle>
                                                <SheetDescription>
                                                    Left Ratio: {leftRatio.toFixed(2)}%
                                                    <br />
                                                    Right Ratio: {rightRatio.toFixed(2)}%
                                                </SheetDescription>
                                            </SheetHeader>
                                        </SheetContent>
                                    </Sheet>
                                </div>
                            </div>
                            <DataTable<Delivery, any> table={table} columns={columns} setPostDetail={setOpenDetail} />
                            <DataTablePagination table={table} />

                        </div>
                    </div >
                </ResizablePanel>
                {
                    openDetail.isOpen &&
                    (
                        <>
                            <ResizableHandle withHandle />
                            <ResizablePanel minSize={20} maxSize={50}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{openDetail.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Link className={badgeVariants({ variant: "outline" })} href={`/tables/${openDetail.id}`} >
                                            <p>Status: {openDetail.status}</p>
                                        </Link>
                                        <Link className={badgeVariants({ variant: "outline" })} href={`/tables/${openDetail.id}`} >
                                            Id: {openDetail.id}
                                        </Link>

                                        <p>Type: {openDetail.type}</p>
                                    </CardContent>
                                    <CardFooter>
                                        <Button onClick={() => {
                                            setOpenDetail({ ...openDetail, isOpen: false });
                                        }}>Close</Button>
                                    </CardFooter>
                                </Card>
                            </ResizablePanel>
                        </>
                    )
                }
            </ResizablePanelGroup >
        </>
    )
}

export default Tables;