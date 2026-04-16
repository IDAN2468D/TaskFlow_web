"use client";

import React, { useEffect } from 'react';
import { loginWithGoogleAction } from '@/actions/authActions';
import { useRouter } from 'next/navigation';

export default function GoogleLogin() {
  const router = useRouter();

  useEffect(() => {
    const initGoogle = () => {
      // @ts-ignore
      if (typeof google !== 'undefined') {
        // @ts-ignore
        google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleCallback,
        });

        // @ts-ignore
        google.accounts.id.renderButton(
          document.getElementById("google-button"),
          { 
            theme: "filled_black", 
            size: "large", 
            text: "continue_with",
            shape: "pill",
            width: 376
          }
        );
      }
    };

    // Retry a bit if global isn't there yet
    const timer = setTimeout(initGoogle, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleCallback = async (response: any) => {
    try {
      const result = await loginWithGoogleAction(response.credential);
      if (result.success) {
        router.push('/');
      } else {
        alert(result.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full flex justify-center mt-4 mb-2">
      <div id="google-button"></div>
    </div>
  );
}
