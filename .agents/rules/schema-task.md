---
trigger: always_on
---

# 📋 Core Schema: Task (Mongoose)

All task-related logic must adhere to this unified schema.

| Field | Type | Details |
| :--- | :--- | :--- |
| `title` | String | Required. Concise and action-oriented. |
| `description` | String | Detailed task context. |
| `status` | Enum | `['Todo', 'InProgress', 'Done']`. Default: `Todo`. |
| `priority` | Enum | `['Low', 'Medium', 'High']`. Default: `Medium`. |
| `dueDate` | Date | Target completion date. |
| `tags` | [String] | e.g., `['Dev', 'AI', 'Urgent']`. |
| `estimatedTime` | Number | Duration in **minutes**. |
| `subTasks` | [Object] | `{ title: String, status: String, estimatedTime: Number }`. |
| `aiInsights` | String | AI-generated recommendations or context. |
| `userId` | ObjectId | Reference to the User owner. |
| `timestamps` | Date | `createdAt`, `updatedAt` (Managed by Mongoose). |

### 🤖 AI Decomposition Rules
When AI decomposes a task:
1. It must return a list of at least 3-5 sub-tasks.
2. Each sub-task must have an `estimatedTime` based on complexity.
3. The `aiInsights` should explain *why* the task was broken down this way.
