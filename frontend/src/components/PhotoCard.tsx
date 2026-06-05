import { memo } from 'react';
import { Photo } from '../types';
import { formatSize, formatDate } from '../utils/format';
import { getOptimizedUrl } from '../utils/cloudinary';

interface PhotoCardProps {
  photo: Photo;
  isAdmin: boolean;
  deleting: string | null;
  onPreview: (photo: Photo) => void;
  onDelete: (id: string) => void;
}

const PhotoCard = memo(({ photo, isAdmin, deleting, onPreview, onDelete }: PhotoCardProps) => {
  return (
    <div className="photo-card">
      <div className="photo-img-wrapper" onClick={() => onPreview(photo)}>
        <img
          src={getOptimizedUrl(photo.url, 400)}
          alt={photo.originalName}
          loading="lazy"
        />
      </div>
      <div className="photo-info">
        <p className="photo-name" title={photo.originalName}>
          {photo.originalName}
        </p>
        {isAdmin && photo.uploadedBy && (
          <p className="photo-uploader">by {photo.uploadedBy.name}</p>
        )}
        <div className="photo-meta">
          <span>{formatSize(photo.size)}</span>
          <span>{formatDate(photo.createdAt)}</span>
        </div>
        <button
          className="btn-delete"
          onClick={() => onDelete(photo.id)}
          disabled={deleting === photo.id}
        >
          {deleting === photo.id ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
});

export default PhotoCard;
