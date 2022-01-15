import { apiKey } from './api.key';
const variables = {
  development: {
    googleApiKey: apiKey, //key is in file api.key.js (export const apiKey = '...') - gitignored!
  },
  production: {
    googleApiKey: 'api key 4 production here...'
  }
};

const getEnvVariables = () => {
  if (__DEV__) {
      return variables.development; // return this if in development mode
  }
  return variables.production; // otherwise, return this
};

export default getEnvVariables; // export a reference to the function