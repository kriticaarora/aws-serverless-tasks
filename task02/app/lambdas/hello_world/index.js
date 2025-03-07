exports.handler = async (event) => {
    // TODO implement
    const response = {
        statusCode: 200,
        message: "Hello from Lambda!",
        statusCode: 400,
        message: "Bad request syntax or unsupported method. Request path: {path}. HTTP method: {method}"
        
    };
    return response;
};
