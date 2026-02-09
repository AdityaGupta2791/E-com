import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-red-100 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <h1 className="text-9xl font-bold text-red-500 mb-2">404</h1>
          <h2 className="text-4xl font-bold text-center pt-4">
            Page Not Found
          </h2>
        </div>

        <p className="text-center mt-2.5 mb-5">
          Sorry, the page you're looking for doesn't exist. 
        </p>
        
        <div className="mt-8">
          <Link to="/" className="underline text-lg font-semibold text-red-500">Go to Signin Page</Link>
        </div>
      </div>
    </div>
  );
}