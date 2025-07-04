import React, { useState, useEffect } from 'react';
import { Star, Calendar, MessageCircle, ChevronDown, ShoppingCart, CheckCircle } from 'lucide-react';
import { Skeleton } from '@mui/material';
import Button from '@/components/common/Button';
import supabase from '@/services/supabase/supabaseClient';
import { fetchReviews, addReview, getUserReview } from '@/services/apis';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

async function hasPurchasedProduct(productId) {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    console.error('User not authenticated.');
    return false;
  }

  const userId = user.id;

  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('id')
    .eq('status', 'completed')
    .eq('user_id', userId);

  if (ordersError) {
    console.error('Error fetching orders:', ordersError);
    return false;
  }

  if (!orders || orders.length === 0) {
    return false;
  }

  const orderIds = orders.map(o => o.id);

  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('order_id, product_id')
    .in('order_id', orderIds);

  if (itemsError) {
    console.error('Error fetching order items:', itemsError);
    return false;
  }

  if (!items || items.length === 0) {
    return false;
  }

  return items.some(item => String(item.product_id) === String(productId));
}




export default function ProductReviews({ productId = "1", user = { name: "John Doe", email: "john@example.com" } }) {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [canReview, setCanReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [userReview, setUserReview] = useState(null);
  const [hoverRating, setHoverRating] = useState(0);
  const [visibleReviews, setVisibleReviews] = useState(2);
  const [, setIsExpanded] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userReviewLoading, setUserReviewLoading] = useState(true);
  const [avatarLoading, setAvatarLoading] = useState(true);

  // Load reviews from Supabase
  useEffect(() => {
    let ignore = false;
    setLoading(true);
    fetchReviews(productId).then(data => {
      if (!ignore) {
        setReviews(data || []);
        setLoading(false);
      }
    }).catch(() => {
      if (!ignore) {
        setReviews([]);
        setLoading(false);
      }
    });
    return () => { ignore = true; };
  }, [productId]);

  // Check if user can review (has paid for this product) and hasn't reviewed yet
  useEffect(() => {
    if (!user) {
      setCanReview(false);
      setHasReviewed(false);
      setUserReview(null);
      setUserReviewLoading(false);
      return;
    }

    setUserReviewLoading(true);

    hasPurchasedProduct(productId, user.email).then(hasPurchased => {
      setCanReview(hasPurchased);
    });

    getUserReview(productId, user.email).then(existingReview => {
      if (existingReview) {
        setHasReviewed(true);
        setUserReview(existingReview);
      } else {
        setHasReviewed(false);
        setUserReview(null);
      }
      setUserReviewLoading(false);
    }).catch(() => {
      setHasReviewed(false);
      setUserReview(null);
      setUserReviewLoading(false);
    });
  }, [user, productId, reviews]);

  useEffect(() => {
    const fetchUserAvatar = async () => {
      setAvatarLoading(true);
      const { data: { user }, error } = await supabase.auth.getUser();

      if (!error && user) {
        const avatarUrl = user.user_metadata?.avatar_url || null;
        console.log(avatarUrl);
        setAvatar(avatarUrl);
      }
      setAvatarLoading(false);
    };

    fetchUserAvatar();
  }, []);

  const handleSubmit = async () => {
    if (!reviewText.trim()) return;
    toast.promise(
      (async () => {
        // Double check if user already reviewed (defensive, for race conditions)
        const already = await getUserReview(productId, user.email);
        if (already) throw new Error('You have already reviewed this product.');

        // Check if product exists in Supabase before submitting review
        const { data: product, error: productError } = await supabase
          .from('products')
          .select('id')
          .eq('id', productId)
          .maybeSingle();
        if (productError) throw new Error('Error checking product existence.');
        if (!product) throw new Error('This product does not exist. Cannot submit review.');

        const newReview = await addReview({
          product_id: productId,
          user_name: user?.name || user?.email || 'Anonymous',
          user_email: user?.email,
          user_avatar: avatar,
          rating,
          text: reviewText,
        });
        setReviews([newReview, ...reviews]);
        setReviewText('');
        setRating(5);
        setHoverRating(0);
        setHasReviewed(true);
        setUserReview(newReview);
        setCanReview(false);
      })(),
      {
        loading: 'Submitting your review...',
        success: 'Review submitted successfully!',
        error: (err) => err?.message || 'Failed to submit review. You may have already reviewed this product.',
      }
    );
  };

  const handleShowMore = () => {
    if (visibleReviews >= reviews.length) {
      setVisibleReviews(2);
      setIsExpanded(false);
    } else {
      const nextIncrement = Math.min(3, reviews.length - visibleReviews);
      setVisibleReviews(prev => prev + nextIncrement);
      setIsExpanded(true);
    }
  };

  const StarRating = ({ value, interactive = false, size = "w-5 h-5" }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} transition-colors cursor-pointer ${star <= (interactive ? hoverRating || rating : value)
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300'
              }`}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            onClick={() => interactive && setRating(star)}
          />
        ))}
      </div>
    );
  };

  // Skeleton Components
  const HeaderSkeleton = () => (
    <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-8 mb-4 sm:mb-8 border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 mb-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="bg-[#db444410] p-2 sm:p-3 rounded-full">
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#db4444]" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{t('product.productReviews.customerReviews')}</h3>
            <p className="text-sm sm:text-base text-gray-600 mt-1">{t('product.productReviews.shareExperience')}</p>
          </div>
        </div>
        <div className="text-left sm:text-right">
          <div className="flex items-center gap-2 sm:justify-end mb-1">
            <Skeleton variant="text" width={40} height={36} />
            <Skeleton variant="rectangular" width={120} height={24} />
          </div>
          <Skeleton variant="text" width={80} height={20} />
        </div>
      </div>
    </div>
  );

  const ReviewFormSkeleton = () => (
    <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
      <div className="mb-4 sm:mb-6">
        <Skeleton variant="text" width={120} height={24} className="mb-2 sm:mb-3" />
        <Skeleton variant="rectangular" width={200} height={32} />
      </div>
      <div className="mb-4">
        <Skeleton variant="text" width={100} height={24} className="mb-2" />
        <Skeleton variant="rectangular" width="100%" height={96} />
      </div>
      <Skeleton variant="rectangular" width={120} height={40} />
    </div>
  );

  const ReviewSkeleton = () => (
    <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="min-w-0 flex-1">
            <Skeleton variant="text" width={120} height={24} />
            <Skeleton variant="rectangular" width={100} height={16} />
          </div>
        </div>
        <Skeleton variant="text" width={80} height={20} />
      </div>
      <Skeleton variant="rectangular" width="100%" height={60} />
    </div>
  );

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="mt-6 sm:mt-12 max-w-4xl mx-auto">
      {/* Header Section */}
      {loading ? (
        <HeaderSkeleton />
      ) : (
        <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-8 mb-4 sm:mb-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 mb-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="bg-[#db444410] p-2 sm:p-3 rounded-full">
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#db4444]" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{t("product.productReviews.customerReviews")}</h3>
                <p className="text-sm sm:text-base text-gray-600 mt-1">{t("product.productReviews.shareExperience")}</p>
              </div>
            </div>
            {reviews.length > 0 && (
              <div className="text-left sm:text-right">
                <div className="flex items-center gap-2 sm:justify-end mb-1">
                  <span className="text-2xl sm:text-3xl font-bold text-gray-900">{averageRating}</span>
                  <StarRating value={Math.round(averageRating)} />
                </div>
                <p className="text-sm text-gray-500">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
              </div>
            )}
          </div>

          {/* Review Form */}
          {userReviewLoading ? (
            <ReviewFormSkeleton />
          ) : (
            <>
              {canReview && !hasReviewed && (
                <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
                  <div className="mb-4 sm:mb-6">
                    <div className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                      {t('product.productReviews.rateProduct')}
                    </div>
                    <StarRating value={rating} interactive={true} size="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>

                  <div className="mb-4">
                    <div className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('product.productReviews.yourReview')}
                    </div>
                    <textarea
                      className="w-full border border-gray-300 outline-none rounded-lg p-3 sm:p-4 resize-none text-sm sm:text-base"
                      rows={3}
                      placeholder="Share your thoughts about this product..."
                      value={reviewText}
                      onChange={e => setReviewText(e.target.value)}
                      required
                    />
                  </div>

                  <Button onClick={handleSubmit}>
                    {t('product.productReviews.submitReview')}
                  </Button>
                </div>
              )}

              {/* Already Reviewed State */}
              {hasReviewed && userReview && (
                <div className="bg-green-50 border border-green-200 rounded-lg sm:rounded-xl p-4 sm:p-6">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-full flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-green-800 text-sm sm:text-base mb-2">
                        {t('product.productReviews.thankYou')}
                      </h4>
                      <p className="text-green-700 text-sm sm:text-base mb-3">
                        {t('product.productReviews.alreadyReviewed')}
                      </p>

                      {/* User's Review Display */}
                      <div className="bg-white rounded-lg p-3 sm:p-4 border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <StarRating value={userReview.rating} size="w-4 h-4" />
                          <span className="text-sm text-gray-600">({userReview.rating}/5)</span>
                          <span className="text-xs text-gray-500 ml-auto">
                            {new Date(userReview.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                          "{userReview.text}"
                        </p>
                      </div>

                      <p className="text-green-600 text-xs sm:text-sm mt-3 italic">
                        {t('product.productReviews.onlyOnce')}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Purchase Required State */}
              {!canReview && !hasReviewed && (
                <div className="bg-[#db444410] border border-[#db444430] rounded-lg sm:rounded-xl p-4 sm:p-6 text-center">
                  <div className="inline-flex items-center gap-2 text-[#db4444] mb-2">
                    <ShoppingCart className="w-5 h-5" />
                    <span className="font-medium text-sm sm:text-base">{t('product.productReviews.purchaseRequired')}</span>
                  </div>
                  <p className="text-[#db4444] text-sm sm:text-base">{t('product.productReviews.needToPurchase')}</p>
                  <p className="text-[#db4444] text-xs sm:text-sm mt-1 opacity-80">{t('product.productReviews.onlyVerified')}</p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4 sm:space-y-6">
        {loading ? (
          // Show skeleton loading for reviews
          Array.from({ length: 1 }).map((_, index) => (
            <ReviewSkeleton key={index} />
          ))
        ) : (
          <>
            {reviews.length === 0 && (
              <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg sm:rounded-xl border-2 border-dashed border-gray-200">
                <MessageCircle className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-base sm:text-lg">{t('product.productReviews.noReviewsYet')}</p>
                <p className="text-gray-400 text-sm mt-1">{t('product.productReviews.beFirst')}</p>
              </div>
            )}

            {reviews.slice(0, visibleReviews).map((review, index) => (
              <div key={index} className={`bg-white rounded-lg sm:rounded-xl border p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-200 ${review.email === user?.email ? 'border-green-200 bg-green-50' : 'border-gray-200'
                }`}>
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="bg-gradient-to-br from-[#db4444] to-[#b73333] w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 overflow-hidden">
                      {avatarLoading ? (
                        <Skeleton variant="circular" width="100%" height="100%" />
                      ) : review.user_avatar ? (
                        <img loading="lazy" src={review.user_avatar} alt="User Avatar" className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
                      ) : (
                        review.user?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{review.user}</h4>
                        {review.email === user?.email && (
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                            Your Review
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <StarRating value={review.rating} size="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm text-gray-500">({review.rating}/5)</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400 text-xs sm:text-sm flex-shrink-0 ml-2">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">
                      {new Date(review.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="sm:hidden">
                      {new Date(review.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                <div className="text-gray-700 leading-relaxed bg-gray-50 p-3 sm:p-4 rounded-lg text-sm sm:text-base">
                  "{review.text}"
                </div>
              </div>
            ))}

            {/* Show More Button */}
            {reviews.length > 2 && (
              <div className="text-center pt-4">
                <button
                  onClick={handleShowMore}
                  className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-[#db444410] hover:bg-[#db444420] text-[#db4444] rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base"
                >
                  {visibleReviews >= reviews.length ? (
                    <>
                      {t('product.productReviews.showLess')}
                      <ChevronDown className="w-4 h-4 rotate-180 transition-transform duration-200" />
                    </>
                  ) : (
                    <>
                      {t('product.productReviews.showMore')} ({reviews.length - visibleReviews} remaining)
                      <ChevronDown className="w-4 h-4 transition-transform duration-200" />
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}