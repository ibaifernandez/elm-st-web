(function () {
  var modal = document.getElementById('doc-modal');
  if (!modal) {
    return;
  }

  var titleNode = document.getElementById('doc-modal-title');
  var contentNode = document.getElementById('doc-modal-content');
  var linkNodes = document.querySelectorAll('.doc-modal-link[data-doc-path]');
  var closeNodes = modal.querySelectorAll('[data-doc-modal-close]');

  if (!titleNode || !contentNode || !linkNodes.length) {
    return;
  }

  var isSpanish = (document.documentElement.lang || '').toLowerCase().indexOf('es') === 0;
  var messages = {
    loading: isSpanish ? 'Cargando documento...' : 'Loading document...',
    failed: isSpanish
      ? 'No se pudo cargar el documento. Intenta de nuevo en unos segundos.'
      : 'Could not load the document. Please try again in a few seconds.'
  };

  var cache = {};
  var requestId = 0;
  var lastFocusedElement = null;

  function documentTitleFromPath(path) {
    var parts = path.split('/');
    return parts[parts.length - 1] || path;
  }

  function openModal() {
    modal.hidden = false;
    document.body.classList.add('doc-modal-open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('doc-modal-open');

    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  function renderContent(text) {
    contentNode.textContent = text;
    contentNode.scrollTop = 0;
  }

  function loadDocument(path) {
    requestId += 1;
    var currentRequestId = requestId;

    if (cache[path]) {
      renderContent(cache[path]);
      return;
    }

    renderContent(messages.loading);

    fetch(path, { cache: 'no-store' })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('HTTP ' + response.status);
        }
        return response.text();
      })
      .then(function (text) {
        if (currentRequestId !== requestId) {
          return;
        }
        cache[path] = text;
        renderContent(text);
      })
      .catch(function () {
        if (currentRequestId !== requestId) {
          return;
        }
        renderContent(messages.failed);
      });
  }

  Array.prototype.forEach.call(linkNodes, function (linkNode) {
    linkNode.addEventListener('click', function (event) {
      event.preventDefault();
      var path = linkNode.getAttribute('data-doc-path');
      if (!path) {
        return;
      }

      lastFocusedElement = linkNode;
      titleNode.textContent = documentTitleFromPath(path);
      openModal();
      loadDocument(path);
    });
  });

  Array.prototype.forEach.call(closeNodes, function (closeNode) {
    closeNode.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', function (event) {
    if (modal.hidden) {
      return;
    }

    if (event.key === 'Escape') {
      closeModal();
    }
  });
})();
