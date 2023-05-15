import "../global.css";
import "../styles/tailwind.css";
import Head from "next/head";
import Script from "next/script";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      {/* Add the favicon */}
      <Head>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-Q7M02KM7WF"
        />

        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Q7M02KM7WF');
        `,
          }}
        />

        <link rel="shortcut icon" href="/favicon.png" />
      </Head>
      {/* Add the favicon */}
      {/* Note that the path doesn't include "public" */}

      <Component {...pageProps} />
    </>
  );
}
