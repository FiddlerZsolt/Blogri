import { Html, Head, Main, NextScript } from "next/document";
import Splashscreen from "../components/splash";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&family=Send+Flowers&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="dark:bg-slate-800">
        {/* <Splashscreen /> */}
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
