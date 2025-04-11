/**
 * @fileoverview Store centralizado para gestión de estado de la aplicación
 * Implementa un patrón similar a Redux pero más ligero
 */

import { actions } from "./actions.js";
import { createReducer } from "./reducers.js";

const IS_DEVELOPMENT =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

// Estado inicial de la aplicación
const initialState = {
  // Estado de carga global
  loading: false,
  // Datos de incidentes
  incidents: [],
  // Incidente actualmente seleccionado/detalle
  currentIncident: null,
  // Cola de notificaciones
  notifications: [],
  // Información de errores
  error: null,
  // Estado de la UI
  ui: {
    darkMode: localStorage.getItem("darkMode") === "true",
    menuOpen: false,
    filterStatus: "all",
  },
  // Historial de acciones para depuración
  _actionLog: [],
};

/**
 * Clase Store - Implementa patrón observable para gestión de estado
 */
class Store {
  constructor(reducer, initialState) {
    this.reducer = reducer;
    this.state = initialState;
    this.subscribers = new Set();
    this.middlewares = [];
    this.actionCounter = 0;

    // Para depuración y desarrollo
    if (IS_DEVELOPMENT) {
      this._exposeToWindow();
    }
  }

  /**
   * Expone el store para debugging en development
   * @private
   */
  _exposeToWindow() {
    window.__store = {
      getState: () => this.state,
      dispatch: this.dispatch.bind(this),
      subscribe: this.subscribe.bind(this),
      unsubscribe: this.unsubscribe.bind(this),
    };
  }

  /**
   * Obtiene el estado actual
   * @returns {Object} Estado actual
   */
  getState() {
    return this.state;
  }

  /**
   * Despacha una acción al store
   * @param {Object} action - Acción a despachar
   * @returns {Object} La acción despachada
   */
  dispatch = (action) => {
    if (typeof action !== "object" || !action.type) {
      console.error(
        'Las acciones deben ser objetos con una propiedad "type":',
        action
      );
      return action; // Devolver la acción tal cual para no interrumpir el flujo
    }

    try {
      // Agregar metadatos a la acción
      const enhancedAction = {
        ...action,
        _id: ++this.actionCounter,
        _timestamp: Date.now(),
      };

      // Ejecutar middlewares con mejor manejo de errores
      const middlewarePromises = this.middlewares.map((middleware) => {
        try {
          const result = middleware(this)(enhancedAction);
          // Asegurar que siempre devolvemos una promesa
          return result instanceof Promise ? result : Promise.resolve();
        } catch (error) {
          console.error("Error ejecutando middleware:", error);
          return Promise.resolve(); // No interrumpir la cadena de promesas
        }
      });

      // Procesar la acción una vez que todos los middlewares hayan terminado
      Promise.all(middlewarePromises)
        .then(() => {
          try {
            // Calcular nuevo estado aplicando el reducer
            const nextState = this.reducer(this.state, enhancedAction);

            // Guardar acción en el log si está habilitado
            if (window.location.hostname === "localhost") {
              const actionLogs = this.state._actionLog || [];
              nextState._actionLog = [
                ...actionLogs.slice(-19), // Mantener solo las últimas 20 acciones
                {
                  type: enhancedAction.type,
                  payload: enhancedAction.payload,
                  timestamp: enhancedAction._timestamp,
                },
              ];
            }

            // Actualizar estado
            this.state = nextState;

            // Notificar a los suscriptores
            this.notifySubscribers();
          } catch (error) {
            console.error("Error al procesar acción:", error);
          }
        })
        .catch((error) => {
          console.error("Error en procesamiento de middlewares:", error);
        });

      return enhancedAction;
    } catch (error) {
      console.error("Error general en dispatch:", error);
      return action;
    }
  };

  /**
   * Registra un middleware
   * @param {Function} middleware - Función middleware
   */
  applyMiddleware(middleware) {
    this.middlewares.push(middleware);
  }

  /**
   * Registra un suscriptor para recibir actualizaciones de estado
   * @param {Function} subscriber - Función a ejecutar cuando el estado cambie
   * @returns {Function} Función para cancelar la suscripción
   */
  subscribe(subscriber) {
    if (typeof subscriber !== "function") {
      throw new Error("El suscriptor debe ser una función");
    }

    this.subscribers.add(subscriber);

    // Devolver función para cancelar suscripción
    return () => {
      this.unsubscribe(subscriber);
    };
  }

  /**
   * Cancela la suscripción de un suscriptor
   * @param {Function} subscriber - Suscriptor a eliminar
   */
  unsubscribe(subscriber) {
    this.subscribers.delete(subscriber);
  }

  /**
   * Notifica a todos los suscriptores sobre cambios en el estado
   * @private
   */
  notifySubscribers() {
    for (const subscriber of this.subscribers) {
      try {
        subscriber(this.state);
      } catch (error) {
        console.error("Error en suscriptor del store:", error);
      }
    }
  }

  /**
   * Restablece el estado a su valor inicial
   */
  reset() {
    this.state = initialState;
    this.notifySubscribers();
  }
}

// Crear una instancia del reducer
const reducer = createReducer();

// Crear instancia del store
const store = new Store(reducer, initialState);

// Logger middleware para desarrollo
if (IS_DEVELOPMENT) {
  store.applyMiddleware((store) => (action) => {
    // Verificar que action tenga una estructura válida antes de acceder a sus propiedades
    if (!action || typeof action !== "object") {
      console.warn("Acción inválida recibida en middleware:", action);
      return Promise.resolve(); // Devolver una promesa resuelta para continuar la cadena
    }

    const actionType = action.type || "UNKNOWN_ACTION";

    console.group(
      `%c Acción: ${actionType}`,
      "color: #3b82f6; font-weight: bold;"
    );
    console.log("%c Acción:", "color: #64748b;", action);
    console.log("%c Estado anterior:", "color: #64748b;", store.getState());

    // Middleware asíncrono - devolvemos una promesa
    return Promise.resolve().then(() => {
      try {
        console.log(
          "%c Estado siguiente:",
          "color: #64748b;",
          store.getState()
        );
        console.groupEnd();
      } catch (error) {
        console.error("Error en middleware logger:", error);
        console.groupEnd();
      }
    });
  });
}

// Middleware para persistencia selectiva en localStorage
store.applyMiddleware((store) => (action) => {
  // Ejecutar después de que se actualice el estado
  return Promise.resolve().then(() => {
    const state = store.getState();

    // Persistir preferencias de UI
    if (action.type === actions.setDarkMode.type) {
      localStorage.setItem("darkMode", state.ui.darkMode);
    }
  });
});

/**
 * Inicializa el store y carga datos iniciales si es necesario
 * @returns {Promise<void>}
 */
export function initStore() {
  return Promise.resolve();
}

// Exportar store y acciones
export { store, actions };
