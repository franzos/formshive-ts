#!/usr/bin/env -S guix shell pnpm node awscli -- bash

set -e

export VITE_API_BASE_URL=https://api.formshive.com/v1
export VITE_EXAMPLE_FORM_ID=821f4a10-127c-46c6-bc80-8790d219575a
export VITE_EXAMPLE_FORM_ID_CAPTCHA=75abad84-7a8d-4075-b18f-cd35954b9df6
export VITE_STRIPE_PUBLIC_KEY=pk_live_51PS1UfB6bSjPIh6olwjbD0EDE8K2qoyTISQodeqKlDAJs1PISnHqwAu7yZ1Mkjek5Rfq2xqhoycsCCGUsSNfTRcZ00mE8xD0Jr
export VITE_SENTRY_DSN="https://7e3508ec73f01628c2d43ffdddd828b7@sentry.pantherx.dev/33"
export VITE_SENTRY_ENVIRONMENT="production"

pnpm run build || exit 1

# Prompt the user which folder to upload
FOLDER_NAME="./dist"
AWS_BUCKET_URL="s3://formshive.com"
AWS_REGION="eu-central-1"
PROFILE_NAME="rusty"
CLOUDFRONT_ID="E9LMV86FYCLLJ "

echo "Using AWS profile: $PROFILE_NAME"
echo "Uploading folder: $FOLDER_NAME"
echo "Destination: $AWS_BUCKET_URL"

# Upload the folder to S3 using AWS CLI
aws s3 sync $FOLDER_NAME $AWS_BUCKET_URL --profile $PROFILE_NAME --region $AWS_REGION

# Invalidate CloudFront (Uncomment if you need this)
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_ID --paths "/*" --profile $PROFILE_NAME --region $AWS_REGION

# Clear env variable
unset API_URL
unset BASE_URL
unset API_URL_BROWSER
unset SENTRY_DSN
unset STRIPE_PUBLIC_KEY
