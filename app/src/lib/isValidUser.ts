export const isValidUser = async (userId: String) => {
    return fetch(`/api/user/?uid=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        if (res.status === 200) {
          return true;
        } else {
          return false;
        }
      })
}

