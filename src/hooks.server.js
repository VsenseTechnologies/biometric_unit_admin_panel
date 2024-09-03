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

    // Ensure the page does not redirect to login on reload if token exists
    if (url.pathname === '/LoginPage' && cookies.get('token')) {
        console.log('Token exists, preventing redirect to login on reload.');
        return resolve(event, {
            transformPageChunk: ({ html }) => html // Simply resolve the event without any change
        });
    }

    // Resolve the request normally
    return resolve(event);
};
