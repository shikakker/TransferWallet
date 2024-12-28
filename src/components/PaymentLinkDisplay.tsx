import React from 'react';
import { Share2 } from 'lucide-react';

interface PaymentLinkDisplayProps {
  url: string;
  expiresAt: string;
}

export function PaymentLinkDisplay({ url, expiresAt }: PaymentLinkDisplayProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Payment Link',
          text: 'Complete your payment using this secure link',
          url
        });
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('Failed to share:', err);
        }
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-900">Payment Link</h3>
        <p className="mt-1 text-sm text-gray-500">
          Share this link to receive payment
        </p>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={url}
          readOnly
          className="flex-1 rounded-md border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        <button
          onClick={handleShare}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </button>
      </div>

      <p className="text-sm text-gray-500">
        Expires: {new Date(expiresAt).toLocaleString()}
      </p>
    </div>
  );
}