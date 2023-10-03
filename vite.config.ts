import { defineConfig } from 'vite';
import path from 'path';
import cleanupPlugin from 'rollup-plugin-cleanup';
import tsconfigPaths from 'vite-tsconfig-paths';
import fs from 'fs';
import Logger from '@aliser/logger';
const { logInfo, logError } = new Logger('vite-config');

export default defineConfig(({ mode }) => {
    const isConfigUnspecified = ['development', 'production'].includes(mode);
    if (isConfigUnspecified) {
        return {};
    }

    const pathToSourceFile = mode;
    const sourceFileExists = fs.existsSync(pathToSourceFile);
    if (!sourceFileExists)
        logError(`source file does not exists on path '${pathToSourceFile}'`, { throwErr: true });

    const inputFilePathParsed = path.parse(pathToSourceFile);
    const outputFilenameWithoutExtension = inputFilePathParsed.name;
    const outputFilenameFull = `${outputFilenameWithoutExtension}.js`;
    // const outputFilePath = path.join('./dist', outputFilenameFull);

    return {
        plugins: [
            tsconfigPaths(),
            // {
            //     name: 'vite-plugin-append-text',
            //     generateBundle(options, bundle) {
            //         const output = bundle[outputFilenameFull];
            //         if (!output)
            //             throw new Error(`'${outputFilenameFull}' output file not found by 'vite-plugin-append-text'`);
            //         else if (output.type !== 'chunk')
            //             throw new Error(`'${output.type}' output tipe is not supported by 'vite-plugin-append-text'`);

            //         output.code = 'javascript: void async function() {\n'
            //             + output.code
            //             + '\n}();';
            //     }
            // },
            // cleanupPlugin({
            //     comments: ['none'],
            //     extensions: ['ts', 'js', 'jsx', 'mjs'],
            // }),
        ],
        build: {
            minify: false,
            emptyOutDir: false,
            lib: {
                entry: pathToSourceFile,
                formats: ['es'],
                fileName: outputFilenameWithoutExtension,
            }
        },
        rollupOptions: {
            // external: [ // external node modules
            //     'assert',          'assert/strict',       'async_hooks',
            //     'buffer',          'child_process',       'cluster',
            //     'console',         'constants',           'crypto',
            //     'dgram',           'diagnostics_channel', 'dns',
            //     'dns/promises',    'domain',              'events',
            //     'fs',              'fs/promises',         'http',
            //     'http2',           'https',               'inspector',
            //     'module',          'net',                 'os',
            //     'path',            'path/posix',          'path/win32',
            //     'perf_hooks',      'process',             'punycode',
            //     'querystring',     'readline',            'readline/promises',
            //     'repl',            'stream',              'stream/consumers',
            //     'stream/promises', 'stream/web',          'string_decoder',
            //     'sys',             'timers',              'timers/promises',
            //     'tls',             'trace_events',        'tty',
            //     'url',             'util',                'util/types',
            //     'v8',              'vm',                  'worker_threads',
            //     'zlib',
            //     'fs-extra', 'vite', 'chokidar', 'commander', 'rollup', 'fsevents'
            // ]
        }
    }
});