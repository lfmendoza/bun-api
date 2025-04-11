/**
 * @fileoverview Componente de grupo de formulario
 * Agrupa un label, un input y mensajes de error/ayuda
 */

/**
 * Componente Form Group - Componente molecular
 * @element form-group
 *
 * @attr {string} label - Etiqueta del grupo
 * @attr {string} for-id - ID del elemento al que se asocia el label
 * @attr {boolean} required - Si el campo es obligatorio
 *
 * @slot - Contenido del form-group (input, select, etc.)
 * @slot help - Contenido del mensaje de ayuda
 * @slot error - Contenido del mensaje de error
 */
class FormGroupComponent extends HTMLElement {
  // Definir propiedades observadas para atributos
  static get observedAttributes() {
    return ["label", "for-id", "required", "error"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    // Opciones por defecto
    this._label = "";
    this._forId = "";
    this._required = false;
    this._error = "";

    // Inicializar
    this._render();
  }

  // Lifecycle: Cuando un atributo observado cambia
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    // Actualizar propiedades internas
    switch (name) {
      case "label":
        this._label = newValue || "";
        break;
      case "for-id":
        this._forId = newValue || "";
        break;
      case "required":
        this._required = newValue !== null;
        break;
      case "error":
        this._error = newValue || "";
        break;
    }

    // Re-renderizar o actualizar partes específicas
    this._updateComponent();
  }

  // Getters y setters para atributos
  get label() {
    return this._label;
  }

  set label(value) {
    this.setAttribute("label", value);
  }

  get forId() {
    return this._forId;
  }

  set forId(value) {
    this.setAttribute("for-id", value);
  }

  get required() {
    return this._required;
  }

  set required(value) {
    if (value) {
      this.setAttribute("required", "");
    } else {
      this.removeAttribute("required");
    }
  }

  get error() {
    return this._error;
  }

  set error(value) {
    if (value) {
      this.setAttribute("error", value);
    } else {
      this.removeAttribute("error");
    }
  }

  /**
   * Actualiza el componente según sus propiedades
   * @private
   */
  _updateComponent() {
    const labelElement = this.shadowRoot.querySelector("label");
    const errorElement = this.shadowRoot.querySelector(".error-message");
    const container = this.shadowRoot.querySelector(".form-group");

    // Actualizar label
    if (labelElement) {
      labelElement.textContent = this._label + (this._required ? " *" : "");
      labelElement.setAttribute("for", this._forId);
      labelElement.hidden = !this._label;
    }

    // Actualizar mensaje de error
    if (errorElement) {
      errorElement.textContent = this._error;
      errorElement.hidden = !this._error;
    }

    // Actualizar clases para estado de error
    if (container) {
      if (this._error) {
        container.classList.add("has-error");
      } else {
        container.classList.remove("has-error");
      }
    }
  }

  /**
   * Renderiza el componente completo
   * @private
   */
  _render() {
    // CSS con variables y clases
    const styles = `
        :host {
          display: block;
          margin-bottom: 1rem;
          font-family: var(--font-family, system-ui, sans-serif);
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          width: 100%;
        }
        
        label {
          display: block;
          margin-bottom: 0.25rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--secondary-color, #475569);
        }
        
        .error-message {
          margin-top: 0.25rem;
          font-size: 0.75rem;
          color: var(--error-color, #ef4444);
        }
        
        .help-text {
          margin-top: 0.25rem;
          font-size: 0.75rem;
          color: #64748b;
        }
        
        .has-error .input-container ::slotted(*) {
          border-color: var(--error-color, #ef4444) !important;
        }
      `;

    // Template HTML
    this.shadowRoot.innerHTML = `
        <style>${styles}</style>
        <div class="form-group ${this._error ? "has-error" : ""}">
          <label for="${this._forId}" hidden="${!this._label}">
            ${this._label}${this._required ? " *" : ""}
          </label>
          
          <div class="input-container">
            <slot></slot>
          </div>
          
          <div class="error-message" hidden="${!this._error}">${
      this._error
    }</div>
          <div class="help-text">
            <slot name="help"></slot>
          </div>
        </div>
      `;
  }
}

// Registrar el componente
customElements.define("form-group", FormGroupComponent);

export default FormGroupComponent;
