param(
  [ValidateRange(32, 64)]
  [int]$Length = (Get-Random -Minimum 32 -Maximum 65)
)

$bytes = [byte[]]::new([math]::Ceiling($Length * 3 / 4))
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
try {
  $rng.GetBytes($bytes)
} finally {
  $rng.Dispose()
}

$token = [Convert]::ToBase64String($bytes).
  TrimEnd('=').
  Replace('+', '-').
  Replace('/', '_')

$token.Substring(0, $Length)
