/// <reference types="node" />
declare module "yaml/index" {
    import yaml from "js-yaml";
    import type { Plugin } from "esbuild";
    export interface Options {
        loadOptions?: yaml.LoadOptions;
    }
    const yamlPlugin: ({ loadOptions }?: Options) => Plugin;
    export default yamlPlugin;
}
declare module "postcss/index" {
    import { AcceptedPlugin } from "postcss";
    import type { Plugin } from "esbuild";
    export interface Options {
        plugins?: AcceptedPlugin[];
    }
    const postCssPlugin: ({ plugins }?: Options) => Plugin;
    export default postCssPlugin;
}
declare module "livereload/client" {
    import type { Message } from "esbuild";
    export interface BuildMessage {
        success?: boolean;
        errors?: Message[];
    }
}
declare module "livereload/index" {
    import type { Plugin } from "esbuild";
    export interface Options {
        port?: number;
    }
    const liveReloadPlugin: ({ port }?: Options) => Plugin;
    export default liveReloadPlugin;
}
declare module "tslint/screen" {
    export const screen: {
        width: number;
        height: number;
        clear(): void;
        banner(ch?: string | undefined): string;
    };
    export function termStyle(w: NodeJS.WriteStream, hint?: boolean): {
        _hint: boolean | undefined;
        ncolors: number;
        reset: string;
        bold: (s: string) => string;
        italic: (s: string) => string;
        underline: (s: string) => string;
        inverse: (s: string) => string;
        white: (s: string) => string;
        grey: (s: string) => string;
        black: (s: string) => string;
        blue: (s: string) => string;
        cyan: (s: string) => string;
        green: (s: string) => string;
        magenta: (s: string) => string;
        purple: (s: string) => string;
        pink: (s: string) => string;
        red: (s: string) => string;
        yellow: (s: string) => string;
        lightyellow: (s: string) => string;
        orange: (s: string) => string;
    };
    export function createTermStyle(ncolors: number, hint?: boolean): {
        _hint: boolean | undefined;
        ncolors: number;
        reset: string;
        bold: (s: string) => string;
        italic: (s: string) => string;
        underline: (s: string) => string;
        inverse: (s: string) => string;
        white: (s: string) => string;
        grey: (s: string) => string;
        black: (s: string) => string;
        blue: (s: string) => string;
        cyan: (s: string) => string;
        green: (s: string) => string;
        magenta: (s: string) => string;
        purple: (s: string) => string;
        pink: (s: string) => string;
        red: (s: string) => string;
        yellow: (s: string) => string;
        lightyellow: (s: string) => string;
        orange: (s: string) => string;
    };
    export const stdoutStyle: {
        _hint: boolean | undefined;
        ncolors: number;
        reset: string;
        bold: (s: string) => string;
        italic: (s: string) => string;
        underline: (s: string) => string;
        inverse: (s: string) => string;
        white: (s: string) => string;
        grey: (s: string) => string;
        black: (s: string) => string;
        blue: (s: string) => string;
        cyan: (s: string) => string;
        green: (s: string) => string;
        magenta: (s: string) => string;
        purple: (s: string) => string;
        pink: (s: string) => string;
        red: (s: string) => string;
        yellow: (s: string) => string;
        lightyellow: (s: string) => string;
        orange: (s: string) => string;
    };
    export const stderrStyle: {
        _hint: boolean | undefined;
        ncolors: number;
        reset: string;
        bold: (s: string) => string;
        italic: (s: string) => string;
        underline: (s: string) => string;
        inverse: (s: string) => string;
        white: (s: string) => string;
        grey: (s: string) => string;
        black: (s: string) => string;
        blue: (s: string) => string;
        cyan: (s: string) => string;
        green: (s: string) => string;
        magenta: (s: string) => string;
        purple: (s: string) => string;
        pink: (s: string) => string;
        red: (s: string) => string;
        yellow: (s: string) => string;
        lightyellow: (s: string) => string;
        orange: (s: string) => string;
    };
}
declare module "tslint/index" {
    import type { Plugin } from "esbuild";
    export interface Options {
        cwd?: string;
    }
    const tslintPlugin: ({ cwd }?: Options) => Plugin;
    export default tslintPlugin;
}
declare module "index" {
    import yamlPlugin from "yaml/index";
    import postCssPlugin from "postcss/index";
    import liveReloadPlugin from "livereload/index";
    import tslintPlugin from "tslint/index";
    export { yamlPlugin, postCssPlugin, liveReloadPlugin, tslintPlugin };
    const _default: {
        yamlPlugin: ({ loadOptions }?: import("yaml").Options) => import("esbuild").Plugin;
        postCssPlugin: ({ plugins }?: import("postcss").Options) => import("esbuild").Plugin;
        liveReloadPlugin: ({ port }?: import("livereload").Options) => import("esbuild").Plugin;
        tslintPlugin: ({ cwd }?: import("tslint").Options) => import("esbuild").Plugin;
    };
    export default _default;
}
