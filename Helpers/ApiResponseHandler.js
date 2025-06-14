

const APIResponseHandler = {

    HTTP_200_OK: (res, data = {}, message = "Request successful") => {
        return res.status(200).json({
            status: 200,
            code: "HTTP_200_OK",
            message,
            data
        });
    },

    HTTP_201_CREATED: (res, data = {}, message = "Resource created successfully") => {
        return res.status(201).json({
            status: 201,
            code: "HTTP_201_CREATED",
            message,
            data
        });
    },

    HTTP_400_BAD_REQUEST: (res, message = "Bad request", data = {}) => {
        return res.status(400).json({
            status: 400,
            code: "HTTP_400_BAD_REQUEST",
            message,
            data
        });
    },

    HTTP_401_UNAUTHORIZED: (res, message = "Unauthorized access", data = {}) => {
        return res.status(401).json({
            status: 401,
            code: "HTTP_401_UNAUTHORIZED",
            message,
            data
        });
    },

    HTTP_403_FORBIDDEN: (res, message = "Permission denied", data = {}) => {
        return res.status(403).json({
            status: 403,
            code: "HTTP_403_FORBIDDEN",
            message,
            data
        });
    },

    HTTP_404_NOT_FOUND: (res, message = "Resource not found", data = {}) => {
        return res.status(404).json({
            status: 404,
            code: "HTTP_404_NOT_FOUND",
            message,
            data
        });
    },

    HTTP_409_CONFLICT: (res, message = "Resource conflict", data = {}) => {
        return res.status(409).json({
            status: 409,
            code: "HTTP_409_CONFLICT",
            message,
            data
        });
    },

    HTTP_500_INTERNAL_SERVER_ERROR: (res, message = "Internal server error", data = {}) => {
        return res.status(500).json({
            status: 500,
            code: "HTTP_500_INTERNAL_SERVER_ERROR",
            message,
            data
        });
    },

    HTTP_503_SERVICE_UNAVAILABLE: (res, message = "Service unavailable", data = {}) => {
        return res.status(503).json({
            status: 503,
            code: "HTTP_503_SERVICE_UNAVAILABLE",
            message,
            data
        });
    },

    HTTP_204_NO_CONTENT: (res, message = "No content", data = {}) => {
        return res.status(204).json({
            status: 204,
            code: "HTTP_204_NO_CONTENT",
            message,
            data
        });
    },

    HTTP_405_METHOD_NOT_ALLOWED: (res, message = "Method not allowed", data = {}) => {
        return res.status(405).json({
            status: 405,
            code: "HTTP_405_METHOD_NOT_ALLOWED",
            message,
            data
        });
    },

    HTTP_406_NOT_ACCEPTABLE: (res, message = "Not acceptable", data = {}) => {
        return res.status(406).json({
            status: 406,
            code: "HTTP_406_NOT_ACCEPTABLE",
            message,
            data
        });
    },

    HTTP_415_UNSUPPORTED_MEDIA_TYPE: (res, message = "Unsupported media type", data = {}) => {
        return res.status(415).json({
            status: 415,
            code: "HTTP_415_UNSUPPORTED_MEDIA_TYPE",
            message,
            data
        });
    },

    HTTP_429_TOO_MANY_REQUESTS: (res, message = "Too many requests", data = {}) => {
        return res.status(429).json({
            status: 429,
            code: "HTTP_429_TOO_MANY_REQUESTS",
            message,
            data
        });
    },

    HTTP_422_UNPROCESSABLE_ENTITY: (res, message = "Unprocessable entity", data = {}) => {
        return res.status(422).json({
            status: 422,
            code: "HTTP_422_UNPROCESSABLE_ENTITY",
            message,
            data
        });
    }
};

export default APIResponseHandler;