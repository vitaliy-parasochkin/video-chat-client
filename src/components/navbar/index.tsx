import MyAvatar from '@/components/navbar/my-avatar';
import Time from '@/components/navbar/time';
import Image from 'next/image';

export default function Navbar() {
  return (
    <div className="flex h-[12vh] w-full items-center justify-between bg-light-primary px-5 py-3 dark:bg-dark-primary">
      <Image src="/logo.png" alt="logo" width={65} height={65} quality={100} priority />
      <div className="flex items-center gap-x-5">
        <Time />
        <MyAvatar />
      </div>
    </div>
  );
}
