import {
  CreateMeetingWidget,
  JoinMeetingWidget,
  RecentMeetingWidget,
} from '@/app/_components/widgets';
import {Separator} from '@/components/ui/separator';
import Navbar from '@/components/navbar';

export default function Home() {
  return (
    <main className="flex h-screen flex-col">
      <Navbar />
      <div className="md:grid-cols grid grow gap-5 p-3 md:grid-cols-[1.7fr,1fr]">
        <div className="rounded-xl bg-light-primary p-5 dark:bg-dark-primary">
          <h2 className="text-2xl font-bold">Join or create meeting</h2>
          <h3 className="mb-2 mt-5 text-lg">Join meeting with code</h3>
          <JoinMeetingWidget />
          <h3 className="mb-2 mt-5 text-lg">Create new meeting</h3>
          <CreateMeetingWidget />
          <Separator className="my-5" />
          <h2 className="text-2xl font-bold">Recent meetings</h2>
          <RecentMeetingWidget />
        </div>
        <div className="flex items-center justify-center rounded-xl bg-light-primary p-5 dark:bg-dark-primary">
          <div className="text=2xl p-5 text-center">
            Video chat app using Next.js Socket,io WebRTC
          </div>
        </div>
      </div>
    </main>
  );
}
