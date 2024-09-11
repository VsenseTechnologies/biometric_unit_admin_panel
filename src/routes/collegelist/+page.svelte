<script>
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import Errormessage from "../../lib/errormessage.svelte";
    import Successmessage from "../../lib/successmessage.svelte";
    import {collegelist, collegeregister} from "../../lib/urls.js";

    // State variables
    let colleges = [];
    let newCollegeUsername = '';
    let newCollegePassword = '';
    let isAddCollegeModalVisible = false;
    let successMessage = '';
    let isLoading = false;
    let isCollageAddedLoading = false;
    let noCollegesAvailable = false;

    // Fetch the list of colleges from the API
    const fetchColleges = async () => {
        isLoading = true;
        try {
            const response = await fetch(collegelist, {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({}),
            });

            if (response.ok) {
                const data = await response.json();
                colleges = data['data'];
                noCollegesAvailable = colleges === null;
                isAddCollegeModalVisible = false;
            } else {
                const errorData = await response.json();
                console.error("Error fetching colleges:", errorData['message']);
            }
        } catch (error) {
            console.error("Error fetching colleges:", error);
        } finally {
            isLoading = false;
        }
    };

    // Create a new college user
    const createCollegeUser = async (event) => {
        event.preventDefault();
        isCollageAddedLoading = true;
        try {
            const response = await fetch(collegeregister, {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({ user_name: newCollegeUsername, password: newCollegePassword }),
            });

            if (response.ok) {
                newCollegeUsername = '';
                newCollegePassword = '';
                isAddCollegeModalVisible = false;
                successMessage = 'College user created successfully!';
                setTimeout(() => successMessage = '', 2000);
                await fetchColleges();
            } else {
                const errorData = await response.json();
                console.error("Error creating college user:", errorData["message"]);
            }
        } catch (error) {
            console.error("Error creating college user:", error);
        } finally {
            isCollageAddedLoading = false;
        }
    };

    // Initialize the component by fetching the colleges
    onMount(fetchColleges);

    // Toggle the visibility of the add college modal
    const toggleAddCollegeModal = () => {
        isAddCollegeModalVisible = !isAddCollegeModalVisible;
    };
</script>

<h2 class="text-3xl font-semibold mb-4 text-black px-8 pt-32">College List</h2>

<div class="overflow-auto px-8">
    {#if isLoading}
        <div class="fixed inset-0 flex items-center justify-center">
            <div class="spinner"></div>
        </div>
    {:else if noCollegesAvailable}
        <div class="fixed inset-96 flex flex-col items-center justify-center text-center">
            <i class="fa-solid fa-database text-8xl mb-4"></i>
            <h1 class="text-4xl">No colleges available</h1>
        </div>
    {:else}
        <div class="flex flex-wrap -mx-2 mb-8" transition:fade>
            {#each colleges as college}
                <div class="w-full sm:w-1/2 lg:w-1/4 p-4">
                    <div class="border rounded-2xl p-8 bg-white shadow-xl flex flex-col h-72">
                        <span class="text-start mt-2 text-2xl font-semibold">{college.user_name}</span>
                        <div class="flex-grow"></div>
                        <button
                            class="text-xl p-3 rounded-lg bg-black text-white font-medium self-end"
                            on:click={() => goto("/CollegeList/" + college.user_id)}
                        >
                            Manage
                        </button>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>

<button
    class="w-16 h-16 bg-black fixed bottom-12 right-8 text-white text-3xl font-medium rounded-full hover:text-white hover:bg-black duration-700 shadow-xl flex items-center justify-center"
    on:click={toggleAddCollegeModal}
>
    <i class="fas fa-plus"></i>
</button>

{#if isAddCollegeModalVisible}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" transition:fade>
        <div class="max-w-lg w-full bg-white rounded-3xl p-8 shadow-lg relative">
            <h1 class="text-center text-2xl py-4 mb-8 font-bold">Add New College</h1>
            <form on:submit={createCollegeUser}>
                <div class="mb-6">
                    <label class="block text-black text-xl font-semibold mb-2 text-left px-2" for="username">Username</label>
                    <input
                        bind:value={newCollegeUsername}
                        id="username"
                        type="text"
                        placeholder="Username"
                        class="shadow border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div class="mb-6">
                    <label class="block text-black text-xl font-semibold mb-2 text-left px-2" for="password">Password</label>
                    <input 
                        bind:value={newCollegePassword}
                        id="password"
                        type="password"
                        placeholder="Password"
                        class="shadow border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div class="flex items-center justify-center">
                    <button
                        type="submit"
                        class="bg-black text-white font-bold py-4 px-4 text-xl rounded-lg w-full flex items-center justify-center"
                    >
                    {#if isCollageAddedLoading}
                        <div class="button-spinner"></div>
                    {:else}
                        Create
                    {/if}
                    </button>
                </div>
            </form>
            <button
                class="absolute top-6 right-8 text-2xl font-bold text-gray-500 hover:text-red-500 duration-300"
                on:click={toggleAddCollegeModal}
            >
                &times;
            </button>
        </div>
    </div>
{/if}

{#if successMessage}
    <Successmessage successMessage={successMessage}/>
{/if}

<style>
    .spinner, .button-spinner {
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    .spinner {
        border: 8px solid rgba(0, 0, 0, 0);
        border-top: 8px solid black;
        width: 64px;
        height: 64px;
    }
    
    .button-spinner {
        border: 4px solid rgba(0, 0, 0, 0.1);
        border-top: 4px solid #ffffff;
        width: 24px;
        height: 24px;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style>
