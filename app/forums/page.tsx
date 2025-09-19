  import { CreatePostCard } from "@/components/CreatePost";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Card, CardContent, CardHeader } from "@/components/ui/card";
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
  import { Badge } from "@/components/ui/badge";
  import React from "react";
  import prisma from "../db/prisma";
  import Link from "next/link";
  import { Search, MessageCircle, Clock } from "lucide-react";
  import { formatDistanceToNow } from "date-fns";

 async function ForumPage() {

   // Function to extract plain text from TipTap JSON
   function extractPlainText(jsonString: string): string {
     try {
       const content = JSON.parse(jsonString);
       let text = '';

       const traverse = (node: any) => {
         if (node.type === 'text' && node.text) {
           text += node.text;
         }
         if (node.content) {
           node.content.forEach(traverse);
         }
       };

       traverse(content);
       return text;
     } catch (error) {
       return '';
     }
   }

  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      user: true,
      _count: {
        select: { comments: true }
      }
    },
  });

    return (
      <div className="mt-24 mb-40 px-4 sm:px-8 md:px-12 lg:px-16 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Forum Discussions</h1>
          <p className="text-gray-400">Talk about any TV/Movie in the forum discussions</p>
        </div>

        <div className="mb-8">
          <CreatePostCard />
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search discussions..."
              className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 rounded-full"
            />
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Card key={post.id} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={post.user?.imageUrl || ""} />
                        <AvatarFallback className="bg-purple-600 text-white">
                          {post.user?.userName?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <Link
                          href={`/my-list/${post.user?.userName}`}
                          className="text-sm font-medium text-white hover:text-purple-400 transition-colors"
                        >
                          {post.user?.userName || "Unknown"}
                        </Link>
                        <div className="flex items-center text-xs text-gray-400">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-purple-600/20 text-purple-300 border-purple-600/30">
                      Discussion
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <Link href={`/forums/${post.id}`}>
                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 hover:text-purple-400 transition-colors">
                      {post.title}
                    </h3>
                  </Link>

                  {post.textContent && (
                    <p className="text-gray-400 text-sm line-clamp-3 mb-3">
                      {extractPlainText(post.textContent as string).slice(0, 150) + "..."}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        <span>{post._count.comments} replies</span>
                      </div>
                    </div>
                    <Link
                      href={`/forums/${post.id}`}
                      className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                    >
                      Read more →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-2xl font-semibold text-white mb-2">No discussions yet</h3>
              <p className="text-gray-400">Be the first to start a conversation!</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  export default ForumPage;
