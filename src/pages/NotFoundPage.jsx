import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="container-custom py-16 md:py-24 flex flex-col items-center">
      <h1 className="text-6xl md:text-8xl font-bold text-primary-600 mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">Page Not Found</h2>
      <p className="text-gray-600 text-center max-w-md mb-8">
        Oops! The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn-primary px-8 py-3">
        Return to Home
      </Link>
    </div>
  )
}

export default NotFoundPage