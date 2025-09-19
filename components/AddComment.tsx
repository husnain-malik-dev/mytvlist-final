"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { addCommentAction } from "@/app/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth, useUser } from "@clerk/nextjs";
import { Loader2, LogIn } from "lucide-react";

type commentProps = {
  postId: string;
};

function AddComment({ postId }: commentProps) {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      await addCommentAction(formData);
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <Card className="bg-gray-800 border-gray-700 rounded-xl p-4">
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      </Card>
    );
  }

  if (!userId || !user) {
    return (
      <Card className="bg-gray-800 border-gray-700 rounded-xl p-4">
        <div className="text-center py-6">
          <LogIn className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Join the conversation</h3>
          <p className="text-gray-400 mb-4">Sign in to share your thoughts and connect with the community.</p>
          <Link href="/sign-in">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 rounded-full">
              Sign In to Comment
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800 border-gray-700 rounded-xl p-4">
      <div className="flex items-start gap-4">
        <Link href={`/my-list/${user.username}`}>
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.imageUrl || ""} />
            <AvatarFallback className="bg-purple-600 text-white">
              {user.username?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex-1">
          <div className="mb-3">
            <Link
              href={`/my-list/${user.username}`}
              className="text-purple-400 font-medium hover:text-purple-300 transition-colors"
            >
              {user.username}
            </Link>
          </div>

          <form action={handleSubmit} className="flex gap-3">
            <Input
              placeholder="Share your thoughts..."
              name="text"
              required
              disabled={isLoading}
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-full flex-1 h-12 disabled:opacity-50"
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white px-6 rounded-full h-12 min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Posting...
                </>
              ) : (
                "Post Comment"
              )}
            </Button>
            <input type="hidden" name="username" value={user.username as string} />
            <input type="hidden" name="postId" value={postId} />
          </form>
        </div>
      </div>
    </Card>
  );
}

export default AddComment;
