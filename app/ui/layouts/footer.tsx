
export function Footer() {
  return (
    <footer className="prose dark:prose-invert text-center w-full min-w-full pt-4 pb-8 px-[18px] leading-4">
      <div>
        <span style={{ fontSize: '0.8em' }}>
          Copyright ©
          {' '}
          {new Date().getFullYear()}
          {' '}
          Infonomic Company Limited
          {' '}
          All rights reserved
        </span>
      </div>
    </footer>
  )
}
