const userService = require('../db/services/users');
const { MTProto, getSRPParams } = require('@mtproto/core');
const prompts = require('prompts');

const {
  USER_FIELDS_QUERY_EXCLUDES,
  USER_FIELDS_REGULAR
} = require('../utils/contants');

const getUsers = async (req, res, next) => {
  try {
    const users = await userService.findAllUsers({
      where: {
        id: { $not: req.user.id }
      },
      attributes: {
        exclude: USER_FIELDS_QUERY_EXCLUDES
      },
      order: [
        ['name', 'ASC'],
      ],
    });
    return res.json({ users });
  } catch (err) {
    next({ ...err, filename: __dirname });
  }
};

const getUser = async (req, res, next) => {
  try {
    const { id: userId } = req.params;
    const user = await userService.findOneUser({
      where: { id: userId },
      attributes: { USER_FIELDS_REGULAR }
    });
    if (!user) {
      throw { status: 404, message: 'User not found' };
    }

    return res.json({ user });
  } catch (error) {
    next(error);
  }
};
const getTest = async (req, res, next) => {
  try {


    const api_id = 1673175; // insert api_id here
    const api_hash = '220bd72d3352ba055062578553ceb98b'; // insert api_hash here

    async function getPhone() {
      return (await prompts({
        type: 'text',
        name: 'phone',
        message: 'Enter your phone number:'
      })).phone
    }

    async function getCode() {
      // you can implement your code fetching strategy here
      return (await prompts({
        type: 'text',
        name: 'code',
        message: 'Enter the code sent:',
      })).code
    }

    async function getPassword() {
      return (await prompts({
        type: 'text',
        name: 'password',
        message: 'Enter Password:',
      })).password
    }


    const mtproto = new MTProto({
      api_id,
      api_hash,
    });

    function startListener() {
      console.log('[+] starting listener')
      mtproto.updates.on('updates', ({ updates }) => {
        const newChannelMessages = updates.filter((update) => update._ === 'updateNewChannelMessage').map(({ message }) => message) // filter `updateNewChannelMessage` types only and extract the 'message' object

        for (const message of newChannelMessages) {
          // console.log('======message======', message)
          console.log('============',)
          // printing new channel messages
          console.log(`[${(message && message.message) && message.to_id.channel_id}] ${message.message}`)
        }
      });

      // mtproto.call('channels.getMessages', {
      //     _: 'inputPeerEmpty',
      // }).then((res) => {
      //   console.log('--------------res------------', res)
      // }).catch(error => {
      //   console.log('error.error_code:', error);
      //   console.log('error.error_message:', error.error_message);
      // });
    }


// checking authentication status
    mtproto
      .call('users.getFullUser', {
        id: {
          _: 'inputUserSelf',
        },
      })
      .then(startListener) // means the user is logged in -> so start the listener
      .catch(async error => {

        // The user is not logged in
        console.log('[+] You must log in')
        const phone_number = '+79181331809'

        mtproto.call('auth.sendCode', {
          phone_number: phone_number,
          settings: {
            _: 'codeSettings',
          },
        })
          .catch(error => {
            if (error.error_message.includes('_MIGRATE_')) {
              const [type, nextDcId] = error.error_message.split('_MIGRATE_');

              mtproto.setDefaultDc(+nextDcId);

              return sendCode(phone_number);
            }
          })
          .then(async result => {
            return mtproto.call('auth.signIn', {
              phone_code: await getCode(),
              phone_number: phone_number,
              phone_code_hash: result.phone_code_hash,
            });
          })
          .catch(error => {
            if (error.error_message === 'SESSION_PASSWORD_NEEDED') {
              return mtproto.call('account.getPassword').then(async result => {
                const { srp_id, current_algo, srp_B } = result;
                const { salt1, salt2, g, p } = current_algo;

                const { A, M1 } = await getSRPParams({
                  g,
                  p,
                  salt1,
                  salt2,
                  gB: srp_B,
                  password: await getPassword(),
                });

                return mtproto.call('auth.checkPassword', {
                  password: {
                    _: 'inputCheckPasswordSRP',
                    srp_id,
                    A,
                    M1,
                  },
                });
              });
            }
          })
          .then(result => {
            console.log('[+] successfully authenticated');
            // start listener since the user has logged in now
            startListener()
          });
      })
    // return res.json({ user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUser,
  getTest
};
