"use server";

import { revalidatePath, unstable_noStore } from "next/cache";
import prisma from "./db/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from 'next/navigation';
import { JSONContent } from "@tiptap/react";

// Types for better type safety
interface AddToListData {
  userId: string;
  mediaType: string;
  showId: string;
  showRating: number;
}

interface DeleteFromListData {
  userId: string;
  mediaType: string;
  showId: string;
}

interface CreatePostData {
  title: string;
  imageUrl?: string;
  jsonContent?: JSONContent;
}

interface AddCommentData {
  text: string;
  username: string;
  postId: string;
}

// Utility function to ensure user exists
async function ensureUserExists(userId: string): Promise<void> {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          id: userId,
          email: null,
          userName: null,
          imageUrl: null,
        },
      });
    }
  } catch (error) {
    console.error("Error ensuring user exists:", error);
    throw new Error("Failed to verify user");
  }
}

// Utility function to get current user with error handling
async function getCurrentUser() {
  try {
    const user = await currentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }
    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    throw error;
  }
}

export const handleAddToListAction = async (formData: FormData): Promise<void> => {
  try {
    const userId = formData.get('userId') as string;
    const mediaType = formData.get('mediaType') as string;
    const showId = formData.get('showId') as string;
    const showRating = parseInt(formData.get('showRating') as string, 10);

    if (!userId || !mediaType || !showId || !showRating || showRating < 1 || showRating > 10) {
      throw new Error("Invalid form data");
    }

    await ensureUserExists(userId);

    const existingEntry = await prisma.userlist.findUnique({
      where: {
        userId_mediaType_showId: {
          userId,
          mediaType,
          showId,
        },
      },
    });

    if (existingEntry) {
      await prisma.userlist.update({
        where: {
          userId_mediaType_showId: {
            userId,
            mediaType,
            showId,
          },
        },
        data: { showRating },
      });
    } else {
      await prisma.userlist.create({
        data: {
          userId,
          mediaType,
          showId,
          showRating,
        },
      });
    }

    const user = await getCurrentUser();
    revalidatePath(`/my-list/${user.username}`);
  } catch (error) {
    console.error("Error adding to list:", error);
    throw new Error("Failed to add to list");
  }
};

export const handleDeleteFromListAction = async (formData: FormData): Promise<void> => {
  try {
    const user = await getCurrentUser();
    const username = user.username;

    const userId = formData.get('userId') as string;
    const mediaType = formData.get('mediaType') as string;
    const showId = formData.get('showId') as string;

    if (!userId || !mediaType || !showId) {
      throw new Error("Invalid form data");
    }

    await prisma.userlist.delete({
      where: {
        userId_mediaType_showId: {
          userId,
          mediaType,
          showId,
        },
      },
    });

    revalidatePath(`/my-list/${username}`);
    redirect(`/my-list/${username}`);
  } catch (error: any) {
    // Re-throw redirect errors (they're handled by Next.js)
    if (error?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
    console.error("Error deleting from list:", error);
    throw new Error("Failed to delete from list");
  }
};

export async function createPost(
  { jsonContent }: { jsonContent: string | null },
  formData: FormData
): Promise<void> {
  try {
    const user = await getCurrentUser();

    const title = formData.get("title") as string;
    const imageUrl = formData.get("imageUrl") as string | null;

    if (!title?.trim()) {
      throw new Error("Title is required");
    }

    // Only set imageString if imageUrl is a valid URL (not "undefined" or empty)
    const validImageUrl = imageUrl && imageUrl !== "undefined" && imageUrl.startsWith("http") ? imageUrl : undefined;

    await prisma.post.create({
      data: {
        title: title.trim(),
        imageString: validImageUrl,
        userId: user.id,
        textContent: jsonContent || undefined,
      },
    });

    redirect("/forums");
  } catch (error: any) {
    // Re-throw redirect errors (they're handled by Next.js)
    if (error?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
    console.error("Error creating post:", error);
    throw new Error("Failed to create post");
  }
}

export const addCommentAction = async (formData: FormData): Promise<void> => {
  try {
    const text = formData.get("text") as string;
    const c_username = formData.get("username") as string;
    const postId = formData.get("postId") as string;

    if (!text?.trim() || !c_username || !postId) {
      throw new Error("Invalid comment data");
    }

    const user = await getCurrentUser();
    if (!user) {
      redirect("/sign-in");
      return;
    }

    await prisma.comment.create({
      data: {
        text: text.trim(),
        c_username,
        postId,
      },
    });

    revalidatePath(`/forums/${postId}`);
    redirect(`/forums/${postId}`);
  } catch (error: any) {
    // Re-throw redirect errors (they're handled by Next.js)
    if (error?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
    console.error("Error adding comment:", error);
    throw new Error("Failed to add comment");
  }
};