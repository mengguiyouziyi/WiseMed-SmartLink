function OnStoredInstance(instanceId, tags, metadata, origin)
   -- Ignore instances that result from a modification to avoid loops
   if origin['RequestOrigin'] ~= 'Lua' then
      print('Received instance ' .. instanceId .. ' from ' .. origin['RequestOrigin'])

      -- Send the instance ID to the PACS Gateway
      -- The payload matches what pacs-gw-service expects
      local payload = '{"instanceId": "' .. instanceId .. '"}'
      
      -- Note: In Docker, pacs-gw-service is resolvable by hostname
      local url = 'http://pacs-gw-service:8000/webhook/orthanc'
      
      -- PerformHttpRequest is a built-in Orthanc Lua function
      -- It returns the body of the response (or throws an error)
      local success, response = pcall(PerformHttpRequest, 'POST', url, payload)
      
      if success then
         print('Notification sent to PACS Gateway. Response: ' .. response)
      else
         print('Error sending notification to PACS Gateway: ' .. response)
      end
   end
end
