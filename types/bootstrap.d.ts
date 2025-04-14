declare module "bootstrap" {
  interface Modal {
    show(): void;
    hide(): void;
  }

  export const Modal: {
    new (element: Element | null): Modal;
    getInstance(element: Element | null): Modal | null;
  };
}
