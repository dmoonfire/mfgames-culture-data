declare module "fs-walk" {
    export function walk(directory: string, callback: (basedir: string, filename: string, stat: any, next: any) => void): void;
    export function walkSync(directory: string, callback: (basedir: string, filename: string, stat: any) => void): void;
    export function files(directory: string, callback: (basedir: string, filename: string, stat: any, next: any) => void): void;
    export function filesSync(directory: string, callback: (basedir: string, filename: string, stat: any) => void): void;
    export function dirs(directory: string, callback: (basedir: string, filename: string, stat: any, next: any) => void): void;
    export function dirsSync(directory: string, callback: (basedir: string, filename: string, stat: any) => void): void;
}
