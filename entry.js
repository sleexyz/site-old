require.context( "./_site", true, /\.(html|css)$/);

// declarations:

function makeDraftsShowable() {
  const getParameterByName = (name) => {
    const match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
  };

  if (getParameterByName("showDrafts") === "true") {
    const sheet = window.document.styleSheets[0];
    const row = `
.post-row.draft {
  display: flex;
  filter: blur(1px);

}`;
    sheet.insertRule(row, sheet.cssRules.length);
  }
}

// main:

makeDraftsShowable();
