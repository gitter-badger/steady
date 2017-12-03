require('ts-node').register({
  compilerOptions: {
    module: 'commonjs',
    target: 'ESNext',
    noImplicitThis: false,
  },
});

require('tsconfig-paths').register();
