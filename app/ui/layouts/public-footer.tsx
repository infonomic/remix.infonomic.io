
export function PublicFooter() {
  return (
    <footer className="prose dark:prose-invert text-center w-full min-w-full pt-4 pb-8 px-[18px] leading-4">
      <div style={{ marginBottom: '0.5em' }}>
        <span style={{ fontSize: '0.8em' }}>
          This site is protected by reCAPTCHA and the Google&nbsp;
          {' '}
          <a href="https://policies.google.com/privacy" className="ext" target="_blank" rel="noopener nofollow noreferrer">Privacy Policy</a>
          &nbsp;and&nbsp;
          <a href="https://policies.google.com/terms" className="ext" target="_blank" rel="noopener nofollow noreferrer">
            Terms of Service
          </a>
          &nbsp;apply.
        </span>
      </div>
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
