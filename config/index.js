const _defaultsDeep = require('lodash/defaultsDeep');

const env = process.env.NODE_ENV || 'development';
let localConfig;
try {
  // eslint-disable-next-line global-require
  // localConfig = require('./config.json');
  console.log(`>>> \u001b[32mConfig loaded from config.json for '${env}' environment\u001b[39m`);
} catch (err) {
  console.error(`>>> \u001b[32m${'Local config not found'}\u001b[39m`, err);
}

let config = {
  development: {
    db: {
      username: 'postgres',
      password: 'alexey',
      database: 'nodejs',
      host: '127.0.0.1',
      port: '5433',
      dialect: 'postgres',
      logging: false
    },
    slack: {
      conversationId: '',
      slackToken: '',
      slackTokenCRM: '',
      codeReviewChannelId: '',
      codeReviewTeamChannelId: '',
      CRMChannelId: '',
      generalId: '',
      learningChannelId: '',
      slackMessages: {
        newAnnouncement: []
      }
    },
    common: {
      jwtSecret: 'secret',
      accessTokenExpiresInSec: 172800,
      refreshTokenExpiresInSec: 604800,
      accessTokenExpiresIn: '6days',
      refreshTokenExpiresIn: '14days',
      url: 'http://localhost:6800',
      siteAddress: 'http://localhost:3000',
      hashType: 'md5',
      hashKey: 'fusion',
      port: '6800',
      maxSizeImage: 3100000,
      qualityImage: 70,
      quantityPicture: 5
    },
  }
};

if (localConfig) {
  config = _defaultsDeep(localConfig, config);
}
module.exports = config[env];
