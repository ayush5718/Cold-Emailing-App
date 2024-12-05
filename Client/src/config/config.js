const config = {
  development: {
    API_URL: 'http://localhost:5000/api/email',
    AUTH_API_URL: 'http://localhost:5000/api/users'
  },
  production: {
    API_URL: 'https://cold-emailing-app-56ji.vercel.app/api/email',
    AUTH_API_URL: 'https://cold-emailing-app-56ji.vercel.app/api/users'
  }
};

const environment = process.env.NODE_ENV || 'development';
export const { API_URL, AUTH_API_URL } = config[environment];
