// components/LoadingScreen.jsx
export const LoadingScreen = ({ message = "Loading..." }) => (
    <div className="flex items-center justify-center h-screen text-xl font-medium">
      {message}
    </div>
  );
  