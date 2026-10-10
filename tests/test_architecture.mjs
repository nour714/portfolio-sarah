import * as constants from '../js/core/constants.js';
import * as utils from '../js/core/utils.js';
import * as state from '../js/core/state.js';
import * as storage from '../js/services/storage.service.js';
import * as toast from '../js/services/toast.service.js';
import * as firebase from '../js/services/firebase.service.js';
import * as theme from '../js/modules/theme.js';
import * as navigation from '../js/modules/navigation.js';
import * as hero from '../js/modules/hero.js';
import * as constellation from '../js/modules/constellation.js';
import * as projects from '../js/modules/projects.js';
import * as animations from '../js/modules/animations.js';
import * as contact from '../js/modules/contact.js';
import * as intro from '../js/modules/intro.js';
import * as adminPreview from '../js/admin/admin-preview.js';
import * as adminDashboard from '../js/admin/admin-dashboard.js';

import * as data from '../js/data/portfolio-data.js';

console.log('✅ Constants loaded:', Object.keys(constants));
console.log('✅ Portfolio Data loaded:', Object.keys(data.portfolioData));
console.log('✅ Utils loaded:', Object.keys(utils));
console.log('✅ State loaded:', Object.keys(state));
console.log('✅ Storage loaded:', Object.keys(storage));
console.log('✅ Toast loaded:', Object.keys(toast));
console.log('✅ Firebase loaded:', Object.keys(firebase));
console.log('✅ Theme loaded:', Object.keys(theme));
console.log('✅ Navigation loaded:', Object.keys(navigation));
console.log('✅ Hero loaded:', Object.keys(hero));
console.log('✅ Constellation loaded:', Object.keys(constellation));
console.log('✅ Projects loaded:', Object.keys(projects));
console.log('✅ Animations loaded:', Object.keys(animations));
console.log('✅ Contact loaded:', Object.keys(contact));
console.log('✅ Intro loaded:', Object.keys(intro));
console.log('✅ Admin Preview loaded:', Object.keys(adminPreview));
console.log('✅ Admin Dashboard loaded:', Object.keys(adminDashboard));
console.log('\n🎉 ALL JS MODULES RESOLVED AND IMPORTED WITHOUT ERRORS!\n');

import fs from 'fs';
import path from 'path';

console.log('--- Checking Modular CSS Files ---');
const styleCss = fs.readFileSync('style.css', 'utf8');
const lines = styleCss.split(/\r?\n/).filter(l => l.includes('@import'));

let allCssValid = true;
for (const line of lines) {
    const match = line.match(/url\(["'](.+?)["']\)/);
    if (match) {
        const cssPath = match[1];
        if (fs.existsSync(cssPath)) {
            const stats = fs.statSync(cssPath);
            console.log(`✅ CSS Module: ${cssPath} (${stats.size} bytes)`);
        } else {
            console.error(`❌ Missing CSS Module: ${cssPath}`);
            allCssValid = false;
        }
    }
}

if (!allCssValid) {
    console.error('❌ Some CSS modules were missing!');
    process.exit(1);
}

console.log('\n🎉 ALL CSS MODULES EXIST AND ARE LINKED IN STYLE.CSS!');

