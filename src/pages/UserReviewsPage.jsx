import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, Calendar, MessageCircle, Package, Edit3, Trash2, Eye } from 'lucide-react';
import Button from '@/components/common/Button';
import Container from '@/routes/Container';
import Breadcrumbs from '@/components/common/Breadcrumbs ';
import supabase from '@/services/supabase/supabaseClient';
import { toast } from 'sonner';

import { Skeleton } from '@mui/material';
import { Navigate } from 'react-router';

export default function UserReviewsPage() {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [editText, setEditText] = useState('');
  const [editRating, setEditRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [visibleReviews, setVisibleReviews] = useState(6);

  useEffect(() => {
    const fetchUserAndReviews = async () => {
      try {
        setLoading(true);
        
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          toast.error(t('reviews.errors.loginRequired'));
          return;
        }
        
        setUser(user);
        
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select(`*,  products (
            id,
            title,
            images,
            price
          )`)
          .eq('user_email', user.email)
          .order('created_at', { ascending: false });

        if (reviewsError) {
          console.error('Error fetching reviews:', reviewsError);
          toast.error(t('reviews.errors.loadFailed'));
          return;
        }

        setReviews(reviewsData || []);
      } catch (error) {
        console.error('Error:', error);
        toast.error(t('reviews.errors.general'));
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndReviews();
  }, [t]);

  const handleEditReview = (review) => {
    setEditingReview(review.id);
    setEditText(review.text);
    setEditRating(review.rating);
    setHoverRating(0);
  };

  const handleSaveEdit = async (reviewId) => {
    if (!editText.trim()) {
      toast.error(t('reviews.errors.emptyText'));
      return;
    }

    try {
      const { error } = await supabase
        .from('reviews')
        .update({
          text: editText,
          rating: editRating,
          created_at: new Date().toISOString() 
        })
        .eq('id', reviewId);

      if (error) throw error;

      setReviews(reviews.map(review => 
        review.id === reviewId 
          ? { ...review, text: editText, rating: editRating, created_at: new Date().toISOString() }
          : review
      ));

      setEditingReview(null);
      setEditText('');
      setEditRating(5);
      toast.success(t('reviews.success.updated'));
    } catch (error) {
      console.error('Error updating review:', error);
      toast.error(t('reviews.errors.updateFailed'));
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      setReviews(reviews.filter(review => review.id !== reviewId));
      toast.success(t('reviews.success.deleted'));
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error(t('reviews.errors.deleteFailed'));
    }
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setEditText('');
    setEditRating(5);
    setHoverRating(0);
  };

  const StarRating = ({ value, interactive = false, size = "w-5 h-5" }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} transition-colors ${interactive ? 'cursor-pointer' : ''} ${
              star <= (interactive ? hoverRating || editRating : value)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            onClick={() => interactive && setEditRating(star)}
          />
        ))}
      </div>
    );
  };

  const ReviewSkeleton = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex items-start gap-4 mb-4">
        <Skeleton variant="rectangular" width={80} height={80} className="rounded-lg" />
        <div className="flex-1">
          <Skeleton variant="text" width="60%" height={24} className="mb-2" />
          <Skeleton variant="text" width="40%" height={20} className="mb-2" />
          <Skeleton variant="rectangular" width={120} height={16} />
        </div>
      </div>
      <Skeleton variant="rectangular" width="100%" height={80} className="mb-4" />
      <div className="flex justify-between items-center">
        <Skeleton variant="text" width={100} height={20} />
        <div className="flex gap-2">
          <Skeleton variant="rectangular" width={80} height={32} />
          <Skeleton variant="rectangular" width={80} height={32} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <Container>
        <div className="min-h-screen ">
          <Breadcrumbs />
          <div className="pt-8">
            {/* Header Skeleton */}
            <div className="mb-8">
              <Skeleton variant="text" width={300} height={40} className="mb-4" />
              <Skeleton variant="text" width={500} height={24} />
            </div>
            
            {/* Reviews Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <ReviewSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container>
        <div className="min-h-screen ">
          <Breadcrumbs />
          <div className="flex flex-col items-center justify-center min-h-[500px] text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {t('reviews.loginRequired.title')}
            </h2>
            <p className="text-gray-600 mb-4">
              {t('reviews.loginRequired.description')}
            </p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="min-h-screen">
        <Breadcrumbs />
        
        <div className="pt-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-[#db444410] p-3 rounded-full">
                <MessageCircle className="w-8 h-8 text-[#db4444]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {t('reviews.title')}
                </h1>
                <p className="text-gray-600 mt-1">
                  {t('reviews.subtitle')}
                </p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-6 border border-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{reviews.length}</div>
                  <div className="text-sm text-gray-600">{t('reviews.stats.totalReviews')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {reviews.length > 0 ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : '0.0'}
                  </div>
                  <div className="text-sm text-gray-600">{t('reviews.stats.averageRating')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {new Set(reviews.map(r => r.products?.id)).size}
                  </div>
                  <div className="text-sm text-gray-600">{t('reviews.stats.productsReviewed')}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Grid */}
          {reviews.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('reviews.empty.title')}
              </h3>
              <p className="text-gray-500 mb-4">
                {t('reviews.empty.description')}
              </p>
              <Button onClick={() => Navigate('/products')}>
                {t('reviews.empty.browseProducts')}
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.slice(0, visibleReviews).map((review) => (
                  <div key={review.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                    {/* Product Info */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {review.products?.images?.[0] ? (
                          <img 
                            src={review.products.images[0]} 
                            alt={review.products.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-2">
                          {review.products?.title || t('reviews.productNotFound')}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          ${review.products?.price?.toFixed(2) || '0.00'}
                        </p>
                        <div className="flex items-center gap-2">
                          <StarRating value={review.rating} size="w-4 h-4" />
                          <span className="text-sm text-gray-500">({review.rating}/5)</span>
                        </div>
                      </div>
                    </div>

                    {/* Review Content */}
                    {editingReview === review.id ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('reviews.form.rating')}
                          </label>
                          <StarRating value={editRating} interactive={true} size="w-6 h-6" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('reviews.form.review')}
                          </label>
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-3 resize-none text-sm"
                            rows={3}
                            placeholder={t('reviews.form.placeholder')}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => handleSaveEdit(review.id)}
                            className="flex-1"
                          >
                            {t('reviews.actions.saveChanges')}
                          </Button>
                          <button
                            onClick={handleCancelEdit}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            {t('reviews.actions.cancel')}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <p className="text-gray-700 leading-relaxed text-sm">
                            "{review.text}"
                          </p>
                        </div>

                        {/* Review Meta & Actions */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(review.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditReview(review)}
                              className="flex items-center gap-1 px-3 py-1.5 text-sm text-[#db4444] hover:bg-[#db444410] rounded-lg transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                              {t('reviews.actions.edit')}
                            </button>
                            <button
                              onClick={() => handleDeleteReview(review.id)}
                              className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              {t('reviews.actions.delete')}
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {reviews.length > visibleReviews && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => setVisibleReviews(prev => prev + 6)}
                    className="px-6 py-3 bg-[#db444410] hover:bg-[#db444420] text-[#db4444] rounded-lg font-medium transition-colors duration-200"
                  >
                    {t('reviews.loadMore', { count: reviews.length - visibleReviews })}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Container>
  );
}