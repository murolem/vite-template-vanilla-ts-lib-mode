import { UserConfig, defineConfig } from 'vite';
import path from 'path';
import cleanupPlugin from 'rollup-plugin-cleanup';
import tsconfigPaths from 'vite-tsconfig-paths';
import fs from 'fs';
import Logger from '@aliser/logger';
const { logInfo, logError } = new Logger('vite-config');

export default defineConfig(({ mode }) => {
    logInfo('generating config for mode/build source path: ' + mode);

    /**
     * This is a base config that would be used for both regular build mode
     * and with the custom build script.
     */
    const baseConfig: UserConfig = {
        plugins: [
            tsconfigPaths(),
        ],
        build: {
            target: 'esnext',
            minify: false,
            emptyOutDir: false,
        }
    }

    if (['development', 'production', 'test'].includes(mode)) {
        // `mode` is used as a regular build mode.
        // this indicates that the build was likely started by using
        // regular build command like vite build, vite run, vite-node XXX, etc.
        // in that case, we do not interfere with the build paths since
        // we don't know them and let vite handle them.
        logInfo('regular build mode detected, returning the base config');

        return baseConfig;
    } else {
        // `mode` is used as a build source file path.
        // this indicates the custom build script,
        // so we generate the source and target paths and enable lib mode.

        logInfo('custom build mode detected, generating lib config...');

        const buildSourceRelFilepath = mode;
        if (!fs.existsSync(buildSourceRelFilepath))
            logError(`build source doesn't exist: ${buildSourceRelFilepath}`, { throwErr: true });

        const outputScriptFilename = path.parse(buildSourceRelFilepath).name + '.js';

        // add plugins
        if (!baseConfig.plugins) {
            baseConfig.plugins = [];
        }

        baseConfig.plugins.push(
            // remove comments
            cleanupPlugin({
                comments: ['none'],
                extensions: ['ts', 'js', 'jsx', 'mjs'],
            }),
        )

        // enable lib mode
        if (!baseConfig.build) {
            baseConfig.build = {}
        }
        baseConfig.build.lib = {
            entry: buildSourceRelFilepath,
            formats: ['es'],
            fileName: path.parse(outputScriptFilename).name,
        }

        // return the modified config
        return baseConfig;
    }
});