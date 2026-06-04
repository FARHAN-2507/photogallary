import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Photo, Pagination, PhotosResponse, DeleteResponse } from '../types';
import './Photos.css';

const Photos = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 12, total: 0, pages: 0, hasMore: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [preview, setPreview] = useState<Photo | null>(null);
  const navigate = useNavigate();

  const fetchPhotos = useCallback(async (page: number = 1) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get<PhotosResponse>(`/photos?page=${page}&limit=12`);
      if (data.success) {
        setPhotos(data.photos);
        setPagination(data.pagination);
      }
    } catch (err) {
      const axiosErr = err as AxiosError;
      if (axiosErr.response?.status === 401) {
        navigate('/login', { replace: true });
        return;
      }
      const data = axiosErr.response?.data as { message?: string } | undefined;
      setError(data?.message || 'Failed to load photos.');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchPhotos(1);
  }, [fetchPhotos]);

  const handleDelete = async (photoId: string) => {
    if (!window.confirm('Delete this photo?')) return;
    setDeleting(photoId);
    setError('');
    try {
      const { data } = await api.delete<DeleteResponse>(`/photos/${photoId}`);
      if (data.success) {
        setPhotos(prev => prev.filter(p => p.id !== photoId));
        setPagination(prev => ({ ...prev, total: prev.total - 1 }));
      }
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message || 'Failed to delete photo.');
    } finally {
      setDeleting(null);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.pages) {
      fetchPhotos(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  return (
    <div className="photos-page">
      <div className="photos-header">
        <h1>{isAdmin ? 'All Photos' : 'My Photos'}</h1>
        <span className="photo-count">{pagination.total} {pagination.total === 1 ? 'photo' : 'photos'}</span>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-container">
          <div className="spinner" />
          <p>Loading photos...</p>
        </div>
      ) : photos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📷</div>
          <h3>No photos yet</h3>
          <p>Head to Dashboard to upload your first photo.</p>
        </div>
      ) : (
        <>
          <div className="photos-grid">
            {photos.map(photo => (
              <div key={photo.id} className="photo-card">
                <div className="photo-img-wrapper" onClick={() => setPreview(photo)}>
                  <img
                    src={photo.url}
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
                    onClick={() => handleDelete(photo.id)}
                    disabled={deleting === photo.id}
                  >
                    {deleting === photo.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="pagination">
              <button
                className="btn-page"
                disabled={pagination.page <= 1}
                onClick={() => handlePageChange(pagination.page - 1)}
              >
                Previous
              </button>
              <span className="page-info">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                className="btn-page"
                disabled={!pagination.hasMore}
                onClick={() => handlePageChange(pagination.page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {preview && (
        <div className="preview-overlay" onClick={() => setPreview(null)}>
          <div className="preview-content" onClick={e => e.stopPropagation()}>
            <button className="preview-close" onClick={() => setPreview(null)}>×</button>
            <img src={preview.url} alt={preview.originalName} />
            <p className="preview-name">{preview.originalName}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Photos;
