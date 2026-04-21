import React, { useState } from "react";
import { FiStar } from "react-icons/fi";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { useRatingStore } from "../../store/useRatingStore";
import { useNotificationStore } from "../../store/useNotificationStore";

interface Props {
  open: boolean;
  onClose: () => void;
  deliveryId: string;
  toUserId: string;
  toUserName: string;
  role: "hauler" | "vendor";
}

const RatingModal: React.FC<Props> = ({
  open,
  onClose,
  deliveryId,
  toUserId,
  toUserName,
  role,
}) => {
  const [score, setScore] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const { submitRating, isLoading } = useRatingStore();
  const { addNotification } = useNotificationStore();

  const handleSubmit = async () => {
    if (score === 0) {
      setError("Please select a star rating.");
      return;
    }
    try {
      await submitRating(deliveryId, toUserId, score, review.trim() || undefined);
      setSubmitted(true);
      addNotification({
        type: "rating",
        title: "Rating Submitted",
        message: `You gave ${toUserName} ${score} star${score !== 1 ? "s" : ""}.`,
        deliveryId,
      });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleClose = () => {
    setScore(0);
    setHovered(0);
    setReview("");
    setSubmitted(false);
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 z-[70]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold dark:text-slate-100">
            {submitted ? "Thank you!" : `Rate your ${role}`}
          </DialogTitle>
        </DialogHeader>

        {submitted ? (
          <div className="mt-6 text-center space-y-4">
            <div className="w-16 h-16 bg-amber-50 dark:bg-amber-950/30 rounded-full flex items-center justify-center mx-auto">
              <FiStar className="w-8 h-8 text-amber-500 fill-amber-500" />
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              Your feedback helps build trust in the Haulr network.
            </p>
            <Button
              onClick={handleClose}
              className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
            >
              Done
            </Button>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                How was your experience with{" "}
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {toUserName}
                </span>
                ?
              </p>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => setScore(star)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <FiStar
                      size={32}
                      className={`transition-colors ${
                        star <= (hovered || score)
                          ? "text-amber-400 fill-amber-400"
                          : "text-slate-300 dark:text-slate-600"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {score > 0 && (
                <p className="text-center text-xs font-semibold text-amber-600 mt-2">
                  {["", "Poor", "Fair", "Good", "Great", "Excellent"][score]}
                </p>
              )}
            </div>

            <div>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Leave a comment (optional)..."
                rows={3}
                maxLength={300}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 font-medium">{error}</p>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1 h-11 rounded-xl border-slate-200 dark:border-slate-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isLoading || score === 0}
                className="flex-1 h-11 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold disabled:opacity-50"
              >
                {isLoading ? "Submitting..." : "Submit Rating"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RatingModal;
