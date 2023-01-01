export function Footer() {
  return (
    <footer className="prose w-full min-w-full px-[18px] pt-4 pb-8 text-center leading-4 dark:prose-invert">
      <div>
        <span style={{ fontSize: '0.8em' }}>
          Copyright © {new Date().getFullYear()} Infonomic Company Limited All rights reserved
        </span>
      </div>
    </footer>
  )
}
