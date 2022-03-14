import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { Group } from 'three/src/objects/Group';

export declare function prepareScene(domElement: HTMLElement, opts: object): OBJLoader;
export declare function loadObject(scene: OBJLoader, url: string, materialUrl?: string, callback?: (err: ErrorEvent) => void): OBJLoader;
export declare function clearScene(scene: OBJLoader);
export declare function resetCamera(scene: OBJLoader);
export declare function showGrid(scene: OBJLoader);
export declare function hideGrid(scene: OBJLoader);
export declare function goFullScreen(element: HTMLElement): boolean;
export declare function enableCache();
export declare function disableCache();
