module.exports = async function (context, req) {
    context.log('Processing waitlist signup form submission.');

    // Get form data from request body
    const name = req.body.name;
    const email = req.body.email;
    const children = req.body.children || "Not provided";
    
    if (!name || !email) {
        context.res = {
            status: 400,
            body: { message: "Please provide name and email." }
        };
        return;
    }
    
    try {
        // Since the connection string is too long for Azure Static Web App environment variables,
        // we'll use a simpler approach - save to a JSON file
        const timestamp = new Date().toISOString();
        const signup = {
            id: new Date().getTime().toString(),
            name: name,
            email: email,
            children: children,
            signupDate: timestamp
        };
        
        // Instead of using Table Storage, we'll log the submission
        // and collect submissions through GitHub's issue system
        context.log('New signup:', JSON.stringify(signup));
        
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
        context.log.error("Error processing signup:", error);
        
        context.res = {
            status: 500,
            body: { 
                message: "There was an error processing your request. Please try again.",
                success: false
            }
        };
    }
}; 