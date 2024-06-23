declare module "three/addons/libs/lil-gui.module.min.js" {
  export class GUI {
    constructor(options?: GUIOptions);
    add(target: object, propName: string, min?: number, max?: number, step?: number): GUIController;
    add(target: object, propName: string, min?: number, max?: number): GUIController;
    add(target: object, propName: string, items: string[]): GUIController;
    add(target: object, propName: string, items: number[]): GUIController;
    add(target: object, propName: string, items: object): GUIController;
    addColor(target: object, propName: string): GUIController;
    remove(controller: GUIController): void;
    destroy(): void;
    addFolder(name: string): GUI;
    open(): void;
    close(): void;
    onChange(callback: (value: any) => void): GUI;
  }

  export interface GUIOptions {
    autoPlace?: boolean;
    width?: number;
    hideable?: boolean;
    parent?: HTMLElement;
  }

  export class GUIController {
    onChange(callback: (value: any) => void): GUIController;
    onFinishChange(callback: (value: any) => void): GUIController;
    setValue(value: any): GUIController;
    getValue(): any;
    min(min: number): GUIController;
    max(max: number): GUIController;
    step(step: number): GUIController;
    listen(): GUIController;
    name(name: string): GUIController;
    remove(): void;
  }
}

