# Fix broken relative paths in HTML files
# Pages in /pages use ../ ; blog posts in /pages/blog use ../../

$ErrorActionPreference = 'Stop'

# --- Files in /pages/ that need ../index.html ---
$pages = @(
  'index.html',
  'about.html',
  'blogs.html',
  'reviews.html'
)

foreach ($f in $pages) {
  $path = Join-Path $PSScriptRoot "pages\$f"
  if (-not (Test-Path $path)) { continue }
  $c = [System.IO.File]::ReadAllText($path)
  
  # Fix links to root index.html
  $c = $c -replace 'href="index\.html"', 'href="../index.html"'
  $c = $c -replace 'href="index\.html#process"', 'href="../index.html#process"'
  $c = $c -replace 'href="index\.html#contact"', 'href="../index.html#contact"'
  $c = $c -replace 'href="index\.html#about"', 'href="../index.html#about"'
  
  [System.IO.File]::WriteAllText($path, $c)
  Write-Host "Fixed links in pages\$f"
}

# --- Blog posts in /pages/blog/ that need ../../index.html ---
$blogs = @(
  'blog-ai-overviews.html',
  'blog-core-web-vitals.html',
  'blog-keyword-research.html',
  'blog-link-building.html',
  'blog-local-seo.html',
  'blog-on-page-seo.html'
)

foreach ($b in $blogs) {
  $path = Join-Path $PSScriptRoot "pages\blog\$b"
  if (-not (Test-Path $path)) { continue }
  $c = [System.IO.File]::ReadAllText($path)
  
  $c = $c -replace 'href="index\.html"', 'href="../../index.html"'
  $c = $c -replace 'href="index\.html#process"', 'href="../../index.html#process"'
  $c = $c -replace 'href="index\.html#contact"', 'href="../../index.html#contact"'
  $c = $c -replace 'href="index\.html#about"', 'href="../../index.html#about"'
  
  [System.IO.File]::WriteAllText($path, $c)
  Write-Host "Fixed links in pages\blog\$b"
}

# --- Fix pages/index.html CSS/assets/image paths (it's in /pages/) ---
$pIndex = Join-Path $PSScriptRoot 'pages\index.html'
if (Test-Path $pIndex) {
  $c = [System.IO.File]::ReadAllText($pIndex)
  $c = $c -replace 'href="css/style\.css"', 'href="../css/style.css"'
  $c = $c -replace 'href="assets/favicon\.png"', 'href="../assets/favicon.png"'
  $c = $c -replace 'href="assets/apple-touch-icon\.png"', 'href="../assets/apple-touch-icon.png"'
  $c = $c -replace 'src="images/websitelogo\.jpeg"', 'src="../images/websitelogo.jpeg"'
  # internal links to sibling pages in pages/ should remain as-is (about.html, services.html etc.)
  [System.IO.File]::WriteAllText($pIndex, $c)
  Write-Host "Fixed CSS/assets paths in pages\index.html"
}

Write-Host "Done."
