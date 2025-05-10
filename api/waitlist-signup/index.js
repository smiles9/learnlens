module.exports = async function (context, req) {
    context.log('Processing waitlist signup form submission.');

    try {
        // Get form data from request body
        const name = req.body && req.body.name;
        const email = req.body && req.body.email;
        const children = req.body && req.body.children || "Not provided";
        
        context.log('Received form data:', { name, email, children });
        
        if (!name || !email) {
            context.log.warn('Missing required fields name or email');
            context.res = {
                status: 400,
                body: { 
                    message: "Please provide name and email.",
                    success: false
                }
            };
            return;
        }
        
        // Create timestamp 
        const timestamp = new Date().toISOString();
        
        // Log the submission instead of saving to table storage
        context.log('New signup - Name:', name, 'Email:', email, 'Children:', children);
        
        // Send a success response
        context.res = {
            status: 200,
            body: { 
                message: "Thank you for signing up! We'll be in touch soon.",
                success: true,
                timestamp: timestamp
            }
        };
    } catch (error) {
        context.log.error("Critical error processing signup:", error);
        
        context.res = {
            status: 500,
            body: { 
                message: "There was an error processing your request. Please try again.",
                success: false,
                error: error.message
            }
        };
    }
}; 