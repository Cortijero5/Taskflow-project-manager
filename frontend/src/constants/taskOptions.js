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