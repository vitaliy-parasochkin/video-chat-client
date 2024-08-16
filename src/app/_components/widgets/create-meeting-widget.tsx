'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {CreateMeetingFields, CreateMeetingValidationSchema} from '@/types/forms';
import {useCreateMeeting} from '@/hooks/mutations/use-create-meeting';
import {SubmitHandler, useForm} from 'react-hook-form';
import {useMeeting} from '@/hooks/state/use-meeting';
import {zodResolver} from '@hookform/resolvers/zod';
import {Button} from '@/components/ui/button';
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import {useRouter} from 'next/navigation';
import toast from 'react-hot-toast';

export default function CreateMeetingWidget() {
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<CreateMeetingFields>({
    mode: 'onBlur',
    defaultValues: {
      name: '',
    },
    resolver: zodResolver(CreateMeetingValidationSchema),
  });
  const {mutateAsync, reset, isIdle, isPending, isSuccess} = useCreateMeeting();
  const setMeeting = useMeeting(state => state.setMeeting);
  const router = useRouter();

  const onSubmit: SubmitHandler<CreateMeetingFields> = async data => {
    await mutateAsync(data, {
      onSuccess: res => {
        if (res.error) {
          toast.error(res.error);
          reset();
        }
        if (res.success) {
          toast.success('Meeting created successfully');
          setMeeting(res.success);
          router.push(res.success.code);
        }
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">Create new meeting</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new meeting</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Label htmlFor="name">Name</Label>
          <Input
            {...register('name')}
            id="name"
            placeholder="english lesson"
            className="mt-2 h-10"
            maxLength={110}
          />
          {errors.name?.message && (
            <span className="ml-5 text-xs text-red-500">{errors.name?.message}</span>
          )}
          <Button type="submit" className="mt-2 w-full" size="sm" disabled={isPending}>
            {isIdle && 'Create new meeting'}
            {isPending && 'Createing new meeting'}
            {isSuccess && 'Meeting created successfuly'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
