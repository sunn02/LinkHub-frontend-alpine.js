document.addEventListener('alpine:init', () => {
  Alpine.store('app', window.app());
});

window.app = function () {
  return {
    currentPage: 'home', 
    links: [],
    currentLink: null,
    comments: [],
    newLink: { title: '', url: '', tags: '' },
    tagFilter: null,

    async init() {
      console.log('Main app initialized');
      await this.loadLinks();
    },

    async loadLinks() {
      try {
        this.links = await showLinks(this.tagFilter);
      } catch (error) {
        console.error(`Error al cargar los enlaces: ${error.message}`);
      }
    },

    async showDetails(linkId) {
      try {
        const { link, comments } = await loadLinkDetails(linkId);
        this.currentLink = link;
        this.comments = comments;
        this.currentPage = 'details';
      } catch (error) {
        console.error(`Error al cargar los detalles: ${error.message}`);
      }
    },

    async addComment(comment) {
      if (!comment.trim()) return;
      try {
        await commentLink(this.currentLink.id, comment);
        this.comments.push({ content: comment });
      } catch (error) {
        console.error(`Error al agregar el comentario: ${error.message}`);
      }
    },

    async vote(linkId) {
      try {
        const updatedLink = await voteLink(linkId);
        this.links = this.links.map(link =>
          link._id === linkId ? updatedLink : link
        );
      } catch (error) {
        console.error(`Error al votar: ${error.message}`);
      }
    },

    async saveNewLink() {
      if (!this.newLink.title || !this.newLink.url) {
        console.error('El título y la URL son obligatorios');
        return;
      }
      try {
        const savedLink = await saveLink(this.newLink);
        this.links.push(savedLink);
        this.newLink = { title: '', url: '', tags: '' }; // Limpia el formulario
        this.currentPage = 'home';
      } catch (error) {
        console.error(`Error al guardar el enlace: ${error.message}`);
      }
    },

    switchPage(page) {
      this.currentPage = page;
    },
  };
};