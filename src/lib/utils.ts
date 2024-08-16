import {type ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';
import {nanoid} from 'nanoid';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function validateCode(code: string) {
  const allowedChars = /^[0-9A-Za-z_\-]{18}$/;
  return allowedChars.test(code);
}

export function initials(name: string) {
  const words = name.split(' ');
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  } else if (words.length > 1) {
    return name
      .split(' ')
      .slice(0, 2)
      .map(w => w[0].toUpperCase())
      .join(' ');
  }
}

export function generateCode() {
  return nanoid(18);
}
