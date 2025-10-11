# Build Progress Monitor
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$form = New-Object System.Windows.Forms.Form
$form.Text = "🚀 APK Build Progress"
$form.Size = New-Object System.Drawing.Size(600,400)
$form.StartPosition = "CenterScreen"
$form.TopMost = $true

$label = New-Object System.Windows.Forms.Label
$label.Location = New-Object System.Drawing.Point(10,10)
$label.Size = New-Object System.Drawing.Size(560,30)
$label.Text = "Building Nkoroi FC APK with Firebase..."
$label.Font = New-Object System.Drawing.Font("Arial",12,[System.Drawing.FontStyle]::Bold)
$form.Controls.Add($label)

$textBox = New-Object System.Windows.Forms.TextBox
$textBox.Location = New-Object System.Drawing.Point(10,50)
$textBox.Size = New-Object System.Drawing.Size(560,280)
$textBox.Multiline = $true
$textBox.ScrollBars = "Vertical"
$textBox.Font = New-Object System.Drawing.Font("Consolas",9)
$textBox.ReadOnly = $true
$form.Controls.Add($textBox)

$timer = New-Object System.Windows.Forms.Timer
$timer.Interval = 2000

$logFile = "C:\Users\Admin\Downloads\Nkoroi FC\android\build-log.txt"

$timer.Add_Tick({
    if (Test-Path $logFile) {
        $content = Get-Content $logFile -Tail 20 | Out-String
        $textBox.Text = $content
        $textBox.SelectionStart = $textBox.Text.Length
        $textBox.ScrollToCaret()
    } else {
        $textBox.Text = "⏳ Initializing Gradle build...`r`n`r`nThis may take a few minutes.`r`n`r`nThe build is running in the background."
    }
    
    # Check if build is complete
    if (Test-Path "C:\Users\Admin\Downloads\Nkoroi FC\android\app\build\outputs\apk\release\app-release.apk") {
        $textBox.Text += "`r`n`r`n✅ BUILD COMPLETE!`r`n`r`nAPK Location:`r`nC:\Users\Admin\Downloads\Nkoroi FC\android\app\build\outputs\apk\release\app-release.apk"
        $label.Text = "✅ Build Complete!"
        $label.ForeColor = [System.Drawing.Color]::Green
        $timer.Stop()
    }
})

$timer.Start()
$form.ShowDialog()
