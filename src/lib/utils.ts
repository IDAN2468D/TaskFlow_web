/**
 * Utility: Converts minutes into a human-readable duration string.
 * Example: 75 -> "1h 15m", 30 -> "30m"
 */
export const formatDuration = (minutes: number | undefined | null) => {
  if (!minutes || minutes <= 0) return '0m';
  
  if (minutes < 60) return `${minutes}m`;
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

/**
 * Utility: Serializes Mongoose documents into plain objects for RSC compatibility.
 * Considers nested subtasks, ObjectIds, and Date objects.
 */
export const serializeTask = (task: any) => {
  if (!task) return null;
  // Convert to plain object if it's a Mongoose document
  const obj = task.toObject ? task.toObject() : task;

  return {
    ...obj,
    _id: obj._id?.toString() || "",
    userId: obj.userId?.toString() || "",
    subTasks: (obj.subTasks || []).map((st: any) => ({
      ...st,
      _id: st._id?.toString(),
    })),
    // ISO strings for dates
    dueDate: obj.dueDate ? (obj.dueDate instanceof Date ? obj.dueDate.toISOString() : obj.dueDate) : null,
    createdAt: obj.createdAt ? (obj.createdAt instanceof Date ? obj.createdAt.toISOString() : obj.createdAt) : null,
    updatedAt: obj.updatedAt ? (obj.updatedAt instanceof Date ? obj.updatedAt.toISOString() : obj.updatedAt) : null,
  };
};

/**
 * Utility: Serializes Project documents.
 */
export const serializeProject = (project: any) => {
  if (!project) return null;
  const obj = project.toObject ? project.toObject() : project;

  return {
    ...obj,
    _id: obj._id?.toString() || "",
    userId: obj.userId?.toString() || "",
    createdAt: obj.createdAt ? (obj.createdAt instanceof Date ? obj.createdAt.toISOString() : obj.createdAt) : null,
    updatedAt: obj.updatedAt ? (obj.updatedAt instanceof Date ? obj.updatedAt.toISOString() : obj.updatedAt) : null,
  };
};

/**
 * Utility: Serializes User documents.
 */
export const serializeUser = (user: any) => {
  if (!user) return null;
  const obj = user.toObject ? user.toObject() : user;

  return {
    ...obj,
    _id: obj._id?.toString() || "",
  };
};
