<script>
  import { goto } from "$app/navigation";
  let isDrawerOpen = false;

  function toggleDrawer() {
    isDrawerOpen = !isDrawerOpen;
  }
</script>

<header class="bg-black flex items-center p-3 fixed w-full"> 
  <!-- Drawer Toggle Button -->
  <button
    class="px-4 py-2 text-2xl bg-black text-white rounded-full fa-solid fa-bars"
    on:click={toggleDrawer}
  >
    <!-- Icon for Drawer Toggle -->
  </button>

  <!-- Logo -->
  <div class="ml-4">
    <img
      class="w-44 h-16"
      src="/logoo.png"
      alt="Logo"
    />
  </div>

  <!-- Drawer -->
  {#if isDrawerOpen}
    <button
      class="fixed inset-0 bg-black bg-opacity-50 z-50"
      on:click={toggleDrawer}
    ></button>
    <div
      class="fixed inset-y-0 left-0 bg-white w-64 shadow-xl z-50 transform transition-transform duration-300 ease-in-out"
      style="transform: translateX(0);"
    >
      <div class="p-4 flex flex-col h-full">
        <h2 class="text-2xl font-semibold mb-6">Menu</h2>
        <ul class="flex flex-col flex-grow space-y-2">
          <li>
            <button
              class="flex items-center text-lg text-black text-left rounded-lg hover:text-white hover:bg-black duration-300 py-3 px-4 font-semibold w-full"
              on:click={() => {goto('/CollegeList'); isDrawerOpen = false;}}
            >
              <i class="fa-solid fa-home mr-3"></i> <!-- Home Icon -->
              Home
            </button>
          </li>
          <li>
            <button
              class="flex items-center text-lg text-black text-left rounded-lg hover:text-white hover:bg-black duration-300 py-3 px-4 font-semibold w-full"
              on:click={() => {goto('/manageuser'); isDrawerOpen = false;}}
            >
              <i class="fa-solid fa-user-cog mr-3"></i> <!-- Manage User Icon -->
              Manage User
            </button>
          </li>
         
          <li>
            <button
              class="flex items-center text-lg text-black text-left rounded-lg hover:text-white hover:bg-black duration-300 py-3 px-4 font-semibold w-full"
              on:click={() => {goto('/'); isDrawerOpen = false;}}
            >
              <i class="fa-solid fa-sign-out-alt mr-3"></i> <!-- Logout Icon -->
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  {/if}
</header>
