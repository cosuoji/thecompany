export default function Layout({ children }) {
  return (
    <div className="px-4 md:px-12">
      {children} {/* <--- this is important */}
    </div>
  );
}
