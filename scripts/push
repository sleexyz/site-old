stack exec site clean
stack exec site build
aws s3 sync --delete ./_site s3://slee.xyz --exclude "*.map"
