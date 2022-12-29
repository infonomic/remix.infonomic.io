/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node/globals" />
declare module '*.css';

export { }

declare global {
  interface Window {
    ENV: any;
  }
}