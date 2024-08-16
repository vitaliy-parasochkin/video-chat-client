'use client';

import {Button} from '@/components/ui/button';
import {FaGithub} from 'react-icons/fa6';
import {signIn} from 'next-auth/react';

type GithubButtonProps = {
  callbackUrl?: string;
};
function GithubButton({callbackUrl}: GithubButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      className="flex cursor-pointer items-center justify-center gap-x-3 rounded-xl bg-slate-100 px-16 py-5 dark:bg-slate-800"
      onClick={() => signIn('github', {callbackUrl})}
    >
      Continue with github <FaGithub className="h-6 w-6" />
    </Button>
  );
}

export default GithubButton;
