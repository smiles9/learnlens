module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const responseMessage = {
        message: "Hello from the test function! This is working correctly.",
        timestamp: new Date().toISOString()
    };

    context.res = {
        status: 200,
        body: responseMessage
    };
}; 