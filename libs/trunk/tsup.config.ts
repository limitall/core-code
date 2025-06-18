import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    dts: true,
    format: ['esm', 'cjs'],
    target: 'es2024',
    sourcemap: false,
    clean: true,
    minify: true,
    outDir: 'dist',
    tsconfig: './tsconfig.build.json',
    external: [
        'kafkajs',
        'ioredis',
        'amqplib',
        'amqp-connection-manager',
        'mqtt',
        'nats',
        '@nestjs/websockets/socket-module',
        'mock-aws-s3',
        'aws-sdk',
        'nock',
        '@nestjs/platform-express',
        '@mapbox/node-pre-gyp',
        '@mapbox/node-pre-gyp/*',
        'node-pre-gyp',
        'node-pre-gyp/*',
        'node-gyp',
        'node-gyp/*',
        'pulsar-client'
    ]  // avoid bundling external deps
});
