import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface NpmPackageResponse {
  'dist-tags': {
    latest: string;
    alpha?: string;
  };
  versions: Record<string, any>;
}

async function syncVersion() {
  try {
    console.log('🔄 Syncing version from ps-lang npm package...');

    // Fetch version from core package (npm registry)
    const response = await fetch('https://registry.npmjs.org/ps-lang');

    if (!response.ok) {
      throw new Error(`NPM registry returned ${response.status}`);
    }

    const data: NpmPackageResponse = await response.json();

    // Get latest alpha version or fallback to latest stable
    const coreVersion = data['dist-tags'].alpha || data['dist-tags'].latest;

    console.log(`📦 Core ps-lang version: ${coreVersion}`);

    // Update local package.json
    const packagePath = join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'));

    const oldVersion = packageJson.version;
    packageJson.version = coreVersion;

    writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');

    console.log(`✅ Updated package.json: ${oldVersion} → ${coreVersion}`);

    // Update environment variable for runtime access
    const envPath = join(process.cwd(), '.env.local');
    let envContent = '';

    try {
      envContent = readFileSync(envPath, 'utf-8');
    } catch {
      console.log('📝 Creating .env.local file...');
    }

    // Update or add NEXT_PUBLIC_PS_LANG_VERSION
    if (envContent.includes('NEXT_PUBLIC_PS_LANG_VERSION')) {
      envContent = envContent.replace(
        /NEXT_PUBLIC_PS_LANG_VERSION=.*/,
        `NEXT_PUBLIC_PS_LANG_VERSION=${coreVersion}`
      );
    } else {
      envContent += `\nNEXT_PUBLIC_PS_LANG_VERSION=${coreVersion}\n`;
    }

    writeFileSync(envPath, envContent);

    console.log(`✅ Updated .env.local with version ${coreVersion}`);
    console.log('');
    console.log('🎉 Version sync complete!');

  } catch (error) {
    console.error('❌ Failed to sync version:', error);
    console.error('');
    console.error('💡 Tip: Check your internet connection and npm registry access.');
    process.exit(1);
  }
}

syncVersion();
