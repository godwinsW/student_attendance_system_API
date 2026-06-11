const errorHandler = (error, req, res, next) => {
    console.error(error.stack)
    let statusCode = error.statusCode || 500
    let message = error.message || 'Server Error!'

    if (error.name === 'ValidationError') {
        statusCode = 400
        message = Object.values(error.errors)
            .map(val => val.message)
            .join(', ')
    }

    if (error.name === 'CastError') {
        statusCode = 400
        message = `Invalid ${error.path}: ${error.value}`
    }

    if (error.code === 11000) {
        statusCode = 400
        const field = Object.keys(error.keyValue).join(', ')
        message = `Duplicate value for field: ${field}`
    }

    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    })
}

module.exports = errorHandler;