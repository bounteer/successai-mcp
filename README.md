### ------------------------------------------------------------
### ✅ Setup API 
###
 Clone repo and run this command
 npm install
 Add .env to the folder
 run command as "node index.js"

### ------------------------------------------------------------
### ✅ HEALTH CHECK
### Check if the wrapper service is running correctly
### ------------------------------------------------------------
GET https://localhost:3000/
Content-Type: application/json

### Example response:
# {
#   "status": "ok",
#   "service": "Success.ai Wrapper",
#   "base_url": "https://api.success.ai"
# }


### ------------------------------------------------------------
### 🔹 GET CAMPAIGNS (Shortcut Endpoint)
### Fetch list of campaigns directly (maps to /v1/campaign/list)
### ------------------------------------------------------------
GET http://localhost:3000/campaigns?limit=10
Content-Type: application/json

### Example response:
# {
#   "success": true,
#   "data": [ { "id": "...", "name": "...", ... } ]
# }


### ------------------------------------------------------------
### 🔹 ADD CONTACT (Shortcut Endpoint)
### Add one or more contacts to a campaign
### ------------------------------------------------------------
POST http://localhost:3000/contact/add
Content-Type: application/json

{
  "campaignId": "65a88f123bcd12",
  "contacts": [
    { "email": "john@example.com", "firstName": "John", "lastName": "Doe" },
    { "email": "mary@example.com", "firstName": "Mary" }
  ]
}

### Example response:
# {
#   "success": true,
#   "inserted": 2
# }


### ------------------------------------------------------------
### 🔹 GENERIC PROXY (Main Endpoint)
### Use this to call ANY Success.ai API route
### ------------------------------------------------------------
POST http://localhost:3000/proxy
Content-Type: application/json

{
  "method": "GET",
  "path": "/v1/campaign/list",
  "params": { "limit": 5 }
}

### Example response:
# { "success": true, "data": [ ... ] }


### ------------------------------------------------------------
### 🔹 GET CAMPAIGN STATUS (via /proxy)
### Example of using the generic proxy for a specific API
### ------------------------------------------------------------
POST http://localhost:3000/proxy
Content-Type: application/json

{
  "method": "GET",
  "path": "/v1/campaign/get/status",
  "params": { "campaignId": "65a88f123bcd12" }
}

### Example response:
# {
#   "success": true,
#   "status": "running",
#   "progress": 42
# }


### ------------------------------------------------------------
### 🔹 CREATE NEW CAMPAIGN (via /proxy)
### Example showing a POST action through the proxy
### ------------------------------------------------------------
POST http://localhost:3000/proxy
Content-Type: application/json

{
  "method": "POST",
  "path": "/v1/campaign/create",
  "body": {
    "name": "New AI Outreach Campaign",
    "fromEmail": "sales@success.ai",
    "subject": "Welcome to SuccessAI!",
    "templateId": "template_01"
  }
}

### Example response:
# {
#   "success": true,
#   "campaignId": "abc123xyz"
# }


### ------------------------------------------------------------
### 🔹 DELETE CAMPAIGN (via /proxy)
### Example showing DELETE method usage
### ------------------------------------------------------------
POST http://localhost:3000/proxy
Content-Type: application/json

{
  "method": "DELETE",
  "path": "/v1/campaign/delete",
  "params": { "campaignId": "abc123xyz" }
}

### Example response:
# { "success": true, "deleted": true }


### ------------------------------------------------------------
### 🧪 TEST INVALID ROUTE (for debugging)
### Shows how errors are returned in JSON
### ------------------------------------------------------------
POST http://localhost:3000/proxy
Content-Type: application/json

{
  "method": "GET",
  "path": "/v1/invalid/route"
}

### Example response:
# {
#   "error": "Request failed",
#   "details": "404 Not Found"
# }
