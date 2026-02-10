export const HTTP_CONSTANTS = {
  STATUS_CODES: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_ERROR: 500,
  },
  HEADERS: {
    CONTENT_TYPE: "Content-Type",
    AUTHORIZATION: "Authorization",
    CACHE_CONTROL: "Cache-Control",
  },
  CONTENT_TYPES: {
    JSON: "application/json",
    XML: "application/xml",
    FORM: "application/x-www-form-urlencoded",
  },
} as const;
