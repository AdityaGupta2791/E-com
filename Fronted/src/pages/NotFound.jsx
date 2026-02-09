import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <section className="space-y-2">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-slate-600">
        The page you are looking for does not exist.
      </p>
      <Link to="/" className="text-sm font-medium text-slate-900 underline">
        Go home
      </Link>
    </section>
  );
}

export default NotFound;
