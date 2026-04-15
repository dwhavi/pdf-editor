// PDF Domain — Config
export const PDF_CONFIG = {
  zoom: {
    min: 0.4,
    max: 3.0,
    step: 0.2,
    default: 1.0,
  },
  page: {
    default: 1,
  },
  maxFileSizeMb: 100,
} as const;
