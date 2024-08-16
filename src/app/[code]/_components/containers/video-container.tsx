'use client';

import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {LuMic, LuMicOff} from 'react-icons/lu';
import {ReactNode, useEffect} from 'react';
import {cn, initials} from '@/lib/utils';
import {useToggle} from 'usehooks-ts';
import hark from 'hark';

type VideoContainerProps = {
  children: ReactNode;
  muted: boolean;
  visible: boolean;
  image: string;
  name: string;
  stream: MediaStream;
};

function VideoContainer({children, muted, visible, image, name, stream}: VideoContainerProps) {
  const [speaking, toggle] = useToggle();

  useEffect(() => {
    const speechEvents = hark(stream, {});
    speechEvents.on('speaking', toggle);
    speechEvents.on('stopped_speaking', toggle);

    return () => {
      speechEvents.stop();
    };
  }, [stream, toggle]);

  return (
    <div
      className={cn('relative h-full rounded-xl overflow-hidden border border-transparent', {
        'border-blue-500': [speaking],
      })}
    >
      <div className={cn('h-full', {hidden: !visible})}>{children}</div>
      {!visible && (
        <div className="flex h-full w-full items-center justify-center bg-light-primary dark:bg-dark-primary">
          <Avatar className="md:h-24 md:w-24 sm:w-20 sm:h-20">
            <AvatarImage src={image} />
            <AvatarFallback>{initials(name)}</AvatarFallback>
          </Avatar>
        </div>
      )}
      <p className="absolute bottom-3 left-4 select-none rounded-full bg-black/20 p-2 text-md font-medium text-white backdrop-blur-lg dark:bg-gray-300/20">
        {name}
      </p>
      <div className="absolute right-3 top-3">
        {muted ? <LuMicOff className="w-6 h-6" /> : <LuMic className="w-6 h-6" />}
      </div>
    </div>
  );
}

export default VideoContainer;
