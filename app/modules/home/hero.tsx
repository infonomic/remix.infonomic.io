import type { LinksFunction } from '@remix-run/node'
import { Link } from '@remix-run/react'

import { useOptionalUser } from '~/utils'

import { Button } from '~/ui/components/button'
import { Container } from '~/ui/components/container'
import { Section } from '~/ui/components/section'

import styles from '~/styles/app/modules/home/hero.css'

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: styles }]
}

export function Hero() {
  const user = useOptionalUser()

  return (
    <Section className="flex-1 flex flex-col justify-center items-center lg:py-8 lg:px-16 dark">
      <Container className="relative overflow-hidden flex-1 w-full flex flex-col justify-center items-center lg:rounded-3xl">
        <div style={{ position: 'absolute', inset: '0' }}>
          <img
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            src="https://user-images.githubusercontent.com/1500684/157774694-99820c51-8165-4908-a031-34fc371ac0d6.jpg"
            alt="Sonic Youth On Stage"
          />
          <div style={{ position: 'absolute', inset: '0', backgroundColor: 'rgba(254,204,27,0.5)', mixBlendMode: 'multiply' }} />
        </div>
        <div className="relative prose max-w-full">
          <h1 className="font-display text-[6rem] lg:text-[8rem] block text-amber-400 text-center uppercase my-0 mx-0">
            Indie Stack
          </h1>
          <p style={{ margin: '1.5rem auto 0', textAlign: 'center', color: 'white' }}>
            Check the README.md file for instructions on how to get this
            project deployed.
          </p>
          <div>
            {user
              ? (
                <div style={{ display: 'flex', gap: '18px', justifyContent: 'center', margin: '1rem 0' }}>
                  <Button
                    asChild
                    variant="outlined"
                    intent="primary"
                    size="lg"
                    className="rounded-lg py-3 px-10 !text-black bg-amber-500/70 hover:bg-amber-400/70">
                    <Link to="/notes">
                      View notes for {user.email}
                    </Link>
                  </Button>
                </div>
              )
              : (
                <div style={{ display: 'flex', gap: '18px', justifyContent: 'center', alignItems: 'center', margin: '1rem 0' }}>
                  <Button
                    asChild
                    variant="outlined"
                    intent="primary"
                    size="lg"
                    className="rounded-lg py-3 px-8 border-2 bg-gray-50 hover:bg-gray-100 font-medium !text-black focus:ring-0 focus:ring-offset-0">
                    <Link to="/sign-up">
                      Sign Up
                    </Link>
                  </Button>
                  <Button
                    asChild
                    intent="primary"
                    size="lg"
                    className="rounded-lg py-3 px-8 border-2 border-amber-500 focus:ring-0 focus:ring-offset-0 font-medium">
                    <Link to="/sign-in">
                      Sign In
                    </Link>
                  </Button>
                </div>
              )}
          </div>
          <a href="https://remix.run" style={{ display: 'block', margin: '56px' }}>
            <img
              src="https://user-images.githubusercontent.com/1500684/158298926-e45dafff-3544-4b69-96d6-d3bcc33fc76a.svg"
              alt="Remix"
              style={{ margin: '0 auto', width: '240px' }}
            />
          </a>
        </div>
      </Container >
    </Section >
  )
}