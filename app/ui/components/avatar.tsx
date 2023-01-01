import * as AvatarPrimitive from '@radix-ui/react-avatar'

const url = 'https://picsum.photos/150'

export const Avatar = () => {
  return (
    <AvatarPrimitive.Root className="relative inline-flex h-10 w-10 rounded-full">
      <AvatarPrimitive.Image
        src={url}
        alt="Avatar"
        className="h-full w-full rounded-full object-cover"
      />
      <AvatarPrimitive.Fallback
        className="flex h-full w-full items-center justify-center rounded-full bg-white dark:bg-gray-800"
        delayMs={600}
      >
        <span className="text-sm font-medium uppercase text-gray-700 dark:text-gray-400">AB</span>
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  )
}
