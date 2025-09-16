export const calculateTimeRemaining = (dueDate) => {
  const now = new Date();
  const targetDate = new Date(dueDate);
  const difference = targetDate - now;

  const isOverdue = difference < 0;
  const absoluteDifference = Math.abs(difference);

  const days = Math.floor(absoluteDifference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((absoluteDifference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((absoluteDifference / 1000 / 60) % 60);
  const seconds = Math.floor((absoluteDifference / 1000) % 60);

  return { days, hours, minutes, seconds, isOverdue };
};

export const formatTimeDisplay = (timeRemaining, isCompleted) => {
  if (isCompleted) {
    return "已完成";
  }

  const { days, hours, minutes, seconds, isOverdue } = timeRemaining;
  const prefix = isOverdue ? "已逾期" : "剩余";

  if (days > 0) {
    return `${prefix} ${days}天 ${hours}小时`;
  }
  if (hours > 0) {
    return `${prefix} ${hours}小时 ${minutes}分钟`;
  }
  return `${prefix} ${minutes}分钟 ${seconds}秒`;
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" });
};

export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
};

export const isUpcoming = (dueDate) => {
  const now = new Date();
  const targetDate = new Date(dueDate);
  const difference = targetDate - now;
  return difference > 0 && difference < 24 * 60 * 60 * 1000; // 24 hours
};


