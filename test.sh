#!/bin/bash
# test.sh - Script to test the lamba-mcp Lambda function directly
# Usage: ./test.sh [topic]
# Example: ./test.sh architecture

# Lambda endpoint URL
LAMBDA_ENDPOINT="https://dgtfn7jd9f.execute-api.us-east-1.amazonaws.com/dev/"

# Get topic from command line argument or use default
TOPIC="${1:-architecture}"

# Create a temporary JSON file for the request
TMP_FILE=$(mktemp)

# Create the request JSON
cat > "$TMP_FILE" << EOF
{
  "type": "tool_call",
  "name": "learn_mcp",
  "parameters": {
    "topic": "$TOPIC"
  }
}
EOF

echo "Testing Lambda with topic: $TOPIC"
echo "Endpoint: $LAMBDA_ENDPOINT"
echo "Request:"
cat "$TMP_FILE"
echo

# Make the request using curl
echo "Response:"
curl -s -X POST \
  -H "Content-Type: application/json" \
  -d @"$TMP_FILE" \
  "$LAMBDA_ENDPOINT" | jq .

# Clean up
rm "$TMP_FILE"