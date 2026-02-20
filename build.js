#!/usr/bin/env node

/**
 * Build script for Accessible Slick Carousel
 * Handles:
 * - SCSS compilation with Sass
 * - CSS autoprefixing and minification
 * - JavaScript bundling with esbuild (ESM, CommonJS, UMD)
 */

import * as fs from 'fs';
import * as path from 'path';
import * as sass from 'sass';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import { build } from 'esbuild';

const args = process.argv.slice(2);
const isWatch = args.includes('--watch');
const srcDir = './slick/src';
const distDir = './slick/dist';
const assetsDir = './slick/assets';

function ensureDistDir() {
  fs.mkdirSync(distDir, { recursive: true });
}

function copyAssets() {
  const fontsSrc = path.join(assetsDir, 'fonts');
  const fontsDest = path.join(distDir, 'fonts');
  const loaderSrc = path.join(assetsDir, 'ajax-loader.gif');
  const loaderDest = path.join(distDir, 'ajax-loader.gif');

  if (fs.existsSync(fontsSrc)) {
    fs.mkdirSync(fontsDest, { recursive: true });
    fs.cpSync(fontsSrc, fontsDest, { recursive: true });
    console.log(`  ✓ ${fontsDest}/`);
  }

  if (fs.existsSync(loaderSrc)) {
    fs.copyFileSync(loaderSrc, loaderDest);
    console.log(`  ✓ ${loaderDest}`);
  }
}

/**
 * Build CSS
 */
async function buildCSS() {
  console.log('📦 Building CSS...');

  const sassFiles = [
    { input: 'slick/slick.scss', output: path.join(distDir, 'slick.css'), minOutput: path.join(distDir, 'slick.min.css') },
    { input: 'slick/slick-theme.scss', output: path.join(distDir, 'slick-theme.css'), minOutput: path.join(distDir, 'slick-theme.min.css') },
    { input: 'slick/accessible-slick-theme.scss', output: path.join(distDir, 'accessible-slick-theme.css'), minOutput: path.join(distDir, 'accessible-slick-theme.min.css') }
  ];

  for (const file of sassFiles) {
    try {
      // Compile SCSS
      const result = sass.compile(file.input);
      let css = result.css.toString();

      // Add autoprefixer
      const processed = await postcss([autoprefixer({ overrideBrowserslist: ['last 2 versions'] })]).process(css, {
        from: file.input,
        to: file.output
      });
      css = processed.css;

      // Write unminified
      fs.writeFileSync(file.output, css, 'utf-8');
      console.log(`  ✓ ${file.output}`);

      // Minify
      const minified = await minifyCSS(css);
      fs.writeFileSync(file.minOutput, minified, 'utf-8');
      console.log(`  ✓ ${file.minOutput}`);
    } catch (err) {
      console.error(`  ✗ Error building ${file.input}:`, err.message);
    }
  }
}

/**
 * Minify CSS
 */
function minifyCSS(css) {
  return Promise.resolve(
    css
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/\{\s+/g, '{') // Remove spaces after {
      .replace(/\}\s+/g, '}') // Remove spaces after }
      .replace(/:\s+/g, ':') // Remove spaces after :
      .replace(/,\s+/g, ',') // Remove spaces after ,
      .replace(/\s+;/g, ';') // Remove spaces before ;
      .trim()
  );
}

/**
 * Build JavaScript with esbuild
 */
async function buildJS() {
  console.log('📦 Building JavaScript...');

  const options = {
    entryPoints: ['slick/src/index.js'],
    logLevel: 'warning'
  };

  try {
    // ESM version
    const esmOutput = path.join(distDir, 'slick.esm.mjs');
    await build({
      ...options,
      outfile: esmOutput,
      format: 'esm',
      bundle: true,
      minify: false
    });
    console.log(`  ✓ ${esmOutput}`);

    // CommonJS version (legacy)
    const cjsOutput = path.join(distDir, 'slick.cjs');
    await build({
      ...options,
      outfile: cjsOutput,
      format: 'cjs',
      bundle: true,
      minify: false
    });
    console.log(`  ✓ ${cjsOutput}`);

    // IIFE version for direct script inclusion (self-executing)
    const iifeOutput = path.join(distDir, 'slick.js');
    await build({
      ...options,
      outfile: iifeOutput,
      format: 'iife',
      bundle: true,
      minify: false,
      globalName: 'slickModule'
    });
    console.log(`  ✓ ${iifeOutput}`);

    // Minified IIFE version
    const iifeMinOutput = path.join(distDir, 'slick.min.js');
    await build({
      ...options,
      outfile: iifeMinOutput,
      format: 'iife',
      bundle: true,
      minify: true,
      globalName: 'slickModule'
    });
    console.log(`  ✓ ${iifeMinOutput}`);
  } catch (err) {
    console.error('  ✗ Error building JavaScript:', err.message);
  }
}

/**
 * Watch for file changes
 */
function startWatch() {
  console.log('👀 Watching for changes...\n');

  const extensions = ['.scss', '.js'];
  const srcPaths = ['slick/slick.scss', 'slick/slick-theme.scss', 'slick/accessible-slick-theme.scss', 'slick/src'];

  const watcher = fs.watch(srcPaths, { recursive: true }, async (eventType, filename) => {
    if (!filename || !extensions.some(ext => filename.endsWith(ext))) return;

    console.log(`\n🔄 Changes detected in ${filename}`);

    if (filename.endsWith('.scss')) {
      await buildCSS();
    } else if (filename.endsWith('.js')) {
      await buildJS();
    }
  });

  return watcher;
}

/**
 * Main build function
 */
async function main() {
  console.log('🚀 Accessible Slick Carousel Builder\n');

  try {
    ensureDistDir();
    copyAssets();
    await buildCSS();
    await buildJS();
    console.log('\n✅ Build complete!\n');

    if (isWatch) {
      startWatch();
    }
  } catch (err) {
    console.error('Build failed:', err);
    process.exit(1);
  }
}

main();
