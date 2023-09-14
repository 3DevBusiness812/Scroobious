/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config()

const ENV_VARS = {
  APP_NAME: process.env.APP_NAME,
  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_APP_BASE_URL: process.env.NEXT_PUBLIC_APP_BASE_URL,
  MAX_PDF_FILE_SIZE: process.env.MAX_PDF_FILE_SIZE,
  MAX_VIDEO_FILE_SIZE: process.env.MAX_VIDEO_FILE_SIZE,
}

module.exports = {
  env: ENV_VARS,
  publicRuntimeConfig: ENV_VARS,
  poweredByHeader: false,
  images: {
    domains: [
      'avatars.githubusercontent.com',
      'cdn-icons-png.flaticon.com',
      'scroobious-app-development.s3.us-west-2.amazonaws.com',
      'scroobious-app-staging.s3.us-west-2.amazonaws.com',
      'scroobious-app-production.s3.us-west-2.amazonaws.com',
    ],
  },
  eslint: {
    // TODO: there are too many eslint errors to fix right now.
    // 1. Clean up the rules so they're the right set
    // 2. Fix the lint errors
    ignoreDuringBuilds: true,
  },
}

// optimization: { minimize: false },
