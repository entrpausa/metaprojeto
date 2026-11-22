import {LitElement,html} from 'lit';
import '../../packages/ui/console.mjs';
import '../../packages/tokens/tokens.css';
class AtelieShell extends LitElement{createRenderRoot(){return this;}render(){return html`<main><atelie-f3-migrator></atelie-f3-migrator></main>`;}}
customElements.define('atelie-f3-shell',AtelieShell);
