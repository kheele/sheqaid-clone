const io = require('socket.io-client');

const {CONTRACTORS_ENDPOINT, HR_ENDPOINT, CONVERT_BINARY_ENDPOINT, RUST_TEST_ENDPOINT} = process.env;

const connectSocket = (key, domain) => {
    global[key] = io(domain, {
        withCredentials: true,
        transports: ['websocket'], // Only allow WebSocket transport

        // auth: (cb) => {
        // 	const {session} = self;
        // 	if (session.isLoggedIn) {
        // 		const {currentUser} = session.auth;
        // 		currentUser.getIdToken().then(token => {
        // 			cb({token});
        // 		});
        // 	} else {
        // 		cb({token: null});
        // 	}
        // },
    });

    const socket = global[key];

    socket.on('connect', () => {
        console.log(`Connected to ${key} server`, socket.id);
    });

    socket.on('disconnect', () => {
        console.log(`Disconnected from ${key} server`, socket.id);
    });

    const emit = socket.emit;

    socket.emit = (...args) => {
        return new Promise((resolve, reject) => {
            emit.apply(socket, [...args, (res, err) => {
                if (err) {
                    console.log('emit err', err)
                    return reject(err);
                }

                console.log('emit res', res)
                if (res) {
                    resolve(res);
                } else {
                    resolve();
                }
            }]);
        });
    };
};

connectSocket('socketClientContractor', CONTRACTORS_ENDPOINT);
connectSocket('socketClientHR', HR_ENDPOINT);
// connectSocket('socketConvertBinary', CONVERT_BINARY_ENDPOINT);
// connectSocket('socketRustTest', RUST_TEST_ENDPOINT);
//
// setInterval(async function fn() {
//     console.log('fn run');
//     let data = {
//         access_type: "Doctor",
//         idToken: "sdspo09sd088jkljjkhk",
//     };
//
//     try {
//         const res = await socketRustTest.emit('emit', {
//             path: 'accounts/onSetCustomUserClaims',
//             data,
//         });
//         console.log('socketRustTest res', res);
//     } catch (err) {
//         console.error('socketRustTest err', err);
//         throw err;
//     } finally {
//         console.error('socketRustTest finally');
//     }
// }, 2000);