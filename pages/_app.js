import '../global.css'
import '../styles/tailwind.css';
import Head from "next/head";

export default function MyApp({ Component, pageProps }) {
  return  <>
  {/* Add the favicon */}
  <Head>
    <link rel="shortcut icon" href="/favicon.png" />
  </Head>
  {/* Add the favicon */}
  {/* Note that the path doesn't include "public" */}

  <Component {...pageProps} />
</>
}
