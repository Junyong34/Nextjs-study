module.exports = {
  reactStrictMode: true,
  /** 런터임 환경에서 가져옴 node 환경 */
  publicRuntimeConfig: {
    apiKey: process.env.publicApiKey || '',
    authDomain: process.env.FIREBASE_AUTH_HOST || '',
    projectId: process.env.projectId || '',
  },
};
