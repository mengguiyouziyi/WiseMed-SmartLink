#!/bin/bash

# Create a dummy file
echo "Dummy DICOM content" > dummy.dcm

# Test upload to pacs-gw-service via proxy
echo "Testing upload to http://localhost:3001/api/imaging/upload..."
curl -v -X POST -F "file=@dummy.dcm" http://localhost:3001/api/imaging/upload

# Clean up
rm dummy.dcm
