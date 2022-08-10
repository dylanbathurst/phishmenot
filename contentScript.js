const LinkIcon =
  '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M10.17 13.83a1.264 1.264 0 0 1 0 1.844 1.309 1.309 0 0 1-1.844 0 6.496 6.496 0 0 1 0-9.179l4.596-4.596a6.496 6.496 0 0 1 9.18 0 6.496 6.496 0 0 1 0 9.18l-1.935 1.934a8.97 8.97 0 0 0-.52-3.142l.61-.623a3.871 3.871 0 0 0 0-5.506 3.871 3.871 0 0 0-5.505 0L10.17 8.326a3.871 3.871 0 0 0 0 5.505zm3.66-5.504a1.309 1.309 0 0 1 1.844 0 6.496 6.496 0 0 1 0 9.179l-4.596 4.596a6.496 6.496 0 0 1-9.18 0 6.496 6.496 0 0 1 0-9.18l1.935-1.934a9.09 9.09 0 0 0 .52 3.155l-.61.61a3.871 3.871 0 0 0 0 5.505 3.871 3.871 0 0 0 5.505 0l4.583-4.583a3.871 3.871 0 0 0 0-5.505 1.264 1.264 0 0 1 0-1.843z"/></svg>';
const CloseCirclIcon =
  '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12z" fill="#d2d2d2"/><path fill-rule="evenodd" clip-rule="evenodd" d="M7.757 7.757a1 1 0 0 0 0 1.415L10.586 12l-2.829 2.828a1 1 0 1 0 1.415 1.415L12 13.414l2.829 2.829a1 1 0 0 0 1.414-1.414L13.414 12l2.829-2.828a1 1 0 0 0-1.414-1.415L12 10.586 9.172 7.757a1 1 0 0 0-1.415 0z"/></svg>';

function blurBackground() {
  const phishMeNotClass = 'phishmenot';
  const bodyClasses = document.body.className;
  document.body.className = `${phishMeNotClass} ${bodyClasses}`;
}

function clearBackground() {
  const bodyClasses = document.body.className;
  document.body.className = bodyClasses.replace(/phishmenot/g, '').trim();
}

function showContainer(linkHref, e) {
  const phishMeNotContainer = document.getElementById('phishmenot-container');

  if (phishMeNotContainer) {
    return;
  }

  const url = new URL(linkHref);
  const origin = url.origin;

  const container = document.createElement('div');
  const linkP = document.createElement('p');
  const HostNameSpan = document.createElement('span');
  const LinkPathSpan = document.createElement('span');
  const button = document.createElement('button');
  const closeButton = document.createElement('button');

  HostNameSpan.className = 'phishmenot-link-origin';
  LinkPathSpan.className = 'phishmenot-link-path';

  HostNameSpan.innerHTML = origin;
  LinkPathSpan.innerText = url.href.replace(origin, '');

  linkP.className = 'phishmenot-link';
  linkP.appendChild(HostNameSpan);
  linkP.appendChild(LinkPathSpan);

  button.innerText = 'Go to link';
  button.className = 'phishmenot-continue';
  button.onclick = function (ev) {
    window.open(linkHref);
  };

  closeButton.innerHTML = CloseCirclIcon;
  closeButton.className = 'phishmenot-close';
  closeButton.onclick = function (e) {
    clearBackground();
    document.getElementById('phishmenot-container').remove();
  };

  container.id = 'phishmenot-container';
  container.className = 'phishmenot-container';
  container.appendChild(closeButton);
  container.appendChild(linkP);
  container.appendChild(button);
  container.style.display = 'flex';

  document.querySelector('.nH').after(container);
}

function hashCheck() {
  if (/^#inbox\/.*/.test(location.hash)) {
    scanForLinks();
    setInterval(() => {
      scanForLinks();
    }, 1000);
  }
}

function scanForLinks() {
  const inboxLinks = document.querySelectorAll('.nH.if a');

  for (let i = 0; i < inboxLinks.length; i++) {
    inboxLinks[i].className = 'phishmenot-link-hook';
    inboxLinks[i].addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      let linkLocation;
      const { tagName, getAttribute, closest } = e.target;
      blurBackground();

      if (tagName !== 'A') {
        linkLocation = e.target.closest('A').getAttribute('href');
      } else {
        linkLocation = e.target.getAttribute('href');
      }
      showContainer(linkLocation, e);
    });
  }
}

window.addEventListener('hashchange', hashCheck);
hashCheck();
