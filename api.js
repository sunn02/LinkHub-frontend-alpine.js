// api.js
const API_URL = "http://localhost:3005";

function handleHTTPError(response) {
  if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
  return response.json();
}

async function showLinks(tagFilter = null) {
  const url = tagFilter ? `${API_URL}/links/tags/${tagFilter}` : `${API_URL}/links`;
  try {
    const response = await fetch(url);
    const links = await handleHTTPError(response);
    return links;
  } catch (error) {
    console.error(`Error al cargar los enlaces: ${error.message}`);
  }
}

async function loadLinkDetails(linkId) {
  const comments = await fetch(`${API_URL}/comments/${linkId}`).then(handleHTTPError);
  const link = await fetch(`${API_URL}/links/${linkId}`).then(handleHTTPError);
  return { comments, link };
}

async function voteLink(linkId) {
  try {
    const response = await fetch(`${API_URL}/links/vote/${linkId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vote: 1 }),
    });
    return await handleHTTPError(response);
  } catch (error) {
    console.error(`Error al votar: ${error.message}`);
  }
}

async function saveLink(newLink) {
  try {
    const response = await fetch(`${API_URL}/links`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newLink),
    });
    return await handleHTTPError(response);
  } catch (error) {
    console.error(`Error al guardar el enlace: ${error.message}`);
  }
}

async function commentLink(linkId, comment) {
  try {
    const response = await fetch(`${API_URL}/comments/${linkId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: comment }),
    });
    return await handleHTTPError(response);
  } catch (error) {
    console.error(`Error al enviar el comentario: ${error.message}`);
  }
}
