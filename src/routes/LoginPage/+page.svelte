<script>
    import { goto } from "$app/navigation";
    import Errormessage from "../../lib/errormessage.svelte";
    import {login} from "../../lib/urls.js";

    // State variables
    let user_name = '';
    let password = '';
    let errorMessage = '';
    let showError = false;
    let loading = false;

    // Function to handle login
    const handleLogin = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        loading = true;
        showError = false;
        errorMessage = '';

        try {
            const response = await fetch(login, {
                method: "POST",
                credentials: "include",
              
                body: JSON.stringify({ user_name, password }),
            });

            if (response.ok) {
                // Redirect to the college list page on successful login
                await goto("/CollegeList");
            } else {
                // Handle error response
                const jsonResponse = await response.json();
                errorMessage = jsonResponse.message || 'An unexpected error occurred.';
                showError = true;
                setTimeout(() => {
                    showError = false;
                }, 3000);
            }
        } catch (error) {
            errorMessage = 'Failed to communicate with the server. Please try again later.';
            console.error(error);
            showError = true;
            setTimeout(() => {
                showError = false;
            }, 3000);
        } finally {
            loading = false;
        }
    };
</script>

<style>
    .spinner {
        border: 4px solid rgba(0, 0, 0, 0.1);
        border-radius: 50%;
        border-top: 4px solid #ffffff;
        width: 24px;
        height: 24px;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style>

<!-- Login Form -->
<div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 h-[450px] flex flex-col justify-between relative">
        <h1 class="text-center md:text-4xl text-2xl font-semibold mb-6">Login</h1>
        <form on:submit={handleLogin}>
            <div class="mb-6">
                <label class="block text-lg font-semibold mb-2" for="username">
                    User ID
                </label>
                <input
                    id="username"
                    autocomplete="username"
                    bind:value={user_name}
                    type="text"
                    placeholder="USER ID"
                    class="w-full p-3 border border-gray-300 rounded-lg text-lg"
                    required
                />
            </div>
            <div class="mb-6">
                <label class="block text-lg font-semibold mb-2" for="password">
                    Password
                </label>
                <input
                    id="password"
                    autocomplete="current-password"
                    bind:value={password}
                    type="password"
                    placeholder="PASSWORD"
                    class="w-full p-3 border border-gray-300 rounded-lg text-lg"
                    required
                />
            </div>
            <div class="flex items-center justify-center">
                <button
                    type="submit"
                    class="w-full bg-black text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center text-lg relative"
                    disabled={loading}
                >
                    {#if loading}
                        <div class="spinner"></div>
                    {:else}
                        Login
                    {/if}
                </button>
            </div>
        </form>
    </div>
</div>

{#if showError}
    <Errormessage errorMessage={errorMessage}/>
{/if}
