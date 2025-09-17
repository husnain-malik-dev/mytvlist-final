import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { currentUser } from "@clerk/nextjs/server";
import { addCommentAction } from "@/app/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type commentProps = {
  postId: string;
};

async function AddComment({ postId }: commentProps) {
  const user = await currentUser();
  const username = user?.username;

  return (
    <Card className="bg-gray-800 border-gray-700 rounded-xl p-4">
      <div className="flex items-start gap-4">
        <Link href={`/my-list/${username}`}>
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.imageUrl || ""} />
            <AvatarFallback className="bg-purple-600 text-white">
              {username?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex-1">
          <div className="mb-3">
            <Link
              href={`/my-list/${username}`}
              className="text-purple-400 font-medium hover:text-purple-300 transition-colors"
            >
              u/{username}
            </Link>
          </div>

          <form action={addCommentAction} className="flex gap-3">
            <Input
              placeholder="Share your thoughts..."
              name="text"
              required
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-full flex-1 h-12"
            />
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 rounded-full h-12"
            >
              Post Comment
            </Button>
            <input type="hidden" name="username" value={username as string} />
            <input type="hidden" name="postId" value={postId} />
          </form>
        </div>
      </div>
    </Card>
  );
}

export default AddComment;
