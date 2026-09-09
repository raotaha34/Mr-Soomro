# Regenerates assets/favicon.png and assets/apple-touch-icon.png
# as the brand mark: orange circle + white chart-line icon (same as navbar logo).
Add-Type -AssemblyName System.Drawing

$root = "c:\Users\Connect2Aryans\Desktop\Mr-Soomro"

function New-LogoIcon([int]$size, [string]$out) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.Clear([System.Drawing.Color]::Transparent)
    $s = $size / 24.0

    $c1 = [System.Drawing.Color]::FromArgb(255, 245, 145, 30)
    $c2 = [System.Drawing.Color]::FromArgb(255, 224, 124, 0)
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        [System.Drawing.Point]::new(0, 0), [System.Drawing.Point]::new($size, $size), $c1, $c2)
    $g.FillEllipse($brush, 0, 0, $size - 1, $size - 1)

    $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::White, (2.3 * $s))
    $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round

    function Pt($x, $y) { [System.Drawing.PointF]::new($x * $s, $y * $s) }

    # axes
    $g.DrawLine($pen, (Pt 4 5), (Pt 4 19))
    $g.DrawLine($pen, (Pt 4 19), (Pt 20 19))
    # chart line
    $g.DrawLines($pen, @((Pt 7 15), (Pt 10 12), (Pt 13 14), (Pt 18 8)))
    # arrow head
    $g.DrawLine($pen, (Pt 15 8), (Pt 18 8))
    $g.DrawLine($pen, (Pt 18 8), (Pt 18 11))

    $g.Dispose()
    $bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "wrote $out"
}

New-LogoIcon 64  (Join-Path $root "assets\favicon.png")
New-LogoIcon 180 (Join-Path $root "assets\apple-touch-icon.png")
