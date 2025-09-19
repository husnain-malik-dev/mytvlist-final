import React from 'react'
import prisma from "@/app/db/prisma";
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

type commentProps = {
    postId: string;
  };

async function ShowComments({postId} : commentProps) {

  const comments = await prisma.comment.findMany({
    where: { postId },
    include: { user: true },
    orderBy: { createdAt: 'asc' },
  });

  if (comments.length === 0) {
    return (
      <div className="mt-8 text-center py-8">
        <div className="text-4xl mb-2">💬</div>
        <p className="text-gray-400">No comments yet. Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className='mt-8 space-y-4'>
      <h2 className='text-xl font-semibold text-white mb-6'>Comments ({comments.length})</h2>

      <div className='space-y-4'>
        {comments.map((comment, i) => (
          <Card key={comment.id} className="bg-gray-800 border-gray-700 rounded-xl p-4 hover:bg-gray-750 transition-colors">
            <div className='flex items-start gap-3'>
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage src={comment.user?.imageUrl || ""} className='object-cover' />
                <AvatarFallback className="bg-purple-600 text-white">
                  {comment.user?.userName?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className='flex items-center gap-2 mb-2'>
                  <Link
                    href={`/my-list/${comment.user?.userName}`}
                    className="text-purple-400 font-medium hover:text-purple-300 transition-colors"
                  >
                    {comment.user?.userName || "Unknown"}
                  </Link>
                  <span className="text-gray-500 text-sm">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                  <span className="text-gray-600 text-xs bg-gray-700 px-2 py-1 rounded-full">
                    #{i + 1}
                  </span>
                </div>

                <p className="text-gray-300 leading-relaxed break-words">
                  {comment.text}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ShowComments