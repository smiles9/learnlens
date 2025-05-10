module.exports = async function (context, req) {
    context.log('Processing waitlist signup form submission.');

    try {
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
        
        // Create timestamp and unique ID
        const timestamp = new Date().toISOString();
        const id = new Date().getTime().toString();
        
        // Create a record for Azure Table Storage
        // Table Storage requires PartitionKey and RowKey
        context.bindings.outputTable = {
            PartitionKey: "waitlist",
            RowKey: id,
            name: name,
            email: email,
            children: children,
            signupDate: timestamp
        };
        
        // Log the submission
        context.log('New signup:', name, email);
        
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