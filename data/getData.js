import { writeFileSync, readFileSync, existsSync } from 'fs';
import fs from "fs";
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'data', 'users.json'); // File path

export function storeUser(user) {
    writeFileSync(filePath, JSON.stringify(user, null, 2), 'utf8');
    console.log('User stored successfully!');
}

export function retrieveUsers() {
    if (existsSync(filePath)) {
        const data = readFileSync(filePath, 'utf8');
        return JSON.parse(data);
      } else {
        console.log('File does not exist.');
        return [];
      }
}

export function storeData(data) {

}

export function retrieveData() {
    
}