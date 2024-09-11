<script>
   
  import { goto } from "$app/navigation";
  
  function navigateToPrivacyPolicy() {
    goto("/privacypolicy");
  }
</script>

<div class="w-screen h-8 fixed bottom-0 right-0 bg-black text-white flex justify-between items-center font-semibold">
  <a href="https://vsensetechnologies.com" class="pl-2">Copyright@vsensetechnologies.com</a>
  <button 
    on:click={navigateToPrivacyPolicy}
    class="pr-2">
    Privacy & Policy
  </button>
</div>

