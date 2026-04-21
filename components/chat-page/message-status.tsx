import { Check, CheckCheck } from "lucide-react";

export function MessageStatus({ status }: { status?: string }) {
  if (status === "seen") {
    return <CheckCheck className="w-4 h-4 text-green-500" />;
  }

  if (status === "delivered") {
    return <CheckCheck className="w-4 h-4 text-gray-400" />;
  }

  if (status === "sent") {
    return <Check className="w-4 h-4 text-gray-400" />;
  }

  return null;
}