'use client';

import {useRecentMeetings} from '@/hooks/state/use-recent-meetings';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Button} from '@/components/ui/button';
import {useRouter} from 'next/navigation';
import {Meeting} from '@prisma/client';

export default function RecentMeetingWidget() {
  const meetings = useRecentMeetings(state => state.meetings);
  const router = useRouter();

  const handleClick = (meeting: Meeting) => {
    // @ts-ignore
    router(meeting.code);
  };

  return (
    <ScrollArea className="h-[205px]">
      <div className="space-y-2 pr-4">
        {meetings.map(meeting => (
          <div
            key={meeting.id}
            className="flex items-center justify-between rounded-2xl bg-slate-200 p-3 dark:bg-gray-800"
          >
            <div className="text-md lg:text-lg">{meeting.name}</div>
            <div className="flex items-center gap-x-3">
              <div className="hidden text-lg lg:block">{meeting.code}</div>
              <Button onClick={() => handleClick(meeting)}>Join</Button>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
