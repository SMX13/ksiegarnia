export const utils = {
  createDOMFromHTML: function(htmlString) {
    const div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
  },
};
