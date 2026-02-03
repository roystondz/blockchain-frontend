import React from "react";
import { Shield, AlertCircle, CheckCircle, Clock, Activity } from "lucide-react";

const StatusBadge = ({ status, size = "md" }) => {
  const statusConfig = {
    active: {
      icon: Activity,
      color: "green",
      text: "Active",
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      iconColor: "text-green-600"
    },
    pending: {
      icon: Clock,
      color: "yellow",
      text: "Pending",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
      iconColor: "text-yellow-600"
    },
    inactive: {
      icon: AlertCircle,
      color: "red",
      text: "Inactive",
      bgColor: "bg-red-100",
      textColor: "text-red-800",
      iconColor: "text-red-600"
    },
    verified: {
      icon: CheckCircle,
      color: "blue",
      text: "Verified",
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
      iconColor: "text-blue-600"
    },
    blockchain: {
      icon: Shield,
      color: "purple",
      text: "Blockchain",
      bgColor: "bg-purple-100",
      textColor: "text-purple-800",
      iconColor: "text-purple-600"
    }
  };

  const config = statusConfig[status] || statusConfig.active;
  const Icon = config.icon;

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.bgColor} ${config.textColor} ${sizeClasses[size]}`}>
      <Icon className={iconSizes[size]} />
      {config.text}
    </span>
  );
};

export default StatusBadge;
