import React from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { FiClock, FiUsers } from "react-icons/fi";

const CampaignCard = ({ campaign }) => {
  // Calculate progress percentage
  const progressPercentage = Math.min(
    Math.round((campaign.donated / campaign.target) * 100),
    100
  );

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format time remaining
  const getTimeRemaining = (endDate) => {
    try {
      const end = new Date(endDate);
      return formatDistanceToNow(end, { addSuffix: true });
    } catch (error) {
      return "Date unavailable";
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
      {/* Campaign Image */}
      <div className="relative">
        <img
          src={campaign.imageUrl || "https://source.unsplash.com/random/800x600/?project"}
          alt={campaign.title}
          className="w-full h-44 object-cover"
        />
        {campaign.status === "trending" && (
          <div className="absolute top-3 right-3 bg-primary-500 text-white text-xs font-medium px-2 py-1 rounded-md">
            Trending
          </div>
        )}
      </div>

      {/* Campaign Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
          {campaign.title}
        </h3>
        <p className="text-gray-600 mb-3 text-sm line-clamp-2">
          {campaign.description}
        </p>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className="bg-primary-500 h-1.5 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1 text-sm">
            <span className="font-medium text-primary-600">
              {formatCurrency(campaign.donated)}
            </span>
            <span className="text-gray-500 text-xs">
              {progressPercentage}% of {formatCurrency(campaign.target)}
            </span>
          </div>
        </div>

        {/* Campaign Stats */}
        <div className="flex text-xs text-gray-500 mb-3 space-x-4">
          <div className="flex items-center">
            <FiUsers className="mr-1 text-gray-400" />
            <span>{campaign.donors} donors</span>
          </div>
          <div className="flex items-center">
            <FiClock className="mr-1 text-gray-400" />
            <span>{getTimeRemaining(campaign.endDate)}</span>
          </div>
        </div>

        {/* Action Button */}
        <Link
          to={`/campaign/${campaign.id}`}
          className="block w-full text-center bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-md transition duration-200 text-sm"
        >
          View Project
        </Link>
      </div>
    </div>
  );
};

export default CampaignCard;
