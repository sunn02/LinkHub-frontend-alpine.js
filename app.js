document.addEventListener('alpine:init', () => {
  Alpine.store('app', window.app());
});

  window.app = function () {
      return {
          currentPage: 'home',          
          init() {
  console.log('Main app initialized');
},
}}
