import { auth } from '../firebase';

const getValidToken = () => {
    const authToken = localStorage.getItem('authToken');
    const tokenExpiration = localStorage.getItem('tokenExpiration');

    if (!authToken || !tokenExpiration) return null;

    const isExpired = new Date().getTime() > parseInt(tokenExpiration, 10);
    if (isExpired) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('tokenExpiration');
        return null;
    }

    const acuid = localStorage.getItem('acuid');

    return { authToken, acuid };
};

const refreshToken = async () => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('No authenticated user found.');

        const result = await user.getIdTokenResult(true);
        const newToken = result.token;
        const expirationTime = result.expirationTime;

        localStorage.setItem('authToken', newToken);
        localStorage.setItem('tokenExpiration', new Date(expirationTime).getTime());

        if (result.claims.acuid) {
            localStorage.setItem('acuid', result.claims.acuid);
        }

        return newToken;
    } catch (error) {
        console.error('Error refreshing token:', error);
        return null;
    }
};

export { getValidToken, refreshToken };