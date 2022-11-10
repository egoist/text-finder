import "../css/tailwind.css"
import "tippy.js/dist/tippy.css"
import type { AppProps } from "next/app"

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
