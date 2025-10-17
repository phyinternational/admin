import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getLinkFromJson(data: any): string {
  // Extract characters from keys "0" to "168" dynamically
  const linkChars = Object.keys(data)
    .filter((key) => !isNaN(Number(key)))
    .sort((a, b) => Number(a) - Number(b))
    .map((key) => data[key])

  // Concatenate the characters to form the link
  const link = linkChars.join("")

  return link
}
export const sizeOptions = [
  {
    value: 'S',
    label: 'S',
  },
  {
    value: 'M',
    label: 'M',
  },
  {
    value: 'L',
    label: 'L',
  },
  {
    value: 'XL',
    label: 'XL',
  },
  {
    value: '2XL',
    label: '2XL',
  },
  {
    value: '3XL',
    label: '3XL',
  },
  {
    value: '4XL',
    label: '4XL',
  },
  {
    value: '5XL',
    label: '5XL',
  }
];



