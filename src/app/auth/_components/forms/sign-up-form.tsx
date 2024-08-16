'use client';

import {GithubButton, GoogleButton} from '@/app/auth/_components/buttons';
import {SignUpFormFields, SignUpValidationSchema} from '@/types/forms';
import {useSignUp} from '@/hooks/mutations/use-sign-up';
import {SubmitHandler, useForm} from 'react-hook-form';
import {Separator} from '@/components/ui/separator';
import {zodResolver} from '@hookform/resolvers/zod';
import {useSearchParams} from 'next/navigation';
import {Button} from '@/components/ui/button';
import {MdOutlineError} from 'react-icons/md';
import {Input} from '@/components/ui/input';
import {Route} from '../../../../../routes';
import {signIn} from 'next-auth/react';
import toast from 'react-hot-toast';
import {useState} from 'react';
import Link from 'next/link';

export default function SignUpForm() {
  const {mutateAsync, reset, isIdle, isPending, isSuccess} = useSignUp();
  const [error, setError] = useState<string>('');
  const searchParams = useSearchParams();
  const callbackURL = searchParams.get('callbackUrl') ?? Route.MAIN;
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<SignUpFormFields>({
    mode: 'onBlur',
    defaultValues: {
      email: '',
      name: '',
      password: '',
    },
    resolver: zodResolver(SignUpValidationSchema),
  });

  const onSubmit: SubmitHandler<SignUpFormFields> = async data => {
    mutateAsync(data, {
      onSuccess: res => {
        if (res?.success) {
          signIn('credentials', {
            email: data.email,
            password: data.password,
            callbackUrl: callbackURL,
          });
          toast.success(res?.success);
        }
        if (res?.error) {
          toast.error(res?.error);
          setError(res?.error);

          reset();
        }
      },
    });
  };

  return (
    <div className="flex w-full grow items-center justify-center">
      <form
        className="sm:-w-fit h-full w-full min-w-[300px] bg-light-primary p-5 dark:bg-dark-primary sm:h-fit sm:w-fit sm:rounded-2xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="mb-5 text-center text-2xl font-bold">Sign up</h1>
        <div className="my-3">
          <div>
            <Input {...register('email')} placeholder="Email" />
            {errors?.email && (
              <span className="ml-5 text-xs text-red-500">{errors?.email.message}</span>
            )}
          </div>
        </div>
        <div className="my-3">
          <div>
            <Input {...register('name')} placeholder="Name" autoComplete="name" />
            {errors?.name && (
              <span className="ml-5 text-xs text-red-500">{errors?.name.message}</span>
            )}
          </div>
        </div>
        <div className="my-3">
          <div>
            <Input {...register('password')} placeholder="Password" type="password" />
            {errors?.password && (
              <span className="ml-5 text-xs text-red-500">{errors?.password.message}</span>
            )}
          </div>
        </div>
        <Button disabled={isPending || isSuccess} type="submit" className="w-full">
          {isIdle && 'Create account'}
          {isPending && 'Creating your account'}
          {isSuccess && 'Account created successfully'}
        </Button>
        {error && (
          <div className="mt-5 flex w-full items-center justify-center gap-x-4 rounded-lg bg-red-500 px-3 py-2 text-center text-white">
            <MdOutlineError className="h-6 w-6" /> {error}
          </div>
        )}
        <Separator className="my-5" />
        <div className="flex flex-col gap-2">
          <GoogleButton callbackUrl={callbackURL} />
          <GithubButton callbackUrl={callbackURL} />
        </div>
        <div className="mt-3 text-sm text-secondary">
          <div className="">Have an account already?</div>
          <Button asChild variant="link" className="p-0">
            <Link href={Route.SIGN_IN}>Sign in</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
