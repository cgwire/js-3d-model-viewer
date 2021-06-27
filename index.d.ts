import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { Group } from 'three/src/objects/Group';

export declare function prepareScene(domElement: HTMLElement): OBJLoader;
export declare function loadObject(scene: OBJLoader, url: string, materialUrl?: string, callback?: (err: ErrorEvent) => void): OBJLoader;
export declare function clearScene(scene: OBJLoader);
export declare function resetCamera(scene: OBJLoader);
export declare function goFullScreen(element: HTMLElement): boolean;