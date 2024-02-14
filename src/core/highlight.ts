import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import yaml from 'highlight.js/lib/languages/yaml';
import 'highlight.js/styles/atom-one-dark.css';

hljs.registerLanguage('bash', bash);
hljs.registerLanguage('yaml', yaml);

export default {
  install(app: any) {
    app.mixin({
      mounted() {
        this.highlightCode();
      },
      updated() {
        this.highlightCode();
      },
      methods: {
        highlightCode() {
          requestAnimationFrame(() => {
            document.querySelectorAll('.language-yaml, .language-bash, pre code').forEach((block) => {
              hljs.highlightElement(block as HTMLElement);
            });
          });
        }
      }
    });
  }
};
