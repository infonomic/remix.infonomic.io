export function PublicFooter() {
  return (
    <footer className="prose w-full min-w-full px-[18px] pt-4 pb-8 text-center leading-4 dark:prose-invert">
      <div style={{ marginBottom: '0.5em' }}>
        <span style={{ fontSize: '0.8em' }}>
          This site is protected by reCAPTCHA and the Google&nbsp;{' '}
          <a
            href="https://policies.google.com/privacy"
            className="ext"
            target="_blank"
            rel="noopener nofollow noreferrer"
          >
            Privacy Policy
          </a>
          &nbsp;and&nbsp;
          <a
            href="https://policies.google.com/terms"
            className="ext"
            target="_blank"
            rel="noopener nofollow noreferrer"
          >
            Terms of Service
          </a>
          &nbsp;apply.
        </span>
      </div>
      <div>
        <span style={{ fontSize: '0.8em' }}>
          Copyright © {new Date().getFullYear()} Infonomic Company Limited All rights reserved
        </span>
      </div>
    </footer>
  )
}
