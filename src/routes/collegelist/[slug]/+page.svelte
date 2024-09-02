<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

  let unitId = ''; // Variable for user input in delete modal
  let createUnitId = ''; // Variable for creating a new unit ID
  let tableData = [];
  let isLoading = true;
  let showDeleteModal = false;
  let showCreateModal = false;
  let responseMessage = '';
  let isCreating = false; // Track loading state for the "Add Unit" button
  let unitIdToDelete = ''; // Track unit ID for deletion
  let deleteErrorMessage = ''; // Error message for invalid delete input
  let isMachineNotPresent = false;
  export let data;

  const fetchTableData = async () => {
    try {
      const response = await fetch("https://go-fingerprint.onrender.com/admin/getmachines", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ user_id: data.slug }),
      });
      const result = await response.json();
      if (response.ok) {
        tableData = result['data'];
      } else {
        responseMessage = result['message'] || 'Unexpected error';
      }
    } catch (error) {
      responseMessage = 'Fetch error: ' + error.message;
    } finally {
      isLoading = false;
      if(tableData === null) {
        isMachineNotPresent = true;
      }
    }
  };

  const addMachine = async () => {
    isCreating = true;

    try {
      const response = await fetch("https://go-fingerprint.onrender.com/admin/addmachine", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ unit_id: createUnitId, user_id: data.slug }),
      });
      const result = await response.json();
      if (response.ok) {
        showCreateModal = false;
        createUnitId = '';
        await fetchTableData();
        window.location.reload(); // Refresh the page
      } else {
        responseMessage = result.message || 'Unexpected error';
      }
    } catch (error) {
      responseMessage = 'Fetch error: ' + error.message;
    } finally {
      isCreating = false;
    }
  };

  const deleteMachine = async () => {
    if (unitId !== unitIdToDelete) {
      deleteErrorMessage = 'Unit ID does not match. Please enter the correct ID.';
      return;
    }

    isLoading = true;

    try {
      const response = await fetch("https://go-fingerprint.onrender.com/admin/deletemachine", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ unit_id: unitIdToDelete, online: false }),
      });
      const result = await response.json();
      console.log('Delete response:', result); // Debugging
      if (response.ok) {
        showDeleteModal = false;
        unitIdToDelete = '';
        unitId = '';
        deleteErrorMessage = '';
        await fetchTableData();
        window.location.reload(); // Refresh the page
      } else {
        responseMessage = result.message || 'Unexpected error';
      }
    } catch (error) {
      responseMessage = 'Fetch error: ' + error.message;
    } finally {
      isLoading = false;
    }
  };

  onMount(() => {
    fetchTableData();
  });

  const toggleModal = (modalType) => {
    if (modalType === 'delete') {
      showDeleteModal = !showDeleteModal;
    } else if (modalType === 'create') {
      showCreateModal = !showCreateModal;
    }
  };

  const confirmDeletion = (unitId) => {
    unitIdToDelete = unitId;
    toggleModal('delete');
  };
</script>

<div class="overflow-x-auto p-6 pt-32">
  <div class="max-h-screen overflow-y-auto">
{#if isLoading}
  <div class="fixed inset-0 flex items-center justify-center">
      <div class="spinner-black"></div>
  </div>
{:else if isMachineNotPresent}
  <div class="fixed inset-96 flex flex-col items-center justify-center text-center">
    <i class="fa-solid fa-gears text-8xl mb-4"></i>
    <h1 class="text-4xl">No Machines available</h1>
  </div>
{:else}
      <table class="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden" transition:fade>
        <thead class="bg-black text-white top-0">
          <tr>
            <th class="py-3 px-4">Unit ID</th>
            <th class="py-3 px-4">User ID</th>
            <th class="py-3 px-4">Status</th>
            <th class="py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody class="text-gray-700">
          {#each tableData as row}
            <tr class="border-b border-gray-200">
              <td class="py-3 px-4 text-center">{row.unit_id}</td>
              <td class="py-3 px-4 text-center">{data.slug}</td>
              <td class="py-3 px-4 text-center">
                <span class={`py-1 px-3 rounded-full text-xs font-semibold ${row.online ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {#if row.online} online {:else} offline {/if}
                </span>
              </td>
              <td class="py-3 px-4 text-center">
                <button on:click={() => confirmDeletion(row.unit_id)} class="text-red-500 hover:text-red-700">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>

  <button
    class="w-16 h-16 bg-black fixed bottom-12 right-8 text-white text-center text-3xl font-medium rounded-full shadow-xl"
    on:click={() => toggleModal('create')}
  >
    <i class="fas fa-plus"></i>
  </button>

  {#if showDeleteModal}
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-6" transition:fade>
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 class="text-xl font-bold mb-4">Confirm Deletion</h1>
        <p class="text-gray-700 mb-4">Are you sure you want to delete unit ID: <strong>{unitIdToDelete}</strong>?</p>
        <p class="text-gray-600 mb-4">Type the unit ID below to confirm:</p>
        <input
          bind:value={unitId} 
          name="unitIdInput"
          type="text"
          placeholder="Enter Unit ID"
          class="w-full p-3 border border-gray-300 rounded-lg text-lg mb-4"
        />
        {#if deleteErrorMessage}
          <p class="text-red-500 mb-4">{deleteErrorMessage}</p>
        {/if}
        <div class="flex justify-between">
          <button
            class="bg-red-600 text-white font-bold py-2 px-4 rounded-lg flex items-center"
            on:click={deleteMachine}
            disabled={isLoading}
          >
            {#if isLoading}
              <div class="spinner-delete"></div>
            {:else}
              <i class="fas fa-trash-alt mr-2"></i> Delete
            {/if}
          </button>
          <button
            class="bg-white shadow-lg text-gray-800 font-bold py-2 px-4 rounded-lg"
            on:click={() => showDeleteModal = false}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  {/if}

  {#if showCreateModal}
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-6" transition:fade>
      <div class="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg space-y-6 h-[24rem]">
        <h1 class="text-2xl font-bold text-center text-gray-800">Create a New Unit ID</h1>
        <div>
          <label class="block text-gray-700 font-semibold mb-2" for="unitId">Unit ID</label>
          <input
            bind:value={createUnitId} 
            name="unitId"
            type="text"
            placeholder="Enter Unit ID"
            class="w-full p-4 border border-gray-300 rounded-lg text-lg"
          />
        </div>
        <div class="flex justify-between">
          <button
            on:click={addMachine}
            class="relative w-full bg-black text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center"
            disabled={isCreating}
          >
            {#if isCreating}
              <div class="spinner-add"></div>
            {:else}
              <i class="fa fa-plus mr-2"></i> Add Unit
            {/if}
          </button>
        </div>
        <button
          class="w-full bg-white text-black shadow-lg font-bold py-3 px-6 rounded-lg mt-4"
          on:click={() => showCreateModal = false}
        >
          Cancel
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  .spinner-black {
    border: 8px solid rgba(0, 0, 0, 0);
    border-radius: 50%;
    border-top: 8px solid black;
    width: 64px;
    height: 64px;
    animation: spin 1s linear infinite;
  }

  .spinner-add {
    border: 4px solid rgba(0, 0, 0, 0.3);
    border-radius: 50%;
    border-top: 4px solid white; /* Spinner color adjusted for visibility */
    width: 24px; /* Adjust the size as needed */
    height: 24px; /* Adjust the size as needed */
    animation: spin 0.8s linear infinite; /* Position it absolutely within the button */
    top: 50%; /* Center vertically */
    left: 50%; /* Center horizontally */
    transform: translate(-50%, -50%); /* Center the spinner */
  }

  .spinner-delete {
    border: 4px solid rgba(0, 0, 0, 0.3);
    border-radius: 50%;
    border-top: 4px solid white;
    width: 20px;
    height: 20px;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  table {
    border-collapse: collapse;
    width: 100%;
  }

  thead th {
    border-bottom: 2px solid #e5e7eb; /* Light gray border for the header */
    background-color: #111827; /* Dark background color for the header */
  }

  tbody tr {
    transition: background-color 0.3s ease;
  }

  tbody tr:hover {
    background-color: #f3f4f6; /* Light gray background color for row hover */
  }

  td {
    border-right: 1px solid #e5e7eb; /* Light gray border for cells */
  }

  td:last-child {
    border-right: none; /* Remove right border for the last cell in each row */
  }
</style>
