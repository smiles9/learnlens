module.exports = async function (context, req) {
    context.log('Processing waitlist signup request');

    // Handle CORS preflight OPTIONS request
    if (req.method === "OPTIONS") {
        context.res = {
            status: 204,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Max-Age": "86400"
            },
            body: ""
        };
        return;
    }

    try {
        // Get form data from the request
        const name = req.body.name;
        const email = req.body.email;
        const childrenAges = req.body.children || '';
        const submittedDate = new Date().toISOString();

        // Validate required fields
        if (!name || !email) {
            context.res = {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                body: JSON.stringify({ 
                    success: false, 
                    message: "Please provide both name and email" 
                })
            };
            return;
        }

        // Create a unique row key
        const rowKey = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // Store in table storage
        context.bindings.waitlistTable = {
            PartitionKey: "WaitlistSignup",
            RowKey: rowKey,
            name: name,
            email: email,
            childrenAges: childrenAges,
            submittedDate: submittedDate,
            processed: false
        };

        // Return success response
        context.res = {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            body: JSON.stringify({ 
                success: true, 
                message: "Thank you for joining our waitlist!" 
            })
        };
    } catch (error) {
        context.log.error('Error processing signup:', error);
        
        // Return error response
        context.res = {
            status: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            body: JSON.stringify({ 
                success: false, 
                message: "An error occurred processing your request. Please try again." 
            })
        };
    }
}; 