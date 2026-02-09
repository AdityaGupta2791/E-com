import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/images.js';

const getId = (product) => product?._id || product?.id;

function ProductCard({ product }) {
  const id = getId(product);
  const imageUrl = getImageUrl(product?.image);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <Link to={id ? `/product/${id}` : '/'} className="block">
        <div className="aspect-[4/5] w-full overflow-hidden rounded-md bg-slate-100">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product?.name || 'Product'}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-slate-400">
              No image
            </div>
          )}
        </div>
        <div className="mt-3 space-y-1">
          <h3 className="text-sm font-semibold text-slate-900">
            {product?.name || 'Untitled'}
          </h3>
          <p className="text-xs text-slate-500 capitalize">
            {product?.category || 'uncategorized'}
          </p>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-slate-900">
              ₹{product?.new_price ?? '--'}
            </span>
            <span className="text-xs text-slate-400 line-through">
              ₹{product?.old_price ?? '--'}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default ProductCard;
