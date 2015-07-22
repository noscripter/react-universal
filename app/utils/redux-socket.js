const TIMEOUT = 5000;

export default (io) => {
  return ({ getState, dispatch }) => (next) => async (action) => {
    const {query, params, type, responseTypes, ...rest} = action;

    if (!(query && responseTypes)) {
      return next(action);
    }

    dispatch({ type });

    const [SUCCESS, FAILURE] = responseTypes;
    const socket = await getSocket(io);
    socket.emit(type, {query, params});

    try {
      const data = await resolveWithResponseTypes(socket, SUCCESS, FAILURE);
      dispatch({ type: SUCCESS, ...data });
    }
    catch (exception) {
      dispatch({ type: FAILURE, exception });
    }
  };
};


const getSocket = (io) => new Promise((resolve, reject) => {
  setTimeout(reject.bind(null, "timeout"), TIMEOUT);

  try {
    io.on("connect", () => {
      resolve(io);
    });
  }
  catch (ex) {
    reject(ex);
  }
});

const resolveWithResponseTypes = (socket, responseTypes) => {
  const [SUCCESS, FAILURE] = responseTypes;
  return new Promise((resolve, reject) => {
    setTimeout(reject.bind(null, "timeout"), TIMEOUT);

    socket.on(FAILURE, (exception) => {
      reject(FAILURE);
    });
    socket.on(SUCCESS, (data) => {
      resolve(data);
    });
  });
};