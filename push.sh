npm run build;
aws s3 sync --delete ./dist s3://slee.xyz
