document.addEventListener("alpine:init", () => {
  Alpine.store('app', {
    API_URL: "http://localhost:3005",
    links: [],
    currentLink: null,  
    tagFilter: null,
    newLink: {
      title: '',
      url: '',
      description: '',
      tags: ''
    },
    newComment: '',
    isSaveLink: false,
    
    async fetchLinks(tagFilter) {
      try {
        const response = await fetch(`${this.API_URL}/links?tag=${tagFilter}`);
        const data = await response.json();
        this.links = data;
      } catch (error) {
        console.error("Error al obtener enlaces:", error);
      }
    },
    
    async loadLinkDetails(linkId) {
      const linkResponse = await fetch(`${this.API_URL}/links/${linkId}`);
      const commentsResponse = await fetch(`${this.API_URL}/comments/${linkId}`);
      this.currentLink = await linkResponse.json();
      this.currentLink.comments = await commentsResponse.json();
    },

    async voteLink(linkId) {
      const response = await fetch(`${this.API_URL}/links/vote/${linkId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vote: 1 }),
      });
      const updatedLink = await response.json();
      this.currentLink = updatedLink;
    },

    async commentLink(linkId) {
      const comment = { content: this.newComment };
      const response = await fetch(`${this.API_URL}/comments/${linkId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(comment),
      });
      if (response.ok) {
        this.newComment = '';
        this.loadLinkDetails(linkId); // Recargar comentarios
      } else {
        alert('Error al comentar');
      }
    },

    async saveLink(title, url, description, tags) {
      const newLink = { title, url, description, tags };
      try {
        const response = await fetch(`${this.API_URL}/links`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newLink),
        });
        const data = await response.json();
        if (response.ok) {
          alert("Enlace guardado exitosamente.");
          this.fetchLinks(this.tagFilter);
        } else {
          alert(`Error: ${data.message}`);
        }
      } catch (error) {
        console.error(error);
        alert("Error al guardar el enlace");
      }
    },

    navigate(view) {
      if (view === 'home') {
        this.isSaveLink = false;
        this.currentLink = null;
      } else if (view === 'savelink') {
        this.isSaveLink = true;
        this.currentLink = null;
      }
    }
  });
});
