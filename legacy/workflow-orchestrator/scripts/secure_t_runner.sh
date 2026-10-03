# scripts/secure_t_runner.sh — Run secure-t pipeline on a repo
# Usage: ./scripts/secure_t_runner.sh <repo_name>

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR/.."

REPO="${1:?Usage: secure_t_runner.sh <repo_name>}"

echo "Running secure-t pipeline on $REPO..."
python -c "
from src.secure_t_pipeline import SecureTPipeline
pipeline = SecureTPipeline()
result = pipeline.run('$REPO', 'https://github.com/belentani7/$REPO')
print(f'Pipeline status: {result.overall_status}')
print(f'Deploy URLs: {result.deploy_urls}')
"
