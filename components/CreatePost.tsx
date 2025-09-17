import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ImageDown, Link2 } from "lucide-react";

export function CreatePostCard() {
  return (
    <Card className="px-6 py-4 flex items-center gap-x-4 w-full bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">

      <Link href="/forums/create" className="flex-1">
        <Input
          placeholder="Create your forum discussion..."
          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-full h-12"
          readOnly
        />
      </Link>

      <div className="flex items-center gap-x-2">
        <Button variant="outline" size="icon" className="rounded-full border-gray-600 hover:bg-gray-600" asChild>
          <Link href="/forums/create">
            <ImageDown className="w-4 h-4" />
          </Link>
        </Button>

        <Button variant="outline" size="icon" className="rounded-full border-gray-600 hover:bg-gray-600" asChild>
          <Link href="/forums/create">
            <Link2 className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}