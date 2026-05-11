# 获取 Giscus 配置参数
# 使用方式：在终端执行前设置 $env:GITHUB_TOKEN
# powershell -ExecutionPolicy Bypass -File scripts\get-giscus-config.ps1

$token = $env:GITHUB_TOKEN
if (-not $token) {
  Write-Output "请先设置环境变量: `$env:GITHUB_TOKEN = '你的token'"
  exit 1
}

$body = @{
  query = 'query { repository(owner:"TYD5630", name:"mrt-site") { id discussionCategories(first:10) { edges { node { id name } } } } }'
} | ConvertTo-Json

try {
  $r = Invoke-RestMethod -Uri 'https://api.github.com/graphql' -Method Post -Headers @{Authorization = "bearer $token"} -Body $body -ContentType 'application/json'
  $data = $r.data.repository
  Write-Output "`n=== repoId ==="
  Write-Output $data.id
  Write-Output "`n=== 分类 ==="
  foreach ($cat in $data.discussionCategories.edges) {
    Write-Output ("  " + $cat.node.name + " -> " + $cat.node.id)
  }
} catch {
  Write-Output "错误: $_"
}
