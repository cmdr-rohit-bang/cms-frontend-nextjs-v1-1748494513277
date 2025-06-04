import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Comment } from "@/types/types";
import { useSession } from "next-auth/react";

const CommentsComponent = ({ messages }: { messages: Comment[] | [] }) => {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col space-y-4 px-4 py-6">
      {messages.map((comment) => {
        const isCurrentUser = session?.user?.id === comment.user_id;

        return (
          <div
            key={comment.id}
            className={`flex items-end gap-2 ${
              isCurrentUser ? "justify-end" : "justify-start"
            }`}
          >
            {!isCurrentUser && (
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${comment.user.first_name} ${comment.user.last_name}`}
                  alt={`${comment.user.first_name} ${comment.user.last_name}`}
                />
                <AvatarFallback>
                  {comment.user.first_name[0]}
                  {comment.user.last_name[0]}
                </AvatarFallback>
              </Avatar>
            )}

            <div
              className={`max-w-xs md:max-w-md p-3 rounded-2xl relative text-sm whitespace-pre-wrap shadow-md ${
                isCurrentUser
                  ? "bg-blue-100 text-blue-600 rounded-br-none"
                  : "bg-muted text-muted-foreground rounded-bl-none"
              } ${comment.is_internal ? "border border-dashed border-blue-400" : ""}`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-semibold">
                  {comment.user.first_name} {comment.user.last_name}
                </span>
                <span className="text-[10px] text-gray-400">
                  {formatDistanceToNow(new Date(comment.created_at), {
                    addSuffix: true,
                  })}
                </span>
              </div>

              {comment.is_internal && (
                <Badge className="mb-2 text-xs" variant="outline">
                  Internal Note
                </Badge>
              )}

              <p>{comment.message}</p>

              {comment.attachments && comment.attachments.length > 0 && (
                <div className="flex flex-col gap-1 mt-2">
                  {comment.attachments.map((attachment, index) => (
                    <a
                      key={index}
                      href={attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-200 underline text-xs"
                    >
                      📎 Attachment {index + 1}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {isCurrentUser && (
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${comment.user.first_name} ${comment.user.last_name}`}
                  alt={`${comment.user.first_name} ${comment.user.last_name}`}
                />
                <AvatarFallback>
                  {comment.user.first_name[0]}
                  {comment.user.last_name[0]}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CommentsComponent;
