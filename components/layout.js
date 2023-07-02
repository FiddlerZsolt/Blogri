import Nav from "./Nav";
import { PageTransition } from "next-page-transitions";
import { useRouter } from "next/router";
import Loader from "./loader";

export default function Layout({ children }) {
  const route = useRouter();
  return (
    <div className="mx-6 md:max-w-2xl md:mx-auto font-poppins">
      <Nav />
      <PageTransition
        timeout={300}
        classNames="page-transition"
        loadingComponent={<Loader />}
        loadingDelay={500}
        loadingTimeout={{
          enter: 1,
          exit: 1000,
        }}
        loadingClassNames="loading-indicator"
      >
        <main key={route.asPath}>{children}</main>
      </PageTransition>

      {/* ====> Scale <==== */}
      <style jsx global>{`
        .page-transition-enter {
          opacity: 0;
          transform-origin: top;
          transform: scaleY(.9);
        }
        .page-transition-enter-active {
          opacity: 1;
          transform-origin: top;
          transform: scaleY(1);
          transition: opacity 80ms, transform 100ms;
        }
        .page-transition-exit {
          opacity: 1;
          transform-origin: top;
          transform: scaleY(1);
        }
        .page-transition-exit-active {
          opacity: 0;
          transform-origin: top;
          transform: scaleY(.9);
          transition: opacity 80ms, transform 100ms;
        }
      `}</style>

      {/* ====> Scale Y <==== */}
      {/* <style jsx global>{`
        .page-transition-enter {
          opacity: 0;
          transform-origin: top;
          transform: translateY(140%);
        }
        .page-transition-enter-active {
          opacity: 1;
          transform-origin: top;
          transform: translateY(0);
          transition: opacity 200ms, transform 300ms;
        }
        .page-transition-exit {
          opacity: 1;
          transform-origin: top;
          transform: translateY(0);
        }
        .page-transition-exit-active {
          opacity: 0;
          transform-origin: top;
          transform: translateY(-140%);
          transition: opacity 200ms, transform 300ms;
        }
      `}</style> */}

      {/* ====> Slide X <==== */}
      {/* <style jsx global>{`
        .page-transition-enter {
          opacity: 0;
          transform: translateX(-40%);
        }
        .page-transition-enter-active {
          opacity: 1;
          transform: translateX(0);
          transition: opacity 200ms, transform 300ms;
        }
        .page-transition-exit {
          opacity: 1;
          transform: translateX(0);
        }
        .page-transition-exit-active {
          opacity: 0;
          transform: translateX(40%);
          transition: opacity 200ms, transform 300ms;
        }
      `}</style> */}
    </div>
  );
}
