import { redirect } from '@sveltejs/kit';

export const handle = async ({ event, resolve }) => {
    const { cookies, url } = event;

    // List of protected URLs
    const blockedUrls = ['/CollegeList', '/manageuser'];

    // Check if the current URL is in the list of blocked URLs
    if (blockedUrls.includes(url.pathname)) {
        const token = cookies.get('token');
        console.log('Token retrieved:', token); // Debug log

        // If no token is found, redirect to login
        if (!token) {
            console.log('No token found, redirecting to login.');
            throw redirect(302, '/LoginPage');
        }
    }

    // Resolve the request normally if token exists or URL is not protected
    return resolve(event);
};
