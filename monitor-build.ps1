# Build Monitor Popup
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$form = New-Object System.Windows.Forms.Form
$form.Text = "🚀 Nkoroi FC APK Build Monitor"
$form.Size = New-Object System.Drawing.Size(700,500)
$form.StartPosition = "CenterScreen"
$form.TopMost = $true
$form.BackColor = [System.Drawing.Color]::White

# Title Label
$titleLabel = New-Object System.Windows.Forms.Label
$titleLabel.Location = New-Object System.Drawing.Point(20,15)
$titleLabel.Size = New-Object System.Drawing.Size(650,35)
$titleLabel.Text = "Building APK with Firebase Super Admin Logic..."
$titleLabel.Font = New-Object System.Drawing.Font("Segoe UI",14,[System.Drawing.FontStyle]::Bold)
$titleLabel.ForeColor = [System.Drawing.Color]::FromArgb(79,195,247)
$form.Controls.Add($titleLabel)

# Status Label
$statusLabel = New-Object System.Windows.Forms.Label
$statusLabel.Location = New-Object System.Drawing.Point(20,55)
$statusLabel.Size = New-Object System.Drawing.Size(650,25)
$statusLabel.Text = "⏳ Initializing build..."
$statusLabel.Font = New-Object System.Drawing.Font("Segoe UI",11)
$statusLabel.ForeColor = [System.Drawing.Color]::DarkGray
$form.Controls.Add($statusLabel)

# Progress Bar
$progressBar = New-Object System.Windows.Forms.ProgressBar
$progressBar.Location = New-Object System.Drawing.Point(20,90)
$progressBar.Size = New-Object System.Drawing.Size(650,25)
$progressBar.Style = "Marquee"
$progressBar.MarqueeAnimationSpeed = 30
$form.Controls.Add($progressBar)

# Log TextBox
$logBox = New-Object System.Windows.Forms.TextBox
$logBox.Location = New-Object System.Drawing.Point(20,130)
$logBox.Size = New-Object System.Drawing.Size(650,290)
$logBox.Multiline = $true
$logBox.ScrollBars = "Vertical"
$logBox.Font = New-Object System.Drawing.Font("Consolas",9)
$logBox.ReadOnly = $true
$logBox.BackColor = [System.Drawing.Color]::FromArgb(245,245,245)
$form.Controls.Add($logBox)

# Timer to update status
$timer = New-Object System.Windows.Forms.Timer
$timer.Interval = 2000
$script:checkCount = 0

$timer.Add_Tick({
    $script:checkCount++
    
    # Check for APK
    $apkPath = "C:\Users\Admin\Downloads\Nkoroi FC\android\app\build\outputs\apk\release\app-release.apk"
    
    if (Test-Path $apkPath) {
        $titleLabel.Text = "✅ BUILD COMPLETE!"
        $titleLabel.ForeColor = [System.Drawing.Color]::Green
        $statusLabel.Text = "APK ready for installation"
        $statusLabel.ForeColor = [System.Drawing.Color]::Green
        $progressBar.Style = "Continuous"
        $progressBar.Value = 100
        $logBox.Text = "✅ BUILD SUCCESSFUL!`r`n`r`n📱 APK Location:`r`n$apkPath`r`n`r`n🎯 Next Steps:`r`n1. Transfer APK to your phone`r`n2. Install on both devices`r`n3. Delete Firebase user (ivy.waliaula@gmail.com)`r`n4. Register fresh in app`r`n5. Become Super Admin! ✅"
        $timer.Stop()
        return
    }
    
    # Check build log
    $logFile = "C:\Users\Admin\Downloads\Nkoroi FC\android\build-log.txt"
    if (Test-Path $logFile) {
        $content = Get-Content $logFile -Tail 15 -ErrorAction SilentlyContinue
        if ($content) {
            $logBox.Text = ($content | Out-String)
            $logBox.SelectionStart = $logBox.Text.Length
            $logBox.ScrollToCaret()
            
            # Update status based on log content
            if ($content -match "BUILD FAILED") {
                $titleLabel.Text = "❌ Build Failed"
                $titleLabel.ForeColor = [System.Drawing.Color]::Red
                $statusLabel.Text = "Check log for errors"
                $statusLabel.ForeColor = [System.Drawing.Color]::Red
                $progressBar.Style = "Continuous"
                $progressBar.Value = 0
                $timer.Stop()
            }
            elseif ($content -match "> Task") {
                $statusLabel.Text = "⚙️ Compiling... ($script:checkCount checks)"
                $statusLabel.ForeColor = [System.Drawing.Color]::Blue
            }
        }
    } else {
        # No log file yet
        $elapsed = $script:checkCount * 2
        $logBox.Text = "⏳ Build starting...`r`n`r`nElapsed: $elapsed seconds`r`n`r`nWaiting for Gradle to initialize...`r`n`r`nThis may take a few minutes on first run.`r`n`r`n📊 Expected timeline:`r`n- Cleanup: 1-2 min`r`n- Dependencies: 2-3 min`r`n- Compilation: 5-7 min`r`n- APK creation: 1-2 min`r`n`r`nTotal: ~10-12 minutes"
        $statusLabel.Text = "⏳ Waiting for build to start... ($elapsed sec)"
    }
})

$timer.Start()
$form.Add_Shown({$form.Activate()})
[void]$form.ShowDialog()
