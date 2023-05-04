import { Scene } from 'three';
import { Group } from 'three/src/objects/Group';

export declare function prepareScene(domElement: HTMLElement, opts: object): Scene;
export declare function loadObject(scene: Scene, url: string, materialUrl?: string, callback?: (err: ErrorEvent) => void): Scene;
export declare function loadGlb(scene: Scene, url: string, callback?: (err: ErrorEvent) => void): Scene;
export declare function clearScene(scene: Scene): void;
export declare function resetCamera(scene: Scene): void;
export declare function showGrid(scene: Scene): void;
export declare function hideGrid(scene: Scene): void;
export declare function goFullScreen(element: HTMLElement): boolean;
export declare function enableCache(): void;
export declare function disableCache(): void; 
