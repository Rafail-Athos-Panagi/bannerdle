# PowerShell script to call dailyTroopSelection API every 5 minutes
# Save this as call-api.ps1

$apiUrl = "http://localhost:3000/api/dailyTroopSelection"

while ($true) {
    try {
        Write-Host "$(Get-Date): Calling dailyTroopSelection API..."
        
        $response = Invoke-RestMethod -Uri $apiUrl -Method POST -ContentType "application/json"
        
        if ($response.success) {
            Write-Host "✅ Success: $($response.message)" -ForegroundColor Green
        } else {
            Write-Host "❌ Error: $($response.error)" -ForegroundColor Red
        }
    }
    catch {
        Write-Host "❌ Exception: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    # Wait 5 minutes (300 seconds)
    Start-Sleep -Seconds 300
}
