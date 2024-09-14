<script>
  import { goto } from "$app/navigation";
  
  function navigateToPrivacyPolicy() {
    goto("/privacypolicy");
  }
</script>

<style>
  @media (max-width: 640px) {
    .hide-on-mobile {
      display: none;
    }
  }
</style>

<div class="w-screen h-8 fixed bottom-0 right-0 bg-black text-white flex justify-between items-center font-semibold">
  <a href="https://vsensetechnologies.com" class="pl-2">
    Copyright @vsensetechnologies.com
  </a>
  <button 
    on:click={navigateToPrivacyPolicy}
    class="pr-2 hide-on-mobile">
    Privacy & Policy
  </button>
</div>
