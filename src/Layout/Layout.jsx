import Header from "./Header";

export default function Layout({ children }) {
  return (
    <>
    <Header />
    <main className="pt-14">{children}</main>
  </>
  );
}
