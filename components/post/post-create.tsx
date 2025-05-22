"use client";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet";

import { Input } from "../ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "../ui/textarea";
import { queryKeys } from '@/service/post/queries';
import { useQueryClient } from "@tanstack/react-query";
import { useCreatePost } from "@/service/post/usePostService"

const formSchema = z.object({
    title: z.string().min(2).max(50),
    body: z.string().min(2).max(500),
})

const getRandomNumberBetweenOneAndTen = (): number => {
    return Math.floor(Math.random() * 10) + 1;
}

const PostCreate = () => {
    const queryClient = useQueryClient();

    const [isOpen, setIsOpen] = useState(false);

    const [maxWidth, setMaxWidth] = useState(1500);
    const isDragging = useRef(false);

    const containerWidth = typeof window !== "undefined" ? window.innerWidth : 1;
    const rightRatio = ((containerWidth - maxWidth) / containerWidth) * 100;
    const { mutate: registPost, isPending } = useCreatePost();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            body: "",
        },
    })

    // 2. Define a submit handler.
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if(isPending) {
            return;
        }

        const body = {
            title: values.title,
            body: values.body,
            userId: getRandomNumberBetweenOneAndTen()
        }

        registPost(body, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: queryKeys.all });
                form.reset();
            },
            onError: (err) => {
                console.error(err);
            }
        });
    }

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

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        isDragging.current = true;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <>
            <Button type="button" onClick={() => setIsOpen(true)}>Create</Button>
            <Sheet modal={false} open={isOpen}>
                <SheetContent className={`w-full flex`} style={{ maxWidth: `${rightRatio}%`, minWidth: "25%" }}>
                    <div
                        className="w-[25px] h-full bg-gray-200"
                        style={{ cursor: "ew-resize" }}
                        onMouseDown={handleMouseDown}
                    />

                    <div className="flex flex-col w-full">
                        <br />
                        <SheetHeader className="w-full h-[50px]">
                            <SheetTitle>Create project</SheetTitle>
                            <SheetDescription></SheetDescription>
                        </SheetHeader>
                        <Form {...form} >
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="title" {...field} />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>

                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="body"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Body</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>

                                    )}
                                />

                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setIsOpen(false);
                                        form.reset();
                                    }}
                                >Cancel</Button>
                                <Button type="submit">Submit</Button>
                            </form>
                        </Form>
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
}

export default PostCreate;