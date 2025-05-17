// Lambda function for lamba-mcp-server

// ES Modules syntax - causing the error
// export const handler = async (event) => {
module.exports.handler = async (event) => { // changed from ES Modules syntax to older CommonJS syntax for compatibility with tests; AWS is usually several versions behind
  console.log('Received event:', JSON.stringify(event));
  
  try {
    // Parse request body
    let body = event.body;
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }
    
    // Handle MCP tool call
    if (body.type === 'tool_call' && body.name === 'learn_mcp') {
      const topic = body.parameters?.topic?.toLowerCase() || '';
      
      // Collection of MCP learning resources
      const resources = [
        {
          title: "MCP Official Documentation",
          description: "Comprehensive guide to the Model Context Protocol with detailed explanations of concepts and implementation details.",
          url: "https://modelcontextprotocol.io/docs/",
          resource_type: "documentation",
          topics: ["general", "documentation"]
        },
        {
          title: "MCP GitHub Repository",
          description: "Source code and examples for MCP implementations. A great resource for developers looking to understand the code behind MCP.",
          url: "https://github.com/modelcontextprotocol/typescript-sdk",
          resource_type: "code",
          topics: ["implementation", "code", "examples"]
        },
        {
          title: "Building MCP Servers Tutorial",
          description: "Step-by-step guide to creating your own MCP server from scratch, with detailed explanations of each component.",
          url: "https://modelcontextprotocol.io/docs/getting-started",
          resource_type: "tutorial",
          topics: ["implementation", "tutorial", "getting started"]
        },
        {
          title: "MCP Architecture Overview",
          description: "Understanding the architecture and components of MCP, including how clients and servers communicate.",
          url: "https://modelcontextprotocol.io/docs/protocol-spec/architecture",
          resource_type: "documentation",
          topics: ["architecture", "design"]
        },
        {
          title: "MCP Tools Specification",
          description: "Detailed specification for implementing MCP tools, including tool definitions, calls, and responses.",
          url: "https://modelcontextprotocol.io/docs/protocol-spec/tools",
          resource_type: "specification",
          topics: ["tools", "specification"]
        },
        {
          title: "Anthropic Claude MCP Integration",
          description: "Learn how Claude integrates with MCP and how to build tools that work with Claude's MCP implementation.",
          url: "https://docs.anthropic.com/claude/docs/model-context-protocol",
          resource_type: "documentation",
          topics: ["claude", "integration"]
        },
        {
          title: "MCP Server Debugging",
          description: "Tips and techniques for debugging MCP servers, including common issues and their solutions.",
          url: "https://modelcontextprotocol.io/docs/tools/debugging",
          resource_type: "guide",
          topics: ["debugging", "troubleshooting"]
        },
        {
          title: "Lambda-Based MCP Servers",
          description: "Building MCP servers with AWS Lambda - a scalable approach to MCP server implementation.",
          url: "https://github.com/modelcontextprotocol/examples",
          resource_type: "example",
          topics: ["lambda", "aws", "architecture"]
        },
        {
          title: "MCP Authentication Patterns",
          description: "Implementing secure authentication in MCP servers to protect sensitive APIs and data.",
          url: "https://modelcontextprotocol.io/docs/tools/security",
          resource_type: "guide",
          topics: ["security", "authentication"]
        },
        {
          title: "Testing MCP Servers",
          description: "Strategies and tools for testing MCP servers to ensure reliability and correctness.",
          url: "https://modelcontextprotocol.io/docs/tools/testing",
          resource_type: "guide",
          topics: ["testing", "quality"]
        }
      ];
      
      // Filter resources by topic if provided
      let filteredResources = resources;
      if (topic) {
        filteredResources = resources.filter(resource => 
          resource.topics.some(t => t.includes(topic) || topic.includes(t))
        );
        
        // If no matches, fall back to all resources
        if (filteredResources.length === 0) {
          filteredResources = resources;
        }
      }
      
      // Select a random resource
      const randomIndex = Math.floor(Math.random() * filteredResources.length);
      const selectedResource = filteredResources[randomIndex];
      
      console.log('Returning resource:', JSON.stringify(selectedResource));
      
      return {
        statusCode: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(selectedResource)
      };
    }
    
    // Default response for invalid requests
    return {
      statusCode: 400,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Invalid request',
        message: 'This server expects a learn_mcp tool call'
      })
    };
  } catch (error) {
    console.error('Error processing request:', error);
    
    return {
      statusCode: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: error.message || 'Internal server error',
        message: 'An unexpected error occurred'
      })
    };
  }
};