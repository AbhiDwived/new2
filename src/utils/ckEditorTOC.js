// Custom TOC plugin for CKEditor
export function addTOCPlugin(editor) {
  editor.ui.componentFactory.add('insertTOC', locale => {
    const view = new editor.ui.ButtonView(locale);

    view.set({
      label: 'Insert Table of Contents',
      icon: '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 3h16v2H2V3zm0 4h10v2H2V7zm0 4h16v2H2v-2zm0 4h10v2H2v-2z"/></svg>',
      tooltip: true
    });

    view.on('execute', () => {
      const editorData = editor.getData();
      const parser = new DOMParser();
      const doc = parser.parseFromString(editorData, 'text/html');
      const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');

      if (headings.length === 0) {
        alert('No headings found. Please add some headings (H1-H6) to generate a table of contents.');
        return;
      }

      let tocHTML = '<div class="table-of-contents" style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 16px; margin: 16px 0;"><h3 style="margin: 0 0 12px 0; font-size: 18px; color: #495057;">📋 Table of Contents</h3><ul style="margin: 0; padding-left: 20px; list-style: none;">';

      headings.forEach((heading, index) => {
        const level = parseInt(heading.tagName.charAt(1));
        const text = heading.textContent.trim();
        const id = `heading-${index}`;
        
        if (!heading.id) {
          heading.id = id;
        }
        
        const indent = (level - 1) * 16;
        tocHTML += `<li style="margin: 4px 0; padding-left: ${indent}px;"><a href="#${heading.id}" style="color: #007bff; text-decoration: none; font-size: ${16 - level}px;">${text}</a></li>`;
      });

      tocHTML += '</ul></div>';

      editor.model.change(() => {
        const viewFragment = editor.data.processor.toView(tocHTML);
        const modelFragment = editor.data.toModel(viewFragment);
        editor.model.insertContent(modelFragment);
      });
    });

    return view;
  });
}