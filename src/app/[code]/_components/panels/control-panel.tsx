'use client';

import {LuCopy, LuMic, LuMicOff, LuPhoneOff, LuVideo, LuVideoOff} from 'react-icons/lu';
import {useMeeting} from '@/hooks/state/use-meeting';
import {useStream} from '@/hooks/state/use-stream';
import {useSocket} from '@/hooks/state/use-socket';
import {useShallow} from 'zustand/react/shallow';
import {usePeer} from '@/hooks/state/use-peer';
import {useCopyToClipboard} from 'usehooks-ts';
import {Button} from '@/components/ui/button';
import Time from '@/components/navbar/time';
import {useRouter} from 'next/navigation';
import toast from 'react-hot-toast';
import {MediaKind} from '@/types';

function ControlPanel() {
  const {muted, visible, toggleAudio, toggleVideo} = useStream();
  const {meeting, connections} = useMeeting(
    useShallow(state => ({meeting: state.meeting, connections: state.connections}))
  );
  const [copiedText, copy] = useCopyToClipboard();
  const socket = useSocket();
  const router = useRouter();
  const myPeerId = usePeer(state => state.myPeerId);

  const handleCopy = (text: string) => {
    copy(text)
      .then(() => {
        toast.success('Copied!');
      })
      .catch(() => {
        toast.error('Failed to copy!');
      });
  };

  const toggle = (kind: MediaKind) => {
    switch (kind) {
      case 'audio':
        toggleAudio();
        socket.emit('user:toggle-audio', myPeerId);
        break;
      case 'video':
        toggleVideo((newTrack: MediaStreamTrack) => {
          Object.values(connections).forEach(el => {
            const sender = el.peerConnection?.getSenders().find(s => {
              return s.track?.kind === newTrack.kind;
            });
            sender?.replaceTrack(newTrack);
          });
        });
        socket.emit('user:toggle-video', myPeerId);
        break;
      default:
        break;
    }
  };

  return (
    <div className="h-[10vh] px-3 pb-3">
      <div className="grid h-full w-full grid-cols-[1.5fr,1fr] items-center rounded-xl bg-light-primary px-3 dark:bg-dark-primary md:grid-cols-3">
        <Time className="hidden md:block" />
        <div className="flex items-center justify-center gap-x-3">
          <Button size="icon" variant="red" onClick={() => router.push('/')}>
            <LuPhoneOff className="w-6 h-6" />
          </Button>
          <Button size="icon" onClick={() => toggle('audio')}>
            {muted ? <LuMicOff className="w-6 h-6" /> : <LuMic className="w-6 h-6" />}
          </Button>
          <Button size="icon" onClick={() => toggle('video')}>
            {visible ? <LuVideo className="w-6 h-6" /> : <LuVideoOff className="w-6 h-6" />}
          </Button>
        </div>
        <Button
          className="flex items-center gap-x-2 justify-self-end"
          onClick={() => handleCopy(meeting?.code as string)}
          variant="ghost"
        >
          <LuCopy />
          <span className="hidden md:block">{meeting?.code}</span>
          <span className="md:hidden">{`${meeting?.code.slice(0, 6)}...`}</span>
        </Button>
      </div>
    </div>
  );
}

export default ControlPanel;
