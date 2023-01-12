import "../styles/globals.min.css";
import Layout from "../components/layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { store } from '../store'
import { Provider } from 'react-redux'

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Layout>
        <ToastContainer limit={1} />
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}
