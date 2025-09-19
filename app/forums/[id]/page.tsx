import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RenderToJson } from "@/components/RenderToJson";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import prisma from "@/app/db/prisma";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import AddComment from "@/components/AddComment";
import ShowComments from "@/components/ShowComments";
import { MessageCircle, Eye, Clock, ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";

const rules = [
  {
    id: 1,
    text: "Remember the human",
  },
  {
    id: 2,
    text: "Behave like you would in real life",
  },
  {
    id: 3,
    text: "Look for the original source of content",
  },
  {
    id: 4,
    text: "Search for duplication before posting",
  },
  {
    id: 5,
    text: "Read the community guidlines",
  },
];

async function page({ params }: { params: { id: string } }) {
  const postId = params.id;

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      user: true,
      _count: {
        select: { comments: true }
      }
    },
  });

  if (!post) {
    throw new Error("No post found");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 mb-40">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/forums">
          <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-gray-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Discussions
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Post Card */}
          <Card className="bg-gray-800 border-gray-700 rounded-xl overflow-hidden">
            <div className="p-6">
              {/* Post Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Link href={`/my-list/${post.user?.userName}`}>
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={post.user?.imageUrl || ""} />
                      <AvatarFallback className="bg-purple-600 text-white">
                        {post.user?.userName?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <div>
                    <Link
                      href={`/my-list/${post.user?.userName}`}
                      className="text-white font-medium hover:text-purple-400 transition-colors"
                    >
                      {post.user?.userName || "Unknown"}
                    </Link>
                    <div className="flex items-center text-sm text-gray-400">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-purple-600/20 text-purple-300 border-purple-600/30">
                  Discussion
                </Badge>
              </div>

              {/* Post Title */}
              <h1 className="text-2xl lg:text-3xl font-bold text-white mb-4 leading-tight">
                {post.title}
              </h1>

              {/* Post Content */}
              <div className="text-gray-300 leading-relaxed mb-6">
                {post.textContent && <RenderToJson data={JSON.parse(post.textContent as string)} />}
              </div>

              {/* Post Image */}
              {post.imageString && (
                <div className="mb-6">
                  <Image
                    src={post.imageString}
                    alt="Post content"
                    width={800}
                    height={400}
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                </div>
              )}

              {/* Engagement Stats */}
              <div className="flex items-center space-x-6 text-sm text-gray-400 border-t border-gray-700 pt-4">
                <div className="flex items-center">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  <span>{post._count.comments} replies</span>
                </div>
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  <span>Views</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Comments Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Replies ({post._count.comments})
              </h2>
            </div>

            <ShowComments postId={params.id} />
            <AddComment postId={params.id} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Community Rules */}
            <Card className="bg-gray-800 border-gray-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">📋</span>
                </div>
                <h3 className="text-white font-semibold">Community Guidelines</h3>
              </div>

              <Separator className="mb-4 bg-gray-700" />

              <div className="space-y-3">
                {rules.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-5 h-5 bg-purple-600/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-purple-400 text-xs font-medium">{item.id}</span>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Post Stats */}
            <Card className="bg-gray-800 border-gray-700 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Discussion Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Replies</span>
                  <span className="text-white font-medium">{post._count.comments}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Posted</span>
                  <span className="text-white font-medium">
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
