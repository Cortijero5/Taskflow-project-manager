export const TASK_STATUSES = {
    TODO: "TODO",
    IN_PROGRESS: "IN_PROGRESS",
    DONE: "DONE",
};

export const TASK_PRIORITIES = {
    LOW: "LOW",
    MEDIUM: "MEDIUM",
    HIGH: "HIGH",
};

export const statusLabels = {
    [TASK_STATUSES.TODO]: "Pendiente",
    [TASK_STATUSES.IN_PROGRESS]: "En progreso",
    [TASK_STATUSES.DONE]: "Hecho",
};

export const priorityLabels = {
    [TASK_PRIORITIES.LOW]: "Baja",
    [TASK_PRIORITIES.MEDIUM]: "Media",
    [TASK_PRIORITIES.HIGH]: "Alta",
};

export const statusOptions = [
    { label: statusLabels[TASK_STATUSES.TODO], value: TASK_STATUSES.TODO },
    {
        label: statusLabels[TASK_STATUSES.IN_PROGRESS],
        value: TASK_STATUSES.IN_PROGRESS,
    },
    { label: statusLabels[TASK_STATUSES.DONE], value: TASK_STATUSES.DONE },
];

export const priorityOptions = [
    { label: priorityLabels[TASK_PRIORITIES.LOW], value: TASK_PRIORITIES.LOW },
    {
        label: priorityLabels[TASK_PRIORITIES.MEDIUM],
        value: TASK_PRIORITIES.MEDIUM,
    },
    { label: priorityLabels[TASK_PRIORITIES.HIGH], value: TASK_PRIORITIES.HIGH },
];

export const statusStyles = {
    [TASK_STATUSES.TODO]: {
        column: "border-yellow-200 bg-yellow-50",
        header: "text-yellow-800",
        badge: "bg-yellow-100 text-yellow-800",
    },
    [TASK_STATUSES.IN_PROGRESS]: {
        column: "border-blue-200 bg-blue-50",
        header: "text-blue-800",
        badge: "bg-blue-100 text-blue-800",
    },
    [TASK_STATUSES.DONE]: {
        column: "border-green-200 bg-green-50",
        header: "text-green-800",
        badge: "bg-green-100 text-green-800",
    },
};

export const priorityStyles = {
    [TASK_PRIORITIES.LOW]: "bg-green-50 text-green-700",
    [TASK_PRIORITIES.MEDIUM]: "bg-yellow-50 text-yellow-700",
    [TASK_PRIORITIES.HIGH]: "bg-red-50 text-red-700",
};