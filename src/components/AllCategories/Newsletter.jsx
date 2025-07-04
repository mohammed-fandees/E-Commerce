import React, { useState } from "react";
import { toast } from "sonner";

const Newsletter = ({ t }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      toast.success(t("categories.newsletter.success"));
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <div className="bg-gradient-to-r from-[#db4444] to-red-600 rounded-lg p-8 text-center text-white mb-8">
      <h3 className="text-2xl font-bold mb-2">{t("categories.newsletter.title")}</h3>
      <p className="mb-6 opacity-90">{t("categories.newsletter.description")}</p>
      {subscribed ? (
        <div className="text-green-200 font-medium">
          {t("categories.newsletter.success")}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder={t("categories.newsletter.email_placeholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 px-4 py-2 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2focus:ring-opacity-50"
          />
          <button
            type="submit"
            className="px-6 py-2  bg-white text-[#db4444] rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200"
          >
            {t("categories.newsletter.subscribe")}
          </button>
        </form>
      )}
    </div>
  );
};

export default Newsletter;
