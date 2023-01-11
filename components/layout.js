import Nav from "./Nav";
import { PageTransition } from "next-page-transitions";
import { useRouter } from "next/router";

export default function Layout({ children }) {
  const route = useRouter();
  return (
    <div className="mx-6 md:max-w-2xl md:mx-auto font-poppins">
      <Nav />
      <PageTransition
        timeout={250}
        classNames="page-transition"
      >
        <main key={route.asPath}>{children}</main>
      </PageTransition>

      <style jsx global>{`
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
      `}</style>
    </div>
  );
}
