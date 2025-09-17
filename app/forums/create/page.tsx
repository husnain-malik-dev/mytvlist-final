"use client";

import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Text, Video } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TipTapEditor } from "@/components/TipTabEditor";
import { SubmitButton } from "@/components/SubmitButtons";
import { UploadDropzone } from "@/components/Uploadthing";
import { useState } from "react";
import { createPost } from "@/app/actions";
import { JSONContent } from "@tiptap/react";

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

export default function CreatePostRoute({
  params,
}: {
  params: { id: string };
}) {
  const [imageUrl, setImageUrl] = useState<null | string>(null);
  const [json, setJson] = useState<null | JSONContent>(null);
  const [title, setTitle] = useState<null | string>(null);

  const createPostMTL = createPost.bind(null, { jsonContent: json ? JSON.stringify(json) : null });
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 mb-40">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Create New Discussion</h1>
        <p className="text-gray-400">Share your thoughts about movies and TV shows</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="bg-gray-800 border-gray-700 rounded-xl overflow-hidden">
            <Tabs defaultValue="post" className="w-full">
              <div className="px-6 pt-6">
                <TabsList className="grid w-full grid-cols-2 bg-gray-700 rounded-lg">
                  <TabsTrigger value="post" className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                    <Text className="h-4 w-4" />
                    Text Post
                  </TabsTrigger>
                  <TabsTrigger value="image" className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                    <Video className="h-4 w-4" />
                    Image & Video
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="post" className="px-6 pb-6">
                <form action={createPostMTL} className="space-y-6">
                  <input
                    type="hidden"
                    name="imageUrl"
                    value={imageUrl ?? ""}
                  />

                  <div>
                    <Label htmlFor="title" className="text-white text-sm font-medium mb-2 block">
                      Discussion Title *
                    </Label>
                    <Input
                      id="title"
                      required
                      name="title"
                      placeholder="What's on your mind?"
                      value={title ?? ""}
                      onChange={(e) => setTitle(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-lg focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <Label className="text-white text-sm font-medium mb-2 block">
                      Content
                    </Label>
                    <div className="bg-gray-700 rounded-lg border border-gray-600 overflow-hidden">
                      <TipTapEditor setJson={setJson} json={json} />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <SubmitButton text="Create Discussion" className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6" />
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="image" className="px-6 pb-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-white text-sm font-medium mb-2 block">
                      Upload Image or Video
                    </Label>
                    {imageUrl === null ? (
                      <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-purple-500 transition-colors">
                        <UploadDropzone
                          endpoint="imageUploader"
                          onClientUploadComplete={(res) => {
                            setImageUrl(res[0].url);
                          }}
                          onUploadError={(error: Error) => {
                            console.error("Upload error:", error);
                            alert("Upload failed. Please try again.");
                          }}
                        />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Image
                          src={imageUrl}
                          alt="uploaded content"
                          width={500}
                          height={400}
                          className="w-full h-64 object-cover rounded-lg"
                        />
                        <div className="flex justify-center">
                          <Button
                            variant="outline"
                            onClick={() => setImageUrl(null)}
                            className="bg-purple-600 hover:bg-purple-700 text-white border-purple-600 rounded-full px-6"
                          >
                            Change Image
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="bg-gray-800 border-gray-700 rounded-xl p-6 sticky top-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">📝</span>
              </div>
              <h2 className="text-white font-semibold">Posting Guidelines</h2>
            </div>

            <Separator className="mb-4 bg-gray-700" />

            <div className="space-y-4">
              {rules.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="w-6 h-6 bg-purple-600/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-purple-400 text-xs font-medium">{item.id}</span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-purple-600/10 rounded-lg border border-purple-600/20">
              <p className="text-purple-300 text-sm">
                💡 <strong>Pro tip:</strong> Use descriptive titles and follow community guidelines for better engagement!
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}