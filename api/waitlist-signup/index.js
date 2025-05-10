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
        // Create a record for Azure Table Storage
        const tableEntity = {
            PartitionKey: "LearnLensWaitlist",
            RowKey: new Date().getTime().toString(), // Use timestamp as unique row key
            name: name,
            email: email,
            children: children,
            signupDate: new Date().toISOString()
        };
        
        // Send the record to the output binding (Azure Table Storage)
        context.bindings.outputTable = tableEntity;
        
        // Send a success response
        context.res = {
            status: 200,
            body: { 
                message: "Thank you for signing up! We'll be in touch soon.",
                success: true
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